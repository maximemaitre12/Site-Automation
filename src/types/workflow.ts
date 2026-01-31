// ==========================================
// AETHER FLOW - PRIMITIVES GÉNÉRIQUES N8N
// Architecture 100% configurable
// ZÉRO logique métier figée
// ==========================================

// ==========================================
// BLOCK TYPES - Primitives uniquement
// ==========================================

export type BlockType = 
  // === TRIGGERS (Déclencheurs) ===
  | 'trigger_manual'      // Déclenchement manuel
  | 'trigger_webhook'     // Webhook HTTP entrant
  | 'trigger_schedule'    // Planification CRON
  | 'trigger_event'       // Événement système/database
  
  // === AI / LLM (Appels IA) ===
  | 'llm_call'            // Appel LLM générique (toutes actions IA)
  | 'llm_structured'      // Extraction structurée avec schema
  | 'llm_vision'          // Analyse d'images
  | 'llm_embeddings'      // Génération d'embeddings
  
  // === LOGIC / CONTROL FLOW ===
  | 'condition'           // If/Else
  | 'switch'              // Switch multi-branches
  | 'loop'                // Boucle sur items
  | 'loop_while'          // Boucle conditionnelle
  | 'merge'               // Fusion de branches
  | 'split'               // Split parallèle
  | 'wait'                // Attente/Delay
  | 'error_handler'       // Gestion d'erreurs
  | 'stop'                // Arrêt du workflow
  
  // === DATA TRANSFORM ===
  | 'set_variable'        // Définir des variables
  | 'code_js'             // Code JavaScript personnalisé
  | 'json_parse'          // Parser JSON
  | 'json_stringify'      // Sérialiser en JSON
  | 'filter'              // Filtrer items
  | 'map'                 // Mapper/Transformer items
  | 'aggregate'           // Agréger items (sum, avg, count...)
  | 'sort'                // Trier items
  | 'limit'               // Limiter nombre d'items
  | 'merge_data'          // Fusionner des données
  | 'split_text'          // Découper du texte
  | 'template'            // Template avec variables {{ }}
  | 'date_time'           // Manipulation date/heure
  | 'crypto'              // Hash, encrypt, decrypt
  | 'base64'              // Encode/Decode base64
  
  // === HTTP / API ===
  | 'http_request'        // Requête HTTP générique
  | 'http_response'       // Réponse HTTP (pour webhooks)
  | 'graphql'             // Requête GraphQL
  | 'soap'                // Appel SOAP
  | 'websocket'           // WebSocket send/receive
  
  // === EMAIL ===
  | 'email_imap'          // Lire emails IMAP
  | 'email_smtp'          // Envoyer email SMTP
  | 'email_oauth'         // Email via OAuth (Gmail, Outlook)
  
  // === DATABASE ===
  | 'db_query'            // Query SQL générique
  | 'db_insert'           // Insert
  | 'db_update'           // Update
  | 'db_delete'           // Delete
  | 'db_upsert'           // Upsert
  
  // === FILES / STORAGE ===
  | 'file_read'           // Lire fichier
  | 'file_write'          // Écrire fichier
  | 'file_convert'        // Convertir format
  | 'file_compress'       // Compresser/Décompresser
  | 'storage_upload'      // Upload vers stockage
  | 'storage_download'    // Download depuis stockage
  
  // === MESSAGING ===
  | 'message_send'        // Envoyer message (Slack, Discord, Teams, etc.)
  | 'message_receive'     // Recevoir message
  
  // === MEMORY / STATE ===
  | 'memory_read'         // Lire depuis mémoire/cache
  | 'memory_write'        // Écrire dans mémoire/cache
  | 'memory_delete'       // Supprimer de mémoire
  
  // === TOOLS / FUNCTION CALLING ===
  | 'tool_call'           // Appeler un outil externe
  | 'tool_define'         // Définir un outil (pour agents)
  
  // === OUTPUT ===
  | 'output_json'         // Sortie JSON
  | 'output_file'         // Sortie fichier
  | 'output_display'      // Affichage dans UI
  | 'output_notify'       // Notification
  | 'output_log';         // Log/Audit

export type BlockCategory = 
  | 'trigger' 
  | 'ai' 
  | 'logic' 
  | 'transform' 
  | 'http' 
  | 'email' 
  | 'database' 
  | 'files' 
  | 'messaging' 
  | 'memory' 
  | 'tools' 
  | 'output';

// ==========================================
// CORE INTERFACES
// ==========================================

export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'success' | 'error' | 'skipped' | 'cancelled';
export type ActionType = 'real' | 'simulated' | 'ai';

export interface BlockConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceHandle?: string;
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
    backoffMultiplier?: number;
  };
  timeout?: number;
  description?: string;
  disabled?: boolean;
  notes?: string;
}

export interface WorkflowSettings {
  autoLayout?: boolean;
  gridSnap?: number;
  zoomLevel?: number;
  panPosition?: { x: number; y: number };
  executionMode?: 'sequential' | 'parallel' | 'auto';
  defaultTimeout?: number;
  timezone?: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  variables?: Record<string, any>;
  settings?: WorkflowSettings;
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
  actionType?: ActionType;
  isLive?: boolean;
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
  realActionsCount?: number;
}

// ==========================================
// CONFIG FIELD TYPES
// ==========================================

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'code' | 'select' | 'multiselect' | 'number' | 'boolean' | 'json' | 'keyvalue' | 'password' | 'oauth_button' | 'expression' | 'file' | 'color' | 'date' | 'cron';
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  helpText?: string;
  showWhen?: { field: string; value: any } | { field: string; notValue: any };
  section?: string;
  advanced?: boolean;
  expressionEnabled?: boolean; // Permet {{ }} expressions
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
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
  isRealAction?: boolean;
  requiresAuth?: boolean;
  expressionContext?: string[]; // Variables disponibles dans les expressions
}

