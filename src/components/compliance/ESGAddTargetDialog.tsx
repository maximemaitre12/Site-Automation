import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';

interface ESGAddTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    target_year: number;
    target_reduction_percent: number;
    baseline_year: number;
    target_type: string;
    description: string | null;
    is_achieved: boolean;
  }) => void;
  isLoading?: boolean;
}

export function ESGAddTargetDialog({ open, onOpenChange, onSubmit, isLoading }: ESGAddTargetDialogProps) {
  const [targetYear, setTargetYear] = useState('2030');
  const [reductionPercent, setReductionPercent] = useState('');
  const [baselineYear, setBaselineYear] = useState('2019');
  const [targetType, setTargetType] = useState('absolute');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      target_year: parseInt(targetYear),
      target_reduction_percent: parseFloat(reductionPercent) || 0,
      baseline_year: parseInt(baselineYear),
      target_type: targetType,
      description: description || null,
      is_achieved: false,
    });
    // Reset
    setTargetYear('2030');
    setReductionPercent('');
    setBaselineYear('2019');
    setTargetType('absolute');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Définir un objectif de décarbonation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-year">Année cible *</Label>
              <Select value={targetYear} onValueChange={setTargetYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2025, 2026, 2027, 2028, 2029, 2030, 2035, 2040, 2045, 2050].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseline-year">Année de référence *</Label>
              <Select value={baselineYear} onValueChange={setBaselineYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reduction">Réduction visée (%) *</Label>
              <Input
                id="reduction"
                type="number"
                min="0"
                max="100"
                step="1"
                value={reductionPercent}
                onChange={(e) => setReductionPercent(e.target.value)}
                placeholder="50"
                required
              />
              <p className="text-[10px] text-muted-foreground">Ex: 50 pour -50%</p>
            </div>
            <div className="space-y-2">
              <Label>Type d'objectif</Label>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">Réduction absolue</SelectItem>
                  <SelectItem value="intensity">Intensité carbone</SelectItem>
                  <SelectItem value="net_zero">Neutralité carbone</SelectItem>
                  <SelectItem value="sbti">Science-Based Target (SBTi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objectif aligné sur l'Accord de Paris, trajectoire 1.5°C..."
              rows={2}
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              <strong>Rappel:</strong> Les objectifs SBTi (Science-Based Targets initiative) 
              recommandent une réduction de -42% d'ici 2030 et Net Zero d'ici 2050 pour 
              limiter le réchauffement à 1.5°C.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !reductionPercent}>
              {isLoading ? 'Ajout...' : 'Définir l\'objectif'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
