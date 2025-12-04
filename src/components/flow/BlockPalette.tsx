import { BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database 
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database
};

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const categories = {
    trigger: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'trigger'),
    ai: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'ai'),
    system: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'system')
  };

  return (
    <aside className="w-64 border-l border-border bg-card/50 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-foreground mb-4">Blocks</h3>
      
      <div className="space-y-6">
        {/* Triggers */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Triggers
          </h4>
          <div className="space-y-2">
            {categories.trigger.map(([type, def]) => {
              const Icon = iconMap[def.icon] || Sparkles;
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type as BlockType)}
                  className="w-full p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">{def.name}</span>
                      <span className="text-xs text-muted-foreground truncate block">{def.description}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Actions */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            AI Actions
          </h4>
          <div className="space-y-2">
            {categories.ai.map(([type, def]) => {
              const Icon = iconMap[def.icon] || Sparkles;
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type as BlockType)}
                  className="w-full p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">{def.name}</span>
                      <span className="text-xs text-muted-foreground truncate block">{def.description}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Actions */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            System Actions
          </h4>
          <div className="space-y-2">
            {categories.system.map(([type, def]) => {
              const Icon = iconMap[def.icon] || Sparkles;
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type as BlockType)}
                  className="w-full p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">{def.name}</span>
                      <span className="text-xs text-muted-foreground truncate block">{def.description}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
