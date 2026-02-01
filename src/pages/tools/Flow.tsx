import { useState, useEffect, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWorkflows, useWorkflowRuns } from '@/hooks/useWorkflows';
import { Workflow, WorkflowBlock, BlockType, BlockConnection } from '@/types/workflow';
import { getBlockByType, BlockDefinition } from '@/types/block-library';
import { WorkflowBuilder } from '@/components/flow/WorkflowBuilder';
import { ProCanvasV2 } from '@/components/flow/canvas/ProCanvasV2';
import { WorkflowExecutor } from '@/components/flow/WorkflowExecutor';
import { WorkflowHistory } from '@/components/flow/WorkflowHistory';
import { AIWorkflowGenerator } from '@/components/flow/AIWorkflowGenerator';
import { TemplateGallery } from '@/components/flow/TemplateGallery';
import { BlockPaletteN8N } from '@/components/flow/palette/BlockPaletteN8N';
import { AIAutomationRules } from '@/components/flow/AIAutomationRules';
import { NodePropertiesPanel } from '@/components/flow/panels/NodePropertiesPanel';
import { autoLayoutBlocks, applyLayoutToBlocks, suggestNewBlockPosition } from '@/lib/workflow-layout';
import { 
  Plus, Workflow as WorkflowIcon, Save, Trash2, Copy, 
  Loader2, MoreVertical, Sparkles, LayoutTemplate, Zap, Undo2, Redo2, Bot, LayoutGrid, Home
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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [localBlocks, setLocalBlocks] = useState<WorkflowBlock[]>([]);
  const [localConnections, setLocalConnections] = useState<BlockConnection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Auto-save when blocks or connections change
  useEffect(() => {
    if (!selectedWorkflowId || isUndoRedoAction.current) return;
    
    // Compare with saved state
    const savedBlocks = selectedWorkflow?.blocks || [];
    const savedConnections = selectedWorkflow?.connections || [];
    const hasChanges = JSON.stringify(localBlocks) !== JSON.stringify(savedBlocks) || 
                       JSON.stringify(localConnections) !== JSON.stringify(savedConnections);
    
    if (!hasChanges) return;

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Debounce auto-save (500ms after last change)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      const success = await updateWorkflow(selectedWorkflowId, { 
        blocks: localBlocks,
        connections: localConnections 
      });
      setIsSaving(false);
      if (!success) {
        toast.error('Échec de la sauvegarde automatique');
      }
    }, 500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [localBlocks, localConnections, selectedWorkflowId]);

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
    toast.success('Workflow modifié par l\'IA');
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

  const handleAddBlock = (type: string, definition?: BlockDefinition) => {
    if (!selectedWorkflowId) return;
    const def = definition || getBlockByType(type);
    
    // Use intelligent position suggestion based on graph structure
    const sourceBlockId = selectedBlockId || (localBlocks.length > 0 
      ? localBlocks.reduce((last, b) => b.position.x > last.position.x ? b : last, localBlocks[0]).id
      : undefined);
    
    const newPosition = suggestNewBlockPosition(localBlocks, localConnections, sourceBlockId);
    
    const newBlock: WorkflowBlock = {
      id: crypto.randomUUID(),
      type: type as BlockType,
      name: def?.name || type,
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
    setSelectedBlockId(newBlock.id);
    setSelectedBlockId(newBlock.id);
    setIsPaletteOpen(false);
  };

  // Auto-layout function - reorganize all blocks algorithmically
  const handleAutoLayout = useCallback(() => {
    if (localBlocks.length === 0) return;
    
    const layout = autoLayoutBlocks(localBlocks, localConnections);
    const repositionedBlocks = applyLayoutToBlocks(localBlocks, layout);
    
    setLocalBlocks(repositionedBlocks);
    toast.success('Layout optimisé automatiquement');
  }, [localBlocks, localConnections]);

  const handleUpdateBlock = (blockId: string, updates: Partial<WorkflowBlock>) => {
    setLocalBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b));
  };

  const handleDeleteBlock = (blockId: string) => {
    setLocalBlocks(prev => prev.filter(b => b.id !== blockId));
    // Also remove any connections involving this block
    setLocalConnections(prev => prev.filter(c => c.sourceBlockId !== blockId && c.targetBlockId !== blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const handleAddConnection = (connection: BlockConnection) => {
    setLocalConnections(prev => [...prev, connection]);
  };

  const handleRemoveConnection = (connectionId: string) => {
    setLocalConnections(prev => prev.filter(c => c.id !== connectionId));
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
  };

  // Manual save is no longer needed - auto-save handles everything
  const handleSaveWorkflow = async () => {
    if (!selectedWorkflowId) return;
    setIsSaving(true);
    const success = await updateWorkflow(selectedWorkflowId, { 
      blocks: localBlocks,
      connections: localConnections 
    });
    setIsSaving(false);
    if (success) {
      toast.success('Workflow sauvegardé');
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
              {/* Workflow Builder - Full width when workflow is selected */}
              {selectedWorkflow ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ minHeight: '400px' }}>
                  <div className="flex items-center justify-between gap-2 px-3 md:px-6 py-2 md:py-3 border-b border-border bg-card/30 flex-shrink-0">
                    {/* Left side: Home button + Workflow name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedWorkflowId(null)} 
                            className="h-7 md:h-8 w-7 md:w-8 p-0 flex-shrink-0"
                          >
                            <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Retour à l'accueil</TooltipContent>
                      </Tooltip>
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
                      {isSaving && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="hidden sm:inline">Saving...</span>
                        </div>
                      )}
                      <WorkflowExecutor
                        blocks={localBlocks}
                        connections={localConnections}
                        workflowId={selectedWorkflow.id}
                        workflowName={selectedWorkflow.name}
                        onRunCreated={(runId, logs, output) => handleRunCompleted(selectedWorkflow.id, logs, output)}
                        onFocusBlock={(blockId) => {
                          setIsPaletteOpen(false);
                          setSelectedBlockId(blockId);
                        }}
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
                        isSaving={isSaving}
                        onAutoLayout={handleAutoLayout}
                        onAddBlock={() => setIsPaletteOpen(!isPaletteOpen)}
                        fitViewKey={selectedWorkflowId ? `${selectedWorkflowId}:${fitViewNonce}` : null}
                      />
                    </div>
                    
                    {/* Block Palette - N8N Style (slide in from right) */}
                    {isPaletteOpen && (
                      <BlockPaletteN8N
                        onAddBlock={handleAddBlock}
                        className="flex-shrink-0"
                      />
                    )}
                    
                    {/* Properties Panel - Shows when a block is selected and palette is closed */}
                    {selectedBlock && !isPaletteOpen && (
                      <NodePropertiesPanel
                        block={selectedBlock}
                        onUpdate={handleUpdateBlock}
                        onClose={() => setSelectedBlockId(null)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 md:p-8 pb-12">
                    {/* Hero Section */}
                    <div className="text-center mb-8 md:mb-10">
                      <p className="text-muted-foreground max-w-lg mb-6 text-sm md:text-base mx-auto leading-relaxed">
                        Créez des workflows automatisés pour orchestrer vos processus métier
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-agent-flow hover:bg-agent-flow/90 text-sm h-10 px-5 shadow-md shadow-agent-flow/20">
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau
                        </Button>
                        <Button variant="outline" onClick={() => setIsAIGeneratorOpen(true)} className="text-sm h-10 px-5">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Générer IA
                        </Button>
                        <Button variant="outline" onClick={() => setIsTemplateGalleryOpen(true)} className="text-sm h-10 px-5">
                          <LayoutTemplate className="w-4 h-4 mr-2" />
                          Templates
                        </Button>
                      </div>
                    </div>

                    {/* Workflows List */}
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-agent-flow" />
                      </div>
                    ) : workflows.length > 0 ? (
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-foreground">
                            Vos workflows
                            <span className="ml-2 text-sm font-normal text-muted-foreground">({workflows.length})</span>
                          </h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {workflows.map((workflow) => (
                            <div
                              key={workflow.id}
                              onClick={() => handleSelectWorkflow(workflow.id)}
                              className="p-4 rounded-xl bg-card border border-border hover:border-agent-flow/50 hover:shadow-lg hover:shadow-agent-flow/5 transition-all cursor-pointer group"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-agent-flow/20 to-agent-flow/5 flex items-center justify-center flex-shrink-0">
                                  <WorkflowIcon className="w-5 h-5 text-agent-flow" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground text-sm leading-tight truncate" title={workflow.name}>
                                    {workflow.name}
                                  </h4>
                                  {workflow.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" title={workflow.description}>
                                      {workflow.description}
                                    </p>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateWorkflow(workflow); }}>
                                      <Copy className="w-4 h-4 mr-2" />Dupliquer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setWorkflowToDelete(workflow.id); setDeleteDialogOpen(true); }}>
                                      <Trash2 className="w-4 h-4 mr-2" />Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${workflow.is_active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>
                                  {workflow.is_active ? 'Actif' : 'Pausé'}
                                </span>
                                <span className="text-xs text-muted-foreground">{workflow.blocks?.length || 0} blocs</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground">Aucun workflow créé</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Commencez par créer votre premier workflow</p>
                      </div>
                    )}
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
