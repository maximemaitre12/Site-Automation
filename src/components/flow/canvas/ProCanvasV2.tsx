// ==========================================
// AETHER FLOW - Professional Canvas V2
// N8N-Style with White Theme, Semantic Zoom, Groups, Annotations
// ==========================================

import { useState, useCallback, useRef, useEffect, memo, useMemo } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, ExecutionStatus } from '@/types/workflow';
import { DEFAULT_CANVAS_CONFIG, BlockVisualState } from '@/types/workflow-v2';
import { ProWorkflowNode, NODE_WIDTH, NODE_HEIGHT, NODE_TOTAL_HEIGHT } from '../nodes/ProWorkflowNode';
import { ProEdge } from '../edges/ProEdge';
import { ProCanvasToolbar } from './ProCanvasToolbar';
import { ProMiniMap } from './ProMiniMap';
import { StickyNote, WorkflowGroup } from '@/types/workflow-v2';
import { StickyNoteComponent } from '../annotations/StickyNote';
import { GroupContainer } from '../annotations/GroupContainer';
import { autoLayoutBlocks, applyLayoutToBlocks, snapToGrid } from '@/lib/workflow-layout';
import { cn } from '@/lib/utils';

// Semantic zoom levels
type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

function getZoomLevel(zoom: number): ZoomLevel {
  if (zoom < 0.4) return 'micro';
  if (zoom < 0.7) return 'mini';
  if (zoom < 1.2) return 'normal';
  return 'detailed';
}

interface ProCanvasV2Props {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  selectedBlockId: string | null;
  executionStatuses?: Record<string, ExecutionStatus>;
  stickyNotes?: StickyNote[];
  groups?: WorkflowGroup[];
  onBlockSelect: (blockId: string | null) => void;
  onBlockUpdate: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (blockId: string) => void;
  onConnectionAdd: (connection: BlockConnection) => void;
  onConnectionRemove: (connectionId: string) => void;
  onBlocksChange: (blocks: WorkflowBlock[]) => void;
  onStickyNotesChange?: (notes: StickyNote[]) => void;
  onGroupsChange?: (groups: WorkflowGroup[]) => void;
  onSave: () => void;
  onRun: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  isRunning?: boolean;
  className?: string;
  onAutoLayout?: () => void;
  onAddBlock?: () => void;
}

