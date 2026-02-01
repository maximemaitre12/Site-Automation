/**
 * Workflow Versioning System
 * 
 * Complete version control for workflows with snapshots, diff comparison,
 * rollback, and branching capabilities. Superior to N8N's basic versioning.
 */

import { WorkflowBlock, BlockConnection } from '@/types/workflow';

export interface WorkflowVersion {
  id: string;
  version: number;
  label: string;
  description?: string;
  timestamp: number;
  authorId?: string;
  authorName?: string;
  snapshot: {
    blocks: WorkflowBlock[];
    connections: BlockConnection[];
    metadata?: Record<string, any>;
  };
  parentVersion?: number;
  tags?: string[];
  isAutoSave?: boolean;
  changesSummary?: {
    blocksAdded: number;
    blocksRemoved: number;
    blocksModified: number;
    connectionsChanged: number;
  };
}

export interface VersionDiff {
  blocksAdded: WorkflowBlock[];
  blocksRemoved: WorkflowBlock[];
  blocksModified: Array<{
    blockId: string;
    blockName: string;
    changes: Array<{ field: string; before: any; after: any }>;
  }>;
  connectionsAdded: BlockConnection[];
  connectionsRemoved: BlockConnection[];
}

export interface VersionBranch {
  id: string;
  name: string;
  baseVersion: number;
  latestVersion: number;
  createdAt: number;
  description?: string;
}

// ============================================================================
// VERSION MANAGEMENT
// ============================================================================

/**
 * Create a new version snapshot
 */
export function createVersion(
  blocks: WorkflowBlock[],
  connections: BlockConnection[],
  options: {
    version: number;
    label: string;
    description?: string;
    authorId?: string;
    authorName?: string;
    parentVersion?: number;
    isAutoSave?: boolean;
    tags?: string[];
  }
): WorkflowVersion {
  return {
    id: `v${options.version}_${Date.now()}`,
    version: options.version,
    label: options.label,
    description: options.description,
    timestamp: Date.now(),
    authorId: options.authorId,
    authorName: options.authorName,
    parentVersion: options.parentVersion,
    isAutoSave: options.isAutoSave,
    tags: options.tags,
    snapshot: {
      blocks: JSON.parse(JSON.stringify(blocks)),
      connections: JSON.parse(JSON.stringify(connections)),
    },
  };
}

/**
 * Generate a semantic version label based on changes
 */
