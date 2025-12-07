// ==========================================
// AETHER FLOW - Advanced Workflow Types
// ==========================================

export type BlockType = 
  // Triggers
  | 'trigger_text' 
  | 'trigger_file' 
  | 'trigger_webhook' 
  | 'trigger_form'
  | 'trigger_schedule'
  | 'trigger_email'
  // AI Actions
  | 'ai_summary' 
  | 'ai_extract' 
  | 'ai_classify' 
  | 'ai_generate'
  | 'ai_decision'
  | 'ai_translate'
  | 'ai_sentiment'
  | 'ai_vision'
  // Data & Transform
  | 'transform_json'
  | 'transform_filter'
  | 'transform_map'
  | 'transform_merge'
  // Control Flow
  | 'control_condition'
  | 'control_loop'
  | 'control_delay'
  | 'control_parallel'
  | 'control_branch'
  | 'control_merge'
  // Workflow
  | 'workflow_call'
  // Integrations
  | 'http_request'
  | 'http_webhook'
  // System Actions
  | 'system_email'
  | 'system_webhook'
  | 'system_save'
  | 'system_notify'
  | 'system_log';

export type BlockCategory = 'trigger' | 'ai' | 'transform' | 'control' | 'integration' | 'system';

export interface BlockConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceHandle?: string; // For conditional outputs (true/false)
  targetHandle?: string;
}

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections?: BlockConnection[];
  retryConfig?: {
    enabled: boolean;
    maxRetries: number;
    backoffMs: number;
  };
  timeout?: number; // in ms
  description?: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  variables?: Record<string, any>;
  is_active: boolean;
  is_template?: boolean;
  template_category?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRunLog {
  blockId: string;
  blockName: string;
  blockType: BlockType;
  input: any;
  output: any;
  status: 'success' | 'error' | 'pending' | 'skipped' | 'running';
  duration: number;
  timestamp: string;
  retryCount?: number;
  error?: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input_data: any;
  output_data: any;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  logs?: WorkflowRunLog[];
  totalDuration?: number;
  blocksExecuted?: number;
}

export interface BlockDefinition {
  name: string;
  category: BlockCategory;
  color: string;
  icon: string;
  description: string;
  configFields: ConfigField[];
  inputs?: number;
  outputs?: number;
  allowMultipleOutputs?: boolean;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'json' | 'code' | 'keyvalue';
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  helpText?: string;
}

