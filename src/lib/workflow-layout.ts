// ==========================================
// AETHER FLOW - Auto-Layout Algorithm V2
// Column-Based BFS Horizontal Layout (N8N-Style)
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

// ==========================================
// LAYOUT CONFIGURATION
// ==========================================

interface LayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  columnSpacing?: number;  // Horizontal spacing between columns
  rowSpacing?: number;     // Vertical spacing between blocks in same column
  startX?: number;
  startY?: number;
  direction?: 'horizontal' | 'vertical';
}

const DEFAULT_OPTIONS: Required<LayoutOptions> = {
  nodeWidth: 80,             // N8N style compact square node
  nodeHeight: 120,           // Total height including label below (80 card + 40 label)
  columnSpacing: 100,        // Space between columns (horizontal gap)
  rowSpacing: 60,            // Space between rows in same column
  startX: 80,
  startY: 80,
  direction: 'horizontal',
};

// ==========================================
// GRAPH ANALYSIS
// ==========================================

/**
 * Build adjacency lists (forward and backward)
 */
function buildGraphMaps(
  blocks: WorkflowBlock[],
  connections: BlockConnection[]
): { 
  forward: Map<string, string[]>; 
  backward: Map<string, string[]>;
  blockMap: Map<string, WorkflowBlock>;
} {
  const forward = new Map<string, string[]>();
  const backward = new Map<string, string[]>();
  const blockMap = new Map<string, WorkflowBlock>();
  
  blocks.forEach(block => {
    forward.set(block.id, []);
    backward.set(block.id, []);
    blockMap.set(block.id, block);
  });
  
  connections.forEach(conn => {
    const targets = forward.get(conn.sourceBlockId) || [];
    targets.push(conn.targetBlockId);
    forward.set(conn.sourceBlockId, targets);
    
    const sources = backward.get(conn.targetBlockId) || [];
    sources.push(conn.sourceBlockId);
    backward.set(conn.targetBlockId, sources);
  });
  
  return { forward, backward, blockMap };
}

/**
 * Find root nodes (nodes with no incoming connections) - these are triggers
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
 * BFS to assign column depth to each node
 * Uses longest path to ensure proper column placement for merge nodes
 */
function assignColumnDepths(
  blocks: WorkflowBlock[],
  connections: BlockConnection[]
): Map<string, number> {
  const depths = new Map<string, number>();
  const { forward, backward } = buildGraphMaps(blocks, connections);
  const roots = findRootNodes(blocks, connections);
  
  // Initialize all blocks to column 0
  blocks.forEach(block => depths.set(block.id, 0));
  
  // BFS with longest path calculation
  const queue: string[] = [...roots];
  const visited = new Set<string>();
  
  // Multiple passes to handle complex graphs
  for (let pass = 0; pass < blocks.length; pass++) {
    queue.length = 0;
    queue.push(...roots);
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const currentDepth = depths.get(nodeId) || 0;
      
      const children = forward.get(nodeId) || [];
      children.forEach(childId => {
        const childCurrentDepth = depths.get(childId) || 0;
        const newDepth = currentDepth + 1;
        
        // Always take the LONGEST path (for proper merge alignment)
        if (newDepth > childCurrentDepth) {
          depths.set(childId, newDepth);
        }
        
        if (!visited.has(childId)) {
          queue.push(childId);
        }
      });
      
      visited.add(nodeId);
    }
  }
  
  return depths;
}

/**
 * Group blocks by their column (depth)
 */
function groupByColumn(
  blocks: WorkflowBlock[],
  depths: Map<string, number>
): Map<number, string[]> {
  const columns = new Map<number, string[]>();
  
  blocks.forEach(block => {
    const col = depths.get(block.id) || 0;
    const group = columns.get(col) || [];
    group.push(block.id);
    columns.set(col, group);
  });
  
  return columns;
}

/**
 * Optimize row ordering within columns to minimize edge crossings
 * Uses barycenter heuristic
 */
function optimizeRowOrder(
  columns: Map<number, string[]>,
  connections: BlockConnection[],
  blockMap: Map<string, WorkflowBlock>
): Map<number, string[]> {
  const { backward } = buildGraphMaps([...blockMap.values()], connections);
  
  // Sort columns by index
  const sortedCols = Array.from(columns.keys()).sort((a, b) => a - b);
  
  sortedCols.forEach((colIndex, i) => {
    if (i === 0) return; // First column stays as is
    
    const colBlocks = columns.get(colIndex) || [];
    
    // Calculate barycenter for each block (average Y of parents)
    const barycenters = colBlocks.map(blockId => {
      const parents = backward.get(blockId) || [];
      if (parents.length === 0) return { blockId, barycenter: 0 };
      
      const parentPositions = parents.map(parentId => {
        const parentBlock = blockMap.get(parentId);
        return parentBlock?.position?.y || 0;
      });
      
      const avgY = parentPositions.reduce((a, b) => a + b, 0) / parentPositions.length;
      return { blockId, barycenter: avgY };
    });
    
    // Sort by barycenter
    barycenters.sort((a, b) => a.barycenter - b.barycenter);
    columns.set(colIndex, barycenters.map(b => b.blockId));
  });
  
  return columns;
}

// ==========================================
// POSITION CALCULATION
// ==========================================

/**
 * Calculate positions using column-based layout
 */
