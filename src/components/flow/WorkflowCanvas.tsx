import { useState } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, X, GripVertical, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database
};

interface WorkflowCanvasProps {
  blocks: WorkflowBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
}

export function WorkflowCanvas({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock, 
  onDeleteBlock,
  onMoveBlock
}: WorkflowCanvasProps) {
  // Sort blocks by Y position
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Start building your workflow
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Add blocks from the right panel to create your automation pipeline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-4">
        {sortedBlocks.map((block, index) => {
          const def = BLOCK_DEFINITIONS[block.type];
          const Icon = iconMap[def?.icon] || Sparkles;
          const isSelected = selectedBlockId === block.id;

          return (
            <div key={block.id}>
              <div
                onClick={() => onSelectBlock(isSelected ? null : block.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Drag handle & icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${def?.color || 'from-gray-500 to-gray-400'} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground">
                        {block.name || def?.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'up'); }}
                          >
                            <ArrowDown className="w-3 h-3 rotate-180" />
                          </Button>
                        )}
                        {index < blocks.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'down'); }}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {def?.description}
                    </p>
                    
                    {/* Config preview */}
                    {Object.keys(block.config || {}).length > 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-muted/50 text-xs font-mono">
                        {Object.entries(block.config).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="truncate text-muted-foreground">
                            <span className="text-foreground/70">{key}:</span> {String(value).slice(0, 40)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Category badge */}
                <div className={`
                  absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide
                  ${def?.category === 'trigger' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${def?.category === 'ai' ? 'bg-violet-500/20 text-violet-400' : ''}
                  ${def?.category === 'system' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                `}>
                  {def?.category}
                </div>
              </div>

              {/* Connector line */}
              {index < sortedBlocks.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/30 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
