import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  userId?: string;
  enableWebSearch?: boolean;
  enableDocumentSearch?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, userId, enableWebSearch = false, enableDocumentSearch = true } = await req.json() as ChatRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    let documentContext = '';

    // Fetch documents if userId is provided
    if (userId && enableDocumentSearch) {
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
        const queryWords = (lastUserMessage?.content || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // Score and sort documents
        const scoredDocs = allDocs.map(doc => {
          let score = 0;
          const titleLower = doc.title.toLowerCase();
          const contentLower = doc.content.toLowerCase();
          
          queryWords.forEach(word => {
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
          selectedDocs.forEach((doc, i) => {
            const excerpt = doc.content.slice(0, 1200);
            documentContext += `\n[${doc.title}]\n${excerpt}${doc.content.length > 1200 ? '...' : ''}\n`;
          });
        }
      }
    }

    // Build enhanced system prompt
    const baseSystemPrompt = systemPrompt || `Tu es AETHER Brain, l'assistant IA interne d'une entreprise. Tu aides les utilisateurs à:
- Répondre à leurs questions en utilisant la base de connaissances interne
- Rédiger des procédures et de la documentation
- Améliorer et reformuler des textes
- Analyser et synthétiser des informations
- Fournir des analyses basées sur les documents internes ET les connaissances générales`;

    const enhancedSystemPrompt = `${baseSystemPrompt}${documentContext}

INSTRUCTIONS IMPORTANTES:
- Utilise EN PRIORITÉ les informations des documents internes quand elles sont pertinentes
- Si tu cites un document interne, mentionne son titre
- Si la question nécessite des connaissances générales (actualités, réglementations, tendances), fournis-les également
- Réponds toujours en français de manière professionnelle, claire et concise`;

    console.log(`Processing streaming request with ${messages.length} messages, docs: ${documentContext.length > 0}`);

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
          ...messages,
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
