/**
 * Workflow Self-Healing System
 * 
 * This module provides intelligent auto-repair suggestions when workflow blocks fail.
 * It can identify common failure patterns and suggest or apply fixes.
 */

import { WorkflowBlock, BlockConnection } from '@/types/workflow';
import { getBlockByType } from '@/types/block-library';

export interface RepairSuggestion {
  id: string;
  blockId: string;
  blockName: string;
  type: 'config' | 'connection' | 'endpoint' | 'auth' | 'data_format' | 'parameter';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  autoFixable: boolean;
  fix?: {
    field: string;
    oldValue: any;
    newValue: any;
  };
  hint?: string;
}

export interface DiagnosticReport {
  blockId: string;
  blockName: string;
  blockType: string;
  error: string;
  errorCode?: string;
  suggestions: RepairSuggestion[];
  context: {
    inputPreview: string;
    previousOutputs: string[];
    configuredFields: string[];
    missingFields: string[];
  };
}

// Common error patterns and their fixes
const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  type: RepairSuggestion['type'];
  suggestionFactory: (match: RegExpMatchArray, block: WorkflowBlock, error: string) => Partial<RepairSuggestion>;
}> = [
  // API endpoint errors
  {
    pattern: /404|not found|endpoint.*not.*exist/i,
    type: 'endpoint',
    suggestionFactory: (_, block) => ({
      title: 'Endpoint API introuvable',
      description: 'L\'URL de l\'API semble incorrecte ou l\'endpoint n\'existe plus.',
      autoFixable: false,
      hint: 'Vérifiez que l\'URL est correcte ou utilisez la documentation de l\'API pour trouver le nouvel endpoint.',
    }),
  },
  // Authentication errors
  {
    pattern: /401|403|unauthorized|forbidden|invalid.*key|api.*key.*invalid/i,
    type: 'auth',
    suggestionFactory: (_, block) => ({
      title: 'Erreur d\'authentification',
      description: 'La clé API ou les identifiants sont invalides ou expirés.',
      autoFixable: false,
      hint: 'Vérifiez votre clé API et assurez-vous qu\'elle est toujours active.',
    }),
  },
  // Rate limiting
  {
    pattern: /429|rate.*limit|too.*many.*requests|quota/i,
    type: 'config',
    suggestionFactory: (_, block) => ({
      title: 'Limite de requêtes atteinte',
      description: 'L\'API a bloqué les requêtes car vous avez dépassé la limite.',
      autoFixable: true,
      fix: {
        field: 'retryConfig',
        oldValue: block.config?.retryConfig,
        newValue: { enabled: true, maxRetries: 3, backoffMs: 5000 },
      },
      hint: 'Activez le retry automatique avec un délai plus long.',
    }),
  },
  // Missing required fields
  {
    pattern: /required|missing.*field|undefined.*property|cannot.*read.*property/i,
    type: 'parameter',
    suggestionFactory: (match, block) => ({
      title: 'Champ requis manquant',
      description: 'Un paramètre obligatoire n\'a pas été fourni.',
      autoFixable: false,
      hint: 'Vérifiez les paramètres requis dans les propriétés du bloc.',
    }),
  },
  // JSON parsing errors
  {
    pattern: /json|parse.*error|unexpected.*token|invalid.*json/i,
    type: 'data_format',
    suggestionFactory: () => ({
      title: 'Format de données invalide',
      description: 'Les données reçues ne sont pas au format JSON valide.',
      autoFixable: false,
      hint: 'Vérifiez que la source de données renvoie du JSON valide.',
    }),
  },
  // Template interpolation errors
  {
    pattern: /\{\{.*\}\}|template|interpolat|expression/i,
    type: 'parameter',
    suggestionFactory: (_, block) => ({
      title: 'Erreur de template',
      description: 'Une expression {{ }} dans les paramètres ne peut pas être résolue.',
      autoFixable: false,
      hint: 'Vérifiez que les chemins de données dans les {{ }} correspondent aux sorties des blocs précédents.',
    }),
  },
  // Connection/network errors
  {
    pattern: /network|timeout|econnrefused|enotfound|connection.*refused/i,
    type: 'endpoint',
    suggestionFactory: (_, block) => ({
      title: 'Erreur de connexion',
      description: 'Impossible de se connecter au serveur distant.',
      autoFixable: true,
      fix: {
        field: 'retryConfig',
        oldValue: block.config?.retryConfig,
        newValue: { enabled: true, maxRetries: 3, backoffMs: 2000 },
      },
      hint: 'Le serveur est peut-être temporairement indisponible. Essayez de réexécuter.',
    }),
  },
  // OAuth/token errors
  {
    pattern: /oauth|token.*expired|refresh.*token|access.*denied/i,
    type: 'auth',
    suggestionFactory: (_, block) => ({
      title: 'Session OAuth expirée',
      description: 'Le token d\'accès a expiré et doit être renouvelé.',
      autoFixable: false,
      hint: 'Reconnectez-vous via le bouton OAuth dans les paramètres du bloc.',
    }),
  },
  // Gmail/Email specific
  {
    pattern: /gmail.*non.*connect|email.*account.*not|no.*oauth.*token/i,
    type: 'auth',
    suggestionFactory: () => ({
      title: 'Compte email non connecté',
      description: 'Vous devez connecter votre compte Google pour utiliser ce bloc.',
      autoFixable: false,
      hint: 'Double-cliquez sur le bloc, entrez votre Client ID/Secret Google, puis cliquez sur "Connecter avec Google".',
    }),
  },
];

