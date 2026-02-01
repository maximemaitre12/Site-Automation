/**
 * Workflow AI Context Provider
 * 
 * This module collects and formats workflow execution data for the AI assistant.
 * The AI uses this context to provide better suggestions and diagnostics.
 */

import { WorkflowBlock, BlockConnection, WorkflowRunLog } from '@/types/workflow';
import { getBlockByType, BlockCategory } from '@/types/block-library';
import { DiagnosticReport, analyzeFailure } from './workflow-self-healing';

export interface BlockAnalysis {
  id: string;
  name: string;
  type: string;
  category: BlockCategory;
  status: 'configured' | 'partial' | 'unconfigured';
  configuredParams: string[];
  missingParams: string[];
  hasConnections: {
    inputs: number;
    outputs: number;
  };
  issues: string[];
}

export interface WorkflowAnalysis {
  name: string;
  blockCount: number;
  connectionCount: number;
  hasTrigger: boolean;
  hasOutput: boolean;
  blocks: BlockAnalysis[];
  issues: string[];
  suggestions: string[];
}

export interface ExecutionAnalysis {
  runId?: string;
  success: boolean;
  totalDuration: number;
  blockResults: {
    blockId: string;
    blockName: string;
    status: 'success' | 'error' | 'skipped' | 'pending';
    duration: number;
    inputPreview: string;
    outputPreview: string;
    error?: string;
  }[];
  dataFlow: {
    from: string;
    to: string;
    dataSize: number;
  }[];
  bottlenecks: string[];
  diagnostics: DiagnosticReport[];
}

/**
 * Analyze workflow structure for the AI
 */
export function analyzeWorkflowStructure(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  workflowName?: string
): WorkflowAnalysis {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const blockAnalyses: BlockAnalysis[] = [];

  // Analyze each block
  for (const block of blocks) {
    const def = getBlockByType(block.type);
    const blockIssues: string[] = [];

    // Check required parameters
    const requiredParams = def?.params?.filter(p => p.required) || [];
    const configuredParams: string[] = [];
    const missingParams: string[] = [];

    for (const param of requiredParams) {
      const value = block.config?.[param.key];
      if (value !== undefined && value !== '' && value !== null) {
        configuredParams.push(param.label);
      } else {
        missingParams.push(param.label);
        blockIssues.push(`${param.label} non configuré`);
      }
    }

    // Check connections
    const inputConnections = connections.filter(c => c.targetBlockId === block.id).length;
    const outputConnections = connections.filter(c => c.sourceBlockId === block.id).length;

    // Validate block has necessary connections
    const isTrigger = block.type.startsWith('trigger_') || block.type.includes('_trigger');
    if (!isTrigger && inputConnections === 0 && blocks.length > 1) {
      blockIssues.push('Bloc non connecté en entrée');
    }

    // Determine configuration status
    let status: 'configured' | 'partial' | 'unconfigured';
    if (missingParams.length === 0) {
      status = 'configured';
    } else if (configuredParams.length > 0) {
      status = 'partial';
    } else {
      status = 'unconfigured';
    }

    // Get category from def, default to 'core'
    const blockCategory: BlockCategory = def?.category || 'core';

    blockAnalyses.push({
      id: block.id,
      name: block.name,
      type: block.type,
      category: blockCategory,
      status,
      configuredParams,
      missingParams,
      hasConnections: {
        inputs: inputConnections,
        outputs: outputConnections,
      },
      issues: blockIssues,
    });
  }

  // Global workflow checks
  const triggers = blocks.filter(b => 
    b.type.startsWith('trigger_') || b.type.includes('_trigger')
  );
  const hasTrigger = triggers.length > 0;

  if (!hasTrigger && blocks.length > 0) {
    issues.push('Aucun trigger défini - le workflow ne peut pas démarrer automatiquement');
    suggestions.push('Ajoute un bloc Trigger (Manuel, Webhook, Email, Schedule) pour démarrer le workflow');
  }

  if (triggers.length > 1) {
    issues.push('Plusieurs triggers détectés - seul le premier sera utilisé');
  }

  // Check for orphan blocks
  const orphanBlocks = blockAnalyses.filter(
    b => b.hasConnections.inputs === 0 && b.hasConnections.outputs === 0 && blocks.length > 1
  );
  if (orphanBlocks.length > 0) {
    issues.push(`${orphanBlocks.length} bloc(s) isolé(s) sans connexions`);
    suggestions.push('Connecte tous les blocs pour créer un flux de données cohérent');
  }

  // Check for unconfigured critical blocks
  const unconfiguredBlocks = blockAnalyses.filter(b => b.status === 'unconfigured');
  if (unconfiguredBlocks.length > 0) {
    issues.push(`${unconfiguredBlocks.length} bloc(s) non configuré(s)`);
  }

  // Check if workflow has an actionable output
  const outputBlocks = blocks.filter(b => 
    b.type.includes('send_email') || 
    b.type.includes('document') ||
    b.type.includes('notification') ||
    b.type.includes('webhook') ||
    b.type.includes('api_call')
  );
  const hasOutput = outputBlocks.length > 0;

  if (!hasOutput && blocks.length > 1) {
    suggestions.push('Ajoute un bloc d\'action finale (Email, Document, Notification) pour produire un résultat visible');
  }

  return {
    name: workflowName || 'Workflow sans nom',
    blockCount: blocks.length,
    connectionCount: connections.length,
    hasTrigger,
    hasOutput,
    blocks: blockAnalyses,
    issues,
    suggestions,
  };
}