// ==========================================
// BLOCK DEFINITIONS
// ==========================================

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  // ===== TRIGGERS =====
  trigger_text: {
    name: 'Text Input',
    category: 'trigger',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Type',
    description: 'Start workflow with text input',
    configFields: [
      { key: 'placeholder', label: 'Placeholder', type: 'text', placeholder: 'Enter text...' },
      { key: 'multiline', label: 'Multiline', type: 'boolean', defaultValue: true }
    ]
  },
  trigger_file: {
    name: 'File Upload',
    category: 'trigger',
    color: 'from-purple-500 to-pink-400',
    icon: 'FileUp',
    description: 'Start workflow with file upload',
    configFields: [
      { key: 'acceptedTypes', label: 'Accepted Types', type: 'text', placeholder: '.pdf,.doc,.txt' },
      { key: 'maxSizeMb', label: 'Max Size (MB)', type: 'number', defaultValue: 10 }
    ]
  },
  trigger_webhook: {
    name: 'Webhook Trigger',
    category: 'trigger',
    color: 'from-green-500 to-emerald-400',
    icon: 'Globe',
    description: 'Trigger via external webhook',
    configFields: [
      { key: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'GET', 'PUT'], defaultValue: 'POST' },
      { key: 'authRequired', label: 'Require Auth', type: 'boolean', defaultValue: true }
    ]
  },
  trigger_form: {
    name: 'Custom Form',
    category: 'trigger',
    color: 'from-orange-500 to-amber-400',
    icon: 'ClipboardList',
    description: 'Custom form with multiple fields',
    configFields: [
      { key: 'fields', label: 'Form Fields (JSON)', type: 'json', placeholder: '[{"name": "field1", "type": "text"}]' }
    ]
  },
  trigger_schedule: {
    name: 'Schedule',
    category: 'trigger',
    color: 'from-sky-500 to-blue-400',
    icon: 'Clock',
    description: 'Run on a schedule',
    configFields: [
      { key: 'cron', label: 'Cron Expression', type: 'text', placeholder: '0 9 * * *' },
      { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'Europe/Paris', 'America/New_York'] }
    ]
  },
  trigger_email: {
    name: 'Email Trigger',
    category: 'trigger',
    color: 'from-red-500 to-pink-400',
    icon: 'Mail',
    description: 'Trigger when email received',
    configFields: [
      { key: 'address', label: 'Email Address', type: 'text', placeholder: 'workflow@your-domain.com' },
      { key: 'subjectFilter', label: 'Subject Filter', type: 'text', placeholder: 'Invoice*' }
    ]
  },

  // ===== AI ACTIONS =====
  ai_summary: {
    name: 'AI Summary',
    category: 'ai',
    color: 'from-indigo-500 to-blue-400',
    icon: 'Sparkles',
    description: 'Summarize text with AI',
    configFields: [
      { key: 'style', label: 'Style', type: 'select', options: ['short', 'detailed', 'bullet_points', 'executive'] },
      { key: 'maxLength', label: 'Max Words', type: 'number', defaultValue: 200 },
      { key: 'language', label: 'Output Language', type: 'text', placeholder: 'Same as input' }
    ]
  },
  ai_extract: {
    name: 'Extract Data',
    category: 'ai',
    color: 'from-yellow-500 to-orange-400',
    icon: 'FileSearch',
    description: 'Extract structured data from text',
    configFields: [
      { key: 'fields', label: 'Fields to Extract', type: 'textarea', placeholder: 'name, email, date, amount, company' },
      { key: 'outputFormat', label: 'Output Format', type: 'select', options: ['json', 'table', 'list'] },
      { key: 'strict', label: 'Strict Mode', type: 'boolean', helpText: 'Return null for missing fields' }
    ]
  },
  ai_classify: {
    name: 'AI Classification',
    category: 'ai',
    color: 'from-teal-500 to-cyan-400',
    icon: 'Tags',
    description: 'Classify into categories',
    configFields: [
      { key: 'categories', label: 'Categories', type: 'textarea', placeholder: 'Category1, Category2, Category3' },
      { key: 'multiLabel', label: 'Allow Multiple', type: 'boolean' },
      { key: 'confidenceThreshold', label: 'Min Confidence', type: 'number', defaultValue: 0.7 }
    ]
  },
  ai_generate: {
    name: 'Generate Content',
    category: 'ai',
    color: 'from-violet-500 to-purple-400',
    icon: 'Wand2',
    description: 'Generate text content with AI',
    configFields: [
      { key: 'prompt', label: 'Generation Prompt', type: 'textarea', placeholder: 'Generate a professional email response...' },
      { key: 'tone', label: 'Tone', type: 'select', options: ['professional', 'casual', 'formal', 'creative', 'technical'] },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 500 },
      { key: 'temperature', label: 'Creativity (0-1)', type: 'number', defaultValue: 0.7 }
    ]
  },
  ai_decision: {
    name: 'AI Decision',
    category: 'ai',
    color: 'from-rose-500 to-pink-400',
    icon: 'GitBranch',
    description: 'Make intelligent decisions with branching',
    configFields: [
      { key: 'question', label: 'Decision Question', type: 'textarea', placeholder: 'Should this request be approved?' },
      { key: 'criteria', label: 'Decision Criteria', type: 'textarea', placeholder: 'Approve if amount < 1000€ and customer is verified' }
    ],
    outputs: 2,
    allowMultipleOutputs: true
  },
  ai_translate: {
    name: 'AI Translate',
    category: 'ai',
    color: 'from-cyan-500 to-blue-400',
    icon: 'Languages',
    description: 'Translate text to any language',
    configFields: [
      { key: 'targetLanguage', label: 'Target Language', type: 'select', options: ['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Arabic'] },
      { key: 'preserveFormatting', label: 'Preserve Formatting', type: 'boolean', defaultValue: true }
    ]
  },
  ai_sentiment: {
    name: 'Sentiment Analysis',
    category: 'ai',
    color: 'from-pink-500 to-rose-400',
    icon: 'Heart',
    description: 'Analyze sentiment and emotions',
    configFields: [
      { key: 'detailed', label: 'Detailed Analysis', type: 'boolean', defaultValue: true },
      { key: 'emotions', label: 'Detect Emotions', type: 'boolean', defaultValue: true }
    ]
  },
  ai_vision: {
    name: 'AI Vision',
    category: 'ai',
    color: 'from-amber-500 to-yellow-400',
    icon: 'Eye',
    description: 'Analyze images with AI',
    configFields: [
      { key: 'task', label: 'Task', type: 'select', options: ['describe', 'extract_text', 'detect_objects', 'analyze'] },
      { key: 'prompt', label: 'Custom Prompt', type: 'textarea', placeholder: 'What do you see in this image?' }
    ]
  },

  // ===== DATA TRANSFORM =====
  transform_json: {
    name: 'JSON Transform',
    category: 'transform',
    color: 'from-emerald-500 to-green-400',
    icon: 'Braces',
    description: 'Transform JSON data with JMESPath',
    configFields: [
      { key: 'expression', label: 'JMESPath Expression', type: 'code', placeholder: 'data.items[*].name' },
      { key: 'outputKey', label: 'Output Key', type: 'text', defaultValue: 'result' }
    ]
  },
  transform_filter: {
    name: 'Filter Data',
    category: 'transform',
    color: 'from-lime-500 to-green-400',
    icon: 'Filter',
    description: 'Filter array data by conditions',
    configFields: [
      { key: 'condition', label: 'Filter Condition', type: 'code', placeholder: 'item.status === "active"' },
      { key: 'field', label: 'Target Field', type: 'text', placeholder: 'items' }
    ]
  },
  transform_map: {
    name: 'Map Data',
    category: 'transform',
    color: 'from-green-500 to-teal-400',
    icon: 'ArrowRightLeft',
    description: 'Map and transform array items',
    configFields: [
      { key: 'mapping', label: 'Mapping Template', type: 'json', placeholder: '{"id": "{{item.id}}", "name": "{{item.fullName}}"}' }
    ]
  },
  transform_merge: {
    name: 'Merge Data',
    category: 'transform',
    color: 'from-teal-500 to-emerald-400',
    icon: 'Combine',
    description: 'Merge multiple data sources',
    configFields: [
      { key: 'strategy', label: 'Merge Strategy', type: 'select', options: ['shallow', 'deep', 'array_concat'] }
    ]
  },

  // ===== CONTROL FLOW =====
  control_condition: {
    name: 'Condition',
    category: 'control',
    color: 'from-amber-500 to-orange-400',
    icon: 'GitBranch',
    description: 'Branch based on conditions',
    configFields: [
      { key: 'condition', label: 'Condition', type: 'code', placeholder: 'input.value > 100' },
      { key: 'trueLabel', label: 'True Branch Label', type: 'text', defaultValue: 'Yes' },
      { key: 'falseLabel', label: 'False Branch Label', type: 'text', defaultValue: 'No' }
    ],
    outputs: 2,
    allowMultipleOutputs: true
  },
  control_loop: {
    name: 'Loop',
    category: 'control',
    color: 'from-orange-500 to-red-400',
    icon: 'Repeat',
    description: 'Loop over array items',
    configFields: [
      { key: 'arrayField', label: 'Array Field', type: 'text', placeholder: 'items' },
      { key: 'maxIterations', label: 'Max Iterations', type: 'number', defaultValue: 100 },
      { key: 'parallelism', label: 'Parallelism', type: 'number', defaultValue: 1 }
    ]
  },
  control_delay: {
    name: 'Delay',
    category: 'control',
    color: 'from-gray-500 to-slate-400',
    icon: 'Timer',
    description: 'Wait before continuing',
    configFields: [
      { key: 'duration', label: 'Duration (seconds)', type: 'number', defaultValue: 5 },
      { key: 'random', label: 'Randomize', type: 'boolean' }
    ]
  },
  control_parallel: {
    name: 'Parallel',
    category: 'control',
    color: 'from-blue-500 to-indigo-400',
    icon: 'GitFork',
    description: 'Run branches in parallel',
    configFields: [
      { key: 'waitAll', label: 'Wait for All', type: 'boolean', defaultValue: true },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000 }
    ],
    outputs: 2,
    allowMultipleOutputs: true
  },
  control_branch: {
    name: 'Branch',
    category: 'control',
    color: 'from-orange-500 to-yellow-400',
    icon: 'GitBranch',
    description: 'Create multiple workflow branches',
    configFields: [
      { key: 'branchCount', label: 'Number of Branches', type: 'number', defaultValue: 2 },
      { key: 'branchNames', label: 'Branch Names (comma-separated)', type: 'text', placeholder: 'Branch A, Branch B' }
    ],
    outputs: 4,
    allowMultipleOutputs: true
  },
  control_merge: {
    name: 'Merge',
    category: 'control',
    color: 'from-teal-500 to-green-400',
    icon: 'Combine',
    description: 'Merge multiple branches into one',
    configFields: [
      { key: 'mergeStrategy', label: 'Merge Strategy', type: 'select', options: ['wait_all', 'first_complete', 'combine_results'] },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 60000 }
    ],
    inputs: 4
  },

  // ===== WORKFLOW =====
  workflow_call: {
    name: 'Call Workflow',
    category: 'control',
    color: 'from-purple-600 to-violet-400',
    icon: 'Play',
    description: 'Execute another workflow as a sub-workflow',
    configFields: [
      { key: 'workflowId', label: 'Workflow ID', type: 'text', placeholder: 'Select a workflow', required: true },
      { key: 'workflowName', label: 'Workflow Name', type: 'text', placeholder: 'Workflow name (display only)' },
      { key: 'passInput', label: 'Pass Current Input', type: 'boolean', defaultValue: true },
      { key: 'customInput', label: 'Custom Input (JSON)', type: 'json', placeholder: '{}' },
      { key: 'waitForCompletion', label: 'Wait for Completion', type: 'boolean', defaultValue: true },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 300000 }
    ]
  },

  // ===== INTEGRATIONS =====
  http_request: {
    name: 'HTTP Request',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'Globe',
    description: 'Make HTTP API calls',
    configFields: [
      { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
      { key: 'headers', label: 'Headers (JSON)', type: 'json', placeholder: '{"Authorization": "Bearer {{token}}"}' },
      { key: 'body', label: 'Body (JSON)', type: 'json' },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000 }
    ]
  },
  http_webhook: {
    name: 'Send Webhook',
    category: 'integration',
    color: 'from-indigo-600 to-indigo-400',
    icon: 'Send',
    description: 'Send data to a webhook',
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.example.com/webhook' },
      { key: 'payload', label: 'Payload Template', type: 'json' },
      { key: 'retry', label: 'Retry on Failure', type: 'boolean', defaultValue: true }
    ]
  },

  // ===== SYSTEM ACTIONS =====
  system_email: {
    name: 'Send Email',
    category: 'system',
    color: 'from-red-500 to-rose-400',
    icon: 'Mail',
    description: 'Send an email',
    configFields: [
      { key: 'to', label: 'To', type: 'text', placeholder: 'recipient@example.com' },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Workflow Notification' },
      { key: 'template', label: 'Body Template', type: 'textarea' },
      { key: 'attachResults', label: 'Attach Results', type: 'boolean' }
    ]
  },
  system_webhook: {
    name: 'POST Webhook',
    category: 'system',
    color: 'from-slate-500 to-gray-400',
    icon: 'Send',
    description: 'Send data to external webhook',
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://webhook.example.com' },
      { key: 'includeMetadata', label: 'Include Metadata', type: 'boolean', defaultValue: true }
    ]
  },
  system_save: {
    name: 'Save to Database',
    category: 'system',
    color: 'from-emerald-500 to-green-400',
    icon: 'Database',
    description: 'Save result to database',
    configFields: [
      { key: 'table', label: 'Table Name', type: 'text', placeholder: 'workflow_results' },
      { key: 'operation', label: 'Operation', type: 'select', options: ['insert', 'upsert', 'update'] },
      { key: 'mapping', label: 'Field Mapping', type: 'json' }
    ]
  },
  system_notify: {
    name: 'Notification',
    category: 'system',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Bell',
    description: 'Send a notification',
    configFields: [
      { key: 'channel', label: 'Channel', type: 'select', options: ['slack', 'teams', 'discord', 'email'] },
      { key: 'message', label: 'Message Template', type: 'textarea' },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text' }
    ]
  },
  system_log: {
    name: 'Log Output',
    category: 'system',
    color: 'from-gray-600 to-gray-400',
    icon: 'FileText',
    description: 'Log data for debugging',
    configFields: [
      { key: 'level', label: 'Log Level', type: 'select', options: ['info', 'warn', 'error', 'debug'] },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  }
};

