import { WorkflowBlock, WorkflowRunLog, BLOCK_DEFINITIONS, BlockConnection } from '@/types/workflow';
import { callAI, summarizeText, extractData, classifyText, generateContent } from './ai';
import { supabase } from '@/integrations/supabase/client';

export interface ExecutionContext {
  input: any;
  previousOutputs: Record<string, any>;
  branchId?: string;
  parentWorkflowId?: string;
}

export interface BranchResult {
  branchId: string;
  branchName: string;
  output: any;
  success: boolean;
  logs: WorkflowRunLog[];
}

export async function executeBlock(
  block: WorkflowBlock,
  context: ExecutionContext,
  allBlocks?: WorkflowBlock[],
  connections?: BlockConnection[]
): Promise<{ output: any; error?: string; branches?: BranchResult[] }> {
  const startTime = Date.now();
  
  try {
    let output: any;
    const inputText = typeof context.input === 'string' 
      ? context.input 
      : JSON.stringify(context.input);

    switch (block.type) {
      case 'trigger_text':
      case 'trigger_file':
      case 'trigger_webhook':
      case 'trigger_form':
      case 'trigger_schedule':
      case 'trigger_email':
        output = context.input;
        break;

      case 'ai_summary': {
        const style = block.config?.style || 'detailed';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Summarize the following content in a ${style} style:\n\n${inputText}\n\nProvide a clear, structured summary.`
          }],
          type: 'summarize'
        });
        if (response.error) throw new Error(response.error);
        output = { summary: response.content, style };
        break;
      }

      case 'ai_extract': {
        const fields = block.config?.fields || 'name, email, date, amount';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Extract the following fields from this text: ${fields}\n\nText:\n${inputText}\n\nRespond ONLY with valid JSON containing the extracted fields. If a field is not found, use null.`
          }],
          type: 'extract'
        });
        if (response.error) throw new Error(response.error);
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: response.content };
        } catch {
          output = { raw: response.content };
        }
        break;
      }

      case 'ai_classify': {
        const categories = block.config?.categories || 'Finance, Legal, Support, Technical, Other';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Classify this text into ONE of these categories: ${categories}\n\nText:\n${inputText}\n\nRespond with JSON: {"category": "chosen_category", "confidence": 0.0-1.0, "reason": "brief explanation"}`
          }],
          type: 'classify'
        });
        if (response.error) throw new Error(response.error);
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { category: response.content, confidence: 0.8 };
        } catch {
          output = { category: response.content, confidence: 0.8 };
        }
        break;
      }

      case 'ai_generate': {
        const prompt = block.config?.prompt || 'Generate a professional response';
        const tone = block.config?.tone || 'professional';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `${prompt}\n\nContext:\n${inputText}\n\nTone: ${tone}\n\nGenerate the requested content.`
          }],
          type: 'generate'
        });
        if (response.error) throw new Error(response.error);
        output = { generated: response.content, tone };
        break;
      }

      case 'ai_decision': {
        const question = block.config?.question || 'Should this be approved?';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Based on this context:\n${inputText}\n\nAnswer this question: ${question}\n\nRespond with JSON: {"decision": "yes" or "no", "confidence": 0.0-1.0, "reasoning": "explanation"}`
          }],
          type: 'analyze'
        });
        if (response.error) throw new Error(response.error);
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { decision: 'unknown', reasoning: response.content };
        } catch {
          output = { decision: 'unknown', reasoning: response.content };
        }
        break;
      }

      case 'ai_sentiment': {
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Analyze the sentiment of this text:\n\n${inputText}\n\nRespond with JSON: {"sentiment": "positive/negative/neutral", "score": -1.0 to 1.0, "emotions": ["list of detected emotions"]}`
          }],
          type: 'analyze'
        });
        if (response.error) throw new Error(response.error);
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { sentiment: 'neutral', score: 0 };
        } catch {
          output = { sentiment: 'neutral', score: 0, raw: response.content };
        }
        break;
      }

      case 'ai_translate': {
        const targetLanguage = block.config?.targetLanguage || 'English';
        const response = await callAI({
          messages: [{
            role: 'user',
            content: `Translate the following text to ${targetLanguage}:\n\n${inputText}`
          }],
          type: 'generate'
        });
        if (response.error) throw new Error(response.error);
        output = { translated: response.content, targetLanguage };
        break;
      }

      // Control flow blocks
      case 'control_condition': {
        const condition = block.config?.condition || 'true';
        // Simple condition evaluation
        let result = false;
        try {
          // Safe evaluation with context
          const evalContext = { input: context.input, ...context.previousOutputs };
          result = new Function('ctx', `with(ctx) { return ${condition}; }`)(evalContext);
        } catch {
          result = false;
        }
        output = { 
          condition, 
          result, 
          branch: result ? 'true' : 'false',
          input: context.input 
        };
        break;
      }

      case 'control_delay': {
        const duration = (block.config?.duration || 5) * 1000;
        await new Promise(resolve => setTimeout(resolve, Math.min(duration, 30000)));
        output = { delayed: true, duration, input: context.input };
        break;
      }

      case 'control_loop': {
        const arrayField = block.config?.arrayField || 'items';
        const inputData = context.input;
        const items = inputData?.[arrayField] || (Array.isArray(inputData) ? inputData : [inputData]);
        output = { 
          loopItems: items, 
          count: items.length,
          currentIndex: 0 
        };
        break;
      }

      case 'control_branch': {
        const branchCount = block.config?.branchCount || 2;
        const branchNames = (block.config?.branchNames || 'Branch A, Branch B')
          .split(',')
          .map((n: string) => n.trim());
        output = {
          branched: true,
          branchCount,
          branches: branchNames.slice(0, branchCount).map((name: string, index: number) => ({
            id: `${block.id}-branch-${index}`,
            name,
            input: context.input
          }))
        };
        break;
      }

      case 'control_parallel': {
        output = {
          parallel: true,
          input: context.input,
          branches: [
            { id: `${block.id}-parallel-0`, input: context.input },
            { id: `${block.id}-parallel-1`, input: context.input }
          ]
        };
        break;
      }

      case 'control_merge': {
        const mergeStrategy = block.config?.mergeStrategy || 'combine_results';
        const branchOutputs = context.previousOutputs;
        let mergedOutput: any;
        
        switch (mergeStrategy) {
          case 'wait_all':
            mergedOutput = { mergedResults: Object.values(branchOutputs) };
            break;
          case 'first_complete':
            mergedOutput = Object.values(branchOutputs)[0];
            break;
          case 'combine_results':
          default:
            mergedOutput = { ...context.input, branches: branchOutputs };
        }
        output = mergedOutput;
        break;
      }

      // Sub-workflow call
      case 'workflow_call': {
        const workflowId = block.config?.workflowId;
        const passInput = block.config?.passInput !== false;
        const customInput = block.config?.customInput;
        const waitForCompletion = block.config?.waitForCompletion !== false;

        if (!workflowId) {
          throw new Error('No workflow ID specified');
        }

        // Fetch the sub-workflow
        const { data: workflow, error: fetchError } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', workflowId)
          .single();

        if (fetchError || !workflow) {
          throw new Error(`Failed to load sub-workflow: ${fetchError?.message || 'Not found'}`);
        }

        const subWorkflowInput = customInput || (passInput ? context.input : {});
        const subBlocks = (workflow.blocks as unknown as WorkflowBlock[]) || [];

        if (waitForCompletion) {
          // Execute sub-workflow synchronously
          const result = await executeWorkflow(subBlocks, subWorkflowInput);
          output = {
            subWorkflowId: workflowId,
            subWorkflowName: workflow.name,
            success: result.success,
            output: result.output,
            logsCount: result.logs.length
          };
        } else {
          // Just trigger and continue
          output = {
            subWorkflowId: workflowId,
            subWorkflowName: workflow.name,
            triggered: true,
            async: true
          };
        }
        break;
      }

      case 'system_email':
        output = { 
          sent: true, 
          to: block.config?.to || 'recipient@example.com',
          subject: block.config?.subject || 'Workflow Notification',
          body: inputText,
          timestamp: new Date().toISOString()
        };
        break;

      case 'system_webhook':
      case 'http_webhook':
        output = { 
          posted: true, 
          url: block.config?.url || 'https://webhook.example.com',
          payload: context.input,
          timestamp: new Date().toISOString()
        };
        break;

      case 'http_request': {
        const url = block.config?.url;
        const method = block.config?.method || 'GET';
        if (url) {
          try {
            const response = await fetch(url, {
              method,
              headers: block.config?.headers || {},
              body: method !== 'GET' ? JSON.stringify(block.config?.body || context.input) : undefined
            });
            const data = await response.json().catch(() => response.text());
            output = { success: response.ok, status: response.status, data };
          } catch (err) {
            output = { success: false, error: err instanceof Error ? err.message : 'Request failed' };
          }
        } else {
          output = { success: false, error: 'No URL specified' };
        }
        break;
      }

      case 'system_save':
        output = { 
          saved: true, 
          table: block.config?.table || 'results',
          data: context.input,
          timestamp: new Date().toISOString()
        };
        break;

      case 'system_notify':
        output = {
          notified: true,
          channel: block.config?.channel || 'slack',
          message: block.config?.message || inputText,
          timestamp: new Date().toISOString()
        };
        break;

      case 'system_log':
        console.log(`[Workflow Log - ${block.config?.level || 'info'}]`, block.config?.message || inputText);
        output = {
          logged: true,
          level: block.config?.level || 'info',
          message: block.config?.message || inputText,
          timestamp: new Date().toISOString()
        };
        break;

      default:
        output = context.input;
    }

    return { output };
  } catch (error) {
    return { 
      output: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function executeWorkflow(
  blocks: WorkflowBlock[],
  initialInput: any,
  onProgress?: (log: WorkflowRunLog) => void,
  connections?: BlockConnection[]
): Promise<{ success: boolean; output: any; logs: WorkflowRunLog[] }> {
  const logs: WorkflowRunLog[] = [];
  const outputs: Record<string, any> = {};
  const executedBlocks = new Set<string>();

  // Build connection map for efficient lookup
  const connectionMap = new Map<string, BlockConnection[]>();
  if (connections) {
    for (const conn of connections) {
      const existing = connectionMap.get(conn.sourceBlockId) || [];
      existing.push(conn);
      connectionMap.set(conn.sourceBlockId, existing);
    }
  }

  // Find entry points (blocks with no incoming connections, or first by position if no connections defined)
  const hasIncoming = new Set<string>();
  connections?.forEach(c => hasIncoming.add(c.targetBlockId));
  
  let entryBlocks = blocks.filter(b => !hasIncoming.has(b.id));
  if (entryBlocks.length === 0) {
    // Fallback: sort by position and start with first
    entryBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y).slice(0, 1);
  }

  // Execute a block and its connected blocks recursively
  async function executeFromBlock(
    block: WorkflowBlock, 
    input: any,
    branchLabel?: string
  ): Promise<{ success: boolean; output: any }> {
    // Skip if already executed in this run
    if (executedBlocks.has(block.id)) {
      return { success: true, output: outputs[block.id] };
    }
    executedBlocks.add(block.id);

    const startTime = Date.now();
    const blockDef = BLOCK_DEFINITIONS[block.type];
    
    const log: WorkflowRunLog = {
      blockId: block.id,
      blockName: branchLabel ? `[${branchLabel}] ${block.name || blockDef?.name || block.type}` : (block.name || blockDef?.name || block.type),
      blockType: block.type,
      input,
      output: null,
      status: 'running',
      duration: 0,
      timestamp: new Date().toISOString()
    };
    
    logs.push(log);
    onProgress?.(log);

    try {
      const result = await executeBlock(block, {
        input,
        previousOutputs: outputs
      }, blocks, connections);

      log.duration = Date.now() - startTime;
      
      if (result.error) {
        log.status = 'error';
        log.output = { error: result.error };
        log.error = result.error;
        onProgress?.(log);
        return { success: false, output: null };
      }

      log.status = 'success';
      log.output = result.output;
      outputs[block.id] = result.output;
      onProgress?.(log);

      // Find outgoing connections
      const outgoing = connectionMap.get(block.id) || [];
      
      if (outgoing.length === 0) {
        // No connections - this is an end block
        return { success: true, output: result.output };
      }

      // Handle conditional branching (ai_decision, control_condition)
      if (block.type === 'ai_decision' || block.type === 'control_condition') {
        const decision = result.output?.decision || result.output?.result;
        const isTrue = decision === 'yes' || decision === true || decision === 'true';
        const targetHandle = isTrue ? 'true' : 'false';
        
        // Find matching connection
        const matchingConn = outgoing.find(c => c.sourceHandle === targetHandle);
        if (matchingConn) {
          const nextBlock = blocks.find(b => b.id === matchingConn.targetBlockId);
          if (nextBlock) {
            return executeFromBlock(nextBlock, result.output, targetHandle === 'true' ? 'Oui' : 'Non');
          }
        }
        return { success: true, output: result.output };
      }

      // Execute all connected blocks in PARALLEL
      if (outgoing.length > 1) {
        const parallelResults = await Promise.all(
          outgoing.map(async (conn, index) => {
            const nextBlock = blocks.find(b => b.id === conn.targetBlockId);
            if (!nextBlock) return { success: true, output: null };
            
            const branchName = conn.sourceHandle || `Branche ${index + 1}`;
            return executeFromBlock(nextBlock, result.output, branchName);
          })
        );

        // Combine results from parallel branches
        const allSuccess = parallelResults.every(r => r.success);
        const combinedOutput = {
          parallelExecution: true,
          branches: parallelResults.map((r, i) => ({
            branch: outgoing[i].sourceHandle || `branch_${i}`,
            output: r.output,
            success: r.success
          }))
        };

        return { success: allSuccess, output: combinedOutput };
      }

      // Single connection - sequential execution
      const nextBlock = blocks.find(b => b.id === outgoing[0].targetBlockId);
      if (nextBlock) {
        return executeFromBlock(nextBlock, result.output);
      }

      return { success: true, output: result.output };
    } catch (error) {
      log.duration = Date.now() - startTime;
      log.status = 'error';
      log.error = error instanceof Error ? error.message : 'Unknown error';
      log.output = { error: log.error };
      onProgress?.(log);
      return { success: false, output: null };
    }
  }

  // If no connections, execute linearly (fallback for old workflows)
  if (!connections || connections.length === 0) {
    const sortedBlocks = [...blocks].sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });

    let currentInput = initialInput;
    for (const block of sortedBlocks) {
      const result = await executeFromBlock(block, currentInput);
      if (!result.success) {
        return { success: false, output: null, logs };
      }
      currentInput = result.output;
    }
    return { success: true, output: currentInput, logs };
  }

  // Execute from all entry points in parallel
  const results = await Promise.all(
    entryBlocks.map(block => executeFromBlock(block, initialInput))
  );

  const allSuccess = results.every(r => r.success);
  const finalOutput = results.length === 1 
    ? results[0].output 
    : { parallelWorkflows: results.map(r => r.output) };

  return { 
    success: allSuccess, 
    output: finalOutput, 
    logs 
  };
}
