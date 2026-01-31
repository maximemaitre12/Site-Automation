// ==========================================
// AETHER FLOW - BLOCK LIBRARY (SINGLE SOURCE OF TRUTH)
// Tous les blocs disponibles avec leurs paramètres
// L'IA ne peut utiliser QUE ces blocs
// ==========================================

// ==========================================
// CATEGORIES (structure hiérarchique comme n8n)
// ==========================================

export type BlockCategory = 
  | 'trigger'
  | 'flow'
  | 'ai'
  | 'data_transform'
  | 'core'
  | 'integrations'
  | 'output';

export type BlockSubcategory =
  // Flow
  | 'flow_control'
  | 'flow_branching'
  | 'flow_loops'
  // AI
  | 'ai_models'
  | 'ai_analysis'
  | 'ai_generation'
  // Data Transform
  | 'transform_items'
  | 'transform_convert'
  | 'transform_combine'
  // Core
  | 'core_http'
  | 'core_code'
  | 'core_files'
  // Integrations
  | 'integrations_communication'
  | 'integrations_database'
  | 'integrations_storage';

// ==========================================
// PARAM TYPES
// ==========================================

export type ParamType = 
  | 'string'
  | 'text'        // textarea
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'json'
  | 'expression'  // supports {{ }}
  | 'code'
  | 'keyvalue'
  | 'cron';

export interface BlockParam {
  key: string;
  label: string;
  type: ParamType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  helpText?: string;
  expressionEnabled?: boolean;
  showWhen?: { field: string; value: any };
  section?: 'main' | 'settings' | 'advanced';
}

// ==========================================
// TYPED PORTS (n8n-style connections)
// ==========================================

export type PortType = 
  | 'main'           // Default data flow
  | 'ai_model'       // LLM/Chat model connection
  | 'ai_memory'      // Memory/context connection
  | 'ai_tool'        // Tool for agent
  | 'ai_embeddings'  // Embeddings model
  | 'ai_retriever'   // Vector store retriever
  | 'ai_output_parser' // Output parser
  | 'document'       // Document input
  | 'file';          // File input

export interface BlockPort {
  id: string;
  label: string;
  type: PortType;
  required?: boolean;
  multiple?: boolean;  // Can accept multiple connections
}

// ==========================================
// BLOCK DEFINITION
// ==========================================

export interface BlockDefinition {
  type: string;
  name: string;
  category: BlockCategory;
  subcategory?: BlockSubcategory;
  icon: string;
  color: string;
  description: string;
  params: BlockParam[];
  inputs: number;
  outputs: number;
  // Typed ports for n8n-style connections
  inputPorts?: BlockPort[];
  outputPorts?: BlockPort[];
  outputLabels?: string[];
  isRealAction?: boolean;
  requiresAuth?: boolean;
  popular?: boolean;
  // For sub-nodes (auxiliary blocks)
  isSubNode?: boolean;
  subNodeType?: PortType;
}

// ==========================================
// CATEGORY CONFIG
// ==========================================

export const CATEGORY_CONFIG: Record<BlockCategory, { label: string; icon: string; color: string; description: string }> = {
  trigger: {
    label: 'Triggers',
    icon: 'Zap',
    color: '#7c3aed',
    description: 'Start your workflow'
  },
  flow: {
    label: 'Flow',
    icon: 'GitBranch',
    color: '#22c55e',
    description: 'Branch, merge or loop the flow'
  },
  ai: {
    label: 'AI',
    icon: 'Brain',
    color: '#a855f7',
    description: 'AI models and processing'
  },
  data_transform: {
    label: 'Data Transformation',
    icon: 'Shuffle',
    color: '#f59e0b',
    description: 'Modify and transform data'
  },
  core: {
    label: 'Core',
    icon: 'Box',
    color: '#3b82f6',
    description: 'HTTP requests, code, files'
  },
  integrations: {
    label: 'Integrations',
    icon: 'Plug',
    color: '#0ea5e9',
    description: 'Connect to external services'
  },
  output: {
    label: 'Output',
    icon: 'Download',
    color: '#10b981',
    description: 'Export and save results'
  }
};

export const SUBCATEGORY_CONFIG: Record<BlockSubcategory, { label: string; icon: string }> = {
  // Flow
  flow_control: { label: 'Control', icon: 'Settings2' },
  flow_branching: { label: 'Branching', icon: 'GitBranch' },
  flow_loops: { label: 'Loops', icon: 'Repeat' },
  // AI
  ai_models: { label: 'AI Models', icon: 'Bot' },
  ai_analysis: { label: 'Analysis', icon: 'Search' },
  ai_generation: { label: 'Generation', icon: 'Wand2' },
  // Data Transform
  transform_items: { label: 'Add or Remove Items', icon: 'Filter' },
  transform_convert: { label: 'Convert Data', icon: 'ArrowRightLeft' },
  transform_combine: { label: 'Combine Items', icon: 'Combine' },
  // Core
  core_http: { label: 'HTTP', icon: 'Globe' },
  core_code: { label: 'Code', icon: 'Code' },
  core_files: { label: 'Files', icon: 'FileText' },
  // Integrations
  integrations_communication: { label: 'Communication', icon: 'MessageSquare' },
  integrations_database: { label: 'Database', icon: 'Database' },
  integrations_storage: { label: 'Storage', icon: 'HardDrive' }
};

// ==========================================
// BLOCK LIBRARY - All available blocks
// ==========================================

