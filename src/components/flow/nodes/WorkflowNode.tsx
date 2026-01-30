import { memo, useMemo } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS, ExecutionStatus } from '@/types/workflow';
import { BlockVisualState, DEFAULT_CANVAS_CONFIG } from '@/types/workflow-v2';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { CheckCircle2, XCircle, Loader2, Clock, SkipForward, AlertCircle } from 'lucide-react';

interface WorkflowNodeProps {
  block: WorkflowBlock;
  visualState: BlockVisualState;
  onSelect: (blockId: string) => void;
  onDoubleClick?: (blockId: string) => void;
  onDragStart?: (blockId: string, e: React.MouseEvent) => void;
  onDragEnd?: () => void;
  zoom?: number;
}

const statusConfig: Record<ExecutionStatus, { 
  borderClass: string; 
  icon: React.ReactNode; 
  animate?: boolean;
  bgClass?: string;
}> = {
  idle: { 
    borderClass: 'border-border',
    icon: null,
  },
  pending: { 
    borderClass: 'border-yellow-500/50',
    icon: <Clock className="w-3.5 h-3.5 text-yellow-500" />,
    bgClass: 'bg-yellow-500/5',
  },
  running: { 
    borderClass: 'border-blue-500',
    icon: <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />,
    animate: true,
    bgClass: 'bg-blue-500/5',
  },
  success: { 
    borderClass: 'border-green-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
    bgClass: 'bg-green-500/5',
  },
  error: { 
    borderClass: 'border-red-500',
    icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,
    bgClass: 'bg-red-500/5',
  },
  skipped: { 
    borderClass: 'border-muted-foreground/30 border-dashed',
    icon: <SkipForward className="w-3.5 h-3.5 text-muted-foreground" />,
    bgClass: 'bg-muted/30',
  },
  cancelled: { 
    borderClass: 'border-orange-500/50',
    icon: <AlertCircle className="w-3.5 h-3.5 text-orange-500" />,
    bgClass: 'bg-orange-500/5',
  },
};

function WorkflowNodeComponent({
  block,
  visualState,
  onSelect,
  onDoubleClick,
  onDragStart,
  onDragEnd,
  zoom = 1,
}: WorkflowNodeProps) {
  const definition = BLOCK_DEFINITIONS[block.type];
  
  const Icon = useMemo(() => {
    if (!definition?.icon) return null;
    return (LucideIcons as any)[definition.icon] || LucideIcons.Box;
  }, [definition?.icon]);

  const statusInfo = statusConfig[visualState.executionStatus] || statusConfig.idle;
  
  const nodeWidth = DEFAULT_CANVAS_CONFIG.nodeWidth;
  const nodeHeight = DEFAULT_CANVAS_CONFIG.nodeHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id);
    if (e.button === 0 && onDragStart) {
      onDragStart(block.id, e);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(block.id);
  };

  return (
    <div
      className={cn(
        "absolute rounded-xl border-2 bg-card shadow-lg transition-all duration-200 cursor-pointer select-none group",
        "hover:shadow-xl hover:scale-[1.02]",
        statusInfo.borderClass,
        statusInfo.bgClass,
        statusInfo.animate && "animate-pulse",
        visualState.isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        visualState.isHovered && !visualState.isSelected && "ring-1 ring-primary/50",
        visualState.isDragging && "opacity-80 cursor-grabbing scale-105 shadow-2xl z-50",
        visualState.hasError && "border-red-500 bg-red-500/5"
      )}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: nodeWidth,
        height: nodeHeight,
        transform: `scale(${1 / zoom})`,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Connection Handles - Left (Input) */}
      <div 
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10 transition-colors cursor-crosshair z-10"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Connection Handles - Right (Output) */}
      <div 
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10 transition-colors cursor-crosshair z-10"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Node Content */}
      <div className="p-3 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center gap-2">
          {/* Icon with gradient background */}
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            `bg-gradient-to-br ${definition?.color || 'from-gray-500 to-gray-400'}`
          )}>
            {Icon && <Icon className="w-4 h-4 text-white" />}
          </div>
          
          {/* Title */}
          <span className="text-sm font-medium text-foreground truncate flex-1">
            {block.name}
          </span>
          
          {/* Status Icon */}
          {statusInfo.icon && (
            <div className="shrink-0">
              {statusInfo.icon}
            </div>
          )}
        </div>

        {/* Footer - Status & Info */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="capitalize">
            {visualState.executionStatus !== 'idle' ? visualState.executionStatus : definition?.category || 'block'}
          </span>
          
          {/* Real Action Badge */}
          {definition?.isRealAction && (
            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 text-[9px] font-medium">
              REAL
            </span>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {visualState.isSelected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-primary/30" />
      )}
    </div>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
