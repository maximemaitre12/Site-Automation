import { useState, useMemo, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BLOCK_DEFINITIONS, BlockType, BlockCategory } from '@/types/workflow';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { 
  Search, ChevronRight, Zap, Sparkles, ArrowRightLeft, 
  GitBranch, Plug, Settings, Database, X, PanelLeftClose, PanelLeft
} from 'lucide-react';

interface DraggablePaletteProps {
  onAddBlock: (type: BlockType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface CategoryConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const categoryConfig: Record<BlockCategory, CategoryConfig> = {
  trigger: {
    name: 'Déclencheurs',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  ai: {
    name: 'Intelligence IA',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-r from-violet-500/10 to-blue-500/10',
  },
  logic: {
    name: 'Logique / Contrôle',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  transform: {
    name: 'Transformations',
    icon: <ArrowRightLeft className="w-4 h-4" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  http: {
    name: 'HTTP / API',
    icon: <Plug className="w-4 h-4" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  email: {
    name: 'Email',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  database: {
    name: 'Base de données',
    icon: <Database className="w-4 h-4" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  files: {
    name: 'Fichiers / Stockage',
    icon: <Settings className="w-4 h-4" />,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  messaging: {
    name: 'Messagerie',
    icon: <Plug className="w-4 h-4" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  memory: {
    name: 'Mémoire / État',
    icon: <Database className="w-4 h-4" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  tools: {
    name: 'Outils',
    icon: <Settings className="w-4 h-4" />,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
  },
  output: {
    name: 'Sorties',
    icon: <ArrowRightLeft className="w-4 h-4" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
};

function DraggablePaletteComponent({ 
  onAddBlock, 
  isCollapsed = false,
  onToggleCollapse 
}: DraggablePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<BlockCategory>>(
    new Set(['trigger', 'ai', 'logic'])
  );

  // Group blocks by category
  const blocksByCategory = useMemo(() => {
    const grouped: Record<BlockCategory, { type: BlockType; def: typeof BLOCK_DEFINITIONS[BlockType] }[]> = {
      trigger: [],
      ai: [],
      logic: [],
      transform: [],
      http: [],
      email: [],
      database: [],
      files: [],
      messaging: [],
      memory: [],
      tools: [],
      output: [],
    };

    Object.entries(BLOCK_DEFINITIONS).forEach(([type, def]) => {
      const category = def.category as BlockCategory;
      if (grouped[category]) {
        grouped[category].push({ type: type as BlockType, def });
      }
    });

    return grouped;
  }, []);

  // Filter blocks based on search
  const filteredBlocksByCategory = useMemo(() => {
    if (!searchQuery.trim()) return blocksByCategory;

    const query = searchQuery.toLowerCase();
    const filtered: typeof blocksByCategory = {
      trigger: [],
      ai: [],
      logic: [],
      transform: [],
      http: [],
      email: [],
      database: [],
      files: [],
      messaging: [],
      memory: [],
      tools: [],
      output: [],
    };

    Object.entries(blocksByCategory).forEach(([category, blocks]) => {
      filtered[category as BlockCategory] = blocks.filter(
        ({ def }) =>
          def.name.toLowerCase().includes(query) ||
          def.description.toLowerCase().includes(query)
      );
    });

    return filtered;
  }, [blocksByCategory, searchQuery]);

  const toggleCategory = (category: BlockCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full border-r border-border bg-card/50 flex flex-col items-center py-3 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onToggleCollapse}
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
        <div className="w-8 h-px bg-border my-1" />
        {Object.entries(categoryConfig).slice(0, 5).map(([category, config]) => (
          <Button
            key={category}
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", config.color)}
            title={config.name}
          >
            {config.icon}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r border-border bg-card/50 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Blocs</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(categoryConfig).map(([category, config]) => {
            const blocks = filteredBlocksByCategory[category as BlockCategory];
            if (blocks.length === 0) return null;

            return (
              <Collapsible
                key={category}
                open={expandedCategories.has(category as BlockCategory)}
                onOpenChange={() => toggleCategory(category as BlockCategory)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1 rounded", config.bgColor, config.color)}>
                      {config.icon}
                    </div>
                    <span className="text-sm font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">({blocks.length})</span>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    expandedCategories.has(category as BlockCategory) && "rotate-90"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-2 pr-1 py-1 space-y-1">
                    {blocks.map(({ type, def }) => {
                      const Icon = (LucideIcons as any)[def.icon] || LucideIcons.Box;
                      return (
                        <div
                          key={type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, type)}
                          onClick={() => onAddBlock(type)}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                            "hover:bg-secondary border border-transparent hover:border-border",
                            "active:scale-[0.98]"
                          )}
                        >
                          <div className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                            `bg-gradient-to-br ${def.color}`
                          )}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{def.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{def.description}</p>
                          </div>
                          {def.isRealAction && (
                            <span className="shrink-0 text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded">
                              LIVE
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export const DraggablePalette = memo(DraggablePaletteComponent);
