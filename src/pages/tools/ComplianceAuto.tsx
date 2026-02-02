import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, AlertTriangle, CheckCircle, 
  Loader2, Sparkles, RefreshCw, FileText,
  AlertCircle, ChevronRight, ExternalLink,
  Database, Users, Building2, Leaf, Clock
} from "lucide-react";
import { useState } from "react";
import { useComplianceAuto, ComplianceIssue, ComplianceAlert, RegulatoryReference } from "@/hooks/useComplianceAuto";
import { ESGDashboard } from "@/components/compliance/ESGDashboard";
import { cn } from "@/lib/utils";
import { AgentTabs } from "@/components/agents/AgentTabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const severityConfig = {
  critical: { color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-500/10', label: 'Critique' },
  high: { color: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-500/10', label: 'Élevé' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-500/10', label: 'Moyen' },
  low: { color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-500/10', label: 'Faible' },
};

export default function Compliance() {
  const { 
    scans, 
    alerts, 
    regulations, 
    loading, 
    scanning, 
    runAutoScan, 
    resolveAlert,
    getStats 
  } = useComplianceAuto();
  
  const [viewMode, setViewMode] = useState<'dashboard' | 'alerts' | 'regulations' | 'esg'>('dashboard');
  const stats = getStats();
  const latestScan = scans.find(s => s.status === 'completed');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'alerts', label: `Alertes (${alerts.length})`, icon: AlertTriangle },
    { id: 'regulations', label: 'Référentiel RGPD', icon: FileText },
    { id: 'esg', label: 'ESG', icon: Leaf },
  ];

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return 'Non évalué';
    if (score >= 80) return 'Conforme';
    if (score >= 60) return 'Améliorations requises';
    return 'Non conforme';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-agent-compliance" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gradient-to-b from-background to-background/95 overflow-hidden">
        {/* Header avec tabs */}
        <header className="px-4 md:px-8 py-4 shrink-0">
          <div className="max-w-6xl mx-auto">
            <AgentTabs 
              tabs={tabs} 
              activeTab={viewMode} 
              onTabChange={(id) => setViewMode(id as typeof viewMode)}
              variant="pills"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            {viewMode === 'esg' ? (
              <ESGDashboard />
            ) : viewMode === 'regulations' ? (
              <RegulationsView regulations={regulations} />
            ) : viewMode === 'alerts' ? (
              <AlertsView alerts={alerts} onResolve={resolveAlert} />
            ) : (
              /* Dashboard principal */
              <div className="space-y-6">
                {/* Score principal + Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Score Card */}
                  <Card className="lg:col-span-2 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold">Score de conformité RGPD</h2>
                          <p className="text-sm text-muted-foreground">
                            Analyse automatique de vos données CRM/RH
                          </p>
                        </div>
                        <Button 
                          onClick={() => runAutoScan('full')}
                          disabled={scanning}
                          className="bg-agent-compliance hover:bg-agent-compliance/90"
                        >
                          {scanning ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyse...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Lancer un scan
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="none"
                              className="text-muted"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${(stats.latestScore || 0) * 3.52} 352`}
                              className={getScoreColor(stats.latestScore)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn("text-3xl font-bold", getScoreColor(stats.latestScore))}>
                              {stats.latestScore ?? '—'}
                            </span>
                            <span className="text-xs text-muted-foreground">/100</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              stats.latestScore === null ? 'bg-muted' :
                              stats.latestScore >= 80 ? 'bg-green-500/10 text-green-600' :
                              stats.latestScore >= 60 ? 'bg-yellow-500/10 text-yellow-600' :
                              'bg-red-500/10 text-red-600'
                            )}>
                              {getScoreLabel(stats.latestScore)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Records analysés</p>
                              <p className="text-xl font-semibold">{stats.recordsAnalyzed.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sources scannées</p>
                              <p className="text-xl font-semibold">{stats.dataSourcesCount}</p>
                            </div>
                          </div>

                          {latestScan?.completed_at && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Dernier scan : {format(new Date(latestScan.completed_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alertes résumé */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Alertes actives
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                        <span className="text-sm font-medium text-red-600">Critiques</span>
                        <span className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                        <span className="text-sm font-medium text-orange-600">Élevées</span>
                        <span className="text-2xl font-bold text-orange-600">{stats.highAlerts}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setViewMode('alerts')}
                      >
                        Voir toutes les alertes
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Problèmes détectés */}
                {latestScan?.findings && latestScan.findings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Problèmes détectés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(latestScan.findings as ComplianceIssue[]).slice(0, 5).map((issue, idx) => (
                          <IssueCard key={idx} issue={issue} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommandations */}
                {latestScan?.recommendations && latestScan.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-agent-compliance" />
                        Recommandations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {latestScan.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "p-4 rounded-lg border",
                              rec.priority === 'urgent' ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' :
                              rec.priority === 'high' ? 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20' :
                              'border-border bg-muted/30'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle className={cn(
                                "w-5 h-5 mt-0.5",
                                rec.priority === 'urgent' ? 'text-red-500' :
                                rec.priority === 'high' ? 'text-orange-500' :
                                'text-agent-compliance'
                              )} />
                              <div>
                                <p className="font-medium">{rec.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Empty state */}
                {!latestScan && (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Shield className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun scan effectué</h3>
                      <p className="text-muted-foreground mb-6">
                        Lancez votre premier scan automatique pour analyser vos données CRM/RH
                      </p>
                      <Button 
                        onClick={() => runAutoScan('full')}
                        disabled={scanning}
                        className="bg-agent-compliance hover:bg-agent-compliance/90"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Lancer le scan de conformité
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Composant pour afficher un problème
function IssueCard({ issue }: { issue: ComplianceIssue }) {
  const severity = severityConfig[issue.severity];
  
  return (
    <div className={cn("p-4 rounded-lg border", severity.bg)}>
      <div className="flex items-start gap-3">
        <AlertCircle className={cn("w-5 h-5 mt-0.5", severity.text)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{issue.title}</span>
            <Badge variant="outline" className={cn("text-xs", severity.text)}>
              {severity.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              {issue.table}
            </span>
            <span>{issue.rgpdReference}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vue des alertes
function AlertsView({ alerts, onResolve }: { alerts: ComplianceAlert[]; onResolve: (id: string) => void }) {
  if (alerts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune alerte active</h3>
          <p className="text-muted-foreground">
            Toutes les alertes de conformité ont été résolues
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        const severity = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.medium;
        return (
          <Card key={alert.id} className={severity.bg}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={cn("w-5 h-5 mt-0.5", severity.text)} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <Badge variant="outline" className={cn("text-xs", severity.text)}>
                        {severity.label}
                      </Badge>
                    </div>
                    {alert.description && (
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {alert.affected_table && (
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {alert.affected_table}
                        </span>
                      )}
                      {alert.regulation_reference && (
                        <span>{alert.regulation_reference}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onResolve(alert.id)}
                >
                  Résoudre
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Vue des réglementations
function RegulationsView({ regulations }: { regulations: RegulatoryReference[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Référentiel RGPD</h2>
          <p className="text-sm text-muted-foreground">
            Articles clés du Règlement Général sur la Protection des Données
          </p>
        </div>
        <a 
          href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-agent-compliance hover:underline flex items-center gap-1"
        >
          Texte officiel EUR-Lex
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid gap-4">
        {regulations.map(reg => (
          <Card key={reg.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-agent-compliance/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-agent-compliance">
                    {reg.article_code.replace('art_', 'Art. ')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{reg.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{reg.content}</p>
                  {reg.metadata?.requirements && (
                    <div className="flex flex-wrap gap-2">
                      {reg.metadata.requirements.map((req, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
