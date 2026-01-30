// ==========================================
// Professional Edge Component - N8N Style
// Smart curved connections like the reference
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

// Subtle gray colors for n8n style
const statusColors: Record<ExecutionStatus, { stroke: string; glow: string }> = {
  idle: { stroke: '#b8bcc4', glow: '#b8bcc4' },
  pending: { stroke: '#f59e0b', glow: '#fbbf24' },
  running: { stroke: '#3b82f6', glow: '#60a5fa' },
  success: { stroke: '#22c55e', glow: '#4ade80' },
  error: { stroke: '#ef4444', glow: '#f87171' },
  skipped: { stroke: '#d1d5db', glow: '#e5e7eb' },
  cancelled: { stroke: '#f97316', glow: '#fb923c' },
};

function calculateSmartPath(
  source: { x: number; y: number },
  target: { x: number; y: number }
): { path: string; midpoint: { x: number; y: number } } {
  // Calculate center points
  const sourceCenterX = source.x + NODE_WIDTH / 2;
  const sourceCenterY = source.y + NODE_HEIGHT / 2;
  const targetCenterX = target.x + NODE_WIDTH / 2;
  const targetCenterY = target.y + NODE_HEIGHT / 2;

  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;

  let startX: number, startY: number, endX: number, endY: number;
  let path: string;

  // Determine if we should use horizontal or vertical routing
  const isMainlyHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 0.5;
  const isMainlyVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.5;
  const targetIsRight = deltaX > 0;
  const targetIsBelow = deltaY > 0;

  if (isMainlyVertical) {
    // Vertical connection: bottom of source -> top of target
    startX = source.x + NODE_WIDTH / 2;
    startY = targetIsBelow ? source.y + NODE_HEIGHT : source.y;
    endX = target.x + NODE_WIDTH / 2;
    endY = targetIsBelow ? target.y : target.y + NODE_HEIGHT;

    const vertDist = Math.abs(endY - startY);
    const horizDist = Math.abs(endX - startX);

    if (horizDist < 5) {
      // Straight vertical line
      path = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // S-curve for vertical with horizontal offset
      const midY = (startY + endY) / 2;
      path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
    }
  } else {
    // Horizontal connection: right of source -> left of target
    startX = source.x + NODE_WIDTH;
    startY = source.y + NODE_HEIGHT / 2;
    endX = target.x;
    endY = target.y + NODE_HEIGHT / 2;

    // Handle backwards connections
    if (!targetIsRight) {
      startX = source.x;
      endX = target.x + NODE_WIDTH;
    }

    const horizDist = Math.abs(endX - startX);
    const vertDist = Math.abs(endY - startY);

    if (vertDist < 5) {
      // Straight horizontal line
      path = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // Smooth bezier curve - n8n style
      const curvature = Math.min(horizDist * 0.5, 80);
      const cp1x = startX + (targetIsRight ? curvature : -curvature);
      const cp2x = endX + (targetIsRight ? -curvature : curvature);
      path = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
    }
  }

  return {
    path,
    midpoint: {
      x: (source.x + NODE_WIDTH / 2 + target.x + NODE_WIDTH / 2) / 2,
      y: (source.y + NODE_HEIGHT / 2 + target.y + NODE_HEIGHT / 2) / 2,
    },
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
  const { path, midpoint } = useMemo(() => {
    return calculateSmartPath(sourcePosition, targetPosition);
  }, [sourcePosition, targetPosition]);

  const colors = statusColors[status] || statusColors.idle;
  const shouldAnimate = status === 'running';
  const strokeColor = isHovered ? '#3b82f6' : colors.stroke;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  return (
    <g 
      className={cn(
        "workflow-edge transition-opacity duration-200",
        isFiltered && "opacity-20"
      )}
      onMouseEnter={() => onHover?.(connection.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Invisible hit area */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="cursor-pointer"
        onClick={handleClick}
      />

      {/* Main edge line - n8n style thin gray */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        className="transition-colors duration-150"
      />

      {/* Animated particle for running state */}
      {shouldAnimate && (
        <circle r="3" fill={colors.glow}>
          <animateMotion
            dur="0.8s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      )}

      {/* Delete button on hover */}
      {isHovered && onClick && (
        <g 
          transform={`translate(${midpoint.x}, ${midpoint.y})`}
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
