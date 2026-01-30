// ==========================================
// Professional Workflow Node - N8N Style
// Exact replica of n8n design
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

// N8N exact dimensions
export const NODE_WIDTH = 80;
export const NODE_HEIGHT = 80;
export const NODE_TOTAL_HEIGHT = 120; // Card + label space

// Category colors matching n8n style
const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  trigger: { bg: '#f0f9ff', icon: '#0ea5e9', border: '#bae6fd' },
  ai: { bg: '#faf5ff', icon: '#a855f7', border: '#e9d5ff' },
  transform: { bg: '#fffbeb', icon: '#f59e0b', border: '#fde68a' },
  control: { bg: '#f0fdf4', icon: '#22c55e', border: '#bbf7d0' },
  integration: { bg: '#fef2f2', icon: '#ef4444', border: '#fecaca' },
  system: { bg: '#f8fafc', icon: '#64748b', border: '#e2e8f0' },
  aether: { bg: '#ecfdf5', icon: '#10b981', border: '#a7f3d0' },
};

// Status ring colors
const statusConfig: Record<string, { ring: string; animate: boolean }> = {
  idle: { ring: '', animate: false },
  pending: { ring: 'ring-2 ring-amber-400', animate: true },
  running: { ring: 'ring-2 ring-blue-500', animate: true },
  success: { ring: 'ring-2 ring-emerald-500', animate: false },
  error: { ring: 'ring-2 ring-red-500', animate: false },
  skipped: { ring: 'ring-1 ring-gray-300', animate: false },
  cancelled: { ring: 'ring-1 ring-orange-400', animate: false },
};

function ProWorkflowNodeComponent({
  block,
  visualState,
  zoomLevel,
  onSelect,
  onDoubleClick,
  onDragStart,
}: ProWorkflowNodeProps) {
  const definition = BLOCK_DEFINITIONS[block.type];
  const colors = categoryColors[definition?.category || 'system'];
  const status = statusConfig[visualState.executionStatus] || statusConfig.idle;

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

  // Micro zoom - simple dot
  if (zoomLevel === 'micro') {
    return (
      <div
        className="absolute cursor-pointer"
        style={{
          left: block.position.x,
          top: block.position.y,
          width: NODE_WIDTH,
          height: NODE_TOTAL_HEIGHT,
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <div
          className={cn(
            "w-full h-[80px] rounded-xl",
            visualState.isSelected && "ring-2 ring-blue-500",
            visualState.isFiltered && "opacity-30"
          )}
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent className="w-6 h-6" style={{ color: colors.icon }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: block.position.x,
        top: block.position.y,
        width: NODE_WIDTH,
        height: NODE_TOTAL_HEIGHT,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Main card - exact n8n style */}
      <div
        className={cn(
          "relative w-full h-[80px] bg-white rounded-xl transition-all duration-150",
          "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]",
          "border border-gray-200/80",
          visualState.isSelected && "ring-2 ring-blue-500 ring-offset-2 shadow-lg",
          visualState.isHovered && !visualState.isSelected && "shadow-md border-gray-300",
          visualState.isDragging && "shadow-xl scale-105 opacity-90",
          visualState.isFiltered && "opacity-30 pointer-events-none",
          status.ring,
          status.animate && "animate-pulse"
        )}
      >
        {/* Centered icon */}
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent 
            className="w-8 h-8" 
            style={{ color: colors.icon }}
            strokeWidth={1.5}
          />
        </div>

        {/* Input handle - left center */}
        <div 
          className={cn(
            "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-2.5 h-2.5 rounded-full bg-white border-[1.5px] border-gray-300",
            "transition-all group-hover:border-gray-400 group-hover:scale-110"
          )}
        />
        
        {/* Output handle - right center */}
        <div 
          className={cn(
            "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
            "w-2.5 h-2.5 rounded-full bg-white border-[1.5px] border-gray-300",
            "transition-all group-hover:border-gray-400 group-hover:scale-110"
          )}
        />

        {/* Error indicator */}
        {visualState.executionStatus === 'error' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
            <LucideIcons.AlertTriangle className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Label below - n8n style */}
      <div className="mt-2 text-center">
        <p className="text-[11px] font-medium text-gray-700 truncate leading-tight px-1">
          {block.name}
        </p>
        {zoomLevel !== 'mini' && (
          <p className="text-[9px] text-gray-400 truncate mt-0.5">
            {definition?.name || block.type}
          </p>
        )}
      </div>
    </div>
  );
}

export const ProWorkflowNode = memo(ProWorkflowNodeComponent);
