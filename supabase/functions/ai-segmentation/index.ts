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

    const { segment_type = 'prospect' } = await req.json();

    // Fetch data based on segment type
    let entities: any[] = [];
    
    if (segment_type === 'prospect' || segment_type === 'deal') {
      const { data: deals } = await supabaseClient
        .from('sales_deals')
        .select('*')
        .eq('user_id', user.id);
      entities = deals || [];
    } else if (segment_type === 'company') {
      const { data: companies } = await supabaseClient
        .from('enriched_companies')
        .select('*')
        .eq('user_id', user.id);
      entities = companies || [];
    } else if (segment_type === 'candidate') {
      const { data: candidates } = await supabaseClient
        .from('candidates')
        .select('*')
        .eq('user_id', user.id);
      entities = candidates || [];
    }

    if (entities.length < 3) {
      return new Response(JSON.stringify({ 
        error: 'Not enough data for segmentation',
        segments: [],
        message: 'Au moins 3 entités sont nécessaires pour la segmentation.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI for intelligent clustering
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const entitySummary = entities.slice(0, 50).map(e => {
      if (segment_type === 'prospect' || segment_type === 'deal') {
        return {
          id: e.id,
          value: e.value || 0,
          status: e.status,
          probability: e.probability || 0,
          source: e.source,
          score: e.ai_score || 0,
        };
      } else if (segment_type === 'company') {
        return {
          id: e.id,
          name: e.name,
          revenue: e.revenue || 0,
          employees: e.employees_count || 0,
          sector: e.naf_label,
          score: e.ai_opportunity_score || 0,
        };
      } else {
        return {
          id: e.id,
          name: e.name,
          score: e.match_score || 0,
          status: e.status,
          experience: e.experience_years || 0,
        };
      }
    });

    const segmentationPrompt = `Analyze these ${segment_type} entities and create intelligent segments:

Entities (${entities.length} total, showing first 50):
${JSON.stringify(entitySummary, null, 2)}

Create 3-5 meaningful segments based on patterns you identify.
Consider: value/revenue, engagement level, probability, source, behavior patterns.

Respond with JSON:
{
  "segments": [
    {
      "name": "string (clear segment name)",
      "description": "string (what characterizes this segment)",
      "criteria": {
        "field": "value_range|status|score_range|etc",
        "condition": "description of criteria"
      },
      "member_ids": ["id1", "id2"],
      "member_count": number,
      "avg_score": number,
      "avg_value": number,
      "insights": "string (actionable insight about this segment)",
      "recommended_actions": ["string"]
    }
  ],
  "segmentation_quality": number (0-100),
  "overall_insights": ["string"]
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
          { role: 'system', content: 'You are a data scientist specializing in customer segmentation. Respond with valid JSON only.' },
          { role: 'user', content: segmentationPrompt }
        ],
      }),
    });

    let segmentationResult = {
      segments: [],
      segmentation_quality: 50,
      overall_insights: [],
    };

    if (aiResponse.ok) {
      try {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          segmentationResult = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }
    }

    // Save segments to database
    const savedSegments: any[] = [];
    const segments = (segmentationResult.segments || []) as any[];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const { data: saved, error: saveError } = await supabaseClient
        .from('ai_segments')
        .insert({
          user_id: user.id,
          name: segment.name,
          description: segment.description,
          segment_type,
          criteria: segment.criteria,
          member_count: segment.member_count || segment.member_ids?.length || 0,
          avg_score: segment.avg_score,
          cluster_id: i + 1,
        })
        .select()
        .single();

      if (!saveError && saved) {
        savedSegments.push({ ...saved, ...segment });
      }
    }

    return new Response(JSON.stringify({
      segments: savedSegments.length > 0 ? savedSegments : segments,
      quality: segmentationResult.segmentation_quality,
      insights: segmentationResult.overall_insights,
      entity_count: entities.length,
      segment_type,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Segmentation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});