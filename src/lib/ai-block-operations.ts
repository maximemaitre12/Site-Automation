/**
 * AI Block Operations
 * Defines the operations the AI can perform on blocks
 * and validates AI requests before applying them.
 * 
 * SECURITY: All operations are validated against:
 * - Schema integrity (required fields, valid types)
 * - Protection rules (system blocks, sensitive fields)
 * - Benefit/risk evaluation (positive-only changes)
 */

import { BlockDefinition, BlockParam, BlockCategory, CATEGORY_CONFIG } from '@/types/block-library';
import { ExtendedBlockDefinition, generateCustomBlockType, validateBlockDefinition } from './block-library-extended';
import { 
  isSensitiveField, 
  evaluateBlockOperation, 
  OperationEvaluation 
} from './workflow-security';

// Types for AI operations
export type AIBlockOperation = 
  | { type: 'create_block'; block: Partial<BlockDefinition>; reason: string }
  | { type: 'update_block'; blockType: string; updates: Partial<BlockDefinition>; reason: string }
  | { type: 'delete_block'; blockType: string; reason: string }
  | { type: 'add_param'; blockType: string; param: BlockParam; reason: string }
  | { type: 'update_param'; blockType: string; paramKey: string; updates: Partial<BlockParam>; reason: string }
  | { type: 'remove_param'; blockType: string; paramKey: string; reason: string };

export interface AIOperationResult {
  success: boolean;
  message: string;
  operation: AIBlockOperation;
  blockType?: string;
  evaluation?: OperationEvaluation;
}

/**
 * Protected block types that cannot be modified or deleted by AI
 */
const AI_PROTECTED_TYPES = [
  'trigger_manual',
  'trigger_webhook', 
  'trigger_schedule',
  'condition_if',
  'loop_foreach',
  'ai_chat',
  'ai_gemini',
  'ai_openai',
];

/**
 * Required fields for a valid block definition
 */
const REQUIRED_BLOCK_FIELDS = ['name', 'description', 'category'];

/**
 * Validate an AI block operation before execution
 * Includes security checks against destructive operations
 */
