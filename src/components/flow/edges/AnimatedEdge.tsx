import { memo, useMemo } from 'react';
import { BlockConnection, ExecutionStatus } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface AnimatedEdgeProps {
  connection: BlockConnection;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  status?: ExecutionStatus;
  isSelected?: boolean;
  isHovered?: boolean;
  animated?: boolean;
  onClick?: (connectionId: string) => void;
}

// Professional node dimensions
const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;

const statusColors: Record<ExecutionStatus, { stroke: string; glow: string }> = {
  idle: { stroke: '#6b7280', glow: 'none' },
  pending: { stroke: '#eab308', glow: 'drop-shadow(0 0 4px #eab30880)' },
  running: { stroke: '#3b82f6', glow: 'drop-shadow(0 0 8px #3b82f680)' },
  success: { stroke: '#22c55e', glow: 'drop-shadow(0 0 6px #22c55e80)' },
  error: { stroke: '#ef4444', glow: 'drop-shadow(0 0 6px #ef444480)' },
  skipped: { stroke: '#9ca3af', glow: 'none' },
  cancelled: { stroke: '#f97316', glow: 'drop-shadow(0 0 4px #f9731680)' },
};

function calculatePath(
  source: { x: number; y: number },
  target: { x: number; y: number }
): string {
  // Source exits from right side, target enters from left side
  const sourceX = source.x + NODE_WIDTH;
  const sourceY = source.y + NODE_HEIGHT / 2;
  const targetX = target.x;
  const targetY = target.y + NODE_HEIGHT / 2;

  // Calculate control point offset based on distance
  const deltaX = targetX - sourceX;
  const cpOffset = Math.max(80, Math.min(150, Math.abs(deltaX) * 0.4));

  // Bézier curve with pronounced curves
  const cp1x = sourceX + cpOffset;
  const cp1y = sourceY;
  const cp2x = targetX - cpOffset;
  const cp2y = targetY;

  return `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
}

function AnimatedEdgeComponent({
  connection,
  sourcePosition,
  targetPosition,
  status = 'idle',
  isSelected = false,
  isHovered = false,
  animated = false,
  onClick,
}: AnimatedEdgeProps) {
  const path = useMemo(() => {
    return calculatePath(sourcePosition, targetPosition);
  }, [sourcePosition, targetPosition]);

  const colorConfig = statusColors[status] || statusColors.idle;
  const shouldAnimate = animated || status === 'running';
  const isActive = status !== 'idle' && status !== 'skipped';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  // Calculate arrow position and angle
  const targetX = targetPosition.x;
  const targetY = targetPosition.y + NODE_HEIGHT / 2;
  const cp2x = targetX - 80;
  const cp2y = targetY;
  const angle = Math.atan2(targetY - cp2y, targetX - cp2x) * (180 / Math.PI);

  return (
    <g className="workflow-edge group" style={{ filter: isActive ? colorConfig.glow : 'none' }}>
      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        className="cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Shadow/glow layer for selected/hovered */}
      {(isSelected || isHovered) && (
        <path
          d={path}
          fill="none"
          stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.3}
        />
      )}

      {/* Main path - thicker stroke */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? 'hsl(var(--primary))' : colorConfig.stroke}
        strokeWidth={3}
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          status === 'idle' && "opacity-50 group-hover:opacity-80"
        )}
      />

      {/* Animated flow particles for running state */}
      {shouldAnimate && (
        <>
          <circle r="5" fill="#3b82f6">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={path}
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3" fill="#60a5fa">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={path}
              begin="0.3s"
            />
          </circle>
          <circle r="2" fill="#93c5fd">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={path}
              begin="0.6s"
            />
          </circle>
        </>
      )}

      {/* Success flash animation */}
      {status === 'success' && (
        <circle r="6" fill="#22c55e">
          <animateMotion
            dur="0.4s"
            repeatCount="1"
            fill="freeze"
            path={path}
          />
          <animate
            attributeName="r"
            from="6"
            to="2"
            dur="0.4s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur="0.4s"
            fill="freeze"
          />
        </circle>
      )}

      {/* Error pulse */}
      {status === 'error' && (
        <path
          d={path}
          fill="none"
          stroke="#ef4444"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.4}
          className="animate-pulse"
        />
      )}

      {/* Arrow at end - larger and more visible */}
      <polygon
        points="-8,-5 0,0 -8,5"
        fill={isSelected ? 'hsl(var(--primary))' : colorConfig.stroke}
        transform={`translate(${targetX}, ${targetY}) rotate(${angle})`}
        className="transition-all duration-300"
      />

      {/* Delete button on hover */}
      {isHovered && onClick && (
        <g 
          transform={`translate(${(sourcePosition.x + NODE_WIDTH + targetPosition.x) / 2}, ${(sourcePosition.y + targetPosition.y + NODE_HEIGHT) / 2})`}
          onClick={handleClick}
          className="cursor-pointer"
        >
          <circle r="10" fill="hsl(var(--destructive))" opacity="0.9" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
