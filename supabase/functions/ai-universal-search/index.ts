import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ error: 'Query too short' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch all relevant data for context
    const [dealsRes, proposalsRes, companiesRes, candidatesRes, ticketsRes, docsRes, workflowsRes] = await Promise.all([
      supabaseClient.from('sales_deals').select('*').eq('user_id', user.id).limit(100),
      supabaseClient.from('sales_proposals').select('*').eq('user_id', user.id).limit(50),
      supabaseClient.from('enriched_companies').select('*').eq('user_id', user.id).limit(100),
      supabaseClient.from('candidates').select('*').eq('user_id', user.id).limit(50),
      supabaseClient.from('support_tickets').select('*').eq('user_id', user.id).limit(50),
      supabaseClient.from('aether_documents').select('id, title, ai_summary, tags, file_type, created_at').eq('user_id', user.id).limit(50),
      supabaseClient.from('workflows').select('*').eq('user_id', user.id).limit(20),
    ]);

    const deals = dealsRes.data || [];
    const proposals = proposalsRes.data || [];
    const companies = companiesRes.data || [];
    const candidates = candidatesRes.data || [];
    const tickets = ticketsRes.data || [];
    const documents = docsRes.data || [];
    const workflows = workflowsRes.data || [];

    // Build comprehensive context
    const contextSummary = {
      deals: {
        total: deals.length,
        won: deals.filter(d => d.status === 'won').length,
        lost: deals.filter(d => d.status === 'lost').length,
        open: deals.filter(d => !['won', 'lost'].includes(d.status)).length,
        total_value: deals.reduce((sum, d) => sum + (d.value || 0), 0),
        by_status: deals.reduce((acc, d) => ({ ...acc, [d.status]: (acc[d.status] || 0) + 1 }), {}),
        recent: deals.slice(0, 10).map(d => ({
          title: d.title,
          value: d.value,
          status: d.status,
          probability: d.probability,
          contact: d.contact_name,
        })),
      },
      proposals: {
        total: proposals.length,
        recent: proposals.slice(0, 5).map(p => ({
          title: p.title,
          prospect: p.prospect_name,
          score: p.prospect_score,
        })),
      },
      companies: {
        total: companies.length,
        by_sector: companies.reduce((acc, c) => ({ ...acc, [c.naf_label || 'Unknown']: (acc[c.naf_label || 'Unknown'] || 0) + 1 }), {}),
        recent: companies.slice(0, 10).map(c => ({
          name: c.name,
          revenue: c.revenue,
          employees: c.employees_count,
          sector: c.naf_label,
        })),
      },
      candidates: {
        total: candidates.length,
        by_status: candidates.reduce((acc, c) => ({ ...acc, [c.status || 'new']: (acc[c.status || 'new'] || 0) + 1 }), {}),
        avg_score: candidates.length > 0 ? candidates.reduce((sum, c) => sum + (c.match_score || 0), 0) / candidates.length : 0,
      },
      tickets: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        by_priority: tickets.reduce((acc, t) => ({ ...acc, [t.priority || 'medium']: (acc[t.priority || 'medium'] || 0) + 1 }), {}),
      },
      documents: {
        total: documents.length,
        recent: documents.slice(0, 5).map(d => ({ title: d.title, type: d.file_type })),
      },
      workflows: {
        total: workflows.length,
        active: workflows.filter(w => w.is_active).length,
      },
    };

    // Calculate key metrics
    const winRate = deals.length > 0 
      ? (deals.filter(d => d.status === 'won').length / Math.max(deals.filter(d => ['won', 'lost'].includes(d.status)).length, 1)) * 100 
      : 0;

    const avgDealValue = deals.filter(d => d.status === 'won').length > 0
      ? deals.filter(d => d.status === 'won').reduce((sum, d) => sum + (d.value || 0), 0) / deals.filter(d => d.status === 'won').length
      : 0;

    // Use AI for intelligent search
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const searchPrompt = `You are an intelligent business assistant with access to all company data.

User question: "${query}"

Available data context:
${JSON.stringify(contextSummary, null, 2)}

Key metrics:
- Win rate: ${winRate.toFixed(1)}%
- Average deal value: €${avgDealValue.toLocaleString()}
- Open pipeline value: €${deals.filter(d => !['won', 'lost'].includes(d.status)).reduce((sum, d) => sum + (d.value || 0), 0).toLocaleString()}

Answer the user's question using the available data. Be specific with numbers and names when possible.
If the question asks about specific records, list them.
If the question is analytical, provide insights and recommendations.

Respond in French with:
{
  "answer": "string (detailed answer in natural language)",
  "data_used": ["deals", "companies", etc],
  "key_findings": [
    {"metric": "string", "value": "string", "insight": "string"}
  ],
  "relevant_records": [
    {"type": "deal|company|candidate|ticket", "name": "string", "detail": "string"}
  ],
  "follow_up_questions": ["string"]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert business intelligence assistant. Always respond with valid JSON. Answer in French.' },
          { role: 'user', content: searchPrompt }
        ],
      }),
    });

    let searchResult = {
      answer: 'Je n\'ai pas pu analyser les données. Veuillez reformuler votre question.',
      data_used: [],
      key_findings: [],
      relevant_records: [],
      follow_up_questions: [],
    };

    if (aiResponse.ok) {
      try {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          searchResult = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }
    }

    return new Response(JSON.stringify({
      query,
      ...searchResult,
      context_stats: {
        deals: deals.length,
        companies: companies.length,
        candidates: candidates.length,
        tickets: tickets.length,
        documents: documents.length,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Universal search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});