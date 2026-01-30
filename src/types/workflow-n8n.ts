// ==========================================
// AETHER FLOW - N8N COMPATIBLE WORKFLOW TYPES
// Structure identique à N8N
// ==========================================

// ==========================================
// CATÉGORIES N8N (5 catégories principales)
// ==========================================

export type N8NCategory = 
  | 'trigger'      // Déclencheurs
  | 'logic'        // Logique / Flow Control
  | 'ai'           // IA (cerveau)
  | 'tools'        // Outils / Actions
  | 'data';        // Data / Output

// ==========================================
// TYPES DE BLOCS N8N
// ==========================================

export type N8NBlockType =
  // ===== TRIGGERS (1) =====
  | 'trigger_webhook'
  | 'trigger_schedule'
  | 'trigger_manual'
  | 'trigger_event'
  | 'trigger_app'
  | 'trigger_email_received'
  | 'trigger_form_submitted'
  
  // ===== LOGIC / FLOW (2) =====
  | 'logic_if'
  | 'logic_switch'
  | 'logic_merge'
  | 'logic_loop'
  | 'logic_wait'
  | 'logic_split_batches'
  | 'logic_error_trigger'
  | 'logic_no_op'
  
  // ===== AI / CERVEAU (3) =====
  | 'ai_agent'
  | 'ai_llm_prompt'
  | 'ai_chat_completion'
  | 'ai_text_generator'
  | 'ai_classifier'
  | 'ai_summarizer'
  | 'ai_extractor'
  | 'ai_translator'
  | 'ai_sentiment'
  | 'ai_vision'
  
  // ===== TOOLS / ACTIONS (4) =====
  | 'tools_http_request'
  | 'tools_database_query'
  | 'tools_database_insert'
  | 'tools_database_update'
  | 'tools_database_delete'
  | 'tools_api_connector'
  | 'tools_file_read'
  | 'tools_file_write'
  | 'tools_email_send'
  | 'tools_sms_send'
  | 'tools_slack_post'
  | 'tools_discord_post'
  | 'tools_telegram_send'
  | 'tools_whatsapp_send'
  | 'tools_code_execute'
  | 'tools_webhook_send'
  
  // ===== DATA / OUTPUT (5) =====
  | 'data_set'
  | 'data_transform'
  | 'data_aggregate'
  | 'data_filter'
  | 'data_sort'
  | 'data_respond'
  | 'data_store_db'
  | 'data_store_file'
  | 'data_store_vector';

// ==========================================
// SYSTÈME DE PARAMÈTRES N8N
// ==========================================

export type N8NParamType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiSelect'
  | 'json'
  | 'expression'   // {{ $json.field }}
  | 'code'
  | 'keyvalue';

export interface N8NConfigField {
  key: string;
  label: string;
  type: N8NParamType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  helpText?: string;
  supportsExpression?: boolean; // Permet {{ $json.xxx }}
}

// ==========================================
// DÉFINITION DE BLOC N8N
// ==========================================

export interface N8NBlockDefinition {
  type: N8NBlockType;
  name: string;
  category: N8NCategory;
  icon: string;
  color: string;
  description: string;
  subtitle?: string; // Texte sous le nom (ex: "mode: Rules")
  configFields: N8NConfigField[];
  inputs: number;
  outputs: number;
  outputLabels?: string[]; // Pour Switch: ["true", "false"]
  isRealAction?: boolean;
  requiresAuth?: boolean;
}

// ==========================================
// BLOC DE WORKFLOW
// ==========================================

export interface N8NWorkflowBlock {
  id: string;
  type: N8NBlockType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  credentials?: string; // ID des credentials liées
  retryConfig?: {
    enabled: boolean;
    maxRetries: number;
    waitBetweenRetries: number;
  };
  timeout?: number;
  notes?: string;
  disabled?: boolean;
}

// ==========================================
// CONNEXION N8N
// ==========================================

export interface N8NConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceOutput: number; // Index de sortie (0, 1, 2...)
  targetInput: number;  // Index d'entrée (0, 1, 2...)
}

// ==========================================
// WORKFLOW COMPLET
// ==========================================

