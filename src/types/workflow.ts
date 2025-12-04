export type BlockType = 
  | 'trigger_text' 
  | 'trigger_file' 
  | 'trigger_webhook' 
  | 'trigger_form'
  | 'ai_summary' 
  | 'ai_extract' 
  | 'ai_classify' 
  | 'ai_generate'
  | 'ai_decision'
  | 'system_email'
  | 'system_webhook'
  | 'system_save';

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  blocks: WorkflowBlock[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRunLog {
  blockId: string;
  blockName: string;
  input: any;
  output: any;
  status: 'success' | 'error' | 'pending';
  duration: number;
  timestamp: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input_data: any;
  output_data: any;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  logs?: WorkflowRunLog[];
}

export const BLOCK_DEFINITIONS: Record<BlockType, {
  name: string;
  category: 'trigger' | 'ai' | 'system';
  color: string;
  icon: string;
  description: string;
  configFields: { key: string; label: string; type: 'text' | 'textarea' | 'select'; options?: string[] }[];
}> = {
  trigger_text: {
    name: 'Text Input',
    category: 'trigger',
    color: 'from-blue-500 to-cyan-400',
    icon: 'Type',
    description: 'Start workflow with text input',
    configFields: [
      { key: 'placeholder', label: 'Placeholder', type: 'text' }
    ]
  },
  trigger_file: {
    name: 'File Upload',
    category: 'trigger',
    color: 'from-purple-500 to-pink-400',
    icon: 'FileUp',
    description: 'Start workflow with file upload',
    configFields: [
      { key: 'acceptedTypes', label: 'Accepted Types', type: 'text' }
    ]
  },
  trigger_webhook: {
    name: 'Webhook',
    category: 'trigger',
    color: 'from-green-500 to-emerald-400',
    icon: 'Globe',
    description: 'Trigger via external webhook',
    configFields: []
  },
  trigger_form: {
    name: 'Custom Form',
    category: 'trigger',
    color: 'from-orange-500 to-amber-400',
    icon: 'ClipboardList',
    description: 'Custom form with multiple fields',
    configFields: [
      { key: 'fields', label: 'Form Fields (comma separated)', type: 'textarea' }
    ]
  },
  ai_summary: {
    name: 'AI Summary',
    category: 'ai',
    color: 'from-indigo-500 to-blue-400',
    icon: 'Sparkles',
    description: 'Summarize text with AI',
    configFields: [
      { key: 'style', label: 'Summary Style', type: 'select', options: ['short', 'detailed', 'bullet_points'] }
    ]
  },
  ai_extract: {
    name: 'Extract Data',
    category: 'ai',
    color: 'from-yellow-500 to-orange-400',
    icon: 'FileSearch',
    description: 'Extract structured data',
    configFields: [
      { key: 'fields', label: 'Fields to Extract', type: 'textarea' }
    ]
  },
  ai_classify: {
    name: 'AI Classification',
    category: 'ai',
    color: 'from-teal-500 to-cyan-400',
    icon: 'Tags',
    description: 'Classify into categories',
    configFields: [
      { key: 'categories', label: 'Categories (comma separated)', type: 'textarea' }
    ]
  },
  ai_generate: {
    name: 'Generate Text',
    category: 'ai',
    color: 'from-violet-500 to-purple-400',
    icon: 'Wand2',
    description: 'Generate text content',
    configFields: [
      { key: 'prompt', label: 'Generation Prompt', type: 'textarea' },
      { key: 'tone', label: 'Tone', type: 'select', options: ['professional', 'casual', 'formal', 'creative'] }
    ]
  },
  ai_decision: {
    name: 'AI Decision',
    category: 'ai',
    color: 'from-rose-500 to-pink-400',
    icon: 'GitBranch',
    description: 'Make intelligent decisions',
    configFields: [
      { key: 'question', label: 'Decision Question', type: 'textarea' }
    ]
  },
  system_email: {
    name: 'Send Email',
    category: 'system',
    color: 'from-red-500 to-rose-400',
    icon: 'Mail',
    description: 'Send an email',
    configFields: [
      { key: 'to', label: 'To Email', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' }
    ]
  },
  system_webhook: {
    name: 'POST Webhook',
    category: 'system',
    color: 'from-slate-500 to-gray-400',
    icon: 'Send',
    description: 'Send data to webhook',
    configFields: [
      { key: 'url', label: 'Webhook URL', type: 'text' }
    ]
  },
  system_save: {
    name: 'Save to DB',
    category: 'system',
    color: 'from-emerald-500 to-green-400',
    icon: 'Database',
    description: 'Save result to database',
    configFields: [
      { key: 'table', label: 'Table Name', type: 'text' }
    ]
  }
};
