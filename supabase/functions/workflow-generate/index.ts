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
      "position": { "x": number, "y": number }
    }
  ],
  "connections": [
    {
      "id": "unique-uuid",
      "sourceBlockId": "block-id",
      "targetBlockId": "block-id"
    }
  ],
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
  console.log('Workflow generate called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body).substring(0, 500));
    
    const { objective, context, constraints, existingWorkflow, modificationRequest } = body;

    // Mode: modification d'un workflow existant
    const isModification = existingWorkflow && modificationRequest;

    if (!isModification && !objective) {
      return new Response(
        JSON.stringify({ error: 'objective is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isModification && !modificationRequest) {
      return new Response(
        JSON.stringify({ error: 'modificationRequest is required for modifications' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (isModification) {
      // Mode modification
      systemPrompt = `You are "AETHER Flow Designer", an expert AI that modifies automation workflows.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

RULES FOR MODIFICATIONS:
1. Preserve block IDs when possible to maintain references
2. Keep existing connections unless explicitly asked to change them
3. When adding blocks, position them logically (increment y by 120, spread x for parallel blocks)
4. When removing blocks, also remove their connections
5. Update configurations as needed while preserving unrelated settings
6. For parallel branches, spread blocks horizontally (x: 0, 250, 500, etc.)
7. Maintain the overall workflow logic unless asked to change it
8. Return the COMPLETE modified workflow, not just the changes`;

      userPrompt = `Here is the CURRENT workflow:
${JSON.stringify(existingWorkflow, null, 2)}

MODIFICATION REQUEST: ${modificationRequest}

Apply the modification and output the COMPLETE modified workflow as JSON. Preserve what should stay, modify what needs to change.`;

    } else {
      // Mode création
      systemPrompt = `You are "AETHER Flow Designer", an expert AI that creates automation workflows.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

RULES:
1. Always start with a trigger block
2. Use logical flow from trigger -> processing -> output
3. Position blocks for a visual canvas: spread them out (x: 0-500, y: 0-600+)
4. For parallel workflows, spread blocks horizontally (x: 0, 250, 500)
5. Generate unique IDs using patterns like "block-1", "block-2"
6. Create connections between blocks to show the flow
7. Choose appropriate block types for the task
8. Configure blocks with realistic, useful settings
9. Keep workflows focused and efficient (3-8 blocks typically)
10. For AI blocks, write clear, specific prompts in the config`;

      userPrompt = `Create a workflow for this objective: ${objective}

${context ? `Additional context: ${context}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}

Output ONLY the JSON workflow object with blocks AND connections. No explanations.`;
    }

    console.log(isModification ? 'Modifying workflow:' : 'Generating workflow for:', isModification ? modificationRequest : objective);

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
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      
      if (isModification) {
        // En cas d'erreur de parsing en mode modification, retourner le workflow original
        return new Response(
          JSON.stringify({ error: 'Failed to parse AI response. Please try rephrasing your request.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Fallback: create a simple workflow
      workflow = {
        blocks: [
          {
            id: 'trigger-1',
            type: 'trigger_text',
            name: 'Input',
            config: { placeholder: 'Enter data...' },
            position: { x: 100, y: 50 }
          },
          {
            id: 'process-1',
            type: 'ai_generate',
            name: 'Process with AI',
            config: { 
              prompt: objective,
              tone: 'professional'
            },
            position: { x: 100, y: 200 }
          }
        ],
        connections: [
          {
            id: 'conn-1',
            sourceBlockId: 'trigger-1',
            targetBlockId: 'process-1'
          }
        ],
        description: objective
      };
    }

    // Validate and fix the workflow structure
    if (!workflow.blocks || !Array.isArray(workflow.blocks)) {
      workflow.blocks = [];
    }

    if (!workflow.connections || !Array.isArray(workflow.connections)) {
      workflow.connections = [];
    }

    // Ensure positions are set correctly and spread out for canvas view
    workflow.blocks = workflow.blocks.map((block: any, index: number) => ({
      ...block,
      id: block.id || `block-${index + 1}`,
      position: block.position || { x: 100, y: 50 + index * 150 }
    }));

    // If no connections were generated but we have multiple blocks, create linear connections
    if (workflow.connections.length === 0 && workflow.blocks.length > 1) {
      workflow.connections = workflow.blocks.slice(0, -1).map((block: any, index: number) => ({
        id: `conn-${index + 1}`,
        sourceBlockId: block.id,
        targetBlockId: workflow.blocks[index + 1].id
      }));
    }

    console.log('Generated workflow with', workflow.blocks.length, 'blocks and', workflow.connections.length, 'connections');

    return new Response(
      JSON.stringify({ 
        success: true,
        workflow,
        message: isModification 
          ? `Modified workflow: ${workflow.blocks.length} blocks, ${workflow.connections.length} connections`
          : `Generated workflow with ${workflow.blocks.length} blocks`
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
