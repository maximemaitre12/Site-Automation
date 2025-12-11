import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees';

interface AddEmployeeDialogProps {
  children: React.ReactNode;
  onAdd: (data: Partial<Employee>) => Promise<Employee | null>;
}

export function AddEmployeeDialog({ children, onAdd }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job_title: '',
    department: '',
    contract_type: 'CDI',
    hire_date: new Date().toISOString().split('T')[0],
    salary_current: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await onAdd({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      job_title: formData.job_title,
      department: formData.department || null,
      contract_type: formData.contract_type,
      hire_date: formData.hire_date,
      salary_current: formData.salary_current ? parseFloat(formData.salary_current) : null,
    });

    setIsSubmitting(false);
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      job_title: '',
      department: '',
      contract_type: 'CDI',
      hire_date: new Date().toISOString().split('T')[0],
      salary_current: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Ajouter un employé
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Nom complet *</Label>
              <Input
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="jean@entreprise.fr"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Poste *</Label>
              <Input
                placeholder="Commercial, Manager, Développeur..."
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Input
                placeholder="Ventes, Tech, RH..."
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Type de contrat</Label>
              <select
                className="w-full h-10 rounded-lg bg-secondary border border-border px-3"
                value={formData.contract_type}
                onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Date d'entrée</Label>
              <Input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Salaire annuel (€)</Label>
              <Input
                type="number"
                placeholder="45000"
                value={formData.salary_current}
                onChange={(e) => setFormData({ ...formData, salary_current: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !formData.name || !formData.job_title}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Ajouter l'employé
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
