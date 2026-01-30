import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  LayoutGrid, 
  Lock, 
  Unlock,
  Grid3X3,
  Map,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Save,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CanvasToolbarProps {
  zoom: number;
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
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onSave: () => void;
  onRun: () => void;
  showGrid: boolean;
  showMiniMap: boolean;
  snapToGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasUnsavedChanges: boolean;
  isRunning?: boolean;
}

function CanvasToolbarComponent({
  zoom,
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
  onDeleteSelected,
  onDuplicateSelected,
  onSave,
  onRun,
  showGrid,
  showMiniMap,
  snapToGrid,
  canUndo,
  canRedo,
  hasSelection,
  hasUnsavedChanges,
  isRunning = false,
}: CanvasToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1.5 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg">
      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Undo2 className="w-4 h-4" />}
          tooltip="Annuler (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={<Redo2 className="w-4 h-4" />}
          tooltip="Rétablir (Ctrl+Y)"
          onClick={onRedo}
          disabled={!canRedo}
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<ZoomOut className="w-4 h-4" />}
          tooltip="Zoom arrière"
          onClick={onZoomOut}
          disabled={zoom <= 0.25}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 min-w-[52px] text-xs font-medium"
          onClick={onZoomReset}
        >
          {zoomPercent}%
        </Button>
        <ToolbarButton
          icon={<ZoomIn className="w-4 h-4" />}
          tooltip="Zoom avant"
          onClick={onZoomIn}
          disabled={zoom >= 2}
        />
        <ToolbarButton
          icon={<Maximize2 className="w-4 h-4" />}
          tooltip="Ajuster à la vue"
          onClick={onFitView}
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Layout & View */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<LayoutGrid className="w-4 h-4" />}
          tooltip="Auto-arrangement horizontal"
          onClick={onAutoLayout}
        />
        <ToolbarButton
          icon={<Grid3X3 className="w-4 h-4" />}
          tooltip="Afficher grille"
          onClick={onToggleGrid}
          active={showGrid}
        />
        <ToolbarButton
          icon={snapToGrid ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          tooltip="Snap to grid"
          onClick={onToggleSnapToGrid}
          active={snapToGrid}
        />
        <ToolbarButton
          icon={<Map className="w-4 h-4" />}
          tooltip="Mini-map"
          onClick={onToggleMiniMap}
          active={showMiniMap}
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Selection Actions */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Copy className="w-4 h-4" />}
          tooltip="Dupliquer (Ctrl+D)"
          onClick={onDuplicateSelected}
          disabled={!hasSelection}
        />
        <ToolbarButton
          icon={<Trash2 className="w-4 h-4" />}
          tooltip="Supprimer (Del)"
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          variant="destructive"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Save & Run */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Save className="w-4 h-4" />}
          tooltip="Sauvegarder (Ctrl+S)"
          onClick={onSave}
          active={hasUnsavedChanges}
          variant={hasUnsavedChanges ? "primary" : "default"}
        />
        <Button
          size="sm"
          className={cn(
            "h-7 px-3 gap-1.5 text-xs font-medium",
            isRunning 
              ? "bg-blue-500 hover:bg-blue-600" 
              : "bg-green-600 hover:bg-green-700"
          )}
          onClick={onRun}
          disabled={isRunning}
        >
          <Play className={cn("w-3.5 h-3.5", isRunning && "animate-pulse")} />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'destructive' | 'primary';
}

function ToolbarButton({ 
  icon, 
  tooltip, 
  onClick, 
  disabled = false, 
  active = false,
  variant = 'default'
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0",
            active && variant === 'default' && "bg-secondary text-foreground",
            active && variant === 'primary' && "bg-primary/10 text-primary",
            variant === 'destructive' && "hover:bg-destructive/10 hover:text-destructive",
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export const CanvasToolbar = memo(CanvasToolbarComponent);
