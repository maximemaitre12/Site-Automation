import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Mail, Loader2 } from 'lucide-react';
import { useHREmails } from '@/hooks/useHREmails';

interface EmailImportDialogProps {
  children: React.ReactNode;
  candidates?: any[];
}

export function EmailImportDialog({ children, candidates = [] }: EmailImportDialogProps) {
  const { importEmail } = useHREmails();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    from_email: '',
    from_name: '',
    subject: '',
    body_text: '',
    candidate_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from_email || !formData.subject) {
      return;
    }

    setLoading(true);
    try {
      await importEmail({
        from_email: formData.from_email,
        from_name: formData.from_name || undefined,
        subject: formData.subject,
        body_text: formData.body_text,
        candidate_id: formData.candidate_id || undefined,
      });
      
      setFormData({
        from_email: '',
        from_name: '',
        subject: '',
        body_text: '',
        candidate_id: '',
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Importer un email
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_email">Email expéditeur *</Label>
              <Input
                id="from_email"
                type="email"
                value={formData.from_email}
                onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                placeholder="candidat@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="from_name">Nom expéditeur</Label>
              <Input
                id="from_name"
                value={formData.from_name}
                onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Candidature pour le poste de..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body_text">Contenu de l'email</Label>
            <Textarea
              id="body_text"
              value={formData.body_text}
              onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
              placeholder="Collez le contenu de l'email ici..."
              className="min-h-[150px]"
            />
          </div>
          
          {candidates.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="candidate">Lier à un candidat existant</Label>
              <Select 
                value={formData.candidate_id} 
                onValueChange={(v) => setFormData({ ...formData, candidate_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un candidat..." />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} - {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Importer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
