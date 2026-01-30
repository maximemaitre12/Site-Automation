// ==========================================
// AETHER FLOW - Advanced Workflow Types V2
// Canvas, Layout, and Visual State Types
// ==========================================

import { ExecutionStatus } from './workflow';

// ==========================================
// CANVAS CONFIGURATION
// ==========================================

export interface CanvasConfig {
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  showMiniMap: boolean;
  minZoom: number;
  maxZoom: number;
  nodeWidth: number;
  nodeHeight: number;
  connectionCurve: 'bezier' | 'step' | 'straight';
}

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  showMiniMap: true,
  minZoom: 0.15,
  maxZoom: 2,
  nodeWidth: 240,
  nodeHeight: 100,
  connectionCurve: 'bezier',
};

// ==========================================
// CANVAS STATE
// ==========================================

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedBlockId: string | null;
  selectedConnectionId: string | null;
  hoveredBlockId: string | null;
  isDragging: boolean;
  isConnecting: boolean;
  connectionStart: { blockId: string; handle: 'input' | 'output' } | null;
}

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
  isFiltered?: boolean;
}

// ==========================================
// LAYOUT TYPES
// ==========================================

export interface LayoutResult {
  positions: BlockPositionMap;
  levels: LayoutLevel[];
  totalWidth: number;
  totalHeight: number;
}

export interface LayoutLevel {
  level: number;
  blockIds: string[];
}

export interface BlockPositionMap {
  [blockId: string]: { x: number; y: number };
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

// ==========================================
// STICKY NOTES / ANNOTATIONS
// ==========================================

export interface StickyNote {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
  width?: number;
  height?: number;
}

// ==========================================
// WORKFLOW GROUPS
// ==========================================

export interface WorkflowGroup {
  id: string;
  name: string;
  blockIds: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  isCollapsed: boolean;
  isLocked?: boolean;
}

// ==========================================
// CONNECTION TYPES
// ==========================================

export interface ConnectionPoint {
  blockId: string;
  handle: 'input' | 'output';
  position: { x: number; y: number };
}

export interface DragConnectionState {
  isConnecting: boolean;
  sourceBlockId: string | null;
  sourceHandle: 'input' | 'output' | null;
  mousePosition: { x: number; y: number };
}

// ==========================================
// EXECUTION VISUALIZATION
// ==========================================

export interface ExecutionVisualization {
  activeBlockId: string | null;
  activePath: string[]; // Connection IDs in execution order
  completedBlocks: Set<string>;
  failedBlocks: Set<string>;
  currentOutput: any;
}

// ==========================================
// ZOOM LEVELS (SEMANTIC ZOOM)
// ==========================================

export type SemanticZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

export interface ZoomLevelConfig {
  threshold: number;
  showLabels: boolean;
  showBadges: boolean;
  showConfig: boolean;
  nodeOpacity: number;
}

export const ZOOM_LEVEL_CONFIGS: Record<SemanticZoomLevel, ZoomLevelConfig> = {
  micro: {
    threshold: 0.4,
    showLabels: false,
    showBadges: false,
    showConfig: false,
    nodeOpacity: 0.8,
  },
  mini: {
    threshold: 0.7,
    showLabels: true,
    showBadges: false,
    showConfig: false,
    nodeOpacity: 0.9,
  },
  normal: {
    threshold: 1.2,
    showLabels: true,
    showBadges: true,
    showConfig: false,
    nodeOpacity: 1,
  },
  detailed: {
    threshold: Infinity,
    showLabels: true,
    showBadges: true,
    showConfig: true,
    nodeOpacity: 1,
  },
};

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

export const CANVAS_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'Delete', action: 'delete', description: 'Delete selected' },
  { key: 'Backspace', action: 'delete', description: 'Delete selected' },
  { key: 'd', ctrl: true, action: 'duplicate', description: 'Duplicate selected' },
  { key: 'z', ctrl: true, action: 'undo', description: 'Undo' },
  { key: 'z', ctrl: true, shift: true, action: 'redo', description: 'Redo' },
  { key: 's', ctrl: true, action: 'save', description: 'Save workflow' },
  { key: 'f', action: 'fit', description: 'Fit view' },
  { key: '+', action: 'zoomIn', description: 'Zoom in' },
  { key: '-', action: 'zoomOut', description: 'Zoom out' },
  { key: 'ArrowUp', action: 'panUp', description: 'Pan up' },
  { key: 'ArrowDown', action: 'panDown', description: 'Pan down' },
  { key: 'ArrowLeft', action: 'panLeft', description: 'Pan left' },
  { key: 'ArrowRight', action: 'panRight', description: 'Pan right' },
  { key: 'Escape', action: 'deselect', description: 'Deselect all' },
];
