import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowBlock {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  retryConfig?: {
    enabled: boolean;
    maxRetries: number;
    backoffMs: number;
  };
  timeout?: number;
  parallel?: boolean;
}

interface BlockConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceHandle?: string;
}

interface ExecutionContext {
  workflowId: string;
  runId: string;
  userId: string;
  variables: Record<string, any>;
  blocksStatus: Record<string, BlockStatus>;
}

interface BlockStatus {
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  retryCount?: number;
}

// Build dependency graph
function buildDependencyGraph(blocks: WorkflowBlock[], connections: BlockConnection[]) {
  const graph: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};
  
  blocks.forEach(b => {
    graph[b.id] = [];
    inDegree[b.id] = 0;
  });
  
  connections.forEach(c => {
    graph[c.sourceBlockId].push(c.targetBlockId);
    inDegree[c.targetBlockId] = (inDegree[c.targetBlockId] || 0) + 1;
  });
  
  return { graph, inDegree };
}

// Find blocks that can run (no pending dependencies)
function findReadyBlocks(
  blocks: WorkflowBlock[],
  graph: Record<string, string[]>,
  completed: Set<string>,
  running: Set<string>
): WorkflowBlock[] {
  return blocks.filter(block => {
    if (completed.has(block.id) || running.has(block.id)) return false;
    
    // Check if all dependencies are completed
    const dependencies = blocks.filter(b => 
      graph[b.id]?.includes(block.id)
    );
    
    return dependencies.every(d => completed.has(d.id));
  });
}

// Execute a single block with retry logic
async function executeBlock(
  block: WorkflowBlock,
  input: any,
  context: ExecutionContext,
  supabase: any
): Promise<{ output: any; error?: string }> {
  const startTime = Date.now();
  const maxRetries = block.retryConfig?.enabled ? block.retryConfig.maxRetries : 0;
  const backoffMs = block.retryConfig?.backoffMs || 1000;
  
  let lastError: string | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      context.blocksStatus[block.id] = {
        status: 'running',
        startedAt: new Date().toISOString(),
        input,
        retryCount: attempt,
      };
      
      // Execute based on block type
      const output = await executeBlockLogic(block, input, context);
      
      const duration = Date.now() - startTime;
      context.blocksStatus[block.id] = {
        status: 'success',
        startedAt: context.blocksStatus[block.id].startedAt,
        completedAt: new Date().toISOString(),
        duration,
        input,
        output,
        retryCount: attempt,
      };
      
      return { output };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed
  const duration = Date.now() - startTime;
  context.blocksStatus[block.id] = {
    status: 'error',
    startedAt: context.blocksStatus[block.id]?.startedAt,
    completedAt: new Date().toISOString(),
    duration,
    input,
    error: lastError,
    retryCount: maxRetries,
  };
  
  return { output: null, error: lastError };
}

// Block execution logic based on type
async function executeBlockLogic(
  block: WorkflowBlock,
  input: any,
  context: ExecutionContext
): Promise<any> {
  const { type, config } = block;
  
  // Trigger blocks just pass through
  if (type.startsWith('trigger_')) {
    return input || config;
  }
  
  // AI blocks
  if (type.startsWith('ai_')) {
    return await executeAIBlock(type, config, input);
  }
  
  // Transform blocks
  if (type.startsWith('transform_')) {
    return executeTransformBlock(type, config, input);
  }
  
  // Control flow blocks
  if (type.startsWith('control_')) {
    return executeControlBlock(type, config, input, context);
  }
  
  // HTTP blocks
  if (type === 'http_request') {
    return await executeHttpRequest(config, input);
  }
  
  // Default: pass through with config applied
  return { ...input, ...config };
}

async function executeAIBlock(type: string, config: any, input: any) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }
  
  const prompt = buildAIPrompt(type, config, input);
  
  const response = await fetch('https://api.lovable.dev/ai', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  
  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    result: data.choices?.[0]?.message?.content || data.content,
    model: 'gemini-2.5-flash',
  };
}

function buildAIPrompt(type: string, config: any, input: any): string {
  const inputText = typeof input === 'string' ? input : JSON.stringify(input);
  
  switch (type) {
    case 'ai_summary':
      return `Summarize the following content concisely:\n\n${inputText}`;
    case 'ai_extract':
      return `Extract the following information from the text: ${config.fields || 'key entities'}\n\nText:\n${inputText}`;
    case 'ai_classify':
      const categories = config.categories?.join(', ') || 'positive, negative, neutral';
      return `Classify the following text into one of these categories: ${categories}\n\nText:\n${inputText}`;
    case 'ai_generate':
      return config.prompt?.replace('{{input}}', inputText) || inputText;
    case 'ai_translate':
      return `Translate the following text to ${config.targetLanguage || 'English'}:\n\n${inputText}`;
    case 'ai_sentiment':
      return `Analyze the sentiment of this text and respond with a JSON object containing: sentiment (positive/negative/neutral), confidence (0-1), and key_phrases.\n\nText:\n${inputText}`;
    default:
      return inputText;
  }
}

