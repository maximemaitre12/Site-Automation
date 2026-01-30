import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, ExecutionStatus } from '@/types/workflow';
import { CanvasState, CanvasConfig, DEFAULT_CANVAS_CONFIG, BlockVisualState } from '@/types/workflow-v2';
import { WorkflowNode } from '../nodes/WorkflowNode';
import { AnimatedEdge } from '../edges/AnimatedEdge';
import { CanvasToolbar } from './CanvasToolbar';
import { MiniMap } from './MiniMap';
import { autoLayoutBlocks, applyLayoutToBlocks, snapToGrid } from '@/lib/workflow-layout';
import { cn } from '@/lib/utils';

interface HorizontalCanvasProps {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  selectedBlockId: string | null;
  executionStatuses?: Record<string, ExecutionStatus>;
  onBlockSelect: (blockId: string | null) => void;
  onBlockUpdate: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (blockId: string) => void;
  onConnectionAdd: (connection: BlockConnection) => void;
  onConnectionRemove: (connectionId: string) => void;
  onBlocksChange: (blocks: WorkflowBlock[]) => void;
  onSave: () => void;
  onRun: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  isRunning?: boolean;
  className?: string;
}

function HorizontalCanvasComponent({
  blocks,
  connections,
  selectedBlockId,
  executionStatuses = {},
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onConnectionAdd,
  onConnectionRemove,
  onBlocksChange,
  onSave,
  onRun,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasUnsavedChanges,
  isRunning = false,
  className,
}: HorizontalCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Viewport for minimap
  const [viewportRect, setViewportRect] = useState({ x: 0, y: 0, width: 1000, height: 600 });

  // Update viewport when container size or pan/zoom changes
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setViewportRect({
      x: -pan.x / zoom,
      y: -pan.y / zoom,
      width: rect.width / zoom,
      height: rect.height / zoom,
    });
  }, [pan, zoom]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 0.25, DEFAULT_CANVAS_CONFIG.maxZoom));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 0.25, DEFAULT_CANVAS_CONFIG.minZoom));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const handleFitView = useCallback(() => {
    if (blocks.length === 0 || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = blocks.map(b => b.position);
    
    const minX = Math.min(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxX = Math.max(...positions.map(p => p.x + DEFAULT_CANVAS_CONFIG.nodeWidth));
    const maxY = Math.max(...positions.map(p => p.y + DEFAULT_CANVAS_CONFIG.nodeHeight));
    
    const contentWidth = maxX - minX + 100;
    const contentHeight = maxY - minY + 100;
    
    const scaleX = containerRect.width / contentWidth;
    const scaleY = containerRect.height / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(newZoom);
    setPan({
      x: -minX * newZoom + (containerRect.width - contentWidth * newZoom) / 2 + 50 * newZoom,
      y: -minY * newZoom + (containerRect.height - contentHeight * newZoom) / 2 + 50 * newZoom,
    });
  }, [blocks]);

  // Auto layout
  const handleAutoLayout = useCallback(() => {
    const layout = autoLayoutBlocks(blocks, connections, { direction: 'horizontal' });
    const newBlocks = applyLayoutToBlocks(blocks, layout);
    onBlocksChange(newBlocks);
  }, [blocks, connections, onBlocksChange]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.max(DEFAULT_CANVAS_CONFIG.minZoom, Math.min(DEFAULT_CANVAS_CONFIG.maxZoom, z + delta)));
    }
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.target === svgRef.current)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingBlockId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      let newX = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
      let newY = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
      
      if (snapEnabled) {
        const snapped = snapToGrid(newX, newY, DEFAULT_CANVAS_CONFIG.gridSize);
        newX = snapped.x;
        newY = snapped.y;
      }
      
      onBlockUpdate(draggingBlockId, { position: { x: newX, y: newY } });
    }
  }, [isPanning, panStart, draggingBlockId, dragOffset, pan, zoom, snapEnabled, onBlockUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingBlockId(null);
  }, []);

  // Block drag
  const handleBlockDragStart = useCallback((blockId: string, e: React.MouseEvent) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const blockX = block.position.x;
    const blockY = block.position.y;
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;
    
    setDragOffset({
      x: mouseX - blockX,
      y: mouseY - blockY,
    });
    setDraggingBlockId(blockId);
  }, [blocks, pan, zoom]);

  // Delete selected
  const handleDeleteSelected = useCallback(() => {
    if (selectedBlockId) {
      onBlockDelete(selectedBlockId);
    }
  }, [selectedBlockId, onBlockDelete]);

  // Duplicate selected
  const handleDuplicateSelected = useCallback(() => {
    if (selectedBlockId) {
      onBlockDuplicate(selectedBlockId);
    }
  }, [selectedBlockId, onBlockDuplicate]);

  // Minimap viewport change
  const handleViewportChange = useCallback((x: number, y: number) => {
    setPan({
      x: -x * zoom,
      y: -y * zoom,
    });
  }, [zoom]);

  // Canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      onBlockSelect(null);
    }
  }, [onBlockSelect]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBlockId && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onBlockDelete(selectedBlockId);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedBlockId) {
          onBlockDuplicate(selectedBlockId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, onBlockDelete, onUndo, onRedo, onSave, onBlockDuplicate]);

  // Build visual states
  const blockVisualStates: Record<string, BlockVisualState> = {};
  blocks.forEach(block => {
    blockVisualStates[block.id] = {
      isSelected: block.id === selectedBlockId,
      isHovered: block.id === hoveredBlockId,
      isDragging: block.id === draggingBlockId,
      isConnecting: false,
      executionStatus: executionStatuses[block.id] || 'idle',
      hasError: executionStatuses[block.id] === 'error',
      isCollapsed: false,
    };
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-background",
        isPanning && "cursor-grabbing",
        className
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Toolbar */}
      <CanvasToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onFitView={handleFitView}
        onAutoLayout={handleAutoLayout}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        onToggleSnapToGrid={() => setSnapEnabled(!snapEnabled)}
        onUndo={onUndo}
        onRedo={onRedo}
        onDeleteSelected={handleDeleteSelected}
        onDuplicateSelected={handleDuplicateSelected}
        onSave={onSave}
        onRun={onRun}
        showGrid={showGrid}
        showMiniMap={showMiniMap}
        snapToGrid={snapEnabled}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={!!selectedBlockId}
        hasUnsavedChanges={hasUnsavedChanges}
        isRunning={isRunning}
      />

      {/* Canvas SVG */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full canvas-background"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Grid pattern */}
        {showGrid && (
          <>
            <defs>
              <pattern
                id="grid-dots"
                width={DEFAULT_CANVAS_CONFIG.gridSize * zoom}
                height={DEFAULT_CANVAS_CONFIG.gridSize * zoom}
                patternUnits="userSpaceOnUse"
                x={pan.x % (DEFAULT_CANVAS_CONFIG.gridSize * zoom)}
                y={pan.y % (DEFAULT_CANVAS_CONFIG.gridSize * zoom)}
              >
                <circle
                  cx={DEFAULT_CANVAS_CONFIG.gridSize * zoom / 2}
                  cy={DEFAULT_CANVAS_CONFIG.gridSize * zoom / 2}
                  r={1}
                  fill="currentColor"
                  className="text-muted-foreground/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dots)" />
          </>
        )}

        {/* Connections layer */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {connections.map(conn => {
            const sourceBlock = blocks.find(b => b.id === conn.sourceBlockId);
            const targetBlock = blocks.find(b => b.id === conn.targetBlockId);
            if (!sourceBlock || !targetBlock) return null;

            const sourceStatus = executionStatuses[conn.sourceBlockId] || 'idle';
            
            return (
              <AnimatedEdge
                key={conn.id}
                connection={conn}
                sourcePosition={sourceBlock.position}
                targetPosition={targetBlock.position}
                status={sourceStatus}
                onClick={onConnectionRemove}
              />
            );
          })}
        </g>
      </svg>

      {/* Blocks layer (HTML for better styling) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {blocks.map(block => (
          <div
            key={block.id}
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
          >
            <WorkflowNode
              block={block}
              visualState={blockVisualStates[block.id]}
              onSelect={onBlockSelect}
              onDoubleClick={(id) => {
                // Could open properties panel or sub-workflow
              }}
              onDragStart={handleBlockDragStart}
              zoom={zoom}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm mb-1">Canvas vide</p>
            <p className="text-muted-foreground/70 text-xs">Ajoutez des blocs depuis la palette ou générez avec l'IA</p>
          </div>
        </div>
      )}

      {/* MiniMap */}
      {showMiniMap && blocks.length > 0 && (
        <MiniMap
          blocks={blocks}
          connections={connections}
          viewportRect={viewportRect}
          canvasSize={{ width: 2000, height: 1500 }}
          onViewportChange={handleViewportChange}
        />
      )}
    </div>
  );
}

export const HorizontalCanvas = memo(HorizontalCanvasComponent);