export const BLOCK_LIBRARY: BlockDefinition[] = [
  // =====================================================
  // TRIGGERS
  // =====================================================
  {
    type: 'manual_trigger',
    name: 'Manual Trigger',
    category: 'trigger',
    icon: 'Play',
    color: '#22c55e',
    description: 'Start workflow manually',
    popular: true,
    params: [],
    inputs: 0,
    outputs: 1
  },
  {
    type: 'webhook_trigger',
    name: 'Webhook',
    category: 'trigger',
    icon: 'Webhook',
    color: '#7c3aed',
    description: 'Start workflow when webhook is called',
    popular: true,
    isRealAction: true,
    params: [
      { key: 'method', label: 'HTTP Method', type: 'select', options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' }
      ], defaultValue: 'POST', section: 'main' },
      { key: 'path', label: 'Path', type: 'string', placeholder: '/my-webhook', section: 'main' },
      { key: 'authentication', label: 'Authentication', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Basic Auth', value: 'basic' },
        { label: 'Bearer Token', value: 'bearer' },
        { label: 'API Key', value: 'apikey' }
      ], defaultValue: 'none', section: 'settings' }
    ],
    inputs: 0,
    outputs: 1
  },
  {
    type: 'schedule_trigger',
    name: 'Schedule Trigger',
    category: 'trigger',
    icon: 'Clock',
    color: '#0ea5e9',
    description: 'Run workflow on a schedule',
    popular: true,
    params: [
      { key: 'rule', label: 'Trigger Rule', type: 'select', options: [
        { label: 'Every Minute', value: 'everyMinute' },
        { label: 'Every 5 Minutes', value: 'every5Minutes' },
        { label: 'Every Hour', value: 'everyHour' },
        { label: 'Every Day at 9am', value: 'everyDay9am' },
        { label: 'Every Week (Monday)', value: 'everyWeekMonday' },
        { label: 'Custom (Cron)', value: 'cron' }
      ], defaultValue: 'everyHour', section: 'main' },
      { key: 'cronExpression', label: 'Cron Expression', type: 'cron', placeholder: '0 9 * * 1-5', showWhen: { field: 'rule', value: 'cron' }, section: 'main' },
      { key: 'timezone', label: 'Timezone', type: 'select', options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'Europe/Paris', value: 'Europe/Paris' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' }
      ], defaultValue: 'Europe/Paris', section: 'settings' }
    ],
    inputs: 0,
    outputs: 1
  },
  // Gmail Trigger (OAuth) - aligned with backend workflow-execute
  {
    type: 'trigger_gmail',
    name: 'Gmail Trigger',
    category: 'trigger',
    icon: 'Mail',
    color: '#ef4444',
    description: 'Récupère le dernier email via Gmail OAuth',
    isRealAction: true,
    requiresAuth: true,
    popular: true,
    params: [
      { key: 'provider', label: 'Provider', type: 'select', options: [
        { label: 'Gmail (OAuth)', value: 'gmail' }
      ], defaultValue: 'gmail', section: 'main' },
      { key: 'query', label: 'Requête Gmail', type: 'string', placeholder: 'in:inbox', defaultValue: 'in:inbox', section: 'main', helpText: 'Syntaxe Gmail (ex: in:inbox is:unread)' },
      { key: 'maxResults', label: 'Nombre max d\'emails', type: 'number', defaultValue: 1, section: 'settings' },
      // OAuth credentials (needed for BYOK flow)
      { key: 'clientId', label: 'Google Client ID', type: 'string', section: 'advanced', helpText: 'Requis pour la connexion OAuth' },
      { key: 'clientSecret', label: 'Google Client Secret', type: 'string', section: 'advanced', helpText: 'Requis pour la connexion OAuth' }
    ],
    inputs: 0,
    outputs: 1
  },
  // Legacy alias
  {
    type: 'email_trigger',
    name: 'Email Received',
    category: 'trigger',
    icon: 'Mail',
    color: '#ef4444',
    description: 'Trigger when email is received (alias for trigger_gmail)',
    isRealAction: true,
    requiresAuth: true,
    params: [
      { key: 'provider', label: 'Email Provider', type: 'select', options: [
        { label: 'Gmail (OAuth)', value: 'gmail' }
      ], defaultValue: 'gmail', section: 'main' },
      { key: 'query', label: 'Filter Query', type: 'string', placeholder: 'in:inbox', defaultValue: 'in:inbox', section: 'main' },
      { key: 'maxResults', label: 'Max Emails', type: 'number', defaultValue: 1, section: 'settings' },
      { key: 'clientId', label: 'Google Client ID', type: 'string', section: 'advanced' },
      { key: 'clientSecret', label: 'Google Client Secret', type: 'string', section: 'advanced' }
    ],
    inputs: 0,
    outputs: 1
  },
  {
    type: 'form_trigger',
    name: 'Form Submitted',
    category: 'trigger',
    icon: 'ClipboardList',
    color: '#8b5cf6',
    description: 'Trigger when form is submitted',
    params: [
      { key: 'formId', label: 'Form ID', type: 'string', section: 'main' },
      { key: 'fields', label: 'Expected Fields', type: 'json', placeholder: '["name", "email", "message"]', section: 'main' }
    ],
    inputs: 0,
    outputs: 1
  },

  // =====================================================
  // FLOW CONTROL
  // =====================================================
  {
    type: 'if',
    name: 'IF',
    category: 'flow',
    subcategory: 'flow_branching',
    icon: 'GitBranch',
    color: '#22c55e',
    description: 'Route items to true/false branches',
    popular: true,
    outputLabels: ['true', 'false'],
    params: [
      { key: 'condition', label: 'Condition', type: 'expression', placeholder: '{{ $json.value > 100 }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'combineWith', label: 'Combine Multiple Conditions', type: 'select', options: [
        { label: 'AND', value: 'and' },
        { label: 'OR', value: 'or' }
      ], defaultValue: 'and', section: 'settings' }
    ],
    inputs: 1,
    outputs: 2
  },
  {
    type: 'switch',
    name: 'Switch',
    category: 'flow',
    subcategory: 'flow_branching',
    icon: 'GitBranch',
    color: '#22c55e',
    description: 'Route to different outputs based on rules',
    popular: true,
    params: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Rules', value: 'rules' },
        { label: 'Expression', value: 'expression' }
      ], defaultValue: 'rules', section: 'main' },
      { key: 'rules', label: 'Rules', type: 'json', placeholder: '[{"condition": "...", "output": 0}]', section: 'main' },
      { key: 'fallbackOutput', label: 'Fallback Output Index', type: 'number', defaultValue: 0, section: 'settings' }
    ],
    inputs: 1,
    outputs: 4
  },
  {
    type: 'merge',
    name: 'Merge',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'Combine',
    color: '#0ea5e9',
    description: 'Merge data from multiple inputs',
    popular: true,
    params: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Append', value: 'append' },
        { label: 'Combine by Position', value: 'combine' },
        { label: 'Combine by Field', value: 'combineByField' },
        { label: 'Keep First Match', value: 'keepFirst' }
      ], defaultValue: 'append', section: 'main' },
      { key: 'joinField', label: 'Join Field', type: 'string', showWhen: { field: 'mode', value: 'combineByField' }, section: 'main' }
    ],
    inputs: 2,
    outputs: 1
  },
  {
    type: 'loop',
    name: 'Loop Over Items',
    category: 'flow',
    subcategory: 'flow_loops',
    icon: 'Repeat',
    color: '#f59e0b',
    description: 'Split data into batches and iterate',
    popular: true,
    outputLabels: ['loop', 'done'],
    params: [
      { key: 'batchSize', label: 'Batch Size', type: 'number', defaultValue: 1, section: 'main' },
      { key: 'maxIterations', label: 'Max Iterations', type: 'number', defaultValue: 100, section: 'settings' }
    ],
    inputs: 1,
    outputs: 2
  },
  {
    type: 'filter',
    name: 'Filter',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'Filter',
    color: '#22c55e',
    description: 'Remove items matching a condition',
    popular: true,
    params: [
      { key: 'condition', label: 'Keep items where', type: 'expression', placeholder: '{{ $json.status === "active" }}', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'limit',
    name: 'Limit',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'ArrowDown',
    color: '#64748b',
    description: 'Restrict the number of items',
    params: [
      { key: 'maxItems', label: 'Max Items', type: 'number', defaultValue: 10, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'split_out',
    name: 'Split Out',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'Split',
    color: '#8b5cf6',
    description: 'Turn array into separate items',
    params: [
      { key: 'fieldToSplit', label: 'Field to Split', type: 'string', placeholder: 'items', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'wait',
    name: 'Wait',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'Clock',
    color: '#64748b',
    description: 'Wait before continuing',
    params: [
      { key: 'amount', label: 'Duration', type: 'number', defaultValue: 1, section: 'main' },
      { key: 'unit', label: 'Unit', type: 'select', options: [
        { label: 'Seconds', value: 'seconds' },
        { label: 'Minutes', value: 'minutes' },
        { label: 'Hours', value: 'hours' }
      ], defaultValue: 'seconds', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'stop_and_error',
    name: 'Stop and Error',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'AlertTriangle',
    color: '#ef4444',
    description: 'Throw an error in the workflow',
    params: [
      { key: 'errorMessage', label: 'Error Message', type: 'string', placeholder: 'Something went wrong', section: 'main' }
    ],
    inputs: 1,
    outputs: 0
  },
  {
    type: 'no_op',
    name: 'No Operation',
    category: 'flow',
    subcategory: 'flow_control',
    icon: 'Minus',
    color: '#94a3b8',
    description: 'Pass through without changes',
    params: [],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // AI
  // =====================================================
{
    type: 'ai_agent',
    name: 'AI Agent',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Bot',
    color: '#a855f7',
    description: 'AI Agent with tools and memory - connect sub-nodes for Chat Model, Memory, and Tools',
    popular: true,
    params: [
      { key: 'systemPrompt', label: 'System Prompt', type: 'text', placeholder: 'You are a helpful assistant...', required: true, section: 'main' },
      { key: 'userPrompt', label: 'User Message', type: 'expression', placeholder: '{{ $json.message }}', expressionEnabled: true, section: 'main' },
      { key: 'outputMode', label: 'Output Mode', type: 'select', options: [
        { label: 'Text', value: 'text' },
        { label: 'JSON', value: 'json' },
        { label: 'Streaming', value: 'stream' }
      ], defaultValue: 'text', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1,
    // n8n-style typed input ports
    inputPorts: [
      { id: 'ai_model', label: 'Chat Model', type: 'ai_model', required: true },
      { id: 'ai_memory', label: 'Memory', type: 'ai_memory' },
      { id: 'ai_tool', label: 'Tool', type: 'ai_tool', multiple: true }
    ]
  },
  {
    type: 'ai_prompt',
    name: 'AI Prompt',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'MessageSquare',
    color: '#8b5cf6',
    description: 'Send prompt to LLM and get response',
    popular: true,
    params: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'GPT-5 Mini (Fast)', value: 'openai/gpt-5-mini' },
        { label: 'GPT-5', value: 'openai/gpt-5' },
        { label: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' }
      ], defaultValue: 'openai/gpt-5-mini', section: 'main' },
      { key: 'prompt', label: 'Prompt', type: 'expression', placeholder: 'Analyze this: {{ $json.text }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7, section: 'settings' },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000, section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_summarize',
    name: 'Summarize',
    category: 'ai',
    subcategory: 'ai_analysis',
    icon: 'Sparkles',
    color: '#f59e0b',
    description: 'Summarize text content',
    popular: true,
    params: [
      { key: 'input', label: 'Text to Summarize', type: 'expression', placeholder: '{{ $json.content }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'style', label: 'Summary Style', type: 'select', options: [
        { label: 'Brief (1-2 sentences)', value: 'brief' },
        { label: 'Bullet Points', value: 'bullets' },
        { label: 'Executive Summary', value: 'executive' },
        { label: 'Detailed', value: 'detailed' }
      ], defaultValue: 'brief', section: 'main' },
      { key: 'maxLength', label: 'Max Words', type: 'number', defaultValue: 100, section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_extract',
    name: 'Extract Data',
    category: 'ai',
    subcategory: 'ai_analysis',
    icon: 'FileSearch',
    color: '#22c55e',
    description: 'Extract structured data from text',
    popular: true,
    params: [
      { key: 'input', label: 'Text to Parse', type: 'expression', placeholder: '{{ $json.content }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'fields', label: 'Fields to Extract', type: 'json', placeholder: '["name", "email", "phone", "company"]', required: true, section: 'main' },
      { key: 'description', label: 'Extraction Instructions', type: 'text', placeholder: 'Extract contact information from this email', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_classify',
    name: 'Classify',
    category: 'ai',
    subcategory: 'ai_analysis',
    icon: 'Tags',
    color: '#0ea5e9',
    description: 'Classify items into categories',
    outputLabels: ['Category 1', 'Category 2', 'Category 3'],
    params: [
      { key: 'input', label: 'Text to Classify', type: 'expression', placeholder: '{{ $json.text }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'categories', label: 'Categories', type: 'json', placeholder: '["Urgent", "Normal", "Low Priority"]', required: true, section: 'main' },
      { key: 'routeByCategory', label: 'Create Output per Category', type: 'boolean', defaultValue: true, section: 'settings' }
    ],
    inputs: 1,
    outputs: 3
  },
  {
    type: 'ai_sentiment',
    name: 'Sentiment Analysis',
    category: 'ai',
    subcategory: 'ai_analysis',
    icon: 'Heart',
    color: '#ec4899',
    description: 'Analyze sentiment and emotions',
    params: [
      { key: 'input', label: 'Text', type: 'expression', placeholder: '{{ $json.text }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'detailed', label: 'Detailed Analysis', type: 'boolean', defaultValue: true, section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_translate',
    name: 'Translate',
    category: 'ai',
    subcategory: 'ai_generation',
    icon: 'Languages',
    color: '#0ea5e9',
    description: 'Translate text to another language',
    params: [
      { key: 'input', label: 'Text', type: 'expression', placeholder: '{{ $json.text }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'targetLanguage', label: 'Target Language', type: 'select', options: [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'Spanish', value: 'es' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Portuguese', value: 'pt' },
        { label: 'Chinese', value: 'zh' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Korean', value: 'ko' },
        { label: 'Arabic', value: 'ar' }
      ], required: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_generate',
    name: 'Generate Content',
    category: 'ai',
    subcategory: 'ai_generation',
    icon: 'Wand2',
    color: '#ec4899',
    description: 'Generate text content with AI',
    params: [
      { key: 'prompt', label: 'Generation Prompt', type: 'expression', placeholder: 'Write a blog post about...', required: true, expressionEnabled: true, section: 'main' },
      { key: 'style', label: 'Writing Style', type: 'select', options: [
        { label: 'Professional', value: 'professional' },
        { label: 'Casual', value: 'casual' },
        { label: 'Creative', value: 'creative' },
        { label: 'Technical', value: 'technical' }
      ], defaultValue: 'professional', section: 'main' },
      { key: 'length', label: 'Length', type: 'select', options: [
        { label: 'Short (1-2 paragraphs)', value: 'short' },
        { label: 'Medium (3-5 paragraphs)', value: 'medium' },
        { label: 'Long (full article)', value: 'long' }
      ], defaultValue: 'medium', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'ai_vision',
    name: 'Analyze Image',
    category: 'ai',
    subcategory: 'ai_analysis',
    icon: 'Eye',
    color: '#f59e0b',
    description: 'Analyze images with AI (OCR, description)',
    params: [
      { key: 'imageUrl', label: 'Image URL', type: 'expression', placeholder: '{{ $json.imageUrl }}', required: true, expressionEnabled: true, section: 'main' },
      { key: 'task', label: 'Task', type: 'select', options: [
        { label: 'Describe Image', value: 'describe' },
        { label: 'Extract Text (OCR)', value: 'ocr' },
        { label: 'Detect Objects', value: 'objects' },
        { label: 'Custom Prompt', value: 'custom' }
      ], defaultValue: 'describe', section: 'main' },
      { key: 'customPrompt', label: 'Custom Prompt', type: 'text', showWhen: { field: 'task', value: 'custom' }, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // DATA TRANSFORMATION
  // =====================================================
  {
    type: 'set',
    name: 'Edit Fields',
    category: 'data_transform',
    subcategory: 'transform_items',
    icon: 'Edit3',
    color: '#f59e0b',
    description: 'Modify, add or remove item fields',
    popular: true,
    params: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { label: 'Set Fields Manually', value: 'manual' },
        { label: 'Use JSON', value: 'json' }
      ], defaultValue: 'manual', section: 'main' },
      { key: 'fields', label: 'Fields', type: 'keyvalue', showWhen: { field: 'mode', value: 'manual' }, section: 'main' },
      { key: 'json', label: 'JSON', type: 'json', placeholder: '{"newField": "{{ $json.oldField }}"}', showWhen: { field: 'mode', value: 'json' }, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'code',
    name: 'Code',
    category: 'data_transform',
    subcategory: 'transform_items',
    icon: 'Code',
    color: '#f59e0b',
    description: 'Run custom JavaScript code',
    popular: true,
    params: [
      { key: 'language', label: 'Language', type: 'select', options: [
        { label: 'JavaScript', value: 'javascript' }
      ], defaultValue: 'javascript', section: 'main' },
      { key: 'code', label: 'Code', type: 'code', placeholder: 'return { result: $input.item.json.value * 2 }', required: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'aggregate',
    name: 'Aggregate',
    category: 'data_transform',
    subcategory: 'transform_combine',
    icon: 'Combine',
    color: '#0ea5e9',
    description: 'Combine field from many items into a list',
    params: [
      { key: 'field', label: 'Field to Aggregate', type: 'string', placeholder: 'name', section: 'main' },
      { key: 'outputField', label: 'Output Field Name', type: 'string', defaultValue: 'aggregated', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'summarize',
    name: 'Summarize',
    category: 'data_transform',
    subcategory: 'transform_combine',
    icon: 'Calculator',
    color: '#f59e0b',
    description: 'Sum, count, max, etc. across items',
    params: [
      { key: 'operation', label: 'Operation', type: 'select', options: [
        { label: 'Sum', value: 'sum' },
        { label: 'Count', value: 'count' },
        { label: 'Average', value: 'avg' },
        { label: 'Min', value: 'min' },
        { label: 'Max', value: 'max' }
      ], defaultValue: 'sum', section: 'main' },
      { key: 'field', label: 'Field', type: 'string', placeholder: 'amount', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'sort',
    name: 'Sort',
    category: 'data_transform',
    subcategory: 'transform_items',
    icon: 'ArrowUpDown',
    color: '#8b5cf6',
    description: 'Change items order',
    params: [
      { key: 'field', label: 'Sort by Field', type: 'string', placeholder: 'createdAt', section: 'main' },
      { key: 'direction', label: 'Direction', type: 'select', options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' }
      ], defaultValue: 'asc', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'remove_duplicates',
    name: 'Remove Duplicates',
    category: 'data_transform',
    subcategory: 'transform_items',
    icon: 'Copy',
    color: '#0ea5e9',
    description: 'Delete items with matching field values',
    params: [
      { key: 'field', label: 'Compare Field', type: 'string', placeholder: 'email', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'rename_keys',
    name: 'Rename Keys',
    category: 'data_transform',
    subcategory: 'transform_items',
    icon: 'Edit2',
    color: '#64748b',
    description: 'Update item field names',
    params: [
      { key: 'mappings', label: 'Rename Mappings', type: 'keyvalue', section: 'main', helpText: 'Old name → New name' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'date_time',
    name: 'Date & Time',
    category: 'data_transform',
    subcategory: 'transform_convert',
    icon: 'Calendar',
    color: '#64748b',
    description: 'Manipulate date and time values',
    params: [
      { key: 'operation', label: 'Operation', type: 'select', options: [
        { label: 'Format Date', value: 'format' },
        { label: 'Add Time', value: 'add' },
        { label: 'Subtract Time', value: 'subtract' },
        { label: 'Get Current Time', value: 'now' }
      ], defaultValue: 'format', section: 'main' },
      { key: 'inputField', label: 'Date Field', type: 'string', placeholder: 'createdAt', section: 'main' },
      { key: 'format', label: 'Output Format', type: 'string', placeholder: 'YYYY-MM-DD HH:mm', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'html',
    name: 'HTML',
    category: 'data_transform',
    subcategory: 'transform_convert',
    icon: 'Code2',
    color: '#f97316',
    description: 'Work with HTML content',
    params: [
      { key: 'operation', label: 'Operation', type: 'select', options: [
        { label: 'Extract Text', value: 'extractText' },
        { label: 'Parse to JSON', value: 'parse' },
        { label: 'Generate HTML', value: 'generate' }
      ], defaultValue: 'extractText', section: 'main' },
      { key: 'html', label: 'HTML Content', type: 'expression', placeholder: '{{ $json.html }}', expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'markdown',
    name: 'Markdown',
    category: 'data_transform',
    subcategory: 'transform_convert',
    icon: 'FileCode',
    color: '#64748b',
    description: 'Convert between Markdown and HTML',
    params: [
      { key: 'direction', label: 'Convert', type: 'select', options: [
        { label: 'Markdown → HTML', value: 'toHtml' },
        { label: 'HTML → Markdown', value: 'toMarkdown' }
      ], defaultValue: 'toHtml', section: 'main' },
      { key: 'input', label: 'Input', type: 'expression', placeholder: '{{ $json.content }}', expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'xml',
    name: 'XML',
    category: 'data_transform',
    subcategory: 'transform_convert',
    icon: 'FileCode',
    color: '#0ea5e9',
    description: 'Convert data from and to XML',
    params: [
      { key: 'direction', label: 'Convert', type: 'select', options: [
        { label: 'XML → JSON', value: 'toJson' },
        { label: 'JSON → XML', value: 'toXml' }
      ], defaultValue: 'toJson', section: 'main' },
      { key: 'input', label: 'Input', type: 'expression', placeholder: '{{ $json.xml }}', expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'crypto',
    name: 'Crypto',
    category: 'data_transform',
    subcategory: 'transform_convert',
    icon: 'Key',
    color: '#64748b',
    description: 'Hash, encrypt or decrypt data',
    params: [
      { key: 'operation', label: 'Operation', type: 'select', options: [
        { label: 'Hash (MD5)', value: 'md5' },
        { label: 'Hash (SHA256)', value: 'sha256' },
        { label: 'HMAC', value: 'hmac' },
        { label: 'Encrypt', value: 'encrypt' },
        { label: 'Decrypt', value: 'decrypt' }
      ], defaultValue: 'sha256', section: 'main' },
      { key: 'input', label: 'Input', type: 'expression', placeholder: '{{ $json.data }}', expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // CORE
  // =====================================================
  {
    type: 'http_request',
    name: 'HTTP Request',
    category: 'core',
    subcategory: 'core_http',
    icon: 'Globe',
    color: '#3b82f6',
    description: 'Make HTTP API requests',
    popular: true,
    isRealAction: true,
    params: [
      { key: 'method', label: 'Method', type: 'select', options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' }
      ], defaultValue: 'GET', required: true, section: 'main' },
      { key: 'url', label: 'URL', type: 'expression', placeholder: 'https://api.example.com/endpoint', required: true, expressionEnabled: true, section: 'main' },
      { key: 'headers', label: 'Headers', type: 'json', placeholder: '{"Authorization": "Bearer {{ $json.token }}"}', section: 'settings' },
      { key: 'body', label: 'Body', type: 'json', section: 'settings', expressionEnabled: true },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'advanced' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'respond_webhook',
    name: 'Respond to Webhook',
    category: 'core',
    subcategory: 'core_http',
    icon: 'Reply',
    color: '#7c3aed',
    description: 'Send response back to webhook caller',
    isRealAction: true,
    params: [
      { key: 'statusCode', label: 'Status Code', type: 'number', defaultValue: 200, section: 'main' },
      { key: 'body', label: 'Response Body', type: 'json', expressionEnabled: true, section: 'main' },
      { key: 'headers', label: 'Response Headers', type: 'json', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'read_file',
    name: 'Read File',
    category: 'core',
    subcategory: 'core_files',
    icon: 'FileText',
    color: '#0ea5e9',
    description: 'Read file contents',
    isRealAction: true,
    params: [
      { key: 'source', label: 'Source', type: 'select', options: [
        { label: 'URL', value: 'url' },
        { label: 'Storage', value: 'storage' },
        { label: 'Previous Node', value: 'input' }
      ], defaultValue: 'url', section: 'main' },
      { key: 'url', label: 'File URL', type: 'expression', showWhen: { field: 'source', value: 'url' }, expressionEnabled: true, section: 'main' },
      { key: 'encoding', label: 'Encoding', type: 'select', options: [
        { label: 'UTF-8', value: 'utf8' },
        { label: 'Base64', value: 'base64' },
        { label: 'Binary', value: 'binary' }
      ], defaultValue: 'utf8', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'write_file',
    name: 'Write File',
    category: 'core',
    subcategory: 'core_files',
    icon: 'FilePlus',
    color: '#22c55e',
    description: 'Create or write content to file',
    isRealAction: true,
    params: [
      { key: 'fileName', label: 'File Name', type: 'expression', placeholder: 'output.txt', required: true, expressionEnabled: true, section: 'main' },
      { key: 'content', label: 'Content', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'mimeType', label: 'MIME Type', type: 'string', defaultValue: 'text/plain', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // INTEGRATIONS
  // =====================================================
  {
    type: 'send_email',
    name: 'Send Email',
    category: 'integrations',
    subcategory: 'integrations_communication',
    icon: 'Mail',
    color: '#ef4444',
    description: 'Send email message',
    popular: true,
    isRealAction: true,
    requiresAuth: true,
    params: [
      { key: 'to', label: 'To', type: 'expression', placeholder: 'recipient@example.com', required: true, expressionEnabled: true, section: 'main' },
      { key: 'subject', label: 'Subject', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'body', label: 'Body', type: 'text', required: true, expressionEnabled: true, section: 'main' },
      { key: 'cc', label: 'CC', type: 'expression', expressionEnabled: true, section: 'settings' },
      { key: 'isHtml', label: 'HTML Format', type: 'boolean', defaultValue: false, section: 'settings' },
      { key: 'attachDocument', label: 'Attach generated document', type: 'boolean', defaultValue: false, helpText: 'Attach PDF/Word document from previous block', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'slack',
    name: 'Slack',
    category: 'integrations',
    subcategory: 'integrations_communication',
    icon: 'MessageSquare',
    color: '#7c3aed',
    description: 'Post message to Slack channel',
    isRealAction: true,
    requiresAuth: true,
    params: [
      { key: 'channel', label: 'Channel', type: 'expression', placeholder: '#general', required: true, expressionEnabled: true, section: 'main' },
      { key: 'message', label: 'Message', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'username', label: 'Bot Username', type: 'string', defaultValue: 'AETHER Flow', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'discord',
    name: 'Discord',
    category: 'integrations',
    subcategory: 'integrations_communication',
    icon: 'MessageCircle',
    color: '#5865f2',
    description: 'Post message to Discord',
    isRealAction: true,
    params: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'string', required: true, section: 'main' },
      { key: 'message', label: 'Message', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'username', label: 'Username', type: 'string', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'telegram',
    name: 'Telegram',
    category: 'integrations',
    subcategory: 'integrations_communication',
    icon: 'Send',
    color: '#0ea5e9',
    description: 'Send Telegram message',
    isRealAction: true,
    requiresAuth: true,
    params: [
      { key: 'chatId', label: 'Chat ID', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'message', label: 'Message', type: 'expression', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'database_query',
    name: 'Database Query',
    category: 'integrations',
    subcategory: 'integrations_database',
    icon: 'Database',
    color: '#22c55e',
    description: 'Query database records',
    isRealAction: true,
    params: [
      { key: 'table', label: 'Table', type: 'string', required: true, section: 'main' },
      { key: 'select', label: 'Select Fields', type: 'string', defaultValue: '*', section: 'main' },
      { key: 'filter', label: 'Filter (JSON)', type: 'json', placeholder: '{"status": "active"}', section: 'main' },
      { key: 'limit', label: 'Limit', type: 'number', defaultValue: 100, section: 'settings' },
      { key: 'orderBy', label: 'Order By', type: 'string', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'database_insert',
    name: 'Database Insert',
    category: 'integrations',
    subcategory: 'integrations_database',
    icon: 'DatabaseBackup',
    color: '#22c55e',
    description: 'Insert records into database',
    isRealAction: true,
    params: [
      { key: 'table', label: 'Table', type: 'string', required: true, section: 'main' },
      { key: 'data', label: 'Data', type: 'json', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'database_update',
    name: 'Database Update',
    category: 'integrations',
    subcategory: 'integrations_database',
    icon: 'RefreshCw',
    color: '#f59e0b',
    description: 'Update database records',
    isRealAction: true,
    params: [
      { key: 'table', label: 'Table', type: 'string', required: true, section: 'main' },
      { key: 'filter', label: 'Filter', type: 'json', required: true, section: 'main' },
      { key: 'data', label: 'Update Data', type: 'json', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // OUTPUT
  // =====================================================
  {
    type: 'generate_document',
    name: 'Generate Document',
    category: 'output',
    icon: 'FileText',
    color: '#3b82f6',
    description: 'Generate Word/PDF document',
    popular: true,
    isRealAction: true,
    params: [
      { key: 'format', label: 'Format', type: 'select', options: [
        { label: 'Word (.docx)', value: 'docx' },
        { label: 'PDF', value: 'pdf' }
      ], defaultValue: 'docx', section: 'main' },
      { key: 'title', label: 'Document Title', type: 'expression', expressionEnabled: true, section: 'main' },
      { key: 'content', label: 'Content', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'filename', label: 'Filename', type: 'expression', placeholder: 'document.docx', expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'download_file',
    name: 'Download File',
    category: 'output',
    icon: 'Download',
    color: '#10b981',
    description: 'Trigger file download in browser',
    popular: true,
    isRealAction: true,
    params: [
      { key: 'filename', label: 'Filename', type: 'expression', placeholder: 'output.txt', required: true, expressionEnabled: true, section: 'main' },
      { key: 'mimeType', label: 'MIME Type', type: 'string', defaultValue: 'application/octet-stream', section: 'settings' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'send_notification',
    name: 'Send Notification',
    category: 'output',
    icon: 'Bell',
    color: '#f59e0b',
    description: 'Send push notification',
    isRealAction: true,
    params: [
      { key: 'title', label: 'Title', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'message', label: 'Message', type: 'expression', required: true, expressionEnabled: true, section: 'main' },
      { key: 'channel', label: 'Channel', type: 'select', options: [
        { label: 'In-App', value: 'inapp' },
        { label: 'Email', value: 'email' },
        { label: 'Both', value: 'both' }
      ], defaultValue: 'inapp', section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },
  {
    type: 'log',
    name: 'Log Message',
    category: 'output',
    icon: 'Terminal',
    color: '#64748b',
    description: 'Log message for debugging',
    params: [
      { key: 'level', label: 'Level', type: 'select', options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warn' },
        { label: 'Error', value: 'error' },
        { label: 'Debug', value: 'debug' }
      ], defaultValue: 'info', section: 'main' },
      { key: 'message', label: 'Message', type: 'expression', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 1,
    outputs: 1
  },

  // =====================================================
  // SUB-NODES (Auxiliary nodes for typed connections)
  // These connect to specific ports on main nodes
  // =====================================================
  
  // AI Model Sub-nodes
  {
    type: 'openai_chat_model',
    name: 'OpenAI Chat Model',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Bot',
    color: '#10a37f',
    description: 'OpenAI GPT model for chat',
    isSubNode: true,
    subNodeType: 'ai_model',
    params: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'GPT-5', value: 'gpt-5' },
        { label: 'GPT-5 Mini', value: 'gpt-5-mini' },
        { label: 'GPT-5 Nano', value: 'gpt-5-nano' }
      ], defaultValue: 'gpt-5-mini', section: 'main' },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7, section: 'settings' },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 2000, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'model', label: 'Model', type: 'ai_model' }]
  },
  {
    type: 'gemini_chat_model',
    name: 'Gemini Chat Model',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Sparkles',
    color: '#4285f4',
    description: 'Google Gemini model for chat',
    isSubNode: true,
    subNodeType: 'ai_model',
    params: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
        { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
        { label: 'Gemini 3 Flash Preview', value: 'gemini-3-flash-preview' }
      ], defaultValue: 'gemini-2.5-flash', section: 'main' },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'model', label: 'Model', type: 'ai_model' }]
  },
  
  // Memory Sub-nodes
  {
    type: 'simple_memory',
    name: 'Simple Memory',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Brain',
    color: '#8b5cf6',
    description: 'In-memory conversation buffer',
    isSubNode: true,
    subNodeType: 'ai_memory',
    params: [
      { key: 'maxMessages', label: 'Max Messages', type: 'number', defaultValue: 10, section: 'main' },
      { key: 'sessionKey', label: 'Session Key', type: 'expression', placeholder: '{{ $json.sessionId }}', expressionEnabled: true, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'memory', label: 'Memory', type: 'ai_memory' }]
  },
  {
    type: 'postgres_memory',
    name: 'Postgres Memory',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Database',
    color: '#336791',
    description: 'Persistent memory in PostgreSQL',
    isSubNode: true,
    subNodeType: 'ai_memory',
    params: [
      { key: 'tableName', label: 'Table Name', type: 'string', defaultValue: 'chat_memory', section: 'main' },
      { key: 'sessionKey', label: 'Session Key', type: 'expression', placeholder: '{{ $json.sessionId }}', expressionEnabled: true, section: 'main' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'memory', label: 'Memory', type: 'ai_memory' }]
  },
  
  // Vector Store / Retriever Sub-nodes
  {
    type: 'simple_vector_store',
    name: 'Simple Vector Store',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Database',
    color: '#22c55e',
    description: 'In-memory vector store for RAG',
    isSubNode: true,
    subNodeType: 'ai_retriever',
    params: [
      { key: 'topK', label: 'Top K Results', type: 'number', defaultValue: 4, section: 'main' },
      { key: 'similarityThreshold', label: 'Similarity Threshold', type: 'number', defaultValue: 0.7, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    inputPorts: [{ id: 'embeddings', label: 'Embeddings', type: 'ai_embeddings' }],
    outputPorts: [{ id: 'retriever', label: 'Retriever', type: 'ai_retriever' }]
  },
  {
    type: 'supabase_vector_store',
    name: 'Supabase Vector Store',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Database',
    color: '#3ecf8e',
    description: 'Vector store using Supabase pgvector',
    isSubNode: true,
    subNodeType: 'ai_retriever',
    params: [
      { key: 'tableName', label: 'Table Name', type: 'string', defaultValue: 'documents', section: 'main' },
      { key: 'contentColumn', label: 'Content Column', type: 'string', defaultValue: 'content', section: 'main' },
      { key: 'embeddingColumn', label: 'Embedding Column', type: 'string', defaultValue: 'embedding', section: 'main' },
      { key: 'topK', label: 'Top K Results', type: 'number', defaultValue: 4, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    inputPorts: [{ id: 'embeddings', label: 'Embeddings', type: 'ai_embeddings' }],
    outputPorts: [{ id: 'retriever', label: 'Retriever', type: 'ai_retriever' }]
  },
  
  // Embeddings Sub-nodes
  {
    type: 'openai_embeddings',
    name: 'OpenAI Embeddings',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Sparkles',
    color: '#10a37f',
    description: 'OpenAI text embeddings',
    isSubNode: true,
    subNodeType: 'ai_embeddings',
    params: [
      { key: 'model', label: 'Model', type: 'select', options: [
        { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
        { label: 'text-embedding-3-large', value: 'text-embedding-3-large' }
      ], defaultValue: 'text-embedding-3-small', section: 'main' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'embeddings', label: 'Embeddings', type: 'ai_embeddings' }]
  },
  
  // Tool Sub-nodes
  {
    type: 'http_tool',
    name: 'HTTP Request Tool',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Globe',
    color: '#3b82f6',
    description: 'HTTP request as agent tool',
    isSubNode: true,
    subNodeType: 'ai_tool',
    params: [
      { key: 'name', label: 'Tool Name', type: 'string', placeholder: 'search_api', required: true, section: 'main' },
      { key: 'description', label: 'Tool Description', type: 'text', placeholder: 'Search for information...', required: true, section: 'main' },
      { key: 'method', label: 'HTTP Method', type: 'select', options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' }
      ], defaultValue: 'GET', section: 'main' },
      { key: 'url', label: 'URL', type: 'expression', required: true, expressionEnabled: true, section: 'main' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'tool', label: 'Tool', type: 'ai_tool' }]
  },
  {
    type: 'code_tool',
    name: 'Code Tool',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'Code',
    color: '#f59e0b',
    description: 'JavaScript function as agent tool',
    isSubNode: true,
    subNodeType: 'ai_tool',
    params: [
      { key: 'name', label: 'Tool Name', type: 'string', placeholder: 'calculate', required: true, section: 'main' },
      { key: 'description', label: 'Tool Description', type: 'text', placeholder: 'Perform calculations...', required: true, section: 'main' },
      { key: 'parameters', label: 'Parameters Schema', type: 'json', placeholder: '{"expression": {"type": "string"}}', section: 'main' },
      { key: 'code', label: 'Code', type: 'code', placeholder: 'return eval(input.expression);', section: 'main' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'tool', label: 'Tool', type: 'ai_tool' }]
  },
  {
    type: 'workflow_tool',
    name: 'Workflow Tool',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'GitBranch',
    color: '#8b5cf6',
    description: 'Another workflow as agent tool',
    isSubNode: true,
    subNodeType: 'ai_tool',
    params: [
      { key: 'name', label: 'Tool Name', type: 'string', required: true, section: 'main' },
      { key: 'description', label: 'Tool Description', type: 'text', required: true, section: 'main' },
      { key: 'workflowId', label: 'Workflow ID', type: 'string', required: true, section: 'main' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'tool', label: 'Tool', type: 'ai_tool' }]
  },
  
  // Document Loaders
  {
    type: 'document_loader',
    name: 'Document Loader',
    category: 'ai',
    subcategory: 'ai_models',
    icon: 'FileText',
    color: '#64748b',
    description: 'Load and parse documents',
    isSubNode: true,
    subNodeType: 'document',
    params: [
      { key: 'source', label: 'Source', type: 'select', options: [
        { label: 'File Input', value: 'file' },
        { label: 'URL', value: 'url' },
        { label: 'Text', value: 'text' }
      ], defaultValue: 'file', section: 'main' },
      { key: 'url', label: 'URL', type: 'expression', expressionEnabled: true, showWhen: { field: 'source', value: 'url' }, section: 'main' },
      { key: 'text', label: 'Text Content', type: 'expression', expressionEnabled: true, showWhen: { field: 'source', value: 'text' }, section: 'main' },
      { key: 'chunkSize', label: 'Chunk Size', type: 'number', defaultValue: 1000, section: 'settings' },
      { key: 'chunkOverlap', label: 'Chunk Overlap', type: 'number', defaultValue: 200, section: 'settings' }
    ],
    inputs: 0,
    outputs: 1,
    outputPorts: [{ id: 'document', label: 'Document', type: 'document' }]
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getBlockByType(type: string): BlockDefinition | undefined {
  return BLOCK_LIBRARY.find(b => b.type === type);
}

export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => b.category === category);
}

export function getBlocksBySubcategory(subcategory: BlockSubcategory): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => b.subcategory === subcategory);
}

export function getPopularBlocks(): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => b.popular);
}

export function getMainBlocks(): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => !b.isSubNode);
}

export function getSubNodes(): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => b.isSubNode);
}

export function getSubNodesByType(portType: PortType): BlockDefinition[] {
  return BLOCK_LIBRARY.filter(b => b.isSubNode && b.subNodeType === portType);
}

export function getAllBlockTypes(): string[] {
  return BLOCK_LIBRARY.map(b => b.type);
}

export function searchBlocks(query: string): BlockDefinition[] {
  const q = query.toLowerCase();
  return BLOCK_LIBRARY.filter(b => 
    b.name.toLowerCase().includes(q) ||
    b.description.toLowerCase().includes(q) ||
    b.type.toLowerCase().includes(q)
  );
}

// Export for AI prompt generation - includes typed ports
export function getBlockTypesForAI(): string {
  const mainBlocks: string[] = [];
  const subNodes: string[] = [];
  
  BLOCK_LIBRARY.forEach(block => {
    const requiredParams = block.params
      .filter(p => p.required)
      .map(p => `${p.key}: ${p.type}`)
      .join(', ');
    
    const inputPorts = block.inputPorts?.map(p => p.type).join(', ');
    const outputPorts = block.outputPorts?.map(p => p.type).join(', ');
    
    let portInfo = '';
    if (inputPorts) portInfo += ` [inputs: ${inputPorts}]`;
    if (outputPorts) portInfo += ` [outputs: ${outputPorts}]`;
    
    const line = `- ${block.type}: ${block.description}${requiredParams ? ` (required: ${requiredParams})` : ''}${portInfo}`;
    
    if (block.isSubNode) {
      subNodes.push(line);
    } else {
      mainBlocks.push(line);
    }
  });
  
  return `=== MAIN BLOCKS ===\n${mainBlocks.join('\n')}\n\n=== SUB-NODES (connect to typed ports) ===\n${subNodes.join('\n')}`;
}
