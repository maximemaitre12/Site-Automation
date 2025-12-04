import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Sparkles, Loader2 } from 'lucide-react';

interface DocGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (params: {
    type: string;
    subject: string;
    target: string;
    tone: string;
    detailLevel: string;
  }) => Promise<void>;
  processing: boolean;
}

export function DocGenerateModal({ open, onClose, onGenerate, processing }: DocGenerateModalProps) {
  const [type, setType] = useState('rapport');
  const [subject, setSubject] = useState('');
  const [target, setTarget] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [detailLevel, setDetailLevel] = useState('moyen');

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    await onGenerate({ type, subject, target, tone, detailLevel });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Générer un document
          </DialogTitle>
          <DialogDescription>
            Répondez à quelques questions pour générer un document complet avec l'IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type de document</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rapport">Rapport</SelectItem>
                <SelectItem value="analyse">Analyse</SelectItem>
                <SelectItem value="contrat">Contrat</SelectItem>
                <SelectItem value="proposition">Proposition commerciale</SelectItem>
                <SelectItem value="procedure">Procédure</SelectItem>
                <SelectItem value="compte-rendu">Compte-rendu</SelectItem>
                <SelectItem value="presentation">Présentation</SelectItem>
                <SelectItem value="brief">Brief</SelectItem>
                <SelectItem value="libre">Document libre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sujet / Thème principal</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Stratégie marketing Q1 2025"
            />
          </div>

          <div className="space-y-2">
            <Label>Public cible</Label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Ex: Direction générale, clients, équipe interne..."
            />
          </div>

          <div className="space-y-2">
            <Label>Ton du document</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professionnel">Professionnel</SelectItem>
                <SelectItem value="formel">Formel</SelectItem>
                <SelectItem value="convivial">Convivial</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="juridique">Juridique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Niveau de détail</Label>
            <Select value={detailLevel} onValueChange={setDetailLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume">Résumé (court)</SelectItem>
                <SelectItem value="moyen">Moyen</SelectItem>
                <SelectItem value="detaille">Détaillé</SelectItem>
                <SelectItem value="exhaustif">Exhaustif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={processing || !subject.trim()}>
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
