import { useState, useRef, useCallback, useEffect } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play, Plus, Trash2,
  Move, Zap, X, Settings, Link2, Grab, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 100, y: 100 });
  const [isDraggingBlock, setIsDraggingBlock] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [blockStartPos, setBlockStartPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [connectionEnd, setConnectionEnd] = useState({ x: 0, y: 0 });
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);

  const BLOCK_WIDTH = 220;
  const BLOCK_HEIGHT = 80;

  // Mouse handlers using native events for better control
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Block dragging
      if (isDraggingBlock) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;
        onUpdateBlock(isDraggingBlock, {
          position: { 
            x: Math.max(0, blockStartPos.x + dx), 
            y: Math.max(0, blockStartPos.y + dy) 
          }
        });
        return;
      }

      // Connection dragging
      if (connectionSource) {
        const rect = container.getBoundingClientRect();
        setConnectionEnd({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        return;
      }

      // Panning
      if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      // Complete connection
      if (connectionSource && hoveredBlockId && connectionSource !== hoveredBlockId) {
        const exists = connections.some(
          c => c.sourceBlockId === connectionSource && c.targetBlockId === hoveredBlockId
        );
        if (!exists) {
          onAddConnection({
            id: crypto.randomUUID(),
            sourceBlockId: connectionSource,
            targetBlockId: hoveredBlockId
          });
        }
      }

      setIsDraggingBlock(null);
      setConnectionSource(null);
      setIsPanning(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(prev => Math.min(2, Math.max(0.3, prev * factor)));
      } else {
        // Scroll to pan
        setOffset(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isDraggingBlock, dragStart, blockStartPos, zoom, connectionSource, hoveredBlockId, isPanning, panStart, connections, onUpdateBlock, onAddConnection]);

  // Start dragging a block
  const startBlockDrag = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    setIsDraggingBlock(blockId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setBlockStartPos({ x: block.position.x, y: block.position.y });
    onSelectBlock(blockId);
  };

  // Start creating a connection
  const startConnection = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setConnectionSource(blockId);
    setConnectionEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Start panning
  const startPanning = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === canvasRef.current) {
      onSelectBlock(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Get screen position for a block's connection point
  const getConnectionPoint = (blockId: string, side: 'left' | 'right') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return { x: 0, y: 0 };
    
    const x = side === 'right' 
      ? block.position.x * zoom + offset.x + BLOCK_WIDTH * zoom
      : block.position.x * zoom + offset.x;
    const y = block.position.y * zoom + offset.y + (BLOCK_HEIGHT * zoom) / 2;
    
    return { x, y };
  };

  // Render a connection path
  const renderConnectionPath = (sourceId: string, targetId: string) => {
    const source = getConnectionPoint(sourceId, 'right');
    const target = getConnectionPoint(targetId, 'left');
    
    const dx = Math.abs(target.x - source.x);
    const controlX = Math.min(dx / 2, 80);
    
    return `M ${source.x} ${source.y} C ${source.x + controlX} ${source.y}, ${target.x - controlX} ${target.y}, ${target.x} ${target.y}`;
  };

  // Render dragging connection
  const renderDraggingConnection = () => {
    if (!connectionSource) return null;
    
    const source = getConnectionPoint(connectionSource, 'right');
    const dx = Math.abs(connectionEnd.x - source.x);
    const controlX = Math.min(dx / 2, 80);
    
    return (
      <path
        d={`M ${source.x} ${source.y} C ${source.x + controlX} ${source.y}, ${connectionEnd.x - controlX} ${connectionEnd.y}, ${connectionEnd.x} ${connectionEnd.y}`}
        stroke="hsl(var(--primary))"
        strokeWidth={3}
        strokeDasharray="8 4"
        fill="none"
        className="animate-pulse"
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex-1 overflow-hidden bg-muted/20",
        isPanning ? "cursor-grabbing" : "cursor-grab"
      )}
      onMouseDown={startPanning}
    >
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-xl border border-border p-2 shadow-lg">
        <Button variant="default" size="sm" onClick={onAddBlock} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</Button>
        <span className="text-xs text-muted-foreground min-w-[45px] text-center font-mono">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}>-</Button>
        <Button variant="ghost" size="sm" onClick={() => { setZoom(1); setOffset({ x: 100, y: 100 }); }}>Reset</Button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-xl border border-border p-3 shadow-lg max-w-[200px]">
        <div className="text-xs text-muted-foreground space-y-1.5">
          <div className="flex items-center gap-2"><Grab className="w-3 h-3" /> Glissez les blocs</div>
          <div className="flex items-center gap-2"><Link2 className="w-3 h-3 text-primary" /> Cercle bleu → connexion</div>
          <div className="flex items-center gap-2"><Move className="w-3 h-3" /> Scroll/glisser = défilement</div>
          <div className="flex items-center gap-2"><X className="w-3 h-3 text-destructive" /> Survol ligne = supprimer</div>
        </div>
      </div>

      {/* Canvas with grid */}
      <div 
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${offset.x % (24 * zoom)}px ${offset.y % (24 * zoom)}px`
        }}
      />

      {/* SVG layer for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
          </marker>
        </defs>

        {/* Existing connections */}
        {connections.map(conn => {
          const isHovered = hoveredConnectionId === conn.id;
          const path = renderConnectionPath(conn.sourceBlockId, conn.targetBlockId);
          const source = getConnectionPoint(conn.sourceBlockId, 'right');
          const target = getConnectionPoint(conn.targetBlockId, 'left');
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;

          return (
            <g key={conn.id} className="pointer-events-auto">
              {/* Invisible wider hit area */}
              <path
                d={path}
                stroke="transparent"
                strokeWidth={20}
                fill="none"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredConnectionId(conn.id)}
                onMouseLeave={() => setHoveredConnectionId(null)}
                onClick={(e) => { e.stopPropagation(); onRemoveConnection(conn.id); }}
              />
              {/* Visible line */}
              <path
                d={path}
                stroke="hsl(var(--primary))"
                strokeWidth={isHovered ? 4 : 2.5}
                fill="none"
                markerEnd="url(#arrow)"
                className="transition-all"
              />
              {/* Delete button on hover */}
              {isHovered && (
                <g 
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); onRemoveConnection(conn.id); }}
                >
                  <circle cx={midX} cy={midY} r={14} fill="hsl(var(--destructive))" />
                  <text x={midX} y={midY} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">×</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Connection being drawn */}
        {renderDraggingConnection()}
      </svg>

      {/* Blocks */}
      {blocks.map(block => {
        const def = BLOCK_DEFINITIONS[block.type as BlockType];
        const Icon = iconMap[def?.icon] || Sparkles;
        const isSelected = selectedBlockId === block.id;
        const isDragging = isDraggingBlock === block.id;
        const isHovered = hoveredBlockId === block.id;
        const isConnectionTarget = connectionSource && connectionSource !== block.id && isHovered;
        const outgoingCount = connections.filter(c => c.sourceBlockId === block.id).length;
        const incomingCount = connections.filter(c => c.targetBlockId === block.id).length;

        const left = block.position.x * zoom + offset.x;
        const top = block.position.y * zoom + offset.y;
        const width = BLOCK_WIDTH * zoom;
        const height = BLOCK_HEIGHT * zoom;

        return (
          <div
            key={block.id}
            className={cn(
              "absolute rounded-2xl border-2 bg-card shadow-lg select-none transition-shadow",
              isSelected && "border-primary ring-4 ring-primary/20 shadow-xl",
              !isSelected && "border-border hover:border-primary/50",
              isDragging && "shadow-2xl cursor-grabbing",
              !isDragging && "cursor-grab",
              isConnectionTarget && "border-primary ring-4 ring-primary/30 bg-primary/5"
            )}
            style={{ left, top, width, height, zIndex: isDragging ? 100 : isSelected ? 50 : 10 }}
            onMouseDown={(e) => startBlockDrag(e, block.id)}
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
          >
            {/* Block content */}
            <div className="p-3 h-full flex items-center gap-3 overflow-hidden">
              <div 
                className={cn("rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md flex-shrink-0", def?.color || 'from-gray-500 to-gray-400')}
                style={{ width: 40 * zoom, height: 40 * zoom }}
              >
                <Icon className="text-white" style={{ width: 20 * zoom, height: 20 * zoom }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate" style={{ fontSize: 14 * zoom }}>{block.name}</p>
                <p className="text-muted-foreground truncate" style={{ fontSize: 11 * zoom }}>{def?.name}</p>
              </div>
            </div>

            {/* Input connection point (left) */}
            <div
              className={cn(
                "absolute rounded-full border-2 transition-all",
                incomingCount > 0 ? "bg-primary border-primary" : "bg-card border-muted-foreground/40"
              )}
              style={{ 
                width: 14 * zoom, height: 14 * zoom, 
                left: -7 * zoom, top: '50%', 
                transform: 'translateY(-50%)' 
              }}
            />

            {/* Output connection point (right) - draggable */}
            <div
              className={cn(
                "absolute rounded-full border-2 border-primary transition-all hover:scale-125",
                outgoingCount > 0 ? "bg-primary" : "bg-card hover:bg-primary/50",
                "cursor-crosshair"
              )}
              style={{ 
                width: 16 * zoom, height: 16 * zoom, 
                right: -8 * zoom, top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 15
              }}
              onMouseDown={(e) => startConnection(e, block.id)}
            />

            {/* Parallel execution badge */}
            {outgoingCount > 1 && (
              <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 bg-amber-500 border-0">
                <GitBranch className="w-3 h-3 mr-0.5" />{outgoingCount}
              </Badge>
            )}

            {/* Category badge */}
            <div 
              className={cn(
                "absolute -top-2 left-3 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide text-white",
                def?.category === 'trigger' && 'bg-blue-500',
                def?.category === 'ai' && 'bg-violet-500',
                def?.category === 'transform' && 'bg-emerald-500',
                def?.category === 'control' && 'bg-amber-500',
                def?.category === 'integration' && 'bg-blue-600',
                def?.category === 'system' && 'bg-slate-500'
              )}
              style={{ fontSize: 9 * zoom }}
            >
              {def?.category}
            </div>

            {/* Action buttons on selection */}
            {isSelected && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-card rounded-lg border border-border shadow-lg p-1" style={{ zIndex: 20 }}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); onDuplicateBlock(block.id); }}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div className="text-center p-8 pointer-events-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-primary/60" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Canvas Workflow</h2>
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
  );
}
