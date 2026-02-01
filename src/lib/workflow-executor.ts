import { WorkflowBlock, WorkflowRunLog, WorkflowErrorDetails, BLOCK_DEFINITIONS, BlockConnection } from '@/types/workflow';
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

// Execute workflow via Edge Function (server-side) for proper AI access
export async function executeWorkflowViaServer(
  blocks: WorkflowBlock[],
  initialInput: any,
  workflowId?: string,
  variables?: Record<string, any>,
  connections?: BlockConnection[]
): Promise<{
  success: boolean;
  output: any;
  error?: string;
  errorDetails?: WorkflowErrorDetails;
  failedBlockId?: string;
  failedBlockName?: string;
  failedBlockType?: string;
  logs: WorkflowRunLog[];
}> {
  // IMPORTANT: This must never throw for “expected” runtime failures (OAuth disconnected,
  // missing credentials, 401, etc.). Those should be represented as a failed workflow run,
  // not as an app-level exception.
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        output: null,
        error: 'Authentification requise pour exécuter le workflow',
        errorDetails: {
          code: 'auth_required',
          message: 'Authentification requise pour exécuter le workflow',
          hint: 'Connectez-vous puis relancez l’exécution.',
        },
        logs: [],
      };
    }

    const { data, error } = await supabase.functions.invoke('workflow-execute', {
      body: {
        blocks,
        input: initialInput,
        workflowId,
        variables: variables || {},
        connections: connections || [],
      },
    });

    if (error) {
      const msg = error.message || 'Échec de l’exécution du workflow';
      const looksLikeOAuth = /oauth|google|gmail|token/i.test(msg);
      return {
        success: false,
        output: null,
        error: msg,
        errorDetails: {
          code: looksLikeOAuth ? 'oauth_disconnected' : 'server_error',
          message: msg,
          hint: looksLikeOAuth
            ? 'Votre compte Google est probablement déconnecté/expiré. Reconnectez-le dans le bloc puis relancez le workflow.'
            : 'Réessayez. Si le problème persiste, vérifiez la configuration du bloc qui échoue.',
        },
        logs: [],
      };
    }

    const result = (data || {}) as any;
    return {
      success: !!result.success,
      output: result.output,
      error: result.error,
      errorDetails: result.errorDetails,
      failedBlockId: result.failedBlockId,
      failedBlockName: result.failedBlockName,
      failedBlockType: result.failedBlockType,
      logs: result.logs || [],
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur réseau / exécution';
    console.error('Workflow execution via server failed (non-throwing):', error);
    return {
      success: false,
      output: null,
      error: msg,
      errorDetails: {
        code: 'network_error',
        message: msg,
        hint: 'Vérifiez votre connexion puis réessayez.',
      },
      logs: [],
    };
  }
}

