import { useState, useEffect, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWorkflows, useWorkflowRuns } from '@/hooks/useWorkflows';
import { Workflow, WorkflowBlock, BlockType, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { WorkflowBuilder } from '@/components/flow/WorkflowBuilder';
import { ProCanvasV2 } from '@/components/flow/canvas/ProCanvasV2';
import { WorkflowExecutor } from '@/components/flow/WorkflowExecutor';
import { WorkflowHistory } from '@/components/flow/WorkflowHistory';
import { AIWorkflowGenerator } from '@/components/flow/AIWorkflowGenerator';
import { TemplateGallery } from '@/components/flow/TemplateGallery';
import { BlockPickerDialog } from '@/components/flow/BlockPickerDialog';
import { AIAutomationRules } from '@/components/flow/AIAutomationRules';
import { NodePropertiesPanel } from '@/components/flow/panels/NodePropertiesPanel';
import { autoLayoutBlocks, applyLayoutToBlocks, suggestNewBlockPosition } from '@/lib/workflow-layout';
import { 
  Plus, Workflow as WorkflowIcon, Save, Trash2, Copy, 
  Loader2, MoreVertical, Sparkles, LayoutTemplate, Zap, Undo2, Redo2, Bot, LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [fitViewNonce, setFitViewNonce] = useState(0);
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
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingHistoryState = useRef<HistoryState | null>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);
  const { runs, loading: runsLoading, createRun, updateRun } = useWorkflowRuns(selectedWorkflowId || undefined);

  // Always trigger fit view when user clicks a workflow in the list (even if it's already selected)
  const handleSelectWorkflow = useCallback((workflowId: string) => {
    setSelectedWorkflowId(prev => (prev === workflowId ? prev : workflowId));
    setFitViewNonce(n => n + 1);
  }, []);

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
    } else {
      setLocalBlocks([]);
      setLocalConnections([]);
      setHistory([]);
      setHistoryIndex(-1);
    }
    setSelectedBlockId(null);
  }, [selectedWorkflowId, selectedWorkflow?.id]);

  // Push to history when blocks/connections change (except during undo/redo)
  // Uses debounce to avoid capturing every micro-movement during drag
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    if (!selectedWorkflowId) return;
    
    const currentState = JSON.stringify({ blocks: localBlocks, connections: localConnections });
    
    // Don't push if state is identical to the current history entry
    if (history[historyIndex] && currentState === JSON.stringify(history[historyIndex])) {
      return;
    }

    // Store the pending state
    pendingHistoryState.current = { 
      blocks: JSON.parse(JSON.stringify(localBlocks)), 
      connections: JSON.parse(JSON.stringify(localConnections)) 
    };

    // Clear any existing timeout
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    // Debounce: only push to history after 300ms of no changes
    historyTimeoutRef.current = setTimeout(() => {
      if (!pendingHistoryState.current) return;
      
      setHistory(prev => {
        const truncated = prev.slice(0, historyIndex + 1);
        const newHistory = [...truncated, pendingHistoryState.current!];
        // Keep max 30 entries
        if (newHistory.length > 30) return newHistory.slice(-30);
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 29));
      pendingHistoryState.current = null;
    }, 300);

    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, [localBlocks, localConnections, selectedWorkflowId]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0 || history.length === 0) return;
    
    const prevIndex = historyIndex - 1;
    const prevState = history[prevIndex];
    if (prevState) {
      isUndoRedoAction.current = true;
      setLocalBlocks(JSON.parse(JSON.stringify(prevState.blocks)));
      setLocalConnections(JSON.parse(JSON.stringify(prevState.connections)));
      setHistoryIndex(prevIndex);
      setHasUnsavedChanges(true);
      toast.info('Action annulée');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];
    if (nextState) {
      isUndoRedoAction.current = true;
      setLocalBlocks(JSON.parse(JSON.stringify(nextState.blocks)));
      setLocalConnections(JSON.parse(JSON.stringify(nextState.connections)));
      setHistoryIndex(nextIndex);
      setHasUnsavedChanges(true);
      toast.info('Action rétablie');
    }
  }, [history, historyIndex]);

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
    console.log('AI Generate called with', blocks.length, 'blocks and', connections?.length || 0, 'connections');
    const workflow = await createWorkflow(name, description);
    if (workflow) {
      // Apply auto-layout to blocks before saving
      const layoutedBlocks = blocks.length > 0 
        ? applyLayoutToBlocks(blocks, autoLayoutBlocks(blocks, connections || []))
        : blocks;
      
      const success = await updateWorkflow(workflow.id, { blocks: layoutedBlocks, connections: connections || [] });
      if (success) {
        setSelectedWorkflowId(workflow.id);
        setLocalBlocks(layoutedBlocks);
        setLocalConnections(connections || []);
        console.log('Workflow created and selected:', workflow.id, 'with blocks:', layoutedBlocks);
        toast.success('Workflow IA créé avec succès !');
      }
    }
  };

  const handleAIModify = (blocks: WorkflowBlock[], connections: BlockConnection[]) => {
    // Apply auto-layout to modified blocks
    const layoutedBlocks = blocks.length > 0 
      ? applyLayoutToBlocks(blocks, autoLayoutBlocks(blocks, connections))
      : blocks;
    
    setLocalBlocks(layoutedBlocks);
    setLocalConnections(connections);
    setHasUnsavedChanges(true);
    toast.success('Workflow modified by AI - save to apply changes');
  };

  const handleTemplateSelect = async (blocks: WorkflowBlock[], name: string, description: string) => {
    const workflow = await createWorkflow(name, description);
    if (workflow) {
      // Apply auto-layout to template blocks
      const layoutedBlocks = blocks.length > 0 
        ? applyLayoutToBlocks(blocks, autoLayoutBlocks(blocks, []))
        : blocks;
      
      await updateWorkflow(workflow.id, { blocks: layoutedBlocks });
      setSelectedWorkflowId(workflow.id);
      setLocalBlocks(layoutedBlocks);
      toast.success('Template workflow created!');
    }
  };

  const handleAddBlock = (type: BlockType) => {
    if (!selectedWorkflowId) return;
    const def = BLOCK_DEFINITIONS[type];
    
    // Use intelligent position suggestion based on graph structure
    const sourceBlockId = selectedBlockId || (localBlocks.length > 0 
      ? localBlocks.reduce((last, b) => b.position.x > last.position.x ? b : last, localBlocks[0]).id
      : undefined);
    
    const newPosition = suggestNewBlockPosition(localBlocks, localConnections, sourceBlockId);
    
    const newBlock: WorkflowBlock = {
      id: crypto.randomUUID(),
      type,
      name: def.name,
      config: {},
      position: newPosition
    };
    
    // Prepare new connection if there's a source
    const newConnection: BlockConnection | null = sourceBlockId ? {
      id: crypto.randomUUID(),
      sourceBlockId,
      targetBlockId: newBlock.id
    } : null;
    
    // Add block and connection
    const updatedBlocks = [...localBlocks, newBlock];
    const updatedConnections = newConnection 
      ? [...localConnections, newConnection] 
      : localConnections;
    
    setLocalBlocks(updatedBlocks);
    setLocalConnections(updatedConnections);
    setHasUnsavedChanges(true);
    setSelectedBlockId(newBlock.id);
  };

  // Auto-layout function - reorganize all blocks algorithmically
  const handleAutoLayout = useCallback(() => {
    if (localBlocks.length === 0) return;
    
    const layout = autoLayoutBlocks(localBlocks, localConnections);
    const repositionedBlocks = applyLayoutToBlocks(localBlocks, layout);
    
    setLocalBlocks(repositionedBlocks);
    setHasUnsavedChanges(true);
    toast.success('Layout optimisé automatiquement');
  }, [localBlocks, localConnections]);

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
    
    // Position duplicate to the right with slight Y offset
    const newPosition = suggestNewBlockPosition(localBlocks, localConnections, blockId);
    
    const newBlock: WorkflowBlock = {
      ...block,
      id: crypto.randomUUID(),
      name: `${block.name} (copy)`,
      position: { x: newPosition.x, y: newPosition.y + 40 }
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

  const headerActions = null;

  return (
    <DashboardLayout headerActions={headerActions}>
      <div className="flex flex-col h-full workflow-canvas-container" style={{ height: '100%', minHeight: '600px' }}>

        {/* Main Content */}
            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* Sidebar - Workflows List */}
              <aside className="w-full md:w-52 lg:w-64 border-b md:border-b-0 md:border-r border-border bg-card/30 p-2 md:p-3 overflow-y-auto flex-shrink-0 max-h-32 md:max-h-none">
                <div className="flex items-center justify-between px-2 mb-2 md:mb-3">
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Workflows</h3>
                  <Button variant="default" size="sm" onClick={() => setIsCreateDialogOpen(true)} className="h-6 md:h-7 px-1.5 md:px-2 bg-agent-flow hover:bg-agent-flow/90">
                    <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-4 md:py-8">
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-agent-flow" />
                  </div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-4 md:py-8">
                    <Zap className="w-6 h-6 md:w-10 md:h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-[10px] md:text-sm text-muted-foreground mb-2 md:mb-4">Aucun workflow</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAIGeneratorOpen(true)} className="text-[10px] md:text-xs h-6 md:h-8 px-2">
                      <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                      Générer IA
                    </Button>
                  </div>
                ) : (
                  <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    {workflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        onClick={() => handleSelectWorkflow(workflow.id)}
                        className={`p-2 md:p-2.5 rounded-lg cursor-pointer transition-all flex-shrink-0 min-w-[140px] md:min-w-0 ${selectedWorkflowId === workflow.id ? 'bg-agent-flow/10 border border-agent-flow/30' : 'hover:bg-secondary border border-transparent'}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-foreground text-xs md:text-sm truncate flex-1">{workflow.name}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectWorkflow(workflow.id);
                              }}
                            >
                              <Button variant="ghost" size="sm" className="h-5 w-5 md:h-6 md:w-6 p-0 shrink-0">
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
                          <span className={`text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${workflow.is_active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                            {workflow.is_active ? 'active' : 'paused'}
                          </span>
                          <span className="text-[9px] md:text-xs text-muted-foreground">{workflow.blocks?.length || 0} blocks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </aside>

              {/* Workflow Builder */}
              {selectedWorkflow ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ minHeight: '400px' }}>
                  <div className="flex items-center justify-between gap-2 px-3 md:px-6 py-2 md:py-3 border-b border-border bg-card/30 flex-shrink-0">
                    {/* Left side: Workflow name */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-foreground truncate">{selectedWorkflow.name}</h2>
                    </div>
                    
                    {/* Right side: AI, Add Block, Execute */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsAIGeneratorOpen(true)} 
                        className="gap-1 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">IA</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSaveWorkflow} disabled={!hasUnsavedChanges} className="gap-1 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm">
                        <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Save</span>
                        {hasUnsavedChanges && <span className="w-1.5 h-1.5 bg-warning rounded-full" />}
                      </Button>
                      <WorkflowExecutor
                        blocks={localBlocks}
                        connections={localConnections}
                        workflowId={selectedWorkflow.id}
                        workflowName={selectedWorkflow.name}
                        onRunCreated={(runId, logs, output) => handleRunCompleted(selectedWorkflow.id, logs, output)}
                      />
                    </div>
                  </div>
                  
                  {/* Pro Canvas V2 - N8N Style */}
                  <div className="flex-1 flex overflow-hidden min-h-0 workflow-canvas-area" style={{ minHeight: '500px' }}>
                    <div className="flex-1 overflow-hidden min-h-0">
                      <ProCanvasV2
                        blocks={localBlocks}
                        connections={localConnections}
                        selectedBlockId={selectedBlockId}
                        onBlockSelect={setSelectedBlockId}
                        onBlockUpdate={handleUpdateBlock}
                        onBlockDelete={handleDeleteBlock}
                        onBlockDuplicate={handleDuplicateBlock}
                        onConnectionAdd={handleAddConnection}
                        onConnectionRemove={handleRemoveConnection}
                        onBlocksChange={setLocalBlocks}
                        onSave={handleSaveWorkflow}
                        onRun={() => {}}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        hasUnsavedChanges={hasUnsavedChanges}
                        onAutoLayout={handleAutoLayout}
                        onAddBlock={() => setIsBlockPickerOpen(true)}
                        fitViewKey={selectedWorkflowId ? `${selectedWorkflowId}:${fitViewNonce}` : null}
                      />
                    </div>
                    
                    {/* Properties Panel - Shows when a block is selected */}
                    {selectedBlock && (
                      <NodePropertiesPanel
                        block={selectedBlock}
                        onUpdate={handleUpdateBlock}
                        onClose={() => setSelectedBlockId(null)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-8">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-agent-flow/10 border border-agent-flow/20 flex items-center justify-center mb-3 md:mb-4">
                    <WorkflowIcon className="w-7 h-7 md:w-10 md:h-10 text-agent-flow" />
                  </div>
                  <h2 className="text-base md:text-xl font-semibold text-foreground mb-1 md:mb-2">AETHER Flow</h2>
                  <p className="text-muted-foreground max-w-md mb-4 md:mb-6 text-xs md:text-base px-4">Créez des workflows automatisés pour orchestrer vos processus métier</p>
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-3 w-full max-w-xs sm:max-w-none px-4">
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-agent-flow hover:bg-agent-flow/90 text-xs md:text-sm h-9 md:h-10 w-full sm:w-auto">
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      Nouveau
                    </Button>
                    <Button variant="outline" onClick={() => setIsAIGeneratorOpen(true)} className="text-xs md:text-sm h-9 md:h-10 w-full sm:w-auto">
                      <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      Générer IA
                    </Button>
                    <Button variant="outline" onClick={() => setIsTemplateGalleryOpen(true)} className="text-xs md:text-sm h-9 md:h-10 w-full sm:w-auto">
                      <LayoutTemplate className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      Templates
                    </Button>
                  </div>
                </div>
              )}
            </div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>Give your workflow a name and description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="My Workflow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={newWorkflowDesc}
                onChange={(e) => setNewWorkflowDesc(e.target.value)}
                placeholder="Describe what this workflow does..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow} className="bg-[hsl(var(--agent-flow))] hover:bg-[hsl(var(--agent-flow))]/90">Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generator Dialog */}
      <AIWorkflowGenerator 
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onGenerate={(blocks, name, desc, connections) => { handleAIGenerate(blocks, name, desc, connections); setIsAIGeneratorOpen(false); }}
        existingWorkflow={selectedWorkflow ? {
          id: selectedWorkflow.id,
          name: selectedWorkflow.name,
          blocks: localBlocks,
          connections: localConnections
        } : undefined}
        onModify={handleAIModify}
      />

      {/* Template Gallery */}
      <TemplateGallery
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Block Picker */}
      <BlockPickerDialog
        isOpen={isBlockPickerOpen}
        onClose={() => setIsBlockPickerOpen(false)}
        onAddBlock={handleAddBlock}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkflow} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
