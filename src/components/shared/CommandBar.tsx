import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Database, 
  Workflow, 
  ShieldCheck,
  Brain,
  Plus,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Settings,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAether, AgentType } from '@/contexts/AetherContext';
import { cn } from '@/lib/utils';

const agentIcons: Record<AgentType | string, any> = {
  hr: Users,
  sales: BarChart3,
  support: MessageSquare,
  doc: FileText,
  data: Database,
  flow: Workflow,
  compliance: ShieldCheck,
  brain: Brain,
};

const agentColors: Record<AgentType | string, string> = {
  hr: 'bg-agent-hr/20 text-agent-hr',
  sales: 'bg-agent-sales/20 text-agent-sales',
  support: 'bg-agent-support/20 text-agent-support',
  doc: 'bg-primary/20 text-primary',
  data: 'bg-primary/20 text-primary',
  flow: 'bg-agent-flow/20 text-agent-flow',
  compliance: 'bg-agent-compliance/20 text-agent-compliance',
  brain: 'bg-agent-brain/20 text-agent-brain',
};

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  agent: AgentType;
  path: string;
  action?: string;
}

const quickActions: QuickAction[] = [
  { id: 'new-candidate', label: 'Nouveau candidat', description: 'Ajouter un candidat', icon: Plus, agent: 'hr', path: '/tools/hr', action: 'new-candidate' },
  { id: 'new-deal', label: 'Nouveau deal', description: 'Créer une opportunité', icon: Plus, agent: 'sales', path: '/tools/sales', action: 'new-deal' },
  { id: 'new-ticket', label: 'Nouveau ticket', description: 'Créer un ticket support', icon: Plus, agent: 'support', path: '/tools/support', action: 'new-ticket' },
  { id: 'new-document', label: 'Nouveau document', description: 'Créer un document', icon: Plus, agent: 'doc', path: '/tools/doc', action: 'new-doc' },
  { id: 'new-workflow', label: 'Nouveau workflow', description: 'Créer un workflow', icon: Plus, agent: 'flow', path: '/tools/flow', action: 'new-workflow' },
  { id: 'new-audit', label: 'Nouvel audit', description: 'Lancer un audit', icon: Plus, agent: 'compliance', path: '/tools/compliance', action: 'new-audit' },
];

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'hr', label: 'HR Copilot', path: '/tools/hr', icon: Users },
  { id: 'sales', label: 'Sales Copilot', path: '/tools/sales', icon: BarChart3 },
  { id: 'support', label: 'Support Agent', path: '/tools/support', icon: MessageSquare },
  { id: 'doc', label: 'Doc Hub', path: '/tools/doc', icon: FileText },
  { id: 'data', label: 'Data Platform', path: '/tools/data', icon: Database },
  { id: 'flow', label: 'Flow Builder', path: '/tools/flow', icon: Workflow },
  { id: 'compliance', label: 'Compliance', path: '/tools/compliance', icon: ShieldCheck },
  { id: 'brain', label: 'AETHER Brain', path: '/tools/brain', icon: Brain },
  { id: 'settings', label: 'Paramètres', path: '/settings/company', icon: Settings },
];

