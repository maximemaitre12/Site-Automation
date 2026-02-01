import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: string; content: string | any[] }>;
  systemPrompt?: string;
  userId?: string;
  attachments?: Array<{
    type: 'image' | 'document';
    content: string;
    name: string;
    mimeType?: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, userId, attachments } = await req.json() as ChatRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    let documentContext = '';

    // In confidential mode, we ONLY use internal documents - NO external API calls
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Log the confidential mode access
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'CONFIDENTIAL_AI_ACCESS',
        resource_type: 'ai_chat',
        metadata: {
          message_count: messages.length,
          has_attachments: (attachments?.length || 0) > 0,
          timestamp: new Date().toISOString(),
        }
      });

      const { data: internalDocs } = await supabase
        .from('internal_docs')
        .select('title, content, doc_type')
        .eq('user_id', userId);

      const { data: aetherDocs } = await supabase
        .from('aether_documents')
        .select('title, content, ai_summary, description')
        .eq('user_id', userId);

      const allDocs = [
        ...(internalDocs || []).map(d => ({ title: d.title, content: d.content || '' })),
        ...(aetherDocs || []).map(d => ({ title: d.title, content: d.content || d.ai_summary || d.description || '' }))
      ];

      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const msgContent = typeof lastUserMessage?.content === 'string' 
        ? lastUserMessage.content 
        : (lastUserMessage?.content as any[])?.find(c => c.type === 'text')?.text || '';

      if (allDocs.length > 0) {
        const queryWords = msgContent.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);

        const scoredDocs = allDocs.map(doc => {
          let score = 0;
          const titleLower = doc.title.toLowerCase();
          const contentLower = doc.content.toLowerCase();
          
          queryWords.forEach((word: string) => {
            if (titleLower.includes(word)) score += 5;
            if (contentLower.includes(word)) score += 1;
          });
          
          return { ...doc, score };
        }).sort((a, b) => b.score - a.score);

        const relevantDocs = scoredDocs.filter(d => d.score > 0).slice(0, 8);
        const generalDocs = scoredDocs.filter(d => d.score === 0).slice(0, 4);
        const selectedDocs = [...relevantDocs, ...generalDocs].slice(0, 10);

        if (selectedDocs.length > 0) {
          documentContext = `\n\n=== BASE DE CONNAISSANCES CONFIDENTIELLE ===\nCes documents sont 100% internes et privés:\n`;
          selectedDocs.forEach((doc) => {
            const excerpt = doc.content.slice(0, 1200);
            documentContext += `\n[${doc.title}]\n${excerpt}${doc.content.length > 1200 ? '...' : ''}\n`;
          });
        }
      }
    }

    // Add attachment context
    let attachmentContext = '';
    if (attachments && attachments.length > 0) {
      attachmentContext = '\n\n=== FICHIERS JOINTS (CONFIDENTIELS) ===\n';
      for (const att of attachments) {
        if (att.type === 'document') {
          attachmentContext += `\n[Document: ${att.name}]\n${att.content}\n`;
        }
      }
    }

    // Build confidential system prompt - NO EXTERNAL DATA
    const baseSystemPrompt = systemPrompt || `Tu es AETHER Brain en MODE CONFIDENTIEL.`;

    const enhancedSystemPrompt = `${baseSystemPrompt}${documentContext}${attachmentContext}

🔒 MODE CONFIDENTIEL ACTIVÉ 🔒

Tu opères en mode 100% confidentiel pour un cabinet d'avocats ou une organisation traitant des données ultra-sensibles.

RÈGLES DE SÉCURITÉ STRICTES:
1. Tu n'as PAS accès à Internet ni à des sources externes
2. Tu utilises UNIQUEMENT les documents internes fournis ci-dessus
3. Tu ne fais JAMAIS de recherche web ou de données en temps réel
4. Tu ne stockes RIEN de cette conversation au-delà de la session
5. Si on te demande des informations externes (météo, actualités, etc.), réponds poliment que le mode confidentiel ne permet pas d'accéder à des données externes

CAPACITÉS EN MODE CONFIDENTIEL:
- Analyser les documents internes fournis
- Répondre aux questions basées sur la base de connaissances interne
- Analyser des images et documents joints
- Rédiger, résumer, reformuler du contenu

RÉPONSES:
- Précise clairement quand une information vient de tes documents internes
- Si l'information n'est pas dans les documents, dis-le honnêtement
- Réponds en français, de manière professionnelle et concise
- Jamais de markdown (*, #, -, etc.)`;

    console.log(`[CONFIDENTIAL MODE] Processing request: ${messages.length} messages, docs: ${documentContext.length > 0}`);

    // Prepare messages with image support
    const preparedMessages = messages.map((msg, idx) => {
      if (msg.role === 'user' && idx === messages.length - 1 && attachments?.some(a => a.type === 'image')) {
        const imageAttachments = attachments.filter(a => a.type === 'image');
        const textContent = typeof msg.content === 'string' ? msg.content : 
          (msg.content as any[])?.find(c => c.type === 'text')?.text || '';
        
        const content: any[] = [
          { type: 'text', text: textContent }
        ];
        
        for (const img of imageAttachments) {
          content.push({
            type: 'image_url',
            image_url: {
              url: img.content.startsWith('data:') ? img.content : `data:${img.mimeType || 'image/jpeg'};base64,${img.content}`
            }
          });
        }
        
        return { role: msg.role, content };
      }
      return msg;
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...preparedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-chat-confidential function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
