/**
 * Hook for managing custom block definitions
 * Allows AI to create, modify, and delete block definitions
 * These blocks are persisted in Supabase and available to all users
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { BlockDefinition, BlockParam, BlockCategory, BlockSubcategory, BlockPort } from '@/types/block-library';

// Database row type
export interface CustomBlockRow {
  id: string;
  type: string;
  name: string;
  category: string;
  subcategory: string | null;
  icon: string;
  color: string;
  description: string;
  params: BlockParam[];
  inputs: number;
  outputs: number;
  input_ports: BlockPort[] | null;
  output_ports: BlockPort[] | null;
  output_labels: string[] | null;
  is_real_action: boolean;
  requires_auth: boolean;
  popular: boolean;
  is_sub_node: boolean;
  sub_node_type: string | null;
  is_global: boolean;
  created_by: string | null;
  source_block_type: string | null;
  modification_reason: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Convert DB row to BlockDefinition
export function rowToBlockDefinition(row: CustomBlockRow): BlockDefinition & { isCustom: true; customId: string } {
  return {
    type: row.type,
    name: row.name,
    category: row.category as BlockCategory,
    subcategory: row.subcategory as BlockSubcategory | undefined,
    icon: row.icon,
    color: row.color,
    description: row.description,
    params: row.params || [],
    inputs: row.inputs,
    outputs: row.outputs,
    inputPorts: row.input_ports || undefined,
    outputPorts: row.output_ports || undefined,
    outputLabels: row.output_labels || undefined,
    isRealAction: row.is_real_action,
    requiresAuth: row.requires_auth,
    popular: row.popular,
    isSubNode: row.is_sub_node,
    subNodeType: row.sub_node_type as any,
    // Custom metadata
    isCustom: true,
    customId: row.id,
  };
}

// Convert BlockDefinition to DB insert format
export function blockDefinitionToRow(
  def: Partial<BlockDefinition>,
  metadata?: {
    sourceBlockType?: string;
    modificationReason?: string;
    isGlobal?: boolean;
  }
): Partial<CustomBlockRow> {
  return {
    type: def.type,
    name: def.name,
    category: def.category || 'core',
    subcategory: def.subcategory || null,
    icon: def.icon || 'Box',
    color: def.color || '#64748b',
    description: def.description || '',
    params: def.params || [],
    inputs: def.inputs ?? 1,
    outputs: def.outputs ?? 1,
    input_ports: def.inputPorts || null,
    output_ports: def.outputPorts || null,
    output_labels: def.outputLabels || null,
    is_real_action: def.isRealAction || false,
    requires_auth: def.requiresAuth || false,
    popular: def.popular || false,
    is_sub_node: def.isSubNode || false,
    sub_node_type: def.subNodeType || null,
    is_global: metadata?.isGlobal ?? true,
    source_block_type: metadata?.sourceBlockType || null,
    modification_reason: metadata?.modificationReason || null,
  };
}

export function useCustomBlocks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all custom blocks
  const { data: customBlocks = [], isLoading, error } = useQuery({
    queryKey: ['custom-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_block_definitions')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(row => rowToBlockDefinition(row as unknown as CustomBlockRow));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
  });

  // Create a new custom block
  const createBlockMutation = useMutation({
    mutationFn: async (args: {
      definition: Partial<BlockDefinition>;
      reason?: string;
      sourceBlockType?: string;
    }) => {
      if (!user) throw new Error('Non authentifié');

      const row = blockDefinitionToRow(args.definition, {
        sourceBlockType: args.sourceBlockType,
        modificationReason: args.reason,
        isGlobal: true,
      });

      const { data, error } = await supabase
        .from('custom_block_definitions')
        .insert({
          type: row.type || '',
          name: row.name || '',
          category: row.category || 'core',
          subcategory: row.subcategory,
          icon: row.icon || 'Box',
          color: row.color || '#64748b',
          description: row.description || '',
          params: row.params as any,
          inputs: row.inputs ?? 1,
          outputs: row.outputs ?? 1,
          input_ports: row.input_ports as any,
          output_ports: row.output_ports as any,
          output_labels: row.output_labels as any,
          is_real_action: row.is_real_action || false,
          requires_auth: row.requires_auth || false,
          popular: row.popular || false,
          is_sub_node: row.is_sub_node || false,
          sub_node_type: row.sub_node_type,
          is_global: row.is_global ?? true,
          source_block_type: row.source_block_type,
          modification_reason: row.modification_reason,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return rowToBlockDefinition(data as unknown as CustomBlockRow);
    },
    onSuccess: (newBlock) => {
      queryClient.invalidateQueries({ queryKey: ['custom-blocks'] });
      toast.success(`Bloc "${newBlock.name}" créé avec succès`);
    },
    onError: (error: any) => {
      console.error('Failed to create block:', error);
      toast.error(`Échec de la création: ${error.message}`);
    },
  });

  // Update an existing custom block
  const updateBlockMutation = useMutation({
    mutationFn: async (args: {
      id: string;
      updates: Partial<BlockDefinition>;
      reason?: string;
    }) => {
      const row = blockDefinitionToRow(args.updates);

      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      
      if (row.type) updatePayload.type = row.type;
      if (row.name) updatePayload.name = row.name;
      if (row.category) updatePayload.category = row.category;
      if (row.subcategory !== undefined) updatePayload.subcategory = row.subcategory;
      if (row.icon) updatePayload.icon = row.icon;
      if (row.color) updatePayload.color = row.color;
      if (row.description) updatePayload.description = row.description;
      if (row.params) updatePayload.params = row.params as any;
      if (row.inputs !== undefined) updatePayload.inputs = row.inputs;
      if (row.outputs !== undefined) updatePayload.outputs = row.outputs;
      if (row.input_ports) updatePayload.input_ports = row.input_ports as any;
      if (row.output_ports) updatePayload.output_ports = row.output_ports as any;
      if (row.output_labels) updatePayload.output_labels = row.output_labels as any;
      if (row.is_real_action !== undefined) updatePayload.is_real_action = row.is_real_action;
      if (row.requires_auth !== undefined) updatePayload.requires_auth = row.requires_auth;
      if (row.popular !== undefined) updatePayload.popular = row.popular;
      if (args.reason) updatePayload.modification_reason = args.reason;

      const { data, error } = await supabase
        .from('custom_block_definitions')
        .update(updatePayload)
        .eq('id', args.id)
        .select()
        .single();

      if (error) throw error;
      return rowToBlockDefinition(data as unknown as CustomBlockRow);
    },
    onSuccess: (updatedBlock) => {
      queryClient.invalidateQueries({ queryKey: ['custom-blocks'] });
      toast.success(`Bloc "${updatedBlock.name}" mis à jour`);
    },
    onError: (error: any) => {
      console.error('Failed to update block:', error);
      toast.error(`Échec de la mise à jour: ${error.message}`);
    },
  });

  // Delete a custom block
  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_block_definitions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-blocks'] });
      toast.success('Bloc supprimé');
    },
    onError: (error: any) => {
      console.error('Failed to delete block:', error);
      toast.error(`Échec de la suppression: ${error.message}`);
    },
  });

  // Increment usage count
  const incrementUsage = useCallback(async (blockType: string) => {
    const block = customBlocks.find(b => b.type === blockType);
    if (!block || !(block as any).customId) return;

    await supabase
      .from('custom_block_definitions')
      .update({ usage_count: (block as any).usage_count + 1 })
      .eq('id', (block as any).customId);
  }, [customBlocks]);

  // Add a parameter to an existing block
  const addParameter = useCallback(async (
    blockType: string,
    param: BlockParam,
    reason?: string
  ) => {
    const block = customBlocks.find(b => b.type === blockType);
    if (!block) {
      throw new Error(`Block ${blockType} not found in custom blocks`);
    }

    const customId = (block as any).customId;
    if (!customId) {
      throw new Error(`Block ${blockType} is not a custom block`);
    }

    const updatedParams = [...(block.params || []), param];
    await updateBlockMutation.mutateAsync({
      id: customId,
      updates: { params: updatedParams },
      reason: reason || `Ajout du paramètre: ${param.label}`,
    });
  }, [customBlocks, updateBlockMutation]);

  // Remove a parameter from a block
  const removeParameter = useCallback(async (
    blockType: string,
    paramKey: string,
    reason?: string
  ) => {
    const block = customBlocks.find(b => b.type === blockType);
    if (!block) {
      throw new Error(`Block ${blockType} not found in custom blocks`);
    }

    const customId = (block as any).customId;
    if (!customId) {
      throw new Error(`Block ${blockType} is not a custom block`);
    }

    const updatedParams = (block.params || []).filter(p => p.key !== paramKey);
    await updateBlockMutation.mutateAsync({
      id: customId,
      updates: { params: updatedParams },
      reason: reason || `Suppression du paramètre: ${paramKey}`,
    });
  }, [customBlocks, updateBlockMutation]);

  // Update a parameter
  const updateParameter = useCallback(async (
    blockType: string,
    paramKey: string,
    updates: Partial<BlockParam>,
    reason?: string
  ) => {
    const block = customBlocks.find(b => b.type === blockType);
    if (!block) {
      throw new Error(`Block ${blockType} not found in custom blocks`);
    }

    const customId = (block as any).customId;
    if (!customId) {
      throw new Error(`Block ${blockType} is not a custom block`);
    }

    const updatedParams = (block.params || []).map(p => 
      p.key === paramKey ? { ...p, ...updates } : p
    );
    await updateBlockMutation.mutateAsync({
      id: customId,
      updates: { params: updatedParams },
      reason: reason || `Modification du paramètre: ${paramKey}`,
    });
  }, [customBlocks, updateBlockMutation]);

  return {
    customBlocks,
    isLoading,
    error,
    // Mutations
    createBlock: createBlockMutation.mutateAsync,
    updateBlock: updateBlockMutation.mutateAsync,
    deleteBlock: deleteBlockMutation.mutateAsync,
    // Helpers
    addParameter,
    removeParameter,
    updateParameter,
    incrementUsage,
    // Status
    isCreating: createBlockMutation.isPending,
    isUpdating: updateBlockMutation.isPending,
    isDeleting: deleteBlockMutation.isPending,
  };
}
