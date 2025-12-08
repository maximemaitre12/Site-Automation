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
  Check
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface DocViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: AetherDocument | null;
}

export function DocViewerDialog({
  open,
  onOpenChange,
  document
}: DocViewerDialogProps) {
  const [copied, setCopied] = useState(false);

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

  const entities = document.ai_entities || {};
  const hasEntities = Object.keys(entities).length > 0;

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

          <TabsContent value="ai" className="flex-1 min-h-0 mt-4 space-y-4">
            {/* Summary */}
            {document.ai_summary && (
              <Card className="p-4">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Résumé IA
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
                  Mots-clés extraits
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

            {/* Entities */}
            {hasEntities && (
              <Card className="p-4">
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  Entités détectées
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {entities.persons && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Personnes</p>
                      <div className="flex flex-wrap gap-1">
                        {(entities.persons as string[]).map((p: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {entities.organizations && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Organisations</p>
                      <div className="flex flex-wrap gap-1">
                        {(entities.organizations as string[]).map((o: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Building className="w-3 h-3 mr-1" />
                            {o}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {entities.dates && (
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
                </div>
              </Card>
            )}

            {!document.ai_summary && (!document.ai_keywords || document.ai_keywords.length === 0) && !hasEntities && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {document.embedding_status === 'pending' 
                    ? "Analyse IA en cours..." 
                    : "Aucune analyse IA disponible"}
                </p>
              </div>
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
