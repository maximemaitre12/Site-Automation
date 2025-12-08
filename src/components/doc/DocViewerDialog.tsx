import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AetherDocument } from "@/hooks/useAetherDocs";
import {
  FileText,
  Download,
  ExternalLink,
  Clock,
  Tag,
  Brain,
  Key,
  User,
  Calendar,
  Building,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  FileDown,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface DocViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: AetherDocument | null;
  onAnalyze?: (documentId: string) => Promise<boolean>;
  onRewrite?: (documentId: string, options?: {
    instructions?: string;
    style?: 'professional' | 'formal' | 'concise' | 'detailed' | 'simplified';
    format?: 'report' | 'memo' | 'procedure' | 'email' | 'presentation' | 'contract';
    companyRules?: string;
  }) => Promise<any>;
  onRefresh?: () => void;
}

export function DocViewerDialog({
  open,
  onOpenChange,
  document,
  onAnalyze,
  onRewrite,
  onRefresh
}: DocViewerDialogProps) {
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [showRewriteOptions, setShowRewriteOptions] = useState(false);
  const [rewriteStyle, setRewriteStyle] = useState<string>('professional');
  const [rewriteFormat, setRewriteFormat] = useState<string>('auto');
  const [rewriteInstructions, setRewriteInstructions] = useState('');
  const [companyRules, setCompanyRules] = useState('');

  if (!document) return null;

  const handleCopyContent = () => {
    if (document.content) {
      navigator.clipboard.writeText(document.content);
      setCopied(true);
      toast.success("Contenu copié");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    } else if (document.content) {
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadPDF = () => {
    if (!document.content) {
      toast.error("Aucun contenu à exporter");
      return;
    }

    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${document.title}</title>
        <style>
          @page { margin: 2.5cm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          h1 { font-size: 18pt; margin-bottom: 24px; text-align: center; }
          h2 { font-size: 14pt; margin-top: 24px; margin-bottom: 12px; }
          p { text-align: justify; margin-bottom: 12px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
          .date { color: #666; font-size: 10pt; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${document.title}</h1>
          <p class="date">Document généré le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
        </div>
        <div class="content">
          ${document.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
        </div>
        <div class="footer">
          Version ${document.version} • Dernière modification: ${format(new Date(document.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    setAnalyzing(true);
    try {
      await onAnalyze(document.id);
      onRefresh?.();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRewrite = async () => {
    if (!onRewrite) return;
    setRewriting(true);
    try {
      const result = await onRewrite(document.id, {
        instructions: rewriteInstructions || undefined,
        style: rewriteStyle as any,
        format: rewriteFormat !== 'auto' ? rewriteFormat as any : undefined,
        companyRules: companyRules || undefined
      });
      if (result) {
        setShowRewriteOptions(false);
        setRewriteInstructions('');
        onRefresh?.();
      }
    } finally {
      setRewriting(false);
    }
  };

  const entities = document.ai_entities || {};
  const hasEntities = Object.keys(entities).length > 0;
  const aiAnalysis = (document.metadata?.ai_analysis || {}) as Record<string, any>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl truncate">{document.title}</DialogTitle>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(document.updated_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </span>
                  <span>v{document.version}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopyContent}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} title="Exporter en PDF">
                <FileDown className="w-4 h-4" />
              </Button>
              {document.file_url && (
                <Button variant="outline" size="sm" onClick={() => window.open(document.file_url!, '_blank')}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start flex-shrink-0">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="ai">
              <Brain className="w-4 h-4 mr-1.5" />
              Analyse IA
            </TabsTrigger>
            <TabsTrigger value="rewrite">
              <Wand2 className="w-4 h-4 mr-1.5" />
              Améliorer
            </TabsTrigger>
            <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[400px] rounded-lg border bg-muted/30 p-4">
              {document.content ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {document.content}
                </div>
              ) : document.file_url ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Ce document est un fichier externe
                  </p>
                  <Button onClick={() => window.open(document.file_url!, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ouvrir le fichier
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun contenu disponible
                </p>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={analyzing}
                    variant="outline"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {document.ai_summary ? 'Relancer l\'analyse' : 'Lancer l\'analyse IA'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Readability Score */}
                {aiAnalysis?.readabilityScore && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Score de lisibilité
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{aiAnalysis.readabilityScore}/100</span>
                        <Badge variant={aiAnalysis.readabilityScore >= 70 ? 'default' : aiAnalysis.readabilityScore >= 50 ? 'secondary' : 'destructive'}>
                          {aiAnalysis.readabilityScore >= 70 ? 'Bon' : aiAnalysis.readabilityScore >= 50 ? 'Moyen' : 'À améliorer'}
                        </Badge>
                      </div>
                      <Progress value={aiAnalysis.readabilityScore} className="h-2" />
                      {aiAnalysis.readabilityComment && (
                        <p className="text-sm text-muted-foreground">{aiAnalysis.readabilityComment}</p>
                      )}
                    </div>
                  </Card>
                )}

                {/* Strengths & Weaknesses */}
                {(aiAnalysis?.strengths?.length > 0 || aiAnalysis?.weaknesses?.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    {aiAnalysis?.strengths?.length > 0 && (
                      <Card className="p-4 border-green-200 bg-green-50/50">
                        <h4 className="font-medium flex items-center gap-2 mb-3 text-green-700">
                          <ThumbsUp className="w-4 h-4" />
                          Points forts
                        </h4>
                        <ul className="space-y-2">
                          {aiAnalysis.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {aiAnalysis?.weaknesses?.length > 0 && (
                      <Card className="p-4 border-amber-200 bg-amber-50/50">
                        <h4 className="font-medium flex items-center gap-2 mb-3 text-amber-700">
                          <ThumbsDown className="w-4 h-4" />
                          Points faibles
                        </h4>
                        <ul className="space-y-2">
                          {aiAnalysis.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                )}

                {/* Spelling Errors */}
                {aiAnalysis?.spellingErrors?.length > 0 && (
                  <Card className="p-4 border-red-200 bg-red-50/50">
                    <h4 className="font-medium flex items-center gap-2 mb-3 text-red-700">
                      <XCircle className="w-4 h-4" />
                      Fautes d'orthographe ({aiAnalysis.spellingErrors.length})
                    </h4>
                    <div className="space-y-3">
                      {aiAnalysis.spellingErrors.map((error: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <span className="text-red-600 line-through">{error.original}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600 font-medium">{error.correction}</span>
                            {error.context && (
                              <p className="text-xs text-muted-foreground mt-1 italic">"{error.context}"</p>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              if (document.content) {
                                const newContent = document.content.replace(error.original, error.correction);
                                navigator.clipboard.writeText(error.correction);
                                toast.success(`"${error.correction}" copié`);
                              }
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Grammar Issues */}
                {aiAnalysis?.grammarIssues?.length > 0 && (
                  <Card className="p-4 border-orange-200 bg-orange-50/50">
                    <h4 className="font-medium flex items-center gap-2 mb-3 text-orange-700">
                      <AlertTriangle className="w-4 h-4" />
                      Problèmes de grammaire ({aiAnalysis.grammarIssues.length})
                    </h4>
                    <div className="space-y-2">
                      {aiAnalysis.grammarIssues.map((issue: any, i: number) => (
                        <div key={i} className="p-2 bg-white rounded border text-sm">
                          <p className="font-medium text-orange-700">{issue.issue}</p>
                          <p className="text-green-600">Suggestion: {issue.suggestion}</p>
                          {issue.context && (
                            <p className="text-xs text-muted-foreground mt-1 italic">"{issue.context}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Recommendations */}
                {aiAnalysis?.recommendations?.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Recommandations d'amélioration
                    </h4>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Summary */}
                {document.ai_summary && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Résumé
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {document.ai_summary}
                    </p>
                  </Card>
                )}

                {/* Keywords */}
                {document.ai_keywords && document.ai_keywords.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-primary" />
                      Mots-clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {document.ai_keywords.map((keyword: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Classification */}
                {aiAnalysis && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-primary" />
                      Classification
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.category && (
                        <Badge variant="secondary" className="capitalize">
                          {aiAnalysis.category}
                        </Badge>
                      )}
                      {aiAnalysis.sentiment && (
                        <Badge 
                          variant="outline"
                          className={
                            aiAnalysis.sentiment === 'positif' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : aiAnalysis.sentiment === 'negatif'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : ''
                          }
                        >
                          {aiAnalysis.sentiment}
                        </Badge>
                      )}
                      {aiAnalysis.language && (
                        <Badge variant="outline">
                          {aiAnalysis.language.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </Card>
                )}

                {/* Entities */}
                {hasEntities && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-primary" />
                      Entités détectées
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(entities.personnes as string[])?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Personnes</p>
                          <div className="flex flex-wrap gap-1">
                            {(entities.personnes as string[]).map((p: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <User className="w-3 h-3 mr-1" />
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(entities.organisations as string[])?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Organisations</p>
                          <div className="flex flex-wrap gap-1">
                            {(entities.organisations as string[]).map((o: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <Building className="w-3 h-3 mr-1" />
                                {o}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(entities.dates as string[])?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Dates</p>
                          <div className="flex flex-wrap gap-1">
                            {(entities.dates as string[]).map((d: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(entities.montants as string[])?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Montants</p>
                          <div className="flex flex-wrap gap-1">
                            {(entities.montants as string[]).map((m: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {m}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(entities.lieux as string[])?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Lieux</p>
                          <div className="flex flex-wrap gap-1">
                            {(entities.lieux as string[]).map((l: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {l}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {!document.ai_summary && !aiAnalysis && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      {document.embedding_status === 'pending' 
                        ? "Analyse IA en attente" 
                        : "Aucune analyse IA disponible"}
                    </p>
                    <Button onClick={handleAnalyze} disabled={analyzing}>
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Lancer l'analyse IA
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rewrite" className="flex-1 min-h-0 mt-4 space-y-4">
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-4">
                <Wand2 className="w-4 h-4 text-primary" />
                Réécrire le document
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                L'IA va réécrire votre document de manière professionnelle, comme s'il avait été rédigé par une équipe d'experts. Le résultat sera 100% humain, sans aucune trace d'IA.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Style de rédaction</Label>
                    <Select value={rewriteStyle} onValueChange={setRewriteStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professionnel</SelectItem>
                        <SelectItem value="formal">Formel</SelectItem>
                        <SelectItem value="concise">Concis</SelectItem>
                        <SelectItem value="detailed">Détaillé</SelectItem>
                        <SelectItem value="simplified">Simplifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format du document</Label>
                    <Select value={rewriteFormat} onValueChange={setRewriteFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Automatique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatique</SelectItem>
                        <SelectItem value="report">Rapport</SelectItem>
                        <SelectItem value="memo">Mémo</SelectItem>
                        <SelectItem value="procedure">Procédure</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="presentation">Présentation</SelectItem>
                        <SelectItem value="contract">Contrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instructions spécifiques (optionnel)</Label>
                  <Textarea
                    placeholder="Ex: Ajouter plus de détails techniques, utiliser un ton plus formel..."
                    value={rewriteInstructions}
                    onChange={(e) => setRewriteInstructions(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Règles de l'entreprise (optionnel)</Label>
                  <Textarea
                    placeholder="Ex: Toujours commencer par 'Cher client', utiliser 'nous' au lieu de 'je', etc."
                    value={companyRules}
                    onChange={(e) => setCompanyRules(e.target.value)}
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={handleRewrite} 
                  disabled={rewriting || !document.content}
                  className="w-full"
                >
                  {rewriting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Réécriture en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Réécrire le document
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {document.metadata?.lastRewrite && (
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Dernière réécriture: {format(new Date((document.metadata.lastRewrite as any).rewrittenAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  {' '}• Style: {(document.metadata.lastRewrite as any).style}
                  {(document.metadata.lastRewrite as any).format && ` • Format: ${(document.metadata.lastRewrite as any).format}`}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="flex-1 min-h-0 mt-4">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type de fichier</p>
                  <p className="font-medium">{document.file_type || 'Texte'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Taille</p>
                  <p className="font-medium">
                    {document.file_size 
                      ? `${(document.file_size / 1024).toFixed(1)} KB` 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Créé le</p>
                  <p className="font-medium">
                    {format(new Date(document.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Modifié le</p>
                  <p className="font-medium">
                    {format(new Date(document.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-medium">{document.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Statut</p>
                  <Badge variant={document.status === 'active' ? 'default' : 'secondary'}>
                    {document.status === 'active' ? 'Actif' : document.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {document.tags && document.tags.length > 0 ? (
                      document.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun tag</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
