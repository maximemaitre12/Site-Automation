import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, FileText, Loader2, Sparkles, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useCompliance, Audit } from "@/hooks/useCompliance";
import { AuditResult } from "@/components/compliance/AuditResult";
import { ReportDialog } from "@/components/compliance/ReportDialog";

const auditTypes = [
  { value: 'gdpr', label: 'Conformité RGPD', description: 'Audit complet RGPD' },
  { value: 'privacy', label: 'Politique de confidentialité', description: 'Analyse de politique' },
  { value: 'data_processing', label: 'Traitement des données', description: 'Audit des processus' },
  { value: 'cookies', label: 'Cookies & Traceurs', description: 'Conformité cookies' },
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

  const stats = getStats();

  const handleRunAudit = async () => {
    if (!inputText.trim()) return;
    const result = await runAudit(auditType, inputText, title || undefined);
    if (result) {
      setSelectedAudit(result);
      setInputText('');
      setTitle('');
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
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-400 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                AETHER Compliance
              </h1>
              <p className="text-muted-foreground mt-1">Audit automatisé RGPD et détection des risques de conformité</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Audits réalisés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Score moyen</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.highRiskCount}</p>
                  <p className="text-xs text-muted-foreground">Risques élevés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedCount}</p>
                  <p className="text-xs text-muted-foreground">Audits terminés</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Audit Form */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">Nouvel audit de conformité</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'audit (optionnel)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Audit politique vie privée site web"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type d'audit</Label>
                  <Select value={auditType} onValueChange={setAuditType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {auditTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Texte, politique ou processus à analyser</Label>
                  <Textarea
                    id="content"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Collez ici le texte de votre politique de confidentialité, conditions d'utilisation, ou décrivez le processus de traitement des données à auditer..."
                    className="min-h-[250px]"
                  />
                </div>

                <Button 
                  onClick={handleRunAudit} 
                  disabled={analyzing || !inputText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Lancer l'audit de conformité
                    </>
                  )}
                </Button>

                {/* Quick Tips */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-foreground">Conseils pour un audit efficace</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Incluez le texte complet de votre politique</li>
                    <li>• Décrivez les flux de données en détail</li>
                    <li>• Mentionnez les tiers et sous-traitants</li>
                    <li>• Précisez les durées de conservation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <aside className="w-[450px] border-l border-border bg-card/30 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Audits récents
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {audits.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun audit réalisé</p>
                  <p className="text-sm">Lancez votre premier audit de conformité</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {audits.map(audit => (
                    <AuditResult
                      key={audit.id}
                      audit={audit}
                      onDelete={deleteAudit}
                      onGenerateReport={handleGenerateReport}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>
        </div>

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
