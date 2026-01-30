// ==========================================
// Professional Edge Component - N8N Style
// Horizontal connections with arrow markers
// ==========================================

import { memo, useMemo } from 'react';
import { BlockConnection, ExecutionStatus } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { NODE_WIDTH, NODE_HEIGHT } from '../nodes/ProWorkflowNode';

type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

interface ProEdgeProps {
  connection: BlockConnection;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  status?: ExecutionStatus;
  isHovered?: boolean;
  isFiltered?: boolean;
  zoomLevel: ZoomLevel;
  onHover?: (connectionId: string | null) => void;
  onClick?: (connectionId: string) => void;
  label?: string;
}

// Status colors - softer for white theme
const statusColors: Record<ExecutionStatus, { stroke: string; fill: string }> = {
  idle: { stroke: '#9ca3af', fill: '#9ca3af' },
  pending: { stroke: '#f59e0b', fill: '#fbbf24' },
  running: { stroke: '#3b82f6', fill: '#60a5fa' },
  success: { stroke: '#22c55e', fill: '#4ade80' },
  error: { stroke: '#ef4444', fill: '#f87171' },
  skipped: { stroke: '#d1d5db', fill: '#e5e7eb' },
  cancelled: { stroke: '#f97316', fill: '#fb923c' },
};

type ConnectionDirection = 'horizontal' | 'vertical' | 'mixed';

function detectConnectionDirection(
  source: { x: number; y: number },
  target: { x: number; y: number }
): ConnectionDirection {
  const sourceCenterX = source.x + NODE_WIDTH / 2;
  const sourceCenterY = source.y + NODE_HEIGHT / 2;
  const targetCenterX = target.x + NODE_WIDTH / 2;
  const targetCenterY = target.y + NODE_HEIGHT / 2;

  const deltaX = Math.abs(targetCenterX - sourceCenterX);
  const deltaY = Math.abs(targetCenterY - sourceCenterY);

  // If target is mostly below/above and horizontally aligned → vertical
  if (deltaX < NODE_WIDTH * 0.6 && deltaY > NODE_HEIGHT * 0.5) {
    return 'vertical';
  }
  // If target is mostly to the right/left → horizontal
  if (deltaX > NODE_WIDTH * 0.3) {
    return 'horizontal';
  }
  return 'mixed';
}

function calculatePath(
  source: { x: number; y: number },
  target: { x: number; y: number }
): { path: string; midpoint: { x: number; y: number }; arrowPos: { x: number; y: number }; direction: ConnectionDirection } {
  const direction = detectConnectionDirection(source, target);

  // Horizontal layout: right-center of source → left-center of target
  const sourceX = source.x + NODE_WIDTH;
  const sourceY = source.y + NODE_HEIGHT / 2;
  const targetX = target.x;
  const targetY = target.y + NODE_HEIGHT / 2;

  const deltaY = Math.abs(targetY - sourceY);
  const deltaX = targetX - sourceX;
  
  let path: string;
  let midX: number, midY: number;

  if (deltaY < 5) {
    // Straight horizontal line
    path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    midX = (sourceX + targetX) / 2;
    midY = sourceY;
  } else {
    // Curved horizontal connection (smooth Bézier)
    const cpOffset = Math.max(40, Math.min(100, Math.abs(deltaX) * 0.4));

    const cp1x = sourceX + cpOffset;
    const cp1y = sourceY;
    const cp2x = targetX - cpOffset;
    const cp2y = targetY;

    path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
    
    midX = (sourceX + targetX) / 2;
    midY = (sourceY + targetY) / 2;
  }

  // Arrow position just before target
  const arrowX = targetX - 8;
  const arrowY = targetY;

  return { 
    path, 
    midpoint: { x: midX, y: midY }, 
    arrowPos: { x: arrowX, y: arrowY },
    direction 
  };
}

function ProEdgeComponent({
  connection,
  sourcePosition,
  targetPosition,
  status = 'idle',
  isHovered = false,
  isFiltered = false,
  zoomLevel,
  onHover,
  onClick,
}: ProEdgeProps) {
  const { path, midpoint, arrowPos } = useMemo(() => {
    return calculatePath(sourcePosition, targetPosition);
  }, [sourcePosition, targetPosition]);

  const colors = statusColors[status] || statusColors.idle;
  const shouldAnimate = status === 'running';
  const strokeWidth = 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  return (
    <g 
      className={cn(
        "workflow-edge group transition-opacity duration-200",
        isFiltered && "opacity-20"
      )}
      onMouseEnter={() => onHover?.(connection.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onClick={handleClick}
      />

      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={isHovered ? '#3b82f6' : colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="transition-all duration-200"
      />

      {/* Animated flow particles for running state */}
      {shouldAnimate && (
        <circle r="3" fill={colors.fill}>
          <animateMotion
            dur="0.8s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      )}

      {/* Source handle circle */}
      <circle
        cx={sourcePosition.x + NODE_WIDTH}
        cy={sourcePosition.y + NODE_HEIGHT / 2}
        r={5}
        fill="white"
        stroke={isHovered ? '#3b82f6' : '#d1d5db'}
        strokeWidth={2}
      />

      {/* Arrow marker before target */}
      <polygon
        points={`${arrowPos.x - 6},${arrowPos.y - 4} ${arrowPos.x},${arrowPos.y} ${arrowPos.x - 6},${arrowPos.y + 4}`}
        fill={isHovered ? '#3b82f6' : colors.stroke}
        className="transition-all duration-200"
      />

      {/* Target handle circle */}
      <circle
        cx={targetPosition.x}
        cy={targetPosition.y + NODE_HEIGHT / 2}
        r={5}
        fill="white"
        stroke={isHovered ? '#3b82f6' : '#d1d5db'}
        strokeWidth={2}
      />

      {/* Delete button on hover */}
      {isHovered && onClick && (
        <g 
          transform={`translate(${midpoint.x}, ${midpoint.y - 16})`}
          onClick={handleClick}
          className="cursor-pointer"
        >
          <circle r="8" fill="#ef4444" className="transition-transform hover:scale-110" />
          <path
            d="M -3 -3 L 3 3 M -3 3 L 3 -3"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

export const ProEdge = memo(ProEdgeComponent);
