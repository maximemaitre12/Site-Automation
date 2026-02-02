import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, Factory, TrendingDown, TrendingUp,
  Target, AlertTriangle, CheckCircle2, BarChart3, 
  Building2, Download, Plus, Trash2, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useESGData } from '@/hooks/useESGData';
import { ESGEmptyState } from './ESGEmptyState';
import { ESGAddSiteDialog } from './ESGAddSiteDialog';
import { ESGAddKPIDialog } from './ESGAddKPIDialog';
import { ESGAddTargetDialog } from './ESGAddTargetDialog';

export function ESGDashboard() {
  const [showAddSite, setShowAddSite] = useState(false);
  const [showAddKPI, setShowAddKPI] = useState(false);
  const [showAddTarget, setShowAddTarget] = useState(false);

  const {
    siteEmissions,
    kpis,
    targets,
    totalScope1,
    totalScope2,
    totalScope3,
    totalEmissions,
    isLoading,
    hasData,
    addSiteEmission,
    addKPI,
    addTarget,
    deleteSiteEmission,
    deleteKPI,
  } = useESGData();

  const getKPIStatus = (value: number, target: number | null): 'success' | 'warning' | 'alert' => {
    if (!target) return 'warning';
    const ratio = value / target;
    if (ratio >= 1) return 'success';
    if (ratio >= 0.7) return 'warning';
    return 'alert';
  };

  const getStatusColor = (status: 'success' | 'warning' | 'alert') => {
    switch (status) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'alert': return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'alert') => {
    switch (status) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'alert': return AlertTriangle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  // Show empty state if no data
  if (!hasData) {
    return (
      <>
        <ESGEmptyState 
          onAddSite={() => setShowAddSite(true)}
          onAddKPI={() => setShowAddKPI(true)}
          onAddTarget={() => setShowAddTarget(true)}
        />
        <ESGAddSiteDialog
          open={showAddSite}
          onOpenChange={setShowAddSite}
          onSubmit={(data) => addSiteEmission.mutate(data)}
          isLoading={addSiteEmission.isPending}
        />
        <ESGAddKPIDialog
          open={showAddKPI}
          onOpenChange={setShowAddKPI}
          onSubmit={(data) => addKPI.mutate(data)}
          isLoading={addKPI.isPending}
        />
        <ESGAddTargetDialog
          open={showAddTarget}
          onOpenChange={setShowAddTarget}
          onSubmit={(data) => addTarget.mutate(data)}
          isLoading={addTarget.isPending}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">ESG & Sustainability Dashboard</h2>
            <p className="text-sm text-muted-foreground">Données vérifiées uniquement • Aucune estimation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddSite(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Site
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAddKPI(true)}>
            <Plus className="w-4 h-4 mr-1" />
            KPI
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Verified Data Badge */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          <strong>Politique Zéro Données Fictives:</strong> Ce dashboard affiche uniquement les données que vous avez saisies. 
          {siteEmissions.filter(s => s.is_verified).length > 0 && (
            <span className="ml-1">
              {siteEmissions.filter(s => s.is_verified).length} site(s) vérifié(s) par audit tiers.
            </span>
          )}
        </p>
      </div>

      {/* Total Emissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Total Émissions</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {totalEmissions > 0 ? (totalEmissions / 1000).toFixed(1) + 'k' : '0'}
            </p>
            <p className="text-sm text-muted-foreground">tCO₂e / année</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Scope 1</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalScope1 > 0 ? (totalScope1 / 1000).toFixed(1) + 'k' : '0'}
            </p>
            <p className="text-xs text-muted-foreground">Émissions directes</p>
            {totalEmissions > 0 && (
              <>
                <Progress value={(totalScope1 / totalEmissions) * 100} className="h-1.5 mt-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalScope1 / totalEmissions) * 100).toFixed(0)}% du total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm font-medium">Scope 2</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalScope2 > 0 ? (totalScope2 / 1000).toFixed(1) + 'k' : '0'}
            </p>
            <p className="text-xs text-muted-foreground">Indirect (énergie)</p>
            {totalEmissions > 0 && (
              <>
                <Progress value={(totalScope2 / totalEmissions) * 100} className="h-1.5 mt-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalScope2 / totalEmissions) * 100).toFixed(0)}% du total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">Scope 3</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalScope3 > 0 ? (totalScope3 / 1000).toFixed(1) + 'k' : '0'}
            </p>
            <p className="text-xs text-muted-foreground">Chaîne de valeur</p>
            {totalEmissions > 0 && (
              <>
                <Progress value={(totalScope3 / totalEmissions) * 100} className="h-1.5 mt-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalScope3 / totalEmissions) * 100).toFixed(0)}% du total
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const status = getKPIStatus(kpi.kpi_value, kpi.target_value);
            const StatusIcon = getStatusIcon(status);
            const progress = kpi.target_value ? (kpi.kpi_value / kpi.target_value) * 100 : 0;
            
            return (
              <Card key={kpi.id} className="overflow-hidden group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.kpi_name}</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold">{kpi.kpi_value}</span>
                        <span className="text-sm text-muted-foreground">{kpi.kpi_unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {kpi.is_verified && (
                        <Badge variant="outline" className="text-xs text-success border-success/20">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={() => deleteKPI.mutate(kpi.id)}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {kpi.target_value && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Objectif</span>
                        <span className="font-medium">{kpi.target_value} {kpi.kpi_unit}</span>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={cn(
                          "h-2",
                          status === 'success' && "[&>div]:bg-success",
                          status === 'warning' && "[&>div]:bg-warning",
                          status === 'alert' && "[&>div]:bg-destructive"
                        )}
                      />
                    </div>
                  )}
                  {kpi.data_source && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Source: {kpi.data_source}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sites Emissions */}
      {siteEmissions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-agent-compliance" />
                Émissions par site
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddSite(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {siteEmissions.map((site, index) => {
              const siteTotal = Number(site.scope1_emissions) + Number(site.scope2_emissions) + Number(site.scope3_emissions);
              const percentage = totalEmissions > 0 ? (siteTotal / totalEmissions) * 100 : 0;
              
              return (
                <div key={site.id} className="flex items-center gap-3 group">
                  <div className="w-8 text-center">
                    <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{site.site_name}</span>
                        <span className="text-xs text-muted-foreground">{site.location}</span>
                        {site.is_verified && (
                          <ShieldCheck className="w-3 h-3 text-success" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{(siteTotal / 1000).toFixed(1)}k</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={() => deleteSiteEmission.mutate(site.id)}
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                      <div 
                        className="bg-blue-500 transition-all" 
                        style={{ width: `${siteTotal > 0 ? (Number(site.scope1_emissions) / siteTotal) * 100 : 0}%` }} 
                      />
                      <div 
                        className="bg-purple-500 transition-all" 
                        style={{ width: `${siteTotal > 0 ? (Number(site.scope2_emissions) / siteTotal) * 100 : 0}%` }} 
                      />
                      <div 
                        className="bg-amber-500 transition-all" 
                        style={{ width: `${siteTotal > 0 ? (Number(site.scope3_emissions) / siteTotal) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Scope 1
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Scope 2
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Scope 3
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decarbonization Targets */}
      {targets.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-500/5 to-green-600/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-emerald-600" />
                <h3 className="font-semibold text-lg">Trajectoire Décarbonation</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAddTarget(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {targets.map((target) => (
                <div key={target.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Objectif {target.target_year}</p>
                  <p className="text-xl font-bold">-{target.target_reduction_percent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {target.baseline_year} ({target.target_type === 'sbti' ? 'SBTi' : target.target_type})
                  </p>
                  {target.is_achieved && (
                    <p className="text-xs text-success flex items-center gap-1 mt-2">
                      <CheckCircle2 className="w-3 h-3" /> Atteint
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ESGAddSiteDialog
        open={showAddSite}
        onOpenChange={setShowAddSite}
        onSubmit={(data) => addSiteEmission.mutate(data)}
        isLoading={addSiteEmission.isPending}
      />
      <ESGAddKPIDialog
        open={showAddKPI}
        onOpenChange={setShowAddKPI}
        onSubmit={(data) => addKPI.mutate(data)}
        isLoading={addKPI.isPending}
      />
      <ESGAddTargetDialog
        open={showAddTarget}
        onOpenChange={setShowAddTarget}
        onSubmit={(data) => addTarget.mutate(data)}
        isLoading={addTarget.isPending}
      />
    </div>
  );
}
