// ==========================================
// Professional Edge Component - N8N Style
// Clean curves with labels and semantic zoom
// ==========================================

import { memo, useMemo } from 'react';
import { BlockConnection, ExecutionStatus } from '@/types/workflow';
import { cn } from '@/lib/utils';

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

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;

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

function calculatePath(
  source: { x: number; y: number },
  target: { x: number; y: number }
): { path: string; midpoint: { x: number; y: number } } {
  const sourceX = source.x + NODE_WIDTH;
  const sourceY = source.y + NODE_HEIGHT / 2;
  const targetX = target.x;
  const targetY = target.y + NODE_HEIGHT / 2;

  const deltaX = targetX - sourceX;
  const deltaY = Math.abs(targetY - sourceY);
  
  // Adjust control point offset based on distance
  const cpOffset = Math.max(60, Math.min(150, Math.abs(deltaX) * 0.35));

  const cp1x = sourceX + cpOffset;
  const cp1y = sourceY;
  const cp2x = targetX - cpOffset;
  const cp2y = targetY;

  // Calculate midpoint on the Bézier curve
  const t = 0.5;
  const midX = Math.pow(1-t,3)*sourceX + 3*Math.pow(1-t,2)*t*cp1x + 3*(1-t)*Math.pow(t,2)*cp2x + Math.pow(t,3)*targetX;
  const midY = Math.pow(1-t,3)*sourceY + 3*Math.pow(1-t,2)*t*cp1y + 3*(1-t)*Math.pow(t,2)*cp2y + Math.pow(t,3)*targetY;

  return {
    path: `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`,
    midpoint: { x: midX, y: midY },
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
  label,
}: ProEdgeProps) {
  const { path, midpoint } = useMemo(() => {
    return calculatePath(sourcePosition, targetPosition);
  }, [sourcePosition, targetPosition]);

  const colors = statusColors[status] || statusColors.idle;
  const isActive = status !== 'idle' && status !== 'skipped';
  const shouldAnimate = status === 'running';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  // Arrow position
  const targetX = targetPosition.x;
  const targetY = targetPosition.y + NODE_HEIGHT / 2;

  // Stroke width based on zoom level
  const strokeWidth = zoomLevel === 'micro' ? 1.5 : zoomLevel === 'mini' ? 2 : 2.5;

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

      {/* Shadow/glow layer for hover/active */}
      {(isHovered || isActive) && (
        <path
          d={path}
          fill="none"
          stroke={isHovered ? '#3b82f6' : colors.stroke}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          opacity={0.15}
          className="transition-opacity duration-200"
        />
      )}

      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={isHovered ? '#3b82f6' : colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(
          "transition-all duration-200",
          status === 'idle' && "opacity-60 group-hover:opacity-100"
        )}
      />

      {/* Animated flow particles for running state */}
      {shouldAnimate && (
        <>
          <circle r="4" fill={colors.fill}>
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              path={path}
            />
            <animate
              attributeName="opacity"
              values="1;0.6;1"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill={colors.fill} opacity="0.8">
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              path={path}
              begin="0.25s"
            />
          </circle>
          <circle r="1.5" fill={colors.fill} opacity="0.6">
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              path={path}
              begin="0.5s"
            />
          </circle>
        </>
      )}

      {/* Success checkmark animation */}
      {status === 'success' && (
        <circle r="5" fill={colors.fill} opacity="0">
          <animateMotion
            dur="0.4s"
            repeatCount="1"
            fill="freeze"
            path={path}
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur="0.4s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            from="5"
            to="8"
            dur="0.4s"
            fill="freeze"
          />
        </circle>
      )}

      {/* Arrow at end - subtle and clean */}
      <circle
        cx={targetX}
        cy={targetY}
        r={4}
        fill="white"
        stroke={isHovered ? '#3b82f6' : colors.stroke}
        strokeWidth={2}
        className="transition-all duration-200"
      />

      {/* Label at midpoint (only show in detailed zoom or when hovered) */}
      {(label && (zoomLevel === 'detailed' || isHovered)) && (
        <g transform={`translate(${midpoint.x}, ${midpoint.y - 12})`}>
          <rect
            x={-label.length * 3.5 - 6}
            y={-8}
            width={label.length * 7 + 12}
            height={16}
            rx={4}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={500}
            fill="#6b7280"
          >
            {label}
          </text>
        </g>
      )}

      {/* Item count badge at midpoint (n8n style) */}
      {status === 'success' && zoomLevel !== 'micro' && (
        <g transform={`translate(${midpoint.x}, ${midpoint.y})`}>
          <rect
            x={-16}
            y={-9}
            width={32}
            height={18}
            rx={9}
            fill="#f3f4f6"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={500}
            fill="#6b7280"
          >
            1 item
          </text>
        </g>
      )}

      {/* Delete button on hover */}
      {isHovered && onClick && (
        <g 
          transform={`translate(${midpoint.x + 20}, ${midpoint.y - 20})`}
          onClick={handleClick}
          className="cursor-pointer"
        >
          <circle r="10" fill="#ef4444" className="transition-transform hover:scale-110" />
          <path
            d="M -4 -4 L 4 4 M -4 4 L 4 -4"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

export const ProEdge = memo(ProEdgeComponent);