export function validateAIOperation(
  operation: AIBlockOperation,
  existingBlocks: ExtendedBlockDefinition[],
  usageStats?: { totalWorkflows: number; blocksInUse: Record<string, number> }
): { valid: boolean; errors: string[]; evaluation?: OperationEvaluation } {
  const errors: string[] = [];

  // First, evaluate the operation safety
  const evaluation = evaluateBlockOperation(operation, existingBlocks, usageStats);
  
  if (!evaluation.approved) {
    errors.push(`Opération non approuvée: ${evaluation.reasoning}`);
    evaluation.risks.forEach(risk => errors.push(`⚠️ ${risk}`));
    return { valid: false, errors, evaluation };
  }

  switch (operation.type) {
    case 'create_block': {
      // Validate the block definition
      const validation = validateBlockDefinition(operation.block);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
      
      // Check if type already exists
      if (operation.block.type && existingBlocks.some(b => b.type === operation.block.type)) {
        errors.push(`Le type de bloc "${operation.block.type}" existe déjà`);
      }
      
      // Validate reason is meaningful
      if (!operation.reason || operation.reason.length < 10) {
        errors.push('La raison de création doit être explicite (min 10 caractères)');
      }

      // Check for suspicious param names (trying to inject sensitive fields)
      if (operation.block.params) {
        for (const param of operation.block.params) {
          if (isSensitiveField(param.key) && !param.type?.includes('password')) {
            // Sensitive fields must have proper type
            errors.push(`Paramètre sensible "${param.key}" doit être de type "password" ou explicitement sécurisé`);
          }
        }
      }
      break;
    }

    case 'update_block': {
      // Check if block exists and is custom
      const block = existingBlocks.find(b => b.type === operation.blockType);
      if (!block) {
        errors.push(`Bloc "${operation.blockType}" introuvable`);
      } else if (!block.isCustom) {
        errors.push(`Le bloc "${operation.blockType}" est un bloc système et ne peut pas être modifié. Créez une copie personnalisée.`);
      } else if (AI_PROTECTED_TYPES.includes(operation.blockType)) {
        errors.push(`Le bloc "${operation.blockType}" est protégé contre les modifications automatiques`);
      }

      // Prevent removing required fields
      if (operation.updates.params) {
        const originalParams = block?.params || [];
        for (const origParam of originalParams) {
          if (origParam.required) {
            const updatedParam = operation.updates.params.find(p => p.key === origParam.key);
            if (!updatedParam) {
              errors.push(`Impossible de supprimer le paramètre requis "${origParam.label}"`);
            }
          }
        }
      }
      break;
    }

    case 'delete_block': {
      const block = existingBlocks.find(b => b.type === operation.blockType);
      if (!block) {
        errors.push(`Bloc "${operation.blockType}" introuvable`);
      } else if (!block.isCustom) {
        errors.push(`Le bloc "${operation.blockType}" est un bloc système et ne peut pas être supprimé`);
      } else if (AI_PROTECTED_TYPES.includes(operation.blockType)) {
        errors.push(`Le bloc "${operation.blockType}" est protégé contre la suppression`);
      }

      // Check usage - this is critical
      if (usageStats?.blocksInUse[operation.blockType] ?? 0 > 0) {
        errors.push(`BLOQUÉ: Le bloc est utilisé dans ${usageStats!.blocksInUse[operation.blockType]} workflows`);
      }
      break;
    }

    case 'add_param': {
      const block = existingBlocks.find(b => b.type === operation.blockType);
      if (!block) {
        errors.push(`Bloc "${operation.blockType}" introuvable`);
      } else if (!block.isCustom) {
        errors.push(`Impossible d'ajouter un paramètre à un bloc système. Créez une copie personnalisée.`);
      } else {
        // Check param doesn't already exist
        if (block.params?.some(p => p.key === operation.param.key)) {
          errors.push(`Le paramètre "${operation.param.key}" existe déjà`);
        }
        // Validate param
        if (!operation.param.key || !operation.param.label || !operation.param.type) {
          errors.push('Le paramètre doit avoir un key, label et type');
        }
        // Validate sensitive field handling
        if (isSensitiveField(operation.param.key)) {
          if (operation.param.type !== 'string') {
            errors.push('Les paramètres sensibles doivent être de type string');
          }
          // Auto-fix: Add security hint
          operation.param.helpText = (operation.param.helpText || '') + ' ⚠️ Donnée sensible - ne sera pas affichée';
        }
      }
      break;
    }

    case 'update_param': {
      const block = existingBlocks.find(b => b.type === operation.blockType);
      if (!block) {
        errors.push(`Bloc "${operation.blockType}" introuvable`);
      } else if (!block.isCustom) {
        errors.push(`Impossible de modifier un paramètre d'un bloc système`);
      } else {
        const param = block.params?.find(p => p.key === operation.paramKey);
        if (!param) {
          errors.push(`Paramètre "${operation.paramKey}" introuvable`);
        } else if (param.required && operation.updates.required === false) {
          // Downgrading required to optional needs justification
          if (!operation.reason.toLowerCase().includes('optional') && !operation.reason.toLowerCase().includes('optionnel')) {
            errors.push(`Changer un paramètre requis en optionnel nécessite une justification explicite`);
          }
        }
      }
      break;
    }

    case 'remove_param': {
      const block = existingBlocks.find(b => b.type === operation.blockType);
      if (!block) {
        errors.push(`Bloc "${operation.blockType}" introuvable`);
      } else if (!block.isCustom) {
        errors.push(`Impossible de supprimer un paramètre d'un bloc système`);
      } else {
        const param = block.params?.find(p => p.key === operation.paramKey);
        if (!param) {
          errors.push(`Paramètre "${operation.paramKey}" introuvable`);
        } else if (param.required) {
          errors.push(`Le paramètre "${operation.paramKey}" est requis et ne peut pas être supprimé`);
        } else if (isSensitiveField(operation.paramKey)) {
          errors.push(`Suppression de paramètre sensible "${operation.paramKey}" bloquée pour sécurité`);
        }
      }
      break;
    }
  }

  return { valid: errors.length === 0, errors, evaluation };
}

