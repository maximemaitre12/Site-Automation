import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWorkflows, useWorkflowRuns } from '@/hooks/useWorkflows';
import { Workflow, WorkflowBlock, BlockType, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { WorkflowBuilder } from '@/components/flow/WorkflowBuilder';
import { EnhancedWorkflowCanvas } from '@/components/flow/EnhancedWorkflowCanvas';
import { WorkflowExecutor } from '@/components/flow/WorkflowExecutor';
import { WorkflowHistory } from '@/components/flow/WorkflowHistory';
import { AIWorkflowGenerator } from '@/components/flow/AIWorkflowGenerator';
import { TemplateGallery } from '@/components/flow/TemplateGallery';
import { 
  Plus, Workflow as WorkflowIcon, Save, Trash2, Copy, 
  Loader2, MoreVertical, Sparkles, LayoutTemplate, Zap, Undo2, Redo2
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HistoryState {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
}

export default function Flow() {
  const { workflows, loading, createWorkflow, updateWorkflow, deleteWorkflow, duplicateWorkflow } = useWorkflows();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [localBlocks, setLocalBlocks] = useState<WorkflowBlock[]>([]);
  const [localConnections, setLocalConnections] = useState<BlockConnection[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'builder'>('canvas');
  
  // Undo/Redo history
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);
  const lastSavedState = useRef<string>('');

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);
  const { runs, loading: runsLoading, createRun, updateRun } = useWorkflowRuns(selectedWorkflowId || undefined);

  // Initialize history when workflow changes
  useEffect(() => {
    if (selectedWorkflow) {
      const blocks = selectedWorkflow.blocks || [];
      const connections = selectedWorkflow.connections || [];
      setLocalBlocks(blocks);
      setLocalConnections(connections);
      setHasUnsavedChanges(false);
      // Reset history with initial state
      const initialState = { blocks: JSON.parse(JSON.stringify(blocks)), connections: JSON.parse(JSON.stringify(connections)) };
      setHistory([initialState]);
      setHistoryIndex(0);
      lastSavedState.current = JSON.stringify(initialState);
    } else {
      setLocalBlocks([]);
      setLocalConnections([]);
      setHistory([]);
      setHistoryIndex(-1);
      lastSavedState.current = '';
    }
    setSelectedBlockId(null);
  }, [selectedWorkflowId, selectedWorkflow?.id]);

  // Push to history when blocks/connections change (except during undo/redo)
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    if (!selectedWorkflowId) return;
    
    const currentState = JSON.stringify({ blocks: localBlocks, connections: localConnections });
    
    // Don't push if state matches last saved state
    if (currentState === lastSavedState.current) return;
    
    lastSavedState.current = currentState;

    // Push new state
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      const newEntry = { 
        blocks: JSON.parse(JSON.stringify(localBlocks)), 
        connections: JSON.parse(JSON.stringify(localConnections)) 
      };
      const newHistory = [...truncated, newEntry];
      // Keep max 30 entries
      if (newHistory.length > 30) return newHistory.slice(-30);
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [localBlocks, localConnections, selectedWorkflowId, historyIndex]);

  const handleUndo = () => {
    if (!canUndo) return;
    isUndoRedoAction.current = true;
    const prevState = history[historyIndex - 1];
    if (prevState) {
      setLocalBlocks(JSON.parse(JSON.stringify(prevState.blocks)));
      setLocalConnections(JSON.parse(JSON.stringify(prevState.connections)));
      lastSavedState.current = JSON.stringify(prevState);
      setHistoryIndex(historyIndex - 1);
      setHasUnsavedChanges(true);
      toast.info('Action annulée');
    }
  };

  const handleRedo = () => {
    if (!canRedo) return;
    isUndoRedoAction.current = true;
    const nextState = history[historyIndex + 1];
    if (nextState) {
      setLocalBlocks(JSON.parse(JSON.stringify(nextState.blocks)));
      setLocalConnections(JSON.parse(JSON.stringify(nextState.connections)));
      lastSavedState.current = JSON.stringify(nextState);
      setHistoryIndex(historyIndex + 1);
      setHasUnsavedChanges(true);
      toast.info('Action rétablie');
    }
  };

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

  const handleAIGenerate = async (blocks: WorkflowBlock[], name: string, description: string, connections?: BlockConnection[]) => {
    const workflow = await createWorkflow(name, description);
    if (workflow) {
      await updateWorkflow(workflow.id, { blocks, connections: connections || [] });
      setSelectedWorkflowId(workflow.id);
      setLocalBlocks(blocks);
      setLocalConnections(connections || []);
      toast.success('AI workflow created successfully!');
    }
  };

  const handleAIModify = (blocks: WorkflowBlock[], connections: BlockConnection[]) => {
    setLocalBlocks(blocks);
    setLocalConnections(connections);
    setHasUnsavedChanges(true);
    toast.success('Workflow modified by AI - save to apply changes');
  };

  const handleTemplateSelect = async (blocks: WorkflowBlock[], name: string, description: string) => {
    const workflow = await createWorkflow(name, description);
    if (workflow) {
      await updateWorkflow(workflow.id, { blocks });
      setSelectedWorkflowId(workflow.id);
      setLocalBlocks(blocks);
      toast.success('Template workflow created!');
    }
  };

  const handleAddBlock = (type: BlockType) => {
    if (!selectedWorkflowId) return;
    const def = BLOCK_DEFINITIONS[type];
    
    // Find the last block in the chain or the selected block to connect from
    const sourceBlock = selectedBlockId 
      ? localBlocks.find(b => b.id === selectedBlockId)
      : localBlocks.length > 0 
        ? localBlocks.reduce((last, b) => b.position.y > last.position.y ? b : last, localBlocks[0])
        : null;
    
    // Position new block below the source block
    const newPosition = sourceBlock 
      ? { x: sourceBlock.position.x, y: sourceBlock.position.y + 140 }
      : { x: 100, y: localBlocks.length * 140 };
    
    const newBlock: WorkflowBlock = {
      id: crypto.randomUUID(),
      type,
      name: def.name,
      config: {},
      position: newPosition
    };
    
    setLocalBlocks(prev => [...prev, newBlock]);
    
    // Auto-connect from source block if exists
    if (sourceBlock) {
      const newConnection: BlockConnection = {
        id: crypto.randomUUID(),
        sourceBlockId: sourceBlock.id,
        targetBlockId: newBlock.id
      };
      setLocalConnections(prev => [...prev, newConnection]);
    }
    
    setHasUnsavedChanges(true);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<WorkflowBlock>) => {
    setLocalBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b));
    setHasUnsavedChanges(true);
  };

  const handleDeleteBlock = (blockId: string) => {
    setLocalBlocks(prev => prev.filter(b => b.id !== blockId));
    // Also remove any connections involving this block
    setLocalConnections(prev => prev.filter(c => c.sourceBlockId !== blockId && c.targetBlockId !== blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    setHasUnsavedChanges(true);
  };

  const handleAddConnection = (connection: BlockConnection) => {
    setLocalConnections(prev => [...prev, connection]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveConnection = (connectionId: string) => {
    setLocalConnections(prev => prev.filter(c => c.id !== connectionId));
    setHasUnsavedChanges(true);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const block = localBlocks.find(b => b.id === blockId);
    if (!block) return;
    const newBlock: WorkflowBlock = {
      ...block,
      id: crypto.randomUUID(),
      name: `${block.name} (copy)`,
      position: { x: block.position.x, y: block.position.y + 120 }
    };
    setLocalBlocks(prev => [...prev, newBlock]);
    setHasUnsavedChanges(true);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    setLocalBlocks(prev => {
      const sorted = [...prev].sort((a, b) => a.position.y - b.position.y);
      const index = sorted.findIndex(b => b.id === blockId);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sorted.length) return prev;
      const temp = sorted[index].position.y;
      sorted[index].position.y = sorted[newIndex].position.y;
      sorted[newIndex].position.y = temp;
      return sorted;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveWorkflow = async () => {
    if (!selectedWorkflowId) return;
    const success = await updateWorkflow(selectedWorkflowId, { 
      blocks: localBlocks,
      connections: localConnections 
    });
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
      await updateWorkflow(newWorkflow.id, { blocks: workflow.blocks });
    }
  };

  const handleRunCompleted = async (workflowId: string, logs: any[], output: any) => {
    const run = await createRun(workflowId, localBlocks.length > 0 ? 'User input' : null);
    if (run) {
      await updateRun(run.id, {
        status: output ? 'completed' : 'failed',
        output_data: output,
        completed_at: new Date().toISOString()
      });
    }
  };

  const selectedBlock = localBlocks.find(b => b.id === selectedBlockId);

  const headerActions = (
    <>
      <WorkflowHistory runs={runs} loading={runsLoading} workflowName={selectedWorkflow?.name} />
    </>
  );

  return (
    <DashboardLayout headerActions={headerActions}>
      <div className="h-full flex flex-col">

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar - Workflows List */}
          <aside className="w-full md:w-56 lg:w-72 border-b md:border-b-0 md:border-r border-border bg-card/30 p-3 md:p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between px-2 mb-3 md:mb-4">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Your Workflows</h3>
              <Button variant="hero" size="sm" onClick={() => setIsCreateDialogOpen(true)} className="h-7 px-2">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-6 md:py-8">
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-primary" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">No workflows yet</p>
                <Button variant="outline" size="sm" onClick={() => setIsAIGeneratorOpen(true)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            ) : (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    onClick={() => setSelectedWorkflowId(workflow.id)}
                    className={`p-2.5 md:p-3 rounded-lg cursor-pointer transition-all flex-shrink-0 min-w-[160px] md:min-w-0 ${selectedWorkflowId === workflow.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary border border-transparent'}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-foreground text-xs md:text-sm truncate flex-1">{workflow.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-5 w-5 md:h-6 md:w-6 p-0">
                            <MoreVertical className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow)}>
                            <Copy className="w-4 h-4 mr-2" />Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => { setWorkflowToDelete(workflow.id); setDeleteDialogOpen(true); }}>
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${workflow.is_active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {workflow.is_active ? 'active' : 'paused'}
                      </span>
                      <span className="text-[10px] md:text-xs text-muted-foreground">{workflow.blocks?.length || 0} blocks</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Workflow Builder */}
          {selectedWorkflow ? (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card/30">
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg font-semibold text-foreground truncate">{selectedWorkflow.name}</h2>
                  {selectedWorkflow.description && <p className="text-xs md:text-sm text-muted-foreground truncate hidden sm:block">{selectedWorkflow.description}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Undo/Redo buttons */}
                  <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!canUndo} className="h-7 w-7 p-0">
                          <Undo2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Annuler (Ctrl+Z)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={handleRedo} disabled={!canRedo} className="h-7 w-7 p-0">
                          <Redo2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Rétablir (Ctrl+Y)</TooltipContent>
                    </Tooltip>
                  </div>
                  {/* View mode toggle removed - canvas only */}
                  {hasUnsavedChanges && <span className="text-[10px] md:text-xs text-amber-500">Non sauvegardé</span>}
                  <Button variant="outline" size="sm" onClick={handleSaveWorkflow} disabled={!hasUnsavedChanges}>
                    <Save className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Sauvegarder</span>
                  </Button>
                  <WorkflowExecutor blocks={localBlocks} connections={localConnections} workflowId={selectedWorkflow.id} workflowName={selectedWorkflow.name} onRunCreated={handleRunCompleted} />
                </div>
              </div>
              <EnhancedWorkflowCanvas
                blocks={localBlocks}
                connections={localConnections}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onDuplicateBlock={handleDuplicateBlock}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
                onAddBlock={() => setIsBlockPickerOpen(true)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <WorkflowIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium text-foreground mb-2">Sélectionnez un workflow</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4">Choisissez un workflow existant ou créez-en un nouveau</p>
                <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setIsAIGeneratorOpen(true)}><Sparkles className="w-4 h-4 mr-2" />Générer avec l'IA</Button>
                  <Button variant="hero" size="sm" onClick={() => setIsCreateDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Créer un workflow</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>Give your workflow a name and optional description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={newWorkflowName} onChange={(e) => setNewWorkflowName(e.target.value)} placeholder="e.g., Invoice Processing" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea value={newWorkflowDesc} onChange={(e) => setNewWorkflowDesc(e.target.value)} placeholder="Describe what this workflow does..." rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleCreateWorkflow}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AIWorkflowGenerator 
        isOpen={isAIGeneratorOpen} 
        onClose={() => setIsAIGeneratorOpen(false)} 
        onGenerate={handleAIGenerate}
        existingWorkflow={selectedWorkflow ? {
          id: selectedWorkflow.id,
          name: selectedWorkflow.name,
          blocks: localBlocks,
          connections: localConnections
        } : undefined}
        onModify={handleAIModify}
      />
      <TemplateGallery isOpen={isTemplateGalleryOpen} onClose={() => setIsTemplateGalleryOpen(false)} onSelect={handleTemplateSelect} />

      {/* Block Picker Dialog for Canvas mode */}
      <Dialog open={isBlockPickerOpen} onOpenChange={setIsBlockPickerOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un bloc</DialogTitle>
            <DialogDescription>Choisissez le type de bloc à ajouter</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {Object.entries(BLOCK_DEFINITIONS).map(([type, def]) => (
              <button
                key={type}
                onClick={() => { handleAddBlock(type as BlockType); setIsBlockPickerOpen(false); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def.color} flex items-center justify-center`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{def.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkflow} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
