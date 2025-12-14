// ==========================================
// AETHER FLOW - Advanced Workflow Types
// REAL EXECUTION ENGINE
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
  // Gmail (REAL OAuth Integration)
  | 'gmail_read'
  | 'gmail_send'
  | 'gmail_reply'
  | 'gmail_label'
  | 'gmail_search'
  // Aether Internal CRM (REAL Database Operations)
  | 'aether_crm_create_lead'
  | 'aether_crm_update_contact'
  | 'aether_crm_create_deal'
  | 'aether_crm_update_deal'
  | 'aether_crm_create_task'
  | 'aether_crm_search'
  // Aether Documents (REAL Operations)
  | 'aether_doc_create'
  | 'aether_doc_analyze'
  | 'aether_doc_search'
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
  // CRM External & Sales
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

export type BlockCategory = 'trigger' | 'ai' | 'transform' | 'control' | 'integration' | 'system' | 'aether';

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
  | 'sms'
  | 'gmail'
  | 'aether_internal';

// Execution status for real-time feedback
export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'success' | 'error' | 'skipped' | 'cancelled';

// Action type indicator
export type ActionType = 'real' | 'simulated' | 'ai';

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
  status: ExecutionStatus;
  duration: number;
  timestamp: string;
  retryCount?: number;
  error?: string;
  actionType?: ActionType; // Indicates if this was a REAL action
  isLive?: boolean; // True if action affected real systems
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
  realActionsCount?: number; // Count of REAL actions executed
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
  isRealAction?: boolean; // Indicates this block performs REAL actions
  requiresAuth?: boolean; // Indicates OAuth or API key required
  subCategory?: IntegrationSubCategory;
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
    isRealAction: true,
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
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'address', label: 'Email Address', type: 'text', placeholder: 'workflow@your-domain.com' },
      { key: 'subjectFilter', label: 'Subject Filter', type: 'text', placeholder: 'Invoice*' }
    ]
  },

  // ===== GMAIL (REAL OAUTH INTEGRATION) =====
  gmail_read: {
    name: 'Gmail - Lire Emails',
    category: 'aether',
    subCategory: 'gmail',
    color: 'from-red-500 to-red-400',
    icon: 'Inbox',
    description: 'Lire les emails de la boîte Gmail (OAuth requis)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'query', label: 'Recherche', type: 'text', placeholder: 'is:unread from:important@email.com' },
      { key: 'maxResults', label: 'Nombre max', type: 'number', defaultValue: 10 },
      { key: 'includeAttachments', label: 'Inclure pièces jointes', type: 'boolean', defaultValue: false }
    ]
  },
  gmail_send: {
    name: 'Gmail - Envoyer Email',
    category: 'aether',
    subCategory: 'gmail',
    color: 'from-red-500 to-orange-400',
    icon: 'Send',
    description: 'Envoyer un email via Gmail (OAuth requis)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'Destinataire', type: 'text', placeholder: 'recipient@email.com', required: true },
      { key: 'cc', label: 'CC', type: 'text', placeholder: 'cc@email.com' },
      { key: 'subject', label: 'Objet', type: 'text', required: true },
      { key: 'body', label: 'Corps du message', type: 'textarea', required: true },
      { key: 'isHtml', label: 'Format HTML', type: 'boolean', defaultValue: false }
    ]
  },
  gmail_reply: {
    name: 'Gmail - Répondre',
    category: 'aether',
    subCategory: 'gmail',
    color: 'from-red-600 to-pink-500',
    icon: 'Reply',
    description: 'Répondre à un email existant',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'messageId', label: 'ID du message', type: 'text', placeholder: 'ID de l\'email auquel répondre', required: true },
      { key: 'body', label: 'Réponse', type: 'textarea', required: true },
      { key: 'replyAll', label: 'Répondre à tous', type: 'boolean', defaultValue: false }
    ]
  },
  gmail_label: {
    name: 'Gmail - Libellés',
    category: 'aether',
    subCategory: 'gmail',
    color: 'from-amber-500 to-yellow-400',
    icon: 'Tag',
    description: 'Ajouter/Retirer des libellés aux emails',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'messageId', label: 'ID du message', type: 'text', required: true },
      { key: 'addLabels', label: 'Ajouter libellés', type: 'text', placeholder: 'IMPORTANT, STARRED' },
      { key: 'removeLabels', label: 'Retirer libellés', type: 'text', placeholder: 'UNREAD, INBOX' }
    ]
  },
  gmail_search: {
    name: 'Gmail - Rechercher',
    category: 'aether',
    subCategory: 'gmail',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Search',
    description: 'Rechercher des emails avec filtres avancés',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'query', label: 'Requête Gmail', type: 'text', placeholder: 'has:attachment larger:5M', required: true },
      { key: 'maxResults', label: 'Résultats max', type: 'number', defaultValue: 20 },
      { key: 'dateFrom', label: 'Date début', type: 'text', placeholder: '2024/01/01' },
      { key: 'dateTo', label: 'Date fin', type: 'text', placeholder: '2024/12/31' }
    ]
  },

  // ===== AETHER CRM (REAL DATABASE OPERATIONS) =====
  aether_crm_create_lead: {
    name: 'CRM - Créer Lead',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-emerald-500 to-green-400',
    icon: 'UserPlus',
    description: 'Créer un nouveau lead dans Aether CRM (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'firstName', label: 'Prénom', type: 'text', required: true },
      { key: 'lastName', label: 'Nom', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'phone', label: 'Téléphone', type: 'text' },
      { key: 'company', label: 'Entreprise', type: 'text' },
      { key: 'jobTitle', label: 'Poste', type: 'text' },
      { key: 'source', label: 'Source', type: 'select', options: ['Website', 'Referral', 'LinkedIn', 'Event', 'Cold Call', 'Other'] },
      { key: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  aether_crm_update_contact: {
    name: 'CRM - Modifier Contact',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-blue-500 to-cyan-400',
    icon: 'UserCog',
    description: 'Mettre à jour un contact existant (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'contactId', label: 'ID Contact', type: 'text', required: true },
      { key: 'updates', label: 'Mises à jour (JSON)', type: 'json', placeholder: '{"email": "new@email.com", "phone": "+33..."}' }
    ]
  },
  aether_crm_create_deal: {
    name: 'CRM - Créer Opportunité',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-purple-500 to-violet-400',
    icon: 'Target',
    description: 'Créer une opportunité commerciale (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'name', label: 'Nom opportunité', type: 'text', required: true },
      { key: 'value', label: 'Valeur (€)', type: 'number', required: true },
      { key: 'contactId', label: 'ID Contact', type: 'text' },
      { key: 'companyId', label: 'ID Entreprise', type: 'text' },
      { key: 'expectedCloseDate', label: 'Date clôture prévue', type: 'text', placeholder: '2024-12-31' },
      { key: 'probability', label: 'Probabilité (%)', type: 'number', defaultValue: 50 },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  aether_crm_update_deal: {
    name: 'CRM - Modifier Opportunité',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-indigo-500 to-purple-400',
    icon: 'TrendingUp',
    description: 'Mettre à jour une opportunité (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'dealId', label: 'ID Opportunité', type: 'text', required: true },
      { key: 'status', label: 'Statut', type: 'select', options: ['open', 'won', 'lost', 'negotiation', 'proposal_sent'] },
      { key: 'value', label: 'Nouvelle valeur (€)', type: 'number' },
      { key: 'probability', label: 'Probabilité (%)', type: 'number' },
      { key: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  aether_crm_create_task: {
    name: 'CRM - Créer Tâche',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-amber-500 to-orange-400',
    icon: 'CheckSquare',
    description: 'Créer une tâche CRM (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'dueDate', label: 'Date échéance', type: 'text', placeholder: '2024-12-31' },
      { key: 'priority', label: 'Priorité', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
      { key: 'contactId', label: 'ID Contact', type: 'text' },
      { key: 'opportunityId', label: 'ID Opportunité', type: 'text' },
      { key: 'assignTo', label: 'Assigner à', type: 'text', placeholder: 'ID utilisateur ou email' }
    ]
  },
  aether_crm_search: {
    name: 'CRM - Rechercher',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-sky-500 to-blue-400',
    icon: 'Search',
    description: 'Rechercher dans le CRM (contacts, entreprises, opportunités)',
    isRealAction: true,
    configFields: [
      { key: 'entityType', label: 'Type', type: 'select', options: ['contacts', 'companies', 'opportunities', 'tasks'], required: true },
      { key: 'query', label: 'Recherche', type: 'text', placeholder: 'Nom, email, entreprise...' },
      { key: 'filters', label: 'Filtres (JSON)', type: 'json', placeholder: '{"status": "open", "value_gte": 10000}' },
      { key: 'limit', label: 'Limite', type: 'number', defaultValue: 20 }
    ]
  },

  // ===== AETHER DOCUMENTS (REAL OPERATIONS) =====
  aether_doc_create: {
    name: 'Doc - Créer Document',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-teal-500 to-emerald-400',
    icon: 'FileText',
    description: 'Créer un document dans Aether Doc (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'title', label: 'Titre', type: 'text', required: true },
      { key: 'content', label: 'Contenu', type: 'textarea', required: true },
      { key: 'folderId', label: 'ID Dossier', type: 'text' },
      { key: 'tags', label: 'Tags (séparés par virgule)', type: 'text', placeholder: 'contrat, client, important' },
      { key: 'generatePdf', label: 'Générer PDF', type: 'boolean', defaultValue: false }
    ]
  },
  aether_doc_analyze: {
    name: 'Doc - Analyser Document',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-violet-500 to-purple-400',
    icon: 'FileSearch',
    description: 'Analyser un document avec IA (extraction, résumé)',
    isRealAction: true,
    configFields: [
      { key: 'documentId', label: 'ID Document', type: 'text', required: true },
      { key: 'analysisType', label: 'Type analyse', type: 'select', options: ['summary', 'extract_entities', 'classify', 'full'] },
      { key: 'customPrompt', label: 'Instructions personnalisées', type: 'textarea' }
    ]
  },
  aether_doc_search: {
    name: 'Doc - Rechercher Documents',
    category: 'aether',
    subCategory: 'aether_internal',
    color: 'from-cyan-500 to-teal-400',
    icon: 'FolderSearch',
    description: 'Recherche sémantique dans les documents',
    isRealAction: true,
    configFields: [
      { key: 'query', label: 'Recherche', type: 'text', required: true },
      { key: 'folderId', label: 'Dossier (optionnel)', type: 'text' },
      { key: 'tags', label: 'Tags filter', type: 'text' },
      { key: 'limit', label: 'Limite', type: 'number', defaultValue: 10 }
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
    description: 'Transform JSON data',
    configFields: [
      { key: 'expression', label: 'Path Expression', type: 'code', placeholder: 'data.items[*].name' },
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

  // ===== HTTP =====
  http_request: {
    name: 'HTTP Request',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'Globe',
    description: 'Make HTTP API calls (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint', required: true },
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
    description: 'Send data to a webhook (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.example.com/webhook', required: true },
      { key: 'payload', label: 'Payload Template', type: 'json' },
      { key: 'retry', label: 'Retry on Failure', type: 'boolean', defaultValue: true }
    ]
  },

  // ===== MESSAGING INTEGRATIONS =====
  integration_telegram: {
    name: 'Telegram',
    category: 'integration',
    color: 'from-sky-500 to-blue-400',
    icon: 'Send',
    description: 'Send via Telegram (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'chatId', label: 'Chat ID', type: 'text', placeholder: '123456789', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Hello!' }
    ]
  },
  integration_slack: {
    name: 'Slack',
    category: 'integration',
    color: 'from-purple-500 to-violet-400',
    icon: 'MessageSquare',
    description: 'Post to Slack (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'channel', label: 'Channel', type: 'text', placeholder: '#general', required: true },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_discord: {
    name: 'Discord',
    category: 'integration',
    color: 'from-indigo-500 to-purple-400',
    icon: 'MessageCircle',
    description: 'Send to Discord (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'message', label: 'Message', type: 'textarea', required: true },
      { key: 'username', label: 'Bot Username', type: 'text', placeholder: 'AETHER Flow' }
    ]
  },
  integration_whatsapp: {
    name: 'WhatsApp Business',
    category: 'integration',
    color: 'from-green-500 to-emerald-400',
    icon: 'MessageCircle',
    description: 'Send WhatsApp message',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'Phone Number', type: 'text', placeholder: '+33612345678', required: true },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_teams: {
    name: 'Microsoft Teams',
    category: 'integration',
    color: 'from-violet-600 to-purple-500',
    icon: 'MessageSquare',
    description: 'Post to Teams',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_intercom: {
    name: 'Intercom',
    category: 'integration',
    color: 'from-blue-500 to-blue-400',
    icon: 'MessageSquare',
    description: 'Send via Intercom',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['send_message', 'create_contact'] },
      { key: 'userId', label: 'User ID', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_zendesk: {
    name: 'Zendesk',
    category: 'integration',
    color: 'from-green-600 to-teal-500',
    icon: 'Headphones',
    description: 'Create Zendesk tickets',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_ticket', 'update_ticket'] },
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
    isRealAction: true,
    requiresAuth: true,
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
    description: 'Send via Crisp',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'websiteId', label: 'Website ID', type: 'text', required: true },
      { key: 'sessionId', label: 'Session ID', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },

  // ===== EMAIL INTEGRATIONS =====
  integration_sendgrid: {
    name: 'SendGrid',
    category: 'integration',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Mail',
    description: 'Send via SendGrid (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'message', label: 'Body', type: 'textarea' }
    ]
  },
  integration_mailchimp: {
    name: 'Mailchimp',
    category: 'integration',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Mail',
    description: 'Mailchimp operations',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['add_subscriber', 'update_subscriber'] },
      { key: 'listId', label: 'List ID', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'mergeFields', label: 'Merge Fields (JSON)', type: 'json' }
    ]
  },
  integration_brevo: {
    name: 'Brevo',
    category: 'integration',
    color: 'from-blue-600 to-indigo-500',
    icon: 'Mail',
    description: 'Brevo email',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['send_email', 'create_contact'] },
      { key: 'to', label: 'To', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'htmlContent', label: 'HTML', type: 'textarea' }
    ]
  },
  integration_mailgun: {
    name: 'Mailgun',
    category: 'integration',
    color: 'from-red-600 to-red-400',
    icon: 'Mail',
    description: 'Send via Mailgun',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'text', label: 'Text', type: 'textarea' }
    ]
  },
  integration_resend: {
    name: 'Resend',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Mail',
    description: 'Send via Resend (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'html', label: 'HTML', type: 'textarea' }
    ]
  },
  integration_convertkit: {
    name: 'ConvertKit',
    category: 'integration',
    color: 'from-rose-500 to-pink-400',
    icon: 'Mail',
    description: 'ConvertKit operations',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['add_subscriber', 'add_tag'] },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'formId', label: 'Form ID', type: 'text' },
      { key: 'tagId', label: 'Tag ID', type: 'text' }
    ]
  },

  // ===== SMS =====
  integration_twilio_sms: {
    name: 'Twilio SMS',
    category: 'integration',
    color: 'from-red-500 to-pink-400',
    icon: 'Phone',
    description: 'Send SMS (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_twilio_voice: {
    name: 'Twilio Voice',
    category: 'integration',
    color: 'from-red-600 to-rose-500',
    icon: 'Phone',
    description: 'Make calls',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'from', label: 'From', type: 'text', required: true },
      { key: 'twiml', label: 'TwiML', type: 'textarea' }
    ]
  },

  // ===== AI PROVIDERS =====
  integration_openai: {
    name: 'OpenAI',
    category: 'integration',
    color: 'from-emerald-600 to-teal-500',
    icon: 'Brain',
    description: 'OpenAI GPT',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 }
    ]
  },
  integration_anthropic: {
    name: 'Anthropic Claude',
    category: 'integration',
    color: 'from-orange-500 to-amber-400',
    icon: 'Brain',
    description: 'Claude AI',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['claude-3-opus', 'claude-3-sonnet'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1000 }
    ]
  },
  integration_google_ai: {
    name: 'Google AI (Gemini)',
    category: 'integration',
    color: 'from-blue-500 to-sky-400',
    icon: 'Brain',
    description: 'Gemini Pro',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['gemini-pro', 'gemini-pro-vision'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true }
    ]
  },
  integration_mistral: {
    name: 'Mistral AI',
    category: 'integration',
    color: 'from-orange-600 to-red-500',
    icon: 'Brain',
    description: 'Mistral models',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'model', label: 'Model', type: 'select', options: ['mistral-large', 'mistral-medium'] },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true }
    ]
  },
  integration_huggingface: {
    name: 'Hugging Face',
    category: 'integration',
    color: 'from-yellow-500 to-orange-400',
    icon: 'Brain',
    description: 'HF Inference',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'modelId', label: 'Model ID', type: 'text', required: true },
      { key: 'inputs', label: 'Inputs', type: 'textarea' }
    ]
  },
  integration_replicate: {
    name: 'Replicate',
    category: 'integration',
    color: 'from-gray-700 to-gray-500',
    icon: 'Brain',
    description: 'Run ML models',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'model', label: 'Model', type: 'text', required: true },
      { key: 'input', label: 'Input (JSON)', type: 'json', required: true }
    ]
  },
  integration_stability: {
    name: 'Stability AI',
    category: 'integration',
    color: 'from-purple-600 to-indigo-500',
    icon: 'Image',
    description: 'Stable Diffusion',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'width', label: 'Width', type: 'number', defaultValue: 1024 },
      { key: 'height', label: 'Height', type: 'number', defaultValue: 1024 }
    ]
  },
  integration_elevenlabs: {
    name: 'ElevenLabs',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Volume2',
    description: 'Text-to-speech',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'voiceId', label: 'Voice ID', type: 'text' }
    ]
  },
  integration_deepgram: {
    name: 'Deepgram',
    category: 'integration',
    color: 'from-green-600 to-emerald-500',
    icon: 'Mic',
    description: 'Speech-to-text',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
      { key: 'language', label: 'Language', type: 'select', options: ['en', 'fr', 'es', 'de'] }
    ]
  },
  integration_assemblyai: {
    name: 'AssemblyAI',
    category: 'integration',
    color: 'from-blue-700 to-blue-500',
    icon: 'Mic',
    description: 'Speech recognition',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
      { key: 'languageCode', label: 'Language', type: 'select', options: ['en', 'fr', 'es'] }
    ]
  },

  // ===== CRM EXTERNAL =====
  integration_hubspot: {
    name: 'HubSpot',
    category: 'integration',
    color: 'from-orange-500 to-red-400',
    icon: 'Users',
    description: 'HubSpot CRM (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_contact', 'update_contact', 'create_deal'] },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_salesforce: {
    name: 'Salesforce',
    category: 'integration',
    color: 'from-blue-600 to-sky-500',
    icon: 'Cloud',
    description: 'Salesforce CRM (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'object', label: 'Object', type: 'select', options: ['Lead', 'Contact', 'Account', 'Opportunity'] },
      { key: 'action', label: 'Action', type: 'select', options: ['create', 'update', 'query'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_pipedrive: {
    name: 'Pipedrive',
    category: 'integration',
    color: 'from-green-600 to-emerald-500',
    icon: 'TrendingUp',
    description: 'Pipedrive CRM',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_deal', 'update_deal', 'create_person'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_zoho: {
    name: 'Zoho CRM',
    category: 'integration',
    color: 'from-red-500 to-orange-400',
    icon: 'Database',
    description: 'Zoho CRM',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'module', label: 'Module', type: 'select', options: ['Leads', 'Contacts', 'Deals'] },
      { key: 'action', label: 'Action', type: 'select', options: ['create', 'update'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== PRODUCTIVITY =====
  integration_notion: {
    name: 'Notion',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'FileText',
    description: 'Notion pages (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'databaseId', label: 'Database ID', type: 'text', required: true },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_airtable: {
    name: 'Airtable',
    category: 'integration',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Table',
    description: 'Airtable records (ACTION RÉELLE)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'baseId', label: 'Base ID', type: 'text', required: true },
      { key: 'tableId', label: 'Table ID', type: 'text', required: true },
      { key: 'fields', label: 'Fields (JSON)', type: 'json' }
    ]
  },
  integration_google_sheets: {
    name: 'Google Sheets',
    category: 'integration',
    color: 'from-green-500 to-emerald-400',
    icon: 'Table',
    description: 'Google Sheets',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
      { key: 'range', label: 'Range', type: 'text', placeholder: 'Sheet1!A:D' },
      { key: 'action', label: 'Action', type: 'select', options: ['read', 'append', 'update'] }
    ]
  },
  integration_google_calendar: {
    name: 'Google Calendar',
    category: 'integration',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Calendar',
    description: 'Calendar events',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_event', 'list_events'] },
      { key: 'summary', label: 'Event Title', type: 'text' },
      { key: 'start', label: 'Start', type: 'text', placeholder: 'ISO datetime' },
      { key: 'end', label: 'End', type: 'text' }
    ]
  },
  integration_trello: {
    name: 'Trello',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'Columns',
    description: 'Trello cards',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_card', 'move_card'] },
      { key: 'listId', label: 'List ID', type: 'text', required: true },
      { key: 'name', label: 'Card Name', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' }
    ]
  },
  integration_asana: {
    name: 'Asana',
    category: 'integration',
    color: 'from-rose-500 to-pink-400',
    icon: 'CheckSquare',
    description: 'Asana tasks',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_task', 'update_task'] },
      { key: 'projectId', label: 'Project ID', type: 'text', required: true },
      { key: 'name', label: 'Task Name', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  integration_monday: {
    name: 'Monday.com',
    category: 'integration',
    color: 'from-orange-500 to-yellow-400',
    icon: 'Layout',
    description: 'Monday.com items',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'boardId', label: 'Board ID', type: 'text', required: true },
      { key: 'itemName', label: 'Item Name', type: 'text' },
      { key: 'columnValues', label: 'Column Values (JSON)', type: 'json' }
    ]
  },
  integration_clickup: {
    name: 'ClickUp',
    category: 'integration',
    color: 'from-purple-500 to-violet-400',
    icon: 'CheckCircle',
    description: 'ClickUp tasks',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'listId', label: 'List ID', type: 'text', required: true },
      { key: 'name', label: 'Task Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_jira: {
    name: 'Jira',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'Bug',
    description: 'Jira issues',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'projectKey', label: 'Project Key', type: 'text', required: true },
      { key: 'issueType', label: 'Issue Type', type: 'select', options: ['Task', 'Bug', 'Story', 'Epic'] },
      { key: 'summary', label: 'Summary', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_linear: {
    name: 'Linear',
    category: 'integration',
    color: 'from-indigo-600 to-violet-500',
    icon: 'Zap',
    description: 'Linear issues',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'teamId', label: 'Team ID', type: 'text', required: true },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  integration_calendly: {
    name: 'Calendly',
    category: 'integration',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Calendar',
    description: 'Calendly scheduling',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['list_events', 'get_event'] },
      { key: 'eventUri', label: 'Event URI', type: 'text' }
    ]
  },

  // ===== STORAGE =====
  integration_google_drive: {
    name: 'Google Drive',
    category: 'integration',
    color: 'from-yellow-500 to-amber-400',
    icon: 'HardDrive',
    description: 'Google Drive files',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list'] },
      { key: 'folderId', label: 'Folder ID', type: 'text' },
      { key: 'fileName', label: 'File Name', type: 'text' }
    ]
  },
  integration_dropbox: {
    name: 'Dropbox',
    category: 'integration',
    color: 'from-blue-500 to-blue-400',
    icon: 'Box',
    description: 'Dropbox files',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list'] },
      { key: 'path', label: 'Path', type: 'text', placeholder: '/folder/file.pdf' }
    ]
  },
  integration_onedrive: {
    name: 'OneDrive',
    category: 'integration',
    color: 'from-blue-600 to-sky-500',
    icon: 'Cloud',
    description: 'OneDrive files',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list'] },
      { key: 'path', label: 'Path', type: 'text' }
    ]
  },
  integration_box: {
    name: 'Box',
    category: 'integration',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Box',
    description: 'Box files',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload', 'download', 'list'] },
      { key: 'folderId', label: 'Folder ID', type: 'text' }
    ]
  },
  integration_aws_s3: {
    name: 'AWS S3',
    category: 'integration',
    color: 'from-orange-500 to-yellow-400',
    icon: 'Database',
    description: 'S3 buckets',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'bucket', label: 'Bucket', type: 'text', required: true },
      { key: 'key', label: 'Object Key', type: 'text' },
      { key: 'action', label: 'Action', type: 'select', options: ['put', 'get', 'delete', 'list'] }
    ]
  },

  // ===== PAYMENTS =====
  integration_stripe: {
    name: 'Stripe',
    category: 'integration',
    color: 'from-indigo-600 to-purple-500',
    icon: 'CreditCard',
    description: 'Stripe payments',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_customer', 'create_payment_intent', 'create_invoice'] },
      { key: 'amount', label: 'Amount (cents)', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'select', options: ['eur', 'usd', 'gbp'] },
      { key: 'metadata', label: 'Metadata (JSON)', type: 'json' }
    ]
  },
  integration_paypal: {
    name: 'PayPal',
    category: 'integration',
    color: 'from-blue-600 to-blue-400',
    icon: 'DollarSign',
    description: 'PayPal payments',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_order', 'capture_order'] },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'text', defaultValue: 'EUR' }
    ]
  },
  integration_shopify: {
    name: 'Shopify',
    category: 'integration',
    color: 'from-green-500 to-lime-400',
    icon: 'ShoppingBag',
    description: 'Shopify store',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_order', 'update_product', 'list_products'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },
  integration_quickbooks: {
    name: 'QuickBooks',
    category: 'integration',
    color: 'from-green-600 to-emerald-500',
    icon: 'Calculator',
    description: 'QuickBooks accounting',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_invoice', 'create_customer', 'create_expense'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== SOCIAL =====
  integration_twitter: {
    name: 'Twitter/X',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Twitter',
    description: 'Post to Twitter',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['post_tweet', 'search_tweets'] },
      { key: 'text', label: 'Tweet Text', type: 'textarea' }
    ]
  },
  integration_linkedin: {
    name: 'LinkedIn',
    category: 'integration',
    color: 'from-blue-700 to-blue-600',
    icon: 'Linkedin',
    description: 'LinkedIn posts',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_post', 'get_profile'] },
      { key: 'text', label: 'Post Content', type: 'textarea' }
    ]
  },
  integration_facebook: {
    name: 'Facebook',
    category: 'integration',
    color: 'from-blue-600 to-blue-500',
    icon: 'Facebook',
    description: 'Facebook pages',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_post', 'get_insights'] },
      { key: 'pageId', label: 'Page ID', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  integration_instagram: {
    name: 'Instagram',
    category: 'integration',
    color: 'from-pink-500 to-purple-500',
    icon: 'Instagram',
    description: 'Instagram posts',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_media', 'get_insights'] },
      { key: 'imageUrl', label: 'Image URL', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'textarea' }
    ]
  },
  integration_youtube: {
    name: 'YouTube',
    category: 'integration',
    color: 'from-red-600 to-red-500',
    icon: 'Youtube',
    description: 'YouTube videos',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['upload_video', 'search_videos', 'get_analytics'] },
      { key: 'videoId', label: 'Video ID', type: 'text' }
    ]
  },
  integration_tiktok: {
    name: 'TikTok',
    category: 'integration',
    color: 'from-gray-900 to-gray-700',
    icon: 'Video',
    description: 'TikTok content',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['post_video', 'get_analytics'] },
      { key: 'videoUrl', label: 'Video URL', type: 'text' }
    ]
  },

  // ===== DEV =====
  integration_github: {
    name: 'GitHub',
    category: 'integration',
    color: 'from-gray-800 to-gray-600',
    icon: 'Github',
    description: 'GitHub repos',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'create_pr', 'list_repos'] },
      { key: 'owner', label: 'Owner', type: 'text' },
      { key: 'repo', label: 'Repository', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' }
    ]
  },
  integration_gitlab: {
    name: 'GitLab',
    category: 'integration',
    color: 'from-orange-600 to-red-500',
    icon: 'Gitlab',
    description: 'GitLab projects',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_issue', 'create_mr', 'list_projects'] },
      { key: 'projectId', label: 'Project ID', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' }
    ]
  },
  integration_vercel: {
    name: 'Vercel',
    category: 'integration',
    color: 'from-gray-900 to-gray-700',
    icon: 'Triangle',
    description: 'Vercel deployments',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['trigger_deploy', 'list_deployments'] },
      { key: 'projectId', label: 'Project ID', type: 'text' }
    ]
  },
  integration_supabase: {
    name: 'Supabase',
    category: 'integration',
    color: 'from-emerald-600 to-green-500',
    icon: 'Database',
    description: 'Supabase DB',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'table', label: 'Table', type: 'text', required: true },
      { key: 'action', label: 'Action', type: 'select', options: ['select', 'insert', 'update', 'delete'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' },
      { key: 'filters', label: 'Filters (JSON)', type: 'json' }
    ]
  },
  integration_firebase: {
    name: 'Firebase',
    category: 'integration',
    color: 'from-yellow-500 to-orange-400',
    icon: 'Flame',
    description: 'Firebase/Firestore',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'collection', label: 'Collection', type: 'text', required: true },
      { key: 'action', label: 'Action', type: 'select', options: ['get', 'add', 'update', 'delete'] },
      { key: 'data', label: 'Data (JSON)', type: 'json' }
    ]
  },

  // ===== ANALYTICS =====
  integration_google_analytics: {
    name: 'Google Analytics',
    category: 'integration',
    color: 'from-orange-500 to-yellow-400',
    icon: 'BarChart',
    description: 'GA4 data',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'propertyId', label: 'Property ID', type: 'text', required: true },
      { key: 'metrics', label: 'Metrics', type: 'text', placeholder: 'sessions,pageviews' },
      { key: 'dateRange', label: 'Date Range', type: 'text', placeholder: '7daysAgo,today' }
    ]
  },
  integration_mixpanel: {
    name: 'Mixpanel',
    category: 'integration',
    color: 'from-purple-600 to-violet-500',
    icon: 'Activity',
    description: 'Mixpanel events',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track_event', 'query_events'] },
      { key: 'event', label: 'Event Name', type: 'text' },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_segment: {
    name: 'Segment',
    category: 'integration',
    color: 'from-green-500 to-teal-400',
    icon: 'Activity',
    description: 'Segment tracking',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'type', label: 'Type', type: 'select', options: ['track', 'identify', 'page'] },
      { key: 'event', label: 'Event/Page Name', type: 'text' },
      { key: 'properties', label: 'Properties (JSON)', type: 'json' }
    ]
  },
  integration_amplitude: {
    name: 'Amplitude',
    category: 'integration',
    color: 'from-blue-600 to-indigo-500',
    icon: 'TrendingUp',
    description: 'Amplitude analytics',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['track_event', 'identify_user'] },
      { key: 'eventType', label: 'Event Type', type: 'text' },
      { key: 'eventProperties', label: 'Event Properties (JSON)', type: 'json' }
    ]
  },

  // ===== AUTOMATION =====
  integration_zapier: {
    name: 'Zapier Webhook',
    category: 'integration',
    color: 'from-orange-500 to-amber-400',
    icon: 'Zap',
    description: 'Trigger Zapier',
    isRealAction: true,
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'payload', label: 'Payload (JSON)', type: 'json' }
    ]
  },
  integration_make: {
    name: 'Make (Integromat)',
    category: 'integration',
    color: 'from-purple-600 to-violet-500',
    icon: 'Cog',
    description: 'Trigger Make',
    isRealAction: true,
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'payload', label: 'Payload (JSON)', type: 'json' }
    ]
  },
  integration_n8n: {
    name: 'n8n Webhook',
    category: 'integration',
    color: 'from-red-500 to-orange-400',
    icon: 'Workflow',
    description: 'Trigger n8n',
    isRealAction: true,
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true },
      { key: 'payload', label: 'Payload (JSON)', type: 'json' }
    ]
  },

  // ===== VIDEO =====
  integration_zoom: {
    name: 'Zoom',
    category: 'integration',
    color: 'from-blue-600 to-blue-500',
    icon: 'Video',
    description: 'Zoom meetings',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['create_meeting', 'list_meetings', 'get_recording'] },
      { key: 'topic', label: 'Meeting Topic', type: 'text' },
      { key: 'startTime', label: 'Start Time', type: 'text', placeholder: 'ISO datetime' }
    ]
  },
  integration_loom: {
    name: 'Loom',
    category: 'integration',
    color: 'from-purple-500 to-indigo-400',
    icon: 'Video',
    description: 'Loom videos',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      { key: 'action', label: 'Action', type: 'select', options: ['list_videos', 'get_video'] },
      { key: 'videoId', label: 'Video ID', type: 'text' }
    ]
  },

  // ===== SYSTEM ACTIONS =====
  system_email: {
    name: 'Send Email',
    category: 'system',
    color: 'from-rose-500 to-pink-400',
    icon: 'Mail',
    description: 'Send email notification',
    configFields: [
      { key: 'to', label: 'To', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'template', label: 'Template', type: 'select', options: ['plain', 'html', 'markdown'] }
    ]
  },
  system_webhook: {
    name: 'Call Webhook',
    category: 'system',
    color: 'from-indigo-500 to-purple-400',
    icon: 'Globe',
    description: 'Call external webhook',
    isRealAction: true,
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'text', required: true },
      { key: 'method', label: 'Method', type: 'select', options: ['POST', 'PUT', 'GET'] }
    ]
  },
  system_save: {
    name: 'Save to Database',
    category: 'system',
    color: 'from-emerald-500 to-green-400',
    icon: 'Database',
    description: 'Save data to database (ACTION RÉELLE)',
    isRealAction: true,
    configFields: [
      { key: 'table', label: 'Table Name', type: 'text', required: true },
      { key: 'operation', label: 'Operation', type: 'select', options: ['insert', 'upsert', 'update'] },
      { key: 'conflictColumn', label: 'Conflict Column (for upsert)', type: 'text' }
    ]
  },
  system_notify: {
    name: 'Send Notification',
    category: 'system',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Bell',
    description: 'Send push notification',
    configFields: [
      { key: 'channel', label: 'Channel', type: 'select', options: ['push', 'email', 'sms', 'slack'] },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] }
    ]
  },
  system_log: {
    name: 'Log Entry',
    category: 'system',
    color: 'from-gray-500 to-slate-400',
    icon: 'FileText',
    description: 'Create audit log entry',
    configFields: [
      { key: 'level', label: 'Level', type: 'select', options: ['debug', 'info', 'warn', 'error'] },
      { key: 'message', label: 'Message Template', type: 'textarea' },
      { key: 'includeContext', label: 'Include Context', type: 'boolean', defaultValue: true }
    ]
  }
};

