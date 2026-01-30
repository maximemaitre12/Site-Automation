// ==========================================
// AETHER FLOW V2 - Enhanced Workflow Types
// Horizontal Canvas + Parallel Execution
// ==========================================

import { BlockType, BlockCategory, ExecutionStatus, ActionType, BlockConnection } from './workflow';

// ==========================================
// HANDLE DEFINITIONS
// ==========================================

export type HandleType = 'default' | 'true' | 'false' | 'error' | 'loop' | 'parallel';

export interface HandleDefinition {
  id: string;
  label: string;
  type: HandleType;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// ==========================================
// RETRY & TIMEOUT CONFIG
// ==========================================

export interface RetryConfig {
  enabled: boolean;
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  initialDelayMs: number;
  maxDelayMs?: number;
}

export interface TimeoutConfig {
  enabled: boolean;
  timeoutMs: number;
  onTimeout: 'fail' | 'skip' | 'continue';
}

// ==========================================
// ENHANCED BLOCK V2
// ==========================================

export interface WorkflowBlockV2 {
  id: string;
  type: BlockType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  
  // Handle definitions
  inputs: HandleDefinition[];
  outputs: HandleDefinition[];
  
  // Execution configuration
  retryConfig?: RetryConfig;
  timeout?: TimeoutConfig;
  parallel?: boolean;
  
  // Sub-workflow support
  subWorkflowId?: string;
  
  // Description/documentation
  description?: string;
  
  // Runtime metadata (populated during execution)
  executionStatus?: ExecutionStatus;
  lastOutput?: any;
  lastInput?: any;
  executionDuration?: number;
  executionStartTime?: string;
  retryCount?: number;
  errorMessage?: string;
}

// ==========================================
// ENHANCED CONNECTION V2
// ==========================================

export interface BlockConnectionV2 {
  id: string;
  sourceBlockId: string;
  sourceHandle: string;
  targetBlockId: string;
  targetHandle: string;
  condition?: string; // Expression conditionnelle
  animated?: boolean;
  label?: string;
}

// ==========================================
// WORKFLOW VARIABLES
// ==========================================

export interface WorkflowVariable {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'secret';
  description?: string;
}

export interface WorkflowSecret {
  id: string;
  workflow_id: string;
  user_id: string;
  key: string;
  created_at: string;
  // encrypted_value is never exposed to frontend
}

// ==========================================
// WORKFLOW SETTINGS
// ==========================================

export interface WorkflowSettings {
  autoLayout?: boolean;
  gridSnap?: number;
  zoomLevel?: number;
  panPosition?: { x: number; y: number };
  executionMode?: 'sequential' | 'parallel' | 'auto';
  defaultTimeout?: number;
  defaultRetry?: RetryConfig;
  webhookEnabled?: boolean;
  webhookSecret?: string;
}

// ==========================================
// WORKFLOW V2
// ==========================================

export interface WorkflowV2 {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  blocks: WorkflowBlockV2[];
  connections: BlockConnectionV2[];
  variables: Record<string, any>;
  settings: WorkflowSettings;
  is_active: boolean;
  is_template?: boolean;
  template_category?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// EXECUTION TRACKING
// ==========================================

export interface BlockExecutionStatus {
  blockId: string;
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  retryCount?: number;
}

export interface ParallelBranch {
  id: string;
  blockIds: string[];
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowRunV2 {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input_data: any;
  output_data: any;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  blocks_status: Record<string, BlockExecutionStatus>;
  parallel_branches: ParallelBranch[];
  totalDuration?: number;
  blocksExecuted?: number;
  realActionsCount?: number;
}

// ==========================================
// SSE EVENT TYPES
// ==========================================

export type WorkflowEventType = 
  | 'workflow_started'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'block_started'
  | 'block_completed'
  | 'block_error'
  | 'block_skipped'
  | 'parallel_branch_started'
  | 'parallel_branch_completed'
  | 'retry_attempt';

export interface WorkflowEvent {
  type: WorkflowEventType;
  runId: string;
  blockId?: string;
  timestamp: string;
  data?: any;
  duration?: number;
  error?: string;
}

// ==========================================
// LAYOUT TYPES
// ==========================================

export interface LayoutLevel {
  level: number;
  blockIds: string[];
}

export interface LayoutResult {
  positions: Record<string, { x: number; y: number }>;
  levels: LayoutLevel[];
  totalWidth: number;
  totalHeight: number;
}

// ==========================================
// CANVAS STATE
// ==========================================

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedBlockIds: string[];
  hoveredBlockId: string | null;
  draggingBlockId: string | null;
  connectingFrom: { blockId: string; handleId: string } | null;
  isLassoActive: boolean;
  lassoRect: { x: number; y: number; width: number; height: number } | null;
}

export interface CanvasConfig {
  minZoom: number;
  maxZoom: number;
  gridSize: number;
  snapToGrid: boolean;
  showMiniMap: boolean;
  showGrid: boolean;
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  minZoom: 0.25,
  maxZoom: 2,
  gridSize: 20,
  snapToGrid: true,
  showMiniMap: true,
  showGrid: true,
  nodeWidth: 200,
  nodeHeight: 80,
  horizontalSpacing: 100,
  verticalSpacing: 40,
};

// ==========================================
// BLOCK VISUAL STATE
// ==========================================

export interface BlockVisualState {
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  isConnecting: boolean;
  executionStatus: ExecutionStatus;
  hasError: boolean;
  isCollapsed: boolean;
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type BlockPositionMap = Record<string, { x: number; y: number }>;

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