// ==========================================
// BLOCK DEFINITIONS - PRIMITIVES 100% GÉNÉRIQUES
// ==========================================

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  
  // ===================================================================
  // TRIGGERS - Déclencheurs configurables
  // ===================================================================
  
  trigger_manual: {
    name: 'Manual Trigger',
    category: 'trigger',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Play',
    description: 'Déclenchement manuel avec données d\'entrée configurables',
    configFields: [
      // Input Schema
      { key: 'inputMode', label: 'Mode d\'entrée', type: 'select', options: ['text', 'json', 'form', 'file', 'none'], defaultValue: 'text', section: 'input', helpText: 'Type de données attendu au démarrage' },
      { key: 'inputSchema', label: 'Schéma d\'entrée (JSON Schema)', type: 'json', placeholder: '{"type": "object", "properties": {"name": {"type": "string"}}}', section: 'input', showWhen: { field: 'inputMode', value: 'form' }, helpText: 'Définit les champs du formulaire d\'entrée' },
      { key: 'inputPlaceholder', label: 'Placeholder', type: 'text', placeholder: 'Entrez votre texte...', section: 'input', showWhen: { field: 'inputMode', value: 'text' } },
      { key: 'multiline', label: 'Multi-lignes', type: 'boolean', defaultValue: false, section: 'input', showWhen: { field: 'inputMode', value: 'text' } },
      { key: 'acceptedFileTypes', label: 'Types de fichiers acceptés', type: 'text', placeholder: '.pdf,.docx,.txt', section: 'input', showWhen: { field: 'inputMode', value: 'file' } },
      { key: 'maxFileSizeMb', label: 'Taille max (MB)', type: 'number', defaultValue: 10, section: 'input', showWhen: { field: 'inputMode', value: 'file' } },
      // Variables initiales
      { key: 'initialVariables', label: 'Variables initiales (JSON)', type: 'json', placeholder: '{"key": "value"}', section: 'variables', helpText: 'Variables injectées au démarrage' },
    ]
  },
  
  trigger_webhook: {
    name: 'Webhook Trigger',
    category: 'trigger',
    color: 'from-green-500 to-emerald-400',
    icon: 'Globe',
    description: 'Déclenché par une requête HTTP entrante',
    isRealAction: true,
    configFields: [
      // HTTP Config
      { key: 'path', label: 'Chemin URL', type: 'text', placeholder: '/my-webhook', section: 'http', helpText: 'Chemin relatif du webhook (auto-généré si vide)' },
      { key: 'method', label: 'Méthode HTTP', type: 'select', options: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'ANY'], defaultValue: 'POST', section: 'http' },
      { key: 'contentType', label: 'Content-Type attendu', type: 'select', options: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'any'], defaultValue: 'application/json', section: 'http' },
      // Auth
      { key: 'authEnabled', label: 'Authentification requise', type: 'boolean', defaultValue: false, section: 'auth' },
      { key: 'authType', label: 'Type d\'auth', type: 'select', options: ['none', 'basic', 'bearer', 'api_key', 'hmac'], defaultValue: 'none', section: 'auth', showWhen: { field: 'authEnabled', value: true } },
      { key: 'authSecret', label: 'Secret/Token', type: 'password', section: 'auth', showWhen: { field: 'authEnabled', value: true } },
      { key: 'authHeader', label: 'Header name (pour API key)', type: 'text', placeholder: 'X-API-Key', section: 'auth', showWhen: { field: 'authType', value: 'api_key' } },
      // Response
      { key: 'responseMode', label: 'Mode de réponse', type: 'select', options: ['immediate', 'wait_for_workflow', 'custom'], defaultValue: 'immediate', section: 'response', helpText: 'Quand envoyer la réponse HTTP' },
      { key: 'immediateStatus', label: 'Code HTTP (immédiat)', type: 'number', defaultValue: 200, section: 'response', showWhen: { field: 'responseMode', value: 'immediate' } },
      { key: 'immediateBody', label: 'Corps de réponse', type: 'textarea', placeholder: '{"status": "received"}', section: 'response', showWhen: { field: 'responseMode', value: 'immediate' } },
      // Rate Limiting
      { key: 'rateLimitEnabled', label: 'Rate limiting', type: 'boolean', defaultValue: false, section: 'limits' },
      { key: 'rateLimitMax', label: 'Max requêtes', type: 'number', defaultValue: 100, section: 'limits', showWhen: { field: 'rateLimitEnabled', value: true } },
      { key: 'rateLimitWindow', label: 'Fenêtre (secondes)', type: 'number', defaultValue: 60, section: 'limits', showWhen: { field: 'rateLimitEnabled', value: true } },
      // IP Whitelist
      { key: 'ipWhitelist', label: 'IPs autorisées (virgules)', type: 'text', placeholder: '192.168.1.1, 10.0.0.0/8', section: 'limits' },
    ]
  },
  
  trigger_schedule: {
    name: 'Schedule Trigger',
    category: 'trigger',
    color: 'from-sky-500 to-blue-400',
    icon: 'Clock',
    description: 'Exécution planifiée avec CRON ou intervalle',
    configFields: [
      // Schedule Type
      { key: 'scheduleType', label: 'Type de planification', type: 'select', options: ['cron', 'interval', 'specific_times'], defaultValue: 'cron', section: 'schedule' },
      // CRON
      { key: 'cronExpression', label: 'Expression CRON', type: 'cron', placeholder: '0 9 * * 1-5', section: 'schedule', showWhen: { field: 'scheduleType', value: 'cron' }, helpText: 'min hour day month weekday' },
      // Interval
      { key: 'intervalValue', label: 'Intervalle', type: 'number', defaultValue: 5, section: 'schedule', showWhen: { field: 'scheduleType', value: 'interval' } },
      { key: 'intervalUnit', label: 'Unité', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'], defaultValue: 'minutes', section: 'schedule', showWhen: { field: 'scheduleType', value: 'interval' } },
      // Specific times
      { key: 'specificTimes', label: 'Heures (JSON array)', type: 'json', placeholder: '["09:00", "14:00", "18:00"]', section: 'schedule', showWhen: { field: 'scheduleType', value: 'specific_times' } },
      { key: 'specificDays', label: 'Jours', type: 'multiselect', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], section: 'schedule', showWhen: { field: 'scheduleType', value: 'specific_times' } },
      // Timezone
      { key: 'timezone', label: 'Fuseau horaire', type: 'select', options: ['UTC', 'Europe/Paris', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Shanghai'], defaultValue: 'UTC', section: 'schedule' },
      // Execution Window
      { key: 'executionWindow', label: 'Fenêtre d\'exécution', type: 'boolean', defaultValue: false, section: 'advanced', helpText: 'Limiter l\'exécution à certaines heures' },
      { key: 'windowStart', label: 'Début fenêtre', type: 'text', placeholder: '09:00', section: 'advanced', showWhen: { field: 'executionWindow', value: true } },
      { key: 'windowEnd', label: 'Fin fenêtre', type: 'text', placeholder: '18:00', section: 'advanced', showWhen: { field: 'executionWindow', value: true } },
      // Initial data
      { key: 'staticInput', label: 'Données statiques (JSON)', type: 'json', placeholder: '{"source": "scheduled"}', section: 'data', helpText: 'Données injectées à chaque exécution' },
    ]
  },
  
  trigger_event: {
    name: 'Event Trigger',
    category: 'trigger',
    color: 'from-purple-500 to-violet-400',
    icon: 'Zap',
    description: 'Déclenché par un événement système ou database',
    isRealAction: true,
    configFields: [
      // Event Source
      { key: 'eventSource', label: 'Source', type: 'select', options: ['database', 'storage', 'auth', 'custom', 'realtime'], defaultValue: 'database', section: 'source' },
      // Database events
      { key: 'dbTable', label: 'Table', type: 'text', placeholder: 'users', section: 'database', showWhen: { field: 'eventSource', value: 'database' } },
      { key: 'dbEvent', label: 'Événement', type: 'multiselect', options: ['INSERT', 'UPDATE', 'DELETE'], section: 'database', showWhen: { field: 'eventSource', value: 'database' } },
      { key: 'dbFilter', label: 'Filtre (condition SQL)', type: 'text', placeholder: 'status = \'active\'', section: 'database', showWhen: { field: 'eventSource', value: 'database' } },
      { key: 'dbColumns', label: 'Colonnes à surveiller', type: 'text', placeholder: 'status, updated_at', section: 'database', showWhen: { field: 'eventSource', value: 'database' }, helpText: 'Vide = toutes colonnes' },
      // Storage events
      { key: 'storageBucket', label: 'Bucket', type: 'text', placeholder: 'documents', section: 'storage', showWhen: { field: 'eventSource', value: 'storage' } },
      { key: 'storageEvent', label: 'Événement', type: 'multiselect', options: ['upload', 'delete', 'move'], section: 'storage', showWhen: { field: 'eventSource', value: 'storage' } },
      { key: 'storagePathPattern', label: 'Pattern de chemin', type: 'text', placeholder: 'invoices/*.pdf', section: 'storage', showWhen: { field: 'eventSource', value: 'storage' } },
      // Auth events
      { key: 'authEvent', label: 'Événement auth', type: 'multiselect', options: ['signup', 'login', 'logout', 'password_reset', 'email_verified'], section: 'auth', showWhen: { field: 'eventSource', value: 'auth' } },
      // Custom events
      { key: 'customEventName', label: 'Nom de l\'événement', type: 'text', placeholder: 'my_custom_event', section: 'custom', showWhen: { field: 'eventSource', value: 'custom' } },
      { key: 'customEventChannel', label: 'Channel', type: 'text', placeholder: 'notifications', section: 'custom', showWhen: { field: 'eventSource', value: 'custom' } },
      // Debounce
      { key: 'debounceEnabled', label: 'Debounce', type: 'boolean', defaultValue: false, section: 'advanced' },
      { key: 'debounceMs', label: 'Délai (ms)', type: 'number', defaultValue: 1000, section: 'advanced', showWhen: { field: 'debounceEnabled', value: true } },
    ]
  },

  // ===================================================================
  // AI / LLM - Appels IA 100% configurables
  // ===================================================================
  
  llm_call: {
    name: 'LLM Call',
    category: 'ai',
    color: 'from-violet-500 to-purple-400',
    icon: 'Brain',
    description: 'Appel LLM générique - tous types de tâches IA',
    configFields: [
      // Model Selection
      { key: 'provider', label: 'Provider', type: 'select', options: ['lovable', 'openai', 'anthropic', 'google', 'mistral', 'custom'], defaultValue: 'lovable', section: 'model', helpText: 'Lovable AI = pas de clé API requise' },
      { key: 'model', label: 'Modèle', type: 'select', options: [
        'google/gemini-3-flash-preview',
        'google/gemini-2.5-pro',
        'google/gemini-2.5-flash',
        'google/gemini-2.5-flash-lite',
        'openai/gpt-5',
        'openai/gpt-5-mini',
        'openai/gpt-5-nano',
        'openai/gpt-5.2',
        'google/gemini-3-pro-preview'
      ], defaultValue: 'google/gemini-3-flash-preview', section: 'model' },
      { key: 'customEndpoint', label: 'Endpoint personnalisé', type: 'text', placeholder: 'https://api.custom.ai/v1/chat', section: 'model', showWhen: { field: 'provider', value: 'custom' } },
      { key: 'apiKey', label: 'API Key', type: 'password', section: 'model', showWhen: { field: 'provider', notValue: 'lovable' }, helpText: 'Requis pour les providers externes' },
      
      // Prompts
      { key: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'Tu es un assistant expert en...', section: 'prompts', helpText: 'Définit le comportement et le contexte', expressionEnabled: true },
      { key: 'userPrompt', label: 'User Prompt / Instructions', type: 'textarea', placeholder: 'Analyse le texte suivant et...', required: true, section: 'prompts', expressionEnabled: true, helpText: 'Utilisez {{ $input }} pour les données entrantes' },
      { key: 'promptTemplate', label: 'Template de prompt', type: 'select', options: ['custom', 'summarize', 'extract', 'classify', 'translate', 'generate', 'analyze', 'rewrite'], defaultValue: 'custom', section: 'prompts' },
      
      // Parameters
      { key: 'temperature', label: 'Température', type: 'number', defaultValue: 0.7, section: 'parameters', helpText: '0 = déterministe, 1 = créatif', validation: { min: 0, max: 2 } },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 2000, section: 'parameters' },
      { key: 'topP', label: 'Top P', type: 'number', defaultValue: 1, section: 'parameters', advanced: true },
      { key: 'frequencyPenalty', label: 'Frequency Penalty', type: 'number', defaultValue: 0, section: 'parameters', advanced: true },
      { key: 'presencePenalty', label: 'Presence Penalty', type: 'number', defaultValue: 0, section: 'parameters', advanced: true },
      { key: 'stopSequences', label: 'Stop Sequences (JSON array)', type: 'json', placeholder: '["\\n\\n", "END"]', section: 'parameters', advanced: true },
      
      // Output
      { key: 'outputFormat', label: 'Format de sortie', type: 'select', options: ['text', 'json', 'markdown', 'html'], defaultValue: 'text', section: 'output' },
      { key: 'parseJson', label: 'Parser la réponse JSON', type: 'boolean', defaultValue: false, section: 'output', showWhen: { field: 'outputFormat', value: 'json' } },
      
      // Context / Memory
      { key: 'includeHistory', label: 'Inclure historique', type: 'boolean', defaultValue: false, section: 'context', helpText: 'Inclut les messages précédents du workflow' },
      { key: 'historyLimit', label: 'Limite historique', type: 'number', defaultValue: 10, section: 'context', showWhen: { field: 'includeHistory', value: true } },
      { key: 'contextVariables', label: 'Variables de contexte', type: 'json', placeholder: '{"user_name": "{{ $input.name }}"}', section: 'context', expressionEnabled: true },
      
      // Streaming
      { key: 'streaming', label: 'Streaming', type: 'boolean', defaultValue: false, section: 'advanced', helpText: 'Réponse en temps réel (streaming SSE)' },
      
      // Caching
      { key: 'cacheEnabled', label: 'Cache activé', type: 'boolean', defaultValue: false, section: 'advanced' },
      { key: 'cacheTtl', label: 'Durée cache (secondes)', type: 'number', defaultValue: 3600, section: 'advanced', showWhen: { field: 'cacheEnabled', value: true } },
    ]
  },
  
  llm_structured: {
    name: 'LLM Structured Output',
    category: 'ai',
    color: 'from-amber-500 to-orange-400',
    icon: 'FileJson',
    description: 'Extraction de données structurées avec schéma',
    configFields: [
      // Model
      { key: 'provider', label: 'Provider', type: 'select', options: ['lovable', 'openai', 'anthropic', 'google'], defaultValue: 'lovable', section: 'model' },
      { key: 'model', label: 'Modèle', type: 'select', options: [
        'google/gemini-3-flash-preview',
        'google/gemini-2.5-pro',
        'openai/gpt-5',
        'openai/gpt-5-mini'
      ], defaultValue: 'google/gemini-3-flash-preview', section: 'model' },
      { key: 'apiKey', label: 'API Key', type: 'password', section: 'model', showWhen: { field: 'provider', notValue: 'lovable' } },
      
      // Schema Definition
      { key: 'schemaMode', label: 'Mode de schéma', type: 'select', options: ['fields', 'json_schema', 'typescript'], defaultValue: 'fields', section: 'schema' },
      { key: 'fields', label: 'Champs à extraire', type: 'textarea', placeholder: 'name: string\nemail: string\ndate: date\namount: number', section: 'schema', showWhen: { field: 'schemaMode', value: 'fields' }, helpText: 'Un champ par ligne: nom: type' },
      { key: 'jsonSchema', label: 'JSON Schema', type: 'json', placeholder: '{"type": "object", "properties": {...}}', section: 'schema', showWhen: { field: 'schemaMode', value: 'json_schema' } },
      { key: 'typescriptSchema', label: 'Interface TypeScript', type: 'code', placeholder: 'interface Data {\n  name: string;\n  email: string;\n}', section: 'schema', showWhen: { field: 'schemaMode', value: 'typescript' } },
      
      // Instructions
      { key: 'extractionPrompt', label: 'Instructions d\'extraction', type: 'textarea', placeholder: 'Extrais les informations suivantes du texte...', section: 'instructions', expressionEnabled: true },
      { key: 'examples', label: 'Exemples (few-shot)', type: 'json', placeholder: '[{"input": "...", "output": {...}}]', section: 'instructions', helpText: 'Exemples pour guider l\'extraction' },
      
      // Validation
      { key: 'strictMode', label: 'Mode strict', type: 'boolean', defaultValue: true, section: 'validation', helpText: 'Échec si champs obligatoires manquants' },
      { key: 'nullForMissing', label: 'Null pour champs manquants', type: 'boolean', defaultValue: true, section: 'validation' },
      { key: 'validateTypes', label: 'Valider les types', type: 'boolean', defaultValue: true, section: 'validation' },
      
      // Parameters
      { key: 'temperature', label: 'Température', type: 'number', defaultValue: 0.1, section: 'parameters', helpText: 'Bas pour extraction précise' },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 2000, section: 'parameters' },
    ]
  },
  
  llm_vision: {
    name: 'LLM Vision',
    category: 'ai',
    color: 'from-pink-500 to-rose-400',
    icon: 'Eye',
    description: 'Analyse d\'images avec IA multimodale',
    configFields: [
      // Model
      { key: 'provider', label: 'Provider', type: 'select', options: ['lovable', 'openai', 'anthropic', 'google'], defaultValue: 'lovable', section: 'model' },
      { key: 'model', label: 'Modèle', type: 'select', options: [
        'google/gemini-2.5-pro',
        'google/gemini-2.5-flash',
        'openai/gpt-5',
        'openai/gpt-5-mini'
      ], defaultValue: 'google/gemini-2.5-pro', section: 'model', helpText: 'Doit supporter la vision' },
      { key: 'apiKey', label: 'API Key', type: 'password', section: 'model', showWhen: { field: 'provider', notValue: 'lovable' } },
      
      // Image Input
      { key: 'imageSource', label: 'Source de l\'image', type: 'select', options: ['input', 'url', 'base64', 'file'], defaultValue: 'input', section: 'image' },
      { key: 'imageUrl', label: 'URL de l\'image', type: 'text', placeholder: 'https://...', section: 'image', showWhen: { field: 'imageSource', value: 'url' }, expressionEnabled: true },
      { key: 'imageBase64', label: 'Image Base64', type: 'textarea', section: 'image', showWhen: { field: 'imageSource', value: 'base64' }, expressionEnabled: true },
      { key: 'maxImages', label: 'Max images', type: 'number', defaultValue: 4, section: 'image' },
      { key: 'imageDetail', label: 'Niveau de détail', type: 'select', options: ['auto', 'low', 'high'], defaultValue: 'auto', section: 'image' },
      
      // Analysis
      { key: 'analysisType', label: 'Type d\'analyse', type: 'select', options: ['describe', 'extract_text', 'analyze', 'compare', 'custom'], defaultValue: 'describe', section: 'analysis' },
      { key: 'customPrompt', label: 'Instructions personnalisées', type: 'textarea', placeholder: 'Décris cette image en détail...', section: 'analysis', expressionEnabled: true },
      { key: 'extractStructured', label: 'Extraction structurée', type: 'boolean', defaultValue: false, section: 'analysis' },
      { key: 'outputSchema', label: 'Schéma de sortie (JSON)', type: 'json', placeholder: '{"objects": [], "text": ""}', section: 'analysis', showWhen: { field: 'extractStructured', value: true } },
      
      // Parameters
      { key: 'temperature', label: 'Température', type: 'number', defaultValue: 0.3, section: 'parameters' },
      { key: 'maxTokens', label: 'Max Tokens', type: 'number', defaultValue: 1500, section: 'parameters' },
    ]
  },
  
  llm_embeddings: {
    name: 'Generate Embeddings',
    category: 'ai',
    color: 'from-teal-500 to-cyan-400',
    icon: 'Layers',
    description: 'Génération de vecteurs d\'embeddings',
    configFields: [
      // Model
      { key: 'provider', label: 'Provider', type: 'select', options: ['openai', 'google', 'cohere', 'custom'], defaultValue: 'openai', section: 'model' },
      { key: 'model', label: 'Modèle', type: 'select', options: [
        'text-embedding-3-small',
        'text-embedding-3-large',
        'text-embedding-ada-002'
      ], defaultValue: 'text-embedding-3-small', section: 'model' },
      { key: 'apiKey', label: 'API Key', type: 'password', required: true, section: 'model' },
      { key: 'customEndpoint', label: 'Endpoint personnalisé', type: 'text', section: 'model', showWhen: { field: 'provider', value: 'custom' } },
      
      // Input
      { key: 'inputField', label: 'Champ d\'entrée', type: 'text', placeholder: 'text', defaultValue: 'text', section: 'input', helpText: 'Champ contenant le texte à vectoriser' },
      { key: 'batchSize', label: 'Taille de batch', type: 'number', defaultValue: 100, section: 'input' },
      { key: 'dimensions', label: 'Dimensions', type: 'number', section: 'input', helpText: 'Laissez vide pour défaut du modèle' },
      
      // Output
      { key: 'outputField', label: 'Champ de sortie', type: 'text', defaultValue: 'embedding', section: 'output' },
      { key: 'normalize', label: 'Normaliser', type: 'boolean', defaultValue: true, section: 'output' },
    ]
  },

  // ===================================================================
  // LOGIC / CONTROL FLOW
  // ===================================================================
  
  condition: {
    name: 'Condition (If/Else)',
    category: 'logic',
    color: 'from-amber-500 to-yellow-400',
    icon: 'GitBranch',
    description: 'Branchement conditionnel If/Else',
    outputs: 2,
    allowMultipleOutputs: true,
    configFields: [
      // Condition Mode
      { key: 'conditionMode', label: 'Mode', type: 'select', options: ['simple', 'expression', 'code'], defaultValue: 'simple', section: 'condition' },
      
      // Simple mode
      { key: 'field', label: 'Champ à tester', type: 'text', placeholder: '{{ $input.status }}', section: 'condition', showWhen: { field: 'conditionMode', value: 'simple' }, expressionEnabled: true },
      { key: 'operator', label: 'Opérateur', type: 'select', options: [
        { value: 'eq', label: '= Égal' },
        { value: 'neq', label: '≠ Différent' },
        { value: 'gt', label: '> Supérieur' },
        { value: 'gte', label: '≥ Sup ou égal' },
        { value: 'lt', label: '< Inférieur' },
        { value: 'lte', label: '≤ Inf ou égal' },
        { value: 'contains', label: 'Contient' },
        { value: 'not_contains', label: 'Ne contient pas' },
        { value: 'starts_with', label: 'Commence par' },
        { value: 'ends_with', label: 'Finit par' },
        { value: 'matches', label: 'Regex match' },
        { value: 'is_empty', label: 'Est vide' },
        { value: 'is_not_empty', label: 'N\'est pas vide' },
        { value: 'is_null', label: 'Est null' },
        { value: 'is_true', label: 'Est true' },
        { value: 'is_false', label: 'Est false' },
      ], defaultValue: 'eq', section: 'condition', showWhen: { field: 'conditionMode', value: 'simple' } },
      { key: 'value', label: 'Valeur de comparaison', type: 'text', placeholder: 'approved', section: 'condition', showWhen: { field: 'conditionMode', value: 'simple' }, expressionEnabled: true },
      { key: 'caseSensitive', label: 'Sensible à la casse', type: 'boolean', defaultValue: false, section: 'condition', showWhen: { field: 'conditionMode', value: 'simple' } },
      
      // Expression mode
      { key: 'expression', label: 'Expression', type: 'textarea', placeholder: '{{ $input.amount > 1000 && $input.status === "pending" }}', section: 'condition', showWhen: { field: 'conditionMode', value: 'expression' }, helpText: 'Expression JavaScript retournant true/false' },
      
      // Code mode
      { key: 'code', label: 'Code JavaScript', type: 'code', placeholder: 'return input.amount > 1000;', section: 'condition', showWhen: { field: 'conditionMode', value: 'code' } },
      
      // Labels
      { key: 'trueLabel', label: 'Label branche True', type: 'text', defaultValue: 'True', section: 'labels' },
      { key: 'falseLabel', label: 'Label branche False', type: 'text', defaultValue: 'False', section: 'labels' },
    ]
  },
  
  switch: {
    name: 'Switch (Multi-branches)',
    category: 'logic',
    color: 'from-orange-500 to-amber-400',
    icon: 'GitFork',
    description: 'Branchement multi-voies',
    outputs: 4,
    allowMultipleOutputs: true,
    configFields: [
      // Mode
      { key: 'switchMode', label: 'Mode', type: 'select', options: ['value', 'rules', 'expression'], defaultValue: 'value', section: 'switch' },
      
      // Value mode
      { key: 'valueField', label: 'Champ à évaluer', type: 'text', placeholder: '{{ $input.type }}', section: 'switch', showWhen: { field: 'switchMode', value: 'value' }, expressionEnabled: true },
      { key: 'cases', label: 'Cas (JSON)', type: 'json', placeholder: '[{"value": "email", "output": 0}, {"value": "sms", "output": 1}]', section: 'switch', showWhen: { field: 'switchMode', value: 'value' } },
      
      // Rules mode
      { key: 'rules', label: 'Règles (JSON)', type: 'json', placeholder: '[{"condition": "$input.amount > 1000", "output": 0}, {"condition": "$input.priority === \'high\'", "output": 1}]', section: 'switch', showWhen: { field: 'switchMode', value: 'rules' }, helpText: 'Première règle vraie détermine la sortie' },
      
      // Default
      { key: 'defaultOutput', label: 'Sortie par défaut', type: 'number', defaultValue: 0, section: 'switch' },
      { key: 'fallthrough', label: 'Fallthrough (toutes les correspondances)', type: 'boolean', defaultValue: false, section: 'switch' },
      
      // Labels
      { key: 'outputLabels', label: 'Labels des sorties (JSON)', type: 'json', placeholder: '["Email", "SMS", "Push", "Default"]', section: 'labels' },
    ]
  },
  
  loop: {
    name: 'Loop (For Each)',
    category: 'logic',
    color: 'from-green-500 to-emerald-400',
    icon: 'Repeat',
    description: 'Boucle sur un tableau d\'items',
    configFields: [
      // Input
      { key: 'itemsField', label: 'Champ contenant les items', type: 'text', placeholder: '{{ $input.items }}', defaultValue: '{{ $input }}', section: 'loop', expressionEnabled: true },
      { key: 'batchSize', label: 'Taille de batch', type: 'number', defaultValue: 1, section: 'loop', helpText: '1 = séquentiel, >1 = parallèle par batches' },
      
      // Limits
      { key: 'maxIterations', label: 'Max itérations', type: 'number', defaultValue: 1000, section: 'limits' },
      { key: 'continueOnError', label: 'Continuer sur erreur', type: 'boolean', defaultValue: false, section: 'limits' },
      { key: 'timeout', label: 'Timeout par item (ms)', type: 'number', defaultValue: 30000, section: 'limits' },
      
      // Context
      { key: 'indexVariable', label: 'Nom variable index', type: 'text', defaultValue: '$index', section: 'context' },
      { key: 'itemVariable', label: 'Nom variable item', type: 'text', defaultValue: '$item', section: 'context' },
      
      // Output
      { key: 'collectResults', label: 'Collecter résultats', type: 'boolean', defaultValue: true, section: 'output' },
      { key: 'outputMode', label: 'Mode de sortie', type: 'select', options: ['array', 'last', 'first', 'aggregate'], defaultValue: 'array', section: 'output' },
    ]
  },
  
  loop_while: {
    name: 'Loop While',
    category: 'logic',
    color: 'from-lime-500 to-green-400',
    icon: 'RefreshCw',
    description: 'Boucle conditionnelle while',
    configFields: [
      // Condition
      { key: 'condition', label: 'Condition (continuer tant que vrai)', type: 'textarea', placeholder: '{{ $loopCount < 10 && !$result.done }}', section: 'condition', expressionEnabled: true },
      { key: 'checkBefore', label: 'Vérifier avant exécution', type: 'boolean', defaultValue: true, section: 'condition', helpText: 'false = do-while' },
      
      // Limits
      { key: 'maxIterations', label: 'Max itérations', type: 'number', defaultValue: 100, section: 'limits' },
      { key: 'timeout', label: 'Timeout total (ms)', type: 'number', defaultValue: 300000, section: 'limits' },
      
      // Delay
      { key: 'delayBetween', label: 'Délai entre itérations (ms)', type: 'number', defaultValue: 0, section: 'timing' },
      
      // Context
      { key: 'loopCountVariable', label: 'Variable compteur', type: 'text', defaultValue: '$loopCount', section: 'context' },
    ]
  },
  
  merge: {
    name: 'Merge',
    category: 'logic',
    color: 'from-indigo-500 to-blue-400',
    icon: 'GitMerge',
    description: 'Fusion de plusieurs branches',
    inputs: 4,
    configFields: [
      // Mode
      { key: 'mergeMode', label: 'Mode de fusion', type: 'select', options: [
        { value: 'wait_all', label: 'Attendre toutes les entrées' },
        { value: 'first', label: 'Première entrée' },
        { value: 'combine', label: 'Combiner les données' },
        { value: 'append', label: 'Concaténer les tableaux' },
        { value: 'by_key', label: 'Joindre par clé' },
      ], defaultValue: 'wait_all', section: 'merge' },
      
      // Combine options
      { key: 'combineStrategy', label: 'Stratégie de combinaison', type: 'select', options: ['merge', 'keep_first', 'keep_last', 'deep_merge'], defaultValue: 'merge', section: 'merge', showWhen: { field: 'mergeMode', value: 'combine' } },
      
      // Join by key
      { key: 'joinKey', label: 'Clé de jointure', type: 'text', placeholder: 'id', section: 'merge', showWhen: { field: 'mergeMode', value: 'by_key' } },
      { key: 'joinType', label: 'Type de jointure', type: 'select', options: ['inner', 'left', 'right', 'outer'], defaultValue: 'inner', section: 'merge', showWhen: { field: 'mergeMode', value: 'by_key' } },
      
      // Timeout
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 60000, section: 'timing' },
      { key: 'continueIfMissing', label: 'Continuer si entrée manquante', type: 'boolean', defaultValue: false, section: 'timing' },
    ]
  },
  
  split: {
    name: 'Split (Parallel)',
    category: 'logic',
    color: 'from-cyan-500 to-blue-400',
    icon: 'Share2',
    description: 'Exécution parallèle sur plusieurs branches',
    outputs: 4,
    allowMultipleOutputs: true,
    configFields: [
      // Mode
      { key: 'splitMode', label: 'Mode', type: 'select', options: [
        { value: 'clone', label: 'Cloner vers toutes les sorties' },
        { value: 'distribute', label: 'Distribuer les items' },
        { value: 'conditional', label: 'Conditionnel' },
      ], defaultValue: 'clone', section: 'split' },
      
      // Distribute
      { key: 'distributeField', label: 'Champ à distribuer', type: 'text', placeholder: '{{ $input.items }}', section: 'split', showWhen: { field: 'splitMode', value: 'distribute' }, expressionEnabled: true },
      { key: 'distributeStrategy', label: 'Stratégie', type: 'select', options: ['round_robin', 'random', 'by_index'], defaultValue: 'round_robin', section: 'split', showWhen: { field: 'splitMode', value: 'distribute' } },
      
      // Conditional
      { key: 'conditions', label: 'Conditions par sortie (JSON)', type: 'json', placeholder: '[{"output": 0, "condition": "$input.type === \'a\'"}, ...]', section: 'split', showWhen: { field: 'splitMode', value: 'conditional' } },
      
      // Labels
      { key: 'outputLabels', label: 'Labels des sorties', type: 'json', placeholder: '["Branch 1", "Branch 2", "Branch 3", "Branch 4"]', section: 'labels' },
    ]
  },
  
  wait: {
    name: 'Wait / Delay',
    category: 'logic',
    color: 'from-slate-500 to-gray-400',
    icon: 'Hourglass',
    description: 'Pause ou attente d\'un événement',
    configFields: [
      // Mode
      { key: 'waitMode', label: 'Mode', type: 'select', options: [
        { value: 'fixed', label: 'Délai fixe' },
        { value: 'until', label: 'Jusqu\'à date/heure' },
        { value: 'event', label: 'Attendre événement' },
        { value: 'webhook', label: 'Attendre webhook' },
      ], defaultValue: 'fixed', section: 'wait' },
      
      // Fixed delay
      { key: 'delayValue', label: 'Durée', type: 'number', defaultValue: 5, section: 'wait', showWhen: { field: 'waitMode', value: 'fixed' } },
      { key: 'delayUnit', label: 'Unité', type: 'select', options: ['milliseconds', 'seconds', 'minutes', 'hours', 'days'], defaultValue: 'seconds', section: 'wait', showWhen: { field: 'waitMode', value: 'fixed' } },
      
      // Until
      { key: 'untilDate', label: 'Date/Heure', type: 'text', placeholder: '{{ $input.scheduledAt }}', section: 'wait', showWhen: { field: 'waitMode', value: 'until' }, expressionEnabled: true },
      
      // Event
      { key: 'eventName', label: 'Nom événement', type: 'text', placeholder: 'user_confirmed', section: 'wait', showWhen: { field: 'waitMode', value: 'event' } },
      
      // Webhook
      { key: 'webhookPath', label: 'Chemin webhook', type: 'text', placeholder: '/continue', section: 'wait', showWhen: { field: 'waitMode', value: 'webhook' } },
      
      // Timeout
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 86400000, section: 'timeout', helpText: '24h par défaut' },
      { key: 'onTimeout', label: 'Action timeout', type: 'select', options: ['error', 'continue', 'skip'], defaultValue: 'error', section: 'timeout' },
    ]
  },
  
  error_handler: {
    name: 'Error Handler',
    category: 'logic',
    color: 'from-red-500 to-rose-400',
    icon: 'AlertTriangle',
    description: 'Gestion des erreurs try/catch',
    outputs: 2,
    allowMultipleOutputs: true,
    configFields: [
      // Behavior
      { key: 'catchAll', label: 'Attraper toutes les erreurs', type: 'boolean', defaultValue: true, section: 'behavior' },
      { key: 'errorTypes', label: 'Types d\'erreurs (JSON)', type: 'json', placeholder: '["NetworkError", "ValidationError"]', section: 'behavior', showWhen: { field: 'catchAll', value: false } },
      
      // Retry
      { key: 'retryEnabled', label: 'Retry automatique', type: 'boolean', defaultValue: false, section: 'retry' },
      { key: 'maxRetries', label: 'Max retries', type: 'number', defaultValue: 3, section: 'retry', showWhen: { field: 'retryEnabled', value: true } },
      { key: 'retryDelay', label: 'Délai entre retries (ms)', type: 'number', defaultValue: 1000, section: 'retry', showWhen: { field: 'retryEnabled', value: true } },
      { key: 'retryBackoff', label: 'Backoff exponentiel', type: 'boolean', defaultValue: true, section: 'retry', showWhen: { field: 'retryEnabled', value: true } },
      
      // Fallback
      { key: 'fallbackValue', label: 'Valeur de fallback (JSON)', type: 'json', placeholder: '{"status": "failed"}', section: 'fallback' },
      
      // Logging
      { key: 'logError', label: 'Logger l\'erreur', type: 'boolean', defaultValue: true, section: 'logging' },
      { key: 'includeStack', label: 'Inclure stack trace', type: 'boolean', defaultValue: false, section: 'logging' },
      
      // Labels
      { key: 'successLabel', label: 'Label succès', type: 'text', defaultValue: 'Success', section: 'labels' },
      { key: 'errorLabel', label: 'Label erreur', type: 'text', defaultValue: 'Error', section: 'labels' },
    ]
  },
  
  stop: {
    name: 'Stop Workflow',
    category: 'logic',
    color: 'from-gray-600 to-gray-500',
    icon: 'StopCircle',
    description: 'Arrêter l\'exécution du workflow',
    outputs: 0,
    configFields: [
      // Status
      { key: 'exitStatus', label: 'Statut de sortie', type: 'select', options: ['success', 'error', 'cancelled'], defaultValue: 'success', section: 'exit' },
      { key: 'exitMessage', label: 'Message', type: 'text', placeholder: 'Workflow terminé', section: 'exit', expressionEnabled: true },
      
      // Output
      { key: 'outputData', label: 'Données de sortie (JSON)', type: 'json', placeholder: '{"result": "{{ $input }}"}', section: 'output', expressionEnabled: true },
    ]
  },

  // ===================================================================
  // DATA TRANSFORM
  // ===================================================================
  
  set_variable: {
    name: 'Set Variable',
    category: 'transform',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Variable',
    description: 'Définir ou modifier des variables',
    configFields: [
      // Mode
      { key: 'mode', label: 'Mode', type: 'select', options: ['single', 'multiple', 'json'], defaultValue: 'single', section: 'variable' },
      
      // Single
      { key: 'variableName', label: 'Nom de la variable', type: 'text', placeholder: 'myVariable', section: 'variable', showWhen: { field: 'mode', value: 'single' } },
      { key: 'variableValue', label: 'Valeur', type: 'textarea', placeholder: '{{ $input.field }}', section: 'variable', showWhen: { field: 'mode', value: 'single' }, expressionEnabled: true },
      { key: 'variableType', label: 'Type', type: 'select', options: ['auto', 'string', 'number', 'boolean', 'array', 'object'], defaultValue: 'auto', section: 'variable', showWhen: { field: 'mode', value: 'single' } },
      
      // Multiple
      { key: 'variables', label: 'Variables (JSON)', type: 'json', placeholder: '{"var1": "{{ $input.a }}", "var2": 123}', section: 'variable', showWhen: { field: 'mode', value: 'multiple' }, expressionEnabled: true },
      
      // JSON mode
      { key: 'jsonExpression', label: 'Expression JSON', type: 'code', placeholder: '{\n  "processed": $input.data,\n  "timestamp": new Date().toISOString()\n}', section: 'variable', showWhen: { field: 'mode', value: 'json' } },
      
      // Scope
      { key: 'scope', label: 'Portée', type: 'select', options: ['workflow', 'local', 'global'], defaultValue: 'workflow', section: 'scope' },
    ]
  },
  
  code_js: {
    name: 'JavaScript Code',
    category: 'transform',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Code',
    description: 'Code JavaScript personnalisé',
    configFields: [
      // Code
      { key: 'code', label: 'Code', type: 'code', placeholder: '// Variables disponibles: input, $, helpers\n// Retournez le résultat avec return\n\nconst result = input.data.map(item => ({\n  ...item,\n  processed: true\n}));\n\nreturn result;', required: true, section: 'code' },
      
      // Mode
      { key: 'executionMode', label: 'Mode', type: 'select', options: ['sync', 'async'], defaultValue: 'sync', section: 'execution' },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'execution' },
      
      // Helpers
      { key: 'includeHelpers', label: 'Inclure helpers (lodash, dayjs...)', type: 'boolean', defaultValue: true, section: 'helpers' },
      { key: 'customHelpers', label: 'Helpers personnalisés (JSON)', type: 'json', placeholder: '{"myHelper": "code..."}', section: 'helpers' },
      
      // Error handling
      { key: 'errorBehavior', label: 'En cas d\'erreur', type: 'select', options: ['throw', 'return_null', 'return_empty', 'continue'], defaultValue: 'throw', section: 'errors' },
    ]
  },
  
  json_parse: {
    name: 'JSON Parse',
    category: 'transform',
    color: 'from-emerald-500 to-green-400',
    icon: 'FileJson',
    description: 'Parser une chaîne JSON',
    configFields: [
      { key: 'inputField', label: 'Champ d\'entrée', type: 'text', placeholder: '{{ $input.jsonString }}', section: 'parse', expressionEnabled: true },
      { key: 'outputField', label: 'Champ de sortie', type: 'text', defaultValue: 'parsed', section: 'parse' },
      { key: 'strict', label: 'Mode strict', type: 'boolean', defaultValue: true, section: 'parse' },
      { key: 'fallbackValue', label: 'Valeur par défaut si erreur', type: 'json', placeholder: '{}', section: 'parse' },
    ]
  },
  
  json_stringify: {
    name: 'JSON Stringify',
    category: 'transform',
    color: 'from-teal-500 to-emerald-400',
    icon: 'FileJson2',
    description: 'Convertir en chaîne JSON',
    configFields: [
      { key: 'inputField', label: 'Champ d\'entrée', type: 'text', placeholder: '{{ $input.data }}', section: 'stringify', expressionEnabled: true },
      { key: 'outputField', label: 'Champ de sortie', type: 'text', defaultValue: 'json', section: 'stringify' },
      { key: 'pretty', label: 'Formatage lisible', type: 'boolean', defaultValue: false, section: 'stringify' },
      { key: 'indent', label: 'Indentation', type: 'number', defaultValue: 2, section: 'stringify', showWhen: { field: 'pretty', value: true } },
    ]
  },
  
  filter: {
    name: 'Filter Items',
    category: 'transform',
    color: 'from-orange-500 to-amber-400',
    icon: 'Filter',
    description: 'Filtrer un tableau selon une condition',
    configFields: [
      // Mode
      { key: 'filterMode', label: 'Mode', type: 'select', options: ['simple', 'expression', 'code'], defaultValue: 'simple', section: 'filter' },
      
      // Simple
      { key: 'field', label: 'Champ', type: 'text', placeholder: 'status', section: 'filter', showWhen: { field: 'filterMode', value: 'simple' } },
      { key: 'operator', label: 'Opérateur', type: 'select', options: [
        { value: 'eq', label: '= Égal' },
        { value: 'neq', label: '≠ Différent' },
        { value: 'gt', label: '> Supérieur' },
        { value: 'gte', label: '≥ Sup ou égal' },
        { value: 'lt', label: '< Inférieur' },
        { value: 'lte', label: '≤ Inf ou égal' },
        { value: 'contains', label: 'Contient' },
        { value: 'in', label: 'Dans la liste' },
        { value: 'not_in', label: 'Pas dans la liste' },
        { value: 'is_empty', label: 'Est vide' },
        { value: 'is_not_empty', label: 'N\'est pas vide' },
      ], defaultValue: 'eq', section: 'filter', showWhen: { field: 'filterMode', value: 'simple' } },
      { key: 'value', label: 'Valeur', type: 'text', section: 'filter', showWhen: { field: 'filterMode', value: 'simple' }, expressionEnabled: true },
      
      // Expression
      { key: 'filterExpression', label: 'Expression', type: 'textarea', placeholder: 'item.amount > 100 && item.status === "active"', section: 'filter', showWhen: { field: 'filterMode', value: 'expression' } },
      
      // Code
      { key: 'filterCode', label: 'Code (item => boolean)', type: 'code', placeholder: 'return item.score >= 80;', section: 'filter', showWhen: { field: 'filterMode', value: 'code' } },
      
      // Input/Output
      { key: 'inputField', label: 'Tableau d\'entrée', type: 'text', defaultValue: '{{ $input }}', section: 'io', expressionEnabled: true },
      { key: 'keepFiltered', label: 'Garder les filtrés (2e sortie)', type: 'boolean', defaultValue: false, section: 'io' },
    ],
    outputs: 2,
    allowMultipleOutputs: true
  },
  
  map: {
    name: 'Map / Transform',
    category: 'transform',
    color: 'from-purple-500 to-violet-400',
    icon: 'Shuffle',
    description: 'Transformer chaque item d\'un tableau',
    configFields: [
      // Mode
      { key: 'mapMode', label: 'Mode', type: 'select', options: ['fields', 'expression', 'code'], defaultValue: 'fields', section: 'map' },
      
      // Fields mode
      { key: 'fieldMappings', label: 'Mappings (JSON)', type: 'json', placeholder: '{\n  "newField": "{{ item.oldField }}",\n  "computed": "{{ item.a + item.b }}"\n}', section: 'map', showWhen: { field: 'mapMode', value: 'fields' }, expressionEnabled: true },
      { key: 'keepOriginal', label: 'Conserver champs originaux', type: 'boolean', defaultValue: false, section: 'map', showWhen: { field: 'mapMode', value: 'fields' } },
      
      // Expression
      { key: 'mapExpression', label: 'Expression', type: 'textarea', placeholder: '{ ...item, processed: true, score: item.value * 2 }', section: 'map', showWhen: { field: 'mapMode', value: 'expression' } },
      
      // Code
      { key: 'mapCode', label: 'Code (item, index => result)', type: 'code', placeholder: 'return {\n  ...item,\n  index,\n  processed: true\n};', section: 'map', showWhen: { field: 'mapMode', value: 'code' } },
      
      // Input
      { key: 'inputField', label: 'Tableau d\'entrée', type: 'text', defaultValue: '{{ $input }}', section: 'io', expressionEnabled: true },
    ]
  },
  
  aggregate: {
    name: 'Aggregate',
    category: 'transform',
    color: 'from-indigo-500 to-purple-400',
    icon: 'BarChart3',
    description: 'Agréger des données (sum, avg, count...)',
    configFields: [
      // Operation
      { key: 'operation', label: 'Opération', type: 'select', options: [
        { value: 'count', label: 'Compter' },
        { value: 'sum', label: 'Somme' },
        { value: 'avg', label: 'Moyenne' },
        { value: 'min', label: 'Minimum' },
        { value: 'max', label: 'Maximum' },
        { value: 'first', label: 'Premier' },
        { value: 'last', label: 'Dernier' },
        { value: 'concat', label: 'Concaténer' },
        { value: 'unique', label: 'Valeurs uniques' },
        { value: 'group_by', label: 'Grouper par' },
        { value: 'custom', label: 'Personnalisé' },
      ], defaultValue: 'count', section: 'aggregate' },
      
      // Field
      { key: 'field', label: 'Champ à agréger', type: 'text', placeholder: 'amount', section: 'aggregate' },
      
      // Group by
      { key: 'groupByField', label: 'Grouper par', type: 'text', placeholder: 'category', section: 'aggregate', showWhen: { field: 'operation', value: 'group_by' } },
      { key: 'groupAggregation', label: 'Agrégation par groupe', type: 'select', options: ['count', 'sum', 'avg', 'list'], defaultValue: 'count', section: 'aggregate', showWhen: { field: 'operation', value: 'group_by' } },
      
      // Custom
      { key: 'reducer', label: 'Reducer (acc, item => acc)', type: 'code', placeholder: 'return acc + item.value;', section: 'aggregate', showWhen: { field: 'operation', value: 'custom' } },
      { key: 'initialValue', label: 'Valeur initiale', type: 'json', placeholder: '0', section: 'aggregate', showWhen: { field: 'operation', value: 'custom' } },
      
      // Input
      { key: 'inputField', label: 'Tableau d\'entrée', type: 'text', defaultValue: '{{ $input }}', section: 'io', expressionEnabled: true },
      { key: 'outputField', label: 'Nom du résultat', type: 'text', defaultValue: 'result', section: 'io' },
    ]
  },
  
  sort: {
    name: 'Sort',
    category: 'transform',
    color: 'from-sky-500 to-cyan-400',
    icon: 'ArrowUpDown',
    description: 'Trier un tableau',
    configFields: [
      // Sort field
      { key: 'sortField', label: 'Champ de tri', type: 'text', placeholder: 'date', section: 'sort' },
      { key: 'sortOrder', label: 'Ordre', type: 'select', options: ['asc', 'desc'], defaultValue: 'asc', section: 'sort' },
      { key: 'sortType', label: 'Type', type: 'select', options: ['auto', 'string', 'number', 'date'], defaultValue: 'auto', section: 'sort' },
      
      // Multiple
      { key: 'multipleFields', label: 'Tri multiple', type: 'boolean', defaultValue: false, section: 'sort' },
      { key: 'sortFields', label: 'Champs de tri (JSON)', type: 'json', placeholder: '[{"field": "date", "order": "desc"}, {"field": "name", "order": "asc"}]', section: 'sort', showWhen: { field: 'multipleFields', value: true } },
      
      // Custom
      { key: 'customComparator', label: 'Comparateur personnalisé', type: 'code', placeholder: 'return a.value - b.value;', section: 'sort', advanced: true },
      
      // Input
      { key: 'inputField', label: 'Tableau d\'entrée', type: 'text', defaultValue: '{{ $input }}', section: 'io', expressionEnabled: true },
    ]
  },
  
  limit: {
    name: 'Limit / Slice',
    category: 'transform',
    color: 'from-rose-500 to-pink-400',
    icon: 'Scissors',
    description: 'Limiter le nombre d\'items',
    configFields: [
      // Limit
      { key: 'limit', label: 'Limite', type: 'number', defaultValue: 10, section: 'limit' },
      { key: 'offset', label: 'Offset (skip)', type: 'number', defaultValue: 0, section: 'limit' },
      
      // Mode
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { value: 'first', label: 'Premiers N' },
        { value: 'last', label: 'Derniers N' },
        { value: 'random', label: 'N aléatoires' },
        { value: 'slice', label: 'Slice (offset + limit)' },
      ], defaultValue: 'first', section: 'limit' },
      
      // Input
      { key: 'inputField', label: 'Tableau d\'entrée', type: 'text', defaultValue: '{{ $input }}', section: 'io', expressionEnabled: true },
    ]
  },
  
  merge_data: {
    name: 'Merge Data',
    category: 'transform',
    color: 'from-violet-500 to-purple-400',
    icon: 'Merge',
    description: 'Fusionner des objets ou tableaux',
    configFields: [
      // Mode
      { key: 'mergeMode', label: 'Mode', type: 'select', options: [
        { value: 'shallow', label: 'Fusion superficielle' },
        { value: 'deep', label: 'Fusion profonde' },
        { value: 'concat', label: 'Concaténer tableaux' },
        { value: 'zip', label: 'Zip (combiner par index)' },
      ], defaultValue: 'shallow', section: 'merge' },
      
      // Sources
      { key: 'source1', label: 'Source 1', type: 'textarea', placeholder: '{{ $input.data1 }}', section: 'sources', expressionEnabled: true },
      { key: 'source2', label: 'Source 2', type: 'textarea', placeholder: '{{ $input.data2 }}', section: 'sources', expressionEnabled: true },
      { key: 'additionalSources', label: 'Sources additionnelles (JSON array)', type: 'json', placeholder: '["{{ $input.data3 }}"]', section: 'sources' },
      
      // Conflict resolution
      { key: 'conflictResolution', label: 'En cas de conflit', type: 'select', options: ['last_wins', 'first_wins', 'keep_both', 'error'], defaultValue: 'last_wins', section: 'options' },
    ]
  },
  
  split_text: {
    name: 'Split Text',
    category: 'transform',
    color: 'from-amber-500 to-yellow-400',
    icon: 'SplitSquareVertical',
    description: 'Découper du texte en morceaux',
    configFields: [
      // Mode
      { key: 'splitMode', label: 'Mode', type: 'select', options: [
        { value: 'delimiter', label: 'Par délimiteur' },
        { value: 'regex', label: 'Par regex' },
        { value: 'lines', label: 'Par lignes' },
        { value: 'chunks', label: 'Par chunks (taille fixe)' },
        { value: 'sentences', label: 'Par phrases' },
        { value: 'paragraphs', label: 'Par paragraphes' },
      ], defaultValue: 'delimiter', section: 'split' },
      
      // Delimiter
      { key: 'delimiter', label: 'Délimiteur', type: 'text', placeholder: ',', section: 'split', showWhen: { field: 'splitMode', value: 'delimiter' } },
      { key: 'regex', label: 'Expression régulière', type: 'text', placeholder: '\\s+', section: 'split', showWhen: { field: 'splitMode', value: 'regex' } },
      { key: 'chunkSize', label: 'Taille des chunks', type: 'number', defaultValue: 1000, section: 'split', showWhen: { field: 'splitMode', value: 'chunks' } },
      { key: 'chunkOverlap', label: 'Chevauchement', type: 'number', defaultValue: 100, section: 'split', showWhen: { field: 'splitMode', value: 'chunks' } },
      
      // Options
      { key: 'trimParts', label: 'Trim les parties', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'removeEmpty', label: 'Supprimer les vides', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'maxParts', label: 'Max parties', type: 'number', section: 'options' },
      
      // Input
      { key: 'inputField', label: 'Texte d\'entrée', type: 'text', defaultValue: '{{ $input.text }}', section: 'io', expressionEnabled: true },
    ]
  },
  
  template: {
    name: 'Template',
    category: 'transform',
    color: 'from-green-500 to-teal-400',
    icon: 'FileCode',
    description: 'Générer du texte avec un template',
    configFields: [
      // Template
      { key: 'template', label: 'Template', type: 'textarea', placeholder: 'Bonjour {{ name }},\n\nVotre commande #{{ orderId }} a été expédiée.', required: true, section: 'template', expressionEnabled: true },
      
      // Format
      { key: 'outputFormat', label: 'Format de sortie', type: 'select', options: ['text', 'html', 'markdown', 'json'], defaultValue: 'text', section: 'format' },
      
      // Engine
      { key: 'templateEngine', label: 'Moteur', type: 'select', options: ['simple', 'handlebars', 'ejs'], defaultValue: 'simple', section: 'format', helpText: 'simple = {{ var }}, handlebars = plus avancé' },
      
      // Variables
      { key: 'variables', label: 'Variables additionnelles (JSON)', type: 'json', placeholder: '{"company": "AETHER"}', section: 'variables' },
    ]
  },
  
  date_time: {
    name: 'Date / Time',
    category: 'transform',
    color: 'from-blue-500 to-sky-400',
    icon: 'Calendar',
    description: 'Manipulation de dates et heures',
    configFields: [
      // Operation
      { key: 'operation', label: 'Opération', type: 'select', options: [
        { value: 'now', label: 'Date actuelle' },
        { value: 'parse', label: 'Parser une date' },
        { value: 'format', label: 'Formater une date' },
        { value: 'add', label: 'Ajouter du temps' },
        { value: 'subtract', label: 'Soustraire du temps' },
        { value: 'diff', label: 'Différence entre dates' },
        { value: 'start_of', label: 'Début de période' },
        { value: 'end_of', label: 'Fin de période' },
      ], defaultValue: 'now', section: 'operation' },
      
      // Input
      { key: 'inputDate', label: 'Date d\'entrée', type: 'text', placeholder: '{{ $input.date }}', section: 'input', expressionEnabled: true },
      { key: 'inputFormat', label: 'Format d\'entrée', type: 'text', placeholder: 'YYYY-MM-DD', section: 'input' },
      
      // Add/Subtract
      { key: 'amount', label: 'Quantité', type: 'number', defaultValue: 1, section: 'operation' },
      { key: 'unit', label: 'Unité', type: 'select', options: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'], defaultValue: 'days', section: 'operation' },
      
      // Format output
      { key: 'outputFormat', label: 'Format de sortie', type: 'text', placeholder: 'DD/MM/YYYY HH:mm', section: 'output' },
      
      // Timezone
      { key: 'timezone', label: 'Fuseau horaire', type: 'select', options: ['UTC', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo', 'local'], defaultValue: 'UTC', section: 'timezone' },
    ]
  },
  
  crypto: {
    name: 'Crypto / Hash',
    category: 'transform',
    color: 'from-gray-600 to-gray-500',
    icon: 'Lock',
    description: 'Hachage, chiffrement, signatures',
    configFields: [
      // Operation
      { key: 'operation', label: 'Opération', type: 'select', options: [
        { value: 'hash', label: 'Hash (MD5, SHA...)' },
        { value: 'hmac', label: 'HMAC' },
        { value: 'encrypt', label: 'Chiffrer (AES)' },
        { value: 'decrypt', label: 'Déchiffrer' },
        { value: 'random', label: 'Générer aléatoire' },
        { value: 'uuid', label: 'Générer UUID' },
      ], defaultValue: 'hash', section: 'crypto' },
      
      // Hash
      { key: 'algorithm', label: 'Algorithme', type: 'select', options: ['md5', 'sha1', 'sha256', 'sha512'], defaultValue: 'sha256', section: 'crypto' },
      
      // Input
      { key: 'inputData', label: 'Données', type: 'textarea', placeholder: '{{ $input.data }}', section: 'input', expressionEnabled: true },
      
      // Key (for HMAC/Encrypt)
      { key: 'secretKey', label: 'Clé secrète', type: 'password', section: 'crypto' },
      
      // Random
      { key: 'randomLength', label: 'Longueur', type: 'number', defaultValue: 32, section: 'crypto', showWhen: { field: 'operation', value: 'random' } },
      { key: 'randomEncoding', label: 'Encodage', type: 'select', options: ['hex', 'base64', 'alphanumeric'], defaultValue: 'hex', section: 'crypto', showWhen: { field: 'operation', value: 'random' } },
    ]
  },
  
  base64: {
    name: 'Base64 Encode/Decode',
    category: 'transform',
    color: 'from-slate-500 to-gray-400',
    icon: 'Binary',
    description: 'Encodage et décodage Base64',
    configFields: [
      { key: 'operation', label: 'Opération', type: 'select', options: ['encode', 'decode'], defaultValue: 'encode', section: 'base64' },
      { key: 'inputData', label: 'Données', type: 'textarea', placeholder: '{{ $input.data }}', section: 'input', expressionEnabled: true },
      { key: 'urlSafe', label: 'URL-safe', type: 'boolean', defaultValue: false, section: 'options' },
    ]
  },

  // ===================================================================
  // HTTP / API
  // ===================================================================
  
  http_request: {
    name: 'HTTP Request',
    category: 'http',
    color: 'from-orange-500 to-red-400',
    icon: 'Globe',
    description: 'Requête HTTP vers une API externe',
    isRealAction: true,
    configFields: [
      // URL & Method
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint', required: true, section: 'request', expressionEnabled: true },
      { key: 'method', label: 'Méthode', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], defaultValue: 'GET', section: 'request' },
      
      // Headers
      { key: 'headers', label: 'Headers (JSON)', type: 'json', placeholder: '{"Content-Type": "application/json", "Authorization": "Bearer {{ $env.API_KEY }}"}', section: 'headers', expressionEnabled: true },
      { key: 'contentType', label: 'Content-Type', type: 'select', options: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'custom'], defaultValue: 'application/json', section: 'headers' },
      
      // Body
      { key: 'bodyType', label: 'Type de body', type: 'select', options: ['none', 'json', 'form', 'raw', 'binary'], defaultValue: 'json', section: 'body' },
      { key: 'body', label: 'Body', type: 'json', placeholder: '{"key": "{{ $input.value }}"}', section: 'body', showWhen: { field: 'bodyType', value: 'json' }, expressionEnabled: true },
      { key: 'formData', label: 'Form Data (JSON)', type: 'json', placeholder: '{"field1": "value1"}', section: 'body', showWhen: { field: 'bodyType', value: 'form' }, expressionEnabled: true },
      { key: 'rawBody', label: 'Raw Body', type: 'textarea', section: 'body', showWhen: { field: 'bodyType', value: 'raw' }, expressionEnabled: true },
      
      // Query params
      { key: 'queryParams', label: 'Query Parameters (JSON)', type: 'json', placeholder: '{"page": 1, "limit": 10}', section: 'query', expressionEnabled: true },
      
      // Auth
      { key: 'authType', label: 'Authentification', type: 'select', options: ['none', 'basic', 'bearer', 'api_key', 'oauth2'], defaultValue: 'none', section: 'auth' },
      { key: 'authToken', label: 'Token / API Key', type: 'password', section: 'auth', showWhen: { field: 'authType', notValue: 'none' }, expressionEnabled: true },
      { key: 'authUsername', label: 'Username', type: 'text', section: 'auth', showWhen: { field: 'authType', value: 'basic' } },
      { key: 'authPassword', label: 'Password', type: 'password', section: 'auth', showWhen: { field: 'authType', value: 'basic' } },
      { key: 'apiKeyHeader', label: 'Header name', type: 'text', placeholder: 'X-API-Key', section: 'auth', showWhen: { field: 'authType', value: 'api_key' } },
      
      // Response
      { key: 'responseType', label: 'Type de réponse', type: 'select', options: ['auto', 'json', 'text', 'binary', 'stream'], defaultValue: 'auto', section: 'response' },
      { key: 'fullResponse', label: 'Réponse complète (headers, status)', type: 'boolean', defaultValue: false, section: 'response' },
      
      // Error handling
      { key: 'throwOnError', label: 'Erreur sur status >= 400', type: 'boolean', defaultValue: true, section: 'errors' },
      { key: 'allowedStatusCodes', label: 'Status codes autorisés', type: 'text', placeholder: '200,201,204', section: 'errors' },
      
      // Timeout & Retry
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'timeout' },
      { key: 'retries', label: 'Retries', type: 'number', defaultValue: 0, section: 'timeout' },
      { key: 'retryDelay', label: 'Délai retry (ms)', type: 'number', defaultValue: 1000, section: 'timeout' },
      
      // Proxy
      { key: 'proxyUrl', label: 'Proxy URL', type: 'text', section: 'proxy', advanced: true },
      
      // SSL
      { key: 'rejectUnauthorized', label: 'Vérifier SSL', type: 'boolean', defaultValue: true, section: 'ssl', advanced: true },
    ]
  },
  
  http_response: {
    name: 'HTTP Response',
    category: 'http',
    color: 'from-green-500 to-emerald-400',
    icon: 'ArrowRightLeft',
    description: 'Réponse HTTP pour webhook',
    outputs: 0,
    configFields: [
      // Status
      { key: 'statusCode', label: 'Status Code', type: 'number', defaultValue: 200, section: 'response' },
      
      // Headers
      { key: 'headers', label: 'Headers (JSON)', type: 'json', placeholder: '{"Content-Type": "application/json"}', section: 'response' },
      
      // Body
      { key: 'bodyType', label: 'Type de body', type: 'select', options: ['json', 'text', 'html', 'binary', 'stream'], defaultValue: 'json', section: 'body' },
      { key: 'body', label: 'Body', type: 'json', placeholder: '{"success": true, "data": {{ $input }}}', section: 'body', expressionEnabled: true },
    ]
  },
  
  graphql: {
    name: 'GraphQL Request',
    category: 'http',
    color: 'from-pink-500 to-rose-400',
    icon: 'Braces',
    description: 'Requête GraphQL',
    isRealAction: true,
    configFields: [
      // Endpoint
      { key: 'endpoint', label: 'Endpoint GraphQL', type: 'text', placeholder: 'https://api.example.com/graphql', required: true, section: 'graphql', expressionEnabled: true },
      
      // Query
      { key: 'operationType', label: 'Type', type: 'select', options: ['query', 'mutation', 'subscription'], defaultValue: 'query', section: 'graphql' },
      { key: 'query', label: 'Query', type: 'code', placeholder: 'query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n  }\n}', required: true, section: 'graphql' },
      { key: 'variables', label: 'Variables (JSON)', type: 'json', placeholder: '{"id": "{{ $input.userId }}"}', section: 'graphql', expressionEnabled: true },
      { key: 'operationName', label: 'Operation Name', type: 'text', section: 'graphql' },
      
      // Headers
      { key: 'headers', label: 'Headers', type: 'json', placeholder: '{"Authorization": "Bearer ..."}', section: 'auth', expressionEnabled: true },
      
      // Options
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'options' },
    ]
  },
  
  soap: {
    name: 'SOAP Request',
    category: 'http',
    color: 'from-gray-600 to-gray-500',
    icon: 'FileCode',
    description: 'Appel SOAP/WSDL',
    isRealAction: true,
    configFields: [
      // WSDL
      { key: 'wsdlUrl', label: 'URL WSDL', type: 'text', placeholder: 'https://service.example.com?wsdl', required: true, section: 'soap' },
      { key: 'operation', label: 'Opération', type: 'text', placeholder: 'GetData', required: true, section: 'soap' },
      
      // Parameters
      { key: 'parameters', label: 'Paramètres (JSON)', type: 'json', placeholder: '{"param1": "value1"}', section: 'soap', expressionEnabled: true },
      
      // Headers
      { key: 'soapHeaders', label: 'SOAP Headers (JSON)', type: 'json', section: 'soap' },
      
      // Auth
      { key: 'username', label: 'Username (WS-Security)', type: 'text', section: 'auth' },
      { key: 'password', label: 'Password', type: 'password', section: 'auth' },
    ]
  },
  
  websocket: {
    name: 'WebSocket',
    category: 'http',
    color: 'from-indigo-500 to-blue-400',
    icon: 'Radio',
    description: 'Communication WebSocket',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'wsUrl', label: 'WebSocket URL', type: 'text', placeholder: 'wss://socket.example.com', required: true, section: 'connection', expressionEnabled: true },
      
      // Mode
      { key: 'mode', label: 'Mode', type: 'select', options: ['send', 'receive', 'send_receive'], defaultValue: 'send', section: 'mode' },
      
      // Message
      { key: 'message', label: 'Message à envoyer', type: 'json', placeholder: '{"type": "subscribe", "channel": "updates"}', section: 'message', expressionEnabled: true },
      
      // Receive
      { key: 'waitForMessage', label: 'Attendre une réponse', type: 'boolean', defaultValue: false, section: 'receive' },
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'receive' },
      { key: 'messageFilter', label: 'Filtre message (expression)', type: 'text', placeholder: 'msg.type === "response"', section: 'receive' },
      
      // Headers
      { key: 'headers', label: 'Headers', type: 'json', section: 'headers' },
    ]
  },

  // ===================================================================
  // EMAIL
  // ===================================================================
  
  email_imap: {
    name: 'Email IMAP',
    category: 'email',
    color: 'from-blue-500 to-indigo-400',
    icon: 'Inbox',
    description: 'Lire des emails via IMAP',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      // Server
      { key: 'host', label: 'Serveur IMAP', type: 'text', placeholder: 'imap.gmail.com', required: true, section: 'server' },
      { key: 'port', label: 'Port', type: 'number', defaultValue: 993, section: 'server' },
      { key: 'secure', label: 'SSL/TLS', type: 'boolean', defaultValue: true, section: 'server' },
      
      // Auth
      { key: 'username', label: 'Email / Username', type: 'text', required: true, section: 'auth' },
      { key: 'password', label: 'Password / App Password', type: 'password', required: true, section: 'auth' },
      
      // Folder
      { key: 'folder', label: 'Dossier', type: 'text', defaultValue: 'INBOX', section: 'folder' },
      
      // Filters
      { key: 'unreadOnly', label: 'Non lus uniquement', type: 'boolean', defaultValue: true, section: 'filters' },
      { key: 'since', label: 'Depuis (date)', type: 'text', placeholder: '{{ $now.subtract(7, "days") }}', section: 'filters', expressionEnabled: true },
      { key: 'from', label: 'De (expéditeur)', type: 'text', section: 'filters', expressionEnabled: true },
      { key: 'subject', label: 'Sujet (contient)', type: 'text', section: 'filters', expressionEnabled: true },
      { key: 'searchQuery', label: 'Recherche IMAP', type: 'text', placeholder: 'FROM "boss@company.com" SUBJECT "urgent"', section: 'filters', helpText: 'Syntaxe IMAP SEARCH' },
      
      // Options
      { key: 'limit', label: 'Limite', type: 'number', defaultValue: 10, section: 'options' },
      { key: 'markAsRead', label: 'Marquer comme lu', type: 'boolean', defaultValue: false, section: 'options' },
      { key: 'includeAttachments', label: 'Inclure pièces jointes', type: 'boolean', defaultValue: false, section: 'options' },
      { key: 'bodyFormat', label: 'Format du corps', type: 'select', options: ['text', 'html', 'both'], defaultValue: 'text', section: 'options' },
    ]
  },
  
  email_smtp: {
    name: 'Email SMTP',
    category: 'email',
    color: 'from-red-500 to-orange-400',
    icon: 'Send',
    description: 'Envoyer un email via SMTP',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      // Server
      { key: 'host', label: 'Serveur SMTP', type: 'text', placeholder: 'smtp.gmail.com', required: true, section: 'server' },
      { key: 'port', label: 'Port', type: 'number', defaultValue: 587, section: 'server' },
      { key: 'secure', label: 'SSL/TLS', type: 'boolean', defaultValue: false, section: 'server' },
      { key: 'requireTLS', label: 'STARTTLS', type: 'boolean', defaultValue: true, section: 'server' },
      
      // Auth
      { key: 'username', label: 'Username', type: 'text', required: true, section: 'auth' },
      { key: 'password', label: 'Password', type: 'password', required: true, section: 'auth' },
      
      // Message
      { key: 'from', label: 'De', type: 'text', placeholder: 'you@example.com', required: true, section: 'message', expressionEnabled: true },
      { key: 'fromName', label: 'Nom expéditeur', type: 'text', section: 'message', expressionEnabled: true },
      { key: 'to', label: 'À', type: 'text', placeholder: 'recipient@example.com', required: true, section: 'message', expressionEnabled: true, helpText: 'Virgules pour multiples' },
      { key: 'cc', label: 'CC', type: 'text', section: 'message', expressionEnabled: true },
      { key: 'bcc', label: 'BCC', type: 'text', section: 'message', expressionEnabled: true },
      { key: 'replyTo', label: 'Reply-To', type: 'text', section: 'message', expressionEnabled: true },
      { key: 'subject', label: 'Sujet', type: 'text', required: true, section: 'message', expressionEnabled: true },
      
      // Body
      { key: 'bodyType', label: 'Type de contenu', type: 'select', options: ['text', 'html', 'both'], defaultValue: 'text', section: 'body' },
      { key: 'textBody', label: 'Corps texte', type: 'textarea', section: 'body', expressionEnabled: true },
      { key: 'htmlBody', label: 'Corps HTML', type: 'textarea', section: 'body', expressionEnabled: true },
      
      // Attachments
      { key: 'attachments', label: 'Pièces jointes (JSON)', type: 'json', placeholder: '[{"filename": "file.pdf", "content": "{{ $input.fileBase64 }}"}]', section: 'attachments', expressionEnabled: true },
      { key: 'attachFromPrevious', label: 'Joindre données précédentes', type: 'boolean', defaultValue: false, section: 'attachments' },
      
      // Options
      { key: 'priority', label: 'Priorité', type: 'select', options: ['low', 'normal', 'high'], defaultValue: 'normal', section: 'options' },
    ]
  },
  
  email_oauth: {
    name: 'Email OAuth',
    category: 'email',
    color: 'from-red-500 to-pink-400',
    icon: 'Mail',
    description: 'Email via OAuth (Gmail, Outlook...)',
    isRealAction: true,
    requiresAuth: true,
    configFields: [
      // Provider
      { key: 'provider', label: 'Provider', type: 'select', options: ['gmail', 'outlook', 'custom'], defaultValue: 'gmail', section: 'connection' },
      
      // OAuth Credentials
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, section: 'connection', helpText: 'Depuis la console développeur' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true, section: 'connection' },
      { key: 'oauthButton', label: 'Connecter le compte', type: 'oauth_button', section: 'connection' },
      
      // Action
      { key: 'action', label: 'Action', type: 'select', options: [
        { value: 'read', label: 'Lire emails' },
        { value: 'send', label: 'Envoyer email' },
        { value: 'reply', label: 'Répondre' },
        { value: 'forward', label: 'Transférer' },
        { value: 'label', label: 'Gérer labels' },
        { value: 'search', label: 'Rechercher' },
      ], defaultValue: 'read', section: 'action' },
      
      // Read options
      { key: 'query', label: 'Recherche', type: 'text', placeholder: 'is:unread from:important@email.com', section: 'read', showWhen: { field: 'action', value: 'read' }, expressionEnabled: true },
      { key: 'maxResults', label: 'Max résultats', type: 'number', defaultValue: 10, section: 'read', showWhen: { field: 'action', value: 'read' } },
      { key: 'markAsRead', label: 'Marquer comme lu', type: 'boolean', defaultValue: false, section: 'read', showWhen: { field: 'action', value: 'read' } },
      
      // Send options
      { key: 'to', label: 'À', type: 'text', section: 'send', showWhen: { field: 'action', value: 'send' }, expressionEnabled: true },
      { key: 'cc', label: 'CC', type: 'text', section: 'send', showWhen: { field: 'action', value: 'send' }, expressionEnabled: true },
      { key: 'subject', label: 'Sujet', type: 'text', section: 'send', showWhen: { field: 'action', value: 'send' }, expressionEnabled: true },
      { key: 'body', label: 'Corps', type: 'textarea', section: 'send', showWhen: { field: 'action', value: 'send' }, expressionEnabled: true },
      { key: 'isHtml', label: 'HTML', type: 'boolean', defaultValue: false, section: 'send', showWhen: { field: 'action', value: 'send' } },
      
      // Reply options
      { key: 'messageId', label: 'ID du message', type: 'text', section: 'reply', showWhen: { field: 'action', value: 'reply' }, expressionEnabled: true },
      { key: 'replyBody', label: 'Réponse', type: 'textarea', section: 'reply', showWhen: { field: 'action', value: 'reply' }, expressionEnabled: true },
      { key: 'replyAll', label: 'Répondre à tous', type: 'boolean', defaultValue: false, section: 'reply', showWhen: { field: 'action', value: 'reply' } },
      
      // Labels
      { key: 'addLabels', label: 'Ajouter labels', type: 'text', placeholder: 'IMPORTANT, STARRED', section: 'labels', showWhen: { field: 'action', value: 'label' } },
      { key: 'removeLabels', label: 'Retirer labels', type: 'text', placeholder: 'UNREAD', section: 'labels', showWhen: { field: 'action', value: 'label' } },
    ]
  },

  // ===================================================================
  // DATABASE
  // ===================================================================
  
  db_query: {
    name: 'Database Query',
    category: 'database',
    color: 'from-emerald-500 to-green-400',
    icon: 'Database',
    description: 'Query SQL générique (SELECT)',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'connectionType', label: 'Type de connexion', type: 'select', options: ['supabase', 'postgres', 'mysql', 'sqlite', 'custom'], defaultValue: 'supabase', section: 'connection' },
      { key: 'connectionString', label: 'Connection String', type: 'password', section: 'connection', showWhen: { field: 'connectionType', notValue: 'supabase' }, helpText: 'postgresql://user:pass@host:5432/db' },
      
      // Query mode
      { key: 'queryMode', label: 'Mode', type: 'select', options: ['builder', 'raw'], defaultValue: 'builder', section: 'query' },
      
      // Builder mode
      { key: 'table', label: 'Table', type: 'text', placeholder: 'users', section: 'query', showWhen: { field: 'queryMode', value: 'builder' } },
      { key: 'columns', label: 'Colonnes', type: 'text', placeholder: '* ou id, name, email', defaultValue: '*', section: 'query', showWhen: { field: 'queryMode', value: 'builder' } },
      { key: 'where', label: 'Where (JSON)', type: 'json', placeholder: '{"status": "active", "age.gt": 18}', section: 'query', showWhen: { field: 'queryMode', value: 'builder' }, expressionEnabled: true },
      { key: 'orderBy', label: 'Order By', type: 'text', placeholder: 'created_at desc', section: 'query', showWhen: { field: 'queryMode', value: 'builder' } },
      { key: 'limit', label: 'Limit', type: 'number', section: 'query', showWhen: { field: 'queryMode', value: 'builder' } },
      { key: 'offset', label: 'Offset', type: 'number', section: 'query', showWhen: { field: 'queryMode', value: 'builder' } },
      
      // Raw mode
      { key: 'sql', label: 'SQL Query', type: 'code', placeholder: 'SELECT * FROM users WHERE status = $1', section: 'query', showWhen: { field: 'queryMode', value: 'raw' } },
      { key: 'parameters', label: 'Paramètres (JSON array)', type: 'json', placeholder: '["active"]', section: 'query', showWhen: { field: 'queryMode', value: 'raw' }, expressionEnabled: true },
      
      // Options
      { key: 'singleRow', label: 'Résultat unique', type: 'boolean', defaultValue: false, section: 'options' },
      { key: 'throwIfEmpty', label: 'Erreur si vide', type: 'boolean', defaultValue: false, section: 'options' },
    ]
  },
  
  db_insert: {
    name: 'Database Insert',
    category: 'database',
    color: 'from-green-500 to-teal-400',
    icon: 'Plus',
    description: 'Insérer des données',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'connectionType', label: 'Type', type: 'select', options: ['supabase', 'postgres', 'mysql', 'custom'], defaultValue: 'supabase', section: 'connection' },
      { key: 'connectionString', label: 'Connection String', type: 'password', section: 'connection', showWhen: { field: 'connectionType', notValue: 'supabase' } },
      
      // Insert
      { key: 'table', label: 'Table', type: 'text', required: true, section: 'insert' },
      { key: 'data', label: 'Données (JSON)', type: 'json', placeholder: '{"name": "{{ $input.name }}", "email": "{{ $input.email }}"}', required: true, section: 'insert', expressionEnabled: true },
      { key: 'batchInsert', label: 'Insert batch (array)', type: 'boolean', defaultValue: false, section: 'insert' },
      
      // Options
      { key: 'returning', label: 'Retourner les données', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'returningColumns', label: 'Colonnes à retourner', type: 'text', placeholder: '*', section: 'options' },
      { key: 'onConflict', label: 'On Conflict', type: 'select', options: ['error', 'ignore', 'update'], defaultValue: 'error', section: 'options' },
      { key: 'conflictColumns', label: 'Colonnes de conflit', type: 'text', placeholder: 'email', section: 'options', showWhen: { field: 'onConflict', notValue: 'error' } },
    ]
  },
  
  db_update: {
    name: 'Database Update',
    category: 'database',
    color: 'from-amber-500 to-orange-400',
    icon: 'Edit',
    description: 'Mettre à jour des données',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'connectionType', label: 'Type', type: 'select', options: ['supabase', 'postgres', 'mysql', 'custom'], defaultValue: 'supabase', section: 'connection' },
      { key: 'connectionString', label: 'Connection String', type: 'password', section: 'connection', showWhen: { field: 'connectionType', notValue: 'supabase' } },
      
      // Update
      { key: 'table', label: 'Table', type: 'text', required: true, section: 'update' },
      { key: 'data', label: 'Données à modifier (JSON)', type: 'json', placeholder: '{"status": "updated", "updated_at": "{{ $now }}"}', required: true, section: 'update', expressionEnabled: true },
      { key: 'where', label: 'Where (JSON)', type: 'json', placeholder: '{"id": "{{ $input.id }}"}', required: true, section: 'update', expressionEnabled: true },
      
      // Options
      { key: 'returning', label: 'Retourner les données', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'limit', label: 'Limite', type: 'number', section: 'options' },
    ]
  },
  
  db_delete: {
    name: 'Database Delete',
    category: 'database',
    color: 'from-red-500 to-rose-400',
    icon: 'Trash',
    description: 'Supprimer des données',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'connectionType', label: 'Type', type: 'select', options: ['supabase', 'postgres', 'mysql', 'custom'], defaultValue: 'supabase', section: 'connection' },
      { key: 'connectionString', label: 'Connection String', type: 'password', section: 'connection', showWhen: { field: 'connectionType', notValue: 'supabase' } },
      
      // Delete
      { key: 'table', label: 'Table', type: 'text', required: true, section: 'delete' },
      { key: 'where', label: 'Where (JSON)', type: 'json', placeholder: '{"id": "{{ $input.id }}"}', required: true, section: 'delete', expressionEnabled: true },
      
      // Safety
      { key: 'requireWhere', label: 'Where obligatoire', type: 'boolean', defaultValue: true, section: 'safety', helpText: 'Empêche DELETE sans condition' },
      { key: 'returning', label: 'Retourner les données supprimées', type: 'boolean', defaultValue: false, section: 'options' },
      { key: 'limit', label: 'Limite', type: 'number', section: 'options' },
    ]
  },
  
  db_upsert: {
    name: 'Database Upsert',
    category: 'database',
    color: 'from-violet-500 to-purple-400',
    icon: 'RefreshCw',
    description: 'Insert ou Update (upsert)',
    isRealAction: true,
    configFields: [
      // Connection
      { key: 'connectionType', label: 'Type', type: 'select', options: ['supabase', 'postgres', 'mysql', 'custom'], defaultValue: 'supabase', section: 'connection' },
      { key: 'connectionString', label: 'Connection String', type: 'password', section: 'connection', showWhen: { field: 'connectionType', notValue: 'supabase' } },
      
      // Upsert
      { key: 'table', label: 'Table', type: 'text', required: true, section: 'upsert' },
      { key: 'data', label: 'Données (JSON)', type: 'json', required: true, section: 'upsert', expressionEnabled: true },
      { key: 'onConflictColumns', label: 'Colonnes de conflit', type: 'text', placeholder: 'id ou email', required: true, section: 'upsert' },
      { key: 'updateColumns', label: 'Colonnes à mettre à jour', type: 'text', placeholder: 'Vide = toutes', section: 'upsert' },
      
      // Options
      { key: 'returning', label: 'Retourner les données', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'ignoreDuplicates', label: 'Ignorer les doublons', type: 'boolean', defaultValue: false, section: 'options' },
    ]
  },

  // ===================================================================
  // FILES / STORAGE
  // ===================================================================
  
  file_read: {
    name: 'File Read',
    category: 'files',
    color: 'from-blue-500 to-cyan-400',
    icon: 'FileText',
    description: 'Lire un fichier',
    configFields: [
      // Source
      { key: 'source', label: 'Source', type: 'select', options: ['input', 'url', 'path', 'base64'], defaultValue: 'input', section: 'source' },
      { key: 'url', label: 'URL du fichier', type: 'text', section: 'source', showWhen: { field: 'source', value: 'url' }, expressionEnabled: true },
      { key: 'path', label: 'Chemin du fichier', type: 'text', section: 'source', showWhen: { field: 'source', value: 'path' }, expressionEnabled: true },
      { key: 'base64Data', label: 'Données Base64', type: 'textarea', section: 'source', showWhen: { field: 'source', value: 'base64' }, expressionEnabled: true },
      
      // Parsing
      { key: 'parseAs', label: 'Parser comme', type: 'select', options: ['auto', 'text', 'json', 'csv', 'xml', 'binary', 'lines'], defaultValue: 'auto', section: 'parsing' },
      { key: 'encoding', label: 'Encodage', type: 'select', options: ['utf-8', 'latin1', 'ascii', 'base64'], defaultValue: 'utf-8', section: 'parsing' },
      
      // CSV options
      { key: 'csvDelimiter', label: 'Délimiteur CSV', type: 'text', defaultValue: ',', section: 'csv', showWhen: { field: 'parseAs', value: 'csv' } },
      { key: 'csvHeaders', label: 'Première ligne = headers', type: 'boolean', defaultValue: true, section: 'csv', showWhen: { field: 'parseAs', value: 'csv' } },
    ]
  },
  
  file_write: {
    name: 'File Write',
    category: 'files',
    color: 'from-green-500 to-emerald-400',
    icon: 'FileOutput',
    description: 'Écrire un fichier',
    configFields: [
      // Content
      { key: 'content', label: 'Contenu', type: 'textarea', section: 'content', expressionEnabled: true },
      { key: 'contentType', label: 'Type de contenu', type: 'select', options: ['text', 'json', 'csv', 'binary'], defaultValue: 'text', section: 'content' },
      
      // Filename
      { key: 'filename', label: 'Nom du fichier', type: 'text', placeholder: 'output_{{ $timestamp }}.txt', section: 'file', expressionEnabled: true },
      { key: 'mimeType', label: 'MIME Type', type: 'text', placeholder: 'text/plain', section: 'file' },
      
      // CSV options
      { key: 'csvDelimiter', label: 'Délimiteur', type: 'text', defaultValue: ',', section: 'csv', showWhen: { field: 'contentType', value: 'csv' } },
      { key: 'csvHeaders', label: 'Inclure headers', type: 'boolean', defaultValue: true, section: 'csv', showWhen: { field: 'contentType', value: 'csv' } },
      
      // Output
      { key: 'outputFormat', label: 'Format de sortie', type: 'select', options: ['base64', 'buffer', 'dataurl', 'path'], defaultValue: 'base64', section: 'output' },
    ]
  },
  
  file_convert: {
    name: 'File Convert',
    category: 'files',
    color: 'from-amber-500 to-yellow-400',
    icon: 'FileSymlink',
    description: 'Convertir un format de fichier',
    configFields: [
      // Input
      { key: 'inputFormat', label: 'Format d\'entrée', type: 'select', options: ['auto', 'pdf', 'docx', 'xlsx', 'csv', 'json', 'xml', 'html', 'md', 'txt'], defaultValue: 'auto', section: 'conversion' },
      { key: 'outputFormat', label: 'Format de sortie', type: 'select', options: ['pdf', 'docx', 'xlsx', 'csv', 'json', 'xml', 'html', 'md', 'txt'], defaultValue: 'pdf', section: 'conversion' },
      
      // Options
      { key: 'pageSize', label: 'Taille de page (PDF)', type: 'select', options: ['A4', 'Letter', 'Legal'], defaultValue: 'A4', section: 'options', showWhen: { field: 'outputFormat', value: 'pdf' } },
      { key: 'orientation', label: 'Orientation', type: 'select', options: ['portrait', 'landscape'], defaultValue: 'portrait', section: 'options', showWhen: { field: 'outputFormat', value: 'pdf' } },
    ]
  },
  
  file_compress: {
    name: 'Compress / Decompress',
    category: 'files',
    color: 'from-slate-500 to-gray-400',
    icon: 'Archive',
    description: 'Compresser ou décompresser',
    configFields: [
      // Operation
      { key: 'operation', label: 'Opération', type: 'select', options: ['compress', 'decompress'], defaultValue: 'compress', section: 'operation' },
      { key: 'format', label: 'Format', type: 'select', options: ['zip', 'gzip', 'tar', 'tar.gz'], defaultValue: 'zip', section: 'operation' },
      
      // Compress options
      { key: 'files', label: 'Fichiers (JSON array)', type: 'json', placeholder: '[{"name": "file.txt", "content": "..."}]', section: 'compress', showWhen: { field: 'operation', value: 'compress' }, expressionEnabled: true },
      { key: 'compressionLevel', label: 'Niveau de compression', type: 'number', defaultValue: 6, section: 'compress', showWhen: { field: 'operation', value: 'compress' }, validation: { min: 1, max: 9 } },
      { key: 'password', label: 'Mot de passe (optionnel)', type: 'password', section: 'compress' },
      
      // Output
      { key: 'outputFilename', label: 'Nom du fichier', type: 'text', placeholder: 'archive.zip', section: 'output', expressionEnabled: true },
    ]
  },
  
  storage_upload: {
    name: 'Storage Upload',
    category: 'files',
    color: 'from-indigo-500 to-blue-400',
    icon: 'CloudUpload',
    description: 'Upload vers stockage cloud',
    isRealAction: true,
    configFields: [
      // Provider
      { key: 'provider', label: 'Provider', type: 'select', options: ['supabase', 's3', 'gcs', 'azure', 'cloudflare'], defaultValue: 'supabase', section: 'provider' },
      
      // S3 config
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      { key: 'region', label: 'Région', type: 'text', placeholder: 'eu-west-1', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      { key: 'endpoint', label: 'Endpoint (optionnel)', type: 'text', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      
      // Upload
      { key: 'bucket', label: 'Bucket', type: 'text', required: true, section: 'upload', expressionEnabled: true },
      { key: 'path', label: 'Chemin / Nom du fichier', type: 'text', placeholder: 'uploads/{{ $timestamp }}_{{ $input.filename }}', required: true, section: 'upload', expressionEnabled: true },
      { key: 'contentType', label: 'Content-Type', type: 'text', placeholder: 'auto', section: 'upload' },
      
      // Options
      { key: 'public', label: 'Accès public', type: 'boolean', defaultValue: false, section: 'options' },
      { key: 'overwrite', label: 'Écraser si existe', type: 'boolean', defaultValue: true, section: 'options' },
      { key: 'metadata', label: 'Métadonnées (JSON)', type: 'json', section: 'options', expressionEnabled: true },
    ]
  },
  
  storage_download: {
    name: 'Storage Download',
    category: 'files',
    color: 'from-cyan-500 to-teal-400',
    icon: 'CloudDownload',
    description: 'Download depuis stockage cloud',
    isRealAction: true,
    configFields: [
      // Provider
      { key: 'provider', label: 'Provider', type: 'select', options: ['supabase', 's3', 'gcs', 'azure', 'cloudflare'], defaultValue: 'supabase', section: 'provider' },
      
      // Credentials (same as upload)
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      { key: 'region', label: 'Région', type: 'text', section: 'credentials', showWhen: { field: 'provider', value: 's3' } },
      
      // Download
      { key: 'bucket', label: 'Bucket', type: 'text', required: true, section: 'download', expressionEnabled: true },
      { key: 'path', label: 'Chemin du fichier', type: 'text', required: true, section: 'download', expressionEnabled: true },
      
      // Output
      { key: 'outputFormat', label: 'Format de sortie', type: 'select', options: ['buffer', 'base64', 'text', 'json', 'stream'], defaultValue: 'buffer', section: 'output' },
      { key: 'encoding', label: 'Encodage (pour text)', type: 'select', options: ['utf-8', 'latin1', 'base64'], defaultValue: 'utf-8', section: 'output' },
    ]
  },

  // ===================================================================
  // MESSAGING
  // ===================================================================
  
  message_send: {
    name: 'Send Message',
    category: 'messaging',
    color: 'from-purple-500 to-violet-400',
    icon: 'MessageSquare',
    description: 'Envoyer un message (Slack, Discord, Teams...)',
    isRealAction: true,
    configFields: [
      // Platform
      { key: 'platform', label: 'Plateforme', type: 'select', options: [
        { value: 'slack', label: 'Slack' },
        { value: 'discord', label: 'Discord' },
        { value: 'teams', label: 'Microsoft Teams' },
        { value: 'telegram', label: 'Telegram' },
        { value: 'whatsapp', label: 'WhatsApp Business' },
        { value: 'custom_webhook', label: 'Webhook personnalisé' },
      ], defaultValue: 'slack', section: 'platform' },
      
      // Connection
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true, section: 'connection', expressionEnabled: true },
      { key: 'botToken', label: 'Bot Token (optionnel)', type: 'password', section: 'connection', helpText: 'Pour fonctionnalités avancées' },
      
      // Target
      { key: 'channel', label: 'Channel / Chat ID', type: 'text', section: 'target', expressionEnabled: true },
      { key: 'threadId', label: 'Thread ID (réponse)', type: 'text', section: 'target', expressionEnabled: true },
      
      // Message
      { key: 'messageType', label: 'Type de message', type: 'select', options: ['text', 'rich', 'card', 'blocks'], defaultValue: 'text', section: 'message' },
      { key: 'text', label: 'Texte', type: 'textarea', section: 'message', expressionEnabled: true },
      { key: 'richContent', label: 'Contenu riche (JSON)', type: 'json', section: 'message', showWhen: { field: 'messageType', notValue: 'text' }, expressionEnabled: true, helpText: 'Format spécifique à la plateforme' },
      
      // Options
      { key: 'username', label: 'Nom d\'affichage', type: 'text', section: 'options', expressionEnabled: true },
      { key: 'iconUrl', label: 'URL de l\'icône', type: 'text', section: 'options', expressionEnabled: true },
      { key: 'mentionUsers', label: 'Mentionner utilisateurs', type: 'text', placeholder: '@user1, @user2', section: 'options', expressionEnabled: true },
    ]
  },
  
  message_receive: {
    name: 'Receive Message',
    category: 'messaging',
    color: 'from-pink-500 to-rose-400',
    icon: 'MessageCircle',
    description: 'Recevoir des messages (trigger)',
    isRealAction: true,
    configFields: [
      // Platform
      { key: 'platform', label: 'Plateforme', type: 'select', options: ['slack', 'discord', 'telegram', 'custom_webhook'], defaultValue: 'slack', section: 'platform' },
      
      // Connection
      { key: 'signingSecret', label: 'Signing Secret', type: 'password', section: 'connection', helpText: 'Pour vérifier l\'origine des messages' },
      { key: 'botToken', label: 'Bot Token', type: 'password', section: 'connection' },
      
      // Filters
      { key: 'channelFilter', label: 'Filtrer par channel', type: 'text', section: 'filters' },
      { key: 'userFilter', label: 'Filtrer par utilisateur', type: 'text', section: 'filters' },
      { key: 'messageFilter', label: 'Filtrer par contenu (regex)', type: 'text', section: 'filters' },
      { key: 'eventTypes', label: 'Types d\'événements', type: 'multiselect', options: ['message', 'reaction', 'mention', 'command'], section: 'filters' },
    ]
  },

  // ===================================================================
  // MEMORY / STATE
  // ===================================================================
  
  memory_read: {
    name: 'Memory Read',
    category: 'memory',
    color: 'from-indigo-500 to-purple-400',
    icon: 'Database',
    description: 'Lire depuis mémoire/cache',
    configFields: [
      // Storage
      { key: 'storageType', label: 'Type de stockage', type: 'select', options: ['workflow', 'session', 'global', 'redis', 'database'], defaultValue: 'workflow', section: 'storage' },
      
      // Key
      { key: 'key', label: 'Clé', type: 'text', required: true, section: 'read', expressionEnabled: true },
      { key: 'keyPattern', label: 'Pattern (pour liste)', type: 'text', placeholder: 'user:*', section: 'read', helpText: 'Pour récupérer plusieurs clés' },
      
      // Options
      { key: 'defaultValue', label: 'Valeur par défaut', type: 'json', section: 'options' },
      { key: 'parseJson', label: 'Parser comme JSON', type: 'boolean', defaultValue: true, section: 'options' },
      
      // Redis config
      { key: 'redisUrl', label: 'Redis URL', type: 'text', placeholder: 'redis://localhost:6379', section: 'redis', showWhen: { field: 'storageType', value: 'redis' } },
    ]
  },
  
  memory_write: {
    name: 'Memory Write',
    category: 'memory',
    color: 'from-violet-500 to-indigo-400',
    icon: 'Save',
    description: 'Écrire dans mémoire/cache',
    configFields: [
      // Storage
      { key: 'storageType', label: 'Type de stockage', type: 'select', options: ['workflow', 'session', 'global', 'redis', 'database'], defaultValue: 'workflow', section: 'storage' },
      
      // Key/Value
      { key: 'key', label: 'Clé', type: 'text', required: true, section: 'write', expressionEnabled: true },
      { key: 'value', label: 'Valeur', type: 'json', required: true, section: 'write', expressionEnabled: true },
      
      // TTL
      { key: 'ttl', label: 'TTL (secondes)', type: 'number', section: 'ttl', helpText: '0 = pas d\'expiration' },
      
      // Options
      { key: 'overwrite', label: 'Écraser si existe', type: 'boolean', defaultValue: true, section: 'options' },
      
      // Redis config
      { key: 'redisUrl', label: 'Redis URL', type: 'text', section: 'redis', showWhen: { field: 'storageType', value: 'redis' } },
    ]
  },
  
  memory_delete: {
    name: 'Memory Delete',
    category: 'memory',
    color: 'from-red-500 to-rose-400',
    icon: 'Trash2',
    description: 'Supprimer de la mémoire/cache',
    configFields: [
      // Storage
      { key: 'storageType', label: 'Type de stockage', type: 'select', options: ['workflow', 'session', 'global', 'redis', 'database'], defaultValue: 'workflow', section: 'storage' },
      
      // Key
      { key: 'key', label: 'Clé', type: 'text', section: 'delete', expressionEnabled: true },
      { key: 'keyPattern', label: 'Pattern', type: 'text', placeholder: 'temp:*', section: 'delete', helpText: 'Supprimer plusieurs clés' },
      { key: 'deleteAll', label: 'Tout supprimer', type: 'boolean', defaultValue: false, section: 'delete' },
      
      // Redis config
      { key: 'redisUrl', label: 'Redis URL', type: 'text', section: 'redis', showWhen: { field: 'storageType', value: 'redis' } },
    ]
  },

  // ===================================================================
  // TOOLS / FUNCTION CALLING
  // ===================================================================
  
  tool_call: {
    name: 'Tool Call',
    category: 'tools',
    color: 'from-amber-500 to-orange-400',
    icon: 'Wrench',
    description: 'Appeler un outil/fonction externe',
    isRealAction: true,
    configFields: [
      // Tool selection
      { key: 'toolType', label: 'Type d\'outil', type: 'select', options: [
        { value: 'http', label: 'API HTTP' },
        { value: 'function', label: 'Fonction interne' },
        { value: 'workflow', label: 'Sous-workflow' },
        { value: 'custom', label: 'Personnalisé' },
      ], defaultValue: 'http', section: 'tool' },
      
      // HTTP Tool
      { key: 'toolUrl', label: 'URL de l\'outil', type: 'text', section: 'tool', showWhen: { field: 'toolType', value: 'http' }, expressionEnabled: true },
      { key: 'toolMethod', label: 'Méthode', type: 'select', options: ['POST', 'GET'], defaultValue: 'POST', section: 'tool', showWhen: { field: 'toolType', value: 'http' } },
      
      // Function
      { key: 'functionName', label: 'Nom de la fonction', type: 'text', section: 'tool', showWhen: { field: 'toolType', value: 'function' } },
      
      // Workflow
      { key: 'workflowId', label: 'ID du workflow', type: 'text', section: 'tool', showWhen: { field: 'toolType', value: 'workflow' }, expressionEnabled: true },
      
      // Parameters
      { key: 'parameters', label: 'Paramètres (JSON)', type: 'json', section: 'parameters', expressionEnabled: true },
      
      // Timeout
      { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, section: 'options' },
    ]
  },
  
  tool_define: {
    name: 'Tool Define',
    category: 'tools',
    color: 'from-violet-500 to-purple-400',
    icon: 'PenTool',
    description: 'Définir un outil pour agents IA',
    configFields: [
      // Tool definition
      { key: 'toolName', label: 'Nom de l\'outil', type: 'text', required: true, section: 'definition', placeholder: 'search_database' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, section: 'definition', helpText: 'Description pour l\'IA' },
      
      // Parameters schema
      { key: 'parametersSchema', label: 'Schéma des paramètres (JSON Schema)', type: 'json', section: 'definition', placeholder: '{\n  "type": "object",\n  "properties": {\n    "query": {"type": "string", "description": "Search query"}\n  },\n  "required": ["query"]\n}' },
      
      // Implementation
      { key: 'implementation', label: 'Implémentation', type: 'select', options: ['inline_code', 'http', 'workflow'], defaultValue: 'inline_code', section: 'implementation' },
      { key: 'code', label: 'Code', type: 'code', section: 'implementation', showWhen: { field: 'implementation', value: 'inline_code' } },
      { key: 'httpConfig', label: 'Config HTTP (JSON)', type: 'json', section: 'implementation', showWhen: { field: 'implementation', value: 'http' } },
      { key: 'workflowId', label: 'Workflow ID', type: 'text', section: 'implementation', showWhen: { field: 'implementation', value: 'workflow' } },
    ]
  },

  // ===================================================================
  // OUTPUT
  // ===================================================================
  
  output_json: {
    name: 'Output JSON',
    category: 'output',
    color: 'from-emerald-500 to-green-400',
    icon: 'FileJson',
    description: 'Sortie JSON structurée',
    outputs: 0,
    configFields: [
      // Data
      { key: 'data', label: 'Données', type: 'json', section: 'output', expressionEnabled: true },
      { key: 'schema', label: 'Schéma de validation (optionnel)', type: 'json', section: 'output' },
      
      // Options
      { key: 'pretty', label: 'Formatage lisible', type: 'boolean', defaultValue: false, section: 'options' },
    ]
  },
  
  output_file: {
    name: 'Output File',
    category: 'output',
    color: 'from-blue-500 to-cyan-400',
    icon: 'FileDown',
    description: 'Générer un fichier de sortie',
    outputs: 0,
    isRealAction: true,
    configFields: [
      // File type
      { key: 'fileType', label: 'Type de fichier', type: 'select', options: ['pdf', 'docx', 'xlsx', 'csv', 'json', 'txt', 'html', 'md', 'zip'], defaultValue: 'pdf', section: 'file' },
      { key: 'filename', label: 'Nom du fichier', type: 'text', placeholder: 'report_{{ $timestamp }}.pdf', section: 'file', expressionEnabled: true },
      
      // Content
      { key: 'content', label: 'Contenu', type: 'textarea', section: 'content', expressionEnabled: true },
      { key: 'template', label: 'Template (optionnel)', type: 'textarea', section: 'content', helpText: 'Template avec variables {{ }}' },
      
      // PDF options
      { key: 'pageSize', label: 'Taille de page', type: 'select', options: ['A4', 'Letter', 'Legal'], defaultValue: 'A4', section: 'pdf', showWhen: { field: 'fileType', value: 'pdf' } },
      { key: 'orientation', label: 'Orientation', type: 'select', options: ['portrait', 'landscape'], defaultValue: 'portrait', section: 'pdf', showWhen: { field: 'fileType', value: 'pdf' } },
      { key: 'margins', label: 'Marges (mm)', type: 'json', placeholder: '{"top": 20, "right": 20, "bottom": 20, "left": 20}', section: 'pdf', showWhen: { field: 'fileType', value: 'pdf' } },
      
      // Save options
      { key: 'saveToStorage', label: 'Sauvegarder dans stockage', type: 'boolean', defaultValue: false, section: 'save' },
      { key: 'storageBucket', label: 'Bucket', type: 'text', section: 'save', showWhen: { field: 'saveToStorage', value: true } },
      { key: 'storagePath', label: 'Chemin', type: 'text', section: 'save', showWhen: { field: 'saveToStorage', value: true }, expressionEnabled: true },
    ]
  },
  
  output_display: {
    name: 'Output Display',
    category: 'output',
    color: 'from-purple-500 to-violet-400',
    icon: 'Eye',
    description: 'Afficher dans l\'interface',
    outputs: 0,
    configFields: [
      // Display type
      { key: 'displayType', label: 'Type d\'affichage', type: 'select', options: ['text', 'markdown', 'html', 'json', 'table', 'chart'], defaultValue: 'text', section: 'display' },
      
      // Content
      { key: 'content', label: 'Contenu', type: 'textarea', section: 'content', expressionEnabled: true },
      { key: 'title', label: 'Titre', type: 'text', section: 'content', expressionEnabled: true },
      
      // Table options
      { key: 'tableColumns', label: 'Colonnes (JSON)', type: 'json', placeholder: '[{"key": "name", "label": "Nom"}, ...]', section: 'table', showWhen: { field: 'displayType', value: 'table' } },
      
      // Chart options
      { key: 'chartType', label: 'Type de graphique', type: 'select', options: ['bar', 'line', 'pie', 'area'], defaultValue: 'bar', section: 'chart', showWhen: { field: 'displayType', value: 'chart' } },
      { key: 'chartConfig', label: 'Config graphique (JSON)', type: 'json', section: 'chart', showWhen: { field: 'displayType', value: 'chart' } },
    ]
  },
  
  output_notify: {
    name: 'Notification',
    category: 'output',
    color: 'from-yellow-500 to-amber-400',
    icon: 'Bell',
    description: 'Envoyer une notification',
    outputs: 0,
    isRealAction: true,
    configFields: [
      // Channel
      { key: 'channel', label: 'Canal', type: 'select', options: ['toast', 'email', 'push', 'sms', 'slack', 'webhook'], defaultValue: 'toast', section: 'channel' },
      
      // Message
      { key: 'title', label: 'Titre', type: 'text', section: 'message', expressionEnabled: true },
      { key: 'message', label: 'Message', type: 'textarea', required: true, section: 'message', expressionEnabled: true },
      { key: 'type', label: 'Type', type: 'select', options: ['info', 'success', 'warning', 'error'], defaultValue: 'info', section: 'message' },
      
      // Email specific
      { key: 'emailTo', label: 'Destinataire email', type: 'text', section: 'email', showWhen: { field: 'channel', value: 'email' }, expressionEnabled: true },
      { key: 'emailSubject', label: 'Sujet', type: 'text', section: 'email', showWhen: { field: 'channel', value: 'email' }, expressionEnabled: true },
      
      // Webhook
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', section: 'webhook', showWhen: { field: 'channel', value: 'webhook' }, expressionEnabled: true },
      { key: 'webhookPayload', label: 'Payload', type: 'json', section: 'webhook', showWhen: { field: 'channel', value: 'webhook' }, expressionEnabled: true },
    ]
  },
  
  output_log: {
    name: 'Log Entry',
    category: 'output',
    color: 'from-gray-500 to-slate-400',
    icon: 'FileText',
    description: 'Créer une entrée de log/audit',
    outputs: 0,
    configFields: [
      // Log level
      { key: 'level', label: 'Niveau', type: 'select', options: ['debug', 'info', 'warn', 'error'], defaultValue: 'info', section: 'log' },
      
      // Message
      { key: 'message', label: 'Message', type: 'textarea', required: true, section: 'log', expressionEnabled: true },
      { key: 'data', label: 'Données additionnelles (JSON)', type: 'json', section: 'log', expressionEnabled: true },
      
      // Context
      { key: 'includeContext', label: 'Inclure contexte workflow', type: 'boolean', defaultValue: true, section: 'context' },
      { key: 'includeTimestamp', label: 'Inclure timestamp', type: 'boolean', defaultValue: true, section: 'context' },
      
      // Storage
      { key: 'saveToDatabase', label: 'Sauvegarder en base', type: 'boolean', defaultValue: false, section: 'storage' },
      { key: 'tableName', label: 'Table', type: 'text', defaultValue: 'workflow_logs', section: 'storage', showWhen: { field: 'saveToDatabase', value: true } },
    ]
  }
};

