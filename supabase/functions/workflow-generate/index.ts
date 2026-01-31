import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// ==========================================
// BLOCK LIBRARY - Single Source of Truth
// L'IA ne peut utiliser QUE ces blocs
// Inclut les sub-nodes et connexions typées
// ==========================================

const ALLOWED_BLOCKS = `
=== TRIGGERS (start the workflow) ===
- manual_trigger: Start workflow manually (no params)
- webhook_trigger: Start when webhook is called
    params: method (GET|POST|PUT|DELETE), path (string), authentication (none|basic|bearer|apikey)
- schedule_trigger: Run on a schedule
    params: rule (everyMinute|everyHour|everyDay9am|cron), cronExpression (string), timezone (string)
- email_trigger: Trigger when email is received
    params: provider (gmail|outlook|imap), query (string), maxResults (number)
- form_trigger: Trigger when form is submitted
    params: formId (string), fields (JSON array)

=== FLOW CONTROL ===
- if: Route items based on condition (2 outputs: true/false)
    params: condition (expression, REQUIRED), combineWith (and|or)
- switch: Route to multiple outputs based on rules
    params: mode (rules|expression), rules (JSON), fallbackOutput (number)
- merge: Merge data from multiple inputs
    params: mode (append|combine|combineByField), joinField (string)
- loop: Split data into batches and iterate (2 outputs: loop/done)
    params: batchSize (number), maxIterations (number)
- filter: Remove items matching a condition
    params: condition (expression, REQUIRED)
- limit: Restrict the number of items
    params: maxItems (number)
- split_out: Turn array into separate items
    params: fieldToSplit (string)
- wait: Wait before continuing
    params: amount (number), unit (seconds|minutes|hours)
- stop_and_error: Throw an error
    params: errorMessage (string)
- no_op: Pass through without changes (no params)

=== AI MAIN NODES ===
- ai_agent: AI Agent with typed ports for Model, Memory, Tools
    params: systemPrompt (REQUIRED), userPrompt (expression), outputMode (text|json|stream)
    TYPED INPUTS: ai_model (required), ai_memory (optional), ai_tool (multiple)
    NOTE: Connect sub-nodes to typed ports, not just main flow!
- ai_prompt: Send prompt to LLM
    params: model, prompt (expression, REQUIRED), temperature, maxTokens
- ai_summarize: Summarize text content
    params: input (expression, REQUIRED), style (brief|bullets|executive|detailed), maxLength
- ai_extract: Extract structured data from text
    params: input (expression, REQUIRED), fields (JSON array, REQUIRED), description
- ai_classify: Classify items into categories (multiple outputs)
    params: input (expression, REQUIRED), categories (JSON array, REQUIRED), routeByCategory
- ai_sentiment: Analyze sentiment and emotions
    params: input (expression, REQUIRED), detailed
- ai_translate: Translate text to another language
    params: input (expression, REQUIRED), targetLanguage (en|fr|es|de|it|pt|zh|ja|ko|ar, REQUIRED)
- ai_generate: Generate content with AI
    params: prompt (expression, REQUIRED), style (professional|casual|creative|technical), length (short|medium|long)
- ai_vision: Analyze images with AI
    params: imageUrl (expression, REQUIRED), task (describe|ocr|objects|custom), customPrompt

=== AI SUB-NODES (connect to typed ports) ===
These are auxiliary nodes that connect to specific TYPED PORTS on main nodes (like ai_agent).

Chat Model Sub-nodes (output: ai_model):
- openai_chat_model: OpenAI GPT model
    params: model (gpt-5|gpt-5-mini|gpt-5-nano), temperature, maxTokens
- gemini_chat_model: Google Gemini model  
    params: model (gemini-2.5-pro|gemini-2.5-flash|gemini-3-flash-preview), temperature

Memory Sub-nodes (output: ai_memory):
- simple_memory: In-memory conversation buffer
    params: maxMessages, sessionKey (expression)
- postgres_memory: Persistent memory in PostgreSQL
    params: tableName, sessionKey (expression)

Vector Store / Retriever Sub-nodes (output: ai_retriever):
- simple_vector_store: In-memory vector store for RAG
    params: topK, similarityThreshold
    TYPED INPUT: ai_embeddings
- supabase_vector_store: Vector store using Supabase pgvector
    params: tableName, contentColumn, embeddingColumn, topK
    TYPED INPUT: ai_embeddings

Embeddings Sub-nodes (output: ai_embeddings):
- openai_embeddings: OpenAI text embeddings
    params: model (text-embedding-3-small|text-embedding-3-large)

Tool Sub-nodes (output: ai_tool):
- http_tool: HTTP request as agent tool
    params: name (REQUIRED), description (REQUIRED), method, url
- code_tool: JavaScript function as agent tool
    params: name (REQUIRED), description (REQUIRED), parameters (JSON), code
- workflow_tool: Another workflow as agent tool
    params: name (REQUIRED), description (REQUIRED), workflowId

Document Sub-nodes (output: document):
- document_loader: Load and parse documents
    params: source (file|url|text), url, text, chunkSize, chunkOverlap

=== DATA TRANSFORMATION ===
- set: Modify, add or remove item fields
    params: mode (manual|json), fields (keyvalue), json (JSON)
- code: Run custom JavaScript code
    params: language (javascript), code (REQUIRED)
- aggregate: Combine field from many items into a list
    params: field, outputField
- summarize: Sum, count, max, etc.
    params: operation (sum|count|avg|min|max), field
- sort: Change items order
    params: field, direction (asc|desc)
- remove_duplicates: Delete items with matching field values
    params: field
- rename_keys: Update item field names
    params: mappings (keyvalue)
- date_time: Manipulate date and time
    params: operation (format|add|subtract|now), inputField, format
- html: Work with HTML content
    params: operation (extractText|parse|generate), html (expression)
- markdown: Convert Markdown/HTML
    params: direction (toHtml|toMarkdown), input (expression)
- xml: Convert XML/JSON
    params: direction (toJson|toXml), input (expression)
- crypto: Hash, encrypt or decrypt
    params: operation (md5|sha256|hmac|encrypt|decrypt), input (expression)

=== HTTP & FILES ===
- http_request: Make HTTP API requests
    params: method (GET|POST|PUT|PATCH|DELETE, REQUIRED), url (REQUIRED), headers (JSON), body (JSON), timeout
- respond_webhook: Send response to webhook caller
    params: statusCode, body (JSON), headers (JSON)
- read_file: Read file contents
    params: source (url|storage|input), url (expression), encoding (utf8|base64|binary)
- write_file: Create or write content to file
    params: fileName (expression, REQUIRED), content (expression, REQUIRED), mimeType

=== INTEGRATIONS ===
- send_email: Send email message
    params: to (expression, REQUIRED), subject (expression, REQUIRED), body (REQUIRED), cc, isHtml
- slack: Post message to Slack
    params: channel (REQUIRED), message (REQUIRED), username
- discord: Post message to Discord
    params: webhookUrl (REQUIRED), message (REQUIRED), username
- telegram: Send Telegram message
    params: chatId (REQUIRED), message (REQUIRED)
- database_query: Query database records
    params: table (REQUIRED), select, filter (JSON), limit, orderBy
- database_insert: Insert records
    params: table (REQUIRED), data (JSON, REQUIRED)
- database_update: Update records
    params: table (REQUIRED), filter (JSON, REQUIRED), data (JSON, REQUIRED)

=== OUTPUT ===
- generate_document: Generate Word/PDF document
    params: format (docx|pdf), title (expression), content (expression, REQUIRED), filename (expression)
- download_file: Trigger file download in browser
    params: filename (expression, REQUIRED), mimeType
- send_notification: Send push notification
    params: title (REQUIRED), message (REQUIRED), channel (inapp|email|both)
- log: Log message for debugging
    params: level (info|warn|error|debug), message (REQUIRED)
`;

