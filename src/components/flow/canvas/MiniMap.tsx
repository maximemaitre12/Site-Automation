import { memo, useMemo } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { BoundingBox } from '@/types/workflow-v2';
import { calculateBoundingBox, DEFAULT_CANVAS_CONFIG } from '@/lib/workflow-layout';
import { cn } from '@/lib/utils';

interface MiniMapProps {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  viewportRect: { x: number; y: number; width: number; height: number };
  canvasSize: { width: number; height: number };
  onViewportChange: (x: number, y: number) => void;
  className?: string;
}

const MINIMAP_WIDTH = 180;
const MINIMAP_HEIGHT = 120;
const PADDING = 20;

function MiniMapComponent({
  blocks,
  connections,
  viewportRect,
  canvasSize,
  onViewportChange,
  className,
}: MiniMapProps) {
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
    const scaleX = (MINIMAP_WIDTH - 20) / bounds.width;
    const scaleY = (MINIMAP_HEIGHT - 20) / bounds.height;
    const scale = Math.min(scaleX, scaleY, 0.15);

    return {
      positions: posMap,
      scale,
      offsetX: -bounds.minX * scale + 10,
      offsetY: -bounds.minY * scale + 10,
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
    
    // Convert minimap coordinates to canvas coordinates
    const canvasX = (x - offsetX) / scale - viewportRect.width / 2;
    const canvasY = (y - offsetY) / scale - viewportRect.height / 2;
    
    onViewportChange(canvasX, canvasY);
  };

  if (blocks.length === 0) return null;

  return (
    <div className={cn(
      "absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden",
      className
    )}>
      <svg
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          fill="transparent"
        />

        {/* Grid dots */}
        <pattern
          id="minimap-grid"
          width={10}
          height={10}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={5} cy={5} r={0.5} fill="currentColor" className="text-muted-foreground/20" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#minimap-grid)" />

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
              stroke="currentColor"
              strokeWidth={1}
              className="text-muted-foreground/30"
            />
          );
        })}

        {/* Blocks */}
        {blocks.map(block => {
          const pos = positions[block.id];
          if (!pos) return null;

          const definition = BLOCK_DEFINITIONS[block.type];
          const x = pos.x * scale + offsetX;
          const y = pos.y * scale + offsetY;
          const w = DEFAULT_CANVAS_CONFIG.nodeWidth * scale;
          const h = DEFAULT_CANVAS_CONFIG.nodeHeight * scale;

          // Get color from definition
          const colorClass = definition?.color || 'from-gray-500 to-gray-400';
          const isGreen = colorClass.includes('green') || colorClass.includes('emerald');
          const isBlue = colorClass.includes('blue') || colorClass.includes('cyan') || colorClass.includes('sky');
          const isPurple = colorClass.includes('purple') || colorClass.includes('violet') || colorClass.includes('indigo');
          const isRed = colorClass.includes('red') || colorClass.includes('pink');
          const isOrange = colorClass.includes('orange') || colorClass.includes('amber');
          
          let fill = '#6b7280'; // gray default
          if (isGreen) fill = '#22c55e';
          else if (isBlue) fill = '#3b82f6';
          else if (isPurple) fill = '#8b5cf6';
          else if (isRed) fill = '#ef4444';
          else if (isOrange) fill = '#f97316';

          return (
            <rect
              key={block.id}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={2}
              fill={fill}
              fillOpacity={0.8}
            />
          );
        })}

        {/* Viewport rectangle */}
        <rect
          x={Math.max(0, viewportScaled.x)}
          y={Math.max(0, viewportScaled.y)}
          width={Math.min(viewportScaled.width, MINIMAP_WIDTH - viewportScaled.x)}
          height={Math.min(viewportScaled.height, MINIMAP_HEIGHT - viewportScaled.y)}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-primary"
          rx={2}
        />
      </svg>
    </div>
  );
}

export const MiniMap = memo(MiniMapComponent);
