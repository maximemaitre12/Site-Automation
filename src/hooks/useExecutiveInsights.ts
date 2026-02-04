import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserCompanyId } from '@/hooks/useUserCompanyId';

export interface ConnectionStatus {
  id: string;
  name: string;
  type: 'payment' | 'communication' | 'crm' | 'erp' | 'productivity' | 'other';
  status: 'connected' | 'disconnected' | 'partial';
  lastSync?: string;
  metrics?: Record<string, number | string>;
  icon: string;
}

export interface BusinessMetric {
  id: string;
  label: string;
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  source: string;
  category: 'revenue' | 'sales' | 'hr' | 'support' | 'compliance' | 'operations';
}

export interface StrategicInsight {
  id: string;
  title: string;
  content: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  suggestedAction?: string;
  createdAt: string;
}

export interface ExecutiveData {
  connections: ConnectionStatus[];
  metrics: BusinessMetric[];
  insights: StrategicInsight[];
  overallHealth: number;
  loading: boolean;
  error: string | null;
}

export function useExecutiveInsights() {
  const { user } = useAuth();
  const { companyId } = useUserCompanyId();
  const [data, setData] = useState<ExecutiveData>({
    connections: [],
    metrics: [],
    insights: [],
    overallHealth: 0,
    loading: true,
    error: null,
  });

  const detectConnections = useCallback(async (): Promise<ConnectionStatus[]> => {
    const connections: ConnectionStatus[] = [];

    // Check Stripe connection via user_api_keys
    const { data: apiKeys } = await supabase
      .from('user_api_keys')
      .select('service_name, api_key, updated_at')
      .eq('user_id', user?.id);

    const stripeKey = apiKeys?.find(k => k.service_name?.toLowerCase().includes('stripe'));
    if (stripeKey) {
      connections.push({
        id: 'stripe',
        name: 'Stripe',
        type: 'payment',
        status: stripeKey.api_key ? 'connected' : 'disconnected',
        lastSync: stripeKey.updated_at,
        icon: '💳',
      });
    } else {
      connections.push({
        id: 'stripe',
        name: 'Stripe',
        type: 'payment',
        status: 'disconnected',
        icon: '💳',
      });
    }

    // Check Google OAuth (Gmail, Calendar, etc.) - use RPC or direct table if exists
    let googleConnected = false;
    try {
      const { count } = await supabase
        .from('crm_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('activity_type', 'email');
      googleConnected = (count || 0) > 0;
    } catch {
      // Table might not exist
    }

    connections.push({
      id: 'google',
      name: 'Google Workspace',
      type: 'productivity',
      status: googleConnected ? 'connected' : 'disconnected',
      icon: '📧',
    });

    // Check CRM data presence
    const { count: crmCompanies } = await supabase
      .from('crm_companies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    const { count: crmContacts } = await supabase
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    connections.push({
      id: 'crm',
      name: 'CRM Interne',
      type: 'crm',
      status: (crmCompanies || 0) + (crmContacts || 0) > 0 ? 'connected' : 'disconnected',
      metrics: { companies: crmCompanies || 0, contacts: crmContacts || 0 },
      icon: '👥',
    });

    // Check Workflows (ERP-like automation)
    const { data: workflows } = await supabase
      .from('workflows')
      .select('id, is_active')
      .eq('user_id', user?.id);

    const activeWorkflows = workflows?.filter(w => w.is_active).length || 0;
    connections.push({
      id: 'workflows',
      name: 'AETHER Flow (ERP)',
      type: 'erp',
      status: activeWorkflows > 0 ? 'connected' : 'disconnected',
      metrics: { active: activeWorkflows, total: workflows?.length || 0 },
      icon: '⚙️',
    });

    // Slack (check if configured in secrets - we'll assume based on workflow blocks)
    const { data: slackWorkflows } = await supabase
      .from('workflows')
      .select('blocks')
      .eq('user_id', user?.id);

    const hasSlack = slackWorkflows?.some(w => {
      const blocks = w.blocks as any[];
      return blocks?.some(b => b.type?.toLowerCase().includes('slack'));
    });

    connections.push({
      id: 'slack',
      name: 'Slack',
      type: 'communication',
      status: hasSlack ? 'partial' : 'disconnected',
      icon: '💬',
    });

    // Microsoft Teams (similar check)
    const hasTeams = slackWorkflows?.some(w => {
      const blocks = w.blocks as any[];
      return blocks?.some(b => b.type?.toLowerCase().includes('teams'));
    });

    connections.push({
      id: 'teams',
      name: 'Microsoft Teams',
      type: 'communication',
      status: hasTeams ? 'partial' : 'disconnected',
      icon: '📺',
    });

    return connections;
  }, [user?.id]);

  const fetchBusinessMetrics = useCallback(async (): Promise<BusinessMetric[]> => {
    if (!companyId) return [];

    const metrics: BusinessMetric[] = [];

    // Sales metrics
    const { data: deals } = await supabase
      .from('sales_deals')
      .select('value, status, probability')
      .eq('company_id', companyId);

    const activeDeals = deals?.filter(d => 
      !['won', 'lost', 'gagné', 'perdu'].includes((d.status || '').toString().toLowerCase())
    ) || [];
    const totalPipeline = activeDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
    const avgProbability = activeDeals.length > 0
      ? Math.round(activeDeals.reduce((s, d) => s + (d.probability || 0), 0) / activeDeals.length)
      : 0;

    metrics.push({
      id: 'pipeline',
      label: 'Pipeline Commercial',
      value: totalPipeline,
      source: 'Sales',
      category: 'sales',
    });

    metrics.push({
      id: 'deals_active',
      label: 'Deals en cours',
      value: activeDeals.length,
      source: 'Sales',
      category: 'sales',
    });

    metrics.push({
      id: 'win_probability',
      label: 'Probabilité moyenne',
      value: `${avgProbability}%`,
      source: 'Sales',
      category: 'sales',
    });

    // HR metrics
    const { count: candidatesCount } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Employees have is_active boolean, not status
    const { data: employeesData } = await supabase
      .from('employees')
      .select('id, is_active')
      .eq('company_id', companyId);
    
    const activeEmployees = employeesData?.filter(e => e.is_active === true).length || 0;

    metrics.push({
      id: 'employees',
      label: 'Employés actifs',
      value: activeEmployees,
      source: 'HR',
      category: 'hr',
    });

    metrics.push({
      id: 'candidates',
      label: 'Candidats en pipeline',
      value: candidatesCount || 0,
      source: 'HR',
      category: 'hr',
    });

    // Support metrics - filter by user_id since no company_id
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('status, priority')
      .eq('user_id', user?.id);

    const openTickets = tickets?.filter(t => 
      !['resolved', 'closed', 'résolu', 'fermé'].includes((t.status || '').toString().toLowerCase())
    ) || [];
    const criticalTickets = openTickets.filter(t => 
      ['critical', 'critique', 'urgent', 'high'].includes((t.priority || '').toString().toLowerCase())
    ).length;

    metrics.push({
      id: 'tickets_open',
      label: 'Tickets ouverts',
      value: openTickets.length,
      source: 'Support',
      category: 'support',
    });

    metrics.push({
      id: 'tickets_critical',
      label: 'Tickets critiques',
      value: criticalTickets,
      trend: criticalTickets > 0 ? -1 : 0,
      trendDirection: criticalTickets > 0 ? 'down' : 'stable',
      source: 'Support',
      category: 'support',
    });

    // Compliance metrics
    const { data: alerts } = await supabase
      .from('compliance_alerts')
      .select('is_resolved, severity')
      .eq('company_id', companyId);

    const unresolvedAlerts = alerts?.filter(a => !a.is_resolved) || [];
    const criticalAlerts = unresolvedAlerts.filter(a => 
      ['critical', 'high'].includes((a.severity || '').toLowerCase())
    ).length;

    metrics.push({
      id: 'compliance_alerts',
      label: 'Alertes conformité',
      value: unresolvedAlerts.length,
      source: 'Compliance',
      category: 'compliance',
    });

    if (criticalAlerts > 0) {
      metrics.push({
        id: 'compliance_critical',
        label: 'Alertes critiques',
        value: criticalAlerts,
        trend: -criticalAlerts,
        trendDirection: 'down',
        source: 'Compliance',
        category: 'compliance',
      });
    }

    return metrics;
  }, [companyId, user?.id]);

  const generateInsights = useCallback(async (
    connections: ConnectionStatus[],
    metrics: BusinessMetric[]
  ): Promise<StrategicInsight[]> => {
    const insights: StrategicInsight[] = [];

    // Connection insights
    const disconnectedCritical = connections.filter(c => 
      c.status === 'disconnected' && ['payment', 'crm', 'erp'].includes(c.type)
    );

    if (disconnectedCritical.length > 0) {
      insights.push({
        id: 'missing_connections',
        title: 'Intégrations manquantes',
        content: `${disconnectedCritical.length} intégration(s) critique(s) non configurée(s): ${disconnectedCritical.map(c => c.name).join(', ')}. Cela limite la visibilité sur vos opérations.`,
        priority: 'high',
        category: 'Infrastructure',
        actionable: true,
        suggestedAction: 'Configurer les intégrations dans Paramètres > Intégrations',
        createdAt: new Date().toISOString(),
      });
    }

    // Sales insights
    const pipelineMetric = metrics.find(m => m.id === 'pipeline');
    const dealsMetric = metrics.find(m => m.id === 'deals_active');
    if (pipelineMetric && typeof pipelineMetric.value === 'number') {
      if (pipelineMetric.value === 0) {
        insights.push({
          id: 'empty_pipeline',
          title: 'Pipeline commercial vide',
          content: 'Aucun deal actif dans le pipeline. Priorisez la prospection pour alimenter le funnel commercial.',
          priority: 'critical',
          category: 'Ventes',
          actionable: true,
          suggestedAction: 'Lancer une campagne de prospection via Sales Copilot',
          createdAt: new Date().toISOString(),
        });
      } else if (pipelineMetric.value > 1000000) {
        insights.push({
          id: 'strong_pipeline',
          title: 'Pipeline solide',
          content: `Pipeline de ${(pipelineMetric.value / 1000000).toFixed(1)}M€. Focus recommandé sur la conversion des deals avancés.`,
          priority: 'medium',
          category: 'Ventes',
          actionable: true,
          suggestedAction: 'Analyser les deals en phase de négociation',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Support insights
    const criticalTickets = metrics.find(m => m.id === 'tickets_critical');
    if (criticalTickets && typeof criticalTickets.value === 'number' && criticalTickets.value > 0) {
      insights.push({
        id: 'critical_tickets',
        title: 'Tickets critiques en attente',
        content: `${criticalTickets.value} ticket(s) critique(s) nécessitent une attention immédiate. Risque d'impact sur la satisfaction client.`,
        priority: 'critical',
        category: 'Support',
        actionable: true,
        suggestedAction: 'Traiter les tickets critiques en priorité',
        createdAt: new Date().toISOString(),
      });
    }

    // Compliance insights
    const complianceAlerts = metrics.find(m => m.id === 'compliance_alerts');
    if (complianceAlerts && typeof complianceAlerts.value === 'number' && complianceAlerts.value > 0) {
      insights.push({
        id: 'compliance_issues',
        title: 'Alertes conformité actives',
        content: `${complianceAlerts.value} alerte(s) de conformité non résolue(s). Risque réglementaire potentiel.`,
        priority: 'high',
        category: 'Conformité',
        actionable: true,
        suggestedAction: 'Consulter le module Compliance pour les détails',
        createdAt: new Date().toISOString(),
      });
    }

    // HR insights
    const candidates = metrics.find(m => m.id === 'candidates');
    const employees = metrics.find(m => m.id === 'employees');
    if (candidates && typeof candidates.value === 'number' && candidates.value > 10) {
      insights.push({
        id: 'hiring_active',
        title: 'Recrutement actif',
        content: `${candidates.value} candidats dans le pipeline. Assurez-vous de maintenir un suivi régulier pour ne pas perdre les meilleurs profils.`,
        priority: 'medium',
        category: 'RH',
        actionable: true,
        suggestedAction: 'Planifier les entretiens via HR Copilot',
        createdAt: new Date().toISOString(),
      });
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return insights;
  }, []);

  const calculateOverallHealth = useCallback((
    connections: ConnectionStatus[],
    metrics: BusinessMetric[],
    insights: StrategicInsight[]
  ): number => {
    let score = 100;

    // Connection penalties
    const connectedCount = connections.filter(c => c.status === 'connected').length;
    const connectionScore = (connectedCount / connections.length) * 30;
    score = 70 + connectionScore;

    // Critical issues penalties
    const criticalInsights = insights.filter(i => i.priority === 'critical').length;
    const highInsights = insights.filter(i => i.priority === 'high').length;
    score -= criticalInsights * 15;
    score -= highInsights * 5;

    // Positive factors
    const hasActiveDeals = metrics.some(m => m.id === 'deals_active' && (m.value as number) > 0);
    const hasEmployees = metrics.some(m => m.id === 'employees' && (m.value as number) > 0);
    if (hasActiveDeals) score += 5;
    if (hasEmployees) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, []);

  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const connections = await detectConnections();
      const metrics = await fetchBusinessMetrics();
      const insights = await generateInsights(connections, metrics);
      const overallHealth = calculateOverallHealth(connections, metrics, insights);

      setData({
        connections,
        metrics,
        insights,
        overallHealth,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching executive data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur de chargement',
      }));
    }
  }, [user?.id, detectConnections, fetchBusinessMetrics, generateInsights, calculateOverallHealth]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, refresh };
}
