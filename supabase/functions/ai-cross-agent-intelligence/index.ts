import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, entityType, entityData, context, specificPrompt, sourceAgent, period, question, currentAgent, userId } = await req.json();

    console.log(`[ai-cross-agent-intelligence] Action: ${action}, User: ${userId}`);

    let systemPrompt = `Tu es un assistant IA intelligent pour la plateforme AETHER, une suite d'outils business.
Tu as accès aux données de plusieurs agents : HR (recrutement), Sales (ventes), Support (tickets), Data (données entreprises), Compliance (conformité), Doc (documents), Flow (workflows).

Contexte actuel de l'utilisateur:
- Candidats récents: ${context?.candidates?.length || 0}
- Deals en cours: ${context?.deals?.length || 0}
- Tickets support: ${context?.tickets?.length || 0}
- Documents: ${context?.documents?.length || 0}
- Entreprises enrichies: ${context?.companies?.length || 0}

Tu dois répondre de manière concise, actionable et pertinente. Utilise le contexte fourni pour personnaliser tes réponses.`;

    let userPrompt = '';
    let responseFormat: any = null;

    switch (action) {
      case 'analyze':
        userPrompt = `Analyse cette entité de type "${entityType}":
${JSON.stringify(entityData, null, 2)}

${specificPrompt || 'Fournis une analyse complète avec insights, suggestions, risques et opportunités.'}

Réponds en JSON avec ce format:
{
  "insights": ["insight 1", "insight 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "risks": ["risque 1"],
  "opportunities": ["opportunité 1"],
  "score": 85
}`;
        break;

      case 'generate_insights':
        userPrompt = `En te basant sur les données de l'agent "${sourceAgent}" et le contexte global, génère des insights proactifs et des actions suggérées.

Données disponibles:
${JSON.stringify(context, null, 2)}

Génère 3-5 insights pertinents et 2-3 actions suggérées.

Réponds en JSON:
{
  "insights": [
    {
      "type": "opportunity|warning|suggestion|info",
      "title": "Titre court",
      "content": "Description détaillée",
      "relatedEntities": [{"type": "candidate|deal|ticket", "id": "...", "name": "..."}],
      "priority": 1-10
    }
  ],
  "actions": [
    {
      "type": "create|update|notify|analyze",
      "title": "Action à faire",
      "description": "Pourquoi cette action",
      "targetAgent": "hr|sales|support|doc",
      "data": {}
    }
  ]
}`;
        break;

      case 'find_connections':
        userPrompt = `Trouve les connexions et relations entre les différentes entités.

Contexte:
${JSON.stringify(context, null, 2)}

Identifie les liens potentiels : candidats qui travaillent chez des prospects, deals liés à des tickets support, etc.

Réponds en JSON:
{
  "connections": [
    {
      "source": {"type": "...", "id": "...", "name": "..."},
      "target": {"type": "...", "id": "...", "name": "..."},
      "relationship": "description du lien",
      "strength": 1-10
    }
  ]
}`;
        break;

      case 'summarize_activity':
        userPrompt = `Résume l'activité de la période "${period}" basée sur les données disponibles.

Contexte:
${JSON.stringify(context, null, 2)}

Fournis un résumé exécutif concis de l'activité sur tous les agents.

Réponds avec un texte de résumé en français (pas de JSON).`;
        break;

      case 'ask':
        systemPrompt += `\n\nL'utilisateur est actuellement sur l'agent: ${currentAgent || 'global'}`;
        userPrompt = question;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Call AI
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ai-cross-agent-intelligence] API error: ${errorText}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    console.log(`[ai-cross-agent-intelligence] Response received, length: ${content.length}`);

    // Parse response based on action
    let result;
    if (action === 'summarize_activity' || action === 'ask') {
      result = action === 'ask' ? { answer: content } : { summary: content };
    } else {
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        result = JSON.parse(jsonString);
      } catch (e) {
        console.error('[ai-cross-agent-intelligence] JSON parse error:', e);
        result = { raw: content };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[ai-cross-agent-intelligence] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
