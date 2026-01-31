import { BLOCK_DEFINITIONS, BlockType, BlockCategory } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Brain, Zap,
  Code, Shuffle, FileText, Bell
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Brain, Zap,
  Code, Shuffle, FileText, Bell
};

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const categories: Record<string, [string, typeof BLOCK_DEFINITIONS[BlockType]][]> = {
    trigger: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'trigger'),
    ai: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'ai'),
    logic: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'logic'),
    transform: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'transform'),
    output: Object.entries(BLOCK_DEFINITIONS).filter(([_, def]) => def.category === 'output')
  };

  const categoryLabels: Record<string, string> = {
    trigger: 'Triggers',
    ai: 'AI / LLM',
    logic: 'Logic & Control',
    transform: 'Data Transform',
    output: 'Output'
  };

  return (
    <aside className="w-64 border-l border-border bg-card/50 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-foreground mb-4">Blocks</h3>
      
      <div className="space-y-6">
        {Object.entries(categories).map(([category, blocks]) => (
          blocks.length > 0 && (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {categoryLabels[category] || category}
              </h4>
              <div className="space-y-2">
                {blocks.map(([type, def]) => {
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
          )
        ))}
      </div>
    </aside>
  );
}
