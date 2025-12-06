import { useState, useRef } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, X, ArrowDown,
  Clock, Eye, Heart, Languages, Braces, Filter, ArrowRightLeft,
  Combine, Repeat, Timer, GitFork, Bell, FileText, GripVertical,
  Play, Copy, Settings, MoreVertical, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText
};

interface EnhancedWorkflowCanvasProps {
  blocks: WorkflowBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (id: string) => void;
}

export function EnhancedWorkflowCanvas({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock, 
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock
}: EnhancedWorkflowCanvasProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="w-12 h-12 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Design Your Workflow
          </h3>
          <p className="text-muted-foreground mb-6">
            Add blocks from the right panel to create your automation pipeline. 
            Each block performs a specific action, connected in sequence.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="text-xs">
              <GitBranch className="w-3 h-3 mr-1" />
              Conditional Logic
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              API Integrations
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-1">
        {sortedBlocks.map((block, index) => {
          const def = BLOCK_DEFINITIONS[block.type as BlockType];
          const Icon = iconMap[def?.icon] || Sparkles;
          const isSelected = selectedBlockId === block.id;
          const isHovered = hoveredBlockId === block.id;

          return (
            <div key={block.id}>
              {/* Block */}
              <div
                onClick={() => onSelectBlock(isSelected ? null : block.id)}
                onMouseEnter={() => setHoveredBlockId(block.id)}
                onMouseLeave={() => setHoveredBlockId(null)}
                className={cn(
                  "relative p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]" 
                    : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                )}
              >
                <div className="flex items-start gap-5">
                  {/* Step indicator and icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform",
                      def?.color || 'from-gray-500 to-gray-400',
                      (isSelected || isHovered) && "scale-110"
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-foreground">
                          {block.name || def?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {def?.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className={cn(
                        "flex items-center gap-1 transition-opacity",
                        (isSelected || isHovered) ? "opacity-100" : "opacity-0"
                      )}>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'up'); }}
                          >
                            <ArrowDown className="w-4 h-4 rotate-180" />
                          </Button>
                        )}
                        {index < blocks.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'down'); }}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectBlock(block.id)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicateBlock(block.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDeleteBlock(block.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Config preview */}
                    {Object.keys(block.config || {}).length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(block.config).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="text-muted-foreground">{key}: </span>
                              <span className="text-foreground font-medium truncate block">
                                {String(value).slice(0, 40)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Retry config indicator */}
                    {block.retryConfig?.enabled && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Repeat className="w-3 h-3" />
                        Retries: {block.retryConfig.maxRetries}x
                      </div>
                    )}
                  </div>
                </div>

                {/* Category badge */}
                <div className={cn(
                  "absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-sm",
                  def?.category === 'trigger' && 'bg-blue-500 text-white',
                  def?.category === 'ai' && 'bg-violet-500 text-white',
                  def?.category === 'transform' && 'bg-emerald-500 text-white',
                  def?.category === 'control' && 'bg-amber-500 text-white',
                  def?.category === 'integration' && 'bg-blue-600 text-white',
                  def?.category === 'system' && 'bg-slate-500 text-white'
                )}>
                  {def?.category}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none animate-pulse" />
                )}
              </div>

              {/* Connector line */}
              {index < sortedBlocks.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="relative">
                    <div className="w-1 h-10 bg-gradient-to-b from-border via-primary/30 to-border rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/20 border-2 border-primary/40" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* End indicator */}
        <div className="flex justify-center pt-4">
          <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Workflow End
          </div>
        </div>
      </div>
    </div>
  );
}
