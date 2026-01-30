// ==========================================
// Professional Workflow Node - N8N Style White Theme
// Semantic Zoom Support
// ==========================================

import { memo, useMemo } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS } from '@/types/workflow';
import { BlockVisualState } from '@/types/workflow-v2';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

interface ProWorkflowNodeProps {
  block: WorkflowBlock;
  visualState: BlockVisualState;
  zoomLevel: ZoomLevel;
  onSelect: (blockId: string | null) => void;
  onDoubleClick?: (blockId: string) => void;
  onDragStart?: (blockId: string, e: React.MouseEvent) => void;
  zoom: number;
}

// Category colors - muted for white theme
const categoryColors: Record<string, { bg: string; border: string; icon: string; accent: string }> = {
  trigger: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', accent: '#3b82f6' },
  ai: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', accent: '#8b5cf6' },
  transform: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', accent: '#f59e0b' },
  control: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-600', accent: '#64748b' },
  integration: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', accent: '#22c55e' },
  system: { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-600', accent: '#6b7280' },
  aether: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', accent: '#10b981' },
};

// Status indicators
const statusConfig: Record<string, { ring: string; pulse: boolean; glow: string }> = {
  idle: { ring: '', pulse: false, glow: '' },
  pending: { ring: 'ring-2 ring-yellow-400/50', pulse: true, glow: 'shadow-yellow-200' },
  running: { ring: 'ring-2 ring-blue-400', pulse: true, glow: 'shadow-blue-200 shadow-lg' },
  success: { ring: 'ring-2 ring-green-400', pulse: false, glow: 'shadow-green-200' },
  error: { ring: 'ring-2 ring-red-400', pulse: false, glow: 'shadow-red-200' },
  skipped: { ring: 'ring-1 ring-gray-300', pulse: false, glow: '' },
  cancelled: { ring: 'ring-1 ring-orange-300', pulse: false, glow: '' },
};

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;

function ProWorkflowNodeComponent({
  block,
  visualState,
  zoomLevel,
  onSelect,
  onDoubleClick,
  onDragStart,
  zoom,
}: ProWorkflowNodeProps) {
  const definition = BLOCK_DEFINITIONS[block.type];
  const colors = categoryColors[definition?.category || 'system'];
  const status = statusConfig[visualState.executionStatus] || statusConfig.idle;

  // Get icon component
  const IconComponent = useMemo(() => {
    const iconName = definition?.icon || 'Box';
    return (LucideIcons as any)[iconName] || LucideIcons.Box;
  }, [definition?.icon]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(block.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      onDragStart?.(block.id, e);
    }
  };

  // Semantic zoom rendering
  if (zoomLevel === 'micro') {
    // Micro view: just colored rectangle with icon
    return (
      <div
        className={cn(
          "absolute rounded-lg transition-all duration-150 cursor-pointer",
          colors.bg,
          colors.border,
          "border-2",
          visualState.isSelected && "ring-2 ring-primary ring-offset-1",
          visualState.isFiltered && "opacity-30"
        )}
        style={{
          left: block.position.x,
          top: block.position.y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          backgroundColor: colors.accent + '20',
          borderColor: colors.accent + '60',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-8 h-8" style={{ color: colors.accent }} />
        </div>
      </div>
    );
  }

  if (zoomLevel === 'mini') {
    // Mini view: icon + abbreviated name
    return (
      <div
        className={cn(
          "absolute rounded-xl bg-white transition-all duration-150 cursor-pointer shadow-sm",
          "border",
          visualState.isSelected && "ring-2 ring-primary ring-offset-2",
          visualState.isHovered && "shadow-md",
          visualState.isFiltered && "opacity-30",
          status.ring,
          status.pulse && "animate-pulse"
        )}
        style={{
          left: block.position.x,
          top: block.position.y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          borderColor: colors.accent + '40',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      >
        {/* Left accent bar */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
          style={{ backgroundColor: colors.accent }}
        />
        
        <div className="flex items-center gap-3 p-4 pl-5">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: colors.accent + '15' }}
          >
            <IconComponent className="w-5 h-5" style={{ color: colors.accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-foreground truncate">{block.name}</p>
          </div>
        </div>

        {/* Connection handles */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
      </div>
    );
  }

  // Normal & Detailed view
  return (
    <div
      className={cn(
        "absolute rounded-xl bg-white transition-all duration-200 cursor-pointer",
        "border shadow-sm",
        visualState.isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg",
        visualState.isHovered && !visualState.isSelected && "shadow-md border-gray-300",
        visualState.isDragging && "shadow-xl scale-[1.02] opacity-90",
        visualState.isFiltered && "opacity-30 pointer-events-none",
        status.ring,
        status.glow,
        status.pulse && "animate-pulse"
      )}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        borderColor: visualState.isSelected ? 'var(--primary)' : '#e5e7eb',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all"
        style={{ backgroundColor: colors.accent }}
      />
      
      {/* Content */}
      <div className="flex items-start gap-3 p-4 pl-5 h-full">
        {/* Icon container */}
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ backgroundColor: colors.accent + '12' }}
        >
          <IconComponent className="w-5 h-5" style={{ color: colors.accent }} />
        </div>
        
        {/* Text content */}
        <div className="min-w-0 flex-1 py-0.5">
          <p className="font-semibold text-sm text-foreground truncate leading-tight">{block.name}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {definition?.name || block.type}
          </p>
          
          {/* Status badge - only show if not idle */}
          {visualState.executionStatus !== 'idle' && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                visualState.executionStatus === 'running' && "bg-blue-100 text-blue-700",
                visualState.executionStatus === 'success' && "bg-green-100 text-green-700",
                visualState.executionStatus === 'error' && "bg-red-100 text-red-700",
                visualState.executionStatus === 'pending' && "bg-yellow-100 text-yellow-700",
              )}>
                {visualState.executionStatus === 'running' && (
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
                {visualState.executionStatus}
              </span>
            </div>
          )}
          
          {/* Detailed view: show config preview */}
          {zoomLevel === 'detailed' && block.description && (
            <p className="text-[10px] text-muted-foreground/70 mt-1 line-clamp-1">
              {block.description}
            </p>
          )}
        </div>
      </div>

      {/* Connection handles - left (input) */}
      <div 
        className={cn(
          "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full",
          "bg-white border-2 border-gray-300 transition-all",
          "hover:border-primary hover:scale-125 hover:shadow-md"
        )}
      />
      
      {/* Connection handles - right (output) */}
      <div 
        className={cn(
          "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full",
          "bg-white border-2 border-gray-300 transition-all",
          "hover:border-primary hover:scale-125 hover:shadow-md"
        )}
      />

      {/* Badges */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {definition?.isRealAction && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-500 text-white rounded shadow-sm">
            LIVE
          </span>
        )}
        {definition?.category === 'ai' && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-sm">
            AI
          </span>
        )}
      </div>

      {/* Item count badge (n8n style) */}
      {visualState.executionStatus === 'success' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-medium bg-gray-700 text-white rounded-full shadow-sm">
          1 item
        </div>
      )}
    </div>
  );
}

export const ProWorkflowNode = memo(ProWorkflowNodeComponent);
