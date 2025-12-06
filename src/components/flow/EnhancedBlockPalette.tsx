import { useState } from 'react';
import { BLOCK_DEFINITIONS, BlockType, BlockCategory, CATEGORY_INFO } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Search, ChevronDown,
  ChevronRight, Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText
};

interface EnhancedBlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function EnhancedBlockPalette({ onAddBlock }: EnhancedBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<BlockCategory>>(
    new Set(['trigger', 'ai', 'system'])
  );

  const toggleCategory = (category: BlockCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const allBlocks = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];
  
  const filteredBlocks = search
    ? allBlocks.filter(([_, def]) => 
        def.name.toLowerCase().includes(search.toLowerCase()) ||
        def.description.toLowerCase().includes(search.toLowerCase())
      )
    : allBlocks;

  const blocksByCategory = filteredBlocks.reduce((acc, [type, def]) => {
    if (!acc[def.category]) acc[def.category] = [];
    acc[def.category].push([type, def] as const);
    return acc;
  }, {} as Record<BlockCategory, [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][]>);

  const categories: BlockCategory[] = ['trigger', 'ai', 'transform', 'control', 'integration', 'system'];

  return (
    <aside className="w-72 border-l border-border bg-card/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Blocks
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Blocks list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {categories.map(category => {
            const blocks = blocksByCategory[category] || [];
            const info = CATEGORY_INFO[category];
            const isExpanded = expandedCategories.has(category);

            if (blocks.length === 0) return null;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${info.color}`} />
                    <span className="text-xs font-medium text-foreground uppercase tracking-wide">
                      {info.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({blocks.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-1.5 mt-2">
                    <TooltipProvider delayDuration={300}>
                      {blocks.map(([type, def]) => {
                        const Icon = iconMap[def.icon] || Sparkles;
                        return (
                          <Tooltip key={type}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onAddBlock(type)}
                                className="w-full p-2.5 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left flex items-center gap-3"
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-foreground block truncate">
                                    {def.name}
                                  </span>
                                </div>
                                <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="font-medium">{def.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{def.description}</p>
                              {def.configFields.length > 0 && (
                                <div className="mt-2 text-xs">
                                  <span className="text-muted-foreground">Config: </span>
                                  {def.configFields.map(f => f.label).slice(0, 3).join(', ')}
                                  {def.configFields.length > 3 && '...'}
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                )}
              </div>
            );
          })}

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No blocks found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick tip */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          💡 Click a block to add it to your workflow, then configure it in the properties panel
        </p>
      </div>
    </aside>
  );
}
