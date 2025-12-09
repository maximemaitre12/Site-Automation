import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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
  const [companies, setCompanies] = useState<EnrichedCompany[]>([]);
  const [financials, setFinancials] = useState<CompanyFinancial[]>([]);
  const [alerts, setAlerts] = useState<CompanyAlert[]>([]);
  const [requests, setRequests] = useState<EnrichmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('enriched_companies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching companies:', error);
      return;
    }
    
    setCompanies(data || []);
  }, [user]);

  const fetchFinancials = useCallback(async (companyId?: string) => {
    if (!user) return;
    
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
      return;
    }
    
    setFinancials(data || []);
  }, [user]);

  const fetchAlerts = useCallback(async (companyId?: string) => {
    if (!user) return;
    
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
      return;
    }
    
    setAlerts(data || []);
  }, [user]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('enrichment_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }
    
    setRequests(data || []);
  }, [user]);

  const enrichCompany = useCallback(async (
    queryType: 'siren' | 'siret' | 'name' | 'website',
    queryValue: string
  ): Promise<EnrichedCompany | null> => {
    if (!user) return null;
    
    setEnriching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('enrich-company', {
        body: { queryType, queryValue }
      });
      
      if (error) {
        console.error('Enrichment error:', error);
        toast.error(error.message || 'Erreur lors de l\'enrichissement');
        return null;
      }
      
      if (!data?.success) {
        toast.error(data?.error || 'Aucune donnée trouvée');
        return null;
      }
      
      if (data.company) {
        toast.success(`Entreprise "${data.company.name}" enrichie avec succès`);
        await fetchCompanies();
        await fetchRequests();
        return data.company;
      }
      
      return null;
    } catch (error) {
      console.error('Enrichment error:', error);
      toast.error('Erreur lors de l\'enrichissement');
      return null;
    } finally {
      setEnriching(false);
    }
  }, [user, fetchCompanies, fetchRequests]);

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
    await fetchCompanies();
    return true;
  }, [fetchCompanies]);

  const markAlertAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('company_alerts')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
    
    await fetchAlerts();
    return true;
  }, [fetchAlerts]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchCompanies(),
        fetchAlerts(),
        fetchRequests()
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, fetchCompanies, fetchAlerts, fetchRequests]);

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
    financials,
    alerts,
    requests,
    loading,
    enriching,
    stats,
    enrichCompany,
    deleteCompany,
    fetchCompanies,
    fetchFinancials,
    fetchAlerts,
    fetchRequests,
    markAlertAsRead
  };
}
