import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Workflow, WorkflowBlock, WorkflowRun, BlockConnection } from '@/types/workflow';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useWorkflows() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading: loading } = useQuery({
    queryKey: ['workflows', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(w => ({
        ...w,
        blocks: (w.blocks as unknown as WorkflowBlock[]) || [],
        connections: (w.connections as unknown as BlockConnection[]) || []
      }));
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  const invalidateWorkflows = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] });
  }, [queryClient, user?.id]);

  const createWorkflow = async (name: string, description?: string): Promise<Workflow | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un workflow');
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Session expirée, veuillez vous reconnecter');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          blocks: [],
          is_active: true
        })
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          toast.error('Session expirée, veuillez vous reconnecter');
          await supabase.auth.refreshSession();
          return null;
        }
        throw error;
      }
      
      const newWorkflow = {
        ...data,
        blocks: (data.blocks as unknown as WorkflowBlock[]) || [],
        connections: (data.connections as unknown as BlockConnection[]) || []
      } as Workflow;
      
      invalidateWorkflows();
      toast.success('Workflow créé');
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Échec de la création du workflow');
      return null;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour modifier un workflow');
      return false;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Session expirée, veuillez vous reconnecter');
      await supabase.auth.refreshSession();
      return false;
    }

    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          ...updates,
          blocks: updates.blocks as unknown as any,
          connections: updates.connections as unknown as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (error.code === '42501') {
          toast.error('Session expirée, veuillez vous reconnecter');
          await supabase.auth.refreshSession();
          return false;
        }
        throw error;
      }
      
      // Optimistic update
      queryClient.setQueryData(['workflows', user.id], (old: Workflow[] | undefined) => 
        (old || []).map(w => w.id === id ? { ...w, ...updates } : w)
      );
      return true;
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast.error('Échec de la sauvegarde du workflow');
      return false;
    }
  };

  const deleteWorkflow = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      invalidateWorkflows();
      toast.success('Workflow deleted');
      return true;
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
      return false;
    }
  };

  const duplicateWorkflow = async (workflow: Workflow): Promise<Workflow | null> => {
    return createWorkflow(`${workflow.name} (Copy)`, workflow.description || undefined);
  };

  return {
    workflows,
    loading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    refreshWorkflows: invalidateWorkflows
  };
}

export function useWorkflowRuns(workflowId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: runs = [], isLoading: loading } = useQuery({
    queryKey: ['workflow-runs', user?.id, workflowId],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase
        .from('workflow_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (workflowId) {
        query = query.eq('workflow_id', workflowId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(r => ({
        ...r,
        status: r.status as WorkflowRun['status']
      }));
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const invalidateRuns = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['workflow-runs', user?.id, workflowId] });
  }, [queryClient, user?.id, workflowId]);

  const createRun = async (workflow_id: string, input_data: any): Promise<WorkflowRun | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workflow_runs')
        .insert({
          workflow_id,
          user_id: user.id,
          status: 'pending',
          input_data,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      const typedRun = {
        ...data,
        status: data.status as WorkflowRun['status']
      };
      invalidateRuns();
      return typedRun;
    } catch (error) {
      console.error('Error creating run:', error);
      return null;
    }
  };

  const updateRun = async (id: string, updates: Partial<WorkflowRun>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('workflow_runs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      invalidateRuns();
      return true;
    } catch (error) {
      console.error('Error updating run:', error);
      return false;
    }
  };

  return {
    runs,
    loading,
    createRun,
    updateRun,
    refreshRuns: invalidateRuns
  };
}
