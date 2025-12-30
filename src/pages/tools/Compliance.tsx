import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, AlertTriangle, CheckCircle, FileText, 
  Loader2, Sparkles, Cookie, Database, Lock, FileCheck,
  ChevronRight, Trash2, Eye, ShieldCheck, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useCompliance, Audit } from "@/hooks/useCompliance";
import { ReportDialog } from "@/components/compliance/ReportDialog";
import { cn } from "@/lib/utils";
import { AgentTabs } from "@/components/agents/AgentTabs";

const auditTypes = [
  { 
    value: 'gdpr', 
    label: 'RGPD Complet', 
    description: 'Audit de conformité au Règlement Général sur la Protection des Données',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    value: 'privacy', 
    label: 'Politique de confidentialité', 
    description: 'Analyse de votre politique de vie privée',
    icon: Lock,
    color: 'from-violet-500 to-purple-500'
  },
  { 
    value: 'data_processing', 
    label: 'Traitement des données', 
    description: 'Audit de vos processus de traitement',
    icon: Database,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    value: 'cookies', 
    label: 'Cookies & Traceurs', 
    description: 'Conformité de votre gestion des cookies',
    icon: Cookie,
    color: 'from-amber-500 to-orange-500'
  },
];

export default function Compliance() {
  const { audits, loading, analyzing, runAudit, deleteAudit, generateReport, getStats } = useCompliance();
  
  const [auditType, setAuditType] = useState('gdpr');
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [viewMode, setViewMode] = useState<'new' | 'history'>('new');

  const stats = getStats();

  const handleRunAudit = async () => {
    if (!inputText.trim()) return;
    const result = await runAudit(auditType, inputText, title || undefined);
    if (result) {
      setSelectedAudit(result);
      setInputText('');
      setTitle('');
      setViewMode('history');
    }
  };

  const handleGenerateReport = async (auditId: string) => {
    const audit = audits.find(a => a.id === auditId);
    if (!audit) return;
    
    setSelectedAudit(audit);
    setReportDialogOpen(true);
    setGeneratingReport(true);
    
    const reportContent = await generateReport(auditId);
    setReport(reportContent);
    setGeneratingReport(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const tabs = [
    { id: 'new', label: 'Nouvel audit', icon: Sparkles },
    { id: 'history', label: `Historique (${audits.length})`, icon: FileCheck },
  ];

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
        {/* Modern Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 shrink-0">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-agent-compliance/20 to-agent-compliance/5 border border-agent-compliance/20 flex items-center justify-center shrink-0 shadow-lg shadow-agent-compliance/10">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-agent-compliance" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">Compliance Agent</h1>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-agent-compliance/10 text-agent-compliance text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Audit RGPD
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5 hidden md:block">
                  Analyse automatisée de conformité réglementaire
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-compliance/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-compliance/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-agent-compliance" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Audits</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-success/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold", stats.avgScore >= 70 ? "text-success" : "text-warning")}>
                      {stats.avgScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Score moyen</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-destructive/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{stats.highRiskCount}</p>
                    <p className="text-xs text-muted-foreground">Risques</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <AgentTabs 
              tabs={tabs} 
              activeTab={viewMode} 
              onTabChange={(id) => setViewMode(id as 'new' | 'history')}
              variant="pills"
            />
          </div>
        </header>

        {/* Main Content */}
        <ScrollArea className="flex-1 px-4 md:px-8">
          <div className="max-w-5xl mx-auto pb-8">
            {viewMode === 'new' ? (
              <div className="space-y-6">
                {/* Type selection cards */}
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">Type d'audit</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {auditTypes.map(type => {
                      const Icon = type.icon;
                      const isSelected = auditType === type.value;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setAuditType(type.value)}
                          className={cn(
                            "group p-4 rounded-2xl border-2 text-left transition-all",
                            isSelected 
                              ? "border-agent-compliance bg-agent-compliance/5 shadow-lg shadow-agent-compliance/10" 
                              : "border-border/50 hover:border-agent-compliance/30 hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                              type.color
                            )}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground">{type.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{type.description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-agent-compliance shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title input */}
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">Titre (optionnel)</h2>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Audit site e-commerce Q1 2025"
                    className="h-11 rounded-xl bg-card/50 border-border/50"
                  />
                </div>

                {/* Content textarea */}
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">Contenu à analyser</h2>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Collez votre politique de confidentialité, CGU, description de processus de traitement des données, ou tout texte à auditer pour la conformité RGPD..."
                    className="min-h-[200px] resize-none rounded-xl bg-card/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {inputText.length} caractères • Recommandé: 500+ caractères pour une analyse détaillée
                  </p>
                </div>

                {/* Submit button */}
                <Button 
                  onClick={handleRunAudit} 
                  disabled={analyzing || !inputText.trim()}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-agent-compliance to-agent-compliance/80 hover:from-agent-compliance/90 hover:to-agent-compliance/70 shadow-lg shadow-agent-compliance/20"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyse IA en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Lancer l'audit de conformité
                    </>
                  )}
                </Button>

                {/* Tips */}
                <Card className="bg-card/50 border-border/50 rounded-2xl">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-agent-compliance" />
                      Conseils pour un audit efficace
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-agent-compliance shrink-0" />
                        <span>Incluez le texte complet de votre politique</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-agent-compliance shrink-0" />
                        <span>Décrivez les flux de données en détail</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-agent-compliance shrink-0" />
                        <span>Mentionnez les tiers et sous-traitants</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-agent-compliance shrink-0" />
                        <span>Précisez les durées de conservation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                {audits.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Aucun audit réalisé</h3>
                    <p className="text-muted-foreground mb-4">Lancez votre premier audit de conformité RGPD</p>
                    <Button onClick={() => setViewMode('new')} className="bg-agent-compliance hover:bg-agent-compliance/90 rounded-xl">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer un audit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {audits.map(audit => {
                      const score = audit.compliance_score || 0;
                      const riskCount = audit.risks?.length || 0;
                      const highRisks = audit.risks?.filter(r => r.severity === 'high' || r.severity === 'critical').length || 0;
                      
                      return (
                        <Card key={audit.id} className="overflow-hidden rounded-2xl border-border/50 hover:border-agent-compliance/30 hover:shadow-lg transition-all group">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              {/* Score indicator */}
                              <div className={cn(
                                "w-full sm:w-24 flex flex-row sm:flex-col items-center justify-center p-4 gap-3 sm:gap-1",
                                score >= 80 ? "bg-success/10" : score >= 60 ? "bg-warning/10" : "bg-destructive/10"
                              )}>
                                <span className={cn("text-3xl font-bold", getScoreColor(score))}>
                                  {score}
                                </span>
                                <span className="text-xs text-muted-foreground">/ 100</span>
                                <Progress 
                                  value={score} 
                                  className="h-1.5 mt-0 sm:mt-2 w-20 sm:w-full"
                                />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">{audit.title}</h3>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <Badge variant="secondary" className="text-xs rounded-full">
                                        {auditTypes.find(t => t.value === audit.audit_type)?.label || audit.audit_type}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(audit.created_at).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleGenerateReport(audit.id)}
                                      className="h-8 px-3 rounded-lg"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      Rapport
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => deleteAudit(audit.id)}
                                      className="h-8 px-2 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Risks summary */}
                                <div className="flex items-center gap-4 mt-3 flex-wrap">
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <AlertTriangle className={cn(
                                      "w-4 h-4",
                                      highRisks > 0 ? "text-destructive" : "text-muted-foreground"
                                    )} />
                                    <span className="text-muted-foreground">
                                      {riskCount} risque{riskCount !== 1 ? 's' : ''} 
                                      {highRisks > 0 && <span className="text-destructive font-medium"> ({highRisks} critique{highRisks !== 1 ? 's' : ''})</span>}
                                    </span>
                                  </div>
                                  {audit.recommendations && audit.recommendations.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-sm">
                                      <CheckCircle className="w-4 h-4 text-agent-compliance" />
                                      <span className="text-muted-foreground">
                                        {audit.recommendations.length} recommandation{audit.recommendations.length !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          report={report}
          loading={generatingReport}
        />
      </div>
    </DashboardLayout>
  );
}