// ==========================================
// WORKFLOW TEMPLATES
// ==========================================

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  useCases: string[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'invoice-processor',
    name: 'Invoice Processor',
    description: 'Automatically extract data from invoices, classify them, and save to database',
    category: 'Finance',
    icon: 'Receipt',
    color: 'from-green-500 to-emerald-400',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    useCases: ['Accounts Payable', 'Expense Management', 'Financial Automation'],
    blocks: [
      {
        id: 'trigger-1',
        type: 'trigger_file',
        name: 'Upload Invoice',
        config: { acceptedTypes: '.pdf,.jpg,.png', maxSizeMb: 10 },
        position: { x: 0, y: 0 }
      },
      {
        id: 'extract-1',
        type: 'ai_extract',
        name: 'Extract Invoice Data',
        config: { 
          fields: 'invoice_number, date, vendor_name, total_amount, tax_amount, line_items, due_date',
          outputFormat: 'json',
          strict: true
        },
        position: { x: 0, y: 120 }
      },
      {
        id: 'classify-1',
        type: 'ai_classify',
        name: 'Classify Expense',
        config: { categories: 'Office Supplies, Software, Professional Services, Travel, Marketing, Equipment, Other' },
        position: { x: 0, y: 240 }
      },
      {
        id: 'decision-1',
        type: 'ai_decision',
        name: 'Approval Check',
        config: { 
          question: 'Should this invoice be auto-approved?',
          criteria: 'Auto-approve if amount < 500€ and vendor is known'
        },
        position: { x: 0, y: 360 }
      },
      {
        id: 'save-1',
        type: 'system_save',
        name: 'Save to Database',
        config: { table: 'invoices', operation: 'insert' },
        position: { x: 0, y: 480 }
      }
    ],
    connections: []
  },
  {
    id: 'lead-enrichment',
    name: 'Lead Enrichment Agent',
    description: 'Enrich leads with company data, score them, and route to sales',
    category: 'Sales',
    icon: 'Users',
    color: 'from-blue-500 to-indigo-400',
    difficulty: 'advanced',
    estimatedTime: '10 min',
    useCases: ['Lead Generation', 'Sales Intelligence', 'CRM Automation'],
    blocks: [
      {
        id: 'trigger-1',
        type: 'trigger_webhook',
        name: 'New Lead Webhook',
        config: { method: 'POST', authRequired: true },
        position: { x: 0, y: 0 }
      },
      {
        id: 'http-1',
        type: 'http_request',
        name: 'Fetch Company Data',
        config: { 
          method: 'GET',
          url: 'https://api.clearbit.com/v2/companies/find?domain={{input.email.split("@")[1]}}',
          headers: '{"Authorization": "Bearer {{secrets.CLEARBIT_KEY}}"}'
        },
        position: { x: 0, y: 120 }
      },
      {
        id: 'generate-1',
        type: 'ai_generate',
        name: 'Generate Lead Profile',
        config: { 
          prompt: 'Create a comprehensive lead profile based on the company data and original lead info',
          tone: 'professional'
        },
        position: { x: 0, y: 240 }
      },
      {
        id: 'classify-1',
        type: 'ai_classify',
        name: 'Score Lead',
        config: { categories: 'Hot (80-100), Warm (50-79), Cold (0-49)' },
        position: { x: 0, y: 360 }
      },
      {
        id: 'condition-1',
        type: 'control_condition',
        name: 'Route by Score',
        config: { condition: 'input.category.includes("Hot")' },
        position: { x: 0, y: 480 }
      },
      {
        id: 'notify-1',
        type: 'system_notify',
        name: 'Alert Sales Team',
        config: { channel: 'slack', message: '🔥 Hot lead: {{input.name}} from {{input.company}}' },
        position: { x: 0, y: 600 }
      }
    ],
    connections: []
  },
  {
    id: 'support-triage',
    name: 'Support Ticket Triage',
    description: 'Automatically classify, prioritize, and route support tickets',
    category: 'Support',
    icon: 'Headphones',
    color: 'from-purple-500 to-pink-400',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    useCases: ['Customer Support', 'Helpdesk', 'Ticket Management'],
    blocks: [
      {
        id: 'trigger-1',
        type: 'trigger_form',
        name: 'Support Form',
        config: { 
          fields: JSON.stringify([
            { name: 'email', type: 'email', required: true },
            { name: 'subject', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true }
          ])
        },
        position: { x: 0, y: 0 }
      },
      {
        id: 'sentiment-1',
        type: 'ai_sentiment',
        name: 'Analyze Sentiment',
        config: { detailed: true, emotions: true },
        position: { x: 0, y: 120 }
      },
      {
        id: 'classify-1',
        type: 'ai_classify',
        name: 'Classify Issue',
        config: { 
          categories: 'Billing, Technical Bug, Feature Request, Account Access, General Question',
          multiLabel: false
        },
        position: { x: 0, y: 240 }
      },
      {
        id: 'decision-1',
        type: 'ai_decision',
        name: 'Priority Assessment',
        config: { 
          question: 'What priority level should this ticket have?',
          criteria: 'High if negative sentiment + billing/access issue. Medium if technical. Low for questions.'
        },
        position: { x: 0, y: 360 }
      },
      {
        id: 'generate-1',
        type: 'ai_generate',
        name: 'Draft Response',
        config: { 
          prompt: 'Generate a helpful, empathetic initial response acknowledging the issue and providing next steps',
          tone: 'professional'
        },
        position: { x: 0, y: 480 }
      },
      {
        id: 'save-1',
        type: 'system_save',
        name: 'Create Ticket',
        config: { table: 'support_tickets', operation: 'insert' },
        position: { x: 0, y: 600 }
      }
    ],
    connections: []
  },
  {
    id: 'content-summarizer',
    name: 'Content Summarizer',
    description: 'Summarize long documents and translate to multiple languages',
    category: 'Content',
    icon: 'FileText',
    color: 'from-cyan-500 to-blue-400',
    difficulty: 'beginner',
    estimatedTime: '2 min',
    useCases: ['Document Processing', 'Content Creation', 'Translation'],
    blocks: [
      {
        id: 'trigger-1',
        type: 'trigger_text',
        name: 'Input Text',
        config: { placeholder: 'Paste your document here...', multiline: true },
        position: { x: 0, y: 0 }
      },
      {
        id: 'summary-1',
        type: 'ai_summary',
        name: 'Generate Summary',
        config: { style: 'executive', maxLength: 300 },
        position: { x: 0, y: 120 }
      },
      {
        id: 'extract-1',
        type: 'ai_extract',
        name: 'Extract Key Points',
        config: { fields: 'main_topic, key_points, action_items, conclusions' },
        position: { x: 0, y: 240 }
      },
      {
        id: 'translate-1',
        type: 'ai_translate',
        name: 'Translate to French',
        config: { targetLanguage: 'French', preserveFormatting: true },
        position: { x: 0, y: 360 }
      }
    ],
    connections: []
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    description: 'Fetch data from API, transform, filter, and store',
    category: 'Data',
    icon: 'Database',
    color: 'from-emerald-500 to-teal-400',
    difficulty: 'advanced',
    estimatedTime: '8 min',
    useCases: ['ETL Pipeline', 'Data Integration', 'API Orchestration'],
    blocks: [
      {
        id: 'trigger-1',
        type: 'trigger_schedule',
        name: 'Daily Schedule',
        config: { cron: '0 9 * * *', timezone: 'Europe/Paris' },
        position: { x: 0, y: 0 }
      },
      {
        id: 'http-1',
        type: 'http_request',
        name: 'Fetch API Data',
        config: { method: 'GET', url: 'https://api.example.com/data', timeout: 30000 },
        position: { x: 0, y: 120 }
      },
      {
        id: 'transform-1',
        type: 'transform_json',
        name: 'Transform Data',
        config: { expression: 'data.records[*]', outputKey: 'items' },
        position: { x: 0, y: 240 }
      },
      {
        id: 'filter-1',
        type: 'transform_filter',
        name: 'Filter Active',
        config: { condition: 'item.status === "active"', field: 'items' },
        position: { x: 0, y: 360 }
      },
      {
        id: 'loop-1',
        type: 'control_loop',
        name: 'Process Each',
        config: { arrayField: 'items', maxIterations: 100, parallelism: 5 },
        position: { x: 0, y: 480 }
      },
      {
        id: 'save-1',
        type: 'system_save',
        name: 'Save Results',
        config: { table: 'processed_data', operation: 'upsert' },
        position: { x: 0, y: 600 }
      }
    ],
    connections: []
  }
];

// ==========================================
// CATEGORY METADATA
// ==========================================

export const CATEGORY_INFO: Record<BlockCategory, { name: string; description: string; color: string }> = {
  trigger: {
    name: 'Triggers',
    description: 'Start your workflow',
    color: 'bg-blue-500'
  },
  ai: {
    name: 'AI Actions',
    description: 'Process with AI',
    color: 'bg-violet-500'
  },
  transform: {
    name: 'Transform',
    description: 'Transform data',
    color: 'bg-emerald-500'
  },
  control: {
    name: 'Control Flow',
    description: 'Control execution',
    color: 'bg-amber-500'
  },
  integration: {
    name: 'Integrations',
    description: 'Connect services',
    color: 'bg-blue-600'
  },
  system: {
    name: 'System',
    description: 'System actions',
    color: 'bg-slate-500'
  }
};
