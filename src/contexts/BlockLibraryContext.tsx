/**
 * Block Library Context
 * Provides the merged block library (static + custom) to all components
 */

import React, { createContext, useContext, useMemo } from 'react';
import { BLOCK_LIBRARY, BlockDefinition, BlockCategory, BlockParam } from '@/types/block-library';
import { useCustomBlocks } from '@/hooks/useCustomBlocks';
import {
  ExtendedBlockDefinition,
  mergeBlockLibraries,
  searchExtendedBlocks,
  getBlocksByCategory,
  getPopularExtendedBlocks,
  getExtendedBlockByType,
  isCustomBlock,
  getCustomBlocks,
  getModifiedBlocks,
  getNewCustomBlocks,
  generateCustomBlockType,
  validateBlockDefinition,
} from '@/lib/block-library-extended';

interface BlockLibraryContextValue {
  // All blocks (static + custom merged)
  allBlocks: ExtendedBlockDefinition[];
  
  // Loading state
  isLoading: boolean;
  
  // Query helpers
  getBlockByType: (type: string) => ExtendedBlockDefinition | undefined;
  searchBlocks: (query: string) => ExtendedBlockDefinition[];
  getBlocksByCategory: () => Record<BlockCategory, ExtendedBlockDefinition[]>;
  getPopularBlocks: () => ExtendedBlockDefinition[];
  
  // Custom block checks
  isCustomBlock: (type: string) => boolean;
  getCustomBlocks: () => ExtendedBlockDefinition[];
  getModifiedBlocks: () => ExtendedBlockDefinition[];
  getNewCustomBlocks: () => ExtendedBlockDefinition[];
  
  // Mutations (from useCustomBlocks)
  createBlock: (args: {
    definition: Partial<BlockDefinition>;
    reason?: string;
    sourceBlockType?: string;
  }) => Promise<ExtendedBlockDefinition>;
  
  updateBlock: (args: {
    id: string;
    updates: Partial<BlockDefinition>;
    reason?: string;
  }) => Promise<ExtendedBlockDefinition>;
  
  deleteBlock: (id: string) => Promise<string>;
  
  addParameter: (blockType: string, param: BlockParam, reason?: string) => Promise<void>;
  removeParameter: (blockType: string, paramKey: string, reason?: string) => Promise<void>;
  updateParameter: (blockType: string, paramKey: string, updates: Partial<BlockParam>, reason?: string) => Promise<void>;
  
  // Utilities
  generateBlockType: (baseName: string) => string;
  validateBlock: (def: Partial<BlockDefinition>) => { valid: boolean; errors: string[] };
  
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const BlockLibraryContext = createContext<BlockLibraryContextValue | null>(null);

export function BlockLibraryProvider({ children }: { children: React.ReactNode }) {
  const {
    customBlocks,
    isLoading,
    createBlock,
    updateBlock,
    deleteBlock,
    addParameter,
    removeParameter,
    updateParameter,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCustomBlocks();

  // Merge static and custom blocks
  const allBlocks = useMemo(() => 
    mergeBlockLibraries(BLOCK_LIBRARY, customBlocks),
    [customBlocks]
  );

  const value: BlockLibraryContextValue = useMemo(() => ({
    allBlocks,
    isLoading,
    
    // Query helpers
    getBlockByType: (type: string) => getExtendedBlockByType(allBlocks, type),
    searchBlocks: (query: string) => searchExtendedBlocks(allBlocks, query),
    getBlocksByCategory: () => getBlocksByCategory(allBlocks),
    getPopularBlocks: () => getPopularExtendedBlocks(allBlocks),
    
    // Custom block checks
    isCustomBlock: (type: string) => isCustomBlock(allBlocks, type),
    getCustomBlocks: () => getCustomBlocks(allBlocks),
    getModifiedBlocks: () => getModifiedBlocks(allBlocks),
    getNewCustomBlocks: () => getNewCustomBlocks(allBlocks),
    
    // Mutations
    createBlock,
    updateBlock,
    deleteBlock,
    addParameter,
    removeParameter,
    updateParameter,
    
    // Utilities
    generateBlockType: generateCustomBlockType,
    validateBlock: validateBlockDefinition,
    
    // States
    isCreating,
    isUpdating,
    isDeleting,
  }), [allBlocks, isLoading, customBlocks, createBlock, updateBlock, deleteBlock, addParameter, removeParameter, updateParameter, isCreating, isUpdating, isDeleting]);

  return (
    <BlockLibraryContext.Provider value={value}>
      {children}
    </BlockLibraryContext.Provider>
  );
}

export function useBlockLibrary(): BlockLibraryContextValue {
  const context = useContext(BlockLibraryContext);
  if (!context) {
    throw new Error('useBlockLibrary must be used within a BlockLibraryProvider');
  }
  return context;
}

// Export for components that need conditional access
export function useBlockLibraryOptional(): BlockLibraryContextValue | null {
  return useContext(BlockLibraryContext);
}
