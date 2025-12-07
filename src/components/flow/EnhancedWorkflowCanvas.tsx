import { useState, useRef, useCallback, useEffect } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play, Plus, Trash2,
  Move, Zap, X, Settings, Link2, Grab, Copy, MoreVertical,
  ChevronRight, ArrowDown, GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Play
};

interface EnhancedWorkflowCanvasProps {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onAddConnection: (connection: BlockConnection) => void;
  onRemoveConnection: (connectionId: string) => void;
  onAddBlock: () => void;
}

export function EnhancedWorkflowCanvas({
  blocks,
  connections,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onAddConnection,
  onRemoveConnection,
  onAddBlock
}: EnhancedWorkflowCanvasProps) {
  // Sort blocks by Y position to maintain consistent order
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Move block up or down
  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const sorted = [...blocks].sort((a, b) => a.position.y - b.position.y);
    const index = sorted.findIndex(b => b.id === blockId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sorted.length) return;
    
    // Swap positions
    const tempY = sorted[index].position.y;
    onUpdateBlock(sorted[index].id, { position: { ...sorted[index].position, y: sorted[newIndex].position.y } });
    onUpdateBlock(sorted[newIndex].id, { position: { ...sorted[newIndex].position, y: tempY } });
  };

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg text-center px-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-primary/60" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Créez votre workflow
          </h2>
          <p className="text-muted-foreground mb-8">
            Un workflow est une séquence d'étapes automatisées. Commencez par ajouter votre première étape.
          </p>

          <Button variant="hero" size="lg" onClick={onAddBlock} className="gap-2">
            <Plus className="w-5 h-5" />
            Ajouter une étape
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-3">
            {sortedBlocks.map((block, index) => {
              const def = BLOCK_DEFINITIONS[block.type as BlockType];
              const Icon = iconMap[def?.icon] || Sparkles;
              const isSelected = selectedBlockId === block.id;
              const isFirst = index === 0;
              const isLast = index === sortedBlocks.length - 1;
              const hasConfig = Object.keys(block.config || {}).length > 0;
              
              // Check if configuration is complete
              const requiredFields = def?.configFields?.filter(f => f.required) || [];
              const isConfigComplete = requiredFields.every(f => block.config?.[f.key]);

              return (
                <div key={block.id}>
                  {/* Connector from previous block */}
                  {!isFirst && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20" />
                    </div>
                  )}

                  {/* Block card */}
                  <div
                    onClick={() => onSelectBlock(block.id)}
                    className={cn(
                      "relative rounded-2xl border-2 transition-all cursor-pointer group",
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-xl ring-4 ring-primary/10" 
                        : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                    )}
                  >
                    {/* Step number badge */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </div>

                    <div className="p-4 md:p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform flex-shrink-0",
                          def?.color || 'from-gray-500 to-gray-400',
                          isSelected && "scale-110"
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground truncate flex items-center gap-2">
                                {block.name || def?.name}
                                {!isConfigComplete && requiredFields.length > 0 && (
                                  <Badge variant="outline" className="text-amber-500 border-amber-500/50 text-[10px]">
                                    Config requise
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                {block.description || def?.description}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className={cn(
                              "flex items-center gap-1 transition-opacity flex-shrink-0",
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover">
                                  {!isFirst && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up'); }}>
                                      <ArrowDown className="w-4 h-4 mr-2 rotate-180" />
                                      Monter
                                    </DropdownMenuItem>
                                  )}
                                  {!isLast && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down'); }}>
                                      <ArrowDown className="w-4 h-4 mr-2" />
                                      Descendre
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicateBlock(block.id); }}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Dupliquer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Config preview */}
                          {hasConfig && (
                            <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(block.config).slice(0, 3).map(([key, value]) => (
                                  <div key={key} className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded-md">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <span className="text-foreground font-medium truncate max-w-[100px]">
                                      {typeof value === 'string' ? value.slice(0, 20) : String(value)}
                                    </span>
                                  </div>
                                ))}
                                {Object.keys(block.config).length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{Object.keys(block.config).length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Click to configure hint */}
                    {isSelected && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground text-[10px] shadow-lg">
                          Cliquez à droite pour configurer
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add more steps button */}
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={onAddBlock}
                className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
              >
                <Plus className="w-5 h-5" />
                Ajouter une étape
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
