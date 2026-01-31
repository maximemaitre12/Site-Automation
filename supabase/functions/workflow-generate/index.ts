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
      "id": "unique-id",
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

ALLOWED BLOCK TYPES (USE ONLY THESE):

=== TRIGGERS (use ONE to start) ===
- trigger_text: Manual text input
- trigger_gmail: Fetch emails from Gmail (REQUIRES OAUTH - user must have connected Gmail in Flow settings)
  config: { "query": "is:unread", "maxResults": 10 }
- trigger_file: File upload
- trigger_schedule: Scheduled execution (hourly, daily, etc.)

=== AI PROCESSING ===
- ai_summary: Summarize text { "style": "executive|bullet|brief", "maxLength": 200 }
- ai_extract: Extract structured data { "fields": "name, email, date", "description": "Extract from email" }
- ai_generate: Generate content { "prompt": "Write a summary of..." }
- ai_translate: Translate text { "targetLanguage": "French" }

=== DOCUMENT GENERATION ===
- doc_generate_word: Generate Word document from text
  config: { "filename": "document.docx", "title": "Document Title" }

=== OUTPUT ===
- system_download: Download file to browser
  config: { "filename": "output.docx", "format": "docx" }
- system_save: Save to database { "table": "table_name", "operation": "insert" }
- system_log: Log message { "level": "INFO", "message": "..." }

=== TRANSFORM ===
- transform_json: Transform JSON data
- transform_filter: Filter data by condition
- transform_map: Map/transform fields
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
3. When adding blocks, position them logically (increment y by 120)
4. When removing blocks, also remove their connections
5. Return the COMPLETE modified workflow, not just the changes`;

      userPrompt = `Here is the CURRENT workflow:
${JSON.stringify(existingWorkflow, null, 2)}

MODIFICATION REQUEST: ${modificationRequest}

Apply the modification and output the COMPLETE modified workflow as JSON. Preserve what should stay, modify what needs to change.`;

    } else {
      systemPrompt = `You are "AETHER Flow Designer", an expert AI that creates SIMPLE, FUNCTIONAL automation workflows.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

CRITICAL RULES - READ CAREFULLY:
1. Create the MINIMUM number of blocks needed (usually 3-6 blocks)
2. NEVER use placeholder URLs like "api.example.com" or "cache.example.com" - these will FAIL
3. NEVER use http_request blocks unless the user specifically provides a real API URL
4. For Gmail/email tasks: use trigger_gmail block (user has OAuth configured)
5. For document generation: use doc_generate_word block
6. For downloads: use system_download block
7. Keep it SIMPLE - only add blocks that directly fulfill the user's request
8. Connect blocks in a logical sequence: trigger → process → output

POSITIONING:
- Start at x=100, y=50
- Increment y by 150 for each block
- Keep x=100 for linear flows

EXAMPLE - Email to Word document:
{
  "blocks": [
    { "id": "gmail-1", "type": "trigger_gmail", "name": "Récupérer dernier email", "config": { "query": "is:inbox", "maxResults": 1 }, "position": { "x": 100, "y": 50 } },
    { "id": "extract-1", "type": "ai_extract", "name": "Extraire le texte", "config": { "fields": "subject, body, from", "description": "Extraire le contenu de l'email" }, "position": { "x": 100, "y": 200 } },
    { "id": "doc-1", "type": "doc_generate_word", "name": "Générer Word", "config": { "filename": "email.docx", "title": "Email Content" }, "position": { "x": 100, "y": 350 } },
    { "id": "download-1", "type": "system_download", "name": "Télécharger", "config": { "filename": "email.docx", "format": "docx" }, "position": { "x": 100, "y": 500 } }
  ],
  "connections": [
    { "id": "c1", "sourceBlockId": "gmail-1", "targetBlockId": "extract-1" },
    { "id": "c2", "sourceBlockId": "extract-1", "targetBlockId": "doc-1" },
    { "id": "c3", "sourceBlockId": "doc-1", "targetBlockId": "download-1" }
  ],
  "description": "Récupère le dernier email Gmail, extrait le contenu et génère un fichier Word téléchargeable"
}`;

      userPrompt = `Create a SIMPLE, FUNCTIONAL workflow for: ${objective}

${context ? `Context: ${context}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}

IMPORTANT:
- Use ONLY the block types listed in the schema
- Do NOT use http_request with fake URLs
- Create the minimum blocks needed (3-6 typically)
- For email tasks, use trigger_gmail (OAuth is configured)
- For document generation, use doc_generate_word
- For downloads, use system_download

Output ONLY valid JSON. No markdown, no explanations.`;
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