const WORKFLOW_SCHEMA = `
{
  "blocks": [
    {
      "id": "unique-id",
      "type": "block_type (from ALLOWED BLOCKS list)",
      "name": "Human readable name",
      "config": { /* block-specific parameters */ },
      "position": { "x": number, "y": number }
    }
  ],
  "connections": [
    {
      "id": "unique-uuid",
      "sourceBlockId": "block-id",
      "targetBlockId": "block-id",
      "sourceHandle": "main | ai_model | ai_memory | ai_tool | ai_embeddings | ai_retriever | document",
      "targetHandle": "main | ai_model | ai_memory | ai_tool | ai_embeddings | ai_retriever | document"
    }
  ],
  "description": "Workflow description"
}

CRITICAL RULES:
1. You can ONLY use block types from the ALLOWED BLOCKS list above
2. You CANNOT invent new block types or parameters
3. Use expression syntax {{ $json.field }} to reference data from previous blocks
4. Start every workflow with exactly ONE trigger block
5. Connect blocks in a logical sequence: trigger → process → output
6. Keep workflows simple: 3-8 blocks is ideal

TYPED CONNECTIONS (n8n-style):
- For AI Agent (ai_agent), you MUST connect sub-nodes to typed ports:
  * Connect openai_chat_model or gemini_chat_model to the "ai_model" port
  * Optionally connect simple_memory or postgres_memory to the "ai_memory" port  
  * Optionally connect tool sub-nodes (http_tool, code_tool) to the "ai_tool" port
- Use sourceHandle/targetHandle to specify the port type
- Regular data flow uses "main" as the handle (default if omitted)

POSITIONING:
- Main flow: x=300, y increments by 150
- Sub-nodes: position to the LEFT of the main node (x=50-200)
- Sub-nodes should be at similar y-level as the node they connect to
`;

