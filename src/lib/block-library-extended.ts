/**
 * Extended Block Library
 * Merges the static BLOCK_LIBRARY with custom blocks from the database
 * This is the source of truth for all available blocks in the UI
 */

import { 
  BLOCK_LIBRARY, 
  BlockDefinition, 
  BlockCategory, 
  CATEGORY_CONFIG 
} from '@/types/block-library';

export interface ExtendedBlockDefinition extends BlockDefinition {
  isCustom?: boolean;
  customId?: string;
  sourceBlockType?: string;
  modificationReason?: string;
}

/**
 * Merge static library with custom blocks
 * Custom blocks with the same type override static ones
 */
export function mergeBlockLibraries(
  staticBlocks: BlockDefinition[],
  customBlocks: ExtendedBlockDefinition[]
): ExtendedBlockDefinition[] {
  const merged = new Map<string, ExtendedBlockDefinition>();
  
  // Add static blocks first
  for (const block of staticBlocks) {
    merged.set(block.type, { ...block, isCustom: false });
  }
  
  // Custom blocks override or add new
  for (const customBlock of customBlocks) {
    const existing = merged.get(customBlock.type);
    
    if (existing && !existing.isCustom) {
      // This is a modification of an existing block - mark as modified
      merged.set(customBlock.type, {
        ...customBlock,
        isCustom: true,
        sourceBlockType: customBlock.type,
      });
    } else {
      // New custom block
      merged.set(customBlock.type, customBlock);
    }
  }
  
  return Array.from(merged.values());
}

/**
 * Get blocks grouped by category
 */
export function getBlocksByCategory(
  blocks: ExtendedBlockDefinition[]
): Record<BlockCategory, ExtendedBlockDefinition[]> {
  const grouped: Record<BlockCategory, ExtendedBlockDefinition[]> = {
    trigger: [],
    flow: [],
    ai: [],
    data_transform: [],
    core: [],
    integrations: [],
    output: [],
  };
  
  for (const block of blocks) {
    if (grouped[block.category]) {
      grouped[block.category].push(block);
    }
  }
  
  return grouped;
}

/**
 * Search blocks with custom block priority
 */
export function searchExtendedBlocks(
  blocks: ExtendedBlockDefinition[],
  query: string
): ExtendedBlockDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return blocks.filter(block => 
    block.name.toLowerCase().includes(q) ||
    block.description.toLowerCase().includes(q) ||
    block.type.toLowerCase().includes(q) ||
    block.category.toLowerCase().includes(q)
  ).sort((a, b) => {
    // Custom blocks first
    if (a.isCustom && !b.isCustom) return -1;
    if (!a.isCustom && b.isCustom) return 1;
    // Then by name match relevance
    const aNameMatch = a.name.toLowerCase().startsWith(q);
    const bNameMatch = b.name.toLowerCase().startsWith(q);
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;
    return 0;
  });
}

/**
 * Get popular blocks including custom ones marked as popular
 */
export function getPopularExtendedBlocks(
  blocks: ExtendedBlockDefinition[]
): ExtendedBlockDefinition[] {
  return blocks.filter(b => b.popular);
}

/**
 * Find a block by type in the extended library
 */
export function getExtendedBlockByType(
  blocks: ExtendedBlockDefinition[],
  type: string
): ExtendedBlockDefinition | undefined {
  return blocks.find(b => b.type === type);
}

/**
 * Check if a block type is custom
 */
export function isCustomBlock(
  blocks: ExtendedBlockDefinition[],
  type: string
): boolean {
  const block = blocks.find(b => b.type === type);
  return block?.isCustom === true;
}

/**
 * Get all custom blocks
 */
export function getCustomBlocks(
  blocks: ExtendedBlockDefinition[]
): ExtendedBlockDefinition[] {
  return blocks.filter(b => b.isCustom === true);
}

/**
 * Get all modified blocks (custom blocks that override static ones)
 */
export function getModifiedBlocks(
  blocks: ExtendedBlockDefinition[]
): ExtendedBlockDefinition[] {
  const staticTypes = new Set(BLOCK_LIBRARY.map(b => b.type));
  return blocks.filter(b => b.isCustom && staticTypes.has(b.type));
}

/**
 * Get all new custom blocks (not overriding static ones)
 */
export function getNewCustomBlocks(
  blocks: ExtendedBlockDefinition[]
): ExtendedBlockDefinition[] {
  const staticTypes = new Set(BLOCK_LIBRARY.map(b => b.type));
  return blocks.filter(b => b.isCustom && !staticTypes.has(b.type));
}

/**
 * Generate a unique type for a new custom block
 */
export function generateCustomBlockType(baseName: string): string {
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  
  return `custom_${sanitized}_${Date.now().toString(36)}`;
}

/**
 * Validate a block definition before saving
 */
export function validateBlockDefinition(
  def: Partial<BlockDefinition>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!def.type || def.type.length < 2) {
    errors.push('Le type du bloc est requis (min 2 caractères)');
  }
  
  if (!def.name || def.name.length < 2) {
    errors.push('Le nom du bloc est requis (min 2 caractères)');
  }
  
  if (!def.description) {
    errors.push('La description est requise');
  }
  
  if (!def.category || !CATEGORY_CONFIG[def.category]) {
    errors.push('La catégorie est invalide');
  }
  
  if (def.params) {
    for (const param of def.params) {
      if (!param.key || !param.label || !param.type) {
        errors.push(`Paramètre invalide: ${param.key || 'sans clé'}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
