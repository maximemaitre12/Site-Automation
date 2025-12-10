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

    // Fetch all relevant data for anomaly detection
    const [dealsRes, proposalsRes, candidatesRes, ticketsRes] = await Promise.all([
      supabaseClient.from('sales_deals').select('*').eq('user_id', user.id),
      supabaseClient.from('sales_proposals').select('*').eq('user_id', user.id),
      supabaseClient.from('candidates').select('*').eq('user_id', user.id),
      supabaseClient.from('support_tickets').select('*').eq('user_id', user.id),
    ]);

    const deals = dealsRes.data || [];
    const proposals = proposalsRes.data || [];
    const candidates = candidatesRes.data || [];
    const tickets = ticketsRes.data || [];

    const anomalies: any[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Conversion drop detection
    const recentDeals = deals.filter(d => new Date(d.created_at) > thirtyDaysAgo);
    const olderDeals = deals.filter(d => new Date(d.created_at) <= thirtyDaysAgo);
    
    const recentWinRate = recentDeals.length > 0 
      ? (recentDeals.filter(d => d.status === 'won').length / recentDeals.length) * 100 
      : 0;
    const olderWinRate = olderDeals.length > 0 
      ? (olderDeals.filter(d => d.status === 'won').length / Math.max(olderDeals.filter(d => ['won', 'lost'].includes(d.status)).length, 1)) * 100 
      : 0;

    if (olderWinRate > 0 && recentWinRate < olderWinRate * 0.7) {
      anomalies.push({
        anomaly_type: 'conversion_drop',
        severity: recentWinRate < olderWinRate * 0.5 ? 'critical' : 'high',
        title: 'Baisse significative du taux de conversion',
        description: `Le taux de conversion a chuté de ${olderWinRate.toFixed(1)}% à ${recentWinRate.toFixed(1)}% sur les 30 derniers jours.`,
        detected_value: recentWinRate,
        expected_value: olderWinRate,
        deviation_percent: ((olderWinRate - recentWinRate) / olderWinRate) * 100,
      });
    }

    // 2. Stale deals detection (deals without activity)
    const staleDeals = deals.filter(d => {
      if (['won', 'lost'].includes(d.status)) return false;
      const lastActivity = new Date(d.last_activity_at || d.updated_at);
      return lastActivity < sevenDaysAgo;
    });

    if (staleDeals.length > 3) {
      anomalies.push({
        anomaly_type: 'inactive_sales',
        severity: staleDeals.length > 10 ? 'high' : 'medium',
        title: `${staleDeals.length} deals sans activité récente`,
        description: `Ces deals n'ont pas eu d'activité depuis plus de 7 jours et risquent de se refroidir.`,
        detected_value: staleDeals.length,
        expected_value: 0,
        entity_type: 'deals',
      });
    }

    // 3. High-value deals at risk
    const highValueAtRisk = deals.filter(d => {
      if (['won', 'lost'].includes(d.status)) return false;
      const value = d.value || 0;
      const riskScore = d.ai_risk_score || 0;
      return value > 10000 && riskScore > 60;
    });

    for (const deal of highValueAtRisk) {
      anomalies.push({
        anomaly_type: 'churn_risk',
        severity: 'high',
        title: `Deal à risque: ${deal.title}`,
        description: `Ce deal de €${deal.value?.toLocaleString()} a un score de risque élevé (${deal.ai_risk_score}%).`,
        entity_type: 'deal',
        entity_id: deal.id,
        detected_value: deal.ai_risk_score,
        expected_value: 30,
      });
    }

    // 4. Pipeline health issues
    const pipelineByStatus: Record<string, number> = {};
    deals.forEach(d => {
      if (!['won', 'lost'].includes(d.status)) {
        pipelineByStatus[d.status] = (pipelineByStatus[d.status] || 0) + 1;
      }
    });

    const earlyStageCount = (pipelineByStatus['lead_created'] || 0) + (pipelineByStatus['contacted'] || 0);
    const lateStageCount = (pipelineByStatus['proposal_sent'] || 0) + (pipelineByStatus['negotiation'] || 0) + (pipelineByStatus['closing_imminent'] || 0);

    if (earlyStageCount > lateStageCount * 5 && earlyStageCount > 10) {
      anomalies.push({
        anomaly_type: 'pipeline_issue',
        severity: 'medium',
        title: 'Pipeline déséquilibré',
        description: `Trop de leads en début de pipeline (${earlyStageCount}) par rapport aux opportunités avancées (${lateStageCount}).`,
        detected_value: earlyStageCount,
        expected_value: lateStageCount * 3,
      });
    }

    // 5. Support ticket backlog
    const openTickets = tickets.filter(t => t.status === 'open');
    const urgentTickets = openTickets.filter(t => t.priority === 'high' || t.priority === 'urgent');

    if (urgentTickets.length > 5) {
      anomalies.push({
        anomaly_type: 'support_backlog',
        severity: 'high',
        title: `${urgentTickets.length} tickets urgents non traités`,
        description: `Le backlog de tickets urgents nécessite une attention immédiate.`,
        detected_value: urgentTickets.length,
        expected_value: 0,
        entity_type: 'tickets',
      });
    }

    // Use AI to generate additional insights
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const analysisPrompt = `Analyze this business data for anomalies and risks:

Sales Pipeline:
- Total deals: ${deals.length}
- Open deals: ${deals.filter(d => !['won', 'lost'].includes(d.status)).length}
- Recent win rate: ${recentWinRate.toFixed(1)}%
- Stale deals (no activity 7+ days): ${staleDeals.length}
- Pipeline distribution: ${JSON.stringify(pipelineByStatus)}

Support:
- Open tickets: ${openTickets.length}
- Urgent tickets: ${urgentTickets.length}

HR:
- Total candidates: ${candidates.length}
- Pending analysis: ${candidates.filter(c => c.status === 'new').length}

Already detected anomalies:
${anomalies.map(a => `- ${a.title}: ${a.description}`).join('\n')}

Identify additional anomalies or insights. Respond with JSON:
{
  "additional_anomalies": [
    {
      "type": "string",
      "severity": "low|medium|high|critical",
      "title": "string",
      "description": "string"
    }
  ],
  "health_score": number (0-100),
  "recommendations": ["string"]
}`;

    let aiInsights = { additional_anomalies: [], health_score: 75, recommendations: [] };

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a business intelligence AI. Respond with valid JSON only.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (aiResponse.ok) {
      try {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiInsights = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }
    }

    // Save anomalies to database
    for (const anomaly of anomalies) {
      await supabaseClient.from('ai_anomalies').insert({
        user_id: user.id,
        ...anomaly,
      });
    }

    // Add AI-detected anomalies
    for (const aiAnomaly of (aiInsights.additional_anomalies || []) as any[]) {
      anomalies.push({
        anomaly_type: aiAnomaly.type || 'ai_detected',
        severity: aiAnomaly.severity || 'medium',
        title: aiAnomaly.title,
        description: aiAnomaly.description,
      });
    }

    return new Response(JSON.stringify({
      anomalies,
      health_score: aiInsights.health_score,
      recommendations: aiInsights.recommendations,
      summary: {
        total_anomalies: anomalies.length,
        critical: anomalies.filter(a => a.severity === 'critical').length,
        high: anomalies.filter(a => a.severity === 'high').length,
        medium: anomalies.filter(a => a.severity === 'medium').length,
        low: anomalies.filter(a => a.severity === 'low').length,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Anomaly detection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});