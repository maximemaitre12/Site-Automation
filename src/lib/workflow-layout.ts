// ==========================================
// AETHER FLOW - Auto-Layout Algorithm
// Dagre-like Horizontal Hierarchical Layout
// ==========================================

import { WorkflowBlock, BlockConnection } from '@/types/workflow';
export { DEFAULT_CANVAS_CONFIG } from '@/types/workflow-v2';

import { 
  LayoutResult, 
  LayoutLevel, 
  BlockPositionMap, 
  BoundingBox,
  DEFAULT_CANVAS_CONFIG 
} from '@/types/workflow-v2';

interface LayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
  startX?: number;
  startY?: number;
  direction?: 'horizontal' | 'vertical';
}

const DEFAULT_OPTIONS: Required<LayoutOptions> = {
  nodeWidth: DEFAULT_CANVAS_CONFIG.nodeWidth,
  nodeHeight: DEFAULT_CANVAS_CONFIG.nodeHeight,
  horizontalSpacing: DEFAULT_CANVAS_CONFIG.horizontalSpacing,
  verticalSpacing: DEFAULT_CANVAS_CONFIG.verticalSpacing,
  startX: 50,
  startY: 50,
  direction: 'horizontal',
};

/**
 * Build adjacency list from connections
 */
function buildAdjacencyList(
  blocks: WorkflowBlock[],
  connections: BlockConnection[]
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  
  blocks.forEach(block => {
    adjacency.set(block.id, []);
  });
  
  connections.forEach(conn => {
    const targets = adjacency.get(conn.sourceBlockId) || [];
    targets.push(conn.targetBlockId);
    adjacency.set(conn.sourceBlockId, targets);
  });
  
  return adjacency;
}

/**
 * Find root nodes (nodes with no incoming connections)
 */
function findRootNodes(
  blocks: WorkflowBlock[],
  connections: BlockConnection[]
): string[] {
  const hasIncoming = new Set(connections.map(c => c.targetBlockId));
  return blocks
    .filter(b => !hasIncoming.has(b.id))
    .map(b => b.id);
}

/**
 * Assign levels to nodes using BFS from roots
 */
function assignLevels(
  blocks: WorkflowBlock[],
  connections: BlockConnection[]
): Map<string, number> {
  const levels = new Map<string, number>();
  const adjacency = buildAdjacencyList(blocks, connections);
  const roots = findRootNodes(blocks, connections);
  
  // BFS to assign levels
  const queue: { id: string; level: number }[] = roots.map(id => ({ id, level: 0 }));
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    
    if (visited.has(id)) {
      // Update level if we found a longer path
      const currentLevel = levels.get(id) || 0;
      if (level > currentLevel) {
        levels.set(id, level);
      }
      continue;
    }
    
    visited.add(id);
    levels.set(id, level);
    
    const targets = adjacency.get(id) || [];
    targets.forEach(targetId => {
      queue.push({ id: targetId, level: level + 1 });
    });
  }
  
  // Assign level 0 to any unvisited nodes (disconnected)
  blocks.forEach(block => {
    if (!levels.has(block.id)) {
      levels.set(block.id, 0);
    }
  });
  
  return levels;
}

/**
 * Group blocks by their level
 */
function groupByLevel(levels: Map<string, number>): LayoutLevel[] {
  const groups = new Map<number, string[]>();
  
  levels.forEach((level, blockId) => {
    const group = groups.get(level) || [];
    group.push(blockId);
    groups.set(level, group);
  });
  
  const result: LayoutLevel[] = [];
  const sortedLevels = Array.from(groups.keys()).sort((a, b) => a - b);
  
  sortedLevels.forEach(level => {
    result.push({
      level,
      blockIds: groups.get(level) || [],
    });
  });
  
  return result;
}

/**
 * Calculate positions for horizontal layout
 */