const EXAMPLE_WORKFLOW = `
EXAMPLE - AI Agent with Chat Model and Memory:
{
  "blocks": [
    { "id": "trigger-1", "type": "manual_trigger", "name": "Start", "config": {}, "position": { "x": 300, "y": 50 } },
    { "id": "model-1", "type": "openai_chat_model", "name": "OpenAI Chat Model", "config": { "model": "gpt-5-mini", "temperature": 0.7 }, "position": { "x": 50, "y": 200 } },
    { "id": "memory-1", "type": "simple_memory", "name": "Simple Memory", "config": { "maxMessages": 10 }, "position": { "x": 50, "y": 320 } },
    { "id": "agent-1", "type": "ai_agent", "name": "AI Agent", "config": { "systemPrompt": "You are a helpful assistant.", "userPrompt": "{{ $json.message }}" }, "position": { "x": 300, "y": 200 } },
    { "id": "output-1", "type": "log", "name": "Log Response", "config": { "level": "info", "message": "{{ $json.response }}" }, "position": { "x": 300, "y": 380 } }
  ],
  "connections": [
    { "id": "c1", "sourceBlockId": "trigger-1", "targetBlockId": "agent-1", "sourceHandle": "main", "targetHandle": "main" },
    { "id": "c2", "sourceBlockId": "model-1", "targetBlockId": "agent-1", "sourceHandle": "ai_model", "targetHandle": "ai_model" },
    { "id": "c3", "sourceBlockId": "memory-1", "targetBlockId": "agent-1", "sourceHandle": "ai_memory", "targetHandle": "ai_memory" },
    { "id": "c4", "sourceBlockId": "agent-1", "targetBlockId": "output-1", "sourceHandle": "main", "targetHandle": "main" }
  ],
  "description": "AI Agent with OpenAI model and conversation memory"
}

EXAMPLE - Simple email summary (no sub-nodes needed):
{
  "blocks": [
    { "id": "trigger-1", "type": "email_trigger", "name": "Get Email", "config": { "provider": "gmail", "query": "is:unread", "maxResults": 1 }, "position": { "x": 300, "y": 50 } },
    { "id": "summarize-1", "type": "ai_summarize", "name": "Summarize", "config": { "input": "{{ $json.body }}", "style": "brief" }, "position": { "x": 300, "y": 200 } },
    { "id": "save-1", "type": "database_insert", "name": "Save", "config": { "table": "email_summaries", "data": { "summary": "{{ $json.summary }}" } }, "position": { "x": 300, "y": 350 } }
  ],
  "connections": [
    { "id": "c1", "sourceBlockId": "trigger-1", "targetBlockId": "summarize-1" },
    { "id": "c2", "sourceBlockId": "summarize-1", "targetBlockId": "save-1" }
  ],
  "description": "Summarize incoming emails and save to database"
}
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

ALLOWED BLOCK TYPES (USE ONLY THESE):
${ALLOWED_BLOCKS}

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

RULES FOR MODIFICATIONS:
1. ONLY use block types from the ALLOWED BLOCKS list - you CANNOT invent new ones
2. Preserve block IDs when possible to maintain references
3. Keep existing connections unless explicitly asked to change them
4. When adding blocks, position them logically (increment y by 150)
5. When removing blocks, also remove their connections
6. Use sourceHandle/targetHandle for typed port connections
7. Return the COMPLETE modified workflow, not just the changes`;

      userPrompt = `Here is the CURRENT workflow:
${JSON.stringify(existingWorkflow, null, 2)}

MODIFICATION REQUEST: ${modificationRequest}

Apply the modification and output the COMPLETE modified workflow as JSON. 
IMPORTANT: Use ONLY block types from the allowed list. Do not invent new block types.`;

    } else {
      systemPrompt = `You are "AETHER Flow Designer", an expert AI that creates automation workflows like n8n.
You MUST output ONLY valid JSON matching the workflow schema. No explanations, no markdown, just JSON.

ALLOWED BLOCK TYPES (USE ONLY THESE):
${ALLOWED_BLOCKS}

WORKFLOW SCHEMA:
${WORKFLOW_SCHEMA}

${EXAMPLE_WORKFLOW}

CRITICAL RULES:
1. Use ONLY the block types listed above - you CANNOT invent new ones
2. Create the MINIMUM number of blocks needed (usually 3-8 blocks)
3. NEVER use placeholder URLs like "api.example.com" - these will FAIL
4. Use expression syntax {{ $json.field }} to reference data from previous blocks
5. Start with exactly ONE trigger block
6. For AI Agent workflows, ALWAYS connect sub-nodes for Chat Model (required) and optionally Memory/Tools
7. Use typed connections (sourceHandle/targetHandle) when connecting to typed ports`;

      userPrompt = `Create a workflow for: ${objective}

${context ? `Context: ${context}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}

