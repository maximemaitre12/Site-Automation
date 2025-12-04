import { useState } from 'react';
import { Document } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, Code, FileJson, Loader2 } from 'lucide-react';

interface DocExportProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
  onExport: (doc: Document, format: 'md' | 'html' | 'json') => Promise<string>;
}

export function DocExport({ document, open, onClose, onExport }: DocExportProps) {
  const [format, setFormat] = useState<'md' | 'html' | 'json'>('md');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!document) return;
    setExporting(true);

    try {
      const content = await onExport(document, format);
      
      // Create and download file
      const blob = new Blob([content], { 
        type: format === 'json' ? 'application/json' : 
              format === 'html' ? 'text/html' : 'text/markdown'
      });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}.${format}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } finally {
      setExporting(false);
    }
  };

  const formats = [
    { value: 'md', label: 'Markdown (.md)', icon: FileText, description: 'Format texte simple et portable' },
    { value: 'html', label: 'HTML (.html)', icon: Code, description: 'Page web avec mise en forme' },
    { value: 'json', label: 'JSON (.json)', icon: FileJson, description: 'Données structurées complètes' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Exporter le document
          </DialogTitle>
          <DialogDescription>
            {document?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Format d'export</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    <div className="flex items-center gap-2">
                      <f.icon className="h-4 w-4" />
                      {f.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formats.find(f => f.value === format)?.description}
            </p>
          </div>

          {format === 'html' && (
            <div className="p-3 rounded-lg bg-secondary/50 text-sm text-muted-foreground">
              L'export HTML inclut une mise en forme professionnelle prête à l'emploi.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
