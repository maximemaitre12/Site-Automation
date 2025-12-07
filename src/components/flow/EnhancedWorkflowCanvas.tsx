import { useState, useRef, useCallback, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play, Plus, Trash2,
  Move, Zap, X, Settings, Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play
};

interface EnhancedWorkflowCanvasProps {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onAddConnection: (connection: BlockConnection) => void;
  onRemoveConnection: (connectionId: string) => void;
  onAddBlock: () => void;
}

interface DragState {
  blockId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface ConnectionDragState {
  sourceBlockId: string | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function EnhancedWorkflowCanvas({
  blocks,
  connections,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onAddConnection,
  onRemoveConnection,
  onAddBlock
}: EnhancedWorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({ blockId: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  const [connectionDrag, setConnectionDrag] = useState<ConnectionDragState>({ sourceBlockId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Block dimensions
  const BLOCK_WIDTH = 220;
  const BLOCK_HEIGHT = 80;

  // Handle block drag start
  const handleBlockDragStart = (e: ReactMouseEvent, blockId: string) => {
    e.stopPropagation();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    setDragState({
      blockId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: block.position.x,
      offsetY: block.position.y
    });
    onSelectBlock(blockId);
  };

  // Handle connection drag start
  const handleConnectionDragStart = (e: ReactMouseEvent, blockId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (block.position.x + BLOCK_WIDTH) * zoom + canvasOffset.x;
    const startY = (block.position.y + BLOCK_HEIGHT / 2) * zoom + canvasOffset.y;

    setConnectionDrag({
      sourceBlockId: blockId,
      startX,
      startY,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top
    });
  };

  // Handle mouse move
  const handleMouseMove = useCallback((e: ReactMouseEvent) => {
    // Block dragging
    if (dragState.blockId) {
      const deltaX = (e.clientX - dragState.startX) / zoom;
      const deltaY = (e.clientY - dragState.startY) / zoom;
      
      const newX = Math.max(0, dragState.offsetX + deltaX);
      const newY = Math.max(0, dragState.offsetY + deltaY);

      onUpdateBlock(dragState.blockId, {
        position: { x: newX, y: newY }
      });
    }

    // Connection dragging
    if (connectionDrag.sourceBlockId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setConnectionDrag(prev => ({
        ...prev,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top
      }));
    }

    // Panning
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [dragState, connectionDrag, isPanning, panStart, zoom, onUpdateBlock]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    // Complete connection if hovering over a block
    if (connectionDrag.sourceBlockId && hoveredBlockId && connectionDrag.sourceBlockId !== hoveredBlockId) {
      // Check if connection already exists
      const existingConnection = connections.find(
        c => c.sourceBlockId === connectionDrag.sourceBlockId && c.targetBlockId === hoveredBlockId
      );
      
      if (!existingConnection) {
        onAddConnection({
          id: crypto.randomUUID(),
          sourceBlockId: connectionDrag.sourceBlockId,
          targetBlockId: hoveredBlockId
        });
      }
    }

    setDragState({ blockId: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
    setConnectionDrag({ sourceBlockId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
    setIsPanning(false);
  }, [connectionDrag, hoveredBlockId, connections, onAddConnection]);

  // Handle canvas pan start
  const handleCanvasMouseDown = (e: ReactMouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      onSelectBlock(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle wheel for zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.min(2, Math.max(0.25, prev * delta)));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Get block position for connection line
  const getBlockCenter = (blockId: string, side: 'left' | 'right') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return { x: 0, y: 0 };
    
    return {
      x: (side === 'right' ? block.position.x + BLOCK_WIDTH : block.position.x) * zoom + canvasOffset.x,
      y: (block.position.y + BLOCK_HEIGHT / 2) * zoom + canvasOffset.y
    };
  };

  // Render connection line
  const renderConnection = (connection: BlockConnection) => {
    const source = getBlockCenter(connection.sourceBlockId, 'right');
    const target = getBlockCenter(connection.targetBlockId, 'left');
    
    // Calculate control points for bezier curve
    const dx = target.x - source.x;
    const controlOffset = Math.min(Math.abs(dx) / 2, 100);
    const path = `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`;

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    return (
      <g key={connection.id} className="group cursor-pointer">
        {/* Invisible wider path for easier clicking */}
        <path
          d={path}
          stroke="transparent"
          strokeWidth={20}
          fill="none"
        />
        {/* Visible path */}
        <path
          d={path}
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          fill="none"
          className="transition-all group-hover:stroke-[4px]"
          markerEnd="url(#arrowhead)"
        />
        {/* Delete button on hover */}
        <g 
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveConnection(connection.id);
          }}
        >
          <circle
            cx={midX}
            cy={midY}
            r={14}
            fill="hsl(var(--destructive))"
          />
          <line x1={midX - 5} y1={midY - 5} x2={midX + 5} y2={midY + 5} stroke="white" strokeWidth={2} />
          <line x1={midX + 5} y1={midY - 5} x2={midX - 5} y2={midY + 5} stroke="white" strokeWidth={2} />
        </g>
      </g>
    );
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-muted/30">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-xl border border-border p-2 shadow-lg">
        <Button variant="outline" size="sm" onClick={onAddBlock} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter bloc
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button 
          variant="ghost" 
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
        >
          +
        </Button>
        <span className="text-xs text-muted-foreground min-w-[40px] text-center font-mono">
          {Math.round(zoom * 100)}%
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => setZoom(prev => Math.max(0.25, prev - 0.1))}
        >
          -
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => { setZoom(1); setCanvasOffset({ x: 50, y: 50 }); }}
        >
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-card/95 backdrop-blur-sm rounded-xl border border-border p-3 shadow-lg">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2"><Move className="w-3 h-3" /> Glissez les blocs librement</div>
          <div className="flex items-center gap-2"><Link2 className="w-3 h-3" /> Point bleu → créer connexion</div>
          <div className="flex items-center gap-2"><X className="w-3 h-3 text-destructive" /> Survolez ligne → supprimer</div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "w-full h-full min-h-[600px] relative",
          isPanning && "cursor-grabbing",
          !isPanning && !dragState.blockId && "cursor-grab"
        )}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid pattern background */}
        <div 
          className="canvas-background absolute inset-0 pointer-events-auto"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1.5px, transparent 1.5px)`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${canvasOffset.x % (24 * zoom)}px ${canvasOffset.y % (24 * zoom)}px`
          }}
        />

        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>
          
          {/* Existing connections */}
          <g className="pointer-events-auto">
            {connections.map(renderConnection)}
          </g>

          {/* Connection being dragged */}
          {connectionDrag.sourceBlockId && (
            <path
              d={`M ${connectionDrag.startX} ${connectionDrag.startY} 
                  C ${(connectionDrag.startX + connectionDrag.currentX) / 2} ${connectionDrag.startY}, 
                    ${(connectionDrag.startX + connectionDrag.currentX) / 2} ${connectionDrag.currentY}, 
                    ${connectionDrag.currentX} ${connectionDrag.currentY}`}
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              strokeDasharray="8,4"
              fill="none"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Blocks */}
        {blocks.map(block => {
          const def = BLOCK_DEFINITIONS[block.type as BlockType];
          const Icon = iconMap[def?.icon] || Sparkles;
          const isSelected = selectedBlockId === block.id;
          const isDragging = dragState.blockId === block.id;
          const isHovered = hoveredBlockId === block.id;
          const outgoingCount = connections.filter(c => c.sourceBlockId === block.id).length;
          const incomingCount = connections.filter(c => c.targetBlockId === block.id).length;
          const isConnectionTarget = connectionDrag.sourceBlockId && connectionDrag.sourceBlockId !== block.id && isHovered;

          return (
            <ContextMenu key={block.id}>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    "absolute rounded-2xl border-2 bg-card shadow-lg transition-all cursor-move select-none",
                    isSelected && "border-primary ring-4 ring-primary/20 shadow-xl",
                    !isSelected && "border-border hover:border-primary/50 hover:shadow-xl",
                    isDragging && "shadow-2xl scale-105",
                    isConnectionTarget && "border-primary ring-4 ring-primary/40 bg-primary/5"
                  )}
                  style={{
                    left: block.position.x * zoom + canvasOffset.x,
                    top: block.position.y * zoom + canvasOffset.y,
                    width: BLOCK_WIDTH * zoom,
                    height: BLOCK_HEIGHT * zoom,
                    zIndex: isDragging ? 100 : isSelected ? 50 : 10
                  }}
                  onMouseDown={(e) => handleBlockDragStart(e, block.id)}
                  onMouseEnter={() => setHoveredBlockId(block.id)}
                  onMouseLeave={() => setHoveredBlockId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                  }}
                >
                  <div className="p-3 h-full flex items-center gap-3">
                    {/* Icon */}
                    <div 
                      className={cn(
                        "rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md flex-shrink-0",
                        def?.color || 'from-gray-500 to-gray-400'
                      )}
                      style={{ width: 40 * zoom, height: 40 * zoom }}
                    >
                      <Icon className="text-white" style={{ width: 20 * zoom, height: 20 * zoom }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p 
                        className="font-semibold text-foreground truncate"
                        style={{ fontSize: 14 * zoom }}
                      >
                        {block.name}
                      </p>
                      <p 
                        className="text-muted-foreground truncate"
                        style={{ fontSize: 11 * zoom }}
                      >
                        {def?.name}
                      </p>
                    </div>
                  </div>

                  {/* Connection point - Left (input) */}
                  <div
                    className={cn(
                      "absolute bg-card border-2 rounded-full transition-all",
                      incomingCount > 0 ? "bg-primary border-primary" : "border-muted-foreground/40"
                    )}
                    style={{ 
                      width: 14 * zoom, 
                      height: 14 * zoom, 
                      left: -7 * zoom, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }}
                  />

                  {/* Connection point - Right (output) */}
                  <div
                    className={cn(
                      "absolute bg-primary border-2 border-primary rounded-full cursor-crosshair transition-all hover:scale-125",
                      outgoingCount > 0 ? "bg-primary" : "bg-card"
                    )}
                    style={{ 
                      width: 14 * zoom, 
                      height: 14 * zoom, 
                      right: -7 * zoom, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }}
                    onMouseDown={(e) => handleConnectionDragStart(e, block.id)}
                  />

                  {/* Badge for multiple connections */}
                  {outgoingCount > 1 && (
                    <Badge 
                      className="absolute -top-2 -right-2 text-[10px] px-1.5 bg-amber-500 text-white border-0"
                    >
                      <GitBranch className="w-3 h-3 mr-0.5" />
                      {outgoingCount}
                    </Badge>
                  )}

                  {/* Category badge */}
                  <div 
                    className={cn(
                      "absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide",
                      def?.category === 'trigger' && 'bg-blue-500 text-white',
                      def?.category === 'ai' && 'bg-violet-500 text-white',
                      def?.category === 'transform' && 'bg-emerald-500 text-white',
                      def?.category === 'control' && 'bg-amber-500 text-white',
                      def?.category === 'integration' && 'bg-blue-600 text-white',
                      def?.category === 'system' && 'bg-slate-500 text-white'
                    )}
                    style={{ fontSize: 9 * zoom }}
                  >
                    {def?.category}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onSelectBlock(block.id)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onDuplicateBlock(block.id)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Dupliquer
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="text-destructive"
                  onClick={() => onDeleteBlock(block.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
            <div className="text-center p-8 pointer-events-auto">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-primary/60" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Canvas libre
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Ajoutez des blocs et positionnez-les librement. Créez des connexions en glissant depuis les points bleus.
              </p>
              <Button onClick={onAddBlock} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Ajouter un bloc
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
