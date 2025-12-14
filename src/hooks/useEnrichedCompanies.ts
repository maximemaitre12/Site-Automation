import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export interface EnrichedCompany {
  id: string;
  user_id: string;
  name: string;
  siren?: string;
  siret?: string;
  tva_number?: string;
  legal_form?: string;
  naf_code?: string;
  naf_label?: string;
  creation_date?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  capital?: number;
  revenue?: number;
  revenue_year?: number;
  net_income?: number;
  ebitda?: number;
  employees_count?: number;
  employees_range?: string;
  executives?: any;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  ai_summary?: string;
  ai_keywords?: any;
  ai_industry_analysis?: string;
  ai_competitive_position?: string;
  ai_risk_score?: number;
  ai_opportunity_score?: number;
  data_sources?: any;
  verification_status?: string;
  verification_date?: string;
  confidence_score?: number;
  last_enriched_at?: string;
  enrichment_status?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyFinancial {
  id: string;
  company_id: string;
  user_id: string;
  fiscal_year: number;
  total_assets?: number;
  equity?: number;
  debt?: number;
  cash?: number;
  revenue?: number;
  gross_margin?: number;
  operating_income?: number;
  net_income?: number;
  ebitda?: number;
  profit_margin?: number;
  debt_ratio?: number;
  current_ratio?: number;
  roe?: number;
  source?: string;
  source_date?: string;
  is_verified?: boolean;
  created_at: string;
}

export interface CompanyAlert {
  id: string;
  company_id: string;
  user_id: string;
  alert_type: string;
  title: string;
  content?: string;
  source_url?: string;
  source_name?: string;
  severity: string;
  is_read: boolean;
  detected_at: string;
  created_at: string;
}

export interface EnrichmentRequest {
  id: string;
  user_id: string;
  query_type: string;
  query_value: string;
  status: string;
  result_company_id?: string;
  error_message?: string;
  sources_checked?: any;
  processing_time_ms?: number;
  created_at: string;
  completed_at?: string;
}

export function useEnrichedCompanies() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch companies with React Query
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ['enriched-companies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('enriched_companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching companies:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch alerts with React Query
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['company-alerts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('company_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch requests with React Query
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['enrichment-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('enrichment_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching requests:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Financials state (fetched on demand)
  const fetchFinancials = useCallback(async (companyId?: string): Promise<CompanyFinancial[]> => {
    if (!user) return [];
    
    let query = supabase
      .from('company_financials')
      .select('*')
      .eq('user_id', user.id)
      .order('fiscal_year', { ascending: false });
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching financials:', error);
      return [];
    }
    
    return data || [];
  }, [user]);

  const fetchAlerts = useCallback(async (companyId?: string): Promise<CompanyAlert[]> => {
    if (!user) return [];
    
    let query = supabase
      .from('company_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('detected_at', { ascending: false });
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
    
    return data || [];
  }, [user]);

  // Enrichment mutation
  const enrichMutation = useMutation({
    mutationFn: async ({ queryType, queryValue }: { queryType: 'siren' | 'siret' | 'name' | 'website', queryValue: string }) => {
      if (!user) {
        throw new Error('Vous devez être connecté pour enrichir une entreprise');
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Session invalide, veuillez vous reconnecter');
      }

      const { data, error } = await supabase.functions.invoke('enrich-company', {
        body: { queryType, queryValue },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Aucune donnée trouvée');
      
      return data.company;
    },
    onSuccess: (company) => {
      if (company) {
        toast.success(`Entreprise "${company.name}" enrichie avec succès`);
        queryClient.invalidateQueries({ queryKey: ['enriched-companies'] });
        queryClient.invalidateQueries({ queryKey: ['enrichment-requests'] });
      }
    },
    onError: (error: any) => {
      console.error('Enrichment error:', error);
      toast.error(error.message || 'Erreur lors de l\'enrichissement');
    }
  });

  const enrichCompany = useCallback(async (
    queryType: 'siren' | 'siret' | 'name' | 'website',
    queryValue: string
  ): Promise<EnrichedCompany | null> => {
    if (!user) return null;
    try {
      return await enrichMutation.mutateAsync({ queryType, queryValue });
    } catch {
      return null;
    }
  }, [user, enrichMutation]);

  const deleteCompany = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('enriched_companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Erreur lors de la suppression');
      return false;
    }
    
    toast.success('Entreprise supprimée');
    queryClient.invalidateQueries({ queryKey: ['enriched-companies'] });
    return true;
  }, [queryClient]);

  const markAlertAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('company_alerts')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
    
    queryClient.invalidateQueries({ queryKey: ['company-alerts'] });
    return true;
  }, [queryClient]);

  const invalidateCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enriched-companies'] });
    queryClient.invalidateQueries({ queryKey: ['company-alerts'] });
    queryClient.invalidateQueries({ queryKey: ['enrichment-requests'] });
  }, [queryClient]);

  // Loading state
  const loading = companiesLoading || alertsLoading || requestsLoading;

  // Statistics
  const stats = {
    totalCompanies: companies.length,
    verifiedCompanies: companies.filter(c => c.verification_status === 'verified').length,
    avgConfidenceScore: companies.length > 0 
      ? Math.round(companies.reduce((acc, c) => acc + (c.confidence_score || 0), 0) / companies.length)
      : 0,
    unreadAlerts: alerts.filter(a => !a.is_read).length,
    totalRequests: requests.length,
    successfulRequests: requests.filter(r => r.status === 'completed').length
  };

  return {
    companies,
    financials: [] as CompanyFinancial[],
    alerts,
    requests,
    loading,
    enriching: enrichMutation.isPending,
    stats,
    enrichCompany,
    deleteCompany,
    fetchCompanies: invalidateCompanies,
    fetchFinancials,
    fetchAlerts,
    fetchRequests: invalidateCompanies,
    markAlertAsRead,
    invalidateCompanies
  };
}
