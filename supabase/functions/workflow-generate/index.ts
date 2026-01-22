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
    console.log('Request body received:', JSON.stringify(body).substring(0, 300));
    
    const { objective, context, constraints, existingWorkflow, modificationRequest, stream } = body;

    // Mode: modification d'un workflow existant
    const isModification = existingWorkflow && modificationRequest;

    if (!isModification && !objective) {
      console.error('Missing objective');
      return new Response(
        JSON.stringify({ error: 'objective is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (isModification) {
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
      systemPrompt = `You are "AETHER Flow Designer", an expert AI that creates comprehensive, production-ready automation workflows.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

CRITICAL RULES FOR COMPREHENSIVE WORKFLOWS:
1. Always start with one or more trigger blocks
2. Create MINIMUM 20 blocks for comprehensive automation - this is mandatory!
3. Use logical flow: triggers -> validation -> enrichment -> processing -> decisions -> actions -> logging
4. Include error handling branches with control_condition blocks
5. Add logging blocks (system_log) at key checkpoints for audit trail
6. Use AI blocks strategically: ai_extract for parsing, ai_classify for routing, ai_decision for complex logic
7. Include notification blocks (system_notify, system_email) for important events
8. Add control_delay blocks between external API calls to prevent rate limiting
9. Use transform_merge to combine data from parallel branches
10. Always end with system_save to persist results and system_log for final audit

POSITIONING FOR COMPLEX WORKFLOWS:
- Main flow: x=300, y increments by 100 per block
- Parallel branch left: x=50
- Parallel branch right: x=550  
- Error handling branch: x=800
- Start y at 50, increment by 100 for each row

MANDATORY BLOCK STRUCTURE (follow this pattern):
1. TRIGGERS (1-2 blocks): trigger_email, trigger_webhook, trigger_file, trigger_form
2. VALIDATION (2-3 blocks): ai_extract to parse input, transform_filter for validation
3. ENRICHMENT (2-3 blocks): http_request for external data, ai_generate for context
4. CLASSIFICATION (2-3 blocks): ai_classify for routing, ai_sentiment for tone
5. CORE PROCESSING (4-6 blocks): ai_summary, ai_decision, transform_json, ai_translate
6. DECISION BRANCHING (2-3 blocks): control_condition for routing logic
7. ACTIONS PER BRANCH (4-6 blocks): system_email, http_webhook, system_notify
8. PERSISTENCE & LOGGING (2-3 blocks): system_save, system_log

Generate unique IDs using patterns like "trigger-1", "validate-1", "enrich-1", "classify-1", "process-1", "decide-1", "action-1", "log-1"`;

      userPrompt = `Create a COMPREHENSIVE workflow with MINIMUM 20 BLOCKS for this objective: ${objective}

${context ? `Additional context: ${context}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}

IMPORTANT: Generate at least 20 blocks following the mandatory structure pattern. Include validation, enrichment, classification, processing, decision branching, actions, and logging.

Output ONLY the JSON workflow object with blocks AND connections. No explanations.`;
    }

    console.log('Calling AI Gateway for:', isModification ? 'modification' : 'generation');

    // Streaming mode for real-time block display
    if (stream) {
      console.log('Using streaming mode...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout for complex workflows
      
      try {
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
            stream: true,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.text();
          console.error('AI Gateway streaming error:', response.status, error);
          
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

        // Return the stream directly
        return new Response(response.body, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
        });
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Streaming error:', err);
        return new Response(
          JSON.stringify({ error: 'Request timeout or network error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Non-streaming mode (more reliable)
    console.log('Making AI request (non-streaming)...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Request timeout after 120s');
      controller.abort();
    }, 120000); // 120s timeout for complex workflows
    
    let response;
    try {
      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchErr);
      return new Response(
        JSON.stringify({ error: 'Request timeout - please try again' }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('AI response status:', response.status);

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

    console.log('AI Response received, length:', content.length);

    // Parse the JSON from the response
    let workflow;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      workflow = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content was:', content.substring(0, 500));
      
      if (isModification) {
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

    // Intelligent positioning function for complex workflows
    function calculateBlockPositions(blocks: any[]): any[] {
      const VERTICAL_SPACING = 100;
      const HORIZONTAL_SPACING = 280;
      const START_Y = 50;
      const MAIN_X = 300;
      
      // Group blocks by type prefix for logical layout
      const getGroupPriority = (type: string): number => {
        if (type?.startsWith('trigger_')) return 0;
        if (['ai_extract', 'transform_filter', 'transform_json'].includes(type)) return 1;
        if (type?.startsWith('http_') || type === 'ai_generate') return 2;
        if (['ai_classify', 'ai_sentiment'].includes(type)) return 3;
        if (['ai_summary', 'ai_decision', 'ai_translate'].includes(type)) return 4;
        if (['control_condition', 'control_loop', 'control_branch'].includes(type)) return 5;
        if (['system_email', 'system_notify', 'http_webhook'].includes(type)) return 6;
        if (['system_save', 'system_log'].includes(type)) return 7;
        return 4; // Default to processing group
      };
      
      // Sort blocks by group priority
      const sortedBlocks = [...blocks].sort((a, b) => 
        getGroupPriority(a.type) - getGroupPriority(b.type)
      );
      
      // Position blocks
      let currentY = START_Y;
      let lastGroup = -1;
      
      return sortedBlocks.map((block, index) => {
        const currentGroup = getGroupPriority(block.type);
        
        // Add extra spacing between groups
        if (lastGroup !== -1 && currentGroup !== lastGroup) {
          currentY += 30; // Extra gap between groups
        }
        lastGroup = currentGroup;
        
        const position = { x: MAIN_X, y: currentY };
        currentY += VERTICAL_SPACING;
        
        return {
          ...block,
          id: block.id || `block-${index + 1}`,
          position: block.position || position
        };
      });
    }

    // Apply intelligent positioning
    workflow.blocks = calculateBlockPositions(workflow.blocks);

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
