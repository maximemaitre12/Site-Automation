import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, Phone, Building2, Calendar, Briefcase, 
  Banknote, Clock, TrendingUp, Award, AlertTriangle,
  DoorOpen, FileText, User
} from 'lucide-react';
import { Employee, CareerEvent } from '@/hooks/useEmployees';
import { format, differenceInMonths, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmployeeDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  careerEvents: CareerEvent[];
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<boolean>;
}

export function EmployeeDetailPanel({ 
  open, 
  onOpenChange, 
  employee, 
  careerEvents,
  onUpdate 
}: EmployeeDetailPanelProps) {
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
      return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
    }
    return `${months} mois`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'raise': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'promotion': return <Award className="w-4 h-4 text-blue-500" />;
      case 'bonus': return <Banknote className="w-4 h-4 text-amber-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'raise': return 'Augmentation';
      case 'promotion': return 'Promotion';
      case 'bonus': return 'Bonus';
      case 'warning': return 'Avertissement';
      case 'training': return 'Formation';
      case 'evaluation': return 'Évaluation';
      default: return type;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'raise': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'promotion': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'bonus': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'warning': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const sortedEvents = [...careerEvents].sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] p-0">
        <ScrollArea className="h-full">
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border-2 border-background shadow-lg">
                <AvatarImage src={employee.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-400 text-white text-xl">
                  {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{employee.name}</h2>
                    <p className="text-primary font-medium">{employee.job_title}</p>
                  </div>
                  <Badge className={getContractBadge(employee.contract_type)} variant="outline">
                    {employee.contract_type || 'CDI'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {employee.is_active ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Actif</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">Inactif</Badge>
                  )}
                  {employee.department && (
                    <Badge variant="outline" className="gap-1">
                      <Building2 className="w-3 h-3" />
                      {employee.department}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employee.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{employee.email}</p>
                    </div>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-medium">{employee.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Informations emploi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">Date d'embauche</span>
                    </div>
                    <p className="text-sm font-medium pl-5">
                      {employee.hire_date ? format(new Date(employee.hire_date), 'dd MMMM yyyy', { locale: fr }) : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">Ancienneté</span>
                    </div>
                    <p className="text-sm font-medium pl-5">{getSeniority(employee.hire_date)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Banknote className="w-3.5 h-3.5" />
                      <span className="text-xs">Salaire annuel</span>
                    </div>
                    <p className="text-sm font-medium pl-5 text-emerald-600">{formatSalary(employee.salary_current)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-xs">Département</span>
                    </div>
                    <p className="text-sm font-medium pl-5">{employee.department || '-'}</p>
                  </div>
                </div>

                {/* Departure Info */}
                {!employee.is_active && employee.left_date && (
                  <>
                    <Separator className="my-4" />
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <DoorOpen className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-600">Départ</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Date :</span> {format(new Date(employee.left_date), 'dd MMMM yyyy', { locale: fr })}</p>
                        {employee.left_reason && <p><span className="text-muted-foreground">Raison :</span> {employee.left_reason}</p>}
                        {employee.left_details && <p className="text-muted-foreground mt-2">{employee.left_details}</p>}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Career Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Historique de carrière
                  {sortedEvents.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">{sortedEvents.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedEvents.length > 0 ? (
                  <div className="relative space-y-4">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />
                    
                    {sortedEvents.map((event, idx) => (
                      <div key={event.id} className="relative flex gap-4 pl-4">
                        <div className="absolute left-2.5 w-3 h-3 rounded-full bg-background border-2 border-primary" />
                        <div className="flex-1 ml-4">
                          <div className="flex items-center gap-2 mb-1">
                            {getEventIcon(event.event_type)}
                            <Badge className={getEventColor(event.event_type)} variant="outline">
                              {getEventLabel(event.event_type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {format(new Date(event.event_date), 'dd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          )}
                          {event.event_type === 'raise' && event.new_salary && (
                            <p className="text-sm text-emerald-600 font-medium mt-1">
                              Nouveau salaire : {formatSalary(event.new_salary)}
                              {event.salary_change_percent && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  (+{event.salary_change_percent}%)
                                </span>
                              )}
                            </p>
                          )}
                          {event.event_type === 'promotion' && event.new_title && (
                            <p className="text-sm text-blue-600 font-medium mt-1">
                              Nouveau poste : {event.new_title}
                            </p>
                          )}
                          {event.event_type === 'bonus' && event.bonus_amount && (
                            <p className="text-sm text-amber-600 font-medium mt-1">
                              Montant : {formatSalary(event.bonus_amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun événement de carrière enregistré</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