/**
 * Analyze a workflow execution failure and generate repair suggestions
 */
export function analyzeFailure(
  block: WorkflowBlock,
  error: string,
  errorDetails?: { code?: string; hint?: string; fields?: any[] },
  executionLogs?: any[]
): DiagnosticReport {
  const suggestions: RepairSuggestion[] = [];
  const blockDef = getBlockByType(block.type);

  // Check error patterns
  for (const { pattern, type, suggestionFactory } of ERROR_PATTERNS) {
    const match = error.match(pattern);
    if (match) {
      const suggestion = suggestionFactory(match, block, error);
      suggestions.push({
        id: `${block.id}-${type}-${Date.now()}`,
        blockId: block.id,
        blockName: block.name,
        type,
        severity: type === 'auth' || type === 'endpoint' ? 'critical' : 'warning',
        autoFixable: false,
        ...suggestion,
      } as RepairSuggestion);
    }
  }

  // Check for missing required parameters
  if (blockDef?.params) {
    const requiredParams = blockDef.params.filter(p => p.required);
    const missingParams = requiredParams.filter(p => {
      const value = block.config?.[p.key];
      return value === undefined || value === '' || value === null;
    });

    for (const param of missingParams) {
      suggestions.push({
        id: `${block.id}-missing-${param.key}`,
        blockId: block.id,
        blockName: block.name,
        type: 'parameter',
        severity: 'critical',
        title: `Paramètre manquant: ${param.label}`,
        description: `Le champ "${param.label}" est obligatoire mais n'a pas été configuré.`,
        autoFixable: param.defaultValue !== undefined,
        fix: param.defaultValue !== undefined ? {
          field: param.key,
          oldValue: undefined,
          newValue: param.defaultValue,
        } : undefined,
        hint: param.helpText || `Configurez ce champ dans les propriétés du bloc.`,
      });
    }
  }

  // Build context for the AI
  const configuredFields = Object.keys(block.config || {}).filter(k => 
    block.config[k] !== undefined && block.config[k] !== '' && block.config[k] !== null
  );
  
  const missingFields = (blockDef?.params || [])
    .filter(p => p.required)
    .filter(p => !configuredFields.includes(p.key))
    .map(p => p.label);

  // Get previous outputs from logs if available
  const previousOutputs = (executionLogs || [])
    .filter(log => log.status === 'success' && log.output)
    .map(log => `${log.blockName}: ${JSON.stringify(log.output).slice(0, 100)}...`);

  return {
    blockId: block.id,
    blockName: block.name,
    blockType: block.type,
    error,
    errorCode: errorDetails?.code,
    suggestions,
    context: {
      inputPreview: 'See execution logs',
      previousOutputs,
      configuredFields,
      missingFields,
    },
  };
}

