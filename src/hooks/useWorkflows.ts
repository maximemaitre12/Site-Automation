import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Workflow, WorkflowBlock, WorkflowRun } from '@/types/workflow';
import { toast } from 'sonner';

export function useWorkflows() {
  const { user } = useAuth();
  
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, [user]);

  const fetchWorkflows = async () => {
    if (!user) {
      setWorkflows([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const parsed = (data || []).map(w => ({
        ...w,
        blocks: (w.blocks as unknown as WorkflowBlock[]) || [],
        connections: []
      }));
      
      setWorkflows(parsed);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (name: string, description?: string): Promise<Workflow | null> => {
    if (!user) return null;

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

      if (error) throw error;
      
      const newWorkflow = {
        ...data,
        blocks: []
      } as Workflow;
      
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast.success('Workflow created');
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
      return null;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          ...updates,
          blocks: updates.blocks as unknown as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setWorkflows(prev => prev.map(w => 
        w.id === id ? { ...w, ...updates } : w
      ));
      return true;
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast.error('Failed to save workflow');
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
      
      setWorkflows(prev => prev.filter(w => w.id !== id));
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
    refreshWorkflows: fetchWorkflows
  };
}

export function useWorkflowRuns(workflowId?: string) {
  const { user } = useAuth();
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRuns();
    }
  }, [user, workflowId]);

  const fetchRuns = async () => {
    if (!user) return;

    try {
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
      setRuns((data || []).map(r => ({
        ...r,
        status: r.status as WorkflowRun['status']
      })));
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setLoading(false);
    }
  };

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
      setRuns(prev => [typedRun, ...prev]);
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
      setRuns(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
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
    refreshRuns: fetchRuns
  };
}