export function generateVersionLabel(
  currentVersion: number,
  changeType: 'major' | 'minor' | 'patch'
): string {
  const major = Math.floor(currentVersion / 100);
  const minor = Math.floor((currentVersion % 100) / 10);
  const patch = currentVersion % 10;

  switch (changeType) {
    case 'major':
      return `v${major + 1}.0.0`;
    case 'minor':
      return `v${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `v${major}.${minor}.${patch + 1}`;
  }
}

// ============================================================================
// DIFF & COMPARISON
// ============================================================================

/**
 * Compare two workflow versions and generate a detailed diff
 */
export function compareVersions(
  before: WorkflowVersion,
  after: WorkflowVersion
): VersionDiff {
  const beforeBlocks = new Map(before.snapshot.blocks.map(b => [b.id, b]));
  const afterBlocks = new Map(after.snapshot.blocks.map(b => [b.id, b]));
  const beforeConnections = new Set(
    before.snapshot.connections.map(c => `${c.sourceBlockId}->${c.targetBlockId}`)
  );
  const afterConnections = new Set(
    after.snapshot.connections.map(c => `${c.sourceBlockId}->${c.targetBlockId}`)
  );

  // Find added blocks
  const blocksAdded = after.snapshot.blocks.filter(b => !beforeBlocks.has(b.id));

  // Find removed blocks
  const blocksRemoved = before.snapshot.blocks.filter(b => !afterBlocks.has(b.id));

  // Find modified blocks
  const blocksModified: VersionDiff['blocksModified'] = [];
  for (const [id, afterBlock] of afterBlocks) {
    const beforeBlock = beforeBlocks.get(id);
    if (beforeBlock) {
      const changes = compareBlockConfigs(beforeBlock, afterBlock);
      if (changes.length > 0) {
        blocksModified.push({
          blockId: id,
          blockName: afterBlock.name,
          changes,
        });
      }
    }
  }

  // Find connection changes
  const connectionsAdded = after.snapshot.connections.filter(
    c => !beforeConnections.has(`${c.sourceBlockId}->${c.targetBlockId}`)
  );
  const connectionsRemoved = before.snapshot.connections.filter(
    c => !afterConnections.has(`${c.sourceBlockId}->${c.targetBlockId}`)
  );

  return {
    blocksAdded,
    blocksRemoved,
    blocksModified,
    connectionsAdded,
    connectionsRemoved,
  };
}

function compareBlockConfigs(
  before: WorkflowBlock,
  after: WorkflowBlock
): Array<{ field: string; before: any; after: any }> {
  const changes: Array<{ field: string; before: any; after: any }> = [];

  // Compare name
  if (before.name !== after.name) {
    changes.push({ field: 'name', before: before.name, after: after.name });
  }

  // Compare position
  if (before.position.x !== after.position.x || before.position.y !== after.position.y) {
    changes.push({
      field: 'position',
      before: `(${before.position.x}, ${before.position.y})`,
      after: `(${after.position.x}, ${after.position.y})`,
    });
  }

  // Compare config
  const beforeConfig = before.config || {};
  const afterConfig = after.config || {};
  const allKeys = new Set([...Object.keys(beforeConfig), ...Object.keys(afterConfig)]);

  for (const key of allKeys) {
    const beforeVal = beforeConfig[key];
    const afterVal = afterConfig[key];
    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes.push({
        field: `config.${key}`,
        before: beforeVal,
        after: afterVal,
      });
    }
  }

  return changes;
}

/**
 * Generate a human-readable summary of changes
 */
export function generateDiffSummary(diff: VersionDiff): string {
  const parts: string[] = [];

  if (diff.blocksAdded.length > 0) {
    parts.push(`+${diff.blocksAdded.length} bloc(s) ajouté(s)`);
  }
  if (diff.blocksRemoved.length > 0) {
    parts.push(`-${diff.blocksRemoved.length} bloc(s) supprimé(s)`);
  }
  if (diff.blocksModified.length > 0) {
    parts.push(`~${diff.blocksModified.length} bloc(s) modifié(s)`);
  }
  if (diff.connectionsAdded.length > 0 || diff.connectionsRemoved.length > 0) {
    const connChanges = diff.connectionsAdded.length + diff.connectionsRemoved.length;
    parts.push(`${connChanges} connexion(s) modifiée(s)`);
  }

  return parts.length > 0 ? parts.join(', ') : 'Aucune modification';
}

// ============================================================================
// ROLLBACK & RESTORE
// ============================================================================

/**
 * Restore a workflow to a previous version
 */
export function restoreVersion(
  version: WorkflowVersion
): { blocks: WorkflowBlock[]; connections: BlockConnection[] } {
  return {
    blocks: JSON.parse(JSON.stringify(version.snapshot.blocks)),
    connections: JSON.parse(JSON.stringify(version.snapshot.connections)),
  };
}

/**
 * Create a merge of two versions (for branching)
 */
export function mergeVersions(
  base: WorkflowVersion,
  branch: WorkflowVersion,
  strategy: 'prefer-base' | 'prefer-branch' | 'smart' = 'smart'
): { blocks: WorkflowBlock[]; connections: BlockConnection[]; conflicts: string[] } {
  const conflicts: string[] = [];
  const baseBlocks = new Map(base.snapshot.blocks.map(b => [b.id, b]));
  const branchBlocks = new Map(branch.snapshot.blocks.map(b => [b.id, b]));

  const mergedBlocks: WorkflowBlock[] = [];

  // Process base blocks
  for (const [id, baseBlock] of baseBlocks) {
    const branchBlock = branchBlocks.get(id);
    if (!branchBlock) {
      // Block only in base - keep it
      mergedBlocks.push(baseBlock);
    } else {
      // Block in both - merge based on strategy
      if (JSON.stringify(baseBlock) === JSON.stringify(branchBlock)) {
        mergedBlocks.push(baseBlock);
      } else {
        conflicts.push(`Conflit sur le bloc \"${baseBlock.name}\"`);
        if (strategy === 'prefer-base') {
          mergedBlocks.push(baseBlock);
        } else if (strategy === 'prefer-branch') {
          mergedBlocks.push(branchBlock);
        } else {
          // Smart merge: keep newer config
          const merged = { ...baseBlock, config: { ...baseBlock.config, ...branchBlock.config } };
          mergedBlocks.push(merged);
        }
      }
      branchBlocks.delete(id);
    }
  }

  // Add blocks only in branch
  for (const branchBlock of branchBlocks.values()) {
    mergedBlocks.push(branchBlock);
  }

  // Merge connections (union)
  const allConnections = new Map<string, BlockConnection>();
  for (const conn of base.snapshot.connections) {
    allConnections.set(`${conn.sourceBlockId}->${conn.targetBlockId}`, conn);
  }
  for (const conn of branch.snapshot.connections) {
    allConnections.set(`${conn.sourceBlockId}->${conn.targetBlockId}`, conn);
  }

  return {
    blocks: mergedBlocks,
    connections: Array.from(allConnections.values()),
    conflicts,
  };
}

