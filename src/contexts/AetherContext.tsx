import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types for cross-agent data
export type AgentType = 'hr' | 'sales' | 'data' | 'support' | 'compliance' | 'doc' | 'brain' | 'flow';

export interface AIInsight {
  id: string;
  source_agent: AgentType;
  insight_type: string;
  title: string;
  content: string | null;
  related_entities: any[];
  priority: number;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
}

export interface SuggestedAction {
  id: string;
  action_type: string;
  title: string;
  description: string | null;
  target_agent: AgentType;
  action_data: any;
  status: string;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  agent_type: AgentType;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  created_at: string;
}

export interface QuickSearchResult {
  id: string;
  type: string;
  agent: AgentType;
  title: string;
  subtitle?: string;
  path: string;
  icon?: string;
}

interface AetherContextType {
  // Current state
  currentAgent: AgentType | null;
  setCurrentAgent: (agent: AgentType | null) => void;
  
  // Command bar
  isCommandBarOpen: boolean;
  openCommandBar: () => void;
  closeCommandBar: () => void;
  toggleCommandBar: () => void;
  
  // Insights panel
  isInsightsPanelOpen: boolean;
  openInsightsPanel: () => void;
  closeInsightsPanel: () => void;
  toggleInsightsPanel: () => void;
  
  // AI Insights
  insights: AIInsight[];
  insightsLoading: boolean;
  unreadInsightsCount: number;
  markInsightAsRead: (id: string) => Promise<void>;
  dismissInsight: (id: string) => Promise<void>;
  
  // Suggested Actions
  suggestedActions: SuggestedAction[];
  actionsLoading: boolean;
  executeAction: (id: string) => Promise<void>;
  dismissAction: (id: string) => Promise<void>;
  
  // Favorites
  favorites: UserFavorite[];
  favoritesLoading: boolean;
  addFavorite: (data: Omit<UserFavorite, 'id' | 'created_at'>) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (entityType: string, entityId: string) => boolean;
  
  // Quick search
  quickSearch: (query: string) => Promise<QuickSearchResult[]>;
  
  // Cross-agent stats
  globalStats: {
    candidates: number;
    deals: number;
    tickets: number;
    documents: number;
    workflows: number;
  };
  
  // Refresh data
  refreshAll: () => void;
}

const AetherContext = createContext<AetherContextType | undefined>(undefined);

