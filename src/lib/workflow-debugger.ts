/**
 * Workflow Step-by-Step Debugger
 * 
 * Advanced debugging capabilities with breakpoints, data inspection,
 * and step execution. Superior to N8N's debugging experience.
 */

import { WorkflowBlock, BlockConnection, WorkflowRunLog } from '@/types/workflow';

export interface DebugSession {
  id: string;
  workflowId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  currentBlockId?: string;
  breakpoints: Set<string>;
  executionStack: ExecutionFrame[];
  variables: Map<string, any>;
  logs: DebugLog[];
  startTime?: number;
  pausedAt?: number;
  stepMode: boolean;
}

export interface ExecutionFrame {
  blockId: string;
  blockName: string;
  blockType: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped';
  input?: any;
  output?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export interface DebugLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  blockId?: string;
  data?: any;
}

export interface Breakpoint {
  blockId: string;
  condition?: string;
  hitCount: number;
  enabled: boolean;
  logMessage?: string;
}

export interface DataInspection {
  path: string;
  value: any;
  type: string;
  preview: string;
  expandable: boolean;
  children?: DataInspection[];
}

// ============================================================================
// DEBUG SESSION MANAGEMENT
// ============================================================================

/**
 * Create a new debug session
 */
export function createDebugSession(workflowId: string): DebugSession {
  return {
    id: `debug_${Date.now()}`,
    workflowId,
    status: 'idle',
    breakpoints: new Set(),
    executionStack: [],
    variables: new Map(),
    logs: [],
    stepMode: false,
  };
}

/**
 * Start debug execution
 */
export function startDebugExecution(
  session: DebugSession,
  blocks: WorkflowBlock[],
  initialData?: any
): DebugSession {
  const executionStack: ExecutionFrame[] = blocks.map(block => ({
    blockId: block.id,
    blockName: block.name,
    blockType: block.type,
    status: 'pending',
  }));

  return {
    ...session,
    status: 'running',
    executionStack,
    startTime: Date.now(),
    variables: initialData ? new Map(Object.entries(initialData)) : new Map(),
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'info',
        message: 'Démarrage de la session de debug',
      },
    ],
  };
}

/**
 * Pause execution at current point
 */
export function pauseExecution(session: DebugSession): DebugSession {
  return {
    ...session,
    status: 'paused',
    pausedAt: Date.now(),
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'info',
        message: `Exécution en pause${session.currentBlockId ? ` au bloc ${session.currentBlockId}` : ''}`,
        blockId: session.currentBlockId,
      },
    ],
  };
}

/**
 * Resume execution
 */
export function resumeExecution(session: DebugSession): DebugSession {
  return {
    ...session,
    status: 'running',
    pausedAt: undefined,
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'info',
        message: 'Reprise de l\'exécution',
      },
    ],
  };
}

/**
 * Step to next block
 */
export function stepToNextBlock(session: DebugSession): DebugSession {
  return {
    ...session,
    stepMode: true,
    status: 'running',
  };
}

/**
 * Step into current block (for sub-workflows)
 */
export function stepInto(session: DebugSession): DebugSession {
  return {
    ...session,
    stepMode: true,
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'debug',
        message: 'Step into bloc courant',
        blockId: session.currentBlockId,
      },
    ],
  };
}

/**
 * Step out of current block
 */
export function stepOut(session: DebugSession): DebugSession {
  return {
    ...session,
    stepMode: false,
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'debug',
        message: 'Step out du bloc courant',
      },
    ],
  };
}

// ============================================================================
// BREAKPOINT MANAGEMENT
// ============================================================================

/**
 * Add breakpoint to block
 */
export function addBreakpoint(
  session: DebugSession,
  blockId: string,
  options?: { condition?: string; logMessage?: string }
): DebugSession {
  const newBreakpoints = new Set(session.breakpoints);
  newBreakpoints.add(blockId);
  
  return {
    ...session,
    breakpoints: newBreakpoints,
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'debug',
        message: `Breakpoint ajouté au bloc ${blockId}`,
        blockId,
      },
    ],
  };
}

/**
 * Remove breakpoint from block
 */
export function removeBreakpoint(session: DebugSession, blockId: string): DebugSession {
  const newBreakpoints = new Set(session.breakpoints);
  newBreakpoints.delete(blockId);
  
  return {
    ...session,
    breakpoints: newBreakpoints,
  };
}

/**
 * Toggle breakpoint
 */
export function toggleBreakpoint(session: DebugSession, blockId: string): DebugSession {
  if (session.breakpoints.has(blockId)) {
    return removeBreakpoint(session, blockId);
  }
  return addBreakpoint(session, blockId);
}

/**
 * Clear all breakpoints
 */
export function clearAllBreakpoints(session: DebugSession): DebugSession {
  return {
    ...session,
    breakpoints: new Set(),
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'debug',
        message: 'Tous les breakpoints ont été supprimés',
      },
    ],
  };
}

/**
 * Check if should break at block
 */
export function shouldBreakAtBlock(
  session: DebugSession,
  blockId: string,
  context?: any
): boolean {
  if (!session.breakpoints.has(blockId)) return false;
  
  // In step mode, always break
  if (session.stepMode) return true;
  
  // TODO: Evaluate condition breakpoints
  return true;
}

// ============================================================================
// DATA INSPECTION
// ============================================================================

/**
 * Inspect data structure for debugging
 */
