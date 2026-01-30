// ==========================================
// Professional Workflow Node - N8N Style
// Square cards with icon + label below
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

// N8N style node dimensions
export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 100;
export const NODE_TOTAL_HEIGHT = 150; // Including label below

// Category colors
const categoryColors: Record<string, { accent: string }> = {
  trigger: { accent: '#3b82f6' },
  ai: { accent: '#8b5cf6' },
  transform: { accent: '#f59e0b' },
  control: { accent: '#64748b' },
  integration: { accent: '#22c55e' },
  system: { accent: '#6b7280' },
  aether: { accent: '#10b981' },
};

// Status indicators
const statusConfig: Record<string, { ring: string; pulse: boolean }> = {
  idle: { ring: '', pulse: false },
  pending: { ring: 'ring-2 ring-yellow-400', pulse: true },
  running: { ring: 'ring-2 ring-blue-400', pulse: true },
  success: { ring: 'ring-2 ring-green-400', pulse: false },
  error: { ring: 'ring-2 ring-red-400', pulse: false },
  skipped: { ring: 'ring-1 ring-gray-300', pulse: false },
  cancelled: { ring: 'ring-1 ring-orange-300', pulse: false },
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

  // Micro zoom - simple colored square
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
            "w-full rounded-2xl transition-all duration-150",
            visualState.isSelected && "ring-2 ring-primary",
            visualState.isFiltered && "opacity-30"
          )}
          style={{
            height: NODE_HEIGHT,
            backgroundColor: colors.accent + '20',
            border: `2px solid ${colors.accent}40`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent className="w-8 h-8" style={{ color: colors.accent }} />
          </div>
        </div>
      </div>
    );
  }

  // Normal N8N style - square card with icon, label below
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
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Main card */}
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl transition-all duration-200",
          "border border-gray-200 shadow-sm",
          visualState.isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg",
          visualState.isHovered && !visualState.isSelected && "shadow-md",
          visualState.isDragging && "shadow-xl scale-105 opacity-90",
          visualState.isFiltered && "opacity-30 pointer-events-none",
          status.ring,
          status.pulse && "animate-pulse"
        )}
        style={{ height: NODE_HEIGHT }}
      >
        {/* Centered icon */}
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent 
            className="w-10 h-10" 
            style={{ color: colors.accent }}
            strokeWidth={1.5}
          />
        </div>

        {/* Left connection handle (input) */}
        <div 
          className={cn(
            "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-3 h-3 rounded-full bg-white border-2 border-gray-300",
            "transition-all hover:border-primary hover:scale-125"
          )}
        />
        
        {/* Right connection handle (output) */}
        <div 
          className={cn(
            "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
            "w-3 h-3 rounded-full bg-white border-2 border-gray-300",
            "transition-all hover:border-primary hover:scale-125"
          )}
        />

        {/* Error/warning badge */}
        {visualState.executionStatus === 'error' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <LucideIcons.AlertTriangle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Label below card */}
      <div className="mt-2 text-center px-1">
        <p className="text-sm font-medium text-foreground truncate leading-tight">
          {block.name}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {definition?.name || block.type}
        </p>
      </div>
    </div>
  );
}

export const ProWorkflowNode = memo(ProWorkflowNodeComponent);
