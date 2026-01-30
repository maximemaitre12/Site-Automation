// ==========================================
// Bridge entre anciens et nouveaux types workflow
// Permet la migration progressive vers N8N style
// ==========================================

import { N8NBlockType, N8N_BLOCK_DEFINITIONS, N8NBlockDefinition } from '@/types/workflow-n8n';
import { BlockType, BLOCK_DEFINITIONS, BlockDefinition } from '@/types/workflow';

// Mapping N8N type -> Legacy type (pour compatibilité)
const N8N_TO_LEGACY_MAP: Record<N8NBlockType, BlockType> = {
  // Triggers
  trigger_webhook: 'trigger_webhook',
  trigger_schedule: 'trigger_schedule',
  trigger_manual: 'trigger_text',
  trigger_event: 'trigger_webhook',
  trigger_app: 'trigger_email',
  trigger_email_received: 'trigger_email',
  trigger_form_submitted: 'trigger_form',
  
  // Logic
  logic_if: 'control_condition',
  logic_switch: 'control_branch',
  logic_merge: 'control_merge',
  logic_loop: 'control_loop',
  logic_wait: 'control_delay',
  logic_split_batches: 'control_loop',
  logic_error_trigger: 'trigger_webhook',
  logic_no_op: 'control_delay',
  
  // AI
  ai_agent: 'ai_generate',
  ai_llm_prompt: 'ai_generate',
  ai_chat_completion: 'ai_generate',
  ai_text_generator: 'ai_generate',
  ai_classifier: 'ai_classify',
  ai_summarizer: 'ai_summary',
  ai_extractor: 'ai_extract',
  ai_translator: 'ai_translate',
  ai_sentiment: 'ai_sentiment',
  ai_vision: 'ai_vision',
  
  // Tools
  tools_http_request: 'http_request',
  tools_database_query: 'aether_crm_search',
  tools_database_insert: 'aether_crm_create_lead',
  tools_database_update: 'aether_crm_update_contact',
  tools_database_delete: 'aether_crm_update_contact',
  tools_api_connector: 'http_request',
  tools_file_read: 'aether_doc_search',
  tools_file_write: 'aether_doc_create',
  tools_email_send: 'gmail_send',
  tools_sms_send: 'integration_twilio_sms',
  tools_slack_post: 'integration_slack',
  tools_discord_post: 'integration_discord',
  tools_telegram_send: 'integration_telegram',
  tools_whatsapp_send: 'integration_whatsapp',
  tools_code_execute: 'transform_json',
  tools_webhook_send: 'http_webhook',
  
  // Data
  data_set: 'transform_json',
  data_transform: 'transform_map',
  data_aggregate: 'transform_merge',
  data_filter: 'transform_filter',
  data_sort: 'transform_filter',
  data_respond: 'system_webhook',
  data_store_db: 'aether_crm_create_lead',
  data_store_file: 'aether_doc_create',
  data_store_vector: 'aether_doc_create',
};

// Convertir N8N type en Legacy type
export function n8nToLegacyType(n8nType: N8NBlockType): BlockType {
  return N8N_TO_LEGACY_MAP[n8nType] || 'ai_generate';
}

// Obtenir la définition combinée (N8N avec fallback legacy)
export function getBlockDefinition(type: string): BlockDefinition | N8NBlockDefinition {
  // Vérifier si c'est un type N8N
  if (type in N8N_BLOCK_DEFINITIONS) {
    return N8N_BLOCK_DEFINITIONS[type as N8NBlockType];
  }
  // Sinon utiliser les définitions legacy
  if (type in BLOCK_DEFINITIONS) {
    return BLOCK_DEFINITIONS[type as BlockType];
  }
  // Fallback
  return BLOCK_DEFINITIONS.ai_generate;
}

// Vérifier si un type est N8N
export function isN8NType(type: string): type is N8NBlockType {
  return type in N8N_BLOCK_DEFINITIONS;
}

// Obtenir tous les types disponibles (N8N + Legacy)
export function getAllBlockTypes(): string[] {
  return [
    ...Object.keys(N8N_BLOCK_DEFINITIONS),
    ...Object.keys(BLOCK_DEFINITIONS),
  ];
}