/**
 * Analyze execution logs for the AI
 */
export function analyzeExecution(
  blocks: WorkflowBlock[],
  logs: WorkflowRunLog[],
  result: { success: boolean; error?: string; failedBlockId?: string }
): ExecutionAnalysis {
  const blockResults = logs.map(log => {
    // Generate previews
    const inputPreview = typeof log.input === 'string'
      ? log.input.slice(0, 200)
      : JSON.stringify(log.input || {}).slice(0, 200);

    const outputPreview = typeof log.output === 'string'
      ? log.output.slice(0, 200)
      : JSON.stringify(log.output || {}).slice(0, 200);

    // Normalize status to expected types
    let normalizedStatus: 'success' | 'error' | 'skipped' | 'pending' = 'pending';
    if (log.status === 'success') normalizedStatus = 'success';
    else if (log.status === 'error') normalizedStatus = 'error';
    else if (log.status === 'skipped') normalizedStatus = 'skipped';
    else if (log.status === 'pending' || log.status === 'running') normalizedStatus = 'pending';
    // 'cancelled' and other statuses map to 'pending' as fallback

    return {
      blockId: log.blockId,
      blockName: log.blockName,
      status: normalizedStatus,
      duration: log.duration,
      inputPreview,
      outputPreview,
      error: log.error,
    };
  });

  // Calculate data flow between blocks
  const dataFlow: ExecutionAnalysis['dataFlow'] = [];
  for (let i = 0; i < logs.length - 1; i++) {
    const current = logs[i];
    const next = logs[i + 1];
    if (current.status === 'success') {
      dataFlow.push({
        from: current.blockName,
        to: next.blockName,
        dataSize: JSON.stringify(current.output || {}).length,
      });
    }
  }

  // Identify bottlenecks (blocks taking > 5 seconds)
  const bottlenecks = logs
    .filter(log => log.duration > 5000)
    .map(log => `${log.blockName} (${(log.duration / 1000).toFixed(1)}s)`);

  // Generate diagnostics for failed blocks
  const diagnostics: DiagnosticReport[] = [];
  if (!result.success && result.failedBlockId) {
    const failedBlock = blocks.find(b => b.id === result.failedBlockId);
    const failedLog = logs.find(l => l.blockId === result.failedBlockId);
    
    if (failedBlock && failedLog?.error) {
      const diagnostic = analyzeFailure(
        failedBlock,
        failedLog.error,
        (failedLog as any).errorDetails,
        logs
      );
      diagnostics.push(diagnostic);
    }
  }

  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);

  return {
    success: result.success,
    totalDuration,
    blockResults,
    dataFlow,
    bottlenecks,
    diagnostics,
  };
}

