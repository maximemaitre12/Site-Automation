import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Helper to get user API key
async function getUserApiKey(userId: string, serviceName: string): Promise<string | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('api_key')
    .eq('user_id', userId)
    .eq('service_name', serviceName)
    .maybeSingle();
  
  if (error || !data) return null;
  return data.api_key;
}

// Safe expression evaluator - replaces eval() for security
// Supports: dot notation (a.b.c), bracket notation (a[0]), comparisons (>, <, ==, !=, >=, <=), logical ops (&&, ||, !)
function safeEvaluate(expression: string, context: Record<string, any>): any {
  // Sanitize expression - only allow safe characters
  const safePattern = /^[\w\s\.\[\]\(\)\&\|\!\=\<\>\,\'\"\:\-\+\*\/\?]+$/;
  if (!safePattern.test(expression)) {
    throw new Error(`Invalid expression: contains unsafe characters`);
  }

  // Block dangerous patterns
  const dangerousPatterns = [
    /\beval\b/i,
    /\bFunction\b/i,
    /\bimport\b/i,
    /\brequire\b/i,
    /\bDeno\b/i,
    /\bprocess\b/i,
    /\bfetch\b/i,
    /\bconstructor\b/i,
    /\b__proto__\b/i,
    /\bprototype\b/i,
    /\bwindow\b/i,
    /\bglobal\b/i,
    /\bthis\b/i,
    /\bself\b/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(expression)) {
      throw new Error(`Invalid expression: contains blocked keyword`);
    }
  }

  // Parse and evaluate simple path expressions like "data.field" or "data.items[0].name"
  const getValueByPath = (obj: any, path: string): any => {
    if (!path) return obj;
    
    const segments = path.match(/[^\.\[\]]+/g) || [];
    let current = obj;
    
    for (const segment of segments) {
      if (current === null || current === undefined) return undefined;
      current = current[segment];
    }
    
    return current;
  };

  // Handle simple comparisons and expressions
  const evaluateSimple = (expr: string, data: Record<string, any>): any => {
    expr = expr.trim();
    
    // Boolean literals
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    
    // Numeric literals
    if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);
    
    // String literals
    if (/^['"].*['"]$/.test(expr)) return expr.slice(1, -1);
    
    // Negation
    if (expr.startsWith('!')) {
      return !evaluateSimple(expr.slice(1), data);
    }

    // Comparison operators
    const comparisonMatch = expr.match(/^(.+?)\s*(===|!==|==|!=|>=|<=|>|<)\s*(.+)$/);
    if (comparisonMatch) {
      const left = evaluateSimple(comparisonMatch[1], data);
      const op = comparisonMatch[2];
      const right = evaluateSimple(comparisonMatch[3], data);
      
      switch (op) {
        case '===': return left === right;
        case '!==': return left !== right;
        case '==': return left == right;
        case '!=': return left != right;
        case '>': return left > right;
        case '<': return left < right;
        case '>=': return left >= right;
        case '<=': return left <= right;
      }
    }

    // Logical AND
    if (expr.includes('&&')) {
      const parts = expr.split('&&').map(p => p.trim());
      return parts.every(p => evaluateSimple(p, data));
    }

    // Logical OR
    if (expr.includes('||')) {
      const parts = expr.split('||').map(p => p.trim());
      return parts.some(p => evaluateSimple(p, data));
    }

    // Path expression (e.g., "item.status", "data.count")
    // Replace known variable names with their values
    let resolvedExpr = expr;
    for (const [key, value] of Object.entries(data)) {
      if (expr === key) return value;
      if (expr.startsWith(key + '.') || expr.startsWith(key + '[')) {
        const subPath = expr.slice(key.length);
        return getValueByPath(value, subPath.replace(/^\./, ''));
      }
    }

    // If it's a simple identifier, try to get it from context
    if (/^[\w]+$/.test(expr) && expr in data) {
      return data[expr];
    }

    return undefined;
  };

  return evaluateSimple(expression, context);
}

// Safe JSON path getter - replaces eval for data extraction
function safeGetPath(data: any, path: string): any {
  if (!path) return data;
  
  // Parse path like "field.subfield" or "array[0].item"
  const segments = path.match(/[^\.\[\]]+/g) || [];
  let current = data;
  
  for (const segment of segments) {
    if (current === null || current === undefined) return undefined;
    current = current[segment];
  }
  
  return current;
}

// Safe filter function - replaces eval in filter operations
function safeFilter(items: any[], condition: string): any[] {
  return items.filter((item, index) => {
    try {
      // Create evaluation context with item and index
      const context = {
        item,
        index,
        ...item, // Spread item properties for direct access
      };
      return Boolean(safeEvaluate(condition, context));
    } catch {
      return true; // Keep items that can't be evaluated
    }
  });
}

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
}

interface ExecutionLog {
  blockId: string;
  blockName: string;
  blockType: string;
  input: any;
  output: any;
  status: 'success' | 'error' | 'pending' | 'running' | 'skipped';
  duration: number;
  timestamp: string;
  retryCount?: number;
  error?: string;
}

interface ExecutionContext {
  input: any;
  previousOutputs: Record<string, any>;
  variables: Record<string, any>;
}

