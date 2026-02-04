import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Crown, Briefcase, TrendingUp, AlertTriangle } from 'lucide-react';
import { useExecutiveInsights } from '@/hooks/useExecutiveInsights';
import { ConnectionsGrid } from '@/components/executive/ConnectionsGrid';
import { BusinessMetricsPanel } from '@/components/executive/BusinessMetricsPanel';
import { StrategicInsightsPanel } from '@/components/executive/StrategicInsightsPanel';
import { HealthGauge } from '@/components/executive/HealthGauge';
import { ExecutiveAdvisor } from '@/components/executive/ExecutiveAdvisor';

export default function Executive() {
  const { connections, metrics, insights, overallHealth, loading, error, refresh } = useExecutiveInsights();

  const criticalCount = insights.filter(i => i.priority === 'critical').length;
  const highCount = insights.filter(i => i.priority === 'high').length;

  return (
    <DashboardLayout
      headerActions={
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
      }
    >
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header with Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main title card */}
          <Card className="lg:col-span-3 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-2xl font-bold">Assistant de Direction</h1>
                      <p className="text-muted-foreground">
                        Vue consolidée de votre entreprise
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {criticalCount > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {criticalCount} alerte(s) critique(s)
                      </Badge>
                    )}
                    {highCount > 0 && (
                      <Badge variant="secondary" className="gap-1 bg-amber-500/20 text-amber-700">
                        {highCount} point(s) d'attention
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="w-3 h-3" />
                      {connections.filter(c => c.status === 'connected').length}/{connections.length} intégrations
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {metrics.length} métriques
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Gauge */}
          <Card className="flex items-center justify-center">
            <CardContent className="py-6">
              {loading ? (
                <Skeleton className="w-[120px] h-[120px] rounded-full" />
              ) : (
                <HealthGauge value={overallHealth} size="md" />
              )}
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Connections Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <ConnectionsGrid connections={connections} />
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Metrics and Insights */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-48" />
              </>
            ) : (
              <>
                <BusinessMetricsPanel metrics={metrics} />
                <StrategicInsightsPanel insights={insights} />
              </>
            )}
          </div>

          {/* Right column - AI Advisor */}
          <div className="lg:col-span-1">
            <ExecutiveAdvisor />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
