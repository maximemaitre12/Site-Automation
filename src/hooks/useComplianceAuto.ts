import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ComplianceScan {
  id: string;
  user_id: string;
  scan_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  overall_score: number | null;
  data_sources_scanned: string[];
  findings: ComplianceIssue[];
  recommendations: Recommendation[];
  records_analyzed: number;
  issues_found: number;
  critical_issues: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ComplianceIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedRecords: number;
  table: string;
  rgpdReference: string;
  remediation: string[];
}

export interface ComplianceAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  affected_table: string | null;
  affected_records: number | null;
  regulation_reference: string | null;
  is_resolved: boolean;
  created_at: string;
}

export interface Recommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface RegulatoryReference {
  id: string;
  regulation_type: string;
  article_code: string;
  title: string;
  content: string;
  source_url: string | null;
  source_name: string | null;
  metadata: { requirements?: string[] } | null;
}

export function useComplianceAuto() {
  const { user } = useAuth();
  const [scans, setScans] = useState<ComplianceScan[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [regulations, setRegulations] = useState<RegulatoryReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  // Charger les données
  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [scansRes, alertsRes] = await Promise.all([
        supabase
          .from('compliance_scans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('compliance_alerts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_resolved', false)
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      if (scansRes.data) {
        setScans(scansRes.data as unknown as ComplianceScan[]);
      }
      if (alertsRes.data) {
        setAlerts(alertsRes.data as ComplianceAlert[]);
      }
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les réglementations
  const loadRegulations = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) return;

      const response = await supabase.functions.invoke('compliance-regulations', {
        body: { action: 'get', regulationType: 'gdpr' }
      });

      if (response.data?.success && response.data.references) {
        setRegulations(response.data.references);
      }
    } catch (error) {
      console.error('Error loading regulations:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadRegulations();
  }, [loadData, loadRegulations]);

  // Lancer un scan automatique
  const runAutoScan = useCallback(async (scanType: 'full' | 'crm' | 'hr' = 'full') => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setScanning(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('Session expirée');
      }

      const response = await supabase.functions.invoke('compliance-scan', {
        body: { scanType }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.success) {
        toast.success(`Scan terminé : score ${response.data.score}/100`);
        await loadData();
        return response.data;
      } else {
        throw new Error(response.data?.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Erreur lors du scan de conformité');
      return null;
    } finally {
      setScanning(false);
    }
  }, [user, loadData]);

  // Résoudre une alerte
  const resolveAlert = useCallback(async (alertId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('compliance_alerts')
      .update({ 
        is_resolved: true, 
        resolved_at: new Date().toISOString(),
        resolved_by: user.id 
      })
      .eq('id', alertId);

    if (error) {
      toast.error('Erreur lors de la résolution');
    } else {
      toast.success('Alerte résolue');
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  }, [user]);

  // Statistiques
  const getStats = useCallback(() => {
    const latestScan = scans.find(s => s.status === 'completed');
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = alerts.filter(a => a.severity === 'high').length;

    return {
      latestScore: latestScan?.overall_score ?? null,
      totalScans: scans.length,
      openAlerts: alerts.length,
      criticalAlerts,
      highAlerts,
      recordsAnalyzed: latestScan?.records_analyzed ?? 0,
      dataSourcesCount: latestScan?.data_sources_scanned?.length ?? 0
    };
  }, [scans, alerts]);

  return {
    scans,
    alerts,
    regulations,
    loading,
    scanning,
    runAutoScan,
    resolveAlert,
    getStats,
    refresh: loadData
  };
}