function executeTransformBlock(type: string, config: any, input: any): any {
  switch (type) {
    case 'transform_json':
      if (typeof input === 'string') {
        try {
          return JSON.parse(input);
        } catch {
          return { raw: input };
        }
      }
      return input;
      
    case 'transform_filter':
      if (!Array.isArray(input)) return input;
      const filterKey = config.key;
      const filterValue = config.value;
      return input.filter(item => item[filterKey] === filterValue);
      
    case 'transform_map':
      if (!Array.isArray(input)) return input;
      const mapField = config.field;
      return input.map(item => item[mapField] || item);
      
    case 'transform_merge':
      return { ...input, ...config.data };
      
    default:
      return input;
  }
}

function executeControlBlock(type: string, config: any, input: any, context: ExecutionContext): any {
  switch (type) {
    case 'control_condition':
      const field = config.field;
      const operator = config.operator || 'equals';
      const value = config.value;
      const inputValue = input?.[field];
      
      let result = false;
      switch (operator) {
        case 'equals': result = inputValue === value; break;
        case 'not_equals': result = inputValue !== value; break;
        case 'contains': result = String(inputValue).includes(value); break;
        case 'greater_than': result = Number(inputValue) > Number(value); break;
        case 'less_than': result = Number(inputValue) < Number(value); break;
      }
      
      return { ...input, _condition: result, _branch: result ? 'true' : 'false' };
      
    case 'control_delay':
      // Delay is handled by the executor
      return input;
      
    default:
      return input;
  }
}

async function executeHttpRequest(config: any, input: any): Promise<any> {
  const url = config.url?.replace(/\{\{(\w+)\}\}/g, (_: any, key: string) => input?.[key] || '');
  const method = config.method || 'GET';
  const headers = config.headers || {};
  
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  
  if (['POST', 'PUT', 'PATCH'].includes(method) && config.body) {
    options.body = JSON.stringify(config.body);
  }
  
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { workflowId, inputData, runId } = await req.json();

    if (!workflowId) {
      return new Response(JSON.stringify({ error: 'workflowId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch workflow
    const { data: workflow, error: wfError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('user_id', user.id)
      .single();

    if (wfError || !workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const blocks: WorkflowBlock[] = workflow.blocks || [];
    const connections: BlockConnection[] = workflow.connections || [];
    const variables: Record<string, any> = workflow.variables || {};

    // Create or update run
    let currentRunId = runId;
    if (!currentRunId) {
      const { data: newRun, error: runError } = await supabase
        .from('workflow_runs')
        .insert({
          workflow_id: workflowId,
          user_id: user.id,
          status: 'running',
          input_data: inputData,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (runError) {
        throw new Error(`Failed to create run: ${runError.message}`);
      }
      currentRunId = newRun.id;
    } else {
      await supabase
        .from('workflow_runs')
        .update({ status: 'running', started_at: new Date().toISOString() })
        .eq('id', currentRunId);
    }

    // Initialize execution context
    const context: ExecutionContext = {
      workflowId,
      runId: currentRunId,
      userId: user.id,
      variables: { ...variables, input: inputData },
      blocksStatus: {},
    };

    // Build dependency graph
    const { graph, inDegree } = buildDependencyGraph(blocks, connections);

    // Execute workflow with parallel support
    const completed = new Set<string>();
    const running = new Set<string>();
    const blockOutputs: Record<string, any> = {};
    
    // Initialize trigger blocks with input data
    const triggerBlocks = blocks.filter(b => b.type.startsWith('trigger_'));
    triggerBlocks.forEach(b => {
      blockOutputs[b.id] = inputData;
    });

    let hasError = false;
    const startTime = Date.now();

    while (completed.size < blocks.length && !hasError) {
      const readyBlocks = findReadyBlocks(blocks, graph, completed, running);
      
      if (readyBlocks.length === 0 && running.size === 0) {
        // No blocks to run and none running - check for cycles or orphans
        break;
      }

      // Execute ready blocks in parallel
      const execPromises = readyBlocks.map(async (block) => {
        running.add(block.id);
        
        // Get input from connected source blocks
        const sourceConnections = connections.filter(c => c.targetBlockId === block.id);
        let input = inputData;
        
        if (sourceConnections.length > 0) {
          // Merge outputs from all source blocks
          input = sourceConnections.reduce((acc, conn) => {
            const sourceOutput = blockOutputs[conn.sourceBlockId];
            return { ...acc, ...sourceOutput };
          }, {});
        }
        
        const result = await executeBlock(block, input, context, supabase);
        
        running.delete(block.id);
        completed.add(block.id);
        
        if (result.error) {
          hasError = true;
        } else {
          blockOutputs[block.id] = result.output;
        }
        
        return { blockId: block.id, ...result };
      });

      await Promise.all(execPromises);

      // Update run status periodically
      await supabase
        .from('workflow_runs')
        .update({
          blocks_status: context.blocksStatus,
        })
        .eq('id', currentRunId);
    }

    // Finalize run
    const totalDuration = Date.now() - startTime;
    const finalOutput = Object.values(blockOutputs).pop();

    await supabase
      .from('workflow_runs')
      .update({
        status: hasError ? 'failed' : 'completed',
        output_data: finalOutput,
        blocks_status: context.blocksStatus,
        completed_at: new Date().toISOString(),
      })
      .eq('id', currentRunId);

    return new Response(JSON.stringify({
      success: !hasError,
      runId: currentRunId,
      output: finalOutput,
      blocksExecuted: completed.size,
      totalDuration,
      blocksStatus: context.blocksStatus,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Workflow execution error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Execution failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
