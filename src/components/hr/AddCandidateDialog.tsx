import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, User, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddCandidateDialogProps {
  onAdd: (data: { name: string; email?: string; phone?: string; cvText?: string }) => Promise<any>;
  children: React.ReactNode;
}

export function AddCandidateDialog({ onAdd, children }: AddCandidateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cvText: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      // For PDFs and other formats, we'll just note that they uploaded something
      // In a real app, you'd use a PDF parser
      toast({
        title: 'Format détecté',
        description: 'Pour les fichiers PDF, veuillez coller le contenu du CV dans la zone de texte.',
      });
      return;
    }

    try {
      const text = await file.text();
      setForm(f => ({ ...f, cvText: text }));
      toast({ title: 'CV chargé', description: 'Le contenu du CV a été extrait.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de lire le fichier', variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Nom requis', description: 'Veuillez saisir le nom du candidat', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const result = await onAdd({
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      cvText: form.cvText || undefined
    });

    if (result) {
      setForm({ name: '', email: '', phone: '', cvText: '' });
      setOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Ajouter un candidat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="name"
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="jean@example.com"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="phone"
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* CV Upload */}
          <div className="space-y-2">
            <Label>CV / Résumé</Label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour uploader un fichier texte ou glissez-déposez
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                TXT, MD supportés. Pour les PDF, copiez-collez le texte ci-dessous.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* CV Text */}
          <div className="space-y-2">
            <Label htmlFor="cvText" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contenu du CV
              {form.cvText && <span className="text-xs text-muted-foreground">({form.cvText.length} caractères)</span>}
            </Label>
            <Textarea 
              id="cvText"
              placeholder="Collez le contenu du CV ici pour l'analyse IA..."
              value={form.cvText}
              onChange={(e) => setForm(f => ({ ...f, cvText: e.target.value }))}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <User className="w-4 h-4 mr-2" />
                Ajouter le candidat
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
