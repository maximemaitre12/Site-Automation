import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface DataSource {
  id: string;
  user_id: string;
  name: string;
  source_type: 'database' | 'api' | 'file' | 'saas' | 'webhook';
  connector: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  config: Record<string, unknown>;
  last_sync_at: string | null;
  records_count: number;
  error_message: string | null;
  sync_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  created_at: string;
  updated_at: string;
}

export interface DataCatalogEntry {
  id: string;
  user_id: string;
  source_id: string | null;
  name: string;
  description: string | null;
  schema_info: Record<string, unknown>;
  tags: string[];
  owner: string | null;
  sensitivity_level: 'public' | 'internal' | 'confidential' | 'restricted';
  pii_detected: boolean;
  row_count: number;
  column_count: number;
  last_updated_at: string | null;
  lineage: Array<{ from: string; to: string }>;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface DataQualityCheck {
  id: string;
  user_id: string;
  catalog_id: string;
  check_type: 'completeness' | 'accuracy' | 'consistency' | 'timeliness';
  check_name: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details: Record<string, unknown>;
  executed_at: string;
  created_at: string;
}

export interface PipelineRun {
  id: string;
  user_id: string;
  source_id: string;
  pipeline_name: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  records_processed: number;
  records_failed: number;
  duration_ms: number | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export function useDataPlatform() {
  const { user } = useAuth();
  const [sources, setSources] = useState<DataSource[]>([]);
  const [catalog, setCatalog] = useState<DataCatalogEntry[]>([]);
  const [qualityChecks, setQualityChecks] = useState<DataQualityCheck[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('data_sources')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching sources:', error);
    } else {
      setSources((data || []) as DataSource[]);
    }
  }, [user]);

  const fetchCatalog = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('data_catalog')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching catalog:', error);
    } else {
      setCatalog((data || []).map(item => ({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : [],
        lineage: Array.isArray(item.lineage) ? item.lineage : []
      })) as DataCatalogEntry[]);
    }
  }, [user]);

  const fetchQualityChecks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('data_quality_checks')
      .select('*')
      .order('executed_at', { ascending: false })
      .limit(50);
    if (error) {
      console.error('Error fetching quality checks:', error);
    } else {
      setQualityChecks((data || []) as DataQualityCheck[]);
    }
  }, [user]);

  const fetchPipelineRuns = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('data_pipeline_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(100);
    if (error) {
      console.error('Error fetching pipeline runs:', error);
    } else {
      setPipelineRuns((data || []) as PipelineRun[]);
    }
  }, [user]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchSources(), fetchCatalog(), fetchQualityChecks(), fetchPipelineRuns()]);
      setLoading(false);
    };
    if (user) loadAll();
  }, [user, fetchSources, fetchCatalog, fetchQualityChecks, fetchPipelineRuns]);

  // CRUD for Data Sources
  const createSource = async (source: Omit<DataSource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('data_sources')
      .insert({ 
        name: source.name,
        source_type: source.source_type,
        connector: source.connector,
        status: source.status,
        config: source.config as Json,
        last_sync_at: source.last_sync_at,
        records_count: source.records_count,
        error_message: source.error_message,
        sync_frequency: source.sync_frequency,
        user_id: user.id 
      })
      .select()
      .single();
    if (error) {
      toast.error('Erreur lors de la création de la source');
      return null;
    }
    toast.success('Source créée');
    fetchSources();
    return data;
  };

  const updateSource = async (id: string, updates: Partial<DataSource>) => {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.last_sync_at !== undefined) updateData.last_sync_at = updates.last_sync_at;
    if (updates.records_count !== undefined) updateData.records_count = updates.records_count;
    if (updates.error_message !== undefined) updateData.error_message = updates.error_message;
    
    const { error } = await supabase
      .from('data_sources')
      .update(updateData)
      .eq('id', id);
    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
    toast.success('Source mise à jour');
    fetchSources();
    return true;
  };

  const deleteSource = async (id: string) => {
    const { error } = await supabase.from('data_sources').delete().eq('id', id);
    if (error) {
      toast.error('Erreur lors de la suppression');
      return false;
    }
    toast.success('Source supprimée');
    fetchSources();
    return true;
  };

  const syncSource = async (id: string) => {
    await updateSource(id, { status: 'syncing' as const });
    toast.info('Synchronisation en cours...');
    
    if (user) {
      const source = sources.find(s => s.id === id);
      await supabase.from('data_pipeline_runs').insert({
        user_id: user.id,
        source_id: id,
        pipeline_name: `Sync - ${source?.name || 'Unknown'}`,
        status: 'running'
      });
      fetchPipelineRuns();
    }
    
    setTimeout(async () => {
      await updateSource(id, { 
        status: 'active' as const, 
        last_sync_at: new Date().toISOString(),
        records_count: Math.floor(Math.random() * 10000)
      });
      toast.success('Synchronisation terminée');
    }, 3000);
  };

  // CRUD for Catalog
  const createCatalogEntry = async (entry: Omit<DataCatalogEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('data_catalog')
      .insert({ 
        name: entry.name,
        description: entry.description,
        source_id: entry.source_id,
        sensitivity_level: entry.sensitivity_level,
        owner: entry.owner,
        tags: entry.tags as unknown as Json,
        schema_info: entry.schema_info as Json,
        pii_detected: entry.pii_detected,
        row_count: entry.row_count,
        column_count: entry.column_count,
        last_updated_at: entry.last_updated_at,
        lineage: entry.lineage as unknown as Json,
        quality_score: entry.quality_score,
        user_id: user.id 
      })
      .select()
      .single();
    if (error) {
      toast.error('Erreur lors de la création');
      return null;
    }
    toast.success('Dataset ajouté au catalogue');
    fetchCatalog();
    return data;
  };

  const updateCatalogEntry = async (id: string, updates: Partial<DataCatalogEntry>) => {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    const { error } = await supabase
      .from('data_catalog')
      .update(updateData)
      .eq('id', id);
    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
    fetchCatalog();
    return true;
  };

  const deleteCatalogEntry = async (id: string) => {
    const { error } = await supabase.from('data_catalog').delete().eq('id', id);
    if (error) {
      toast.error('Erreur lors de la suppression');
      return false;
    }
    toast.success('Dataset supprimé');
    fetchCatalog();
    return true;
  };

  const stats = {
    totalSources: sources.length,
    activeSources: sources.filter(s => s.status === 'active').length,
    totalRecords: sources.reduce((sum, s) => sum + (s.records_count || 0), 0),
    totalDatasets: catalog.length,
    piiDatasets: catalog.filter(c => c.pii_detected).length,
    avgQualityScore: catalog.length > 0 
      ? Math.round(catalog.reduce((sum, c) => sum + c.quality_score, 0) / catalog.length) 
      : 0,
    recentRuns: pipelineRuns.slice(0, 10),
    failedRuns: pipelineRuns.filter(r => r.status === 'failed').length,
    successfulRuns: pipelineRuns.filter(r => r.status === 'completed').length
  };

  return {
    sources,
    catalog,
    qualityChecks,
    pipelineRuns,
    loading,
    stats,
    createSource,
    updateSource,
    deleteSource,
    syncSource,
    createCatalogEntry,
    updateCatalogEntry,
    deleteCatalogEntry,
    refresh: () => Promise.all([fetchSources(), fetchCatalog(), fetchQualityChecks(), fetchPipelineRuns()])
  };
}
