// ==========================================
// Professional MiniMap - N8N Style
// With execution status colors
// ==========================================

import { memo, useMemo, useState } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, ExecutionStatus } from '@/types/workflow';
import { BoundingBox } from '@/types/workflow-v2';
import { calculateBoundingBox, DEFAULT_CANVAS_CONFIG } from '@/lib/workflow-layout';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProMiniMapProps {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  viewportRect: { x: number; y: number; width: number; height: number };
  executionStatuses?: Record<string, ExecutionStatus>;
  onViewportChange: (x: number, y: number) => void;
  className?: string;
}

const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 140;
const PADDING = 30;

// Status colors for minimap
const statusColors: Record<ExecutionStatus, string> = {
  idle: '#9ca3af',
  pending: '#fbbf24',
  running: '#3b82f6',
  success: '#22c55e',
  error: '#ef4444',
  skipped: '#d1d5db',
  cancelled: '#f97316',
};

// Category colors
const categoryColors: Record<string, string> = {
  trigger: '#3b82f6',
  ai: '#8b5cf6',
  transform: '#f59e0b',
  control: '#64748b',
  integration: '#22c55e',
  system: '#6b7280',
  aether: '#10b981',
};

function ProMiniMapComponent({
  blocks,
  connections,
  viewportRect,
  executionStatuses = {},
  onViewportChange,
  className,
}: ProMiniMapProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { positions, scale, offsetX, offsetY, bounds } = useMemo(() => {
    if (blocks.length === 0) {
      return {
        positions: {},
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        bounds: { minX: 0, minY: 0, maxX: 1000, maxY: 600, width: 1000, height: 600 } as BoundingBox,
      };
    }

    const posMap: Record<string, { x: number; y: number }> = {};
    blocks.forEach(b => {
      posMap[b.id] = b.position;
    });

    const bounds = calculateBoundingBox(
      posMap,
      DEFAULT_CANVAS_CONFIG.nodeWidth,
      DEFAULT_CANVAS_CONFIG.nodeHeight
    );

    // Add padding
    bounds.minX -= PADDING;
    bounds.minY -= PADDING;
    bounds.maxX += PADDING;
    bounds.maxY += PADDING;
    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;

    // Calculate scale to fit in minimap
    const scaleX = (MINIMAP_WIDTH - 24) / bounds.width;
    const scaleY = (MINIMAP_HEIGHT - 24) / bounds.height;
    const scale = Math.min(scaleX, scaleY, 0.12);

    return {
      positions: posMap,
      scale,
      offsetX: -bounds.minX * scale + 12,
      offsetY: -bounds.minY * scale + 12,
      bounds,
    };
  }, [blocks]);

  const viewportScaled = useMemo(() => {
    return {
      x: viewportRect.x * scale + offsetX,
      y: viewportRect.y * scale + offsetY,
      width: viewportRect.width * scale,
      height: viewportRect.height * scale,
    };
  }, [viewportRect, scale, offsetX, offsetY]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const canvasX = (x - offsetX) / scale - viewportRect.width / 2;
    const canvasY = (y - offsetY) / scale - viewportRect.height / 2;
    
    onViewportChange(canvasX, canvasY);
  };

  if (blocks.length === 0) return null;

  return (
    <div className={cn(
      "absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200",
      isCollapsed && "h-10",
      className
    )}>
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-xs font-medium text-gray-600">Overview</span>
        <button className="text-gray-400 hover:text-gray-600">
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <svg
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          className="cursor-crosshair"
          onClick={handleClick}
        >
          {/* Background */}
          <rect
            x={0}
            y={0}
            width={MINIMAP_WIDTH}
            height={MINIMAP_HEIGHT}
            fill="#fafbfc"
          />

          {/* Subtle grid */}
          <pattern
            id="minimap-grid-pro"
            width={12}
            height={12}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={6} cy={6} r={0.5} fill="#e5e7eb" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#minimap-grid-pro)" />

          {/* Connections */}
          {connections.map(conn => {
            const sourcePos = positions[conn.sourceBlockId];
            const targetPos = positions[conn.targetBlockId];
            if (!sourcePos || !targetPos) return null;

            const x1 = sourcePos.x * scale + offsetX + (DEFAULT_CANVAS_CONFIG.nodeWidth * scale);
            const y1 = sourcePos.y * scale + offsetY + (DEFAULT_CANVAS_CONFIG.nodeHeight * scale / 2);
            const x2 = targetPos.x * scale + offsetX;
            const y2 = targetPos.y * scale + offsetY + (DEFAULT_CANVAS_CONFIG.nodeHeight * scale / 2);

            return (
              <line
                key={conn.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#d1d5db"
                strokeWidth={1}
              />
            );
          })}

          {/* Blocks */}
          {blocks.map(block => {
            const pos = positions[block.id];
            if (!pos) return null;

            const definition = BLOCK_DEFINITIONS[block.type];
            const status = executionStatuses[block.id];
            const x = pos.x * scale + offsetX;
            const y = pos.y * scale + offsetY;
            const w = DEFAULT_CANVAS_CONFIG.nodeWidth * scale;
            const h = DEFAULT_CANVAS_CONFIG.nodeHeight * scale;

            // Use status color if active, otherwise category color
            const fill = status && status !== 'idle' 
              ? statusColors[status] 
              : categoryColors[definition?.category || 'system'];

            return (
              <g key={block.id}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={2}
                  fill={fill}
                  fillOpacity={status === 'running' ? 1 : 0.8}
                  className={cn(status === 'running' && "animate-pulse")}
                />
                {/* Left accent */}
                <rect
                  x={x}
                  y={y}
                  width={2}
                  height={h}
                  rx={1}
                  fill={fill}
                />
              </g>
            );
          })}

          {/* Viewport rectangle */}
          <rect
            x={Math.max(0, viewportScaled.x)}
            y={Math.max(0, viewportScaled.y)}
            width={Math.min(viewportScaled.width, MINIMAP_WIDTH - viewportScaled.x)}
            height={Math.min(viewportScaled.height, MINIMAP_HEIGHT - viewportScaled.y)}
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth={1.5}
            rx={3}
            className="pointer-events-none"
          />
        </svg>
      )}
    </div>
  );
}

export const ProMiniMap = memo(ProMiniMapComponent);