export interface N8NWorkflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  blocks: N8NWorkflowBlock[];
  connections: N8NConnection[];
  variables?: Record<string, any>;
  settings?: {
    executionOrder?: 'v1' | 'v2';
    timezone?: string;
    errorWorkflow?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==========================================
// STATUTS D'EXÉCUTION
// ==========================================

export type N8NExecutionStatus = 'idle' | 'pending' | 'running' | 'success' | 'error' | 'skipped' | 'cancelled';

// ==========================================
// DÉFINITIONS DES BLOCS N8N
// ==========================================

export const N8N_BLOCK_DEFINITIONS: Record<N8NBlockType, N8NBlockDefinition> = {
  // =======================================
  // 1️⃣ TRIGGERS
  // =======================================
  trigger_webhook: {
    type: 'trigger_webhook',
    name: 'Webhook',
    category: 'trigger',
    icon: 'Webhook',
    color: '#7c3aed',
    description: 'Starts workflow when webhook is called',
    configFields: [
      { key: 'method', label: 'HTTP Method', type: 'select', options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' }
      ], defaultValue: 'POST' },
      { key: 'path', label: 'Path', type: 'string', placeholder: '/my-webhook' },
      { key: 'responseMode', label: 'Response Mode', type: 'select', options: [
        { label: 'On Received', value: 'onReceived' },
        { label: 'When Last Node Finishes', value: 'lastNode' }
      ], defaultValue: 'onReceived' }
    ],
    inputs: 0,
    outputs: 1,
    isRealAction: true
  },

  trigger_schedule: {
    type: 'trigger_schedule',
    name: 'Schedule Trigger',
    category: 'trigger',
    icon: 'Clock',
    color: '#0ea5e9',
    description: 'Runs workflow on a schedule',
    configFields: [
      { key: 'rule', label: 'Trigger Rule', type: 'select', options: [
        { label: 'Every Minute', value: 'everyMinute' },
        { label: 'Every Hour', value: 'everyHour' },
        { label: 'Every Day', value: 'everyDay' },
        { label: 'Every Week', value: 'everyWeek' },
        { label: 'Custom (Cron)', value: 'cron' }
      ], defaultValue: 'everyHour' },
      { key: 'cronExpression', label: 'Cron Expression', type: 'string', placeholder: '0 9 * * *' },
      { key: 'timezone', label: 'Timezone', type: 'string', defaultValue: 'Europe/Paris' }
    ],
    inputs: 0,
    outputs: 1
  },

  trigger_manual: {
    type: 'trigger_manual',
    name: 'Manual Trigger',
    category: 'trigger',
    icon: 'Play',
    color: '#22c55e',
    description: 'Start workflow manually',
    subtitle: 'click to execute',
    configFields: [],
    inputs: 0,
    outputs: 1
  },

  trigger_event: {
    type: 'trigger_event',
    name: 'Event Trigger',
    category: 'trigger',
    icon: 'Zap',
    color: '#f59e0b',
    description: 'Triggers on system events',
    configFields: [
      { key: 'eventType', label: 'Event Type', type: 'select', options: [
        { label: 'New Row Created', value: 'row_created' },
        { label: 'Row Updated', value: 'row_updated' },
        { label: 'Row Deleted', value: 'row_deleted' },
        { label: 'File Uploaded', value: 'file_uploaded' }
      ], required: true }
    ],
    inputs: 0,
    outputs: 1
  },

  trigger_app: {
    type: 'trigger_app',
    name: 'App Trigger',
    category: 'trigger',
    icon: 'Box',
    color: '#ec4899',
    description: 'Trigger from connected app',
    configFields: [
      { key: 'app', label: 'App', type: 'select', options: [
        { label: 'Gmail', value: 'gmail' },
        { label: 'Slack', value: 'slack' },
        { label: 'Notion', value: 'notion' },
        { label: 'Airtable', value: 'airtable' }
      ], required: true },
      { key: 'event', label: 'Event', type: 'select', options: [
        { label: 'New Item', value: 'new' },
        { label: 'Updated Item', value: 'updated' }
      ], required: true }
    ],
    inputs: 0,
    outputs: 1,
    requiresAuth: true
  },

  trigger_email_received: {
    type: 'trigger_email_received',
    name: 'Email Received',
    category: 'trigger',
    icon: 'Mail',
    color: '#ef4444',
    description: 'Trigger when email is received',
    configFields: [
      { key: 'mailbox', label: 'Mailbox', type: 'string', placeholder: 'INBOX' },
      { key: 'filter', label: 'Subject Filter', type: 'string', placeholder: 'Invoice*' }
    ],
    inputs: 0,
    outputs: 1,
    requiresAuth: true,
    isRealAction: true
  },

  trigger_form_submitted: {
    type: 'trigger_form_submitted',
    name: 'Form Submitted',
    category: 'trigger',
    icon: 'ClipboardList',
    color: '#8b5cf6',
    description: 'Trigger when form is submitted',
    configFields: [
      { key: 'formFields', label: 'Form Fields', type: 'json', placeholder: '[{"name": "email", "type": "email"}]' }
    ],
    inputs: 0,
    outputs: 1
  },

  // =======================================
  // 2️⃣ LOGIC / FLOW CONTROL
  // =======================================
  logic_if: {
    type: 'logic_if',
    name: 'IF',
    category: 'logic',
    icon: 'GitBranch',
    color: '#22c55e',
    description: 'Route items based on condition',
    outputLabels: ['true', 'false'],
    configFields: [
      { key: 'condition', label: 'Condition', type: 'expression', placeholder: '{{ $json.value > 100 }}', required: true, supportsExpression: true },
      { key: 'combineConditions', label: 'Combine With', type: 'select', options: [
        { label: 'AND', value: 'and' },
        { label: 'OR', value: 'or' }
      ], defaultValue: 'and' }
    ],
    inputs: 1,
    outputs: 2
  },

  logic_switch: {
    type: 'logic_switch',
    name: 'Switch',
    category: 'logic',
    icon: 'GitBranch',
    color: '#22c55e',
    description: 'Route to different outputs based on rules',
    subtitle: 'mode: Rules',
    configFields: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Rules', value: 'rules' },
        { label: 'Expression', value: 'expression' }
      ], defaultValue: 'rules' },
      { key: 'rules', label: 'Rules', type: 'json', placeholder: '[{"condition": "...", "output": 0}]' },
      { key: 'fallbackOutput', label: 'Fallback Output', type: 'number', defaultValue: 0 }
    ],
    inputs: 1,
    outputs: 4 // Dynamic basé sur les règles
  },

  logic_merge: {
    type: 'logic_merge',
    name: 'Merge',
    category: 'logic',
    icon: 'Combine',
    color: '#0ea5e9',
    description: 'Merge data from multiple inputs',
    subtitle: 'append',
    configFields: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Append', value: 'append' },
        { label: 'Combine', value: 'combine' },
        { label: 'Choose Branch', value: 'chooseBranch' },
        { label: 'Wait', value: 'wait' }
      ], defaultValue: 'append' },
      { key: 'joinMode', label: 'Join Mode', type: 'select', options: [
        { label: 'Inner Join', value: 'inner' },
        { label: 'Left Join', value: 'left' },
        { label: 'Outer Join', value: 'outer' }
      ] }
    ],
    inputs: 3,
    outputs: 1
  },

  logic_loop: {
    type: 'logic_loop',
    name: 'Loop Over Items',
    category: 'logic',
    icon: 'Repeat',
    color: '#f59e0b',
    description: 'Loop through each item',
    configFields: [
      { key: 'batchSize', label: 'Batch Size', type: 'number', defaultValue: 1 },
      { key: 'maxIterations', label: 'Max Iterations', type: 'number', defaultValue: 100 }
    ],
    inputs: 1,
    outputs: 2,
    outputLabels: ['loop', 'done']
  },

  logic_wait: {
    type: 'logic_wait',
    name: 'Wait',
    category: 'logic',
    icon: 'Clock',
    color: '#64748b',
    description: 'Wait before continuing',
    configFields: [
      { key: 'amount', label: 'Amount', type: 'number', defaultValue: 1 },
      { key: 'unit', label: 'Unit', type: 'select', options: [
        { label: 'Seconds', value: 'seconds' },
        { label: 'Minutes', value: 'minutes' },
        { label: 'Hours', value: 'hours' }
      ], defaultValue: 'seconds' }
    ],
    inputs: 1,
    outputs: 1
  },

  logic_split_batches: {
    type: 'logic_split_batches',
    name: 'Split In Batches',
    category: 'logic',
    icon: 'Layers',
    color: '#8b5cf6',
    description: 'Split items into batches',
    configFields: [
      { key: 'batchSize', label: 'Batch Size', type: 'number', defaultValue: 10 }
    ],
    inputs: 1,
    outputs: 2,
    outputLabels: ['batch', 'done']
  },

  logic_error_trigger: {
    type: 'logic_error_trigger',
    name: 'Error Trigger',
    category: 'logic',
    icon: 'AlertTriangle',
    color: '#ef4444',
    description: 'Triggers when error occurs',
    configFields: [],
    inputs: 0,
    outputs: 1
  },

  logic_no_op: {
    type: 'logic_no_op',
    name: 'No Operation',
    category: 'logic',
    icon: 'Minus',
    color: '#94a3b8',
    description: 'Does nothing, passes data through',
    configFields: [],
    inputs: 1,
    outputs: 1
  },

  // =======================================
  // 3️⃣ AI (CERVEAU)
  // =======================================
  ai_agent: {
    type: 'ai_agent',
    name: 'AI Agent',
    category: 'ai',
    icon: 'Brain',
    color: '#a855f7',
    description: 'AI Agent with tools and memory',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'GPT-5', value: 'openai/gpt-5' },
        { label: 'GPT-5 Mini', value: 'openai/gpt-5-mini' },
        { label: 'Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
        { label: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' },
        { label: 'Claude 3.5 Sonnet', value: 'anthropic/claude-3.5-sonnet' }
      ], defaultValue: 'openai/gpt-5', required: true },
      { key: 'systemPrompt', label: 'System Prompt', type: 'string', placeholder: 'You are a helpful assistant...', required: true, supportsExpression: true },
      { key: 'userPrompt', label: 'User Prompt', type: 'expression', placeholder: '{{ $json.message }}', supportsExpression: true },
      { key: 'tools', label: 'Tools (Node IDs)', type: 'json', placeholder: '["node_id_1", "node_id_2"]', helpText: 'IDs des nodes que l\'agent peut appeler' },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 2000 },
      { key: 'memory', label: 'Enable Memory', type: 'boolean', defaultValue: false },
      { key: 'memoryWindowSize', label: 'Memory Window Size', type: 'number', defaultValue: 10 }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_llm_prompt: {
    type: 'ai_llm_prompt',
    name: 'LLM Prompt',
    category: 'ai',
    icon: 'MessageSquare',
    color: '#8b5cf6',
    description: 'Send prompt to LLM and get response',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'GPT-5', value: 'openai/gpt-5' },
        { label: 'GPT-5 Mini', value: 'openai/gpt-5-mini' },
        { label: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' }
      ], defaultValue: 'openai/gpt-5-mini' },
      { key: 'prompt', label: 'Prompt', type: 'expression', placeholder: 'Analyze this text: {{ $json.text }}', required: true, supportsExpression: true },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_chat_completion: {
    type: 'ai_chat_completion',
    name: 'Chat Completion',
    category: 'ai',
    icon: 'MessagesSquare',
    color: '#7c3aed',
    description: 'Multi-turn chat with LLM',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'GPT-5', value: 'openai/gpt-5' },
        { label: 'GPT-5 Mini', value: 'openai/gpt-5-mini' }
      ], defaultValue: 'openai/gpt-5-mini' },
      { key: 'messages', label: 'Messages', type: 'json', placeholder: '[{"role": "user", "content": "Hello"}]', supportsExpression: true },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_text_generator: {
    type: 'ai_text_generator',
    name: 'Text Generator',
    category: 'ai',
    icon: 'Wand2',
    color: '#ec4899',
    description: 'Generate text content',
    configFields: [
      { key: 'prompt', label: 'Generation Prompt', type: 'expression', required: true, supportsExpression: true },
      { key: 'style', label: 'Style', type: 'select', options: [
        { label: 'Professional', value: 'professional' },
        { label: 'Casual', value: 'casual' },
        { label: 'Creative', value: 'creative' },
        { label: 'Technical', value: 'technical' }
      ], defaultValue: 'professional' },
      { key: 'length', label: 'Length', type: 'select', options: [
        { label: 'Short', value: 'short' },
        { label: 'Medium', value: 'medium' },
        { label: 'Long', value: 'long' }
      ], defaultValue: 'medium' }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_classifier: {
    type: 'ai_classifier',
    name: 'Classifier',
    category: 'ai',
    icon: 'Tags',
    color: '#0ea5e9',
    description: 'Classify items into categories',
    outputLabels: ['Category 1', 'Category 2', 'Category 3'],
    configFields: [
      { key: 'categories', label: 'Categories', type: 'json', placeholder: '["Urgent", "Normal", "Low"]', required: true },
      { key: 'inputField', label: 'Input Field', type: 'expression', placeholder: '{{ $json.text }}', supportsExpression: true },
      { key: 'outputRouting', label: 'Route by Category', type: 'boolean', defaultValue: true }
    ],
    inputs: 1,
    outputs: 3
  },

  ai_summarizer: {
    type: 'ai_summarizer',
    name: 'Summarizer',
    category: 'ai',
    icon: 'Sparkles',
    color: '#f59e0b',
    description: 'Summarize text content',
    configFields: [
      { key: 'input', label: 'Text to Summarize', type: 'expression', placeholder: '{{ $json.content }}', supportsExpression: true },
      { key: 'style', label: 'Summary Style', type: 'select', options: [
        { label: 'Brief', value: 'brief' },
        { label: 'Detailed', value: 'detailed' },
        { label: 'Bullet Points', value: 'bullets' },
        { label: 'Executive', value: 'executive' }
      ], defaultValue: 'brief' },
      { key: 'maxLength', label: 'Max Words', type: 'number', defaultValue: 100 }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_extractor: {
    type: 'ai_extractor',
    name: 'Data Extractor',
    category: 'ai',
    icon: 'FileSearch',
    color: '#22c55e',
    description: 'Extract structured data from text',
    configFields: [
      { key: 'input', label: 'Text to Parse', type: 'expression', placeholder: '{{ $json.content }}', supportsExpression: true },
      { key: 'fields', label: 'Fields to Extract', type: 'json', placeholder: '["name", "email", "phone", "company"]', required: true },
      { key: 'outputFormat', label: 'Output Format', type: 'select', options: [
        { label: 'JSON', value: 'json' },
        { label: 'Array', value: 'array' }
      ], defaultValue: 'json' }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_translator: {
    type: 'ai_translator',
    name: 'Translator',
    category: 'ai',
    icon: 'Languages',
    color: '#0ea5e9',
    description: 'Translate text to another language',
    configFields: [
      { key: 'input', label: 'Text', type: 'expression', placeholder: '{{ $json.text }}', supportsExpression: true },
      { key: 'targetLanguage', label: 'Target Language', type: 'select', options: [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'Spanish', value: 'es' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Portuguese', value: 'pt' },
        { label: 'Chinese', value: 'zh' },
        { label: 'Japanese', value: 'ja' }
      ], required: true }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_sentiment: {
    type: 'ai_sentiment',
    name: 'Sentiment Analysis',
    category: 'ai',
    icon: 'Heart',
    color: '#ec4899',
    description: 'Analyze sentiment and emotions',
    configFields: [
      { key: 'input', label: 'Text', type: 'expression', placeholder: '{{ $json.text }}', supportsExpression: true },
      { key: 'detailed', label: 'Detailed Analysis', type: 'boolean', defaultValue: true }
    ],
    inputs: 1,
    outputs: 1
  },

  ai_vision: {
    type: 'ai_vision',
    name: 'Vision AI',
    category: 'ai',
    icon: 'Eye',
    color: '#f59e0b',
    description: 'Analyze images with AI',
    configFields: [
      { key: 'imageUrl', label: 'Image URL', type: 'expression', placeholder: '{{ $json.imageUrl }}', supportsExpression: true },
      { key: 'task', label: 'Task', type: 'select', options: [
        { label: 'Describe', value: 'describe' },
        { label: 'Extract Text (OCR)', value: 'ocr' },
        { label: 'Detect Objects', value: 'objects' },
        { label: 'Custom Prompt', value: 'custom' }
      ], defaultValue: 'describe' },
      { key: 'prompt', label: 'Custom Prompt', type: 'string' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =======================================
  // 4️⃣ TOOLS / ACTIONS
  // =======================================
  tools_http_request: {
    type: 'tools_http_request',
    name: 'HTTP Request',
    category: 'tools',
    icon: 'Globe',
    color: '#3b82f6',
    description: 'Make HTTP API request',
    subtitle: 'GET https://...',
    configFields: [
      { key: 'method', label: 'Method', type: 'select', options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' }
      ], defaultValue: 'GET', required: true },
      { key: 'url', label: 'URL', type: 'expression', placeholder: 'https://api.example.com/endpoint', required: true, supportsExpression: true },
      { key: 'headers', label: 'Headers', type: 'json', placeholder: '{"Authorization": "Bearer {{ $json.token }}"}' },
      { key: 'body', label: 'Body', type: 'json', supportsExpression: true },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000 }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_database_query: {
    type: 'tools_database_query',
    name: 'Database Query',
    category: 'tools',
    icon: 'Database',
    color: '#22c55e',
    description: 'Query database records',
    configFields: [
      { key: 'table', label: 'Table', type: 'string', required: true },
      { key: 'select', label: 'Select Fields', type: 'string', defaultValue: '*' },
      { key: 'filter', label: 'Filter', type: 'json', placeholder: '{"status": "active"}' },
      { key: 'limit', label: 'Limit', type: 'number', defaultValue: 100 }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_database_insert: {
    type: 'tools_database_insert',
    name: 'Database Insert',
    category: 'tools',
    icon: 'DatabaseBackup',
    color: '#22c55e',
    description: 'Insert records into database',
    configFields: [
      { key: 'table', label: 'Table', type: 'string', required: true },
      { key: 'data', label: 'Data', type: 'json', supportsExpression: true, required: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_database_update: {
    type: 'tools_database_update',
    name: 'Database Update',
    category: 'tools',
    icon: 'RefreshCw',
    color: '#f59e0b',
    description: 'Update database records',
    configFields: [
      { key: 'table', label: 'Table', type: 'string', required: true },
      { key: 'filter', label: 'Filter', type: 'json', required: true },
      { key: 'data', label: 'Update Data', type: 'json', supportsExpression: true, required: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_database_delete: {
    type: 'tools_database_delete',
    name: 'Database Delete',
    category: 'tools',
    icon: 'Trash2',
    color: '#ef4444',
    description: 'Delete database records',
    configFields: [
      { key: 'table', label: 'Table', type: 'string', required: true },
      { key: 'filter', label: 'Filter', type: 'json', required: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_api_connector: {
    type: 'tools_api_connector',
    name: 'API Connector',
    category: 'tools',
    icon: 'Plug',
    color: '#8b5cf6',
    description: 'Connect to external APIs',
    configFields: [
      { key: 'service', label: 'Service', type: 'select', options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Slack', value: 'slack' },
        { label: 'Discord', value: 'discord' },
        { label: 'GitHub', value: 'github' },
        { label: 'Custom', value: 'custom' }
      ], required: true },
      { key: 'action', label: 'Action', type: 'string', required: true },
      { key: 'parameters', label: 'Parameters', type: 'json', supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_file_read: {
    type: 'tools_file_read',
    name: 'Read File',
    category: 'tools',
    icon: 'FileText',
    color: '#0ea5e9',
    description: 'Read file contents',
    configFields: [
      { key: 'filePath', label: 'File Path/URL', type: 'expression', supportsExpression: true, required: true },
      { key: 'encoding', label: 'Encoding', type: 'select', options: [
        { label: 'UTF-8', value: 'utf8' },
        { label: 'Base64', value: 'base64' },
        { label: 'Binary', value: 'binary' }
      ], defaultValue: 'utf8' }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_file_write: {
    type: 'tools_file_write',
    name: 'Write File',
    category: 'tools',
    icon: 'FilePlus',
    color: '#22c55e',
    description: 'Write content to file',
    configFields: [
      { key: 'fileName', label: 'File Name', type: 'expression', supportsExpression: true, required: true },
      { key: 'content', label: 'Content', type: 'expression', supportsExpression: true, required: true },
      { key: 'mimeType', label: 'MIME Type', type: 'string', defaultValue: 'text/plain' }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_email_send: {
    type: 'tools_email_send',
    name: 'Send Email',
    category: 'tools',
    icon: 'Mail',
    color: '#ef4444',
    description: 'Send email message',
    configFields: [
      { key: 'to', label: 'To', type: 'expression', required: true, supportsExpression: true },
      { key: 'cc', label: 'CC', type: 'expression', supportsExpression: true },
      { key: 'subject', label: 'Subject', type: 'expression', required: true, supportsExpression: true },
      { key: 'body', label: 'Body', type: 'expression', required: true, supportsExpression: true },
      { key: 'isHtml', label: 'HTML Format', type: 'boolean', defaultValue: false }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_sms_send: {
    type: 'tools_sms_send',
    name: 'Send SMS',
    category: 'tools',
    icon: 'Smartphone',
    color: '#22c55e',
    description: 'Send SMS message',
    configFields: [
      { key: 'to', label: 'Phone Number', type: 'expression', required: true, supportsExpression: true },
      { key: 'message', label: 'Message', type: 'expression', required: true, supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_slack_post: {
    type: 'tools_slack_post',
    name: 'Slack Post',
    category: 'tools',
    icon: 'MessageSquare',
    color: '#7c3aed',
    description: 'Post message to Slack',
    configFields: [
      { key: 'channel', label: 'Channel', type: 'expression', placeholder: '#general', required: true, supportsExpression: true },
      { key: 'message', label: 'Message', type: 'expression', required: true, supportsExpression: true },
      { key: 'username', label: 'Username', type: 'string', defaultValue: 'AETHER Flow' }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_discord_post: {
    type: 'tools_discord_post',
    name: 'Discord Post',
    category: 'tools',
    icon: 'MessageCircle',
    color: '#5865f2',
    description: 'Post message to Discord',
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'string', required: true },
      { key: 'message', label: 'Message', type: 'expression', required: true, supportsExpression: true },
      { key: 'username', label: 'Username', type: 'string' }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  tools_telegram_send: {
    type: 'tools_telegram_send',
    name: 'Telegram Send',
    category: 'tools',
    icon: 'Send',
    color: '#0ea5e9',
    description: 'Send Telegram message',
    configFields: [
      { key: 'chatId', label: 'Chat ID', type: 'expression', required: true, supportsExpression: true },
      { key: 'message', label: 'Message', type: 'expression', required: true, supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_whatsapp_send: {
    type: 'tools_whatsapp_send',
    name: 'WhatsApp Send',
    category: 'tools',
    icon: 'MessageCircle',
    color: '#22c55e',
    description: 'Send WhatsApp message',
    configFields: [
      { key: 'to', label: 'Phone Number', type: 'expression', required: true, supportsExpression: true },
      { key: 'message', label: 'Message', type: 'expression', required: true, supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: true
  },

  tools_code_execute: {
    type: 'tools_code_execute',
    name: 'Code',
    category: 'tools',
    icon: 'Code',
    color: '#f59e0b',
    description: 'Execute JavaScript/TypeScript code',
    configFields: [
      { key: 'language', label: 'Language', type: 'select', options: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' }
      ], defaultValue: 'javascript' },
      { key: 'code', label: 'Code', type: 'code', required: true, placeholder: 'return { result: $input.item.json.value * 2 }' }
    ],
    inputs: 1,
    outputs: 1
  },

  tools_webhook_send: {
    type: 'tools_webhook_send',
    name: 'Webhook Send',
    category: 'tools',
    icon: 'Webhook',
    color: '#8b5cf6',
    description: 'Send data to webhook',
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'expression', required: true, supportsExpression: true },
      { key: 'method', label: 'Method', type: 'select', options: [
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' }
      ], defaultValue: 'POST' },
      { key: 'body', label: 'Body', type: 'json', supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  // =======================================
  // 5️⃣ DATA / OUTPUT
  // =======================================
  data_set: {
    type: 'data_set',
    name: 'Set',
    category: 'data',
    icon: 'Edit3',
    color: '#f59e0b',
    description: 'Set or modify values',
    configFields: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Set Fields Manually', value: 'manual' },
        { label: 'Use JSON', value: 'json' }
      ], defaultValue: 'manual' },
      { key: 'fields', label: 'Fields', type: 'keyvalue', supportsExpression: true },
      { key: 'keepOnlySet', label: 'Keep Only Set Fields', type: 'boolean', defaultValue: false }
    ],
    inputs: 1,
    outputs: 1
  },

  data_transform: {
    type: 'data_transform',
    name: 'Transform',
    category: 'data',
    icon: 'ArrowRightLeft',
    color: '#22c55e',
    description: 'Transform data structure',
    configFields: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Rename Fields', value: 'rename' },
        { label: 'Remove Fields', value: 'remove' },
        { label: 'Flatten', value: 'flatten' },
        { label: 'Custom Expression', value: 'expression' }
      ], defaultValue: 'expression' },
      { key: 'expression', label: 'Expression', type: 'code', supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1
  },

  data_aggregate: {
    type: 'data_aggregate',
    name: 'Aggregate',
    category: 'data',
    icon: 'Sigma',
    color: '#8b5cf6',
    description: 'Aggregate multiple items',
    configFields: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Combine All', value: 'combine' },
        { label: 'Group By', value: 'groupBy' },
        { label: 'Sum', value: 'sum' },
        { label: 'Count', value: 'count' }
      ], defaultValue: 'combine' },
      { key: 'fieldName', label: 'Field Name', type: 'string' },
      { key: 'outputField', label: 'Output Field', type: 'string', defaultValue: 'data' }
    ],
    inputs: 1,
    outputs: 1
  },

  data_filter: {
    type: 'data_filter',
    name: 'Filter',
    category: 'data',
    icon: 'Filter',
    color: '#0ea5e9',
    description: 'Filter items based on condition',
    configFields: [
      { key: 'condition', label: 'Condition', type: 'expression', placeholder: '{{ $json.status === "active" }}', supportsExpression: true, required: true }
    ],
    inputs: 1,
    outputs: 1
  },

  data_sort: {
    type: 'data_sort',
    name: 'Sort',
    category: 'data',
    icon: 'ArrowUpDown',
    color: '#64748b',
    description: 'Sort items by field',
    configFields: [
      { key: 'field', label: 'Sort Field', type: 'string', required: true },
      { key: 'order', label: 'Order', type: 'select', options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' }
      ], defaultValue: 'asc' }
    ],
    inputs: 1,
    outputs: 1
  },

  data_respond: {
    type: 'data_respond',
    name: 'Respond',
    category: 'data',
    icon: 'Reply',
    color: '#22c55e',
    description: 'Send response back to trigger',
    configFields: [
      { key: 'responseCode', label: 'HTTP Status Code', type: 'number', defaultValue: 200 },
      { key: 'body', label: 'Response Body', type: 'json', supportsExpression: true },
      { key: 'headers', label: 'Response Headers', type: 'json' }
    ],
    inputs: 1,
    outputs: 0
  },

  data_store_db: {
    type: 'data_store_db',
    name: 'Store to Database',
    category: 'data',
    icon: 'Database',
    color: '#22c55e',
    description: 'Store data in database',
    configFields: [
      { key: 'table', label: 'Table', type: 'string', required: true },
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Insert', value: 'insert' },
        { label: 'Upsert', value: 'upsert' },
        { label: 'Update', value: 'update' }
      ], defaultValue: 'insert' },
      { key: 'data', label: 'Data', type: 'json', supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  data_store_file: {
    type: 'data_store_file',
    name: 'Store to File',
    category: 'data',
    icon: 'Save',
    color: '#f59e0b',
    description: 'Store data to file storage',
    configFields: [
      { key: 'bucket', label: 'Storage Bucket', type: 'string', defaultValue: 'documents' },
      { key: 'fileName', label: 'File Name', type: 'expression', supportsExpression: true, required: true },
      { key: 'content', label: 'Content', type: 'expression', supportsExpression: true }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  },

  data_store_vector: {
    type: 'data_store_vector',
    name: 'Store to Vector DB',
    category: 'data',
    icon: 'Braces',
    color: '#8b5cf6',
    description: 'Store embeddings in vector database',
    configFields: [
      { key: 'content', label: 'Content to Embed', type: 'expression', supportsExpression: true, required: true },
      { key: 'metadata', label: 'Metadata', type: 'json', supportsExpression: true },
      { key: 'namespace', label: 'Namespace', type: 'string', defaultValue: 'default' }
    ],
    inputs: 1,
    outputs: 1,
    isRealAction: true
  }
};

// ==========================================
// HELPERS
// ==========================================

export const N8N_CATEGORY_CONFIG: Record<N8NCategory, { label: string; icon: string; color: string; order: number }> = {
  trigger: { label: 'Triggers', icon: 'Zap', color: '#7c3aed', order: 1 },
  logic: { label: 'Logic / Flow', icon: 'GitBranch', color: '#22c55e', order: 2 },
  ai: { label: 'AI (Brain)', icon: 'Brain', color: '#a855f7', order: 3 },
  tools: { label: 'Tools / Actions', icon: 'Wrench', color: '#3b82f6', order: 4 },
  data: { label: 'Data / Output', icon: 'Database', color: '#f59e0b', order: 5 }
};

export function getBlocksByCategory(category: N8NCategory): N8NBlockDefinition[] {
  return Object.values(N8N_BLOCK_DEFINITIONS).filter(block => block.category === category);
}

export function getAllCategories(): N8NCategory[] {
  return ['trigger', 'logic', 'ai', 'tools', 'data'];
}
