// ==========================================
// Group Container Component - N8N Style
// Collapsible groups for organizing workflows
// ==========================================

import { memo, useState } from 'react';
import { WorkflowGroup } from '@/types/workflow-v2';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react';

type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

interface GroupContainerProps {
  group: WorkflowGroup;
  isSelected: boolean;
  zoomLevel: ZoomLevel;
  onSelect: () => void;
  onUpdate?: (updates: Partial<WorkflowGroup>) => void;
  onToggleCollapse?: () => void;
  onToggleLock?: () => void;
}

function GroupContainerComponent({
  group,
  isSelected,
  zoomLevel,
  onSelect,
  onUpdate,
  onToggleCollapse,
  onToggleLock,
}: GroupContainerProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Micro view: just outline
  if (zoomLevel === 'micro') {
    return (
      <rect
        x={group.position.x}
        y={group.position.y}
        width={group.size.width}
        height={group.isCollapsed ? 40 : group.size.height}
        rx={8}
        fill={group.color + '10'}
        stroke={group.color}
        strokeWidth={1}
        strokeDasharray="4 2"
        className="cursor-pointer"
        onClick={onSelect}
      />
    );
  }

  const headerHeight = 36;

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main container */}
      <rect
        x={group.position.x}
        y={group.position.y}
        width={group.size.width}
        height={group.isCollapsed ? headerHeight : group.size.height}
        rx={12}
        fill={group.color + '08'}
        stroke={isSelected ? group.color : group.color + '40'}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={group.isLocked ? 'none' : '8 4'}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected && "filter drop-shadow-sm"
        )}
        onClick={onSelect}
      />

      {/* Header bar */}
      <rect
        x={group.position.x}
        y={group.position.y}
        width={group.size.width}
        height={headerHeight}
        rx={12}
        ry={12}
        fill={group.color + '15'}
        className="cursor-move"
      />
      {/* Bottom corners of header should be square when not collapsed */}
      {!group.isCollapsed && (
        <rect
          x={group.position.x}
          y={group.position.y + headerHeight - 12}
          width={group.size.width}
          height={12}
          fill={group.color + '15'}
        />
      )}

      {/* Header content */}
      <foreignObject
        x={group.position.x}
        y={group.position.y}
        width={group.size.width}
        height={headerHeight}
      >
        <div className="flex items-center justify-between h-full px-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Collapse toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse?.();
              }}
              className="p-0.5 rounded hover:bg-black/10 transition-colors shrink-0"
              style={{ color: group.color }}
            >
              {group.isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>

            {/* Group name */}
            <span 
              className="text-sm font-medium truncate"
              style={{ color: group.color }}
            >
              {group.name}
            </span>

            {/* Block count badge */}
            {group.blockIds.length > 0 && (
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                style={{ 
                  backgroundColor: group.color + '20',
                  color: group.color 
                }}
              >
                {group.blockIds.length}
              </span>
            )}
          </div>

          {/* Lock toggle - show on hover */}
          {(isHovered || group.isLocked) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock?.();
              }}
              className="p-0.5 rounded hover:bg-black/10 transition-colors shrink-0"
              style={{ color: group.color }}
            >
              {group.isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </foreignObject>

      {/* Resize handles (only when selected and not collapsed) */}
      {isSelected && !group.isCollapsed && (
        <>
          {/* Corner resize handles */}
          <circle
            cx={group.position.x + group.size.width}
            cy={group.position.y + group.size.height}
            r={6}
            fill="white"
            stroke={group.color}
            strokeWidth={2}
            className="cursor-se-resize"
          />
        </>
      )}
    </g>
  );
}

export const GroupContainer = memo(GroupContainerComponent);
