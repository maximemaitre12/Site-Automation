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
  // HTTP & Webhooks
  | 'http_request'
  | 'http_webhook'
  // Communication (Messaging & Social)
  | 'integration_telegram'
  | 'integration_slack'
  | 'integration_discord'
  | 'integration_whatsapp'
  | 'integration_teams'
  | 'integration_intercom'
  | 'integration_zendesk'
  | 'integration_freshdesk'
  | 'integration_crisp'
  // Email Services
  | 'integration_sendgrid'
  | 'integration_mailchimp'
  | 'integration_brevo'
  | 'integration_mailgun'
  | 'integration_resend'
  | 'integration_convertkit'
  // SMS & Phone
  | 'integration_twilio_sms'
  | 'integration_twilio_voice'
  // AI & ML Providers
  | 'integration_openai'
  | 'integration_anthropic'
  | 'integration_google_ai'
  | 'integration_mistral'
  | 'integration_huggingface'
  | 'integration_replicate'
  | 'integration_stability'
  | 'integration_elevenlabs'
  | 'integration_deepgram'
  | 'integration_assemblyai'
  // CRM & Sales
  | 'integration_hubspot'
  | 'integration_salesforce'
  | 'integration_pipedrive'
  | 'integration_zoho'
  // Productivity & Databases
  | 'integration_notion'
  | 'integration_airtable'
  | 'integration_google_sheets'
  | 'integration_google_calendar'
  | 'integration_trello'
  | 'integration_asana'
  | 'integration_monday'
  | 'integration_clickup'
  | 'integration_jira'
  | 'integration_linear'
  | 'integration_calendly'
  // Storage & Files
  | 'integration_google_drive'
  | 'integration_dropbox'
  | 'integration_onedrive'
  | 'integration_box'
  | 'integration_aws_s3'
  // Payments & Finance
  | 'integration_stripe'
  | 'integration_paypal'
  | 'integration_shopify'
  | 'integration_quickbooks'
  // Social Media
  | 'integration_twitter'
  | 'integration_linkedin'
  | 'integration_facebook'
  | 'integration_instagram'
  | 'integration_youtube'
  | 'integration_tiktok'
  // Development & DevOps
  | 'integration_github'
  | 'integration_gitlab'
  | 'integration_vercel'
  | 'integration_supabase'
  | 'integration_firebase'
  // Analytics
  | 'integration_google_analytics'
  | 'integration_mixpanel'
  | 'integration_segment'
  | 'integration_amplitude'
  // Automation & No-Code
  | 'integration_zapier'
  | 'integration_make'
  | 'integration_n8n'
  // Video & Meetings
  | 'integration_zoom'
  | 'integration_loom'
  // System Actions
  | 'system_email'
  | 'system_webhook'
  | 'system_save'
  | 'system_notify'
  | 'system_log';

export type BlockCategory = 'trigger' | 'ai' | 'transform' | 'control' | 'integration' | 'system';

