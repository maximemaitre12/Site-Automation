// ==========================================
// Bridge entre anciens et nouveaux types workflow
// Permet la migration progressive vers N8N style
// ==========================================

import { N8NBlockType, N8N_BLOCK_DEFINITIONS, N8NBlockDefinition } from '@/types/workflow-n8n';
import { BlockType, BLOCK_DEFINITIONS, BlockDefinition } from '@/types/workflow';

// Mapping N8N type -> New primitive types (pour compatibilité)
const N8N_TO_PRIMITIVE_MAP: Record<N8NBlockType, BlockType> = {
  // Triggers
  trigger_webhook: 'trigger_webhook',
  trigger_schedule: 'trigger_schedule',
  trigger_manual: 'trigger_manual',
  trigger_event: 'trigger_event',
  trigger_app: 'trigger_manual',
  trigger_email_received: 'email_oauth',
  trigger_form_submitted: 'trigger_manual',
  
  // Logic
  logic_if: 'condition',
  logic_switch: 'switch',
  logic_merge: 'merge',
  logic_loop: 'loop',
  logic_wait: 'wait',
  logic_split_batches: 'loop',
  logic_error_trigger: 'error_handler',
  logic_no_op: 'wait',
  
  // AI
  ai_agent: 'llm_call',
  ai_llm_prompt: 'llm_call',
  ai_chat_completion: 'llm_call',
  ai_text_generator: 'llm_call',
  ai_classifier: 'llm_structured',
  ai_summarizer: 'llm_call',
  ai_extractor: 'llm_structured',
  ai_translator: 'llm_call',
  ai_sentiment: 'llm_structured',
  ai_vision: 'llm_vision',
  
  // Tools
  tools_http_request: 'http_request',
  tools_database_query: 'db_query',
  tools_database_insert: 'db_insert',
  tools_database_update: 'db_update',
  tools_database_delete: 'db_delete',
  tools_api_connector: 'http_request',
  tools_file_read: 'file_read',
  tools_file_write: 'file_write',
  tools_email_send: 'email_oauth',
  tools_sms_send: 'message_send',
  tools_slack_post: 'message_send',
  tools_discord_post: 'message_send',
  tools_telegram_send: 'message_send',
  tools_whatsapp_send: 'message_send',
  tools_code_execute: 'code_js',
  tools_webhook_send: 'http_request',
  
  // Data
  data_set: 'set_variable',
  data_transform: 'map',
  data_aggregate: 'aggregate',
  data_filter: 'filter',
  data_sort: 'sort',
  data_respond: 'http_response',
  data_store_db: 'db_insert',
  data_store_file: 'file_write',
  data_store_vector: 'memory_write',
};

// Convertir N8N type en primitive type
export function n8nToLegacyType(n8nType: N8NBlockType): BlockType {
  return N8N_TO_PRIMITIVE_MAP[n8nType] || 'llm_call';
}

// Obtenir la définition combinée (N8N avec fallback primitives)
export function getBlockDefinition(type: string): BlockDefinition | N8NBlockDefinition {
  // Vérifier si c'est un type N8N
  if (type in N8N_BLOCK_DEFINITIONS) {
    return N8N_BLOCK_DEFINITIONS[type as N8NBlockType];
  }
  // Sinon utiliser les définitions primitives
  if (type in BLOCK_DEFINITIONS) {
    return BLOCK_DEFINITIONS[type as BlockType];
  }
  // Fallback
  return BLOCK_DEFINITIONS.llm_call;
}

// Vérifier si un type est N8N
export function isN8NType(type: string): type is N8NBlockType {
  return type in N8N_BLOCK_DEFINITIONS;
}

// Obtenir tous les types disponibles (N8N + Primitives)
export function getAllBlockTypes(): string[] {
  return [
    ...Object.keys(N8N_BLOCK_DEFINITIONS),
    ...Object.keys(BLOCK_DEFINITIONS),
  ];
}
