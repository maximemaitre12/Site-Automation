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

// Keywords that indicate a need for real-time web search
const REALTIME_KEYWORDS = [
  'météo', 'meteo', 'weather', 'température', 'temperature',
  'actualité', 'actualite', 'news', 'aujourd\'hui', "aujourd'hui",
  'cours', 'bourse', 'action', 'stock', 'bitcoin', 'crypto', 'prix',
  'score', 'match', 'résultat', 'resultat',
  'heure', 'date', 'maintenant', 'en ce moment',
  'dernier', 'dernière', 'récent', 'recent', 'nouveau', 'nouvelle',
  'tendance', 'trending', 'viral',
  'qui a gagné', 'qui a gagne', 'vainqueur',
  'combien coûte', 'combien coute', 'quel prix',
  'où est', 'ou est', 'adresse', 'horaire', 'ouvert',
  'événement', 'evenement', 'concert', 'festival',
  'élection', 'election', 'vote', 'politique',
  'covid', 'pandémie', 'pandemie', 'virus',
  'tremblement', 'séisme', 'ouragan', 'tempête',
  'accident', 'catastrophe', 'breaking',
  'trafic', 'embouteillage', 'grève', 'greve',
  'direct', 'live', 'streaming'
];

function needsRealtimeSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return REALTIME_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

async function searchPerplexity(query: string): Promise<{ content: string; citations: string[] } | null> {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    console.log('Perplexity API key not configured, skipping real-time search');
    return null;
  }

  try {
    console.log('Performing Perplexity real-time search for:', query);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant de recherche. Fournis des informations précises, à jour et factuelles. Réponds en français de manière concise.' 
          },
          { role: 'user', content: query }
        ],
        max_tokens: 1024,
        temperature: 0.1,
        search_recency_filter: 'day',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      citations: data.citations || []
    };
  } catch (error) {
    console.error('Error calling Perplexity:', error);
    return null;
  }
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
    let realtimeContext = '';

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const msgContent = typeof lastUserMessage?.content === 'string' 
      ? lastUserMessage.content 
      : (lastUserMessage?.content as any[])?.find(c => c.type === 'text')?.text || '';

    // Check if we need real-time data
    if (needsRealtimeSearch(msgContent)) {
      console.log('Real-time search triggered for:', msgContent);
      const searchResult = await searchPerplexity(msgContent);
      
      if (searchResult && searchResult.content) {
        realtimeContext = `\n\n=== DONNÉES EN TEMPS RÉEL (Recherche Web) ===\n${searchResult.content}`;
        if (searchResult.citations.length > 0) {
          realtimeContext += `\n\nSources: ${searchResult.citations.slice(0, 3).join(', ')}`;
        }
        realtimeContext += '\n=== FIN DES DONNÉES EN TEMPS RÉEL ===\n';
      }
    }

    // Fetch documents if userId is provided
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

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

    const enhancedSystemPrompt = `${baseSystemPrompt}${realtimeContext}${documentContext}${attachmentContext}

CAPACITÉS:
- Accéder aux informations en temps réel via recherche web (météo, actualités, cours de bourse, etc.)
- Analyser des images (photos, captures d'écran, graphiques, schémas)
- Analyser tous types de documents (PDF, Word, texte)
- Rechercher dans la base de connaissances interne

INSTRUCTIONS:
- Si des DONNÉES EN TEMPS RÉEL sont fournies, utilise-les pour répondre avec des informations à jour
- Utilise EN PRIORITÉ les documents internes quand pertinents
- Si tu cites un document, mentionne son titre
- Si tu utilises des données en temps réel, tu peux mentionner les sources
- Pour les images: décris, analyse, extrait le texte si pertinent
- Pour les documents: analyse, résume, réponds aux questions
- Réponds en français, de manière professionnelle, claire et concise
- Ne dis JAMAIS que tu n'as pas accès à internet ou aux données en temps réel`;

    console.log(`Processing request: ${messages.length} messages, attachments: ${attachments?.length || 0}, docs: ${documentContext.length > 0}, realtime: ${realtimeContext.length > 0}`);

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
    console.error('Error in ai-chat-stream function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