// Block categories for UI organization
export const BLOCK_CATEGORIES: { id: BlockCategory; name: string; description: string; icon: string }[] = [
  { id: 'trigger', name: 'Triggers', description: 'Start workflows', icon: 'Zap' },
  { id: 'aether', name: 'AETHER', description: 'Actions internes (CRM, Gmail, Documents)', icon: 'Star' },
  { id: 'ai', name: 'AI Actions', description: 'Intelligence artificielle', icon: 'Sparkles' },
  { id: 'transform', name: 'Transform', description: 'Data manipulation', icon: 'Shuffle' },
  { id: 'control', name: 'Control Flow', description: 'Logic and routing', icon: 'GitBranch' },
  { id: 'integration', name: 'Integrations', description: 'Third-party services', icon: 'Plug' },
  { id: 'system', name: 'System', description: 'Internal actions', icon: 'Settings' }
];

// Helper to check if a block performs real actions
export function isRealActionBlock(type: BlockType): boolean {
  return BLOCK_DEFINITIONS[type]?.isRealAction === true;
}

// Helper to check if a block requires authentication
export function requiresAuthentication(type: BlockType): boolean {
  return BLOCK_DEFINITIONS[type]?.requiresAuth === true;
}

// Category info for UI display
export const CATEGORY_INFO: Record<BlockCategory, { name: string; color: string; icon: string }> = {
  trigger: { name: 'Triggers', color: 'bg-blue-500', icon: 'Zap' },
  aether: { name: 'AETHER', color: 'bg-violet-500', icon: 'Star' },
  ai: { name: 'IA', color: 'bg-purple-500', icon: 'Brain' },
  transform: { name: 'Transform', color: 'bg-amber-500', icon: 'Braces' },
  control: { name: 'Control Flow', color: 'bg-green-500', icon: 'GitBranch' },
  integration: { name: 'Intégrations', color: 'bg-cyan-500', icon: 'Plug' },
  system: { name: 'Système', color: 'bg-gray-500', icon: 'Settings' }
};

