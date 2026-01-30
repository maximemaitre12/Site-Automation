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
): { path: string; midpoint: { x: number; y: number }; direction: ConnectionDirection } {
  const direction = detectConnectionDirection(source, target);

  let sourceX: number, sourceY: number, targetX: number, targetY: number;
  let path: string;
  let midX: number, midY: number;

  if (direction === 'vertical') {
    // Vertical connection: bottom-center of source → top-center of target
    const isTargetBelow = target.y > source.y;
    
    sourceX = source.x + NODE_WIDTH / 2;
    sourceY = isTargetBelow ? source.y + NODE_HEIGHT : source.y;
    targetX = target.x + NODE_WIDTH / 2;
    targetY = isTargetBelow ? target.y : target.y + NODE_HEIGHT;

    const deltaX = Math.abs(targetX - sourceX);
    
    if (deltaX < 5) {
      // Straight vertical line
      path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
      midX = (sourceX + targetX) / 2;
      midY = (sourceY + targetY) / 2;
    } else {
      // Curved vertical connection with smooth S-curve
      const midPointY = (sourceY + targetY) / 2;
      path = `M ${sourceX} ${sourceY} C ${sourceX} ${midPointY}, ${targetX} ${midPointY}, ${targetX} ${targetY}`;
      midX = (sourceX + targetX) / 2;
      midY = midPointY;
    }
  } else {
    // Horizontal connection: right-center of source → left-center of target
    sourceX = source.x + NODE_WIDTH;
    sourceY = source.y + NODE_HEIGHT / 2;
    targetX = target.x;
    targetY = target.y + NODE_HEIGHT / 2;

    const deltaY = Math.abs(targetY - sourceY);

    if (deltaY < 5) {
      // Straight horizontal line
      path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
      midX = (sourceX + targetX) / 2;
      midY = (sourceY + targetY) / 2;
    } else {
      // Curved horizontal connection (Bézier)
      const deltaX = targetX - sourceX;
      const cpOffset = Math.max(60, Math.min(150, Math.abs(deltaX) * 0.35));

      const cp1x = sourceX + cpOffset;
      const cp1y = sourceY;
      const cp2x = targetX - cpOffset;
      const cp2y = targetY;

      path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
      
      // Calculate midpoint on Bézier
      const t = 0.5;
      midX = Math.pow(1-t,3)*sourceX + 3*Math.pow(1-t,2)*t*cp1x + 3*(1-t)*Math.pow(t,2)*cp2x + Math.pow(t,3)*targetX;
      midY = Math.pow(1-t,3)*sourceY + 3*Math.pow(1-t,2)*t*cp1y + 3*(1-t)*Math.pow(t,2)*cp2y + Math.pow(t,3)*targetY;
    }
  }

  return { path, midpoint: { x: midX, y: midY }, direction };
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
  const { path, midpoint, direction } = useMemo(() => {
    return calculatePath(sourcePosition, targetPosition);
  }, [sourcePosition, targetPosition]);

  const colors = statusColors[status] || statusColors.idle;
  const isActive = status !== 'idle' && status !== 'skipped';
  const shouldAnimate = status === 'running';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  // Calculate arrow position based on direction
  const arrowPosition = useMemo(() => {
    if (direction === 'vertical') {
      const isTargetBelow = targetPosition.y > sourcePosition.y;
      return {
        x: targetPosition.x + NODE_WIDTH / 2,
        y: isTargetBelow ? targetPosition.y : targetPosition.y + NODE_HEIGHT
      };
    } else {
      return {
        x: targetPosition.x,
        y: targetPosition.y + NODE_HEIGHT / 2
      };
    }
  }, [targetPosition, sourcePosition, direction]);

  // Stroke width based on zoom level

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
        cx={arrowPosition.x}
        cy={arrowPosition.y}
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