// NOTE: AI blocks (ai_summary, ai_extract, ai_classify, etc.) are now executed server-side
// via the workflow-execute Edge Function which has direct access to Lovable AI Gateway.
// The client-side executeBlock is kept for non-AI blocks only as fallback.

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
      // Triggers - pass through input
      case 'trigger_manual':
      case 'trigger_webhook':
      case 'trigger_schedule':
      case 'trigger_event':
      case 'email_oauth':
        output = context.input;
        break;

      // AI blocks are handled server-side - return placeholder for client fallback
      case 'llm_call':
      case 'llm_structured':
      case 'llm_vision':
      case 'llm_embeddings':
        // These should be executed via executeWorkflowViaServer, not locally
        output = { 
          error: 'AI blocks must be executed via server. Use executeWorkflowViaServer instead.',
          requiresServer: true 
        };
        break;

      // Control flow blocks
      case 'condition': {
        const conditionExpr = block.config?.condition || 'true';
        // Simple condition evaluation
        let result = false;
        try {
          // Safe evaluation with context
          const evalContext = { input: context.input, ...context.previousOutputs };
          result = new Function('ctx', `with(ctx) { return ${conditionExpr}; }`)(evalContext);
        } catch {
          result = false;
        }
        output = { 
          condition: conditionExpr, 
          result, 
          branch: result ? 'true' : 'false',
          input: context.input 
        };
        break;
      }

      case 'wait': {
        const duration = (block.config?.duration || block.config?.seconds || 5) * 1000;
        await new Promise(resolve => setTimeout(resolve, Math.min(duration, 30000)));
        output = { delayed: true, duration, input: context.input };
        break;
      }

      case 'loop': {
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

      case 'switch': {
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

      case 'split': {
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

      case 'merge':
      case 'merge_data': {
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

      // Sub-workflow call via tool_call
      case 'tool_call': {
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

      case 'email_oauth': {
        // Email via OAuth (Gmail/Outlook) - handled via OAuth tokens
        const to = block.config?.to;
        const subject = block.config?.subject || 'Workflow Notification';
        if (!to) {
          output = { sent: false, warning: 'No recipient email configured', requiresSetup: true };
        } else {
          try {
            const { data, error } = await supabase.functions.invoke('send-workflow-email', {
              body: { to, subject, body: inputText, useOAuth: true }
            });
            if (error) {
              output = { 
                sent: false, 
                warning: 'Gmail OAuth not connected. Connect your Gmail account in the block settings.',
                to, 
                subject,
                body: inputText,
                requiresSetup: true,
                timestamp: new Date().toISOString()
              };
            } else {
              output = { sent: true, to, subject, timestamp: new Date().toISOString() };
            }
          } catch (err) {
            output = { 
              sent: false, 
              warning: 'Gmail OAuth not connected',
              to, 
              subject,
              requiresSetup: true,
              timestamp: new Date().toISOString()
            };
          }
        }
        break;
      }

      case 'http_response':
      case 'http_request': {
        // Real webhook POST
        const webhookUrl = block.config?.url;
        if (!webhookUrl || webhookUrl === 'https://webhook.example.com' || webhookUrl.includes('YOUR_')) {
          // Don't fail workflow - just indicate webhook not configured
          output = { 
            posted: false, 
            warning: 'No valid webhook URL configured',
            requiresSetup: true,
            payload: context.input,
            timestamp: new Date().toISOString()
          };
        } else {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            const response = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(block.config?.payload || context.input),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const textData = await response.text();
            let responseData: any = textData;
            try {
              responseData = JSON.parse(textData);
            } catch {
              // Keep as text
            }
            
            output = { 
              posted: response.ok, 
              status: response.status,
              url: webhookUrl,
              response: responseData,
              timestamp: new Date().toISOString()
            };
          } catch (err) {
            // Don't fail workflow - return error info but continue
            output = { 
              posted: false, 
              url: webhookUrl,
              warning: err instanceof Error ? err.message : 'Webhook request failed',
              timestamp: new Date().toISOString()
            };
          }
        }
        break;
      }

      case 'http_request': {
        const url = block.config?.url;
        const method = block.config?.method || 'GET';
        
        // Check if URL is a placeholder or not configured
        if (!url || url.includes('YOUR_') || url === 'https://example.com') {
          output = { 
            success: true, // Don't fail workflow
            warning: 'No valid URL configured - skipped',
            requiresSetup: true,
            url: url || 'not set',
            timestamp: new Date().toISOString()
          };
        } else {
          try {
            const response = await fetch(url, {
              method,
              headers: block.config?.headers || {},
              body: method !== 'GET' ? JSON.stringify(block.config?.body || context.input) : undefined
            });
            // Read body as text first, then try to parse as JSON
            const textData = await response.text();
            let data: any = textData;
            try {
              data = JSON.parse(textData);
            } catch {
              // Keep as text if not valid JSON
            }
            output = { success: response.ok, status: response.status, data, timestamp: new Date().toISOString() };
          } catch (err) {
            // Don't fail workflow - return warning instead
            output = { success: true, warning: err instanceof Error ? err.message : 'Request failed', timestamp: new Date().toISOString() };
          }
        }
        break;
      }

      case 'db_insert': {
        // Real save to Supabase
        const tableName = block.config?.table;
        if (!tableName) {
          output = { saved: false, warning: 'No table name configured', requiresSetup: true, timestamp: new Date().toISOString() };
        } else {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .insert(typeof context.input === 'object' ? context.input : { data: context.input })
              .select();
            
            if (error) throw error;
            output = { 
              saved: true, 
              table: tableName,
              insertedData: data,
              timestamp: new Date().toISOString()
            };
          } catch (err) {
            // Don't fail workflow - return warning instead
            output = { 
              saved: false, 
              table: tableName,
              warning: err instanceof Error ? err.message : 'Save failed',
              timestamp: new Date().toISOString()
            };
          }
        }
        break;
      }

      case 'message_send': {
        // Real notification via Slack webhook or similar
        const channel = block.config?.channel || 'slack';
        const webhookUrl = block.config?.webhookUrl;
        const message = block.config?.message || inputText;
        
        if (!webhookUrl) {
          output = { notified: false, channel, warning: 'No webhook URL configured for notifications', requiresSetup: true, timestamp: new Date().toISOString() };
        } else {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const payload = channel === 'slack' 
              ? { text: message }
              : { content: message }; // Discord format
            
            const response = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            output = {
              notified: response.ok,
              channel,
              status: response.status,
              timestamp: new Date().toISOString()
            };
          } catch (err) {
            // Don't fail workflow - return warning instead
            output = {
              notified: false,
              channel,
              warning: err instanceof Error ? err.message : 'Notification failed',
              timestamp: new Date().toISOString()
            };
          }
        }
        break;
      }

      case 'output_log':
        console.log(`[Workflow Log - ${block.config?.level || 'info'}]`, block.config?.message || inputText);
        output = {
          logged: true,
          level: block.config?.level || 'info',
          message: block.config?.message || inputText,
          timestamp: new Date().toISOString()
        };
        break;

      // ===== FILE GENERATION (PDF/DOCX) =====
      case 'file_write': {
        const title = block.config?.title;
        const content = block.config?.content;
        const prompt = block.config?.prompt;
        const docType = block.config?.type || 'rapport';
        const tone = block.config?.tone || 'professionnel';
        const folderId = block.config?.folderId;
        const tagsStr = block.config?.tags || '';
        
        if (!title) {
          output = { created: false, error: 'Document title is required' };
          break;
        }

        // Get user ID from session
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          output = { created: false, error: 'User authentication required for document creation' };
          break;
        }

        // Build context from workflow input
        const workflowContext = typeof context.input === 'string' 
          ? context.input 
          : JSON.stringify(context.input, null, 2);

        try {
          const tags = tagsStr.split(',').map((t: string) => t.trim()).filter((t: string) => t);
          
          const { data: fnResult, error: fnError } = await supabase.functions.invoke('workflow-generate-document', {
            body: {
              title,
              content: content || undefined,
              prompt: prompt || undefined,
              type: docType,
              tone,
              userId: user.id,
              workflowId: context.parentWorkflowId,
              context: workflowContext,
              folderId: folderId || undefined,
              tags: tags.length > 0 ? tags : ['workflow', 'auto-generated']
            }
          });

          if (fnError) {
            console.error('Document generation error:', fnError);
            output = { created: false, error: fnError.message || 'Document generation failed' };
          } else if (fnResult?.success) {
            output = {
              created: true,
              document: fnResult.document,
              documentId: fnResult.document?.id,
              title: fnResult.document?.title,
              fileUrl: fnResult.document?.file_url,
              fileType: 'application/pdf',
              timestamp: new Date().toISOString()
            };
          } else {
            output = { created: false, error: fnResult?.error || 'Unknown error during document generation' };
          }
        } catch (err) {
          console.error('Document creation error:', err);
          output = { created: false, error: err instanceof Error ? err.message : 'Document creation failed' };
        }
        break;
      }

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

      // Handle conditional branching (condition block)
      if (block.type === 'condition') {
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