// ============================================================================
// AUTO-SAVE & CHECKPOINTS
// ============================================================================

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_AUTO_SAVES = 10;

/**
 * Determine if an auto-save should be triggered
 */
export function shouldAutoSave(
  currentBlocks: WorkflowBlock[],
  lastSavedBlocks: WorkflowBlock[],
  lastSaveTime: number
): boolean {
  const timeSinceLastSave = Date.now() - lastSaveTime;
  if (timeSinceLastSave < AUTO_SAVE_INTERVAL) return false;

  // Check if there are meaningful changes
  const currentHash = JSON.stringify(currentBlocks.map(b => ({ id: b.id, config: b.config })));
  const savedHash = JSON.stringify(lastSavedBlocks.map(b => ({ id: b.id, config: b.config })));

  return currentHash !== savedHash;
}

/**
 * Generate auto-save label
 */
export function generateAutoSaveLabel(): string {
  const now = new Date();
  return `Auto-save ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

// ============================================================================
// VERSION TIMELINE VISUALIZATION
// ============================================================================

export interface TimelineNode {
  version: WorkflowVersion;
  x: number;
  y: number;
  isCurrent: boolean;
  isBranch: boolean;
  children: string[];
}

/**
 * Generate timeline layout for version visualization
 */
export function generateVersionTimeline(
  versions: WorkflowVersion[],
  currentVersionId: string
): TimelineNode[] {
  const sorted = [...versions].sort((a, b) => a.version - b.version);
  const nodes: TimelineNode[] = [];
  const branchOffsets = new Map<number, number>();

  sorted.forEach((version, index) => {
    const isBranch = version.parentVersion !== undefined && version.parentVersion !== version.version - 1;
    let yOffset = 0;

    if (isBranch && version.parentVersion !== undefined) {
      const existingOffset = branchOffsets.get(version.parentVersion) || 0;
      yOffset = existingOffset + 60;
      branchOffsets.set(version.parentVersion, yOffset);
    }

    nodes.push({
      version,
      x: index * 120,
      y: yOffset,
      isCurrent: version.id === currentVersionId,
      isBranch,
      children: [],
    });
  });

  // Link parent-child relationships
  for (const node of nodes) {
    if (node.version.parentVersion !== undefined) {
      const parent = nodes.find(n => n.version.version === node.version.parentVersion);
      if (parent) {
        parent.children.push(node.version.id);
      }
    }
  }

  return nodes;
}

// ============================================================================
// EXPORT / IMPORT
// ============================================================================

/**
 * Export version history to JSON
 */
export function exportVersionHistory(versions: WorkflowVersion[]): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    format: 'aether-flow-versions-v1',
    versions,
  }, null, 2);
}

/**
 * Import version history from JSON
 */
export function importVersionHistory(json: string): WorkflowVersion[] {
  try {
    const data = JSON.parse(json);
    if (data.format !== 'aether-flow-versions-v1') {
      throw new Error('Format de fichier non reconnu');
    }
    return data.versions;
  } catch (error) {
    throw new Error('Impossible d\'importer l\'historique des versions');
  }
}
