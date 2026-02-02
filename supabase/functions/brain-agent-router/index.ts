import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  query: string;
}

interface DataRequirement {
  tables: string[];
  filters: Record<string, any>;
  limit: number;
  fields: string[];
  reason: string;
}

/**
 * Agent Router - Uses AI to intelligently determine which data is needed
 * Returns specific data requirements rather than fetching everything
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json() as RouterRequest;

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Agent Router analyzing: "${query.slice(0, 100)}..."`);

    // Use a fast, cheap AI call to determine data requirements
    const analysisPrompt = `Tu es un agent de routage de données pour une plateforme entreprise.
Analyse cette question utilisateur et détermine EXACTEMENT quelles données sont nécessaires.

TABLES DISPONIBLES:
- workflows (id, name, is_active, status, updated_at) - Automatisations
- sales_deals (id, company_name, value, status, win_probability, priority) - Opportunités commerciales
- candidates (id, name, status, match_score, skills, email) - Candidats RH
- employees (id, first_name, last_name, department, status, performance_score) - Employés
- support_tickets (id, title, status, priority, category) - Tickets support
- aether_documents (id, title, file_type, ai_summary) - Documents
- compliance_alerts (id, title, severity, is_resolved) - Alertes conformité
- esg_kpis (id, name, category, value, status) - KPIs ESG
- enriched_companies (id, name, sector, revenue, financial_health_score) - Entreprises enrichies
- crm_contacts (id, first_name, last_name, engagement_score) - Contacts CRM
- conversations (id, title, updated_at) - Historique conversations
- sales_proposals (id, title, status, total_amount) - Propositions commerciales
- call_analyses (id, title, sentiment, summary) - Analyses d'appels

QUESTION: "${query}"

Réponds UNIQUEMENT en JSON valide avec cette structure:
{
  "needs_data": true/false,
  "tables": ["table1", "table2"],
  "filters": {"status": "active", "priority": "high"},
  "sort_by": "updated_at",
  "limit": 5,
  "fields": ["name", "status", "value"],
  "reason": "Explication courte de pourquoi ces données"
}

Si la question est générale/conversation, réponds: {"needs_data": false, "reason": "Question générale"}
Si la question demande une vue globale, inclus les tables principales avec limit: 3 chacune.
Sois MINIMALISTE - ne demande que le strict nécessaire.`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite', // Fast & cheap for routing
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent routing
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Router AI error:', errorText);
      // Fallback to general context if AI fails
      return new Response(
        JSON.stringify({ 
          needs_data: true,
          tables: ['general'],
          filters: {},
          limit: 5,
          fields: [],
          reason: 'Fallback - AI routing failed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    console.log('Router AI response:', content);

    // Parse the JSON response
    let requirements: DataRequirement;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        requirements = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse router response:', parseError);
      requirements = {
        tables: ['general'],
        filters: {},
        limit: 5,
        fields: [],
        reason: 'Parse error - using general context'
      };
    }

    console.log(`Router determined: ${requirements.tables?.join(', ') || 'no data needed'}`);

    return new Response(
      JSON.stringify(requirements),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-agent-router:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
