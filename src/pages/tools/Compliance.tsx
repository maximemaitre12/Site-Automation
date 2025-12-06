import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, AlertTriangle, CheckCircle, TrendingUp, FileText, 
  Loader2, Sparkles, Cookie, Database, Lock, FileCheck,
  ChevronRight, Trash2, Eye
} from "lucide-react";
import { useState } from "react";
import { useCompliance, Audit } from "@/hooks/useCompliance";
import { ReportDialog } from "@/components/compliance/ReportDialog";
import { cn } from "@/lib/utils";

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
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-background">
        {/* Header compact */}
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AETHER Compliance</h1>
              <p className="text-sm text-muted-foreground">Audit RGPD automatisé</p>
            </div>
          </div>
          
          {/* Stats mini */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Audits</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className={cn("text-2xl font-bold", stats.avgScore >= 70 ? "text-green-500" : "text-yellow-500")}>
                {stats.avgScore}%
              </p>
              <p className="text-xs text-muted-foreground">Score moyen</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.highRiskCount}</p>
              <p className="text-xs text-muted-foreground">Risques</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-border flex gap-2">
          <Button 
            variant={viewMode === 'new' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('new')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Nouvel audit
          </Button>
          <Button 
            variant={viewMode === 'history' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('history')}
          >
            <FileCheck className="w-4 h-4 mr-2" />
            Historique ({audits.length})
          </Button>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          {viewMode === 'new' ? (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
              {/* Type selection cards */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Type d'audit</h2>
                <div className="grid grid-cols-2 gap-3">
                  {auditTypes.map(type => {
                    const Icon = type.icon;
                    const isSelected = auditType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setAuditType(type.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            type.color
                          )}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{type.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-primary" />
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
                  className="h-11"
                />
              </div>

              {/* Content textarea */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Contenu à analyser</h2>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Collez votre politique de confidentialité, CGU, description de processus de traitement des données, ou tout texte à auditer pour la conformité RGPD..."
                  className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {inputText.length} caractères • Recommandé: 500+ caractères pour une analyse détaillée
                </p>
              </div>

              {/* Submit button */}
              <Button 
                onClick={handleRunAudit} 
                disabled={analyzing || !inputText.trim()}
                className="w-full h-12 text-base"
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
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Conseils pour un audit efficace
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                      <span>Incluez le texte complet de votre politique</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                      <span>Décrivez les flux de données en détail</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                      <span>Mentionnez les tiers et sous-traitants</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                      <span>Précisez les durées de conservation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-6 max-w-5xl mx-auto">
              {audits.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun audit réalisé</h3>
                  <p className="text-muted-foreground mb-4">Lancez votre premier audit de conformité RGPD</p>
                  <Button onClick={() => setViewMode('new')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Créer un audit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {audits.map(audit => {
                    const score = audit.compliance_score || 0;
                    const riskCount = audit.risks?.length || 0;
                    const highRisks = audit.risks?.filter(r => r.severity === 'high' || r.severity === 'critical').length || 0;
                    
                    return (
                      <Card key={audit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Score indicator */}
                            <div className={cn(
                              "w-24 flex flex-col items-center justify-center p-4",
                              score >= 80 ? "bg-green-500/10" : score >= 60 ? "bg-yellow-500/10" : "bg-red-500/10"
                            )}>
                              <span className={cn("text-3xl font-bold", getScoreColor(score))}>
                                {score}
                              </span>
                              <span className="text-xs text-muted-foreground">/ 100</span>
                              <Progress 
                                value={score} 
                                className="h-1.5 mt-2 w-full"
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground">{audit.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {auditTypes.find(t => t.value === audit.audit_type)?.label || audit.audit_type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(audit.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleGenerateReport(audit.id)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Rapport
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteAudit(audit.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Risks summary */}
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-sm">
                                  <AlertTriangle className={cn(
                                    "w-4 h-4",
                                    highRisks > 0 ? "text-red-500" : "text-muted-foreground"
                                  )} />
                                  <span className="text-muted-foreground">
                                    {riskCount} risque{riskCount > 1 ? 's' : ''} identifié{riskCount > 1 ? 's' : ''}
                                  </span>
                                  {highRisks > 0 && (
                                    <Badge variant="destructive" className="text-xs ml-1">
                                      {highRisks} critique{highRisks > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-muted-foreground">
                                    {audit.recommendations?.length || 0} recommandation{(audit.recommendations?.length || 0) > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Risk badges */}
                              {audit.risks && audit.risks.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {audit.risks.slice(0, 4).map((risk, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        risk.severity === 'critical' && "border-red-500 text-red-600",
                                        risk.severity === 'high' && "border-orange-500 text-orange-600",
                                        risk.severity === 'medium' && "border-yellow-500 text-yellow-600",
                                        risk.severity === 'low' && "border-blue-500 text-blue-600"
                                      )}
                                    >
                                      {risk.category}
                                    </Badge>
                                  ))}
                                  {audit.risks.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{audit.risks.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              )}
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
        </ScrollArea>

        {/* Report Dialog */}
        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          report={report}
          loading={generatingReport}
          auditTitle={selectedAudit?.title || 'Audit'}
        />
      </div>
    </DashboardLayout>
  );
}
