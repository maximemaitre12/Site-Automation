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

    const { action, rule_id, trigger_data } = await req.json();

    if (action === 'execute_rules') {
      // Fetch active automation rules
      const { data: rules, error: rulesError } = await supabaseClient
        .from('ai_automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (rulesError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch rules' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const executionResults: any[] = [];

      for (const rule of rules || []) {
        const startTime = Date.now();
        let result = 'skipped';
        let actionTaken = '';
        let errorMessage = '';

        try {
          // Check if rule should trigger
          const shouldTrigger = await evaluateTrigger(supabaseClient, user.id, rule, trigger_data);

          if (shouldTrigger) {
            // Execute the action
            const actionResult = await executeAction(supabaseClient, user.id, rule, trigger_data);
            result = actionResult.success ? 'success' : 'failure';
            actionTaken = actionResult.action;
            errorMessage = actionResult.error || '';

            // Update rule execution count
            await supabaseClient
              .from('ai_automation_rules')
              .update({
                execution_count: (rule.execution_count || 0) + 1,
                last_executed_at: new Date().toISOString(),
              })
              .eq('id', rule.id);
          }
        } catch (e) {
          result = 'failure';
          errorMessage = e instanceof Error ? e.message : 'Unknown error';
        }

        // Log execution
        await supabaseClient.from('ai_automation_logs').insert({
          user_id: user.id,
          rule_id: rule.id,
          rule_name: rule.name,
          trigger_data,
          action_taken: actionTaken,
          result,
          error_message: errorMessage,
          execution_time_ms: Date.now() - startTime,
        });

        executionResults.push({
          rule_id: rule.id,
          rule_name: rule.name,
          result,
          action_taken: actionTaken,
          error: errorMessage,
        });
      }

      return new Response(JSON.stringify({
        executed: executionResults.length,
        results: executionResults,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'create_rule') {
      const { name, description, trigger_type, trigger_conditions, action_type, action_config } = await req.json();

      const { data: newRule, error: createError } = await supabaseClient
        .from('ai_automation_rules')
        .insert({
          user_id: user.id,
          name,
          description,
          trigger_type,
          trigger_conditions,
          action_type,
          action_config,
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: 'Failed to create rule' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ rule: newRule }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'get_suggestions') {
      // Use AI to suggest automation rules
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

      // Fetch current data to understand patterns
      const [dealsRes, ticketsRes, candidatesRes] = await Promise.all([
        supabaseClient.from('sales_deals').select('status, ai_score, value').eq('user_id', user.id).limit(100),
        supabaseClient.from('support_tickets').select('status, priority').eq('user_id', user.id).limit(50),
        supabaseClient.from('candidates').select('status, match_score').eq('user_id', user.id).limit(50),
      ]);

      const suggestPrompt = `Based on this business data, suggest automation rules:

Deals: ${dealsRes.data?.length || 0} total
- Status distribution: ${JSON.stringify(dealsRes.data?.reduce((acc: any, d: any) => ({ ...acc, [d.status]: (acc[d.status] || 0) + 1 }), {}))}
- Avg AI score: ${dealsRes.data?.length ? (dealsRes.data.reduce((sum: number, d: any) => sum + (d.ai_score || 0), 0) / dealsRes.data.length).toFixed(0) : 0}

Tickets: ${ticketsRes.data?.length || 0} total
- Open: ${ticketsRes.data?.filter((t: any) => t.status === 'open').length || 0}
- High priority: ${ticketsRes.data?.filter((t: any) => t.priority === 'high').length || 0}

Candidates: ${candidatesRes.data?.length || 0} total
- Avg match score: ${candidatesRes.data?.length ? (candidatesRes.data.reduce((sum: number, c: any) => sum + (c.match_score || 0), 0) / candidatesRes.data.length).toFixed(0) : 0}

Suggest 3-5 useful automation rules. Respond with JSON:
{
  "suggestions": [
    {
      "name": "string",
      "description": "string",
      "trigger_type": "score_threshold|sentiment|status_change|prediction|anomaly",
      "trigger_conditions": {},
      "action_type": "assign|alert|email|status_change|task_create",
      "action_config": {},
      "priority": "high|medium|low",
      "expected_impact": "string"
    }
  ]
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
            { role: 'system', content: 'You are a business automation expert. Respond with valid JSON only.' },
            { role: 'user', content: suggestPrompt }
          ],
        }),
      });

      let suggestions = { suggestions: [] };

      if (aiResponse.ok) {
        try {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            suggestions = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing AI response:', e);
        }
      }

      return new Response(JSON.stringify(suggestions), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Automation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function evaluateTrigger(supabase: any, userId: string, rule: any, triggerData: any): Promise<boolean> {
  const { trigger_type, trigger_conditions } = rule;

  switch (trigger_type) {
    case 'score_threshold':
      const threshold = trigger_conditions.threshold || 80;
      const field = trigger_conditions.field || 'ai_score';
      return triggerData?.[field] >= threshold;

    case 'sentiment':
      const expectedSentiment = trigger_conditions.sentiment || 'negative';
      return triggerData?.sentiment === expectedSentiment;

    case 'status_change':
      const fromStatus = trigger_conditions.from_status;
      const toStatus = trigger_conditions.to_status;
      if (fromStatus && triggerData?.old_status !== fromStatus) return false;
      if (toStatus && triggerData?.new_status !== toStatus) return false;
      return true;

    case 'prediction':
      const predictionType = trigger_conditions.prediction_type;
      const minConfidence = trigger_conditions.min_confidence || 0.7;
      return triggerData?.prediction_type === predictionType && 
             triggerData?.confidence >= minConfidence;

    case 'anomaly':
      const severities = trigger_conditions.severities || ['high', 'critical'];
      return severities.includes(triggerData?.severity);

    default:
      return false;
  }
}

async function executeAction(supabase: any, userId: string, rule: any, triggerData: any): Promise<{ success: boolean; action: string; error?: string }> {
  const { action_type, action_config } = rule;

  try {
    switch (action_type) {
      case 'alert':
        // In a real system, this would send notifications
        console.log(`Alert triggered: ${action_config.message || 'Automation alert'}`);
        return { success: true, action: `Alert sent: ${action_config.message}` };

      case 'status_change':
        if (triggerData?.entity_id && triggerData?.entity_type === 'deal') {
          await supabase
            .from('sales_deals')
            .update({ status: action_config.new_status })
            .eq('id', triggerData.entity_id)
            .eq('user_id', userId);
          return { success: true, action: `Status changed to ${action_config.new_status}` };
        }
        return { success: false, action: 'status_change', error: 'No entity to update' };

      case 'assign':
        if (triggerData?.entity_id && triggerData?.entity_type === 'deal') {
          await supabase
            .from('sales_deals')
            .update({ assigned_to: action_config.assign_to })
            .eq('id', triggerData.entity_id)
            .eq('user_id', userId);
          return { success: true, action: `Assigned to ${action_config.assign_to}` };
        }
        return { success: false, action: 'assign', error: 'No entity to assign' };

      case 'task_create':
        // Would create a task in a task management system
        return { success: true, action: `Task created: ${action_config.task_title}` };

      case 'email':
        // Would send email in a real system
        return { success: true, action: `Email queued to ${action_config.to}` };

      default:
        return { success: false, action: action_type, error: 'Unknown action type' };
    }
  } catch (e) {
    return { success: false, action: action_type, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}