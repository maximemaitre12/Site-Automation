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
  onAddBlock?: (type: BlockType) => void;
}

export function EnhancedWorkflowCanvas({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock, 
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
  onAddBlock
}: EnhancedWorkflowCanvasProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Zap className="w-8 h-8 md:w-12 md:h-12 text-primary/50" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
            Commencez votre workflow
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Ajoutez votre première étape en cliquant sur un bloc ci-dessous
          </p>
          
          {/* Quick add buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {[
              { type: 'trigger_text' as BlockType, label: 'Texte', icon: Type, color: 'from-slate-500 to-slate-400' },
              { type: 'trigger_file' as BlockType, label: 'Fichier', icon: FileUp, color: 'from-blue-500 to-blue-400' },
              { type: 'ai_summary' as BlockType, label: 'Résumer IA', icon: Sparkles, color: 'from-violet-500 to-violet-400' },
              { type: 'ai_extract' as BlockType, label: 'Extraire IA', icon: FileSearch, color: 'from-purple-500 to-purple-400' },
              { type: 'ai_classify' as BlockType, label: 'Classifier IA', icon: Tags, color: 'from-pink-500 to-pink-400' },
              { type: 'system_email' as BlockType, label: 'Email', icon: Mail, color: 'from-orange-500 to-orange-400' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => onAddBlock?.(item.type)}
                className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Triggers
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              IA
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Actions
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gradient-to-br from-background to-muted/20">
      {/* Helper tip */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs md:text-sm text-primary">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>Cliquez sur un bloc pour le configurer • Utilisez les flèches pour réorganiser • Plus de blocs dans le panneau à droite</span>
        </div>
      </div>

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
                  "relative p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer group",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.01] md:scale-[1.02]" 
                    : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                )}
              >
                <div className="flex items-start gap-3 md:gap-5">
                  {/* Step indicator and icon */}
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <div className={cn(
                      "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform",
                      def?.color || 'from-gray-500 to-gray-400',
                      (isSelected || isHovered) && "scale-110"
                    )}>
                      <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-[9px] md:text-[10px] font-mono px-1.5">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 md:mb-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm md:text-lg text-foreground truncate">
                          {block.name || def?.name}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                          {def?.description}
                        </p>
                      </div>

                      {/* Actions - Always visible on touch devices */}
                      <div className={cn(
                        "flex items-center gap-0.5 md:gap-1 transition-opacity ml-2",
                        (isSelected || isHovered) ? "opacity-100" : "opacity-0 sm:opacity-0"
                      )}>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'up'); }}
                          >
                            <ArrowDown className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
                          </Button>
                        )}
                        {index < blocks.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                            onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'down'); }}
                          >
                            <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0">
                              <MoreVertical className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectBlock(block.id)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Configurer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicateBlock(block.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDeleteBlock(block.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Config preview */}
                    {Object.keys(block.config || {}).length > 0 && (
                      <div className="mt-2 md:mt-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-muted/50 border border-border/50">
                        <div className="grid grid-cols-2 gap-1 md:gap-2">
                          {Object.entries(block.config).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-[10px] md:text-xs">
                              <span className="text-muted-foreground">{key}: </span>
                              <span className="text-foreground font-medium truncate block">
                                {String(value).slice(0, 30)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Retry config indicator */}
                    {block.retryConfig?.enabled && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <Repeat className="w-3 h-3" />
                        Retries: {block.retryConfig.maxRetries}x
                      </div>
                    )}
                  </div>
                </div>

                {/* Category badge */}
                <div className={cn(
                  "absolute -top-1.5 md:-top-2 -right-1.5 md:-right-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-semibold uppercase tracking-wide shadow-sm",
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
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-primary pointer-events-none" />
                )}
              </div>

              {/* Connector line */}
              {index < sortedBlocks.length - 1 && (
                <div className="flex justify-center py-0.5 md:py-1">
                  <div className="relative">
                    <div className="w-0.5 md:w-1 h-6 md:h-10 bg-gradient-to-b from-border via-primary/30 to-border rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20 border-2 border-primary/40" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add block button at the end */}
        <div className="flex justify-center pt-4">
          <div className="text-center">
            <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 border border-border text-[10px] md:text-xs text-muted-foreground flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Fin du workflow
            </div>
            <p className="text-xs text-muted-foreground">
              Ajoutez d'autres blocs depuis le panneau à droite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
