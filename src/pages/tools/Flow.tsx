import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWorkflows, useWorkflowRuns } from '@/hooks/useWorkflows';
import { Workflow, WorkflowBlock, BlockType, BLOCK_DEFINITIONS } from '@/types/workflow';
import { BlockPalette } from '@/components/flow/BlockPalette';
import { WorkflowCanvas } from '@/components/flow/WorkflowCanvas';
import { BlockProperties } from '@/components/flow/BlockProperties';
import { WorkflowExecutor } from '@/components/flow/WorkflowExecutor';
import { WorkflowHistory } from '@/components/flow/WorkflowHistory';
import { 
  Plus, Workflow as WorkflowIcon, Save, Trash2, Copy, 
  Settings, Loader2, MoreVertical 
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Flow() {
  const { workflows, loading, createWorkflow, updateWorkflow, deleteWorkflow, duplicateWorkflow } = useWorkflows();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [localBlocks, setLocalBlocks] = useState<WorkflowBlock[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);
  const { runs, loading: runsLoading, createRun, updateRun } = useWorkflowRuns(selectedWorkflowId || undefined);

  // Sync local blocks with selected workflow
  useEffect(() => {
    if (selectedWorkflow) {
      setLocalBlocks(selectedWorkflow.blocks || []);
      setHasUnsavedChanges(false);
    } else {
      setLocalBlocks([]);
    }
    setSelectedBlockId(null);
  }, [selectedWorkflowId, selectedWorkflow?.id]);

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    const workflow = await createWorkflow(newWorkflowName, newWorkflowDesc);
    if (workflow) {
      setSelectedWorkflowId(workflow.id);
      setIsCreateDialogOpen(false);
      setNewWorkflowName('');
      setNewWorkflowDesc('');
    }
  };

  const handleAddBlock = (type: BlockType) => {
    if (!selectedWorkflowId) return;

    const def = BLOCK_DEFINITIONS[type];
    const newBlock: WorkflowBlock = {
      id: crypto.randomUUID(),
      type,
      name: def.name,
      config: {},
      position: { x: 0, y: localBlocks.length * 120 }
    };

    setLocalBlocks(prev => [...prev, newBlock]);
    setHasUnsavedChanges(true);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<WorkflowBlock>) => {
    setLocalBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    ));
    setHasUnsavedChanges(true);
  };

  const handleDeleteBlock = (blockId: string) => {
    setLocalBlocks(prev => prev.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    setHasUnsavedChanges(true);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    setLocalBlocks(prev => {
      const sorted = [...prev].sort((a, b) => a.position.y - b.position.y);
      const index = sorted.findIndex(b => b.id === blockId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sorted.length) return prev;

      // Swap positions
      const temp = sorted[index].position.y;
      sorted[index].position.y = sorted[newIndex].position.y;
      sorted[newIndex].position.y = temp;

      return sorted;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveWorkflow = async () => {
    if (!selectedWorkflowId) return;

    const success = await updateWorkflow(selectedWorkflowId, { blocks: localBlocks });
    if (success) {
      setHasUnsavedChanges(false);
      toast.success('Workflow saved');
    }
  };

  const handleDeleteWorkflow = async () => {
    if (!workflowToDelete) return;

    const success = await deleteWorkflow(workflowToDelete);
    if (success && selectedWorkflowId === workflowToDelete) {
      setSelectedWorkflowId(null);
    }
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  const handleDuplicateWorkflow = async (workflow: Workflow) => {
    const newWorkflow = await duplicateWorkflow(workflow);
    if (newWorkflow) {
      // Copy blocks to new workflow
      await updateWorkflow(newWorkflow.id, { blocks: workflow.blocks });
    }
  };

  const handleRunCompleted = async (workflowId: string, logs: any[], output: any) => {
    const run = await createRun(workflowId, localBlocks.length > 0 ? 'User input' : null);
    if (run) {
      await updateRun(run.id, {
        status: output ? 'success' : 'error',
        output_data: output,
        completed_at: new Date().toISOString()
      });
    }
  };

  const selectedBlock = localBlocks.find(b => b.id === selectedBlockId);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <WorkflowIcon className="w-5 h-5 text-white" />
                </div>
                AETHER Flow
              </h1>
              <p className="text-muted-foreground mt-1">Visual workflow automation with AI-powered blocks</p>
            </div>
            <div className="flex items-center gap-3">
              <WorkflowHistory 
                runs={runs} 
                loading={runsLoading}
                workflowName={selectedWorkflow?.name}
              />
              <Button variant="hero" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Workflows List */}
          <aside className="w-72 border-r border-border bg-card/30 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-muted-foreground px-2 mb-4">Your Workflows</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-8">
                <WorkflowIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No workflows yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workflows.map((workflow) => {
                  const workflowRuns = runs.filter(r => r.workflow_id === workflow.id);
                  const lastRun = workflowRuns[0];
                  
                  return (
                    <div
                      key={workflow.id}
                      onClick={() => setSelectedWorkflowId(workflow.id)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all
                        ${selectedWorkflowId === workflow.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-secondary border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-foreground text-sm truncate flex-1">
                          {workflow.name}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setWorkflowToDelete(workflow.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          workflow.is_active 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {workflow.is_active ? 'active' : 'paused'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {workflow.blocks?.length || 0} blocks
                        </span>
                      </div>
                      {lastRun && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Last run: {lastRun.status}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col bg-background/50">
            {selectedWorkflow ? (
              <>
                {/* Workflow Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/30">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedWorkflow.name}
                    </h2>
                    {selectedWorkflow.description && (
                      <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                      <span className="text-xs text-amber-500 mr-2">Unsaved changes</span>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSaveWorkflow}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <WorkflowExecutor
                      blocks={localBlocks}
                      workflowId={selectedWorkflow.id}
                      workflowName={selectedWorkflow.name}
                      onRunCreated={handleRunCompleted}
                    />
                  </div>
                </div>

                {/* Canvas */}
                <WorkflowCanvas
                  blocks={localBlocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onDeleteBlock={handleDeleteBlock}
                  onMoveBlock={handleMoveBlock}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <WorkflowIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a workflow</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Choose a workflow from the list or create a new one
                  </p>
                  <Button variant="hero" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel or Block Palette */}
          {selectedWorkflow && (
            selectedBlock ? (
              <BlockProperties
                block={selectedBlock}
                onUpdate={(updates) => handleUpdateBlock(selectedBlock.id, updates)}
                onClose={() => setSelectedBlockId(null)}
              />
            ) : (
              <BlockPalette onAddBlock={handleAddBlock} />
            )
          )}
        </div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a name and optional description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="e.g., Invoice Processing"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={newWorkflowDesc}
                onChange={(e) => setNewWorkflowDesc(e.target.value)}
                placeholder="Describe what this workflow does..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleCreateWorkflow}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow and all its execution history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkflow}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
