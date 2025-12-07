import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Workflow } from 'lucide-react';

interface WorkflowOption {
  id: string;
  name: string;
  description: string | null;
}

interface WorkflowSelectorProps {
  value: string;
  onChange: (workflowId: string, workflowName: string) => void;
  excludeWorkflowId?: string;
}

export function WorkflowSelector({ value, onChange, excludeWorkflowId }: WorkflowSelectorProps) {
  const [workflows, setWorkflows] = useState<WorkflowOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workflows')
        .select('id, name, description')
        .eq('user_id', user.id)
        .order('name');

      if (!error && data) {
        // Filter out the current workflow to prevent recursion
        const filtered = excludeWorkflowId 
          ? data.filter(w => w.id !== excludeWorkflowId)
          : data;
        setWorkflows(filtered);
      }
      setLoading(false);
    };

    fetchWorkflows();
  }, [excludeWorkflowId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement des workflows...
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-muted-foreground text-sm">
        <Workflow className="w-4 h-4" />
        Aucun autre workflow disponible
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(id) => {
        const workflow = workflows.find(w => w.id === id);
        if (workflow) {
          onChange(id, workflow.name);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un workflow" />
      </SelectTrigger>
      <SelectContent>
        {workflows.map((workflow) => (
          <SelectItem key={workflow.id} value={workflow.id}>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-primary" />
              <span>{workflow.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
