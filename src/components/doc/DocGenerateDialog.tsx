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
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocTemplate } from "@/hooks/useAetherDocs";
import {
  FileText,
  FileSignature,
  Presentation,
  ClipboardList,
  FolderKanban,
  Wand2,
  Loader2,
  ArrowLeft
} from "lucide-react";

interface DocGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: DocTemplate[];
  onGenerate: (templateId: string, variables: Record<string, string>, title: string) => Promise<void>;
}

const categoryIcons: Record<string, React.ElementType> = {
  contract: FileSignature,
  proposal: Presentation,
  report: ClipboardList,
  procedure: FileText,
  project: FolderKanban,
  general: FileText
};

const categoryLabels: Record<string, string> = {
  contract: 'Contrat',
  proposal: 'Proposition',
  report: 'Rapport',
  procedure: 'Procédure',
  project: 'Projet',
  general: 'Général'
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

  const handleGenerate = async () => {
    if (!selectedTemplate || !title) return;
    
    setLoading(true);
    await onGenerate(selectedTemplate.id, { prompt, title }, title);
    setLoading(false);
    reset();
    onOpenChange(false);
  };

  const reset = () => {
    setSelectedTemplate(null);
    setTitle("");
    setPrompt("");
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, DocTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Générer un document
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un template et laissez l'IA générer votre document.
          </DialogDescription>
        </DialogHeader>

        {!selectedTemplate ? (
          <ScrollArea className="flex-1 -mx-6 px-6">
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
                    <div className="grid grid-cols-2 gap-3">
                      {categoryTemplates.map((template) => (
                        <Card
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="p-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{template.name}</p>
                              {template.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                  {template.description}
                                </p>
                              )}
                              {template.is_system && (
                                <Badge variant="secondary" className="mt-2 text-xs">
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
          </ScrollArea>
        ) : (
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
              <Label>Instructions pour l'IA</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez le contenu souhaité, les informations à inclure, le ton, etc."
                className="mt-1 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Donnez le maximum de contexte pour une meilleure génération.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleGenerate} disabled={!title || loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
