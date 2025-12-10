import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Forecast {
  predicted_revenue: number;
  predicted_deals_won: number;
  predicted_deals_lost: number;
  confidence_low: number;
  confidence_high: number;
  confidence_score: number;
  factors: Array<{ factor: string; impact: string; weight: number }>;
  recommendations: string[];
  risk_areas: string[];
}

export interface Anomaly {
  id?: string;
  anomaly_type: string;
  severity: string;
  title: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  detected_value?: number;
  expected_value?: number;
  deviation_percent?: number;
  is_resolved?: boolean;
  created_at?: string;
}

export interface Segment {
  id?: string;
  name: string;
  description: string;
  segment_type: string;
  criteria: Record<string, any>;
  member_count: number;
  avg_score?: number;
  cluster_id?: number;
  insights?: string;
  recommended_actions?: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean | null;
  trigger_type: string;
  trigger_conditions: any;
  action_type: string;
  action_config: any;
  execution_count: number | null;
  last_executed_at?: string | null;
}

export interface SalesDeal {
  id: string;
  user_id: string;
  company_id?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  title: string;
  description?: string | null;
  value: number | null;
  currency: string | null;
  status: string;
  probability: number | null;
  ai_score?: number | null;
  ai_risk_score?: number | null;
  ai_factors?: any;
  expected_close_date?: string | null;
  actual_close_date?: string | null;
  lost_reason?: string | null;
  source?: string | null;
  assigned_to?: string | null;
  tags?: any;
  last_activity_at?: string | null;
  created_at: string;
  updated_at: string;
}

