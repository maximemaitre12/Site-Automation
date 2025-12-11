import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, Mail, Phone, Briefcase, Building2, Calendar, 
  Banknote, MoreVertical, TrendingUp, Award, AlertTriangle,
  DoorOpen, Trash2, Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Employee } from '@/hooks/useEmployees';
import { CareerEventDialog } from './CareerEventDialog';
import { TerminationDialog } from './TerminationDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EmployeeCardProps {
  employee: Employee;
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<boolean>;
  onTerminate: (id: string, reason: string, date: string, details?: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAddCareerEvent: (data: any) => Promise<any>;
}

export function EmployeeCard({ 
  employee, 
  onUpdate, 
  onTerminate, 
  onDelete,
  onAddCareerEvent 
}: EmployeeCardProps) {
  const [showRaiseDialog, setShowRaiseDialog] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getContractBadge = (type: string | null) => {
    const colors: Record<string, string> = {
      CDI: 'bg-success/20 text-success border-success/30',
      CDD: 'bg-warning/20 text-warning border-warning/30',
      Stage: 'bg-primary/20 text-primary border-primary/30',
      Freelance: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
      Alternance: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    };
    return colors[type || 'CDI'] || colors.CDI;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(employee.id);
    setIsDeleting(false);
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return null;
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(salary);
  };

  return (
    <>
      <Card className={`border-border hover:border-primary/30 transition-all ${!employee.is_active ? 'opacity-60' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate flex items-center gap-2">
                    {employee.name}
                    {!employee.is_active && (
                      <Badge variant="secondary" className="bg-muted">Inactif</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-primary font-medium">{employee.job_title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={getContractBadge(employee.contract_type)}>
                    {employee.contract_type || 'CDI'}
                  </Badge>
                  
                  {employee.is_active && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowRaiseDialog(true)}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Augmentation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowPromotionDialog(true)}>
                          <Award className="w-4 h-4 mr-2" />
                          Promotion
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowBonusDialog(true)}>
                          <Banknote className="w-4 h-4 mr-2" />
                          Bonus
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowWarningDialog(true)}>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Avertissement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setShowTerminationDialog(true)}
                          className="text-destructive"
                        >
                          <DoorOpen className="w-4 h-4 mr-2" />
                          Départ / Licenciement
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {employee.department && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {employee.department}
                  </span>
                )}
                {employee.email && (
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3" />
                    {employee.email}
                  </span>
                )}
                {employee.hire_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Depuis {new Date(employee.hire_date).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {employee.salary_current && (
                  <span className="flex items-center gap-1 text-success">
                    <Banknote className="w-3 h-3" />
                    {formatSalary(employee.salary_current)}/an
                  </span>
                )}
              </div>

              {/* Left info for inactive */}
              {!employee.is_active && employee.left_date && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DoorOpen className="w-3 h-3" />
                    Départ le {new Date(employee.left_date).toLocaleDateString('fr-FR')}
                    {employee.left_reason && ` - ${employee.left_reason}`}
                  </span>
                </div>
              )}
            </div>

            {/* Delete button for inactive employees */}
            {!employee.is_active && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cet employé ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. L'historique de {employee.name} sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Career Event Dialogs */}
      <CareerEventDialog
        open={showRaiseDialog}
        onOpenChange={setShowRaiseDialog}
        type="raise"
        employee={employee}
        onSubmit={onAddCareerEvent}
      />
      <CareerEventDialog
        open={showPromotionDialog}
        onOpenChange={setShowPromotionDialog}
        type="promotion"
        employee={employee}
        onSubmit={onAddCareerEvent}
      />
      <CareerEventDialog
        open={showBonusDialog}
        onOpenChange={setShowBonusDialog}
        type="bonus"
        employee={employee}
        onSubmit={onAddCareerEvent}
      />
      <CareerEventDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        type="warning"
        employee={employee}
        onSubmit={onAddCareerEvent}
      />
      <TerminationDialog
        open={showTerminationDialog}
        onOpenChange={setShowTerminationDialog}
        employee={employee}
        onSubmit={onTerminate}
      />
    </>
  );
}
