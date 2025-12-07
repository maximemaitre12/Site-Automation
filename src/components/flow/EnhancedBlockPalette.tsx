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
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // Most used blocks for quick access
  const quickBlocks: BlockType[] = ['trigger_text', 'trigger_file', 'ai_summary', 'ai_extract', 'system_email', 'system_save'];

  return (
    <aside className="w-56 lg:w-72 border-l border-border bg-card/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-border">
        <h3 className="text-xs lg:text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter des blocs
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-8 lg:pl-9 h-8 lg:h-9 text-sm"
          />
        </div>
      </div>

      {/* Quick add section */}
      {!search && (
        <div className="p-3 lg:p-4 border-b border-border bg-primary/5">
          <h4 className="text-[10px] lg:text-xs font-medium text-primary mb-2 uppercase tracking-wide">
            ⚡ Blocs populaires
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {quickBlocks.map((type) => {
              const def = BLOCK_DEFINITIONS[type];
              const Icon = iconMap[def.icon] || Sparkles;
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type)}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-foreground truncate">
                    {def.name.replace('AI ', '').replace('Entrée ', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocks list */}
      <ScrollArea className="flex-1">
        <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
          {categories.map(category => {
            const blocks = blocksByCategory[category] || [];
            const info = CATEGORY_INFO[category];
            const isExpanded = expandedCategories.has(category);

            if (blocks.length === 0) return null;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-1.5 lg:py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${info.color}`} />
                    <span className="text-[10px] lg:text-xs font-medium text-foreground uppercase tracking-wide">
                      {info.name}
                    </span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground">
                      ({blocks.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-1 mt-1.5 lg:mt-2">
                    {blocks.map(([type, def]) => {
                      const Icon = iconMap[def.icon] || Sparkles;
                      return (
                        <button
                          key={type}
                          onClick={() => onAddBlock(type)}
                          className="w-full p-2 lg:p-2.5 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left flex items-center gap-2 lg:gap-3"
                          title={def.description}
                        >
                          <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                            <Icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs lg:text-sm font-medium text-foreground block truncate">
                              {def.name}
                            </span>
                            <span className="text-[10px] lg:text-xs text-muted-foreground truncate block hidden lg:block">
                              {def.description}
                            </span>
                          </div>
                          <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredBlocks.length === 0 && (
            <div className="text-center py-6 lg:py-8">
              <Search className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs lg:text-sm text-muted-foreground">Aucun bloc trouvé</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick tip */}
      <div className="p-3 lg:p-4 border-t border-border bg-muted/30">
        <p className="text-[10px] lg:text-xs text-muted-foreground">
          💡 Cliquez pour ajouter, puis configurez le bloc sélectionné
        </p>
      </div>
    </aside>
  );
}