/**
 * Apply a repair suggestion to a workflow block
 */
export function applyRepairSuggestion(
  blocks: WorkflowBlock[],
  suggestion: RepairSuggestion
): WorkflowBlock[] {
  if (!suggestion.autoFixable || !suggestion.fix) {
    throw new Error('Cette suggestion ne peut pas être appliquée automatiquement');
  }

  return blocks.map(block => {
    if (block.id === suggestion.blockId) {
      return {
        ...block,
        config: {
          ...block.config,
          [suggestion.fix!.field]: suggestion.fix!.newValue,
        },
      };
    }
    return block;
  });
}

/**
 * Generate human-readable repair message for the AI assistant
 */
export function generateRepairMessage(report: DiagnosticReport): string {
  const lines: string[] = [];
  
  lines.push(`🔧 Diagnostic : ${report.blockName}\n`);
  lines.push(`Erreur détectée : ${report.error}\n`);
  
  if (report.suggestions.length > 0) {
    lines.push(`\nSuggestions de réparation :`);
    
    for (const suggestion of report.suggestions) {
      const icon = suggestion.severity === 'critical' ? '🔴' : 
                   suggestion.severity === 'warning' ? '🟡' : '🔵';
      lines.push(`\n${icon} ${suggestion.title}`);
      lines.push(`   ${suggestion.description}`);
      if (suggestion.hint) {
        lines.push(`   💡 ${suggestion.hint}`);
      }
      if (suggestion.autoFixable) {
        lines.push(`   ✅ Correction automatique disponible`);
      }
    }
  }
  
  if (report.context.missingFields.length > 0) {
    lines.push(`\nChamps à configurer :`);
    report.context.missingFields.forEach(field => {
      lines.push(`• ${field}`);
    });
  }
  
  return lines.join('\n');
}

/**
 * Security validation patterns to detect malicious input
 */
const MALICIOUS_PATTERNS = [
  // Prompt injection attempts
  /ignore.*previous.*instructions/i,
  /forget.*everything/i,
  /you.*are.*now/i,
  /act.*as/i,
  /pretend.*to.*be/i,
  /jailbreak/i,
  /bypass.*filter/i,
  /override.*rules/i,
  
  // Code injection
  /eval\s*\(/i,
  /Function\s*\(/i,
  /<script/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
  
  // SQL injection
  /;\s*drop\s+table/i,
  /union\s+select/i,
  /'\s*or\s+'1'\s*=\s*'1/i,
  
  // Path traversal
  /\.\.\//,
  /\.\.\\/, 
];

/**
 * Validate input data for security threats
 */
export function validateInputSecurity(input: any): { safe: boolean; threats: string[] } {
  const threats: string[] = [];
  
  const checkValue = (value: any, path: string = '') => {
    if (typeof value === 'string') {
      for (const pattern of MALICIOUS_PATTERNS) {
        if (pattern.test(value)) {
          threats.push(`Suspicious pattern detected in ${path || 'input'}: ${pattern.source}`);
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => checkValue(item, `${path}[${index}]`));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => checkValue(val, path ? `${path}.${key}` : key));
    }
  };
  
  checkValue(input);
  
  return { safe: threats.length === 0, threats };
}

/**
 * Sanitize block configuration to prevent injection attacks
 */
export function sanitizeBlockConfig(config: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous patterns but keep the value usable
      let clean = value
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
      
      sanitized[key] = clean;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(v => 
        typeof v === 'object' ? sanitizeBlockConfig(v) : v
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeBlockConfig(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
