import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DocTemplate } from "@/hooks/useAetherDocs";
import {
  FileText,
  FileSignature,
  Presentation,
  ClipboardList,
  FolderKanban,
  Wand2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface GenerationResult {
  qualityScore?: number;
  qualityGrade?: string;
  reliabilityScore?: number;
  category?: string;
  complexity?: string;
}

interface DocGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: DocTemplate[];
  onGenerate: (templateId: string, variables: Record<string, string>, title: string) => Promise<GenerationResult | null>;
}

const categoryIcons: Record<string, React.ElementType> = {
  contract: FileSignature,
  proposal: Presentation,
  report: ClipboardList,
  procedure: FileText,
  project: FolderKanban,
  general: FileText,
  hr: FileSignature,
  sales: Presentation,
  compliance: ClipboardList
};

const categoryLabels: Record<string, string> = {
  contract: 'Contrat',
  proposal: 'Proposition',
  report: 'Rapport',
  procedure: 'Procédure',
  project: 'Projet',
  general: 'Général',
  hr: 'Ressources Humaines',
  sales: 'Commercial',
  compliance: 'Conformité'
};

export function DocGenerateDialog({
  open,
  onOpenChange,
  templates,
  onGenerate
}: DocGenerateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!selectedTemplate || !title) return;
    
    setLoading(true);
    setGenerationResult(null);
    const result = await onGenerate(selectedTemplate.id, { prompt, title }, title);
    setLoading(false);
    
    if (result) {
      setGenerationResult(result);
      // Auto-close after showing result
      setTimeout(() => {
        reset();
        onOpenChange(false);
      }, 2500);
    } else {
      reset();
      onOpenChange(false);
    }
  };

  const reset = () => {
    setSelectedTemplate(null);
    setTitle("");
    setPrompt("");
    setGenerationResult(null);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, DocTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Générer un document Word
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un template et laissez l'IA générer votre document professionnel.
          </DialogDescription>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6 pb-4">
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
                const CategoryIcon = categoryIcons[category] || FileText;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {categoryLabels[category] || category}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {categoryTemplates.map((template) => (
                        <Card
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="p-3 md:p-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm md:text-base truncate">{template.name}</p>
                              {template.description && (
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                  {template.description}
                                </p>
                              )}
                              {template.is_system && (
                                <Badge variant="secondary" className="mt-1.5 md:mt-2 text-[10px] md:text-xs">
                                  Template système
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}

              {templates.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun template disponible</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate(null)}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux templates
              </Button>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  {(() => {
                    const CategoryIcon = categoryIcons[selectedTemplate.category] || FileText;
                    return (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-primary" />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                </div>
              </Card>

              <div>
                <Label>Titre du document *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Contrat de prestation XYZ"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Instructions pour la génération</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez le contenu souhaité, les informations à inclure, le ton, etc."
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Donnez le maximum de contexte pour une génération optimale. Le document sera exporté en format Word (.docx).
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTemplate && !generationResult && (
          <div className="flex-shrink-0 border-t px-6 py-4 bg-background">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleGenerate} disabled={!title || loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération Senior UX v3.0...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer (Consulting-Grade)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Generation Result Card */}
        {generationResult && (
          <div className="flex-shrink-0 border-t px-6 py-4 bg-background">
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">Document généré avec succès</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Catégorie: {generationResult.category?.replace(/_/g, ' ')} | Complexité: {generationResult.complexity}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Qualité
                    </span>
                    <Badge variant={
                      generationResult.qualityGrade === 'A+' || generationResult.qualityGrade === 'A' ? 'default' :
                      generationResult.qualityGrade === 'B' ? 'secondary' : 'destructive'
                    }>
                      {generationResult.qualityGrade} ({generationResult.qualityScore}/100)
                    </Badge>
                  </div>
                  <Progress 
                    value={generationResult.qualityScore || 0} 
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Fiabilité
                    </span>
                    <Badge variant={
                      (generationResult.reliabilityScore || 0) >= 80 ? 'default' :
                      (generationResult.reliabilityScore || 0) >= 60 ? 'secondary' : 'destructive'
                    }>
                      {(generationResult.reliabilityScore || 0) >= 80 ? 'Haute' : 
                       (generationResult.reliabilityScore || 0) >= 60 ? 'Moyenne' : 'À vérifier'} ({generationResult.reliabilityScore}%)
                    </Badge>
                  </div>
                  <Progress 
                    value={generationResult.reliabilityScore || 0} 
                    className="h-2"
                  />
                </div>
              </div>
              
              {(generationResult.reliabilityScore || 0) < 80 && (
                <div className="flex items-start gap-2 mt-3 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-amber-800 dark:text-amber-200">
                    Nous vous recommandons de vérifier les données générées avant utilisation.
                  </span>
                </div>
              )}
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