export function inspectData(data: any, path: string = 'root'): DataInspection {
  const type = Array.isArray(data) ? 'array' : typeof data;
  const expandable = type === 'object' || type === 'array';
  
  let preview: string;
  if (data === null) {
    preview = 'null';
  } else if (data === undefined) {
    preview = 'undefined';
  } else if (type === 'string') {
    preview = data.length > 50 ? `"${data.slice(0, 50)}..."` : `"${data}"`;
  } else if (type === 'array') {
    preview = `Array(${data.length})`;
  } else if (type === 'object') {
    const keys = Object.keys(data);
    preview = `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', ...' : ''}}`;
  } else {
    preview = String(data);
  }

  const result: DataInspection = {
    path,
    value: data,
    type,
    preview,
    expandable,
  };

  if (expandable && data) {
    result.children = [];
    const entries = type === 'array' 
      ? data.map((v: any, i: number) => [String(i), v])
      : Object.entries(data);
    
    for (const [key, value] of entries.slice(0, 100)) {
      result.children.push(inspectData(value, `${path}.${key}`));
    }
  }

  return result;
}

/**
 * Get value at path in data
 */
export function getValueAtPath(data: any, path: string): any {
  const parts = path.split('.').filter(p => p && p !== 'root');
  let current = data;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  
  return current;
}

/**
 * Format data for display
 */
export function formatDataForDisplay(data: any, maxDepth: number = 3): string {
  try {
    return JSON.stringify(data, (_, value) => {
      if (typeof value === 'function') return '[Function]';
      if (value instanceof Date) return value.toISOString();
      return value;
    }, 2);
  } catch {
    return String(data);
  }
}

// ============================================================================
// EXECUTION FRAME MANAGEMENT
// ============================================================================

/**
 * Update execution frame
 */
export function updateExecutionFrame(
  session: DebugSession,
  blockId: string,
  updates: Partial<ExecutionFrame>
): DebugSession {
  const newStack = session.executionStack.map(frame => {
    if (frame.blockId === blockId) {
      return { ...frame, ...updates };
    }
    return frame;
  });

  return {
    ...session,
    executionStack: newStack,
    currentBlockId: updates.status === 'running' ? blockId : session.currentBlockId,
  };
}

/**
 * Complete block execution
 */
export function completeBlockExecution(
  session: DebugSession,
  blockId: string,
  output: any
): DebugSession {
  const frame = session.executionStack.find(f => f.blockId === blockId);
  const duration = frame?.startTime ? Date.now() - frame.startTime : 0;

  return updateExecutionFrame(session, blockId, {
    status: 'completed',
    output,
    endTime: Date.now(),
    duration,
  });
}

/**
 * Record block error
 */
export function recordBlockError(
  session: DebugSession,
  blockId: string,
  error: string
): DebugSession {
  return {
    ...updateExecutionFrame(session, blockId, {
      status: 'error',
      error,
      endTime: Date.now(),
    }),
    status: 'error',
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level: 'error',
        message: error,
        blockId,
      },
    ],
  };
}

// ============================================================================
// DEBUG LOGS
// ============================================================================

/**
 * Add log entry
 */
export function addDebugLog(
  session: DebugSession,
  level: DebugLog['level'],
  message: string,
  options?: { blockId?: string; data?: any }
): DebugSession {
  return {
    ...session,
    logs: [
      ...session.logs,
      {
        timestamp: Date.now(),
        level,
        message,
        blockId: options?.blockId,
        data: options?.data,
      },
    ],
  };
}

/**
 * Filter logs by level
 */
export function filterLogs(
  logs: DebugLog[],
  levels: DebugLog['level'][]
): DebugLog[] {
  return logs.filter(log => levels.includes(log.level));
}

/**
 * Search logs
 */
export function searchLogs(logs: DebugLog[], query: string): DebugLog[] {
  const q = query.toLowerCase();
  return logs.filter(log =>
    log.message.toLowerCase().includes(q) ||
    (log.blockId && log.blockId.toLowerCase().includes(q))
  );
}

// ============================================================================
// EXECUTION STATISTICS
// ============================================================================

export interface ExecutionStats {
  totalBlocks: number;
  completedBlocks: number;
  errorBlocks: number;
  skippedBlocks: number;
  totalDuration: number;
  averageBlockDuration: number;
  slowestBlock?: { id: string; name: string; duration: number };
  fastestBlock?: { id: string; name: string; duration: number };
}

/**
 * Calculate execution statistics
 */
export function calculateExecutionStats(session: DebugSession): ExecutionStats {
  const completed = session.executionStack.filter(f => f.status === 'completed');
  const errors = session.executionStack.filter(f => f.status === 'error');
  const skipped = session.executionStack.filter(f => f.status === 'skipped');

  const durations = completed
    .filter(f => f.duration !== undefined)
    .map(f => ({ id: f.blockId, name: f.blockName, duration: f.duration! }));

  const totalDuration = durations.reduce((sum, d) => sum + d.duration, 0);
  const averageBlockDuration = durations.length > 0 ? totalDuration / durations.length : 0;

  const sortedByDuration = [...durations].sort((a, b) => b.duration - a.duration);

  return {
    totalBlocks: session.executionStack.length,
    completedBlocks: completed.length,
    errorBlocks: errors.length,
    skippedBlocks: skipped.length,
    totalDuration,
    averageBlockDuration,
    slowestBlock: sortedByDuration[0],
    fastestBlock: sortedByDuration[sortedByDuration.length - 1],
  };
}

// ============================================================================
// EXPORT DEBUG SESSION
// ============================================================================

/**
 * Export debug session for sharing/analysis
 */
export function exportDebugSession(session: DebugSession): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    format: 'aether-flow-debug-v1',
    session: {
      ...session,
      breakpoints: Array.from(session.breakpoints),
      variables: Object.fromEntries(session.variables),
    },
    stats: calculateExecutionStats(session),
  }, null, 2);
}
