import { memo, useMemo } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS, ExecutionStatus, BlockCategory } from '@/types/workflow';
import { BlockVisualState, DEFAULT_CANVAS_CONFIG } from '@/types/workflow-v2';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { CheckCircle2, XCircle, Loader2, Clock, SkipForward, AlertCircle, Zap } from 'lucide-react';

interface WorkflowNodeProps {
  block: WorkflowBlock;
  visualState: BlockVisualState;
  onSelect: (blockId: string) => void;
  onDoubleClick?: (blockId: string) => void;
  onDragStart?: (blockId: string, e: React.MouseEvent) => void;
  onDragEnd?: () => void;
  zoom?: number;
}

// Category border colors (left accent)
const categoryBorderColors: Record<BlockCategory, string> = {
  trigger: 'border-l-violet-500',
  ai: 'border-l-gradient-purple', // We'll use a solid fallback
  transform: 'border-l-cyan-500',
  control: 'border-l-amber-500',
  integration: 'border-l-emerald-500',
  system: 'border-l-slate-500',
  aether: 'border-l-emerald-500',
};

// Category background tints
const categoryBgTints: Record<BlockCategory, string> = {
  trigger: 'bg-violet-500/5',
  ai: 'bg-blue-500/5',
  transform: 'bg-cyan-500/5',
  control: 'bg-amber-500/5',
  integration: 'bg-emerald-500/5',
  system: 'bg-slate-500/5',
  aether: 'bg-emerald-500/5',
};

// Category icon bg
const categoryIconBg: Record<BlockCategory, string> = {
  trigger: 'bg-violet-500/20 text-violet-500',
  ai: 'bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-blue-500',
  transform: 'bg-cyan-500/20 text-cyan-500',
  control: 'bg-amber-500/20 text-amber-500',
  integration: 'bg-emerald-500/20 text-emerald-500',
  system: 'bg-slate-500/20 text-slate-500',
  aether: 'bg-emerald-500/20 text-emerald-500',
};

const statusConfig: Record<ExecutionStatus, { 
  borderClass: string; 
  icon: React.ReactNode; 
  animate?: boolean;
  bgClass?: string;
  label: string;
  dotColor: string;
}> = {
  idle: { 
    borderClass: '',
    icon: null,
    label: '',
    dotColor: '',
  },
  pending: { 
    borderClass: 'ring-2 ring-yellow-500/50',
    icon: <Clock className="w-3 h-3" />,
    bgClass: 'bg-yellow-500/5',
    label: 'En attente',
    dotColor: 'bg-yellow-500',
  },
  running: { 
    borderClass: 'ring-2 ring-blue-500 ring-offset-1 ring-offset-background',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    animate: true,
    bgClass: 'bg-blue-500/5',
    label: 'En cours...',
    dotColor: 'bg-blue-500 animate-pulse',
  },
  success: { 
    borderClass: 'ring-2 ring-green-500/50',
    icon: <CheckCircle2 className="w-3 h-3" />,
    bgClass: 'bg-green-500/5',
    label: 'Succès',
    dotColor: 'bg-green-500',
  },
  error: { 
    borderClass: 'ring-2 ring-red-500',
    icon: <XCircle className="w-3 h-3" />,
    bgClass: 'bg-red-500/5',
    label: 'Erreur',
    dotColor: 'bg-red-500 animate-pulse',
  },
  skipped: { 
    borderClass: 'opacity-50',
    icon: <SkipForward className="w-3 h-3" />,
    bgClass: 'bg-muted/30',
    label: 'Ignoré',
    dotColor: 'bg-muted-foreground',
  },
  cancelled: { 
    borderClass: 'ring-2 ring-orange-500/50',
    icon: <AlertCircle className="w-3 h-3" />,
    bgClass: 'bg-orange-500/5',
    label: 'Annulé',
    dotColor: 'bg-orange-500',
  },
};

function WorkflowNodeComponent({
  block,
  visualState,
  onSelect,
  onDoubleClick,
  onDragStart,
  zoom = 1,
}: WorkflowNodeProps) {
  const definition = BLOCK_DEFINITIONS[block.type];
  
  const Icon = useMemo(() => {
    if (!definition?.icon) return null;
    return (LucideIcons as any)[definition.icon] || LucideIcons.Box;
  }, [definition?.icon]);

  const statusInfo = statusConfig[visualState.executionStatus] || statusConfig.idle;
  const category = definition?.category || 'system';
  
  // Larger node size for professional look
  const nodeWidth = 240;
  const nodeHeight = 100;

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
        "absolute rounded-lg border bg-card shadow-md transition-all duration-150 cursor-pointer select-none group",
        // Left border accent (4px) based on category
        "border-l-4",
        categoryBorderColors[category],
        categoryBgTints[category],
        // Status effects
        statusInfo.borderClass,
        statusInfo.bgClass,
        statusInfo.animate && "shadow-lg shadow-blue-500/20",
        // Selection states
        visualState.isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg",
        visualState.isHovered && !visualState.isSelected && "shadow-lg border-muted-foreground/50",
        visualState.isDragging && "opacity-90 cursor-grabbing scale-[1.02] shadow-xl z-50",
        visualState.hasError && "ring-2 ring-red-500 bg-red-500/5"
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
      {/* Connection Handle - Left (Input) */}
      <div 
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background border-2 border-muted-foreground/40 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all cursor-crosshair z-10 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
      </div>
      
      {/* Connection Handle - Right (Output) */}
      <div 
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background border-2 border-muted-foreground/40 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all cursor-crosshair z-10 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
      </div>

      {/* Node Content */}
      <div className="p-3 h-full flex flex-col">
        {/* Header Row */}
        <div className="flex items-start gap-3 mb-2">
          {/* Icon Container */}
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            categoryIconBg[category]
          )}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          
          {/* Title & Type */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
              {block.name}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {definition?.name || block.type}
            </p>
          </div>

          {/* Status Icon (if running/error) */}
          {statusInfo.icon && (
            <div className={cn(
              "shrink-0 p-1 rounded",
              visualState.executionStatus === 'running' && "text-blue-500",
              visualState.executionStatus === 'success' && "text-green-500",
              visualState.executionStatus === 'error' && "text-red-500",
              visualState.executionStatus === 'pending' && "text-yellow-500"
            )}>
              {statusInfo.icon}
            </div>
          )}
        </div>

        {/* Footer Row */}
        <div className="mt-auto flex items-center justify-between text-[10px]">
          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            {statusInfo.dotColor && (
              <>
                <div className={cn("w-1.5 h-1.5 rounded-full", statusInfo.dotColor)} />
                <span className="text-muted-foreground">{statusInfo.label}</span>
              </>
            )}
            {!statusInfo.dotColor && (
              <span className="text-muted-foreground capitalize">{category}</span>
            )}
          </div>
          
          {/* Badges */}
          <div className="flex items-center gap-1">
            {/* Real Action Badge */}
            {definition?.isRealAction && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[9px] font-semibold uppercase tracking-wide flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" />
                Live
              </span>
            )}
            
            {/* AI Badge */}
            {category === 'ai' && (
              <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 text-[9px] font-semibold uppercase tracking-wide">
                AI
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selection glow effect */}
      {visualState.isSelected && (
        <div className="absolute inset-0 rounded-lg pointer-events-none bg-primary/5" />
      )}
      
      {/* Running animation overlay */}
      {visualState.executionStatus === 'running' && (
        <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer" />
        </div>
      )}
    </div>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