function ProCanvasV2Component({
  blocks,
  connections,
  selectedBlockId,
  executionStatuses = {},
  stickyNotes = [],
  groups = [],
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onConnectionAdd,
  onConnectionRemove,
  onBlocksChange,
  onStickyNotesChange,
  onGroupsChange,
  onSave,
  onRun,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasUnsavedChanges,
  isRunning = false,
  className,
  onAutoLayout,
  onAddBlock,
}: ProCanvasV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Semantic zoom level
  const zoomLevel = getZoomLevel(zoom);

  // Viewport for minimap
  const [viewportRect, setViewportRect] = useState({ x: 0, y: 0, width: 1200, height: 800 });

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

  // Filtered blocks based on search
  const filteredBlockIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return new Set(
      blocks
        .filter(b => b.name.toLowerCase().includes(query) || b.type.toLowerCase().includes(query))
        .map(b => b.id)
    );
  }, [blocks, searchQuery]);

  // Zoom handlers with smooth animation
  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 0.2, DEFAULT_CANVAS_CONFIG.maxZoom));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 0.2, DEFAULT_CANVAS_CONFIG.minZoom));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const handleFitView = useCallback(() => {
    if (blocks.length === 0 || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = blocks.map(b => b.position);
    
    const minX = Math.min(...positions.map(p => p.x)) - 100;
    const minY = Math.min(...positions.map(p => p.y)) - 100;
    const maxX = Math.max(...positions.map(p => p.x + NODE_WIDTH)) + 100;
    const maxY = Math.max(...positions.map(p => p.y + NODE_TOTAL_HEIGHT)) + 100;
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    const scaleX = containerRect.width / contentWidth;
    const scaleY = containerRect.height / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1.5) * 0.9;
    
    setZoom(newZoom);
    setPan({
      x: -minX * newZoom + (containerRect.width - contentWidth * newZoom) / 2,
      y: -minY * newZoom + (containerRect.height - contentHeight * newZoom) / 2,
    });
  }, [blocks]);

  // Auto layout
  const handleAutoLayout = useCallback(() => {
    const layout = autoLayoutBlocks(blocks, connections, { direction: 'horizontal' });
    const newBlocks = applyLayoutToBlocks(blocks, layout);
    onBlocksChange(newBlocks);
  }, [blocks, connections, onBlocksChange]);

  // Wheel zoom with smooth scaling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom(z => Math.max(DEFAULT_CANVAS_CONFIG.minZoom, Math.min(DEFAULT_CANVAS_CONFIG.maxZoom, z + delta)));
    } else {
      // Regular scroll = pan
      setPan(p => ({
        x: p.x - e.deltaX * 0.5,
        y: p.y - e.deltaY * 0.5,
      }));
    }
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.target === svgRef.current || (e.target as Element).closest('.canvas-background')))) {
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
    
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;
    
    setDragOffset({
      x: mouseX - block.position.x,
      y: mouseY - block.position.y,
    });
    setDraggingBlockId(blockId);
  }, [blocks, pan, zoom]);

  // Add sticky note
  const handleAddStickyNote = useCallback(() => {
    if (!onStickyNotesChange) return;
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      content: 'New annotation',
      position: { x: -pan.x / zoom + 100, y: -pan.y / zoom + 100 },
      color: 'green',
      width: 200,
      height: 100,
    };
    onStickyNotesChange([...stickyNotes, newNote]);
  }, [stickyNotes, onStickyNotesChange, pan, zoom]);

  // Add group
  const handleAddGroup = useCallback(() => {
    if (!onGroupsChange) return;
    const newGroup: WorkflowGroup = {
      id: crypto.randomUUID(),
      name: 'New Group',
      blockIds: [],
      position: { x: -pan.x / zoom + 50, y: -pan.y / zoom + 50 },
      size: { width: 400, height: 300 },
      color: '#22c55e',
      isCollapsed: false,
    };
    onGroupsChange([...groups, newGroup]);
  }, [groups, onGroupsChange, pan, zoom]);

  // Minimap viewport change
  const handleViewportChange = useCallback((x: number, y: number) => {
    setPan({
      x: -x * zoom,
      y: -y * zoom,
    });
  }, [zoom]);

  // Canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).classList.contains('canvas-background')) {
      onBlockSelect(null);
      setSelectedNoteId(null);
      setSelectedGroupId(null);
    }
  }, [onBlockSelect]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBlockId && !isInputFocused) {
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
      // Navigation with arrow keys
      if (!isInputFocused) {
        const PAN_STEP = 50;
        if (e.key === 'ArrowUp' || e.key === 'w') setPan(p => ({ ...p, y: p.y + PAN_STEP }));
        if (e.key === 'ArrowDown' || e.key === 's') setPan(p => ({ ...p, y: p.y - PAN_STEP }));
        if (e.key === 'ArrowLeft' || e.key === 'a') setPan(p => ({ ...p, x: p.x + PAN_STEP }));
        if (e.key === 'ArrowRight' || e.key === 'd') setPan(p => ({ ...p, x: p.x - PAN_STEP }));
        // Zoom with + and -
        if (e.key === '+' || e.key === '=') handleZoomIn();
        if (e.key === '-') handleZoomOut();
        // Fit view with F
        if (e.key === 'f') handleFitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, onBlockDelete, onUndo, onRedo, onSave, onBlockDuplicate, handleZoomIn, handleZoomOut, handleFitView]);

  // Build visual states
  const blockVisualStates: Record<string, BlockVisualState> = {};
  blocks.forEach(block => {
    const isFiltered = filteredBlockIds ? !filteredBlockIds.has(block.id) : false;
    blockVisualStates[block.id] = {
      isSelected: block.id === selectedBlockId,
      isHovered: block.id === hoveredBlockId,
      isDragging: block.id === draggingBlockId,
      isConnecting: false,
      executionStatus: executionStatuses[block.id] || 'idle',
      hasError: executionStatuses[block.id] === 'error',
      isCollapsed: false,
      isFiltered,
    };
  });

  // Grid size based on zoom
  const gridSize = DEFAULT_CANVAS_CONFIG.gridSize * zoom;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-[#fafbfc] transition-colors duration-200",
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
      <ProCanvasToolbar
        zoom={zoom}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onFitView={handleFitView}
        onAutoLayout={onAutoLayout || handleAutoLayout}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        onToggleSnapToGrid={() => setSnapEnabled(!snapEnabled)}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onRun={onRun}
        onAddBlock={onAddBlock}
        onAddStickyNote={handleAddStickyNote}
        onAddGroup={handleAddGroup}
        showGrid={showGrid}
        showMiniMap={showMiniMap}
        snapToGrid={snapEnabled}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={!!selectedBlockId}
        hasUnsavedChanges={hasUnsavedChanges}
        isRunning={isRunning}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        blockCount={blocks.length}
      />

      {/* Canvas SVG */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full canvas-background"
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Grid pattern - white theme style */}
        {showGrid && (
          <>
            <defs>
              <pattern
                id="grid-pattern"
                width={gridSize}
                height={gridSize}
                patternUnits="userSpaceOnUse"
                x={pan.x % gridSize}
                y={pan.y % gridSize}
              >
                <circle
                  cx={gridSize / 2}
                  cy={gridSize / 2}
                  r={1.2}
                  fill="#d1d5db"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" className="canvas-background" />
          </>
        )}

        {/* Groups layer (behind everything) */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {groups.map(group => (
            <GroupContainer
              key={group.id}
              group={group}
              isSelected={selectedGroupId === group.id}
              zoomLevel={zoomLevel}
              onSelect={() => setSelectedGroupId(group.id)}
            />
          ))}
        </g>

        {/* Connections layer */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {connections.map(conn => {
            const sourceBlock = blocks.find(b => b.id === conn.sourceBlockId);
            const targetBlock = blocks.find(b => b.id === conn.targetBlockId);
            if (!sourceBlock || !targetBlock) return null;

            const sourceStatus = executionStatuses[conn.sourceBlockId] || 'idle';
            const isFiltered = filteredBlockIds ? (!filteredBlockIds.has(conn.sourceBlockId) || !filteredBlockIds.has(conn.targetBlockId)) : false;
            
            return (
              <ProEdge
                key={conn.id}
                connection={conn}
                sourcePosition={sourceBlock.position}
                targetPosition={targetBlock.position}
                status={sourceStatus}
                isHovered={hoveredConnectionId === conn.id}
                isFiltered={isFiltered}
                zoomLevel={zoomLevel}
                onHover={(id) => setHoveredConnectionId(id)}
                onClick={onConnectionRemove}
              />
            );
          })}
        </g>

        {/* Sticky notes layer */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {stickyNotes.map(note => (
            <StickyNoteComponent
              key={note.id}
              note={note}
              isSelected={selectedNoteId === note.id}
              zoomLevel={zoomLevel}
              onSelect={() => setSelectedNoteId(note.id)}
              onUpdate={(updates) => {
                if (onStickyNotesChange) {
                  onStickyNotesChange(stickyNotes.map(n => n.id === note.id ? { ...n, ...updates } : n));
                }
              }}
              onDelete={() => {
                if (onStickyNotesChange) {
                  onStickyNotesChange(stickyNotes.filter(n => n.id !== note.id));
                }
              }}
            />
          ))}
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
            <ProWorkflowNode
              block={block}
              visualState={blockVisualStates[block.id]}
              zoomLevel={zoomLevel}
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
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-foreground font-medium mb-1">Canvas vide</p>
            <p className="text-muted-foreground text-sm max-w-[200px]">
              Ajoutez des blocs depuis la palette ou générez avec l'IA
            </p>
          </div>
        </div>
      )}

      {/* MiniMap */}
      {showMiniMap && blocks.length > 0 && (
        <ProMiniMap
          blocks={blocks}
          connections={connections}
          viewportRect={viewportRect}
          executionStatuses={executionStatuses}
          onViewportChange={handleViewportChange}
        />
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border/50 shadow-sm">
        {Math.round(zoom * 100)}%
        {zoomLevel !== 'normal' && (
          <span className="ml-2 text-muted-foreground/60">
            ({zoomLevel === 'micro' ? 'Vue d\'ensemble' : zoomLevel === 'mini' ? 'Compact' : 'Détaillé'})
          </span>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-24 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-muted-foreground/70 border border-border/30 hidden lg:flex items-center gap-2">
        <span>WASD/↑↓←→: Pan</span>
        <span>•</span>
        <span>Ctrl+Scroll: Zoom</span>
        <span>•</span>
        <span>F: Fit</span>
      </div>
    </div>
  );
}

export const ProCanvasV2 = memo(ProCanvasV2Component);
