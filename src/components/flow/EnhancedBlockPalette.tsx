import { useState } from 'react';
import { BLOCK_DEFINITIONS, BlockType, BlockCategory, CATEGORY_INFO } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Search, ChevronDown,
  ChevronRight, Plus, MessageSquare, MessageCircle, Phone, Table,
  Brain, Image, Volume2, Mic, Users, Cloud, TrendingUp, Calendar,
  Columns, CheckSquare, Bug, Zap, HardDrive, Box, CreditCard,
  ShoppingCart, Calculator, Twitter, Linkedin, Facebook, Instagram,
  Youtube, Video, Github, Gitlab, Triangle, Flame, BarChart3,
  BarChart2, Activity, LineChart, Workflow, Play, Headphones,
  Cpu, Layers, Settings2, Star, X, Code, Lock, Binary, Shuffle,
  ArrowUpDown, Scissors, FileCode, FileJson, Save, Trash2, Wrench,
  PenTool, FileDown, FileOutput, Radio, Archive, CloudUpload, CloudDownload,
  Edit, Trash, RefreshCw, Variable, Hourglass, AlertTriangle, StopCircle,
  Share2, Merge, SplitSquareVertical, FileJson2, Inbox, Reply
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, MessageSquare, MessageCircle, 
  Phone, Table, Brain, Image, Volume2, Mic, Users, Cloud, TrendingUp,
  Calendar, Columns, CheckSquare, Bug, Zap, HardDrive, Box, CreditCard,
  ShoppingCart, Calculator, Twitter, Linkedin, Facebook, Instagram,
  Youtube, Video, Github, Gitlab, Triangle, Flame, BarChart3, BarChart2,
  Activity, LineChart, Workflow, Play, Headphones, Code, Lock, Binary,
  Shuffle, ArrowUpDown, Scissors, FileCode, FileJson, Save, Trash2, Wrench,
  PenTool, FileDown, FileOutput, Radio, Archive, CloudUpload, CloudDownload,
  Edit, Trash, RefreshCw, Variable, Hourglass, AlertTriangle, StopCircle,
  Share2, Merge, SplitSquareVertical, FileJson2, Inbox, Reply
};

// Tab categories with icons - Updated for new architecture
const TABS = [
  { id: 'all', name: 'Tous', icon: Layers },
  { id: 'trigger', name: 'Triggers', icon: Zap },
  { id: 'ai', name: 'AI / LLM', icon: Brain },
  { id: 'logic', name: 'Logic', icon: GitBranch },
  { id: 'transform', name: 'Transform', icon: Shuffle },
  { id: 'http', name: 'HTTP', icon: Globe },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'database', name: 'Database', icon: Database },
  { id: 'files', name: 'Files', icon: FileText },
  { id: 'output', name: 'Output', icon: FileOutput },
] as const;

interface EnhancedBlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function EnhancedBlockPalette({ onAddBlock }: EnhancedBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const allBlocks = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];
  
  // Filter by search
  const searchFiltered = search
    ? allBlocks.filter(([_, def]) => 
        def.name.toLowerCase().includes(search.toLowerCase()) ||
        def.description.toLowerCase().includes(search.toLowerCase())
      )
    : allBlocks;

  // Filter by active tab
  const tabFiltered = activeTab === 'all' 
    ? searchFiltered 
    : searchFiltered.filter(([_, def]) => def.category === activeTab);

  const renderBlockButton = (type: BlockType, def: typeof BLOCK_DEFINITIONS[BlockType], compact = false) => {
    const Icon = iconMap[def.icon] || Sparkles;
    return (
      <button
        key={type}
        onClick={() => onAddBlock(type)}
        className={cn(
          "w-full rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left flex items-center gap-3",
          compact ? "p-2" : "p-3"
        )}
        title={def.description}
      >
        <div className={cn(
          "rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm",
          def.color,
          compact ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Icon className={cn("text-white", compact ? "w-4 h-4" : "w-5 h-5")} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn("font-medium text-foreground block", compact ? "text-xs" : "text-sm")}>{def.name}</span>
          {!compact && (
            <span className="text-xs text-muted-foreground truncate block">{def.description}</span>
          )}
        </div>
        {def.isRealAction && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            Live
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Blocks Primitifs
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blocks List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {tabFiltered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun bloc trouvé</p>
            </div>
          ) : (
            tabFiltered.map(([type, def]) => renderBlockButton(type, def, search.length > 0))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          {tabFiltered.length} block{tabFiltered.length > 1 ? 's' : ''} • 100% configurable
        </p>
      </div>
    </aside>
  );
}
