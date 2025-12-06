import { WorkflowBlock, WorkflowRunLog, BLOCK_DEFINITIONS } from '@/types/workflow';
import { callAI, summarizeText, extractData, classifyText, generateContent } from './ai';

export interface ExecutionContext {
  input: any;
  previousOutputs: Record<string, any>;
}

export async function executeBlock(
  block: WorkflowBlock,
  context: ExecutionContext
): Promise<{ output: any; error?: string }> {
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
        output = { 
          posted: true, 
          url: block.config?.url || 'https://webhook.example.com',
          payload: context.input,
          timestamp: new Date().toISOString()
        };
        break;

      case 'system_save':
        output = { 
          saved: true, 
          table: block.config?.table || 'results',
          data: context.input,
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
  onProgress?: (log: WorkflowRunLog) => void
): Promise<{ success: boolean; output: any; logs: WorkflowRunLog[] }> {
  const logs: WorkflowRunLog[] = [];
  let currentInput = initialInput;
  const outputs: Record<string, any> = {};

  // Sort blocks by position (top to bottom, left to right)
  const sortedBlocks = [...blocks].sort((a, b) => {
    if (a.position.y !== b.position.y) return a.position.y - b.position.y;
    return a.position.x - b.position.x;
  });

  for (const block of sortedBlocks) {
    const startTime = Date.now();
    const blockDef = BLOCK_DEFINITIONS[block.type];
    
    const log: WorkflowRunLog = {
      blockId: block.id,
      blockName: block.name || blockDef?.name || block.type,
      blockType: block.type,
      input: currentInput,
      output: null,
      status: 'pending',
      duration: 0,
      timestamp: new Date().toISOString()
    };

    try {
      const result = await executeBlock(block, {
        input: currentInput,
        previousOutputs: outputs
      });

      log.duration = Date.now() - startTime;
      
      if (result.error) {
        log.status = 'error';
        log.output = { error: result.error };
        logs.push(log);
        onProgress?.(log);
        return { success: false, output: null, logs };
      }

      log.status = 'success';
      log.output = result.output;
      outputs[block.id] = result.output;
      
      // Pass output to next block
      currentInput = result.output;
    } catch (error) {
      log.duration = Date.now() - startTime;
      log.status = 'error';
      log.output = { error: error instanceof Error ? error.message : 'Unknown error' };
      logs.push(log);
      onProgress?.(log);
      return { success: false, output: null, logs };
    }

    logs.push(log);
    onProgress?.(log);
  }

  return { 
    success: true, 
    output: currentInput, 
    logs 
  };
}
