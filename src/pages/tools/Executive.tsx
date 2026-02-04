import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, Crown, LayoutDashboard, Brain, Bell, 
  Plug, Beaker, Radar, AlertTriangle, TrendingUp
} from 'lucide-react';
import { useExecutiveInsights } from '@/hooks/useExecutiveInsights';
import { HealthGauge } from '@/components/executive/HealthGauge';
import { ExecutiveDashboard } from '@/components/executive/ExecutiveDashboard';
import { StrategicAdvisor } from '@/components/executive/StrategicAdvisor';
import { ExecutiveAlertsPanel } from '@/components/executive/ExecutiveAlertsPanel';
import { IntegrationHub } from '@/components/executive/IntegrationHub';
import { StrategicSimulator } from '@/components/executive/StrategicSimulator';
import { StrategicIntelligencePanel } from '@/components/executive/StrategicIntelligencePanel';
import { PredictiveIntelligencePanel } from '@/components/executive/PredictiveIntelligencePanel';

export default function Executive() {
  const { connections, metrics, insights, overallHealth, loading, error, refresh } = useExecutiveInsights();
  const [activeTab, setActiveTab] = useState('predictive');

  const criticalCount = insights.filter(i => i.priority === 'critical').length;
  const highCount = insights.filter(i => i.priority === 'high').length;
  const connectedCount = connections.filter(c => c.status === 'connected').length;

  // Prepare internal metrics for intelligence correlation
  const internalMetrics = {
    pipeline: metrics.find(m => m.id === 'pipeline')?.value,
    activeDeals: metrics.find(m => m.id === 'deals_active')?.value,
    employees: metrics.find(m => m.id === 'employees')?.value,
    openTickets: metrics.find(m => m.id === 'tickets_open')?.value,
    complianceAlerts: metrics.find(m => m.id === 'compliance_alerts')?.value,
  };

  return (
    <DashboardLayout
      headerActions={
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              {criticalCount} alerte(s)
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            Actualiser
          </Button>
        </div>
      }
    >
      <div className="h-full flex flex-col">
        {/* Hero Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 via-background to-background">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AETHER Executive</h1>
                <p className="text-muted-foreground text-sm">
                  Conseiller stratégique IA • Veille temps réel • Niveau CAC 40
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 pr-6 border-r">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{connectedCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Intégrations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">KPIs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">{highCount + criticalCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Alertes</div>
                </div>
              </div>

              {/* Health Gauge */}
              {loading ? (
                <Skeleton className="w-20 h-20 rounded-full" />
              ) : (
                <HealthGauge value={overallHealth} size="sm" />
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
            <TabsList className="h-12 bg-transparent p-0 gap-1">
              <TabsTrigger 
                value="predictive" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <TrendingUp className="w-4 h-4" />
                Prédictif
              </TabsTrigger>
              <TabsTrigger 
                value="intelligence" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <Radar className="w-4 h-4" />
                Veille
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="advisor" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <Brain className="w-4 h-4" />
                Conseiller IA
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none relative"
              >
                <Bell className="w-4 h-4" />
                Alertes
                {criticalCount + highCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                    {criticalCount + highCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <Plug className="w-4 h-4" />
                Intégrations
              </TabsTrigger>
              <TabsTrigger 
                value="simulator" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:shadow-none"
              >
                <Beaker className="w-4 h-4" />
                Simulateur
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-destructive bg-destructive/10">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="predictive" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
                  <PredictiveIntelligencePanel />
                  <StrategicSimulator />
                </div>
              </TabsContent>

              <TabsContent value="intelligence" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
                  <StrategicIntelligencePanel 
                    sector="technologie"
                    internalMetrics={internalMetrics}
                  />
                  <ExecutiveAlertsPanel insights={insights} />
                </div>
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0">
                {loading ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                      ))}
                    </div>
                    <Skeleton className="h-64" />
                    <Skeleton className="h-48" />
                  </div>
                ) : (
                  <ExecutiveDashboard metrics={metrics} />
                )}
              </TabsContent>

              <TabsContent value="advisor" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
                  <StrategicAdvisor />
                  <StrategicSimulator />
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-0">
                <div className="h-[calc(100vh-280px)]">
                  <ExecutiveAlertsPanel insights={insights} />
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <div className="h-[calc(100vh-280px)]">
                  <IntegrationHub 
                    connections={connections} 
                    onRefresh={refresh}
                    loading={loading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="simulator" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
                  <StrategicSimulator />
                  <PredictiveIntelligencePanel />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
