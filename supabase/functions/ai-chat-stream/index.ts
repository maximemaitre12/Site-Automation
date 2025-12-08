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
    content: string; // base64 or text content
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

    // Fetch documents if userId is provided
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch all internal documents
      const { data: internalDocs } = await supabase
        .from('internal_docs')
        .select('title, content, doc_type')
        .eq('user_id', userId);

      // Fetch AETHER documents
      const { data: aetherDocs } = await supabase
        .from('aether_documents')
        .select('title, content, ai_summary, description')
        .eq('user_id', userId);

      const allDocs = [
        ...(internalDocs || []).map(d => ({ title: d.title, content: d.content || '' })),
        ...(aetherDocs || []).map(d => ({ title: d.title, content: d.content || d.ai_summary || d.description || '' }))
      ];

      if (allDocs.length > 0) {
        // Get the last user message for relevance scoring
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        const msgContent = typeof lastUserMessage?.content === 'string' 
          ? lastUserMessage.content 
          : (lastUserMessage?.content as any[])?.find(c => c.type === 'text')?.text || '';
        const queryWords = msgContent.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);

        // Score and sort documents
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

        // Include top relevant docs + some general docs
        const relevantDocs = scoredDocs.filter(d => d.score > 0).slice(0, 8);
        const generalDocs = scoredDocs.filter(d => d.score === 0).slice(0, 4);
        const selectedDocs = [...relevantDocs, ...generalDocs].slice(0, 10);

        if (selectedDocs.length > 0) {
          documentContext = `\n\n=== BASE DE CONNAISSANCES INTERNE ===\nVoici les documents internes de l'entreprise à utiliser pour répondre:\n`;
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
      attachmentContext = '\n\n=== FICHIERS JOINTS ===\n';
      for (const att of attachments) {
        if (att.type === 'document') {
          attachmentContext += `\n[Document: ${att.name}]\n${att.content}\n`;
        }
      }
    }

    // Build enhanced system prompt
    const baseSystemPrompt = systemPrompt || `Tu es AETHER Brain, l'assistant IA interne d'une entreprise ultra-performant et polyvalent.`;

    const enhancedSystemPrompt = `${baseSystemPrompt}${documentContext}${attachmentContext}

CAPACITÉS:
- Analyser des images (photos, captures d'écran, graphiques, schémas)
- Analyser tous types de documents (PDF, Word, texte)
- Rechercher dans la base de connaissances interne
- Fournir des informations à jour grâce à tes connaissances générales

INSTRUCTIONS:
- Utilise EN PRIORITÉ les documents internes quand pertinents
- Si tu cites un document, mentionne son titre
- Si la question concerne des faits, actualités ou réglementations que tes connaissances permettent de couvrir, fournis l'information
- Pour les images: décris, analyse, extrait le texte si pertinent
- Pour les documents: analyse, résume, réponds aux questions
- Réponds en français, de manière professionnelle, claire et concise`;

    console.log(`Processing request: ${messages.length} messages, attachments: ${attachments?.length || 0}, docs context: ${documentContext.length > 0}`);

    // Prepare messages with image support
    const preparedMessages = messages.map((msg, idx) => {
      // If this is the last user message and we have image attachments
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

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-chat-stream function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