export function CommandBar() {
  const navigate = useNavigate();
  const { 
    isCommandBarOpen, 
    closeCommandBar, 
    quickSearch, 
    favorites,
    globalStats 
  } = useAether();
  
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  // Filter items based on query
  const filteredNavigation = query
    ? navigationItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : navigationItems;

  const filteredActions = query
    ? quickActions.filter(action => 
        action.label.toLowerCase().includes(query.toLowerCase()) ||
        action.description.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions.slice(0, 4);

  // Search effect
  useEffect(() => {
    if (query.length >= 2) {
      setSearching(true);
      const searchTimeout = setTimeout(async () => {
        const results = await quickSearch(query);
        setSearchResults(results);
        setSearching(false);
      }, 300);
      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
    }
  }, [query, quickSearch]);

  // Reset on open/close
  useEffect(() => {
    if (isCommandBarOpen) {
      setQuery('');
      setSelectedIndex(0);
      setSearchResults([]);
    }
  }, [isCommandBarOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalItems = filteredNavigation.length + filteredActions.length + searchResults.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Handle selection
      let currentIndex = 0;
      
      if (selectedIndex < filteredNavigation.length) {
        const item = filteredNavigation[selectedIndex];
        navigate(item.path);
        closeCommandBar();
      } else if (selectedIndex < filteredNavigation.length + filteredActions.length) {
        const actionIndex = selectedIndex - filteredNavigation.length;
        const action = filteredActions[actionIndex];
        navigate(`${action.path}?action=${action.action}`);
        closeCommandBar();
      } else {
        const resultIndex = selectedIndex - filteredNavigation.length - filteredActions.length;
        const result = searchResults[resultIndex];
        if (result) {
          navigate(result.path);
          closeCommandBar();
        }
      }
    }
  }, [selectedIndex, filteredNavigation, filteredActions, searchResults, navigate, closeCommandBar]);

  const handleItemClick = (path: string, action?: string) => {
    if (action) {
      navigate(`${path}?action=${action}`);
    } else {
      navigate(path);
    }
    closeCommandBar();
  };

  return (
    <Dialog open={isCommandBarOpen} onOpenChange={() => closeCommandBar()}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <DialogTitle className="sr-only">Recherche et navigation rapide</DialogTitle>
        
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Rechercher dans AETHER..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
            autoFocus
          />
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded text-muted-foreground">ESC</kbd>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-2">
            {/* Quick Stats */}
            {!query && (
              <div className="grid grid-cols-5 gap-2 p-2 mb-3">
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-lg font-bold text-foreground">{globalStats.candidates}</span>
                  <span className="text-[10px] text-muted-foreground">Candidats</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-lg font-bold text-foreground">{globalStats.deals}</span>
                  <span className="text-[10px] text-muted-foreground">Deals</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-lg font-bold text-foreground">{globalStats.tickets}</span>
                  <span className="text-[10px] text-muted-foreground">Tickets</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-lg font-bold text-foreground">{globalStats.documents}</span>
                  <span className="text-[10px] text-muted-foreground">Docs</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-lg font-bold text-foreground">{globalStats.workflows}</span>
                  <span className="text-[10px] text-muted-foreground">Workflows</span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-3">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Résultats
                </div>
                {searchResults.map((result, index) => {
                  const Icon = agentIcons[result.agent] || FileText;
                  const itemIndex = filteredNavigation.length + filteredActions.length + index;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleItemClick(result.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                        selectedIndex === itemIndex 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("p-1.5 rounded-md", agentColors[result.agent])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {result.type}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Favorites */}
            {!query && favorites.length > 0 && (
              <div className="mb-3">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Favoris
                </div>
                {favorites.slice(0, 3).map((fav) => {
                  const Icon = agentIcons[fav.agent_type] || FileText;
                  return (
                    <button
                      key={fav.id}
                      onClick={() => navigate(`/tools/${fav.agent_type}?${fav.entity_type}=${fav.entity_id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className={cn("p-1.5 rounded-md", agentColors[fav.agent_type])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{fav.entity_name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-3">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-3 h-3" />
                Actions rapides
              </div>
              <div className="grid grid-cols-2 gap-1">
                {filteredActions.map((action, index) => {
                  const Icon = action.icon;
                  const itemIndex = filteredNavigation.length + index;
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleItemClick(action.path, action.action)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left",
                        selectedIndex === itemIndex 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("p-1 rounded", agentColors[action.agent])}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                Navigation
              </div>
              <div className="grid grid-cols-2 gap-1">
                {filteredNavigation.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.path)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left",
                        selectedIndex === index 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
              naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
              sélectionner
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">K</kbd>
            ouvrir
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