/**
 * Parse AI response to extract block operations
 */
export function parseAIBlockOperations(aiResponse: string): AIBlockOperation[] {
  const operations: AIBlockOperation[] = [];
  
  try {
    // Look for JSON block in the response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        return parsed.filter(op => 
          op.type && 
          ['create_block', 'update_block', 'delete_block', 'add_param', 'update_param', 'remove_param'].includes(op.type)
        );
      }
    }
    
    // Try to parse the whole response as JSON
    if (aiResponse.trim().startsWith('[') || aiResponse.trim().startsWith('{')) {
      const parsed = JSON.parse(aiResponse);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed.type) {
        return [parsed];
      }
    }
  } catch {
    // Not valid JSON, return empty
  }
  
  return operations;
}

/**
 * Generate a summary of operations for user confirmation
 */
export function summarizeOperations(operations: AIBlockOperation[]): string {
  const summaries = operations.map(op => {
    switch (op.type) {
      case 'create_block':
        return `✨ Créer le bloc "${op.block.name}" (${op.block.category})`;
      case 'update_block':
        return `📝 Modifier le bloc "${op.blockType}"`;
      case 'delete_block':
        return `🗑️ Supprimer le bloc "${op.blockType}"`;
      case 'add_param':
        return `➕ Ajouter le paramètre "${op.param.label}" au bloc "${op.blockType}"`;
      case 'update_param':
        return `📝 Modifier le paramètre "${op.paramKey}" du bloc "${op.blockType}"`;
      case 'remove_param':
        return `➖ Supprimer le paramètre "${op.paramKey}" du bloc "${op.blockType}"`;
    }
  });
  
  return summaries.join('\n');
}

/**
 * Create a new block from a template (copy an existing block)
 */
export function createBlockFromTemplate(
  sourceBlock: ExtendedBlockDefinition,
  newName: string
): Partial<BlockDefinition> {
  return {
    type: generateCustomBlockType(newName),
    name: newName,
    category: sourceBlock.category,
    subcategory: sourceBlock.subcategory,
    icon: sourceBlock.icon,
    color: sourceBlock.color,
    description: `Copie personnalisée de ${sourceBlock.name}`,
    params: JSON.parse(JSON.stringify(sourceBlock.params || [])),
    inputs: sourceBlock.inputs,
    outputs: sourceBlock.outputs,
    inputPorts: sourceBlock.inputPorts,
    outputPorts: sourceBlock.outputPorts,
    outputLabels: sourceBlock.outputLabels,
    isRealAction: sourceBlock.isRealAction,
    requiresAuth: sourceBlock.requiresAuth,
    popular: false,
  };
}

/**
 * Generate AI prompt context about available categories
 */
export function getBlockLibraryContext(): string {
  const categories = Object.entries(CATEGORY_CONFIG)
    .map(([key, config]) => `- ${key}: ${config.label} (${config.description})`)
    .join('\n');
  
  return `Catégories disponibles pour les blocs:
${categories}

Types de paramètres disponibles:
- string: Champ texte simple
- text: Zone de texte multiligne
- number: Nombre
- boolean: Interrupteur on/off
- select: Liste déroulante (nécessite options)
- multiselect: Sélection multiple
- json: Éditeur JSON
- expression: Supporte les expressions {{ }}
- code: Éditeur de code
- keyvalue: Paires clé/valeur
- cron: Expression cron

Sections pour les paramètres:
- main: Paramètres principaux (toujours visibles)
- settings: Options supplémentaires
- advanced: Configuration avancée (masquée par défaut)`;
}