IMPORTANT:
- Use ONLY block types from the allowed list (no custom blocks)
- Create the minimum blocks needed (3-8 typically)
- For AI agents, connect the required Chat Model sub-node
- Use expression syntax {{ $json.field }} to pass data between blocks
- Do NOT use http_request with fake URLs

Output ONLY valid JSON. No markdown, no explanations.`;
    }

    console.log('Calling AI Gateway for:', isModification ? 'modification' : 'generation');

    // Streaming mode
    if (stream) {
      console.log('Using streaming mode...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      
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

    // Non-streaming mode
    console.log('Making AI request (non-streaming)...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Request timeout after 120s');
      controller.abort();
    }, 120000);
    
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
            type: 'manual_trigger',
            name: 'Start',
            config: {},
            position: { x: 300, y: 50 }
          },
          {
            id: 'ai-1',
            type: 'ai_prompt',
            name: 'Process with AI',
            config: { 
              model: 'openai/gpt-5-mini',
              prompt: objective,
              temperature: 0.7
            },
            position: { x: 300, y: 200 }
          }
        ],
        connections: [
          {
            id: 'conn-1',
            sourceBlockId: 'trigger-1',
            targetBlockId: 'ai-1'
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

    // Position blocks properly
    workflow.blocks = workflow.blocks.map((block: any, index: number) => ({
      ...block,
      id: block.id || `block-${index + 1}`,
      position: block.position || { x: 300, y: 50 + index * 150 }
    }));

    // If no connections were generated but we have multiple blocks, create linear connections for main blocks
    if (workflow.connections.length === 0 && workflow.blocks.length > 1) {
      const mainBlocks = workflow.blocks.filter((b: any) => !b.type.includes('_model') && !b.type.includes('_memory') && !b.type.includes('_tool') && !b.type.includes('_embeddings'));
      workflow.connections = mainBlocks.slice(0, -1).map((block: any, index: number) => ({
        id: `conn-${index + 1}`,
        sourceBlockId: block.id,
        targetBlockId: mainBlocks[index + 1].id,
        sourceHandle: 'main',
        targetHandle: 'main'
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