/**
 * Generate a compact context summary for the AI system prompt
 */
export function generateAIContext(
  workflowAnalysis: WorkflowAnalysis,
  executionAnalysis?: ExecutionAnalysis
): string {
  const sections: string[] = [];

  // Workflow structure
  sections.push(`WORKFLOW: "${workflowAnalysis.name}"`);
  sections.push(`- ${workflowAnalysis.blockCount} blocs, ${workflowAnalysis.connectionCount} connexions`);
  sections.push(`- Trigger: ${workflowAnalysis.hasTrigger ? 'Oui' : 'Non'}`);
  
  if (workflowAnalysis.issues.length > 0) {
    sections.push(`\nPROBLÈMES DÉTECTÉS:`);
    workflowAnalysis.issues.forEach(issue => sections.push(`⚠️ ${issue}`));
  }

  // Block status summary
  const unconfigured = workflowAnalysis.blocks.filter(b => b.status !== 'configured');
  if (unconfigured.length > 0) {
    sections.push(`\nBLOCS À CONFIGURER:`);
    unconfigured.forEach(b => {
      sections.push(`• ${b.name}: ${b.missingParams.join(', ')}`);
    });
  }

  // Execution results if available
  if (executionAnalysis) {
    sections.push(`\nDERNIÈRE EXÉCUTION: ${executionAnalysis.success ? '✅ Succès' : '❌ Échec'}`);
    sections.push(`Durée totale: ${(executionAnalysis.totalDuration / 1000).toFixed(1)}s`);

    if (!executionAnalysis.success && executionAnalysis.diagnostics.length > 0) {
      const diag = executionAnalysis.diagnostics[0];
      sections.push(`\nERREUR dans "${diag.blockName}":`);
      sections.push(`${diag.error}`);
      
      if (diag.suggestions.length > 0) {
        sections.push(`\nSUGGESTIONS DE RÉPARATION:`);
        diag.suggestions.forEach(s => {
          sections.push(`• ${s.title}: ${s.description}`);
          if (s.autoFixable) sections.push(`  [Correction automatique disponible]`);
        });
      }
    }

    if (executionAnalysis.bottlenecks.length > 0) {
      sections.push(`\nGOULOTS D'ÉTRANGLEMENT:`);
      executionAnalysis.bottlenecks.forEach(b => sections.push(`• ${b}`));
    }
  }

  return sections.join('\n');
}

/**
 * Store workflow analytics for learning (anonymized)
 * This helps improve suggestions over time
 */
export interface WorkflowPattern {
  blockTypes: string[];
  connectionPattern: string;
  successRate: number;
  commonErrors: string[];
  avgExecutionTime: number;
}

export function extractWorkflowPattern(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  executionHistory: { success: boolean; duration: number; error?: string }[]
): WorkflowPattern {
  const blockTypes = blocks.map(b => b.type).sort();
  
  // Create a simplified connection pattern string
  const connectionPattern = connections
    .map(c => {
      const source = blocks.find(b => b.id === c.sourceBlockId)?.type || 'unknown';
      const target = blocks.find(b => b.id === c.targetBlockId)?.type || 'unknown';
      return `${source}->${target}`;
    })
    .sort()
    .join('|');

  const successCount = executionHistory.filter(e => e.success).length;
  const successRate = executionHistory.length > 0 
    ? successCount / executionHistory.length 
    : 0;

  const commonErrors = executionHistory
    .filter(e => e.error)
    .map(e => e.error!)
    .reduce((acc, error) => {
      // Simplify error for pattern matching
      const simplified = error.replace(/\d+/g, 'N').slice(0, 50);
      acc[simplified] = (acc[simplified] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedErrors = Object.entries(commonErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([error]) => error);

  const avgExecutionTime = executionHistory.length > 0
    ? executionHistory.reduce((sum, e) => sum + e.duration, 0) / executionHistory.length
    : 0;

  return {
    blockTypes,
    connectionPattern,
    successRate,
    commonErrors: sortedErrors,
    avgExecutionTime,
  };
}