export function useAIIntelligence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [forecastLoading, setForecastLoading] = useState(false);
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);
  const [segmentationLoading, setSegmentationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch saved forecasts
  const { data: forecasts = [], isLoading: forecastsQueryLoading } = useQuery({
    queryKey: ['sales-forecasts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('sales_forecasts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch anomalies
  const { data: anomalies = [], isLoading: anomaliesQueryLoading } = useQuery({
    queryKey: ['ai-anomalies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ai_anomalies')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch segments
  const { data: segments = [], isLoading: segmentsQueryLoading } = useQuery({
    queryKey: ['ai-segments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ai_segments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch automation rules
  const { data: automationRules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ['automation-rules', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ai_automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch deals
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['sales-deals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('sales_deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Generate forecast
  const generateForecast = useCallback(async (period: 'weekly' | 'monthly' | 'quarterly' = 'monthly') => {
    if (!user) return null;
    setForecastLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-forecasting', {
        body: { action: 'generate', period },
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['sales-forecasts'] });
      toast({ title: 'Prévision générée', description: 'Les prévisions ont été mises à jour.' });
      return data;
    } catch (err) {
      console.error('Forecast error:', err);
      toast({ title: 'Erreur', description: 'Impossible de générer les prévisions.', variant: 'destructive' });
      return null;
    } finally {
      setForecastLoading(false);
    }
  }, [user, queryClient, toast]);

  // Detect anomalies
  const detectAnomalies = useCallback(async () => {
    if (!user) return null;
    setAnomaliesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-anomalies', {
        body: {},
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['ai-anomalies'] });
      toast({ title: 'Analyse terminée', description: `${data.anomalies?.length || 0} anomalies détectées.` });
      return data;
    } catch (err) {
      console.error('Anomalies error:', err);
      toast({ title: 'Erreur', description: 'Impossible de détecter les anomalies.', variant: 'destructive' });
      return null;
    } finally {
      setAnomaliesLoading(false);
    }
  }, [user, queryClient, toast]);

  // Generate segments
  const generateSegments = useCallback(async (segmentType: 'prospect' | 'company' | 'candidate' = 'prospect') => {
    if (!user) return null;
    setSegmentationLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-segmentation', {
        body: { segment_type: segmentType },
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['ai-segments'] });
      toast({ title: 'Segmentation terminée', description: `${data.segments?.length || 0} segments créés.` });
      return data;
    } catch (err) {
      console.error('Segmentation error:', err);
      toast({ title: 'Erreur', description: 'Impossible de générer les segments.', variant: 'destructive' });
      return null;
    } finally {
      setSegmentationLoading(false);
    }
  }, [user, queryClient, toast]);

  // Universal search
  const universalSearch = useCallback(async (query: string) => {
    if (!user || !query.trim()) return null;
    setSearchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-universal-search', {
        body: { query },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Search error:', err);
      toast({ title: 'Erreur', description: 'Impossible d\'effectuer la recherche.', variant: 'destructive' });
      return null;
    } finally {
      setSearchLoading(false);
    }
  }, [user, toast]);

  // Detect duplicates
  const detectDuplicates = useCallback(async (entityType: 'company' | 'deal' = 'company') => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.functions.invoke('ai-dedupe-enrich', {
        body: { action: 'detect_duplicates', entity_type: entityType },
      });
      if (error) throw error;
      toast({ title: 'Analyse terminée', description: `${data.duplicates?.length || 0} doublons potentiels détectés.` });
      return data;
    } catch (err) {
      console.error('Dedupe error:', err);
      toast({ title: 'Erreur', description: 'Impossible de détecter les doublons.', variant: 'destructive' });
      return null;
    }
  }, [user, toast]);

  // Enrich entity
  const enrichEntity = useCallback(async (entityId: string, entityType: 'company' | 'deal' = 'company') => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.functions.invoke('ai-dedupe-enrich', {
        body: { action: 'enrich', entity_id: entityId, entity_type: entityType },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Enrich error:', err);
      toast({ title: 'Erreur', description: 'Impossible d\'enrichir les données.', variant: 'destructive' });
      return null;
    }
  }, [user, toast]);

  // Create automation rule
  const createAutomationRule = useCallback(async (rule: Omit<AutomationRule, 'id' | 'execution_count' | 'last_executed_at'>) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.functions.invoke('ai-automation', {
        body: { action: 'create_rule', ...rule },
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({ title: 'Règle créée', description: 'La règle d\'automatisation a été créée.' });
      return data;
    } catch (err) {
      console.error('Create rule error:', err);
      toast({ title: 'Erreur', description: 'Impossible de créer la règle.', variant: 'destructive' });
      return null;
    }
  }, [user, queryClient, toast]);

  // Get automation suggestions
  const getAutomationSuggestions = useCallback(async () => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.functions.invoke('ai-automation', {
        body: { action: 'get_suggestions' },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Suggestions error:', err);
      return null;
    }
  }, [user]);

  // Toggle automation rule
  const toggleAutomationRule = useCallback(async (ruleId: string, isActive: boolean) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('ai_automation_rules')
        .update({ is_active: isActive })
        .eq('id', ruleId)
        .eq('user_id', user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({ title: isActive ? 'Règle activée' : 'Règle désactivée' });
    } catch (err) {
      console.error('Toggle rule error:', err);
      toast({ title: 'Erreur', description: 'Impossible de modifier la règle.', variant: 'destructive' });
    }
  }, [user, queryClient, toast]);

  // Resolve anomaly
  const resolveAnomaly = useCallback(async (anomalyId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('ai_anomalies')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', anomalyId)
        .eq('user_id', user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['ai-anomalies'] });
      toast({ title: 'Anomalie résolue' });
    } catch (err) {
      console.error('Resolve anomaly error:', err);
    }
  }, [user, queryClient, toast]);

  // Create deal
  const createDeal = useCallback(async (deal: Partial<SalesDeal>) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('sales_deals')
        .insert({
          title: deal.title || 'New Deal',
          user_id: user.id,
          status: deal.status || 'lead_created',
          value: deal.value || 0,
          probability: deal.probability || 20,
          contact_name: deal.contact_name,
          contact_email: deal.contact_email,
          description: deal.description,
          expected_close_date: deal.expected_close_date,
          source: deal.source,
        })
        .select()
        .single();
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: 'Deal créé' });
      return data;
    } catch (err) {
      console.error('Create deal error:', err);
      toast({ title: 'Erreur', description: 'Impossible de créer le deal.', variant: 'destructive' });
      return null;
    }
  }, [user, queryClient, toast]);

  // Update deal status
  const updateDealStatus = useCallback(async (dealId: string, newStatus: string, reason?: string) => {
    if (!user) return;
    try {
      // Get current deal
      const { data: currentDeal } = await supabase
        .from('sales_deals')
        .select('status')
        .eq('id', dealId)
        .single();

      // Update deal
      const updateData: any = { status: newStatus };
      if (newStatus === 'won') updateData.actual_close_date = new Date().toISOString().split('T')[0];
      if (newStatus === 'lost' && reason) updateData.lost_reason = reason;

      const { error } = await supabase
        .from('sales_deals')
        .update(updateData)
        .eq('id', dealId)
        .eq('user_id', user.id);
      if (error) throw error;

      // Record history
      await supabase.from('deal_status_history').insert({
        deal_id: dealId,
        user_id: user.id,
        from_status: currentDeal?.status as any,
        to_status: newStatus as any,
        change_reason: reason,
      });

      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: 'Statut mis à jour' });
    } catch (err) {
      console.error('Update status error:', err);
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut.', variant: 'destructive' });
    }
  }, [user, queryClient, toast]);

  // Delete deal
  const deleteDeal = useCallback(async (dealId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('sales_deals')
        .delete()
        .eq('id', dealId)
        .eq('user_id', user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: 'Deal supprimé' });
    } catch (err) {
      console.error('Delete deal error:', err);
      toast({ title: 'Erreur', description: 'Impossible de supprimer le deal.', variant: 'destructive' });
    }
  }, [user, queryClient, toast]);

  return {
    // Data
    forecasts,
    anomalies,
    segments,
    automationRules,
    deals,
    
    // Loading states
    loading: forecastsQueryLoading || anomaliesQueryLoading || segmentsQueryLoading || rulesLoading || dealsLoading,
    forecastLoading,
    anomaliesLoading,
    segmentationLoading,
    searchLoading,
    
    // Actions
    generateForecast,
    detectAnomalies,
    generateSegments,
    universalSearch,
    detectDuplicates,
    enrichEntity,
    createAutomationRule,
    getAutomationSuggestions,
    toggleAutomationRule,
    resolveAnomaly,
    createDeal,
    updateDealStatus,
    deleteDeal,
  };
}