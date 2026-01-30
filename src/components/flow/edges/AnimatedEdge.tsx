import { memo, useMemo } from 'react';
import { BlockConnection, ExecutionStatus } from '@/types/workflow';
import { calculateConnectionPath, DEFAULT_CANVAS_CONFIG } from '@/lib/workflow-layout';
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

const statusColors: Record<ExecutionStatus, string> = {
  idle: 'stroke-muted-foreground/40',
  pending: 'stroke-yellow-500',
  running: 'stroke-blue-500',
  success: 'stroke-green-500',
  error: 'stroke-red-500',
  skipped: 'stroke-muted-foreground/30',
  cancelled: 'stroke-orange-500',
};

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
    return calculateConnectionPath(
      sourcePosition,
      targetPosition,
      DEFAULT_CANVAS_CONFIG.nodeWidth,
      DEFAULT_CANVAS_CONFIG.nodeHeight,
      'horizontal'
    );
  }, [sourcePosition, targetPosition]);

  const strokeColor = statusColors[status] || statusColors.idle;
  const shouldAnimate = animated || status === 'running';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(connection.id);
  };

  return (
    <g className="workflow-edge group">
      {/* Invisible wider path for easier selection */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Background path (shadow effect) */}
      <path
        d={path}
        fill="none"
        strokeWidth={4}
        className={cn(
          "transition-all duration-200",
          isSelected ? "stroke-primary/30" : "stroke-transparent",
          isHovered && !isSelected && "stroke-muted-foreground/20"
        )}
      />

      {/* Main path */}
      <path
        d={path}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        className={cn(
          "transition-all duration-200",
          strokeColor,
          isSelected && "stroke-primary !stroke-[3px]",
          isHovered && !isSelected && "stroke-muted-foreground",
          "group-hover:stroke-muted-foreground/70"
        )}
      />

      {/* Animated flow indicator */}
      {shouldAnimate && (
        <circle r="4" fill="currentColor" className="text-blue-500">
          <animateMotion
            dur="1s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      )}

      {/* Success particle animation */}
      {status === 'success' && (
        <>
          <circle r="3" fill="currentColor" className="text-green-500">
            <animateMotion
              dur="0.5s"
              repeatCount="1"
              fill="freeze"
              path={path}
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="0.5s"
              fill="freeze"
            />
          </circle>
        </>
      )}

      {/* Error pulse animation */}
      {status === 'error' && (
        <path
          d={path}
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-red-500 animate-pulse"
          strokeOpacity={0.5}
        />
      )}

      {/* Arrow at end */}
      <ArrowMarker 
        path={path} 
        status={status}
        isSelected={isSelected}
      />
    </g>
  );
}

interface ArrowMarkerProps {
  path: string;
  status: ExecutionStatus;
  isSelected: boolean;
}

function ArrowMarker({ path, status, isSelected }: ArrowMarkerProps) {
  // Extract end point and direction from path
  const pathData = path.split(' ');
  const endX = parseFloat(pathData[pathData.length - 2]);
  const endY = parseFloat(pathData[pathData.length - 1]);
  
  // Get control point for direction
  const cp2x = parseFloat(pathData[pathData.length - 4].replace(',', ''));
  const cp2y = parseFloat(pathData[pathData.length - 3].replace(',', ''));
  
  // Calculate angle
  const angle = Math.atan2(endY - cp2y, endX - cp2x) * (180 / Math.PI);

  const fillColor = isSelected 
    ? 'fill-primary' 
    : status === 'running' ? 'fill-blue-500'
    : status === 'success' ? 'fill-green-500'
    : status === 'error' ? 'fill-red-500'
    : 'fill-muted-foreground/40';

  return (
    <polygon
      points="-6,-4 0,0 -6,4"
      className={cn("transition-all duration-200", fillColor)}
      transform={`translate(${endX}, ${endY}) rotate(${angle})`}
    />
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
