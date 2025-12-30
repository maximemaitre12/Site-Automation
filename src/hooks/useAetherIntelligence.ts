import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AgentType } from '@/contexts/AetherContext';

interface AIAnalysisResult {
  insights: string[];
  suggestions: string[];
  risks: string[];
  opportunities: string[];
  score?: number;
}

interface CrossAgentContext {
  candidates?: any[];
  deals?: any[];
  tickets?: any[];
  documents?: any[];
  companies?: any[];
  recentActivity?: any[];
}

export function useAetherIntelligence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get cross-agent context for AI
  const getCrossAgentContext = useCallback(async (): Promise<CrossAgentContext> => {
    if (!user?.id) return {};

    const [candidates, deals, tickets, documents, companies] = await Promise.all([
      supabase
        .from('candidates')
        .select('id, name, email, status, match_score, job_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('sales_deals')
        .select('id, title, value, status, probability, contact_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('support_tickets')
        .select('id, subject, priority, status, customer_email, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('aether_documents')
        .select('id, title, file_type, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('enriched_companies')
        .select('id, name, city, employees_count, revenue, ai_opportunity_score')
        .eq('user_id', user.id)
        .limit(10),
    ]);

    return {
      candidates: candidates.data || [],
      deals: deals.data || [],
      tickets: tickets.data || [],
      documents: documents.data || [],
      companies: companies.data || [],
    };
  }, [user?.id]);

  // Analyze entity with cross-agent context
  const analyzeWithContext = useCallback(async (
    entityType: string,
    entityData: any,
    specificPrompt?: string
  ): Promise<AIAnalysisResult> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const context = await getCrossAgentContext();
      
      const { data, error } = await supabase.functions.invoke('ai-cross-agent-intelligence', {
        body: {
          action: 'analyze',
          entityType,
          entityData,
          context,
          specificPrompt,
          userId: user.id,
        }
      });

      if (error) throw error;
      return data as AIAnalysisResult;
    } catch (error: any) {
      toast({
        title: "Erreur d'analyse IA",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCrossAgentContext, toast]);

  // Generate proactive insights
  const generateInsights = useCallback(async (sourceAgent: AgentType): Promise<void> => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const context = await getCrossAgentContext();
      
      const { data, error } = await supabase.functions.invoke('ai-cross-agent-intelligence', {
        body: {
          action: 'generate_insights',
          sourceAgent,
          context,
          userId: user.id,
        }
      });

      if (error) throw error;

      // Save insights to database
      if (data?.insights?.length > 0) {
        await supabase.from('ai_insights').insert(
          data.insights.map((insight: any) => ({
            user_id: user.id,
            source_agent: sourceAgent,
            insight_type: insight.type,
            title: insight.title,
            content: insight.content,
            related_entities: insight.relatedEntities || [],
            priority: insight.priority || 5,
          }))
        );
      }

      // Save suggested actions
      if (data?.actions?.length > 0) {
        await supabase.from('ai_suggested_actions').insert(
          data.actions.map((action: any) => ({
            user_id: user.id,
            action_type: action.type,
            title: action.title,
            description: action.description,
            target_agent: action.targetAgent,
            action_data: action.data || {},
          }))
        );
      }

      toast({
        title: "Analyse terminée",
        description: `${data?.insights?.length || 0} insights générés`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCrossAgentContext, toast]);

  // Find cross-agent connections
  const findConnections = useCallback(async (
    entityType: string,
    entityId: string
  ): Promise<any[]> => {
    if (!user?.id) return [];

    setLoading(true);
    try {
      const context = await getCrossAgentContext();
      
      const { data, error } = await supabase.functions.invoke('ai-cross-agent-intelligence', {
        body: {
          action: 'find_connections',
          entityType,
          entityId,
          context,
          userId: user.id,
        }
      });

      if (error) throw error;
      return data?.connections || [];
    } catch (error: any) {
      console.error('Error finding connections:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCrossAgentContext]);

  // Summarize activity
  const summarizeActivity = useCallback(async (period: 'day' | 'week' | 'month' = 'week'): Promise<string> => {
    if (!user?.id) return '';

    setLoading(true);
    try {
      const context = await getCrossAgentContext();
      
      const { data, error } = await supabase.functions.invoke('ai-cross-agent-intelligence', {
        body: {
          action: 'summarize_activity',
          period,
          context,
          userId: user.id,
        }
      });

      if (error) throw error;
      return data?.summary || '';
    } catch (error: any) {
      console.error('Error summarizing activity:', error);
      return '';
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCrossAgentContext]);

  // Ask AI about anything across agents
  const askAI = useCallback(async (question: string, currentAgent?: AgentType): Promise<string> => {
    if (!user?.id) return '';

    setLoading(true);
    try {
      const context = await getCrossAgentContext();
      
      const { data, error } = await supabase.functions.invoke('ai-cross-agent-intelligence', {
        body: {
          action: 'ask',
          question,
          currentAgent,
          context,
          userId: user.id,
        }
      });

      if (error) throw error;
      return data?.answer || '';
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return '';
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCrossAgentContext, toast]);

  return {
    loading,
    analyzeWithContext,
    generateInsights,
    findConnections,
    summarizeActivity,
    askAI,
    getCrossAgentContext,
  };
}
