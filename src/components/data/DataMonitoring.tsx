import { useDataPlatform } from '@/hooks/useDataPlatform';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle, XCircle, Clock, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  running: { label: 'En cours', color: 'bg-blue-500/10 text-blue-600', icon: Loader2, iconClass: 'animate-spin' },
  completed: { label: 'Terminé', color: 'bg-green-500/10 text-green-600', icon: CheckCircle, iconClass: '' },
  failed: { label: 'Échec', color: 'bg-red-500/10 text-red-600', icon: XCircle, iconClass: '' },
  cancelled: { label: 'Annulé', color: 'bg-muted text-muted-foreground', icon: AlertTriangle, iconClass: '' }
};

const DataMonitoring = () => {
  const { pipelineRuns, sources, stats, loading } = useDataPlatform();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const successRate = pipelineRuns.length > 0 
    ? Math.round((stats.successfulRuns / pipelineRuns.length) * 100) 
    : 0;

  const avgDuration = pipelineRuns.filter(r => r.duration_ms).reduce((sum, r) => sum + (r.duration_ms || 0), 0) / 
    Math.max(pipelineRuns.filter(r => r.duration_ms).length, 1);

  const totalRecordsProcessed = pipelineRuns.reduce((sum, r) => sum + r.records_processed, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{pipelineRuns.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Exécutions totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{successRate}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Taux de succès</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{Math.round(avgDuration / 1000)}s</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Durée moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalRecordsProcessed.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Records traités</p>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Santé des pipelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Taux de succès global</span>
              <span className={successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-orange-600' : 'text-red-600'}>
                {successRate}%
              </span>
            </div>
            <Progress value={successRate} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-green-500/10">
              <div className="text-lg font-bold text-green-600">{stats.successfulRuns}</div>
              <div className="text-xs text-muted-foreground">Succès</div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <div className="text-lg font-bold text-red-600">{stats.failedRuns}</div>
              <div className="text-xs text-muted-foreground">Échecs</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <div className="text-lg font-bold text-blue-600">
                {pipelineRuns.filter(r => r.status === 'running').length}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Pipeline Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Exécutions récentes</CardTitle>
          <CardDescription>Historique des synchronisations et pipelines</CardDescription>
        </CardHeader>
        <CardContent>
          {pipelineRuns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune exécution enregistrée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pipelineRuns.slice(0, 20).map(run => {
                const status = statusConfig[run.status];
                const StatusIcon = status.icon;
                const source = sources.find(s => s.id === run.source_id);
                return (
                  <div key={run.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${status.iconClass}`} />
                      <div>
                        <div className="font-medium">{run.pipeline_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {source?.name || 'Source inconnue'} • {run.records_processed.toLocaleString()} records
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <Badge className={status.color}>{status.label}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(run.started_at), { addSuffix: true, locale: fr })}
                        </div>
                      </div>
                      {run.duration_ms && (
                        <div className="text-sm text-muted-foreground">
                          {Math.round(run.duration_ms / 1000)}s
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMonitoring;
