import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Source credibility levels
const SOURCE_CREDIBILITY = {
  tier1: ['financial times', 'ft.com', 'economist', 'wsj', 'wall street journal', 'bloomberg', 'reuters', 'les echos', 'lesechos'],
  tier2: ['bce', 'ecb', 'fed', 'imf', 'fmi', 'oecd', 'ocde', 'europa.eu', 'gov.', 'gouv.'],
  tier3: ['arxiv', 'nature.com', 'science.org', 'harvard', 'mit', 'stanford', 'insead', 'hec']
};

interface IntelligenceRequest {
  query: string;
  sector?: string;
  companyContext?: string;
  analysisType: 'signal' | 'briefing' | 'exploration' | 'scenario';
  internalMetrics?: Record<string, any>;
}

interface StrategicSignal {
  id: string;
  title: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  type: 'threat' | 'opportunity' | 'trend' | 'regulatory' | 'competitive';
  timeHorizon: '3m' | '12m' | '5y';
  isStructural: boolean;
  sources: Array<{ name: string; tier: number; url?: string }>;
  strategicReading: string;
  implications: string[];
  recommendations: string[];
  correlationWithInternal?: string;
  confidence: number;
}

function getSourceTier(url: string): number {
  const lower = url.toLowerCase();
  if (SOURCE_CREDIBILITY.tier1.some(s => lower.includes(s))) return 1;
  if (SOURCE_CREDIBILITY.tier2.some(s => lower.includes(s))) return 2;
  if (SOURCE_CREDIBILITY.tier3.some(s => lower.includes(s))) return 3;
  return 4;
}

function formatSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const parts = hostname.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return url;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sector, companyContext, analysisType, internalMetrics } = await req.json() as IntelligenceRequest;
    
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Strategic Intelligence requires Perplexity connector');
    }
    
    console.log(`Strategic Intelligence: ${analysisType} - "${query}"`);

    // Build enhanced search query based on analysis type
    let searchQuery = query;
    let systemPrompt = '';
    
    switch (analysisType) {
      case 'signal':
        searchQuery = `${query} strategic implications business impact ${sector || ''}`;
        systemPrompt = `Tu es un analyste stratégique senior niveau partner McKinsey. Analyse cette information avec rigueur :
1. Distingue le structurel du conjoncturel
2. Évalue si c'est du bruit médiatique ou une tendance lourde
3. Classifie : menace, opportunité ou non-sujet
4. Détermine l'horizon (3 mois / 12 mois / 5 ans)
5. Quantifie l'impact potentiel

Réponds de manière directe et structurée comme dans une note de cabinet de conseil. Pas de formules de politesse.`;
        break;
        
      case 'briefing':
        searchQuery = `${sector || 'business'} strategic news trends analysis ${new Date().toISOString().split('T')[0]}`;
        systemPrompt = `Tu es le Chief Strategy Officer d'un groupe CAC 40. Prépare un briefing exécutif de niveau comité de direction.

FORMAT STRICT :
1. SIGNAUX MAJEURS (3 max) - avec niveau de priorité
2. LECTURE STRATÉGIQUE - implications concrètes
3. RECOMMANDATIONS - actions décisionnelles

Chaque signal doit mentionner :
- S'il est structurel ou conjoncturel
- L'horizon temporel
- Le niveau de certitude

Ton direct, sans markdown, niveau dirigeant CAC 40.`;
        break;
        
      case 'exploration':
        systemPrompt = `Tu es un partner d'un cabinet de conseil stratégique de premier rang. L'utilisateur te pose une question exploratoire.

Adopte une posture de conseiller de confiance :
1. Analyse la question sous plusieurs angles
2. Identifie les enjeux cachés ou les questions que le dirigeant devrait se poser
3. Propose des pistes de réflexion hiérarchisées
4. Challenge les hypothèses implicites si nécessaire

Sois direct, incisif, orienté décision. Pas de flatterie ni de précautions inutiles.`;
        break;
        
      case 'scenario':
        systemPrompt = `Tu es spécialiste en prospective stratégique et jumeaux numériques d'entreprise.

Pour ce scénario, fournis :
1. HYPOTHÈSES CLÉS - ce qui doit être vrai pour que ce scénario se réalise
2. IMPACTS QUANTIFIÉS - estimations chiffrées sur revenus, marges, parts de marché
3. RISQUES D'EXÉCUTION - ce qui peut mal tourner
4. SIGNAUX À SURVEILLER - indicateurs qui confirmeraient/infirmeraient le scénario
5. RECOMMANDATION DÉCISIONNELLE - go/no-go avec conditions

Base ton analyse sur des données réelles et des benchmarks sectoriels.`;
        break;
    }

    // Add internal context if provided
    if (internalMetrics && Object.keys(internalMetrics).length > 0) {
      systemPrompt += `\n\nDONNÉES INTERNES DE L'ENTREPRISE (à corréler avec l'analyse) :
${JSON.stringify(internalMetrics, null, 2)}`;
    }

    if (companyContext) {
      systemPrompt += `\n\nCONTEXTE ENTREPRISE : ${companyContext}`;
    }

    // Call Perplexity for real-time intelligence
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: searchQuery }
        ],
        max_tokens: 2000,
        temperature: 0.1, // Low for factual accuracy
        search_recency_filter: analysisType === 'briefing' ? 'week' : 'month',
        search_domain_filter: [
          'ft.com', 'economist.com', 'wsj.com', 'bloomberg.com', 
          'reuters.com', 'lesechos.fr', 'ecb.europa.eu', 'imf.org'
        ],
      }),
    });

    if (!perplexityResponse.ok) {
      const error = await perplexityResponse.text();
      console.error('Perplexity error:', error);
      throw new Error('Intelligence search failed');
    }

    const perplexityData = await perplexityResponse.json();
    const content = perplexityData.choices?.[0]?.message?.content || '';
    const citations = perplexityData.citations || [];

    // Process and score sources
    const processedSources = citations.map((url: string) => ({
      name: formatSourceName(url),
      tier: getSourceTier(url),
      url
    })).sort((a: any, b: any) => a.tier - b.tier);

    // Calculate overall confidence based on source quality
    const avgTier = processedSources.length > 0
      ? processedSources.reduce((sum: number, s: any) => sum + s.tier, 0) / processedSources.length
      : 4;
    const confidence = Math.round(Math.max(0, 100 - (avgTier - 1) * 20));

    // Structure the response for different analysis types
    let structuredResponse: any = {
      content,
      sources: processedSources.slice(0, 5),
      confidence,
      timestamp: new Date().toISOString(),
      analysisType,
    };

    // If we have LOVABLE_API_KEY, enhance with structured extraction
    if (LOVABLE_API_KEY && analysisType === 'signal') {
      try {
        const extractionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'user',
                content: `Analyse ce texte et extrais les signaux stratégiques structurés. Texte: ${content}`
              }
            ],
            tools: [{
              type: 'function',
              function: {
                name: 'extract_signals',
                description: 'Extract strategic signals from analysis',
                parameters: {
                  type: 'object',
                  properties: {
                    signals: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          level: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                          type: { type: 'string', enum: ['threat', 'opportunity', 'trend', 'regulatory', 'competitive'] },
                          timeHorizon: { type: 'string', enum: ['3m', '12m', '5y'] },
                          isStructural: { type: 'boolean' },
                          strategicReading: { type: 'string' },
                          implications: { type: 'array', items: { type: 'string' } },
                          recommendations: { type: 'array', items: { type: 'string' } }
                        }
                      }
                    }
                  }
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'extract_signals' } },
            max_tokens: 1500,
          }),
        });

        if (extractionResponse.ok) {
          const extractionData = await extractionResponse.json();
          const toolCall = extractionData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const extracted = JSON.parse(toolCall.function.arguments);
            structuredResponse.signals = extracted.signals?.map((s: any) => ({
              ...s,
              id: crypto.randomUUID(),
              sources: processedSources.slice(0, 3),
              confidence
            }));
          }
        }
      } catch (extractError) {
        console.error('Signal extraction error:', extractError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...structuredResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Strategic Intelligence error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