// Sub-categories for better organization in UI
export type IntegrationSubCategory = 
  | 'communication' 
  | 'email' 
  | 'ai_providers' 
  | 'crm' 
  | 'productivity' 
  | 'storage' 
  | 'payments' 
  | 'social' 
  | 'dev' 
  | 'analytics' 
  | 'automation' 
  | 'video'
  | 'sms';

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

  // ===== COMMUNICATION (Messaging & Chat) =====
  integration_telegram: {
    name: 'Telegram',
    category: 'integration',
    color: 'from-sky-500 to-blue-400',
    icon: 'Send',
    description: 'Send a message via Telegram bot',
    configFields: [
      { key: 'chatId', label: 'Chat ID', type: 'text', placeholder: '123456789 or @channel_name', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Hello from AETHER Flow!' }
    ]
  },
  integration_slack: {
    name: 'Slack',
    category: 'integration',
    color: 'from-purple-500 to-violet-400',
    icon: 'MessageSquare',
    description: 'Post a message to Slack',
    configFields: [
      { key: 'channel', label: 'Channel', type: 'text', placeholder: '#general or @user', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Workflow notification' }
    ]
  },
  integration_discord: {
    name: 'Discord',
    category: 'integration',
    color: 'from-indigo-500 to-purple-400',
    icon: 'MessageCircle',
    description: 'Send a message to Discord',
    configFields: [
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Discord notification', required: true },
      { key: 'username', label: 'Bot Username', type: 'text', placeholder: 'AETHER Flow' }
    ]
  },
  integration_whatsapp: {
    name: 'WhatsApp Business',
    category: 'integration',
    color: 'from-green-500 to-emerald-400',
    icon: 'MessageCircle',
    description: 'Send WhatsApp message via Business API',
    configFields: [
      { key: 'to', label: 'Phone Number', type: 'text', placeholder: '+33612345678', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'WhatsApp message' }
    ]
  },
  integration_teams: {
    name: 'Microsoft Teams',
    category: 'integration',
    color: 'from-violet-600 to-purple-500',
    icon: 'MessageSquare',
    description: 'Post message to Teams channel',
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://outlook.office.com/webhook/...', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Teams notification' }
    ]
  },
  integration_intercom: {
    name: 'Intercom',
    category: 'integration',
    color: 'from-blue-500 to-blue-400',
    icon: 'MessageSquare',
    description: 'Send message or create conversation in Intercom',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['send_message', 'create_contact', 'create_conversation'] },
      { key: 'userId', label: 'User ID', type: 'text', placeholder: 'user_id or email' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_zendesk: {
    name: 'Zendesk',
    category: 'integration',
    color: 'from-green-600 to-teal-500',
    icon: 'Headphones',
    description: 'Create or update Zendesk tickets',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_ticket', 'update_ticket', 'add_comment'] },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] }
    ]
  },
  integration_freshdesk: {
    name: 'Freshdesk',
    category: 'integration',
    color: 'from-green-500 to-lime-400',
    icon: 'Headphones',
    description: 'Create Freshdesk tickets',
    configFields: [
      { key: 'subject', label: 'Subject', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'email', label: 'Requester Email', type: 'text' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['1', '2', '3', '4'] }
    ]
  },
  integration_crisp: {
    name: 'Crisp',
    category: 'integration',
    color: 'from-purple-600 to-pink-500',
    icon: 'MessageCircle',
    description: 'Send messages via Crisp chat',
    configFields: [
      { key: 'websiteId', label: 'Website ID', type: 'text', required: true },
      { key: 'sessionId', label: 'Session ID', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },

  // ===== EMAIL MARKETING =====
  integration_sendgrid: {
    name: 'SendGrid',
    category: 'integration',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Mail',
    description: 'Send transactional emails via SendGrid',
    configFields: [
      { key: 'to', label: 'To Email', type: 'text', placeholder: 'recipient@example.com', required: true },
      { key: 'from', label: 'From Email', type: 'text', placeholder: 'sender@yourdomain.com', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'message', label: 'Body', type: 'textarea' }
    ]
  },
  integration_mailchimp: {
    name: 'Mailchimp',
    category: 'integration',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Mail',
    description: 'Add subscribers or send campaigns',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['add_subscriber', 'update_subscriber', 'send_campaign'] },
      { key: 'listId', label: 'List/Audience ID', type: 'text', required: true },
      { key: 'email', label: 'Email Address', type: 'text' },
      { key: 'mergeFields', label: 'Merge Fields (JSON)', type: 'json' }
    ]
  },
  integration_brevo: {
    name: 'Brevo (Sendinblue)',
    category: 'integration',
    color: 'from-blue-600 to-indigo-500',
    icon: 'Mail',
    description: 'Email marketing and transactional emails',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['send_email', 'create_contact', 'send_campaign'] },
      { key: 'to', label: 'To Email', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'htmlContent', label: 'HTML Content', type: 'textarea' }
    ]
  },
  integration_mailgun: {
    name: 'Mailgun',
    category: 'integration',
    color: 'from-red-600 to-red-400',
    icon: 'Mail',
    description: 'Send emails via Mailgun API',
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'text', label: 'Text Body', type: 'textarea' },
      { key: 'html', label: 'HTML Body', type: 'textarea' }
    ]
  },
  integration_resend: {
    name: 'Resend',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Mail',
    description: 'Modern email API for developers',
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'html', label: 'HTML Content', type: 'textarea' }
    ]
  },
  integration_convertkit: {
    name: 'ConvertKit',
    category: 'integration',
    color: 'from-rose-500 to-pink-400',
    icon: 'Mail',
    description: 'Email marketing for creators',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['add_subscriber', 'add_tag', 'remove_tag'] },
      { key: 'email', label: 'Subscriber Email', type: 'text', required: true },
      { key: 'formId', label: 'Form ID', type: 'text' },
      { key: 'tagId', label: 'Tag ID', type: 'text' }
    ]
  },

  // ===== SMS & PHONE =====
  integration_twilio_sms: {
    name: 'Twilio SMS',
    category: 'integration',
    color: 'from-red-500 to-pink-400',
    icon: 'Phone',
    description: 'Send SMS via Twilio',
    configFields: [
      { key: 'to', label: 'To Phone Number', type: 'text', placeholder: '+33612345678', required: true },
      { key: 'from', label: 'From Phone Number', type: 'text', placeholder: '+15558675309', required: true },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_twilio_voice: {
    name: 'Twilio Voice',
    category: 'integration',
    color: 'from-red-600 to-rose-500',
    icon: 'Phone',
    description: 'Make phone calls via Twilio',
    configFields: [
      { key: 'to', label: 'To Phone Number', type: 'text', required: true },
      { key: 'from', label: 'From Phone Number', type: 'text', required: true },
      { key: 'twiml', label: 'TwiML or URL', type: 'textarea', placeholder: '<Response><Say>Hello!</Say></Response>' }
    ]
  },

  // ===== AI & ML PROVIDERS =====
  integration_openai: {
    name: 'OpenAI',
    category: 'integration',
    color: 'from-emerald-600 to-teal-500',
    icon: 'Brain',
    description: 'Use GPT-4, DALL-E, Whisper APIs',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'whisper-1'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 }
    ]
  },
  integration_anthropic: {
    name: 'Anthropic Claude',
    category: 'integration',
    color: 'from-orange-500 to-amber-400',
    icon: 'Brain',
    description: 'Use Claude AI models',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 }
    ]
  },
  integration_google_ai: {
    name: 'Google AI (Gemini)',
    category: 'integration',
    color: 'from-blue-500 to-sky-400',
    icon: 'Brain',
    description: 'Use Gemini Pro and other Google AI models',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['gemini-pro', 'gemini-pro-vision', 'gemini-ultra'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 }
    ]
  },
  integration_mistral: {
    name: 'Mistral AI',
    category: 'integration',
    color: 'from-orange-600 to-red-500',
    icon: 'Brain',
    description: 'Use Mistral language models',
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['mistral-large', 'mistral-medium', 'mistral-small'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 }
    ]
  },
  integration_huggingface: {
    name: 'Hugging Face',
    category: 'integration',
    color: 'from-yellow-500 to-orange-400',
    icon: 'Brain',
    description: 'Run inference on HF models',
    configFields: [
      { key: 'modelId', label: 'Model ID', type: 'text', placeholder: 'facebook/bart-large-cnn', required: true },
      { key: 'inputs', label: 'Inputs', type: 'textarea' },
      { key: 'parameters', label: 'Parameters (JSON)', type: 'json' }
    ]
  },
  integration_replicate: {
    name: 'Replicate',
    category: 'integration',
    color: 'from-gray-700 to-gray-500',
    icon: 'Brain',
    description: 'Run ML models in the cloud',
    configFields: [
      { key: 'model', label: 'Model Version', type: 'text', placeholder: 'owner/model:version', required: true },
      { key: 'input', label: 'Input (JSON)', type: 'json', required: true }
    ]
  },
  integration_stability: {
    name: 'Stability AI',
    category: 'integration',
    color: 'from-purple-600 to-indigo-500',
    icon: 'Image',
    description: 'Generate images with Stable Diffusion',
    configFields: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'negativePrompt', label: 'Negative Prompt', type: 'textarea' },
      { key: 'width', label: 'Width', type: 'number', defaultValue: 1024 },
      { key: 'height', label: 'Height', type: 'number', defaultValue: 1024 }
    ]
  },
  integration_elevenlabs: {
    name: 'ElevenLabs',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Volume2',
    description: 'Text-to-speech synthesis',
    configFields: [
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'voiceId', label: 'Voice ID', type: 'text', placeholder: 'rachel, adam, etc.' },
      { key: 'modelId', label: 'Model', type: 'select', options: ['eleven_monolingual_v1', 'eleven_multilingual_v2'] }
    ]
  },
  integration_deepgram: {
    name: 'Deepgram',
    category: 'integration',
    color: 'from-green-600 to-emerald-500',
    icon: 'Mic',
    description: 'Speech-to-text transcription',
    configFields: [
      { key: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
      { key: 'language', label: 'Language', type: 'select', options: ['en', 'fr', 'es', 'de', 'it', 'pt'] },
      { key: 'model', label: 'Model', type: 'select', options: ['nova-2', 'enhanced', 'base'] }
    ]
  },
  integration_assemblyai: {
    name: 'AssemblyAI',
    category: 'integration',
    color: 'from-blue-700 to-blue-500',
    icon: 'Mic',
    description: 'Advanced speech recognition',
    configFields: [
      { key: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
      { key: 'languageCode', label: 'Language', type: 'select', options: ['en', 'fr', 'es', 'de'] },
      { key: 'speakerLabels', label: 'Speaker Detection', type: 'boolean', defaultValue: false }
    ]
  },

  // ===== CRM & SALES =====
  integration_hubspot: {
    name: 'HubSpot',
    category: 'integration',
    color: 'from-orange-500 to-red-400',
    icon: 'Users',
    description: 'CRM operations with HubSpot',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_contact', 'update_contact', 'create_deal', 'create_task'] },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_salesforce: {
    name: 'Salesforce',
    category: 'integration',
    color: 'from-blue-600 to-sky-500',
    icon: 'Cloud',
    description: 'CRM operations with Salesforce',
    configFields: [
      { key: 'object', label: 'Object', type: 'select', options: ['Lead', 'Contact', 'Account', 'Opportunity', 'Case'] },
      { key: 'action', label: 'Action', type: 'select', options: ['create', 'update', 'query', 'delete'] },
      { key: 'data', label: 'Record Data (JSON)', type: 'json' }
    ]
  },
  integration_pipedrive: {
    name: 'Pipedrive',
    category: 'integration',
    color: 'from-green-600 to-emerald-500',
    icon: 'TrendingUp',
    description: 'Sales CRM operations',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_deal', 'create_person', 'create_organization', 'update_deal'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_zoho: {
    name: 'Zoho CRM',
    category: 'integration',
    color: 'from-red-600 to-yellow-500',
    icon: 'Users',
    description: 'Zoho CRM operations',
    configFields: [
      { key: 'module', label: 'Module', type: 'select', options: ['Leads', 'Contacts', 'Accounts', 'Deals', 'Tasks'] },
      { key: 'action', label: 'Action', type: 'select', options: ['create', 'update', 'search', 'delete'] },
      { key: 'data', label: 'Record Data (JSON)', type: 'json' }
    ]
  },

  // ===== PRODUCTIVITY & DATABASES =====
  integration_notion: {
    name: 'Notion',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'FileText',
    description: 'Create pages and database entries',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_page', 'update_page', 'query_database'] },
      { key: 'databaseId', label: 'Database ID', type: 'text' },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_airtable: {
    name: 'Airtable',
    category: 'integration',
    color: 'from-yellow-500 to-green-400',
    icon: 'Table',
    description: 'Database operations with Airtable',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_record', 'update_record', 'list_records', 'delete_record'] },
      { key: 'baseId', label: 'Base ID', type: 'text', required: true },
      { key: 'tableId', label: 'Table Name', type: 'text', required: true },
      { key: 'fields', label: 'Fields (JSON)', type: 'json' }
    ]
  },
  integration_google_sheets: {
    name: 'Google Sheets',
    category: 'integration',
    color: 'from-green-500 to-emerald-400',
    icon: 'Table',
    description: 'Read/write Google Sheets data',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['read', 'append', 'update', 'clear'] },
      { key: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
      { key: 'range', label: 'Range', type: 'text', placeholder: 'Sheet1!A1:D10' },
      { key: 'values', label: 'Values (JSON)', type: 'json' }
    ]
  },
  integration_google_calendar: {
    name: 'Google Calendar',
    category: 'integration',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Calendar',
    description: 'Create and manage calendar events',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_event', 'update_event', 'list_events', 'delete_event'] },
      { key: 'calendarId', label: 'Calendar ID', type: 'text', defaultValue: 'primary' },
      { key: 'summary', label: 'Event Title', type: 'text' },
      { key: 'startTime', label: 'Start Time', type: 'text', placeholder: '2024-01-15T09:00:00Z' },
      { key: 'endTime', label: 'End Time', type: 'text', placeholder: '2024-01-15T10:00:00Z' }
    ]
  },
  integration_trello: {
    name: 'Trello',
    category: 'integration',
    color: 'from-blue-500 to-sky-400',
    icon: 'Columns',
    description: 'Manage Trello boards and cards',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_card', 'update_card', 'move_card', 'add_comment'] },
      { key: 'boardId', label: 'Board ID', type: 'text' },
      { key: 'listId', label: 'List ID', type: 'text' },
      { key: 'name', label: 'Card Name', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' }
    ]
  },
  integration_asana: {
    name: 'Asana',
    category: 'integration',
    color: 'from-rose-500 to-pink-400',
    icon: 'CheckSquare',
    description: 'Project management with Asana',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_task', 'update_task', 'complete_task', 'add_comment'] },
      { key: 'projectId', label: 'Project ID', type: 'text' },
      { key: 'name', label: 'Task Name', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'dueOn', label: 'Due Date', type: 'text', placeholder: 'YYYY-MM-DD' }
    ]
  },
  integration_monday: {
    name: 'Monday.com',
    category: 'integration',
    color: 'from-red-500 to-orange-400',
    icon: 'Columns',
    description: 'Work management with Monday',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_item', 'update_item', 'change_column'] },
      { key: 'boardId', label: 'Board ID', type: 'text', required: true },
      { key: 'groupId', label: 'Group ID', type: 'text' },
      { key: 'itemName', label: 'Item Name', type: 'text' },
      { key: 'columnValues', label: 'Column Values (JSON)', type: 'json' }
    ]
  },
  integration_clickup: {
    name: 'ClickUp',
    category: 'integration',
    color: 'from-purple-600 to-violet-500',
    icon: 'CheckSquare',
    description: 'Task management with ClickUp',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_task', 'update_task', 'create_comment'] },
      { key: 'listId', label: 'List ID', type: 'text', required: true },
      { key: 'name', label: 'Task Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'text' }
    ]
  },
  integration_jira: {
    name: 'Jira',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'Bug',
    description: 'Issue tracking with Jira',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'update_issue', 'transition_issue', 'add_comment'] },
      { key: 'projectKey', label: 'Project Key', type: 'text', required: true },
      { key: 'issueType', label: 'Issue Type', type: 'select', options: ['Bug', 'Task', 'Story', 'Epic'] },
      { key: 'summary', label: 'Summary', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_linear: {
    name: 'Linear',
    category: 'integration',
    color: 'from-purple-700 to-indigo-600',
    icon: 'Zap',
    description: 'Modern issue tracking',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'update_issue', 'create_comment'] },
      { key: 'teamId', label: 'Team ID', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['0', '1', '2', '3', '4'] }
    ]
  },
  integration_calendly: {
    name: 'Calendly',
    category: 'integration',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Calendar',
    description: 'Scheduling automation',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['list_events', 'get_event', 'cancel_event'] },
      { key: 'eventUri', label: 'Event URI', type: 'text' },
      { key: 'minStartTime', label: 'Min Start Time', type: 'text' },
      { key: 'maxStartTime', label: 'Max Start Time', type: 'text' }
    ]
  },

  // ===== STORAGE & FILES =====
  integration_google_drive: {
    name: 'Google Drive',
    category: 'integration',
    color: 'from-yellow-500 to-green-400',
    icon: 'HardDrive',
    description: 'Upload and manage files in Drive',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list', 'delete', 'create_folder'] },
      { key: 'folderId', label: 'Folder ID', type: 'text' },
      { key: 'fileName', label: 'File Name', type: 'text' },
      { key: 'mimeType', label: 'MIME Type', type: 'text' }
    ]
  },
  integration_dropbox: {
    name: 'Dropbox',
    category: 'integration',
    color: 'from-blue-500 to-blue-400',
    icon: 'HardDrive',
    description: 'File storage with Dropbox',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list', 'delete', 'create_folder'] },
      { key: 'path', label: 'Path', type: 'text', placeholder: '/folder/file.txt' },
      { key: 'mode', label: 'Write Mode', type: 'select', options: ['add', 'overwrite'] }
    ]
  },
  integration_onedrive: {
    name: 'OneDrive',
    category: 'integration',
    color: 'from-blue-600 to-sky-500',
    icon: 'Cloud',
    description: 'Microsoft OneDrive storage',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list', 'delete'] },
      { key: 'path', label: 'Path', type: 'text' },
      { key: 'fileName', label: 'File Name', type: 'text' }
    ]
  },
  integration_box: {
    name: 'Box',
    category: 'integration',
    color: 'from-blue-700 to-blue-500',
    icon: 'Box',
    description: 'Enterprise file storage',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list', 'delete', 'share'] },
      { key: 'folderId', label: 'Folder ID', type: 'text' },
      { key: 'fileName', label: 'File Name', type: 'text' }
    ]
  },
  integration_aws_s3: {
    name: 'AWS S3',
    category: 'integration',
    color: 'from-orange-500 to-yellow-400',
    icon: 'Database',
    description: 'Amazon S3 object storage',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['put_object', 'get_object', 'list_objects', 'delete_object'] },
      { key: 'bucket', label: 'Bucket Name', type: 'text', required: true },
      { key: 'key', label: 'Object Key', type: 'text' },
      { key: 'region', label: 'Region', type: 'text', defaultValue: 'us-east-1' }
    ]
  },

  // ===== PAYMENTS & FINANCE =====
  integration_stripe: {
    name: 'Stripe',
    category: 'integration',
    color: 'from-purple-600 to-indigo-500',
    icon: 'CreditCard',
    description: 'Payment processing with Stripe',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_customer', 'create_payment', 'create_subscription', 'create_invoice'] },
      { key: 'email', label: 'Customer Email', type: 'text' },
      { key: 'amount', label: 'Amount (cents)', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'select', options: ['usd', 'eur', 'gbp'] }
    ]
  },
  integration_paypal: {
    name: 'PayPal',
    category: 'integration',
    color: 'from-blue-700 to-sky-500',
    icon: 'CreditCard',
    description: 'PayPal payment operations',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_order', 'capture_payment', 'refund', 'send_invoice'] },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP'] },
      { key: 'recipientEmail', label: 'Recipient Email', type: 'text' }
    ]
  },
  integration_shopify: {
    name: 'Shopify',
    category: 'integration',
    color: 'from-green-600 to-lime-500',
    icon: 'ShoppingCart',
    description: 'E-commerce with Shopify',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_product', 'update_inventory', 'create_order', 'get_orders'] },
      { key: 'shop', label: 'Shop Domain', type: 'text', placeholder: 'mystore.myshopify.com' },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_quickbooks: {
    name: 'QuickBooks',
    category: 'integration',
    color: 'from-green-700 to-emerald-600',
    icon: 'Calculator',
    description: 'Accounting with QuickBooks',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_invoice', 'create_customer', 'create_payment', 'get_reports'] },
      { key: 'realmId', label: 'Company ID', type: 'text' },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== SOCIAL MEDIA =====
  integration_twitter: {
    name: 'Twitter/X',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Twitter',
    description: 'Post tweets and manage Twitter',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['post_tweet', 'reply', 'retweet', 'like', 'search'] },
      { key: 'text', label: 'Tweet Text', type: 'textarea', placeholder: 'Max 280 characters' },
      { key: 'replyToId', label: 'Reply To Tweet ID', type: 'text' }
    ]
  },
  integration_linkedin: {
    name: 'LinkedIn',
    category: 'integration',
    color: 'from-blue-700 to-blue-500',
    icon: 'Linkedin',
    description: 'Post to LinkedIn',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_post', 'share_article'] },
      { key: 'text', label: 'Post Text', type: 'textarea' },
      { key: 'visibility', label: 'Visibility', type: 'select', options: ['PUBLIC', 'CONNECTIONS'] }
    ]
  },
  integration_facebook: {
    name: 'Facebook',
    category: 'integration',
    color: 'from-blue-600 to-indigo-500',
    icon: 'Facebook',
    description: 'Post to Facebook pages',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_post', 'create_photo', 'get_insights'] },
      { key: 'pageId', label: 'Page ID', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_instagram: {
    name: 'Instagram',
    category: 'integration',
    color: 'from-pink-500 to-purple-500',
    icon: 'Instagram',
    description: 'Instagram Business API',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_media', 'publish_media', 'get_insights'] },
      { key: 'imageUrl', label: 'Image URL', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'textarea' }
    ]
  },
  integration_youtube: {
    name: 'YouTube',
    category: 'integration',
    color: 'from-red-600 to-red-500',
    icon: 'Youtube',
    description: 'YouTube Data API',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload_video', 'update_video', 'get_analytics', 'list_videos'] },
      { key: 'videoId', label: 'Video ID', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_tiktok: {
    name: 'TikTok',
    category: 'integration',
    color: 'from-gray-900 to-gray-700',
    icon: 'Video',
    description: 'TikTok for Business API',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload_video', 'get_analytics'] },
      { key: 'videoUrl', label: 'Video URL', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'textarea' }
    ]
  },

  // ===== DEVELOPMENT & DEVOPS =====
  integration_github: {
    name: 'GitHub',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Github',
    description: 'GitHub repository operations',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'create_pr', 'add_comment', 'create_release', 'trigger_workflow'] },
      { key: 'owner', label: 'Owner', type: 'text', required: true },
      { key: 'repo', label: 'Repository', type: 'text', required: true },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' }
    ]
  },
  integration_gitlab: {
    name: 'GitLab',
    category: 'integration',
    color: 'from-orange-600 to-red-500',
    icon: 'Gitlab',
    description: 'GitLab project operations',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'create_mr', 'add_note', 'trigger_pipeline'] },
      { key: 'projectId', label: 'Project ID', type: 'text', required: true },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_vercel: {
    name: 'Vercel',
    category: 'integration',
    color: 'from-gray-900 to-gray-700',
    icon: 'Triangle',
    description: 'Vercel deployment operations',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_deployment', 'list_deployments', 'get_deployment'] },
      { key: 'projectId', label: 'Project ID', type: 'text' },
      { key: 'target', label: 'Target', type: 'select', options: ['production', 'preview'] }
    ]
  },
  integration_supabase: {
    name: 'Supabase',
    category: 'integration',
    color: 'from-emerald-600 to-green-500',
    icon: 'Database',
    description: 'Supabase database & auth',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['select', 'insert', 'update', 'delete', 'rpc'] },
      { key: 'table', label: 'Table', type: 'text', required: true },
      { key: 'data', label: 'Data (JSON)', type: 'json' },
      { key: 'filters', label: 'Filters (JSON)', type: 'json' }
    ]
  },
  integration_firebase: {
    name: 'Firebase',
    category: 'integration',
    color: 'from-yellow-500 to-orange-400',
    icon: 'Flame',
    description: 'Firebase Firestore & Realtime DB',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['get', 'set', 'update', 'delete', 'query'] },
      { key: 'collection', label: 'Collection', type: 'text', required: true },
      { key: 'document', label: 'Document ID', type: 'text' },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== ANALYTICS =====
  integration_google_analytics: {
    name: 'Google Analytics',
    category: 'integration',
    color: 'from-orange-500 to-yellow-400',
    icon: 'BarChart3',
    description: 'Track events and get reports',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track_event', 'get_report'] },
      { key: 'measurementId', label: 'Measurement ID', type: 'text' },
      { key: 'eventName', label: 'Event Name', type: 'text' },
      { key: 'eventParams', label: 'Event Params (JSON)', type: 'json' }
    ]
  },
  integration_mixpanel: {
    name: 'Mixpanel',
    category: 'integration',
    color: 'from-purple-600 to-indigo-500',
    icon: 'BarChart2',
    description: 'Product analytics tracking',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track', 'set_profile', 'import_events'] },
      { key: 'event', label: 'Event Name', type: 'text' },
      { key: 'distinctId', label: 'Distinct ID', type: 'text' },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_segment: {
    name: 'Segment',
    category: 'integration',
    color: 'from-green-600 to-teal-500',
    icon: 'Activity',
    description: 'Customer data platform',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track', 'identify', 'page', 'group'] },
      { key: 'userId', label: 'User ID', type: 'text' },
      { key: 'event', label: 'Event', type: 'text' },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_amplitude: {
    name: 'Amplitude',
    category: 'integration',
    color: 'from-blue-600 to-cyan-500',
    icon: 'LineChart',
    description: 'Product analytics platform',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track', 'identify', 'set_group'] },
      { key: 'userId', label: 'User ID', type: 'text' },
      { key: 'eventType', label: 'Event Type', type: 'text' },
      { key: 'eventProperties', label: 'Event Properties (JSON)', type: 'json' }
    ]
  },

  // ===== AUTOMATION =====
  integration_zapier: {
    name: 'Zapier Webhooks',
    category: 'integration',
    color: 'from-orange-500 to-red-400',
    icon: 'Zap',
    description: 'Trigger Zapier workflows',
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_make: {
    name: 'Make (Integromat)',
    category: 'integration',
    color: 'from-purple-600 to-pink-500',
    icon: 'Workflow',
    description: 'Trigger Make scenarios',
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_n8n: {
    name: 'n8n',
    category: 'integration',
    color: 'from-red-600 to-orange-500',
    icon: 'GitBranch',
    description: 'Trigger n8n workflows',
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== VIDEO & MEETINGS =====
  integration_zoom: {
    name: 'Zoom',
    category: 'integration',
    color: 'from-blue-500 to-sky-400',
    icon: 'Video',
    description: 'Zoom meeting management',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_meeting', 'get_meeting', 'list_meetings', 'delete_meeting'] },
      { key: 'topic', label: 'Meeting Topic', type: 'text' },
      { key: 'startTime', label: 'Start Time', type: 'text', placeholder: '2024-01-15T09:00:00Z' },
      { key: 'duration', label: 'Duration (minutes)', type: 'number', defaultValue: 60 }
    ]
  },
  integration_loom: {
    name: 'Loom',
    category: 'integration',
    color: 'from-purple-500 to-indigo-400',
    icon: 'Video',
    description: 'Loom video management',
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['get_video', 'list_videos', 'get_transcript'] },
      { key: 'videoId', label: 'Video ID', type: 'text' }
    ]
  },

  // ===== SYSTEM ACTIONS =====
  system_email: {
    name: 'Send Email',
    category: 'system',
    color: 'from-red-500 to-rose-400',
    icon: 'Mail',
    description: 'Send an email notification',
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
