import { useState, useRef, useEffect } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play, Plus, Trash2,
  Move, Zap, X, Link2, Grab, Copy
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
  
  // Track if we're actually dragging (moved enough to count as drag)
  const [hasMoved, setHasMoved] = useState(false);
  const DRAG_THRESHOLD = 3;

  // Responsive block sizes
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const BLOCK_WIDTH = isMobile ? 180 : 240;
  const BLOCK_HEIGHT = isMobile ? 70 : 90;

  const getEventCoords = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
    if ('touches' in e) {
      return { clientX: e.touches[0]?.clientX || 0, clientY: e.touches[0]?.clientY || 0 };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoords(e);
      
      if (isDraggingBlock) {
        const dx = (coords.clientX - dragStart.x) / zoom;
        const dy = (coords.clientY - dragStart.y) / zoom;
        
        // Check if we've moved enough to count as a real drag
        if (!hasMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
          setHasMoved(true);
        }
        
        if (hasMoved || Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          e.preventDefault();
          onUpdateBlock(isDraggingBlock, {
            position: { 
              x: Math.max(0, Math.round(blockStartPos.x + dx)), 
              y: Math.max(0, Math.round(blockStartPos.y + dy)) 
            }
          });
        }
        return;
      }

      if (connectionSource) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        setConnectionEnd({
          x: coords.clientX - rect.left,
          y: coords.clientY - rect.top
        });
        
        const touchedBlock = blocks.find(block => {
          const blockLeft = block.position.x * zoom + offset.x;
          const blockTop = block.position.y * zoom + offset.y;
          const blockWidth = BLOCK_WIDTH * zoom;
          const blockHeight = BLOCK_HEIGHT * zoom;
          const relX = coords.clientX - rect.left;
          const relY = coords.clientY - rect.top;
          return relX >= blockLeft && relX <= blockLeft + blockWidth && 
                 relY >= blockTop && relY <= blockTop + blockHeight;
        });
        setHoveredBlockId(touchedBlock?.id || null);
        return;
      }

      if (isPanning) {
        e.preventDefault();
        const dx = coords.clientX - panStart.x;
        const dy = coords.clientY - panStart.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: coords.clientX, y: coords.clientY });
      }
    };

    const handleEnd = () => {
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
      setHoveredBlockId(null);
      setHasMoved(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(prev => Math.min(2, Math.max(0.3, prev * factor)));
      } else {
        setOffset(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('touchmove', handleMove, { passive: false });
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('touchcancel', handleEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseup', handleEnd);
      container.removeEventListener('mouseleave', handleEnd);
      container.removeEventListener('touchmove', handleMove);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('touchcancel', handleEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isDraggingBlock, dragStart, blockStartPos, zoom, connectionSource, hoveredBlockId, isPanning, panStart, connections, onUpdateBlock, onAddConnection, blocks, offset, hasMoved]);

  const startBlockDrag = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    setIsDraggingBlock(blockId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setBlockStartPos({ x: block.position.x, y: block.position.y });
    onSelectBlock(blockId);
  };

  const startBlockDragTouch = (e: React.TouchEvent, blockId: string) => {
    e.stopPropagation();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const touch = e.touches[0];
    setIsDraggingBlock(blockId);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setBlockStartPos({ x: block.position.x, y: block.position.y });
    onSelectBlock(blockId);
  };

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

  const startConnectionTouch = (e: React.TouchEvent, blockId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    setConnectionSource(blockId);
    setConnectionEnd({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const startPanning = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === canvasRef.current) {
      onSelectBlock(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const startPanningTouch = (e: React.TouchEvent) => {
    if (e.target === containerRef.current || e.target === canvasRef.current) {
      onSelectBlock(null);
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const getConnectionPoint = (blockId: string, side: 'top' | 'bottom') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return { x: 0, y: 0 };
    
    const x = block.position.x * zoom + offset.x + (BLOCK_WIDTH * zoom) / 2;
    const y = side === 'bottom' 
      ? block.position.y * zoom + offset.y + BLOCK_HEIGHT * zoom
      : block.position.y * zoom + offset.y;
    
    return { x, y };
  };

  const renderConnectionPath = (sourceId: string, targetId: string) => {
    const source = getConnectionPoint(sourceId, 'bottom');
    const target = getConnectionPoint(targetId, 'top');
    
    const dy = Math.abs(target.y - source.y);
    const controlY = Math.min(dy / 2, 60);
    
    return `M ${source.x} ${source.y} C ${source.x} ${source.y + controlY}, ${target.x} ${target.y - controlY}, ${target.x} ${target.y}`;
  };

  const renderDraggingConnection = () => {
    if (!connectionSource) return null;
    
    const source = getConnectionPoint(connectionSource, 'bottom');
    const dy = Math.abs(connectionEnd.y - source.y);
    const controlY = Math.min(dy / 2, 60);
    
    return (
      <path
        d={`M ${source.x} ${source.y} C ${source.x} ${source.y + controlY}, ${connectionEnd.x} ${connectionEnd.y - controlY}, ${connectionEnd.x} ${connectionEnd.y}`}
        stroke="hsl(var(--primary))"
        strokeWidth={3}
        strokeDasharray="8 4"
        fill="none"
        className="animate-pulse"
      />
    );
  };

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/20" style={{ minHeight: 0 }}>
        <div className="max-w-lg text-center px-4">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Zap className="w-7 h-7 md:w-10 md:h-10 text-primary/60" />
          </div>
          
          <h2 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-3">
            Créez votre workflow
          </h2>
          <p className="text-muted-foreground mb-4 md:mb-8 text-sm md:text-base">
            Ajoutez des blocs et connectez-les pour créer votre automatisation.
          </p>

          <Button variant="hero" size="default" onClick={onAddBlock} className="gap-2 h-9 md:h-11 text-sm md:text-base">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Ajouter un bloc
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full flex-1 overflow-hidden bg-muted/20 touch-none",
        isPanning ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{ minHeight: 0 }}
      onMouseDown={startPanning}
      onTouchStart={startPanningTouch}
    >
      {/* Toolbar - Compact on mobile */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20 flex items-center gap-1 md:gap-2 bg-card/95 backdrop-blur-sm rounded-lg md:rounded-xl border border-border p-1.5 md:p-2 shadow-lg">
        <Button variant="default" size="sm" onClick={onAddBlock} className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm">
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </Button>
        <div className="h-5 md:h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="w-6 h-6 md:w-8 md:h-8 p-0 text-xs" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</Button>
        <span className="text-[10px] md:text-xs text-muted-foreground min-w-[35px] md:min-w-[45px] text-center font-mono">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="sm" className="w-6 h-6 md:w-8 md:h-8 p-0 text-xs" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}>-</Button>
        <Button variant="ghost" size="sm" onClick={() => { setZoom(1); setOffset({ x: 50, y: 50 }); }} className="hidden sm:flex h-7 md:h-8 text-xs md:text-sm">Reset</Button>
      </div>

      {/* Instructions - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-xl border border-border p-3 shadow-lg max-w-[220px]">
        <div className="text-xs text-muted-foreground space-y-1.5">
          <div className="flex items-center gap-2"><Grab className="w-3 h-3" /> Glissez les blocs</div>
          <div className="flex items-center gap-2"><Link2 className="w-3 h-3 text-primary" /> Cercle bleu → connecter</div>
          <div className="flex items-center gap-2"><Move className="w-3 h-3" /> Fond = défilement</div>
          <div className="flex items-center gap-2"><X className="w-3 h-3 text-destructive" /> Clic sur ligne = supprimer</div>
        </div>
      </div>

      {/* Grid background */}
      <div 
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${offset.x % (24 * zoom)}px ${offset.y % (24 * zoom)}px`
        }}
      />

      {/* Connections SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
          </marker>
        </defs>

        {connections.map(conn => {
          const isHovered = hoveredConnectionId === conn.id;
          const path = renderConnectionPath(conn.sourceBlockId, conn.targetBlockId);
          const source = getConnectionPoint(conn.sourceBlockId, 'bottom');
          const target = getConnectionPoint(conn.targetBlockId, 'top');
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;

          return (
            <g key={conn.id} className="pointer-events-auto">
              <path
                d={path}
                stroke="transparent"
                strokeWidth={20}
                fill="none"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredConnectionId(conn.id)}
                onMouseLeave={() => setHoveredConnectionId(null)}
                onClick={(e) => { e.stopPropagation(); setHoveredConnectionId(null); onRemoveConnection(conn.id); }}
              />
              <path
                d={path}
                stroke="hsl(var(--primary))"
                strokeWidth={isHovered ? 4 : 2.5}
                fill="none"
                markerEnd="url(#arrow)"
                className="transition-all"
              />
              {isHovered && (
                <g 
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setHoveredConnectionId(null); onRemoveConnection(conn.id); }}
                >
                  <circle cx={midX} cy={midY} r={14} fill="hsl(var(--destructive))" />
                  <text x={midX} y={midY} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">×</text>
                </g>
              )}
            </g>
          );
        })}

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
        const hasConfig = Object.keys(block.config || {}).length > 0;

        const left = block.position.x * zoom + offset.x;
        const top = block.position.y * zoom + offset.y;
        const width = BLOCK_WIDTH * zoom;
        const height = BLOCK_HEIGHT * zoom;

        return (
          <div
            key={block.id}
            className={cn(
              "absolute rounded-2xl border-2 bg-card shadow-lg select-none transition-shadow touch-none",
              isSelected && "border-primary ring-4 ring-primary/20 shadow-xl",
              !isSelected && "border-border hover:border-primary/50",
              isDragging && "shadow-2xl cursor-grabbing",
              !isDragging && "cursor-grab",
              isConnectionTarget && "border-primary ring-4 ring-primary/30 bg-primary/5"
            )}
            style={{ left, top, width, height, zIndex: isDragging ? 100 : isSelected ? 50 : 10 }}
            onMouseDown={(e) => startBlockDrag(e, block.id)}
            onTouchStart={(e) => startBlockDragTouch(e, block.id)}
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
          >
            {/* Block content */}
            <div className="p-3 h-full flex items-center gap-3 overflow-hidden">
              <div 
                className={cn("rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md flex-shrink-0", def?.color || 'from-gray-500 to-gray-400')}
                style={{ width: 44 * zoom, height: 44 * zoom }}
              >
                <Icon className="text-white" style={{ width: 22 * zoom, height: 22 * zoom }} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="font-semibold text-foreground truncate" style={{ fontSize: 14 * zoom }}>
                  {block.name || def?.name}
                </div>
                <div className="text-muted-foreground truncate" style={{ fontSize: 11 * zoom }}>
                  {def?.category}
                </div>
                {hasConfig && (
                  <Badge variant="secondary" className="mt-1" style={{ fontSize: 9 * zoom }}>
                    Configuré
                  </Badge>
                )}
              </div>
            </div>

            {/* Input connection point (top) */}
            <div 
              className={cn(
                "absolute left-1/2 -translate-x-1/2 rounded-full border-2 transition-all",
                isConnectionTarget ? "bg-primary border-primary scale-150" : "bg-card border-primary/50"
              )}
              style={{ top: -6 * zoom, width: 12 * zoom, height: 12 * zoom }}
            />

            {/* Output connection point (bottom) - draggable */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-primary border-2 border-primary cursor-crosshair hover:scale-125 transition-transform"
              style={{ bottom: -6 * zoom, width: 12 * zoom, height: 12 * zoom }}
              onMouseDown={(e) => startConnection(e, block.id)}
              onTouchStart={(e) => startConnectionTouch(e, block.id)}
            />

            {/* Action buttons on selected block */}
            {isSelected && (
              <div 
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card rounded-lg border border-border shadow-lg p-1"
                style={{ zIndex: 200 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={(e) => { e.stopPropagation(); onDuplicateBlock(block.id); }}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