export function AetherProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);
  
  // Keyboard shortcut for command bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isCommandBarOpen) {
        setIsCommandBarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandBarOpen]);
  
  // Fetch AI Insights
  const { data: insights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as AIInsight[];
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });
  
  // Fetch Suggested Actions
  const { data: suggestedActions = [], isLoading: actionsLoading } = useQuery({
    queryKey: ['suggested-actions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('ai_suggested_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as SuggestedAction[];
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });
  
  // Fetch Favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserFavorite[];
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });
  
  // Fetch global stats
  const { data: globalStats = { candidates: 0, deals: 0, tickets: 0, documents: 0, workflows: 0 } } = useQuery({
    queryKey: ['global-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { candidates: 0, deals: 0, tickets: 0, documents: 0, workflows: 0 };
      
      const [candidatesRes, dealsRes, ticketsRes, docsRes, workflowsRes] = await Promise.all([
        supabase.from('candidates').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('sales_deals').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('aether_documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('workflows').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      
      return {
        candidates: candidatesRes.count || 0,
        deals: dealsRes.count || 0,
        tickets: ticketsRes.count || 0,
        documents: docsRes.count || 0,
        workflows: workflowsRes.count || 0,
      };
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });
  
  const unreadInsightsCount = insights.filter(i => !i.is_read).length;
  
  const markInsightAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;
    await supabase.from('ai_insights').update({ is_read: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
  }, [user?.id, queryClient]);
  
  const dismissInsight = useCallback(async (id: string) => {
    if (!user?.id) return;
    await supabase.from('ai_insights').update({ is_dismissed: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
  }, [user?.id, queryClient]);
  
  const executeAction = useCallback(async (id: string) => {
    if (!user?.id) return;
    await supabase.from('ai_suggested_actions').update({ 
      status: 'executed',
      executed_at: new Date().toISOString()
    }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['suggested-actions'] });
  }, [user?.id, queryClient]);
  
  const dismissAction = useCallback(async (id: string) => {
    if (!user?.id) return;
    await supabase.from('ai_suggested_actions').update({ status: 'dismissed' }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['suggested-actions'] });
  }, [user?.id, queryClient]);
  
  const addFavorite = useCallback(async (data: Omit<UserFavorite, 'id' | 'created_at'>) => {
    if (!user?.id) return;
    await supabase.from('user_favorites').insert({ ...data, user_id: user.id });
    queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
  }, [user?.id, queryClient]);
  
  const removeFavorite = useCallback(async (id: string) => {
    if (!user?.id) return;
    await supabase.from('user_favorites').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
  }, [user?.id, queryClient]);
  
  const isFavorite = useCallback((entityType: string, entityId: string) => {
    return favorites.some(f => f.entity_type === entityType && f.entity_id === entityId);
  }, [favorites]);
  
  const quickSearch = useCallback(async (query: string): Promise<QuickSearchResult[]> => {
    if (!user?.id || !query.trim()) return [];
    
    const searchQuery = query.toLowerCase().trim();
    const results: QuickSearchResult[] = [];
    
    // Search across multiple tables in parallel
    const [candidates, deals, tickets, documents] = await Promise.all([
      supabase
        .from('candidates')
        .select('id, name, email, status')
        .eq('user_id', user.id)
        .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5),
      supabase
        .from('sales_deals')
        .select('id, title, contact_name, status')
        .eq('user_id', user.id)
        .or(`title.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%`)
        .limit(5),
      supabase
        .from('support_tickets')
        .select('id, subject, customer_email, status')
        .eq('user_id', user.id)
        .or(`subject.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`)
        .limit(5),
      supabase
        .from('aether_documents')
        .select('id, title, description')
        .eq('user_id', user.id)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5),
    ]);
    
    if (candidates.data) {
      results.push(...candidates.data.map(c => ({
        id: c.id,
        type: 'candidate',
        agent: 'hr' as AgentType,
        title: c.name,
        subtitle: c.email || c.status,
        path: `/tools/hr?candidate=${c.id}`,
      })));
    }
    
    if (deals.data) {
      results.push(...deals.data.map(d => ({
        id: d.id,
        type: 'deal',
        agent: 'sales' as AgentType,
        title: d.title,
        subtitle: d.contact_name || d.status,
        path: `/tools/sales?deal=${d.id}`,
      })));
    }
    
    if (tickets.data) {
      results.push(...tickets.data.map(t => ({
        id: t.id,
        type: 'ticket',
        agent: 'support' as AgentType,
        title: t.subject,
        subtitle: t.customer_email || t.status,
        path: `/tools/support?ticket=${t.id}`,
      })));
    }
    
    if (documents.data) {
      results.push(...documents.data.map(d => ({
        id: d.id,
        type: 'document',
        agent: 'doc' as AgentType,
        title: d.title,
        subtitle: d.description || undefined,
        path: `/tools/doc?doc=${d.id}`,
      })));
    }
    
    return results;
  }, [user?.id]);
  
  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    queryClient.invalidateQueries({ queryKey: ['suggested-actions'] });
    queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    queryClient.invalidateQueries({ queryKey: ['global-stats'] });
  }, [queryClient]);
  
  const value: AetherContextType = {
    currentAgent,
    setCurrentAgent,
    
    isCommandBarOpen,
    openCommandBar: () => setIsCommandBarOpen(true),
    closeCommandBar: () => setIsCommandBarOpen(false),
    toggleCommandBar: () => setIsCommandBarOpen(prev => !prev),
    
    isInsightsPanelOpen,
    openInsightsPanel: () => setIsInsightsPanelOpen(true),
    closeInsightsPanel: () => setIsInsightsPanelOpen(false),
    toggleInsightsPanel: () => setIsInsightsPanelOpen(prev => !prev),
    
    insights,
    insightsLoading,
    unreadInsightsCount,
    markInsightAsRead,
    dismissInsight,
    
    suggestedActions,
    actionsLoading,
    executeAction,
    dismissAction,
    
    favorites,
    favoritesLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    
    quickSearch,
    globalStats,
    refreshAll,
  };
  
  return (
    <AetherContext.Provider value={value}>
      {children}
    </AetherContext.Provider>
  );
}

export function useAether() {
  const context = useContext(AetherContext);
  if (context === undefined) {
    throw new Error('useAether must be used within an AetherProvider');
  }
  return context;
}
