import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: string | null;
  loading: boolean;
  auditTitle: string;
}

export function ReportDialog({ open, onOpenChange, report, loading, auditTitle }: ReportDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copié', description: 'Rapport copié dans le presse-papier' });
  };

  const downloadAsText = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${auditTitle.replace(/\s+/g, '_')}_rapport.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Téléchargé', description: 'Rapport téléchargé' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Rapport de conformité
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Génération du rapport...</span>
          </div>
        ) : report ? (
          <div className="space-y-4">
            <ScrollArea className="h-[500px] rounded-lg border border-border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {report.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-base font-medium mt-3 mb-1">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.slice(2)}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copié' : 'Copier'}
              </Button>
              <Button onClick={downloadAsText}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Aucun rapport disponible
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