function calculateHorizontalPositions(
  blocks: WorkflowBlock[],
  levels: LayoutLevel[],
  options: Required<LayoutOptions>
): BlockPositionMap {
  const positions: BlockPositionMap = {};
  
  levels.forEach((levelGroup) => {
    const x = options.startX + levelGroup.level * (options.nodeWidth + options.horizontalSpacing);
    const nodeCount = levelGroup.blockIds.length;
    const totalHeight = nodeCount * options.nodeHeight + (nodeCount - 1) * options.verticalSpacing;
    const startY = options.startY + (nodeCount > 1 ? 0 : totalHeight / 2);
    
    levelGroup.blockIds.forEach((blockId, index) => {
      positions[blockId] = {
        x,
        y: startY + index * (options.nodeHeight + options.verticalSpacing),
      };
    });
  });
  
  return positions;
}

/**
 * Calculate positions for vertical layout
 */
function calculateVerticalPositions(
  blocks: WorkflowBlock[],
  levels: LayoutLevel[],
  options: Required<LayoutOptions>
): BlockPositionMap {
  const positions: BlockPositionMap = {};
  
  levels.forEach((levelGroup) => {
    const y = options.startY + levelGroup.level * (options.nodeHeight + options.verticalSpacing);
    const nodeCount = levelGroup.blockIds.length;
    const totalWidth = nodeCount * options.nodeWidth + (nodeCount - 1) * options.horizontalSpacing;
    const startX = options.startX + (nodeCount > 1 ? 0 : totalWidth / 2);
    
    levelGroup.blockIds.forEach((blockId, index) => {
      positions[blockId] = {
        x: startX + index * (options.nodeWidth + options.horizontalSpacing),
        y,
      };
    });
  });
  
  return positions;
}

/**
 * Main auto-layout function
 */
export function autoLayoutBlocks(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  options: LayoutOptions = {}
): LayoutResult {
  const opts: Required<LayoutOptions> = { ...DEFAULT_OPTIONS, ...options };
  
  if (blocks.length === 0) {
    return {
      positions: {},
      levels: [],
      totalWidth: 0,
      totalHeight: 0,
    };
  }
  
  // Step 1: Assign levels
  const levelMap = assignLevels(blocks, connections);
  
  // Step 2: Group by level
  const levels = groupByLevel(levelMap);
  
  // Step 3: Calculate positions
  const positions = opts.direction === 'horizontal'
    ? calculateHorizontalPositions(blocks, levels, opts)
    : calculateVerticalPositions(blocks, levels, opts);
  
  // Calculate bounding box
  const boundingBox = calculateBoundingBox(positions, opts.nodeWidth, opts.nodeHeight);
  
  return {
    positions,
    levels,
    totalWidth: boundingBox.width + opts.startX * 2,
    totalHeight: boundingBox.height + opts.startY * 2,
  };
}

/**
 * Calculate bounding box of all positioned blocks
 */
