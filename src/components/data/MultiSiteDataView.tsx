import { useState } from 'react';
import { useDataPlatform, DataSource } from '@/hooks/useDataPlatform';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, MapPin, Database, RefreshCw, CheckCircle2,
  AlertTriangle, Globe, Layers, ArrowRight,
  Cloud, Server, Wifi, WifiOff, Activity, BarChart3, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { 
    label: 'Actif', 
    color: 'bg-success/10 text-success border-success/20', 
    icon: Wifi,
    dotColor: 'bg-success'
  },
  syncing: { 
    label: 'Sync...', 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', 
    icon: RefreshCw,
    dotColor: 'bg-blue-500'
  },
  inactive: { 
    label: 'Inactif', 
    color: 'bg-muted text-muted-foreground border-border', 
    icon: WifiOff,
    dotColor: 'bg-muted-foreground'
  },
  error: { 
    label: 'Erreur', 
    color: 'bg-destructive/10 text-destructive border-destructive/20', 
    icon: AlertTriangle,
    dotColor: 'bg-destructive'
  },
};

export function MultiSiteDataView() {
  const { sources, catalog, stats, loading, syncSource } = useDataPlatform();
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  const totalRecords = stats.totalRecords;
  const activeSources = stats.activeSources;
  const avgQuality = stats.avgQualityScore;
  const totalDatasets = stats.totalDatasets;

  // Empty state
  if (!loading && sources.length === 0) {
    return (
      <div className="space-y-6">
        {/* Aggregated Stats - All zeros */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-agent-data/10 to-agent-data/5 border-agent-data/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-agent-data/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-agent-data" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Sources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0/0</p>
                  <p className="text-xs text-muted-foreground">Connectées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Datasets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-agent-data/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-agent-data/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-agent-data" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Qualité</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State Card */}
        <Card className="overflow-hidden">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-agent-data/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-agent-data" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune source de données</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Configurez vos sources de données pour commencer à centraliser et gouverner vos données multi-sites.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une source
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-agent-data/10 to-agent-data/5 border-agent-data/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-data/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-agent-data" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.length}</p>
                <p className="text-xs text-muted-foreground">Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSources}/{sources.length}</p>
                <p className="text-xs text-muted-foreground">Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalRecords >= 1000000 
                    ? `${(totalRecords / 1000000).toFixed(1)}M` 
                    : totalRecords >= 1000 
                      ? `${(totalRecords / 1000).toFixed(0)}k`
                      : totalRecords
                  }
                </p>
                <p className="text-xs text-muted-foreground">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDatasets}</p>
                <p className="text-xs text-muted-foreground">Datasets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-agent-data/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-data/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-agent-data" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgQuality > 0 ? `${avgQuality}%` : '-'}</p>
                <p className="text-xs text-muted-foreground">Qualité moy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Hub */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agent-data to-agent-data/60 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Hub de données centralisé</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Agrégation de {sources.length} source{sources.length > 1 ? 's' : ''} de données
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sources.map((source) => {
              const status = statusConfig[source.status] || statusConfig.inactive;
              const StatusIcon = status.icon;
              
              return (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(selectedSource?.id === source.id ? null : source)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                    selectedSource?.id === source.id 
                      ? "border-agent-data ring-2 ring-agent-data/20 bg-agent-data/5" 
                      : "border-border/50 hover:border-agent-data/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-agent-data" />
                      <div className={cn("w-2 h-2 rounded-full", status.dotColor)} />
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", status.color)}>
                      <StatusIcon className={cn("w-3 h-3 mr-1", source.status === 'syncing' && "animate-spin")} />
                      {status.label}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-sm text-foreground truncate">{source.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 capitalize">{source.connector}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Records</span>
                      <span className="font-medium">{source.records_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fréquence</span>
                      <span className="font-medium capitalize">{source.sync_frequency}</span>
                    </div>
                  </div>
                  
                  {source.last_sync_at && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Dernière sync: {new Date(source.last_sync_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Source Details */}
          {selectedSource && (
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-agent-data" />
                  <div>
                    <h3 className="font-semibold">{selectedSource.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{selectedSource.connector} • {selectedSource.source_type}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => syncSource(selectedSource.id)}
                  disabled={selectedSource.status === 'syncing'}
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", selectedSource.status === 'syncing' && "animate-spin")} />
                  Synchroniser
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-background border border-border/50">
                  <p className="text-xs text-muted-foreground">Records</p>
                  <p className="text-lg font-semibold">{selectedSource.records_count.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border/50">
                  <p className="text-xs text-muted-foreground">Fréquence</p>
                  <p className="text-lg font-semibold capitalize">{selectedSource.sync_frequency}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border/50">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold capitalize">{selectedSource.source_type}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border/50">
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <Badge variant="outline" className={statusConfig[selectedSource.status]?.color}>
                    {statusConfig[selectedSource.status]?.label}
                  </Badge>
                </div>
              </div>
              
              {selectedSource.error_message && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{selectedSource.error_message}</p>
                </div>
              )}
            </div>
          )}

          {/* Data Flow Indicator */}
          <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-xl bg-gradient-to-r from-agent-data/5 via-primary/5 to-agent-data/5 border border-agent-data/20">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-agent-data" />
              <span className="text-sm font-medium">{sources.length} Source{sources.length > 1 ? 's' : ''}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Hub Central</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-agent-data" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