// Call Lovable AI Gateway
async function callLovableAI(prompt: string, systemPrompt?: string): Promise<string> {
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('AI Gateway error:', response.status, error);
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Execute a single block
async function executeBlock(block: WorkflowBlock, context: ExecutionContext): Promise<{ output: any; error?: string }> {
  const inputText = typeof context.input === 'string' 
    ? context.input 
    : JSON.stringify(context.input, null, 2);

  try {
    let output: any;

    switch (block.type) {
      // ===== TRIGGERS =====
      case 'trigger_text':
      case 'trigger_file':
      case 'trigger_webhook':
      case 'trigger_form':
      case 'trigger_schedule':
      case 'trigger_email':
        output = context.input;
        break;

      // ===== AI ACTIONS =====
      case 'ai_summary': {
        const style = block.config?.style || 'detailed';
        const maxLength = block.config?.maxLength || 200;
        const language = block.config?.language;
        
        const prompt = `Summarize the following content in a ${style} style. 
Maximum ${maxLength} words.${language ? ` Output in ${language}.` : ''}

Content to summarize:
${inputText}

Provide a clear, structured summary.`;
        
        const result = await callLovableAI(prompt);
        output = { summary: result, style, wordCount: result.split(' ').length };
        break;
      }

      case 'ai_extract': {
        const fields = block.config?.fields || 'name, email, date, amount';
        const strict = block.config?.strict ?? true;
        
        const prompt = `Extract the following fields from this text: ${fields}

Text to analyze:
${inputText}

IMPORTANT: Respond ONLY with valid JSON containing the extracted fields.
${strict ? 'If a field is not found, use null.' : 'If a field is not found, make a reasonable guess or use "unknown".'}
Do not include any explanation, only the JSON object.`;
        
        const result = await callLovableAI(prompt);
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result, _extractionFailed: true };
        } catch {
          output = { raw: result, _extractionFailed: true };
        }
        break;
      }

      case 'ai_classify': {
        const categories = block.config?.categories || 'Category A, Category B, Other';
        const multiLabel = block.config?.multiLabel || false;
        const threshold = block.config?.confidenceThreshold || 0.7;
        
        const prompt = `Classify this text into ${multiLabel ? 'one or more' : 'ONE'} of these categories: ${categories}

Text to classify:
${inputText}

Respond with JSON in this exact format:
{
  "category": "${multiLabel ? '["chosen_category1", "chosen_category2"]' : 'chosen_category'}",
  "confidence": 0.0-1.0,
  "reason": "brief explanation"
}

Only output JSON, no other text.`;
        
        const result = await callLovableAI(prompt);
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { category: 'Unknown', confidence: 0.5, reason: result };
        } catch {
          output = { category: 'Unknown', confidence: 0.5, reason: result };
        }
        break;
      }

      case 'ai_generate': {
        const userPrompt = block.config?.prompt || 'Generate a professional response';
        const tone = block.config?.tone || 'professional';
        const maxTokens = block.config?.maxTokens || 500;
        const outputFormat = block.config?.output_format || 'text';
        const docType = block.config?.document_type || block.config?.type || 'professionnel';
        const folderId = block.config?.folder_id || context.variables?.folderId || context.variables?.folder_id;
        const tags = block.config?.tags;
        const workflowId = context.variables?.workflowId || context.variables?.workflow_id;
        const workflowRunId = context.variables?.workflowRunId || context.variables?.workflow_run_id;
        
        const systemPrompt = `You are a ${tone} content generator. Be concise and focused. Max ~${maxTokens} tokens.`;
        const prompt = `${userPrompt}

Context/Input:
${inputText}

Generate the requested content.`;
        
        const result = await callLovableAI(prompt, systemPrompt);
        output = { generated: result, tone, characterCount: result.length };
        
        // If output format is PDF, delegate to workflow-generate-document so layout & PDF metadata are consistent with AETHER Doc
        if (outputFormat === 'PDF' || outputFormat === 'pdf') {
          try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
            
            // Extract title from prompt or use default
            const titleMatch = userPrompt.match(/titre[:\s]+['"]?([^'"]+)['"]?/i) ||
                              userPrompt.match(/title[:\s]+['"]?([^'"]+)['"]?/i);
            const docTitle = titleMatch?.[1] || `Document Workflow - ${block.name}`;
            
            // Get user_id from context or variables (server passes _userId)
            const userId = context.variables?._userId || context.variables?.userId || context.variables?.user_id;
            
            if (userId) {
              const { data, error } = await supabase.functions.invoke('workflow-generate-document', {
                body: {
                  title: docTitle,
                  content: result,
                  type: docType,
                  tone,
                  userId,
                  workflowId,
                  workflowRunId,
                  context: inputText,
                  folderId,
                  tags,
                },
              });
              
              if (error) {
                console.error('workflow-generate-document error:', error);
              } else if (data?.success && data.document?.id) {
                output.documentId = data.document.id;
                output.savedToAetherDoc = true;
                output.fileUrl = data.document.file_url;
              }
            } else {
              console.warn('No userId available, PDF document not generated in AETHER Doc');
            }
          } catch (docError) {
            console.error('Failed to call workflow-generate-document:', docError);
          }
        }
        break;
      }

      case 'ai_decision': {
        const question = block.config?.question || 'Should this be approved?';
        const criteria = block.config?.criteria || '';
        
        const prompt = `Based on this context:
${inputText}

${criteria ? `Decision Criteria:\n${criteria}\n\n` : ''}
Question: ${question}

Respond with JSON in this exact format:
{
  "decision": "yes" or "no",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation"
}

Only output JSON, no other text.`;
        
        const result = await callLovableAI(prompt);
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { decision: 'unknown', confidence: 0.5, reasoning: result };
        } catch {
          output = { decision: 'unknown', confidence: 0.5, reasoning: result };
        }
        break;
      }

      case 'ai_translate': {
        const targetLanguage = block.config?.targetLanguage || 'English';
        const preserveFormatting = block.config?.preserveFormatting ?? true;
        
        const prompt = `Translate the following text to ${targetLanguage}.
${preserveFormatting ? 'Preserve the original formatting, paragraph breaks, and structure.' : ''}

Text to translate:
${inputText}

Provide only the translation, no explanations.`;
        
        const result = await callLovableAI(prompt);
        output = { translated: result, targetLanguage, originalLength: inputText.length, translatedLength: result.length };
        break;
      }

      case 'ai_sentiment': {
        const detailed = block.config?.detailed ?? true;
        const detectEmotions = block.config?.emotions ?? true;
        
        const prompt = `Analyze the sentiment of this text:
${inputText}

Respond with JSON in this exact format:
{
  "sentiment": "positive" or "negative" or "neutral" or "mixed",
  "score": -1.0 to 1.0 (negative to positive),
  "confidence": 0.0-1.0
  ${detailed ? ',"analysis": "detailed explanation"' : ''}
  ${detectEmotions ? ',"emotions": ["emotion1", "emotion2"]' : ''}
}

Only output JSON, no other text.`;
        
        const result = await callLovableAI(prompt);
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          output = jsonMatch ? JSON.parse(jsonMatch[0]) : { sentiment: 'neutral', score: 0, confidence: 0.5 };
        } catch {
          output = { sentiment: 'neutral', score: 0, confidence: 0.5, raw: result };
        }
        break;
      }

      case 'ai_vision': {
        // Vision would need image input - for now, analyze text description of image
        const task = block.config?.task || 'describe';
        const customPrompt = block.config?.prompt;
        
        const prompt = customPrompt || `Analyze this image description and provide ${task} analysis:\n${inputText}`;
        const result = await callLovableAI(prompt);
        output = { analysis: result, task };
        break;
      }

      // ===== TRANSFORM =====
      case 'transform_json': {
        const expression = block.config?.expression;
        const outputKey = block.config?.outputKey || 'result';
        // Safe path extraction - no eval()
        try {
          const data = typeof context.input === 'string' ? JSON.parse(context.input) : context.input;
          const result = expression ? safeGetPath(data, expression) : data;
          output = { [outputKey]: result };
        } catch (e) {
          output = { error: 'Transform failed', input: context.input };
        }
        break;
      }

      case 'transform_filter': {
        const condition = block.config?.condition;
        const field = block.config?.field || 'items';
        try {
          const data = typeof context.input === 'string' ? JSON.parse(context.input) : context.input;
          const items = data[field] || data;
          if (Array.isArray(items) && condition) {
            // Safe filter - no eval()
            const filtered = safeFilter(items, condition);
            output = { [field]: filtered, originalCount: items.length, filteredCount: filtered.length };
          } else {
            output = data;
          }
        } catch {
          output = context.input;
        }
        break;
      }

      case 'transform_map': {
        output = context.input; // Simplified - would need template engine
        break;
      }

      case 'transform_merge': {
        const strategy = block.config?.strategy || 'shallow';
        output = { merged: context.input, strategy };
        break;
      }

      // ===== CONTROL FLOW =====
      case 'control_condition': {
        const condition = block.config?.condition || 'true';
        let result = false;
        try {
          const input = context.input;
          // Safe evaluation - no eval()
          result = Boolean(safeEvaluate(condition, { input, ...context.variables }));
        } catch {
          result = false;
        }
        output = { 
          result: Boolean(result), 
          branch: result ? 'true' : 'false',
          condition 
        };
        break;
      }

      case 'control_loop': {
        const arrayField = block.config?.arrayField || 'items';
        const maxIterations = block.config?.maxIterations || 100;
        const data = typeof context.input === 'string' ? JSON.parse(context.input) : context.input;
        const items = data[arrayField] || data;
        output = { 
          items: Array.isArray(items) ? items.slice(0, maxIterations) : [items],
          totalItems: Array.isArray(items) ? items.length : 1,
          processed: Math.min(Array.isArray(items) ? items.length : 1, maxIterations)
        };
        break;
      }

      case 'control_delay': {
        const duration = (block.config?.duration || 1) * 1000;
        const random = block.config?.random;
        const actualDelay = random ? Math.random() * duration : duration;
        await new Promise(resolve => setTimeout(resolve, Math.min(actualDelay, 10000))); // Max 10s
        output = { delayed: true, durationMs: actualDelay };
        break;
      }

      case 'control_parallel': {
        output = { parallel: true, branches: context.input };
        break;
      }

      // ===== INTEGRATIONS =====
      case 'http_request': {
        const method = block.config?.method || 'GET';
        const url = block.config?.url;
        // Handle headers whether they're a string (JSON) or already an object
        let headers = {};
        if (block.config?.headers) {
          if (typeof block.config.headers === 'string') {
            try {
              headers = JSON.parse(block.config.headers);
            } catch {
              headers = {};
            }
          } else if (typeof block.config.headers === 'object') {
            headers = block.config.headers;
          }
        }
        const body = block.config?.body;
        const timeout = block.config?.timeout || 30000;
        
        if (!url) {
          throw new Error('URL is required for HTTP request');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
          const fetchOptions: RequestInit = {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            signal: controller.signal,
          };
          
          if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            // Handle body whether it's a string or already an object
            if (typeof body === 'string') {
              fetchOptions.body = body;
            } else {
              fetchOptions.body = JSON.stringify(body);
            }
          }
          
          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);
          
          const contentType = response.headers.get('content-type');
          let responseData;
          if (contentType?.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
          
          output = { 
            status: response.status,
            ok: response.ok,
            data: responseData,
            headers: Object.fromEntries(response.headers.entries())
          };
        } catch (e) {
          clearTimeout(timeoutId);
          throw e;
        }
        break;
      }

      case 'http_webhook': {
        const url = block.config?.url;
        const payload = block.config?.payload;
        
        if (!url) {
          output = { sent: false, error: 'URL required' };
        } else {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload || context.input),
            });
            output = { sent: true, status: response.status, ok: response.ok };
          } catch (e) {
            output = { sent: false, error: e instanceof Error ? e.message : 'Failed' };
          }
        }
        break;
      }

      // ===== SYSTEM ACTIONS =====
      case 'system_email': {
        output = { 
          sent: true, 
          to: block.config?.to || 'recipient@example.com',
          subject: block.config?.subject || 'Workflow Notification',
          body: inputText,
          timestamp: new Date().toISOString(),
          _simulated: true
        };
        break;
      }

      case 'system_webhook': {
        output = { 
          posted: true, 
          url: block.config?.url || 'https://webhook.example.com',
          payload: context.input,
          timestamp: new Date().toISOString(),
          _simulated: true
        };
        break;
      }

      case 'system_save': {
        output = { 
          saved: true, 
          table: block.config?.table || 'workflow_results',
          operation: block.config?.operation || 'insert',
          data: context.input,
          timestamp: new Date().toISOString(),
          _simulated: true
        };
        break;
      }

      case 'system_notify': {
        output = { 
          notified: true, 
          channel: block.config?.channel || 'slack',
          message: block.config?.message || inputText,
          timestamp: new Date().toISOString(),
          _simulated: true
        };
        break;
      }

      case 'system_log': {
        const level = block.config?.level || 'info';
        console.log(`[${level.toUpperCase()}] Workflow Log:`, inputText);
        output = { logged: true, level, message: inputText };
        break;
      }

      // ===== INTEGRATIONS WITH USER API KEYS =====
      case 'integration_telegram': {
        const chatId = block.config?.chatId;
        const message = block.config?.message || inputText;
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { sent: false, error: 'User ID required for API key lookup' };
          break;
        }
        
        const botToken = await getUserApiKey(userId, 'telegram');
        if (!botToken) {
          output = { sent: false, error: 'Telegram bot token not configured. Add it in Settings > API Keys' };
          break;
        }
        
        if (!chatId) {
          output = { sent: false, error: 'Chat ID is required' };
          break;
        }
        
        try {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
          });
          const data = await response.json();
          output = { sent: data.ok, messageId: data.result?.message_id, chatId };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Telegram error' };
        }
        break;
      }

      case 'integration_slack': {
        const channel = block.config?.channel || '#general';
        const message = block.config?.message || inputText;
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }
        
        const slackToken = await getUserApiKey(userId, 'slack');
        if (!slackToken) {
          output = { sent: false, error: 'Slack token not configured. Add it in Settings > API Keys' };
          break;
        }
        
        try {
          const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${slackToken}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ channel, text: message })
          });
          const data = await response.json();
          output = { sent: data.ok, ts: data.ts, channel: data.channel, error: data.error };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Slack error' };
        }
        break;
      }

      case 'integration_discord': {
        const message = block.config?.message || inputText;
        const username = block.config?.username || 'AETHER Flow';
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }
        
        const webhookUrl = await getUserApiKey(userId, 'discord');
        if (!webhookUrl) {
          output = { sent: false, error: 'Discord webhook not configured. Add it in Settings > API Keys' };
          break;
        }
        
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message, username })
          });
          output = { sent: response.ok, status: response.status };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Discord error' };
        }
        break;
      }

      case 'integration_twilio_sms': {
        const to = block.config?.to;
        const from = block.config?.from;
        const message = block.config?.message || inputText;
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }
        
        const twilioCredentials = await getUserApiKey(userId, 'twilio');
        if (!twilioCredentials) {
          output = { sent: false, error: 'Twilio credentials not configured. Add SID:AuthToken in Settings > API Keys' };
          break;
        }
        
        const [accountSid, authToken] = twilioCredentials.split(':');
        if (!accountSid || !authToken || !to || !from) {
          output = { sent: false, error: 'Invalid Twilio configuration or missing phone numbers' };
          break;
        }
        
        try {
          const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ To: to, From: from, Body: message })
          });
          const data = await response.json();
          output = { sent: response.ok, sid: data.sid, error: data.message };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Twilio error' };
        }
        break;
      }

      case 'integration_sendgrid': {
        const to = block.config?.to;
        const from = block.config?.from;
        const subject = block.config?.subject || 'Notification';
        const content = block.config?.message || inputText;
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }
        
        const apiKey = await getUserApiKey(userId, 'sendgrid');
        if (!apiKey) {
          output = { sent: false, error: 'SendGrid API key not configured. Add it in Settings > API Keys' };
          break;
        }
        
        if (!to || !from) {
          output = { sent: false, error: 'To and From email addresses are required' };
          break;
        }
        
        try {
          const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: to }] }],
              from: { email: from },
              subject,
              content: [{ type: 'text/plain', value: content }]
            })
          });
          output = { sent: response.ok, status: response.status };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'SendGrid error' };
        }
        break;
      }

      case 'integration_notion': {
        const databaseId = block.config?.databaseId;
        const properties = block.config?.properties || {};
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { created: false, error: 'User ID required' };
          break;
        }
        
        const notionToken = await getUserApiKey(userId, 'notion');
        if (!notionToken) {
          output = { created: false, error: 'Notion token not configured. Add it in Settings > API Keys' };
          break;
        }
        
        if (!databaseId) {
          output = { created: false, error: 'Database ID is required' };
          break;
        }
        
        try {
          const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${notionToken}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
              parent: { database_id: databaseId },
              properties
            })
          });
          const data = await response.json();
          output = { created: response.ok, pageId: data.id, error: data.message };
        } catch (e) {
          output = { created: false, error: e instanceof Error ? e.message : 'Notion error' };
        }
        break;
      }

      case 'integration_airtable': {
        const baseId = block.config?.baseId;
        const tableId = block.config?.tableId;
        const fields = block.config?.fields || {};
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { created: false, error: 'User ID required' };
          break;
        }
        
        const airtableToken = await getUserApiKey(userId, 'airtable');
        if (!airtableToken) {
          output = { created: false, error: 'Airtable token not configured. Add it in Settings > API Keys' };
          break;
        }
        
        if (!baseId || !tableId) {
          output = { created: false, error: 'Base ID and Table ID are required' };
          break;
        }
        
        try {
          const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${airtableToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields })
          });
          const data = await response.json();
          output = { created: response.ok, recordId: data.id, error: data.error?.message };
        } catch (e) {
          output = { created: false, error: e instanceof Error ? e.message : 'Airtable error' };
        }
        break;
      }

      // ===== AETHER DOCUMENT CREATION (REAL PDF GENERATION) =====
      case 'aether_doc_create': {
        const title = block.config?.title;
        const content = block.config?.content;
        const prompt = block.config?.prompt;
        const docType = block.config?.type || 'rapport';
        const tone = block.config?.tone || 'professionnel';
        const folderId = block.config?.folderId;
        const tagsStr = block.config?.tags || '';
        const userId = context.variables?._userId;
        
        if (!userId) {
          output = { created: false, error: 'User ID required for document creation' };
          break;
        }
        
        if (!title) {
          output = { created: false, error: 'Document title is required' };
          break;
        }

        // Build context from workflow input
        const workflowContext = typeof context.input === 'string' 
          ? context.input 
          : JSON.stringify(context.input, null, 2);

        try {
          // Call the workflow-generate-document edge function
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          
          const tags = tagsStr.split(',').map((t: string) => t.trim()).filter((t: string) => t);
          
          const { data: fnResult, error: fnError } = await supabase.functions.invoke('workflow-generate-document', {
            body: {
              title,
              content: content || undefined,
              prompt: prompt || undefined,
              type: docType,
              tone,
              userId,
              workflowId: context.variables?._workflowId,
              workflowRunId: context.variables?._workflowRunId,
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
        } catch (e) {
          console.error('Document creation error:', e);
          output = { created: false, error: e instanceof Error ? e.message : 'Document creation failed' };
        }
        break;
      }

      // ===== AETHER CRM - Real Database Operations =====
      case 'aether_crm_create_lead': {
        const firstName = block.config?.firstName;
        const lastName = block.config?.lastName;
        const email = block.config?.email;
        const phone = block.config?.phone;
        const company = block.config?.company;
        const jobTitle = block.config?.jobTitle;
        const source = block.config?.source || 'Workflow';
        const notes = block.config?.notes;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { created: false, error: 'User ID required' };
          break;
        }
        if (!firstName || !lastName || !email) {
          output = { created: false, error: 'First name, last name and email are required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data, error } = await supabase
            .from('crm_contacts')
            .insert({
              user_id: userId,
              first_name: firstName,
              last_name: lastName,
              email,
              phone,
              job_title: jobTitle,
              notes: notes ? `${notes}\nSource: ${source}` : `Source: ${source}`,
              tags: [source.toLowerCase(), 'workflow-created']
            })
            .select()
            .single();

          if (error) throw error;
          output = { created: true, contactId: data.id, data };
        } catch (e) {
          output = { created: false, error: e instanceof Error ? e.message : 'CRM error' };
        }
        break;
      }

      case 'aether_crm_update_contact': {
        const contactId = block.config?.contactId;
        let updates = block.config?.updates || {};
        const userId = context.variables?._userId;

        if (!userId || !contactId) {
          output = { updated: false, error: 'User ID and Contact ID required' };
          break;
        }

        if (typeof updates === 'string') {
          try { updates = JSON.parse(updates); } catch { updates = {}; }
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data, error } = await supabase
            .from('crm_contacts')
            .update(updates)
            .eq('id', contactId)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;
          output = { updated: true, contactId, data };
        } catch (e) {
          output = { updated: false, error: e instanceof Error ? e.message : 'CRM error' };
        }
        break;
      }

      case 'aether_crm_create_deal': {
        const name = block.config?.name;
        const value = block.config?.value;
        const contactId = block.config?.contactId;
        const companyId = block.config?.companyId;
        const expectedCloseDate = block.config?.expectedCloseDate;
        const probability = block.config?.probability || 50;
        const description = block.config?.description;
        const userId = context.variables?._userId;

        if (!userId || !name) {
          output = { created: false, error: 'User ID and deal name required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data, error } = await supabase
            .from('sales_deals')
            .insert({
              user_id: userId,
              title: name,
              value: value || 0,
              probability,
              description,
              contact_name: contactId,
              expected_close_date: expectedCloseDate,
              source: 'Workflow',
              tags: ['workflow-created']
            })
            .select()
            .single();

          if (error) throw error;
          output = { created: true, dealId: data.id, data };
        } catch (e) {
          output = { created: false, error: e instanceof Error ? e.message : 'CRM error' };
        }
        break;
      }

      case 'aether_crm_update_deal': {
        const dealId = block.config?.dealId;
        const status = block.config?.status;
        const value = block.config?.value;
        const probability = block.config?.probability;
        const notes = block.config?.notes;
        const userId = context.variables?._userId;

        if (!userId || !dealId) {
          output = { updated: false, error: 'User ID and Deal ID required' };
          break;
        }

        const updates: Record<string, any> = {};
        if (status) updates.status = status;
        if (value !== undefined) updates.value = value;
        if (probability !== undefined) updates.probability = probability;
        if (notes) updates.description = notes;

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data, error } = await supabase
            .from('sales_deals')
            .update(updates)
            .eq('id', dealId)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;
          output = { updated: true, dealId, data };
        } catch (e) {
          output = { updated: false, error: e instanceof Error ? e.message : 'CRM error' };
        }
        break;
      }

      case 'aether_crm_create_task': {
        const title = block.config?.title;
        const description = block.config?.description;
        const dueDate = block.config?.dueDate;
        const priority = block.config?.priority || 'medium';
        const contactId = block.config?.contactId;
        const opportunityId = block.config?.opportunityId;
        const userId = context.variables?._userId;

        if (!userId || !title) {
          output = { created: false, error: 'User ID and title required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data, error } = await supabase
            .from('crm_tasks')
            .insert({
              user_id: userId,
              title,
              description,
              due_date: dueDate,
              priority,
              contact_id: contactId || null,
              opportunity_id: opportunityId || null,
              is_ai_generated: true,
              ai_reasoning: 'Created by AETHER Flow workflow'
            })
            .select()
            .single();

          if (error) throw error;
          output = { created: true, taskId: data.id, data };
        } catch (e) {
          output = { created: false, error: e instanceof Error ? e.message : 'CRM error' };
        }
        break;
      }

      case 'aether_crm_search': {
        const entityType = block.config?.entityType || 'contacts';
        const query = block.config?.query;
        let filters = block.config?.filters || {};
        const limit = block.config?.limit || 20;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { results: [], error: 'User ID required' };
          break;
        }

        if (typeof filters === 'string') {
          try { filters = JSON.parse(filters); } catch { filters = {}; }
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const tableMap: Record<string, string> = {
            contacts: 'crm_contacts',
            companies: 'crm_companies',
            opportunities: 'crm_opportunities',
            tasks: 'crm_tasks'
          };
          const tableName = tableMap[entityType] || 'crm_contacts';

          let queryBuilder = supabase
            .from(tableName)
            .select('*')
            .eq('user_id', userId)
            .limit(limit);

          if (query) {
            if (entityType === 'contacts') {
              queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
            } else if (entityType === 'companies') {
              queryBuilder = queryBuilder.or(`name.ilike.%${query}%,industry.ilike.%${query}%`);
            } else if (entityType === 'opportunities') {
              queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
            } else if (entityType === 'tasks') {
              queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
            }
          }

          const { data, error } = await queryBuilder;
          if (error) throw error;
          output = { results: data, count: data?.length || 0, entityType };
        } catch (e) {
          output = { results: [], error: e instanceof Error ? e.message : 'CRM search error' };
        }
        break;
      }

      case 'aether_doc_analyze': {
        const documentId = block.config?.documentId;
        const analysisType = block.config?.analysisType || 'summary';
        const customPrompt = block.config?.customPrompt;
        const userId = context.variables?._userId;

        if (!userId || !documentId) {
          output = { analyzed: false, error: 'User ID and Document ID required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data: doc, error: fetchError } = await supabase
            .from('aether_documents')
            .select('*')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

          if (fetchError || !doc) {
            output = { analyzed: false, error: 'Document not found' };
            break;
          }

          const content = doc.content || doc.ai_summary || '';
          let analysisPrompt = '';

          switch (analysisType) {
            case 'summary':
              analysisPrompt = `Summarize this document:\n\n${content}`;
              break;
            case 'extract_entities':
              analysisPrompt = `Extract all entities (names, dates, amounts, organizations) from:\n\n${content}\n\nRespond with JSON.`;
              break;
            case 'classify':
              analysisPrompt = `Classify this document into categories (contract, invoice, report, memo, proposal, other):\n\n${content}\n\nRespond with JSON containing category and confidence.`;
              break;
            case 'full':
              analysisPrompt = `Provide a comprehensive analysis including summary, key points, entities, and classification:\n\n${content}\n\nRespond with structured JSON.`;
              break;
            default:
              analysisPrompt = customPrompt || `Analyze this document:\n\n${content}`;
          }

          const result = await callLovableAI(analysisPrompt);
          
          let analysis: any = result;
          try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) analysis = JSON.parse(jsonMatch[0]);
          } catch { /* keep as string */ }

          output = { analyzed: true, documentId, analysisType, result: analysis };
        } catch (e) {
          output = { analyzed: false, error: e instanceof Error ? e.message : 'Analysis error' };
        }
        break;
      }

      case 'aether_doc_search': {
        const query = block.config?.query;
        const folderId = block.config?.folderId;
        const tagsFilter = block.config?.tags;
        const limit = block.config?.limit || 10;
        const userId = context.variables?._userId;

        if (!userId || !query) {
          output = { results: [], error: 'User ID and query required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          let queryBuilder = supabase
            .from('aether_documents')
            .select('id, title, description, ai_summary, tags, file_type, created_at')
            .eq('user_id', userId)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,ai_summary.ilike.%${query}%`)
            .limit(limit);

          if (folderId) queryBuilder = queryBuilder.eq('folder_id', folderId);

          const { data, error } = await queryBuilder;
          if (error) throw error;
          output = { results: data, count: data?.length || 0, query };
        } catch (e) {
          output = { results: [], error: e instanceof Error ? e.message : 'Search error' };
        }
        break;
      }

      // ===== AI Provider Integrations (using Lovable AI Gateway) =====
      case 'integration_openai':
      case 'integration_anthropic':
      case 'integration_google_ai':
      case 'integration_mistral':
      case 'integration_huggingface': {
        const prompt = block.config?.prompt || inputText;
        const systemPrompt = block.config?.systemPrompt;
        const model = block.config?.model;
        
        // All AI providers route through Lovable AI Gateway
        const result = await callLovableAI(prompt, systemPrompt);
        output = { 
          result, 
          provider: block.type.replace('integration_', ''),
          model: model || 'gemini-2.5-flash (via Lovable)',
          timestamp: new Date().toISOString()
        };
        break;
      }

      case 'integration_replicate': {
        // Replicate requires user API key
        const model = block.config?.model;
        const inputParams = block.config?.input || {};
        const userId = context.variables?._userId;

        if (!userId) {
          output = { success: false, error: 'User ID required' };
          break;
        }

        const apiKey = await getUserApiKey(userId, 'replicate');
        if (!apiKey) {
          output = { success: false, error: 'Replicate API key not configured. Add it in Settings > API Keys' };
          break;
        }

        if (!model) {
          output = { success: false, error: 'Model is required (e.g., stability-ai/sdxl)' };
          break;
        }

        try {
          const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ version: model, input: inputParams })
          });
          const data = await response.json();
          output = { success: response.ok, predictionId: data.id, status: data.status, output: data.output };
        } catch (e) {
          output = { success: false, error: e instanceof Error ? e.message : 'Replicate error' };
        }
        break;
      }

      // ===== Media AI =====
      case 'integration_stability': {
        const prompt = block.config?.prompt || inputText;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { generated: false, error: 'User ID required' };
          break;
        }

        const apiKey = await getUserApiKey(userId, 'stability');
        if (!apiKey) {
          output = { generated: false, error: 'Stability AI API key not configured. Add it in Settings > API Keys' };
          break;
        }

        try {
          const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt }],
              cfg_scale: 7,
              height: 1024,
              width: 1024,
              samples: 1,
              steps: 30
            })
          });
          const data = await response.json();
          output = { generated: response.ok, images: data.artifacts?.map((a: any) => a.base64) };
        } catch (e) {
          output = { generated: false, error: e instanceof Error ? e.message : 'Stability error' };
        }
        break;
      }

      case 'integration_elevenlabs': {
        const text = block.config?.text || inputText;
        const voiceId = block.config?.voiceId || 'EXAVITQu4vr4xnSDxMaL';
        
        const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
        if (!ELEVENLABS_API_KEY) {
          output = { generated: false, error: 'ElevenLabs not configured' };
          break;
        }

        try {
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
          });
          
          if (response.ok) {
            output = { generated: true, voiceId, textLength: text.length, format: 'mp3' };
          } else {
            const error = await response.json();
            output = { generated: false, error: error.detail?.message || 'TTS failed' };
          }
        } catch (e) {
          output = { generated: false, error: e instanceof Error ? e.message : 'ElevenLabs error' };
        }
        break;
      }

      case 'integration_deepgram':
      case 'integration_assemblyai': {
        output = { 
          transcribed: false, 
          error: `${block.type.replace('integration_', '')} requires audio URL input. Configure in Settings > API Keys.`,
          requiresSetup: true
        };
        break;
      }

      // ===== More Communication =====
      case 'integration_whatsapp': {
        const to = block.config?.to;
        const message = block.config?.message || inputText;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }

        const credentials = await getUserApiKey(userId, 'whatsapp');
        if (!credentials) {
          output = { sent: false, error: 'WhatsApp Business API not configured. Add token:phoneNumberId in Settings > API Keys' };
          break;
        }

        const [token, phoneNumberId] = credentials.split(':');
        if (!token || !phoneNumberId || !to) {
          output = { sent: false, error: 'Invalid configuration or missing recipient' };
          break;
        }

        try {
          const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to,
              type: 'text',
              text: { body: message }
            })
          });
          const data = await response.json();
          output = { sent: response.ok, messageId: data.messages?.[0]?.id, error: data.error?.message };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'WhatsApp error' };
        }
        break;
      }

      case 'integration_teams': {
        const message = block.config?.message || inputText;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { sent: false, error: 'User ID required' };
          break;
        }

        const webhookUrl = await getUserApiKey(userId, 'teams');
        if (!webhookUrl) {
          output = { sent: false, error: 'MS Teams webhook not configured. Add it in Settings > API Keys' };
          break;
        }

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
          });
          output = { sent: response.ok, status: response.status };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Teams error' };
        }
        break;
      }

      // ===== Support Platforms =====
      case 'integration_intercom':
      case 'integration_zendesk':
      case 'integration_freshdesk':
      case 'integration_crisp': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} integration requires API key configuration in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== Email Marketing =====
      case 'integration_mailchimp': {
        const listId = block.config?.listId;
        const email = block.config?.email;
        const userId = context.variables?._userId;

        if (!userId) {
          output = { success: false, error: 'User ID required' };
          break;
        }

        const apiKey = await getUserApiKey(userId, 'mailchimp');
        if (!apiKey) {
          output = { success: false, error: 'Mailchimp API key not configured. Add it in Settings > API Keys' };
          break;
        }

        const dc = apiKey.split('-')[1] || 'us1';
        
        if (!listId || !email) {
          output = { success: false, error: 'List ID and email are required' };
          break;
        }

        try {
          const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email_address: email,
              status: 'subscribed'
            })
          });
          const data = await response.json();
          output = { success: response.ok, memberId: data.id, error: data.detail };
        } catch (e) {
          output = { success: false, error: e instanceof Error ? e.message : 'Mailchimp error' };
        }
        break;
      }

      case 'integration_brevo':
      case 'integration_mailgun':
      case 'integration_resend':
      case 'integration_convertkit': {
        const platform = block.type.replace('integration_', '');
        output = { 
          sent: false, 
          error: `${platform} requires API key in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== CRM External =====
      case 'integration_hubspot':
      case 'integration_salesforce':
      case 'integration_pipedrive':
      case 'integration_zoho': {
        const platform = block.type.replace('integration_', '');
        const userId = context.variables?._userId;

        if (!userId) {
          output = { success: false, error: 'User ID required' };
          break;
        }

        const apiKey = await getUserApiKey(userId, platform);
        if (!apiKey) {
          output = { 
            success: false, 
            error: `${platform} API key not configured. Add it in Settings > API Keys`,
            platform,
            requiresSetup: true
          };
          break;
        }

        // HubSpot example implementation
        if (platform === 'hubspot') {
          const action = block.config?.action || 'search';
          try {
            if (action === 'create_contact') {
              const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  properties: block.config?.properties || {}
                })
              });
              const data = await response.json();
              output = { success: response.ok, contactId: data.id, data };
            } else {
              output = { success: true, message: 'HubSpot connected', action };
            }
          } catch (e) {
            output = { success: false, error: e instanceof Error ? e.message : 'HubSpot error' };
          }
        } else {
          output = { success: true, message: `${platform} API key configured`, platform };
        }
        break;
      }

      // ===== Productivity =====
      case 'integration_google_sheets': {
        output = { 
          success: false, 
          error: 'Google Sheets requires OAuth. Use HTTP Request block with Google API.',
          requiresSetup: true
        };
        break;
      }

      case 'integration_google_calendar':
      case 'integration_calendly':
      case 'integration_zoom':
      case 'integration_loom': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires OAuth or API key in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      case 'integration_trello':
      case 'integration_asana':
      case 'integration_monday':
      case 'integration_clickup':
      case 'integration_jira':
      case 'integration_linear': {
        const platform = block.type.replace('integration_', '');
        const userId = context.variables?._userId;

        if (!userId) {
          output = { success: false, error: 'User ID required' };
          break;
        }

        const apiKey = await getUserApiKey(userId, platform);
        if (!apiKey) {
          output = { 
            success: false, 
            error: `${platform} API key not configured. Add it in Settings > API Keys`,
            platform,
            requiresSetup: true
          };
        } else {
          output = { success: true, message: `${platform} connected`, platform };
        }
        break;
      }

      // ===== Storage =====
      case 'integration_google_drive':
      case 'integration_dropbox':
      case 'integration_onedrive':
      case 'integration_box':
      case 'integration_aws_s3': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires OAuth or credentials in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== E-commerce & Payments =====
      case 'integration_stripe': {
        const action = block.config?.action || 'list_customers';
        
        const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
        if (!STRIPE_KEY) {
          output = { success: false, error: 'Stripe not configured' };
          break;
        }

        try {
          let endpoint = 'https://api.stripe.com/v1/customers';
          let method = 'GET';
          let body: string | undefined;

          if (action === 'create_customer') {
            method = 'POST';
            body = new URLSearchParams({
              email: block.config?.email || '',
              name: block.config?.name || ''
            }).toString();
          }

          const response = await fetch(endpoint, {
            method,
            headers: {
              'Authorization': `Bearer ${STRIPE_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
          });
          const data = await response.json();
          output = { success: response.ok, data, action };
        } catch (e) {
          output = { success: false, error: e instanceof Error ? e.message : 'Stripe error' };
        }
        break;
      }

      case 'integration_paypal':
      case 'integration_shopify':
      case 'integration_quickbooks': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires API credentials in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== Social Media =====
      case 'integration_twitter':
      case 'integration_linkedin':
      case 'integration_facebook':
      case 'integration_instagram':
      case 'integration_youtube':
      case 'integration_tiktok': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires OAuth. Configure in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== Developer Tools =====
      case 'integration_github': {
        const action = block.config?.action || 'list_repos';
        const userId = context.variables?._userId;

        if (!userId) {
          output = { success: false, error: 'User ID required' };
          break;
        }

        const token = await getUserApiKey(userId, 'github');
        if (!token) {
          output = { success: false, error: 'GitHub token not configured. Add it in Settings > API Keys' };
          break;
        }

        try {
          const response = await fetch('https://api.github.com/user/repos?per_page=10', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          const data = await response.json();
          output = { success: response.ok, repos: data.map((r: any) => ({ name: r.name, url: r.html_url })) };
        } catch (e) {
          output = { success: false, error: e instanceof Error ? e.message : 'GitHub error' };
        }
        break;
      }

      case 'integration_gitlab':
      case 'integration_vercel':
      case 'integration_supabase':
      case 'integration_firebase': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires API token in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== Analytics =====
      case 'integration_google_analytics':
      case 'integration_mixpanel':
      case 'integration_segment':
      case 'integration_amplitude': {
        const platform = block.type.replace('integration_', '');
        output = { 
          success: false, 
          error: `${platform} requires API key in Settings > API Keys`,
          platform,
          requiresSetup: true
        };
        break;
      }

      // ===== Automation connectors =====
      case 'integration_zapier':
      case 'integration_make':
      case 'integration_n8n': {
        const webhookUrl = block.config?.webhookUrl;
        const payload = block.config?.payload || context.input;

        if (!webhookUrl) {
          output = { sent: false, error: 'Webhook URL required' };
          break;
        }

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          output = { sent: response.ok, status: response.status };
        } catch (e) {
          output = { sent: false, error: e instanceof Error ? e.message : 'Webhook error' };
        }
        break;
      }

      // ===== Gmail blocks =====
      case 'gmail_read':
      case 'gmail_send':
      case 'gmail_reply':
      case 'gmail_label':
      case 'gmail_search': {
        output = { 
          success: false, 
          error: 'Gmail requires OAuth integration. Configure in Settings > Integrations',
          requiresSetup: true
        };
        break;
      }

      // ===== Control flow additions =====
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

      case 'control_merge': {
        const mergeStrategy = block.config?.mergeStrategy || 'combine_results';
        output = { 
          merged: true, 
          strategy: mergeStrategy,
          data: context.input
        };
        break;
      }

      case 'workflow_call': {
        const workflowId = block.config?.workflowId;
        const passInput = block.config?.passInput !== false;
        const userId = context.variables?._userId;

        if (!workflowId || !userId) {
          output = { success: false, error: 'Workflow ID and User ID required' };
          break;
        }

        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const { data: workflow, error: wfError } = await supabase
            .from('workflows')
            .select('id, name')
            .eq('id', workflowId)
            .eq('user_id', userId)
            .single();

          if (wfError || !workflow) {
            output = { success: false, error: 'Sub-workflow not found' };
            break;
          }

          output = {
            success: true,
            subWorkflowId: workflowId,
            subWorkflowName: workflow.name,
            input: passInput ? context.input : {},
            note: 'Sub-workflow execution would be triggered here'
          };
        } catch (e) {
          output = { success: false, error: e instanceof Error ? e.message : 'Workflow call error' };
        }
        break;
      }

      // ===== Phone integration =====
      case 'integration_twilio_voice': {
        output = { 
          success: false, 
          error: 'Twilio Voice requires complex setup. Use Twilio SMS for now.',
          requiresSetup: true
        };
        break;
      }

      default:
        output = context.input;
    }

    return { output };
  } catch (error) {
    console.error(`Block ${block.name} (${block.type}) error:`, error);
    return { 
      output: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Execute entire workflow
async function executeWorkflow(
  blocks: WorkflowBlock[],
  initialInput: any,
  variables: Record<string, any> = {}
): Promise<{ success: boolean; output: any; error?: string; logs: ExecutionLog[] }> {
  const logs: ExecutionLog[] = [];
  let currentInput = initialInput;
  const outputs: Record<string, any> = {};

  // Sort blocks by position (top to bottom, left to right)
  const sortedBlocks = [...blocks].sort((a, b) => {
    if (Math.abs(a.position.y - b.position.y) > 50) return a.position.y - b.position.y;
    return a.position.x - b.position.x;
  });

  console.log(`Starting workflow execution with ${sortedBlocks.length} blocks`);

  for (const block of sortedBlocks) {
    const startTime = Date.now();
    
    const log: ExecutionLog = {
      blockId: block.id,
      blockName: block.name,
      blockType: block.type,
      input: currentInput,
      output: null,
      status: 'running',
      duration: 0,
      timestamp: new Date().toISOString()
    };

    console.log(`Executing block: ${block.name} (${block.type})`);

    try {
      // Retry logic
      let result: { output: any; error?: string } = { output: null };
      const maxRetries = block.retryConfig?.enabled ? (block.retryConfig.maxRetries || 3) : 1;
      const backoffMs = block.retryConfig?.backoffMs || 1000;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt + 1} for block ${block.name}`);
          await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, attempt - 1)));
        }

        result = await executeBlock(block, {
          input: currentInput,
          previousOutputs: outputs,
          variables
        });

        if (!result.error) break;
        log.retryCount = attempt + 1;
      }

      log.duration = Date.now() - startTime;

      if (result.error) {
        log.status = 'error';
        log.error = result.error;
        log.output = { error: result.error };
        logs.push(log);
        
        console.error(`Block ${block.name} failed:`, result.error);
        return { success: false, output: null, error: result.error, logs };
      }

      log.status = 'success';
      log.output = result.output;
      outputs[block.id] = result.output;
      
      // Handle conditional branching
      if (block.type === 'control_condition' || block.type === 'ai_decision') {
        const decision = result.output?.result ?? result.output?.decision === 'yes';
        currentInput = { ...result.output, _branch: decision ? 'true' : 'false' };
      } else {
        currentInput = result.output;
      }

    } catch (error) {
      log.duration = Date.now() - startTime;
      log.status = 'error';
      log.error = error instanceof Error ? error.message : 'Unknown error';
      log.output = { error: log.error };
      logs.push(log);
      
      console.error(`Block ${block.name} exception:`, error);
      return { success: false, output: null, error: log.error, logs };
    }

    logs.push(log);
  }

  console.log('Workflow execution completed successfully');
  return { 
    success: true, 
    output: currentInput, 
    logs 
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user ID from JWT token - REQUIRED for authenticated access
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    const { blocks, input, variables, workflowId } = await req.json();

    if (!blocks || !Array.isArray(blocks)) {
      return new Response(
        JSON.stringify({ error: 'blocks array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Executing workflow ${workflowId || 'unnamed'} with ${blocks.length} blocks for user ${userId}`);

    // Pass userId in variables so blocks can access user's API keys
    const enrichedVariables = { ...variables, _userId: userId };
    const result = await executeWorkflow(blocks, input || '', enrichedVariables);

    // Important: a workflow can fail for business reasons (bad URL, auth, bad data)
    // and that should NOT be treated as an HTTP 500 by the client.
    // We always return 200 here and expose the failure via { success: false, error, logs }.
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Workflow execution error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        logs: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
