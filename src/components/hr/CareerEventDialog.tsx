import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, Award, Banknote, AlertTriangle } from 'lucide-react';
import { Employee, CareerEvent } from '@/hooks/useEmployees';

interface CareerEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'raise' | 'promotion' | 'bonus' | 'warning';
  employee: Employee;
  onSubmit: (data: Partial<CareerEvent>) => Promise<any>;
}

export function CareerEventDialog({ 
  open, 
  onOpenChange, 
  type, 
  employee, 
  onSubmit 
}: CareerEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    event_date: new Date().toISOString().split('T')[0],
    description: '',
    new_salary: '',
    bonus_amount: '',
    bonus_reason: '',
    new_title: '',
    warning_type: 'verbal',
    warning_severity: 'low',
  });

  const titles: Record<string, { title: string; icon: any }> = {
    raise: { title: 'Augmentation de salaire', icon: TrendingUp },
    promotion: { title: 'Promotion', icon: Award },
    bonus: { title: 'Bonus', icon: Banknote },
    warning: { title: 'Avertissement', icon: AlertTriangle },
  };

  const { title, icon: Icon } = titles[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data: Partial<CareerEvent> = {
      employee_id: employee.id,
      event_type: type,
      event_date: formData.event_date,
      description: formData.description,
    };

    if (type === 'raise') {
      data.old_salary = employee.salary_current;
      data.new_salary = parseFloat(formData.new_salary);
    } else if (type === 'promotion') {
      data.old_title = employee.job_title;
      data.new_title = formData.new_title;
    } else if (type === 'bonus') {
      data.bonus_amount = parseFloat(formData.bonus_amount);
      data.bonus_reason = formData.bonus_reason;
    } else if (type === 'warning') {
      data.warning_type = formData.warning_type;
      data.warning_severity = formData.warning_severity;
    }

    await onSubmit(data);
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      event_date: new Date().toISOString().split('T')[0],
      description: '',
      new_salary: '',
      bonus_amount: '',
      bonus_reason: '',
      new_title: '',
      warning_type: 'verbal',
      warning_severity: 'low',
    });
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(salary);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.job_title}</p>
          </div>

          <div className="space-y-2">
            <Label>Date de l'événement</Label>
            <Input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
          </div>

          {type === 'raise' && (
            <>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Salaire actuel</p>
                <p className="text-lg font-semibold">{formatSalary(employee.salary_current)}</p>
              </div>
              <div className="space-y-2">
                <Label>Nouveau salaire annuel (€)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 55000"
                  value={formData.new_salary}
                  onChange={(e) => setFormData({ ...formData, new_salary: e.target.value })}
                  required
                />
                {formData.new_salary && employee.salary_current && (
                  <p className="text-xs text-success">
                    +{(((parseFloat(formData.new_salary) - employee.salary_current) / employee.salary_current) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </>
          )}

          {type === 'promotion' && (
            <>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Poste actuel</p>
                <p className="text-sm font-medium">{employee.job_title}</p>
              </div>
              <div className="space-y-2">
                <Label>Nouveau poste</Label>
                <Input
                  placeholder="Ex: Directeur Commercial"
                  value={formData.new_title}
                  onChange={(e) => setFormData({ ...formData, new_title: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'bonus' && (
            <>
              <div className="space-y-2">
                <Label>Montant du bonus (€)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 5000"
                  value={formData.bonus_amount}
                  onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Raison du bonus</Label>
                <Input
                  placeholder="Ex: Performance exceptionnelle Q4"
                  value={formData.bonus_reason}
                  onChange={(e) => setFormData({ ...formData, bonus_reason: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'warning' && (
            <>
              <div className="space-y-2">
                <Label>Type d'avertissement</Label>
                <select
                  className="w-full h-10 rounded-lg bg-secondary border border-border px-3"
                  value={formData.warning_type}
                  onChange={(e) => setFormData({ ...formData, warning_type: e.target.value })}
                >
                  <option value="verbal">Verbal</option>
                  <option value="written">Écrit</option>
                  <option value="final">Final (avant licenciement)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sévérité</Label>
                <select
                  className="w-full h-10 rounded-lg bg-secondary border border-border px-3"
                  value={formData.warning_severity}
                  onChange={(e) => setFormData({ ...formData, warning_severity: e.target.value })}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Description / Notes</Label>
            <Textarea
              placeholder="Ajoutez des détails..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