// Workflow template interface
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: string;
  color: string;
  useCases: string[];
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
}

// Pre-built workflow templates
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'invoice-processor',
    name: 'Traitement de Factures',
    description: 'Analyser les factures PDF reçues par email, extraire les données et les enregistrer dans le CRM',
    category: 'Finance',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    icon: 'Receipt',
    color: 'from-emerald-500 to-green-400',
    useCases: ['Comptabilité', 'Facturation', 'Automatisation finance'],
    blocks: [
      { id: 'trigger-1', type: 'trigger_email', name: 'Email Reçu', config: { subjectFilter: 'Facture*' }, position: { x: 100, y: 50 } },
      { id: 'extract-1', type: 'ai_extract', name: 'Extraire Données', config: { fields: 'vendor, amount, date, invoice_number' }, position: { x: 100, y: 200 } },
      { id: 'classify-1', type: 'ai_classify', name: 'Classifier', config: { categories: 'Fournisseur, Service, Produit' }, position: { x: 100, y: 350 } },
      { id: 'save-1', type: 'system_save', name: 'Sauvegarder', config: { table: 'invoices', operation: 'insert' }, position: { x: 100, y: 500 } }
    ],
    connections: [
      { id: 'conn-1', sourceBlockId: 'trigger-1', targetBlockId: 'extract-1' },
      { id: 'conn-2', sourceBlockId: 'extract-1', targetBlockId: 'classify-1' },
      { id: 'conn-3', sourceBlockId: 'classify-1', targetBlockId: 'save-1' }
    ]
  },
  {
    id: 'lead-enrichment',
    name: 'Enrichissement Leads',
    description: 'Enrichir automatiquement les nouveaux leads avec des données entreprise et les scorer',
    category: 'Sales',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    icon: 'Users',
    color: 'from-blue-500 to-indigo-400',
    useCases: ['CRM', 'Prospection', 'Lead scoring'],
    blocks: [
      { id: 'trigger-1', type: 'trigger_webhook', name: 'Nouveau Lead', config: { method: 'POST' }, position: { x: 100, y: 50 } },
      { id: 'http-1', type: 'http_request', name: 'Enrichir Données', config: { method: 'GET', url: 'https://api.clearbit.com/...' }, position: { x: 100, y: 200 } },
      { id: 'ai-1', type: 'ai_generate', name: 'Scorer Lead', config: { prompt: 'Analyse this lead data and provide a score from 1-100' }, position: { x: 100, y: 350 } },
      { id: 'crm-1', type: 'aether_crm_create_lead', name: 'Créer dans CRM', config: {}, position: { x: 100, y: 500 } }
    ],
    connections: [
      { id: 'conn-1', sourceBlockId: 'trigger-1', targetBlockId: 'http-1' },
      { id: 'conn-2', sourceBlockId: 'http-1', targetBlockId: 'ai-1' },
      { id: 'conn-3', sourceBlockId: 'ai-1', targetBlockId: 'crm-1' }
    ]
  },
  {
    id: 'support-triage',
    name: 'Triage Support',
    description: 'Classifier et router automatiquement les tickets support avec réponse IA',
    category: 'Support',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    icon: 'Headphones',
    color: 'from-purple-500 to-pink-400',
    useCases: ['Service client', 'Helpdesk', 'Automatisation support'],
    blocks: [
      { id: 'trigger-1', type: 'trigger_text', name: 'Ticket Reçu', config: { placeholder: 'Décrivez votre problème...' }, position: { x: 100, y: 50 } },
      { id: 'sentiment-1', type: 'ai_sentiment', name: 'Analyser Sentiment', config: {}, position: { x: 100, y: 200 } },
      { id: 'classify-1', type: 'ai_classify', name: 'Classifier Ticket', config: { categories: 'Technique, Facturation, Commercial, Autre' }, position: { x: 100, y: 350 } },
      { id: 'generate-1', type: 'ai_generate', name: 'Générer Réponse', config: { prompt: 'Generate a helpful response', tone: 'professional' }, position: { x: 100, y: 500 } }
    ],
    connections: [
      { id: 'conn-1', sourceBlockId: 'trigger-1', targetBlockId: 'sentiment-1' },
      { id: 'conn-2', sourceBlockId: 'sentiment-1', targetBlockId: 'classify-1' },
      { id: 'conn-3', sourceBlockId: 'classify-1', targetBlockId: 'generate-1' }
    ]
  },
  {
    id: 'content-summarizer',
    name: 'Résumeur de Contenu',
    description: 'Résumer des documents longs et générer des points clés',
    category: 'Content',
    difficulty: 'beginner',
    estimatedTime: '2 min',
    icon: 'FileText',
    color: 'from-amber-500 to-orange-400',
    useCases: ['Documentation', 'Veille', 'Recherche'],
    blocks: [
      { id: 'trigger-1', type: 'trigger_file', name: 'Document Uploadé', config: { acceptedTypes: '.pdf,.docx,.txt' }, position: { x: 100, y: 50 } },
      { id: 'summary-1', type: 'ai_summary', name: 'Résumer', config: { style: 'executive', maxLength: 500 }, position: { x: 100, y: 200 } },
      { id: 'extract-1', type: 'ai_extract', name: 'Points Clés', config: { fields: 'key_points, action_items, decisions' }, position: { x: 100, y: 350 } }
    ],
    connections: [
      { id: 'conn-1', sourceBlockId: 'trigger-1', targetBlockId: 'summary-1' },
      { id: 'conn-2', sourceBlockId: 'summary-1', targetBlockId: 'extract-1' }
    ]
  },
  {
    id: 'data-sync',
    name: 'Synchronisation Données',
    description: 'Récupérer des données API, transformer et stocker dans la base',
    category: 'Data',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    icon: 'Database',
    color: 'from-cyan-500 to-teal-400',
    useCases: ['ETL', 'Intégration données', 'Synchronisation'],
    blocks: [
      { id: 'trigger-1', type: 'trigger_schedule', name: 'Toutes les heures', config: { cron: '0 * * * *' }, position: { x: 100, y: 50 } },
      { id: 'http-1', type: 'http_request', name: 'Fetch API', config: { method: 'GET', url: 'https://api.example.com/data' }, position: { x: 100, y: 200 } },
      { id: 'transform-1', type: 'transform_map', name: 'Transformer', config: { mapping: '{ "id": "$.id", "name": "$.attributes.name" }' }, position: { x: 100, y: 350 } },
      { id: 'filter-1', type: 'transform_filter', name: 'Filtrer Actifs', config: { condition: 'item.status === "active"' }, position: { x: 100, y: 500 } },
      { id: 'save-1', type: 'system_save', name: 'Sauvegarder', config: { table: 'synced_data', operation: 'upsert' }, position: { x: 100, y: 650 } }
    ],
    connections: [
      { id: 'conn-1', sourceBlockId: 'trigger-1', targetBlockId: 'http-1' },
      { id: 'conn-2', sourceBlockId: 'http-1', targetBlockId: 'transform-1' },
      { id: 'conn-3', sourceBlockId: 'transform-1', targetBlockId: 'filter-1' },
      { id: 'conn-4', sourceBlockId: 'filter-1', targetBlockId: 'save-1' }
    ]
  }
];