export function calculateBoundingBox(
  positions: BlockPositionMap,
  nodeWidth: number,
  nodeHeight: number
): BoundingBox {
  const positionValues = Object.values(positions);
  
  if (positionValues.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const minX = Math.min(...positionValues.map(p => p.x));
  const minY = Math.min(...positionValues.map(p => p.y));
  const maxX = Math.max(...positionValues.map(p => p.x + nodeWidth));
  const maxY = Math.max(...positionValues.map(p => p.y + nodeHeight));
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Apply layout results to blocks
 */
export function applyLayoutToBlocks(
  blocks: WorkflowBlock[],
  layout: LayoutResult
): WorkflowBlock[] {
  return blocks.map(block => ({
    ...block,
    position: layout.positions[block.id] || block.position,
  }));
}

/**
 * Center layout around a point
 */
export function centerLayout(
  layout: LayoutResult,
  centerX: number,
  centerY: number
): LayoutResult {
  const boundingBox = calculateBoundingBox(
    layout.positions,
    DEFAULT_CANVAS_CONFIG.nodeWidth,
    DEFAULT_CANVAS_CONFIG.nodeHeight
  );
  
  const offsetX = centerX - (boundingBox.minX + boundingBox.width / 2);
  const offsetY = centerY - (boundingBox.minY + boundingBox.height / 2);
  
  const newPositions: BlockPositionMap = {};
  Object.entries(layout.positions).forEach(([blockId, pos]) => {
    newPositions[blockId] = {
      x: pos.x + offsetX,
      y: pos.y + offsetY,
    };
  });
  
  return {
    ...layout,
    positions: newPositions,
  };
}

/**
 * Snap position to grid
 */
export function snapToGrid(x: number, y: number, gridSize: number = 20): { x: number; y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}

/**
 * Calculate connection path (Bézier curve) between two blocks
 */
export function calculateConnectionPath(
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number },
  nodeWidth: number = DEFAULT_CANVAS_CONFIG.nodeWidth,
  nodeHeight: number = DEFAULT_CANVAS_CONFIG.nodeHeight,
  direction: 'horizontal' | 'vertical' = 'horizontal'
): string {
  let startX: number, startY: number, endX: number, endY: number;
  
  if (direction === 'horizontal') {
    // Source handle on right, target handle on left
    startX = sourcePos.x + nodeWidth;
    startY = sourcePos.y + nodeHeight / 2;
    endX = targetPos.x;
    endY = targetPos.y + nodeHeight / 2;
  } else {
    // Source handle on bottom, target handle on top
    startX = sourcePos.x + nodeWidth / 2;
    startY = sourcePos.y + nodeHeight;
    endX = targetPos.x + nodeWidth / 2;
    endY = targetPos.y;
  }
  
  // Calculate control points for smooth Bézier curve
  const dx = endX - startX;
  const dy = endY - startY;
  
  let cpOffset: number;
  if (direction === 'horizontal') {
    cpOffset = Math.min(Math.abs(dx) * 0.5, 80);
  } else {
    cpOffset = Math.min(Math.abs(dy) * 0.5, 80);
  }
  
  const cp1x = direction === 'horizontal' ? startX + cpOffset : startX;
  const cp1y = direction === 'horizontal' ? startY : startY + cpOffset;
  const cp2x = direction === 'horizontal' ? endX - cpOffset : endX;
  const cp2y = direction === 'horizontal' ? endY : endY - cpOffset;
  
  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

/**
 * Find the optimal insertion position for a new block
 */
export function findInsertionPosition(
  existingBlocks: WorkflowBlock[],
  afterBlockId?: string,
  options: LayoutOptions = {}
): { x: number; y: number } {
  const opts: Required<LayoutOptions> = { ...DEFAULT_OPTIONS, ...options };
  
  if (existingBlocks.length === 0) {
    return { x: opts.startX, y: opts.startY };
  }
  
  if (afterBlockId) {
    const afterBlock = existingBlocks.find(b => b.id === afterBlockId);
    if (afterBlock) {
      if (opts.direction === 'horizontal') {
        return {
          x: afterBlock.position.x + opts.nodeWidth + opts.horizontalSpacing,
          y: afterBlock.position.y,
        };
      } else {
        return {
          x: afterBlock.position.x,
          y: afterBlock.position.y + opts.nodeHeight + opts.verticalSpacing,
        };
      }
    }
  }
  
  // Find the rightmost/bottommost block
  const lastBlock = existingBlocks.reduce((last, block) => {
    if (opts.direction === 'horizontal') {
      return block.position.x > last.position.x ? block : last;
    } else {
      return block.position.y > last.position.y ? block : last;
    }
  }, existingBlocks[0]);
  
  if (opts.direction === 'horizontal') {
    return {
      x: lastBlock.position.x + opts.nodeWidth + opts.horizontalSpacing,
      y: lastBlock.position.y,
    };
  } else {
    return {
      x: lastBlock.position.x,
      y: lastBlock.position.y + opts.nodeHeight + opts.verticalSpacing,
    };
  }
}