function calculateColumnPositions(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  options: Required<LayoutOptions>
): BlockPositionMap {
  const positions: BlockPositionMap = {};
  
  if (blocks.length === 0) return positions;
  
  // Step 1: Assign column depths
  const depths = assignColumnDepths(blocks, connections);
  
  // Step 2: Group by column
  const { blockMap } = buildGraphMaps(blocks, connections);
  let columns = groupByColumn(blocks, depths);
  
  // Step 3: Optimize row ordering
  columns = optimizeRowOrder(columns, connections, blockMap);
  
  // Step 4: Calculate positions
  const sortedCols = Array.from(columns.keys()).sort((a, b) => a - b);
  
  // Find max column height for vertical centering
  let maxRowCount = 0;
  columns.forEach(col => {
    if (col.length > maxRowCount) maxRowCount = col.length;
  });
  
  const totalMaxHeight = maxRowCount * options.nodeHeight + (maxRowCount - 1) * options.rowSpacing;
  const centerY = options.startY + totalMaxHeight / 2;
  
  sortedCols.forEach(colIndex => {
    const colBlocks = columns.get(colIndex) || [];
    const x = options.startX + colIndex * (options.nodeWidth + options.columnSpacing);
    
    // Center this column vertically
    const colHeight = colBlocks.length * options.nodeHeight + (colBlocks.length - 1) * options.rowSpacing;
    const startY = centerY - colHeight / 2;
    
    colBlocks.forEach((blockId, rowIndex) => {
      positions[blockId] = {
        x,
        y: startY + rowIndex * (options.nodeHeight + options.rowSpacing),
      };
    });
  });
  
  return positions;
}

// ==========================================
// MAIN AUTO-LAYOUT FUNCTION
// ==========================================

/**
 * Main auto-layout function - Column-based BFS horizontal layout
 */
export function autoLayoutBlocks(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  options: LayoutOptions = {}
): LayoutResult {
  const opts: Required<LayoutOptions> = { 
    ...DEFAULT_OPTIONS, 
    ...options,
    // Map old property names for compatibility
    columnSpacing: options.columnSpacing ?? (options as any).horizontalSpacing ?? DEFAULT_OPTIONS.columnSpacing,
    rowSpacing: options.rowSpacing ?? (options as any).verticalSpacing ?? DEFAULT_OPTIONS.rowSpacing,
  };
  
  if (blocks.length === 0) {
    return {
      positions: {},
      levels: [],
      totalWidth: 0,
      totalHeight: 0,
    };
  }
  
  // Calculate positions using column-based algorithm
  const positions = calculateColumnPositions(blocks, connections, opts);
  
  // Generate levels data for compatibility
  const depths = assignColumnDepths(blocks, connections);
  const columns = groupByColumn(blocks, depths);
  const levels: LayoutLevel[] = [];
  
  Array.from(columns.keys()).sort((a, b) => a - b).forEach(col => {
    levels.push({
      level: col,
      blockIds: columns.get(col) || [],
    });
  });
  
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
 * Auto-layout specifically for adding a new block
 * Returns suggested position for the new block
 */
export function suggestNewBlockPosition(
  existingBlocks: WorkflowBlock[],
  connections: BlockConnection[],
  sourceBlockId?: string,
  options: LayoutOptions = {}
): { x: number; y: number } {
  const opts: Required<LayoutOptions> = { ...DEFAULT_OPTIONS, ...options };
  
  if (existingBlocks.length === 0) {
    return { x: opts.startX, y: opts.startY };
  }
  
  if (sourceBlockId) {
    const sourceBlock = existingBlocks.find(b => b.id === sourceBlockId);
    if (sourceBlock) {
      // Find siblings (other blocks connected to same source)
      const siblingConnections = connections.filter(c => c.sourceBlockId === sourceBlockId);
      const siblingCount = siblingConnections.length;
      
      // Position to the right, offset down if there are siblings
      return {
        x: sourceBlock.position.x + opts.nodeWidth + opts.columnSpacing,
        y: sourceBlock.position.y + siblingCount * (opts.nodeHeight + opts.rowSpacing),
      };
    }
  }
  
  // Find rightmost block
  const rightmostBlock = existingBlocks.reduce((last, block) => 
    block.position.x > last.position.x ? block : last
  , existingBlocks[0]);
  
  return {
    x: rightmostBlock.position.x + opts.nodeWidth + opts.columnSpacing,
    y: rightmostBlock.position.y,
  };
}

// ==========================================
// BOUNDING BOX & UTILITIES
// ==========================================

/**
 * Calculate bounding box of all positioned blocks
 */
export function calculateBoundingBox(
  positions: BlockPositionMap,
  nodeWidth: number = DEFAULT_OPTIONS.nodeWidth,
  nodeHeight: number = DEFAULT_OPTIONS.nodeHeight
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
    DEFAULT_OPTIONS.nodeWidth,
    DEFAULT_OPTIONS.nodeHeight
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
  nodeWidth: number = DEFAULT_OPTIONS.nodeWidth,
  nodeHeight: number = DEFAULT_OPTIONS.nodeHeight,
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
    cpOffset = Math.max(Math.abs(dx) * 0.4, 60);
  } else {
    cpOffset = Math.max(Math.abs(dy) * 0.4, 60);
  }
  
  const cp1x = direction === 'horizontal' ? startX + cpOffset : startX;
  const cp1y = direction === 'horizontal' ? startY : startY + cpOffset;
  const cp2x = direction === 'horizontal' ? endX - cpOffset : endX;
  const cp2y = direction === 'horizontal' ? endY : endY - cpOffset;
  
  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

/**
 * Find the optimal insertion position for a new block (legacy compatibility)
 */
export function findInsertionPosition(
  existingBlocks: WorkflowBlock[],
  afterBlockId?: string,
  options: LayoutOptions = {}
): { x: number; y: number } {
  return suggestNewBlockPosition(existingBlocks, [], afterBlockId, options);
}