// ==========================================
// CATEGORY DEFINITIONS
// ==========================================

export const BLOCK_CATEGORIES: { id: BlockCategory; name: string; description: string; icon: string }[] = [
  { id: 'trigger', name: 'Triggers', description: 'Déclencheurs de workflow', icon: 'Zap' },
  { id: 'ai', name: 'AI / LLM', description: 'Appels IA et modèles de langage', icon: 'Brain' },
  { id: 'logic', name: 'Logic / Control', description: 'Conditions, boucles, contrôle de flux', icon: 'GitBranch' },
  { id: 'transform', name: 'Data Transform', description: 'Transformation et manipulation de données', icon: 'Shuffle' },
  { id: 'http', name: 'HTTP / API', description: 'Requêtes HTTP et webhooks', icon: 'Globe' },
  { id: 'email', name: 'Email', description: 'Envoi et réception d\'emails', icon: 'Mail' },
  { id: 'database', name: 'Database', description: 'Opérations base de données', icon: 'Database' },
  { id: 'files', name: 'Files / Storage', description: 'Fichiers et stockage cloud', icon: 'FileText' },
  { id: 'messaging', name: 'Messaging', description: 'Slack, Discord, Teams...', icon: 'MessageSquare' },
  { id: 'memory', name: 'Memory / Cache', description: 'Stockage temporaire et cache', icon: 'HardDrive' },
  { id: 'tools', name: 'Tools', description: 'Outils et fonctions pour agents', icon: 'Wrench' },
  { id: 'output', name: 'Output', description: 'Sorties et notifications', icon: 'FileOutput' },
];

