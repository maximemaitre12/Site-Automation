import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, DoorOpen, AlertTriangle } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees';

interface TerminationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onSubmit: (id: string, reason: string, date: string, details?: string) => Promise<boolean>;
}

const departureReasons = [
  { value: 'resignation', label: 'Démission', description: 'Départ volontaire de l\'employé' },
  { value: 'termination', label: 'Licenciement', description: 'Licenciement pour motif personnel' },
  { value: 'layoff', label: 'Licenciement économique', description: 'Suppression de poste' },
  { value: 'end_contract', label: 'Fin de contrat', description: 'CDD ou stage arrivé à terme' },
  { value: 'retirement', label: 'Retraite', description: 'Départ à la retraite' },
  { value: 'mutual', label: 'Rupture conventionnelle', description: 'Accord mutuel' },
];

export function TerminationDialog({ 
  open, 
  onOpenChange, 
  employee, 
  onSubmit 
}: TerminationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [formData, setFormData] = useState({
    reason: '',
    date: new Date().toISOString().split('T')[0],
    details: '',
  });

  const handleSelectReason = (reason: string) => {
    setFormData({ ...formData, reason });
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await onSubmit(employee.id, formData.reason, formData.date, formData.details);
    
    setIsSubmitting(false);
    onOpenChange(false);
    setStep('select');
    setFormData({ reason: '', date: new Date().toISOString().split('T')[0], details: '' });
  };

  const handleBack = () => {
    setStep('select');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep('select');
      setFormData({ reason: '', date: new Date().toISOString().split('T')[0], details: '' });
    }
    onOpenChange(open);
  };

  const selectedReason = departureReasons.find(r => r.value === formData.reason);
  const requiresDetails = ['termination', 'layoff'].includes(formData.reason);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-destructive" />
            Départ / Licenciement
          </DialogTitle>
          <DialogDescription>
            Enregistrer le départ de {employee.name}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Sélectionnez le type de départ :</p>
            <div className="space-y-2">
              {departureReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => handleSelectReason(reason.value)}
                  className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                  <p className="font-medium text-foreground">{reason.label}</p>
                  <p className="text-xs text-muted-foreground">{reason.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-xs text-muted-foreground">{employee.job_title}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-warning/30 bg-warning/10">
              <p className="text-sm font-medium text-warning">{selectedReason?.label}</p>
              <p className="text-xs text-muted-foreground">{selectedReason?.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Date de départ</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Détails / Motif
                {requiresDetails && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Textarea
                placeholder={
                  formData.reason === 'termination' 
                    ? 'Motif du licenciement (obligatoire)...'
                    : formData.reason === 'layoff'
                    ? 'Justification économique (obligatoire)...'
                    : 'Notes additionnelles (optionnel)...'
                }
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="min-h-[100px]"
                required={requiresDetails}
              />
            </div>

            {requiresDetails && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <p className="text-xs text-destructive">
                  Le motif est obligatoire et doit être documenté pour un licenciement.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Retour
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-destructive hover:bg-destructive/90" 
                disabled={isSubmitting || (requiresDetails && !formData.details.trim())}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirmer le départ
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
