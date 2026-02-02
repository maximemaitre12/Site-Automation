import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ESGSiteEmission {
  id: string;
  user_id: string;
  site_name: string;
  location: string;
  scope1_emissions: number;
  scope2_emissions: number;
  scope3_emissions: number;
  reporting_year: number;
  reporting_period: string;
  data_source: string | null;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ESGEmissionCategory {
  id: string;
  user_id: string;
  category_name: string;
  category_type: string;
  scope1_emissions: number;
  scope2_emissions: number;
  scope3_emissions: number;
  reporting_year: number;
  trend_percentage: number | null;
  data_source: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ESGKPI {
  id: string;
  user_id: string;
  kpi_name: string;
  kpi_value: number;
  kpi_unit: string;
  target_value: number | null;
  description: string | null;
  reporting_year: number;
  data_source: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ESGTarget {
  id: string;
  user_id: string;
  target_year: number;
  target_reduction_percent: number;
  baseline_year: number;
  target_type: string;
  description: string | null;
  is_achieved: boolean;
  created_at: string;
}

export function useESGData(reportingYear?: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currentYear = reportingYear || new Date().getFullYear();

  // Fetch site emissions
  const { data: siteEmissions = [], isLoading: loadingSites } = useQuery({
    queryKey: ['esg-site-emissions', user?.id, currentYear],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('esg_site_emissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', currentYear)
        .order('scope1_emissions', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ESGSiteEmission[];
    },
    enabled: !!user?.id,
  });

  // Fetch emission categories
  const { data: emissionCategories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['esg-emission-categories', user?.id, currentYear],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('esg_emission_categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', currentYear)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ESGEmissionCategory[];
    },
    enabled: !!user?.id,
  });

  // Fetch KPIs
  const { data: kpis = [], isLoading: loadingKPIs } = useQuery({
    queryKey: ['esg-kpis', user?.id, currentYear],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('esg_kpis')
        .select('*')
        .eq('user_id', user.id)
        .eq('reporting_year', currentYear)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ESGKPI[];
    },
    enabled: !!user?.id,
  });

  // Fetch targets
  const { data: targets = [], isLoading: loadingTargets } = useQuery({
    queryKey: ['esg-targets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('esg_targets')
        .select('*')
        .eq('user_id', user.id)
        .order('target_year', { ascending: true });
      
      if (error) throw error;
      return (data || []) as ESGTarget[];
    },
    enabled: !!user?.id,
  });

  // Calculate totals
  const totalScope1 = siteEmissions.reduce((sum, s) => sum + Number(s.scope1_emissions || 0), 0) +
    emissionCategories.reduce((sum, c) => sum + Number(c.scope1_emissions || 0), 0);
  const totalScope2 = siteEmissions.reduce((sum, s) => sum + Number(s.scope2_emissions || 0), 0) +
    emissionCategories.reduce((sum, c) => sum + Number(c.scope2_emissions || 0), 0);
  const totalScope3 = siteEmissions.reduce((sum, s) => sum + Number(s.scope3_emissions || 0), 0) +
    emissionCategories.reduce((sum, c) => sum + Number(c.scope3_emissions || 0), 0);
  const totalEmissions = totalScope1 + totalScope2 + totalScope3;

  // Mutations
  const addSiteEmission = useMutation({
    mutationFn: async (data: {
      site_name: string;
      location: string;
      scope1_emissions: number;
      scope2_emissions: number;
      scope3_emissions: number;
      reporting_year: number;
      reporting_period: string;
      data_source: string | null;
      is_verified: boolean;
      notes: string | null;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('esg_site_emissions')
        .insert({ ...data, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-site-emissions'] });
      toast.success('Site ajouté');
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const addEmissionCategory = useMutation({
    mutationFn: async (data: Omit<ESGEmissionCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('esg_emission_categories')
        .insert({ ...data, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-emission-categories'] });
      toast.success('Catégorie ajoutée');
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const addKPI = useMutation({
    mutationFn: async (data: Omit<ESGKPI, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('esg_kpis')
        .insert({ ...data, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-kpis'] });
      toast.success('KPI ajouté');
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const addTarget = useMutation({
    mutationFn: async (data: Omit<ESGTarget, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('esg_targets')
        .insert({ ...data, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-targets'] });
      toast.success('Objectif ajouté');
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const deleteSiteEmission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('esg_site_emissions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-site-emissions'] });
      toast.success('Site supprimé');
    },
  });

  const deleteKPI = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('esg_kpis').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-kpis'] });
      toast.success('KPI supprimé');
    },
  });

  const hasData = siteEmissions.length > 0 || emissionCategories.length > 0 || kpis.length > 0;

  return {
    siteEmissions,
    emissionCategories,
    kpis,
    targets,
    totalScope1,
    totalScope2,
    totalScope3,
    totalEmissions,
    isLoading: loadingSites || loadingCategories || loadingKPIs || loadingTargets,
    hasData,
    addSiteEmission,
    addEmissionCategory,
    addKPI,
    addTarget,
    deleteSiteEmission,
    deleteKPI,
  };
}