export const CATEGORY_INFO: Record<BlockCategory, { name: string; color: string; icon: string }> = {
  trigger: { name: 'Triggers', color: 'bg-blue-500', icon: 'Zap' },
  ai: { name: 'AI / LLM', color: 'bg-violet-500', icon: 'Brain' },
  logic: { name: 'Logic', color: 'bg-amber-500', icon: 'GitBranch' },
  transform: { name: 'Transform', color: 'bg-emerald-500', icon: 'Shuffle' },
  http: { name: 'HTTP', color: 'bg-orange-500', icon: 'Globe' },
  email: { name: 'Email', color: 'bg-red-500', icon: 'Mail' },
  database: { name: 'Database', color: 'bg-green-500', icon: 'Database' },
  files: { name: 'Files', color: 'bg-cyan-500', icon: 'FileText' },
  messaging: { name: 'Messaging', color: 'bg-purple-500', icon: 'MessageSquare' },
  memory: { name: 'Memory', color: 'bg-indigo-500', icon: 'HardDrive' },
  tools: { name: 'Tools', color: 'bg-amber-500', icon: 'Wrench' },
  output: { name: 'Output', color: 'bg-gray-500', icon: 'FileOutput' },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function isRealActionBlock(type: BlockType): boolean {
  return BLOCK_DEFINITIONS[type]?.isRealAction === true;
}

export function requiresAuthentication(type: BlockType): boolean {
  return BLOCK_DEFINITIONS[type]?.requiresAuth === true;
}

// ==========================================
// WORKFLOW TEMPLATES (Exemples de compositions)
// ==========================================

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

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-processor',
    name: 'Email Processor',
    description: 'Lire emails, extraire données avec IA, sauvegarder en base',
    category: 'Automation',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    icon: 'Mail',
    color: 'from-red-500 to-orange-400',
    useCases: ['Traitement emails', 'Extraction données', 'Automatisation'],
    blocks: [
      { id: 't1', type: 'email_oauth', name: 'Lire Emails', config: { action: 'read' }, position: { x: 100, y: 100 } },
      { id: 'ai1', type: 'llm_structured', name: 'Extraire Données', config: { fields: 'sender, subject, amount, date' }, position: { x: 100, y: 250 } },
      { id: 'db1', type: 'db_insert', name: 'Sauvegarder', config: { table: 'processed_emails' }, position: { x: 100, y: 400 } },
    ],
    connections: [
      { id: 'c1', sourceBlockId: 't1', targetBlockId: 'ai1' },
      { id: 'c2', sourceBlockId: 'ai1', targetBlockId: 'db1' },
    ]
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Appeler une API, transformer les données, notifier',
    category: 'Integration',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    icon: 'Globe',
    color: 'from-blue-500 to-cyan-400',
    useCases: ['Intégration API', 'Synchronisation', 'Webhooks'],
    blocks: [
      { id: 't1', type: 'trigger_schedule', name: 'Toutes les heures', config: { cronExpression: '0 * * * *' }, position: { x: 100, y: 100 } },
      { id: 'h1', type: 'http_request', name: 'Appel API', config: { method: 'GET' }, position: { x: 100, y: 250 } },
      { id: 'm1', type: 'map', name: 'Transformer', config: { mapMode: 'fields' }, position: { x: 100, y: 400 } },
      { id: 'n1', type: 'output_notify', name: 'Notifier', config: { channel: 'slack' }, position: { x: 100, y: 550 } },
    ],
    connections: [
      { id: 'c1', sourceBlockId: 't1', targetBlockId: 'h1' },
      { id: 'c2', sourceBlockId: 'h1', targetBlockId: 'm1' },
      { id: 'c3', sourceBlockId: 'm1', targetBlockId: 'n1' },
    ]
  },
];
