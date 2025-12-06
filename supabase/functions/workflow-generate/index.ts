import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const WORKFLOW_SCHEMA = `
{
  "blocks": [
    {
      "id": "unique-uuid",
      "type": "block_type (see allowed types below)",
      "name": "Human readable name",
      "config": { /* block-specific configuration */ },
      "position": { "x": 0, "y": 0 }
    }
  ],
  "connections": [],
  "description": "Workflow description"
}

ALLOWED BLOCK TYPES:
- Triggers: trigger_text, trigger_file, trigger_webhook, trigger_form, trigger_schedule, trigger_email
- AI Actions: ai_summary, ai_extract, ai_classify, ai_generate, ai_decision, ai_translate, ai_sentiment
- Transform: transform_json, transform_filter, transform_map, transform_merge
- Control: control_condition, control_loop, control_delay
- Integrations: http_request, http_webhook
- System: system_email, system_save, system_notify, system_log

BLOCK CONFIG EXAMPLES:
- ai_extract: { "fields": "name, email, amount, date" }
- ai_classify: { "categories": "Category1, Category2, Category3" }
- ai_generate: { "prompt": "Generate...", "tone": "professional" }
- ai_decision: { "question": "Should...?", "criteria": "Approve if..." }
- ai_summary: { "style": "executive", "maxLength": 200 }
- http_request: { "method": "GET", "url": "https://...", "headers": "{}" }
- control_condition: { "condition": "input.value > 100" }
- system_save: { "table": "table_name", "operation": "insert" }
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objective, context, constraints } = await req.json();

    if (!objective) {
      return new Response(
        JSON.stringify({ error: 'objective is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are "AETHER Flow Designer", an expert AI that creates automation workflows.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

RULES:
1. Always start with a trigger block
2. Use logical flow from trigger -> processing -> output
3. Position blocks vertically (y increases by 120 for each step)
4. Generate unique IDs using simple patterns like "block-1", "block-2"
5. Choose appropriate block types for the task
6. Configure blocks with realistic, useful settings
7. Keep workflows focused and efficient (3-8 blocks typically)
8. For AI blocks, write clear, specific prompts in the config`;

    const userPrompt = `Create a workflow for this objective: ${objective}

${context ? `Additional context: ${context}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}

Output ONLY the JSON workflow object. No explanations.`;

    console.log('Generating workflow for:', objective);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', response.status, error);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate workflow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    console.log('AI Response:', content.substring(0, 500));

    // Parse the JSON from the response
    let workflow;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      workflow = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content was:', content);
      
      // Fallback: create a simple workflow
      workflow = {
        blocks: [
          {
            id: 'trigger-1',
            type: 'trigger_text',
            name: 'Input',
            config: { placeholder: 'Enter data...' },
            position: { x: 0, y: 0 }
          },
          {
            id: 'process-1',
            type: 'ai_generate',
            name: 'Process with AI',
            config: { 
              prompt: objective,
              tone: 'professional'
            },
            position: { x: 0, y: 120 }
          }
        ],
        connections: [],
        description: objective
      };
    }

    // Validate and fix the workflow structure
    if (!workflow.blocks || !Array.isArray(workflow.blocks)) {
      workflow.blocks = [];
    }

    if (!workflow.connections) {
      workflow.connections = [];
    }

    // Ensure positions are set correctly
    workflow.blocks = workflow.blocks.map((block: any, index: number) => ({
      ...block,
      id: block.id || `block-${index + 1}`,
      position: block.position || { x: 0, y: index * 120 }
    }));

    console.log('Generated workflow with', workflow.blocks.length, 'blocks');

    return new Response(
      JSON.stringify({ 
        success: true,
        workflow,
        message: `Generated workflow with ${workflow.blocks.length} blocks`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
