import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, User, Mail, Phone, FileText, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callAI } from '@/lib/ai';

interface AddCandidateDialogProps {
  onAdd: (data: { name: string; email?: string; phone?: string; cvText?: string }) => Promise<any>;
  children: React.ReactNode;
}

export function AddCandidateDialog({ onAdd, children }: AddCandidateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cvText: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Extract CV info when cvText changes
  const extractCVInfo = async (text: string) => {
    if (!text || text.length < 50) return;
    
    setIsExtracting(true);
    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse ce CV et extrais les informations suivantes en JSON:
{
  "name": "nom complet du candidat",
  "email": "adresse email si présente",
  "phone": "numéro de téléphone si présent"
}

CV:
${text}

Réponds UNIQUEMENT avec le JSON, sans markdown ni explication.`
        }],
        type: 'extract'
      });

      if (response.content && !response.error) {
        try {
          // Handle potential markdown wrapping
          let jsonStr = response.content.trim();
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          }
          
          const extracted = JSON.parse(jsonStr);
          
          setForm(f => ({
            ...f,
            name: extracted.name || f.name,
            email: extracted.email || f.email,
            phone: extracted.phone || f.phone
          }));
          
          toast({
            title: 'Informations extraites',
            description: 'Les données du CV ont été détectées automatiquement.'
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
        }
      }
    } catch (error) {
      console.error('CV extraction error:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      toast({
        title: 'Format détecté',
        description: 'Pour les fichiers PDF, veuillez coller le contenu du CV dans la zone de texte.',
      });
      return;
    }

    try {
      const text = await file.text();
      setForm(f => ({ ...f, cvText: text }));
      toast({ title: 'CV chargé', description: 'Extraction des informations en cours...' });
      
      // Auto-extract info from uploaded CV
      await extractCVInfo(text);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de lire le fichier', variant: 'destructive' });
    }
  };

  const handleCvTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setForm(f => ({ ...f, cvText: text }));
  };

  // Trigger extraction when user pastes or finishes typing CV
  const handleCvBlur = () => {
    if (form.cvText && form.cvText.length > 50 && !form.name) {
      extractCVInfo(form.cvText);
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
              {isExtracting && (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Extraction IA...
                </span>
              )}
              {form.cvText && !isExtracting && <span className="text-xs text-muted-foreground">({form.cvText.length} caractères)</span>}
            </Label>
            <Textarea 
              id="cvText"
              placeholder="Collez le contenu du CV ici pour l'analyse IA automatique..."
              value={form.cvText}
              onChange={handleCvTextChange}
              onBlur={handleCvBlur}
              className="min-h-[150px] font-mono text-sm"
            />
            {form.cvText && form.cvText.length > 50 && !form.name && !isExtracting && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => extractCVInfo(form.cvText)}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Extraire les informations du CV
              </Button>
            )}
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
