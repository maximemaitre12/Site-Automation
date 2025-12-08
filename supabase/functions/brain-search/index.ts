import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  userId: string;
  includeWeb?: boolean;
  includeDocuments?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId, includeWeb = true, includeDocuments = true } = await req.json() as SearchRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Brain search for user ${userId}: "${query}"`);

    let documentContext = '';
    let webContext = '';

    // Fetch all internal documents for the user
    if (includeDocuments) {
      const { data: internalDocs } = await supabase
        .from('internal_docs')
        .select('title, content, doc_type, tags')
        .eq('user_id', userId);

      const { data: aetherDocs } = await supabase
        .from('aether_documents')
        .select('title, content, ai_summary, ai_keywords, description')
        .eq('user_id', userId);

      if (internalDocs?.length || aetherDocs?.length) {
        const allDocs = [
          ...(internalDocs || []).map(d => ({
            title: d.title,
            content: d.content || '',
            type: d.doc_type || 'internal',
            tags: d.tags
          })),
          ...(aetherDocs || []).map(d => ({
            title: d.title,
            content: d.content || d.ai_summary || d.description || '',
            type: 'aether',
            keywords: d.ai_keywords
          }))
        ];

        // Score documents by relevance to query
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        const scoredDocs = allDocs.map(doc => {
          let score = 0;
          const titleLower = doc.title.toLowerCase();
          const contentLower = (doc.content || '').toLowerCase();

          // Title match scores higher
          if (titleLower.includes(queryLower)) score += 10;
          queryWords.forEach(word => {
            if (titleLower.includes(word)) score += 5;
            if (contentLower.includes(word)) score += 1;
          });

          return { ...doc, score };
        }).filter(d => d.score > 0).sort((a, b) => b.score - a.score);

        if (scoredDocs.length > 0) {
          documentContext = `\n\n=== DOCUMENTS INTERNES PERTINENTS ===\n`;
          scoredDocs.slice(0, 10).forEach((doc, i) => {
            const excerpt = doc.content.slice(0, 1500);
            documentContext += `\n[Document ${i + 1}: ${doc.title}]\n${excerpt}${doc.content.length > 1500 ? '...' : ''}\n`;
          });
        }
      }
    }

    // Web search using AI
    if (includeWeb) {
      console.log('Performing web search analysis...');
      
      const webSearchResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `Tu es un assistant de recherche. Fournis des informations actuelles et factuelles sur le sujet demandé.
Utilise tes connaissances pour fournir:
- Les dernières tendances et informations
- Les meilleures pratiques du secteur
- Les réglementations applicables
- Les statistiques et données récentes
Réponds de manière structurée et factuelle.`
            },
            {
              role: 'user',
              content: `Recherche et analyse en ligne sur: ${query}

Fournis les informations les plus récentes et pertinentes sur ce sujet, incluant:
1. Contexte et définitions
2. Tendances actuelles
3. Meilleures pratiques
4. Réglementations applicables
5. Ressources et références`
            }
          ],
          max_tokens: 2000,
        }),
      });

      if (webSearchResponse.ok) {
        const webData = await webSearchResponse.json();
        const webResult = webData.choices?.[0]?.message?.content;
        if (webResult) {
          webContext = `\n\n=== ANALYSE EN LIGNE ===\n${webResult}`;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentContext,
        webContext,
        hasDocuments: documentContext.length > 0,
        hasWebResults: webContext.length > 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in brain-search function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
