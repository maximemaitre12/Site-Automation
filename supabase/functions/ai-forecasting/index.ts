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

    const { action, period = 'monthly' } = await req.json();

    // Fetch historical deals data
    const { data: deals, error: dealsError } = await supabaseClient
      .from('sales_deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dealsError) {
      console.error('Error fetching deals:', dealsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch deals data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Also fetch proposals for historical context
    const { data: proposals } = await supabaseClient
      .from('sales_proposals')
      .select('*')
      .eq('user_id', user.id);

    // Calculate forecasting metrics
    const wonDeals = deals?.filter(d => d.status === 'won') || [];
    const lostDeals = deals?.filter(d => d.status === 'lost') || [];
    const openDeals = deals?.filter(d => !['won', 'lost'].includes(d.status)) || [];

    const totalWonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const avgDealValue = wonDeals.length > 0 ? totalWonValue / wonDeals.length : 0;
    const winRate = deals && deals.length > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100 : 0;

    // Calculate weighted pipeline value
    const weightedPipelineValue = openDeals.reduce((sum, d) => {
      const probability = d.probability || 0;
      return sum + ((d.value || 0) * probability / 100);
    }, 0);

    // Calculate velocity (avg days to close)
    const closedDeals = wonDeals.filter(d => d.actual_close_date && d.created_at);
    const avgVelocity = closedDeals.length > 0
      ? closedDeals.reduce((sum, d) => {
          const created = new Date(d.created_at);
          const closed = new Date(d.actual_close_date);
          return sum + Math.ceil((closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / closedDeals.length
      : 30;

    // Generate AI-powered forecast using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const forecastPrompt = `Analyze this sales data and provide revenue forecast:

Historical Data:
- Total won deals: ${wonDeals.length}
- Total won value: €${totalWonValue.toLocaleString()}
- Average deal value: €${avgDealValue.toLocaleString()}
- Win rate: ${winRate.toFixed(1)}%
- Average closing velocity: ${avgVelocity.toFixed(0)} days
- Open deals in pipeline: ${openDeals.length}
- Weighted pipeline value: €${weightedPipelineValue.toLocaleString()}
- Active proposals: ${proposals?.length || 0}

Open deals by status:
${openDeals.slice(0, 10).map(d => `- ${d.title}: €${d.value || 0} (${d.status}, ${d.probability || 0}% probability)`).join('\n')}

Provide a JSON response with:
{
  "predicted_revenue": number (next ${period} predicted revenue),
  "predicted_deals_won": number,
  "predicted_deals_lost": number,
  "confidence_low": number (lower bound),
  "confidence_high": number (upper bound),
  "confidence_score": number (0-100),
  "factors": [
    {"factor": "string", "impact": "positive|negative", "weight": number}
  ],
  "recommendations": ["string"],
  "risk_areas": ["string"]
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
          { role: 'system', content: 'You are a sales forecasting AI. Always respond with valid JSON only, no markdown.' },
          { role: 'user', content: forecastPrompt }
        ],
      }),
    });

    let forecast = {
      predicted_revenue: weightedPipelineValue,
      predicted_deals_won: Math.round(openDeals.length * (winRate / 100)),
      predicted_deals_lost: Math.round(openDeals.length * (1 - winRate / 100)),
      confidence_low: weightedPipelineValue * 0.7,
      confidence_high: weightedPipelineValue * 1.3,
      confidence_score: 70,
      factors: [
        { factor: 'Historical win rate', impact: winRate > 30 ? 'positive' : 'negative', weight: 0.3 },
        { factor: 'Pipeline health', impact: openDeals.length > 5 ? 'positive' : 'negative', weight: 0.25 },
        { factor: 'Deal velocity', impact: avgVelocity < 45 ? 'positive' : 'negative', weight: 0.2 },
      ],
      recommendations: [],
      risk_areas: [],
    };

    if (aiResponse.ok) {
      try {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          forecast = { ...forecast, ...parsed };
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }
    }

    // Save forecast to database
    const periodStart = new Date();
    const periodEnd = new Date();
    if (period === 'weekly') periodEnd.setDate(periodEnd.getDate() + 7);
    else if (period === 'monthly') periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setMonth(periodEnd.getMonth() + 3);

    const { data: savedForecast, error: saveError } = await supabaseClient
      .from('sales_forecasts')
      .insert({
        user_id: user.id,
        forecast_period: period,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        predicted_revenue: forecast.predicted_revenue,
        predicted_deals_won: forecast.predicted_deals_won,
        predicted_deals_lost: forecast.predicted_deals_lost,
        confidence_interval_low: forecast.confidence_low,
        confidence_interval_high: forecast.confidence_high,
        factors: forecast.factors,
        model_accuracy: forecast.confidence_score,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving forecast:', saveError);
    }

    return new Response(JSON.stringify({
      forecast,
      metrics: {
        totalWonValue,
        avgDealValue,
        winRate,
        avgVelocity,
        weightedPipelineValue,
        openDealsCount: openDeals.length,
        wonDealsCount: wonDeals.length,
        lostDealsCount: lostDeals.length,
      },
      savedForecast,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Forecasting error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});