import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreVertical, Mail, Phone, TrendingUp, Award, 
  Banknote, AlertTriangle, DoorOpen, Eye, Loader2,
  Calendar, Building2, Trash2
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
import { EmployeeDetailPanel } from './EmployeeDetailPanel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, differenceInMonths, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmployeeTableProps {
  employees: Employee[];
  careerEvents?: any[];
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<boolean>;
  onTerminate: (id: string, reason: string, date: string, details?: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAddCareerEvent: (data: any) => Promise<any>;
}

export function EmployeeTable({ 
  employees, 
  careerEvents = [],
  onUpdate, 
  onTerminate, 
  onDelete,
  onAddCareerEvent 
}: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showRaiseDialog, setShowRaiseDialog] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getContractBadge = (type: string | null) => {
    const colors: Record<string, string> = {
      CDI: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      CDD: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Stage: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Freelance: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      Alternance: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };
    return colors[type || 'CDI'] || colors.CDI;
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return '-';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(salary);
  };

  const getSeniority = (hireDate: string | null) => {
    if (!hireDate) return '-';
    const years = differenceInYears(new Date(), new Date(hireDate));
    const months = differenceInMonths(new Date(), new Date(hireDate)) % 12;
    if (years > 0) {
      return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mois` : ''}`;
    }
    return `${months} mois`;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const openAction = (employee: Employee, action: 'raise' | 'promotion' | 'bonus' | 'warning' | 'termination' | 'detail') => {
    setSelectedEmployee(employee);
    switch (action) {
      case 'raise': setShowRaiseDialog(true); break;
      case 'promotion': setShowPromotionDialog(true); break;
      case 'bonus': setShowBonusDialog(true); break;
      case 'warning': setShowWarningDialog(true); break;
      case 'termination': setShowTerminationDialog(true); break;
      case 'detail': setShowDetailPanel(true); break;
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Collaborateur</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Contrat</TableHead>
              <TableHead className="text-right">Salaire</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Ancienneté</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow 
                key={employee.id} 
                className={`hover:bg-muted/30 cursor-pointer ${!employee.is_active ? 'opacity-60' : ''}`}
                onClick={() => openAction(employee, 'detail')}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={employee.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-400 text-white text-sm">
                        {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{employee.name}</p>
                      <p className="text-sm text-primary truncate">{employee.job_title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-sm">{employee.department || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getContractBadge(employee.contract_type)} variant="outline">
                    {employee.contract_type || 'CDI'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-emerald-600">
                  {formatSalary(employee.salary_current)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-sm">
                      {employee.hire_date ? format(new Date(employee.hire_date), 'dd MMM yyyy', { locale: fr }) : '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{getSeniority(employee.hire_date)}</span>
                </TableCell>
                <TableCell>
                  {employee.is_active ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Actif</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">Inactif</Badge>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openAction(employee, 'detail')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {employee.is_active ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openAction(employee, 'raise')}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Augmentation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(employee, 'promotion')}>
                            <Award className="w-4 h-4 mr-2" />
                            Promotion
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(employee, 'bonus')}>
                            <Banknote className="w-4 h-4 mr-2" />
                            Bonus
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(employee, 'warning')}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Avertissement
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openAction(employee, 'termination')}
                            className="text-destructive"
                          >
                            <DoorOpen className="w-4 h-4 mr-2" />
                            Départ / Licenciement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            {deletingId === employee.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                            <AlertDialogAction 
                              onClick={() => handleDelete(employee.id)} 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Career Event Dialogs */}
      {selectedEmployee && (
        <>
          <CareerEventDialog
            open={showRaiseDialog}
            onOpenChange={setShowRaiseDialog}
            type="raise"
            employee={selectedEmployee}
            onSubmit={onAddCareerEvent}
          />
          <CareerEventDialog
            open={showPromotionDialog}
            onOpenChange={setShowPromotionDialog}
            type="promotion"
            employee={selectedEmployee}
            onSubmit={onAddCareerEvent}
          />
          <CareerEventDialog
            open={showBonusDialog}
            onOpenChange={setShowBonusDialog}
            type="bonus"
            employee={selectedEmployee}
            onSubmit={onAddCareerEvent}
          />
          <CareerEventDialog
            open={showWarningDialog}
            onOpenChange={setShowWarningDialog}
            type="warning"
            employee={selectedEmployee}
            onSubmit={onAddCareerEvent}
          />
          <TerminationDialog
            open={showTerminationDialog}
            onOpenChange={setShowTerminationDialog}
            employee={selectedEmployee}
            onSubmit={onTerminate}
          />
          <EmployeeDetailPanel
            open={showDetailPanel}
            onOpenChange={setShowDetailPanel}
            employee={selectedEmployee}
            careerEvents={careerEvents.filter(e => e.employee_id === selectedEmployee.id)}
            onUpdate={onUpdate}
          />
        </>
      )}
    </>
  );
}
