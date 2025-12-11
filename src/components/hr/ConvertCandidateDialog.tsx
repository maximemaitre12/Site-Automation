import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserCheck, Star } from 'lucide-react';
import { Candidate } from '@/hooks/useHR';
import { Employee } from '@/hooks/useEmployees';

interface ConvertCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  onConvert: (candidateId: string, employeeData: Partial<Employee>) => Promise<Employee | null>;
}

export function ConvertCandidateDialog({ 
  open, 
  onOpenChange, 
  candidate,
  onConvert 
}: ConvertCandidateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    contract_type: 'CDI',
    hire_date: new Date().toISOString().split('T')[0],
    salary_current: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await onConvert(candidate.id, {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      job_title: formData.job_title,
      department: formData.department || null,
      contract_type: formData.contract_type,
      hire_date: formData.hire_date,
      salary_current: formData.salary_current ? parseFloat(formData.salary_current) : null,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({
      job_title: '',
      department: '',
      contract_type: 'CDI',
      hire_date: new Date().toISOString().split('T')[0],
      salary_current: '',
    });
  };

  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-success" />
            Embaucher ce candidat
          </DialogTitle>
          <DialogDescription>
            Convertir {candidate.name} en employé
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Candidate summary */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold">
                {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">{candidate.email}</p>
              </div>
              {candidate.match_score && (
                <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-sm font-semibold">{candidate.match_score}%</span>
                </div>
              )}
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 5).map((skill: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Poste attribué *</Label>
            <Input
              placeholder="Ex: Commercial Junior"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Département</Label>
              <Input
                placeholder="Ventes, Tech..."
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

          <Button type="submit" className="w-full bg-success hover:bg-success/90" disabled={isSubmitting || !formData.job_title}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
            Embaucher
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
