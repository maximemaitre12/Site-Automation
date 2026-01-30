// ==========================================
// Professional Canvas Toolbar - N8N Style
// Clean white theme with all controls
// ==========================================

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  LayoutGrid,
  Grid3X3,
  Map,
  Magnet,
  Undo2,
  Redo2,
  Save,
  Play,
  Plus,
  StickyNote,
  Group,
  Search,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

interface ProCanvasToolbarProps {
  zoom: number;
  zoomLevel: ZoomLevel;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitView: () => void;
  onAutoLayout: () => void;
  onToggleGrid: () => void;
  onToggleMiniMap: () => void;
  onToggleSnapToGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onRun: () => void;
  onAddBlock?: () => void;
  onAddStickyNote?: () => void;
  onAddGroup?: () => void;
  showGrid: boolean;
  showMiniMap: boolean;
  snapToGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasUnsavedChanges: boolean;
  isRunning: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  blockCount: number;
}

function ProCanvasToolbarComponent({
  zoom,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitView,
  onAutoLayout,
  onToggleGrid,
  onToggleMiniMap,
  onToggleSnapToGrid,
  onUndo,
  onRedo,
  onSave,
  onRun,
  onAddBlock,
  onAddStickyNote,
  onAddGroup,
  showGrid,
  showMiniMap,
  snapToGrid,
  canUndo,
  canRedo,
  hasSelection,
  hasUnsavedChanges,
  isRunning,
  searchQuery,
  onSearchChange,
  blockCount,
}: ProCanvasToolbarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-4">
      {/* Left: Add controls */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
        {onAddBlock && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddBlock}
                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Block</TooltipContent>
          </Tooltip>
        )}
        
        {onAddStickyNote && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddStickyNote}
                className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
              >
                <StickyNote className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Note</TooltipContent>
          </Tooltip>
        )}
        
        {onAddGroup && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddGroup}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Group className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Group</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${blockCount} blocks...`}
            className="pl-9 pr-8 h-9 bg-white border-gray-200 shadow-sm rounded-xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: View & Action controls */}
      <div className="flex items-center gap-2">
        {/* View controls */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out (-)</TooltipContent>
          </Tooltip>

          <button
            onClick={onZoomReset}
            className="px-2 h-8 text-xs font-medium text-gray-600 hover:text-gray-900 min-w-[48px]"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In (+)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFitView}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit View (F)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAutoLayout}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Auto Layout</TooltipContent>
          </Tooltip>
        </div>

        {/* Toggle controls */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? 'secondary' : 'ghost'}
                size="sm"
                onClick={onToggleGrid}
                className={cn("h-8 w-8 p-0", showGrid && "bg-gray-100")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showMiniMap ? 'secondary' : 'ghost'}
                size="sm"
                onClick={onToggleMiniMap}
                className={cn("h-8 w-8 p-0", showMiniMap && "bg-gray-100")}
              >
                <Map className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle MiniMap</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={snapToGrid ? 'secondary' : 'ghost'}
                size="sm"
                onClick={onToggleSnapToGrid}
                className={cn("h-8 w-8 p-0", snapToGrid && "bg-gray-100")}
              >
                <Magnet className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>
        </div>

        {/* History controls */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className={cn(
                  "h-8 px-3 gap-1.5",
                  hasUnsavedChanges && "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                )}
              >
                <Save className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="h-8 px-3 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className={cn("w-4 h-4", isRunning && "animate-pulse")} />
            <span className="text-xs font-medium hidden sm:inline">
              {isRunning ? 'Running...' : 'Run'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ProCanvasToolbar = memo(ProCanvasToolbarComponent);
