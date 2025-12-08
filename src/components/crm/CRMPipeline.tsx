import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  Plus, 
  MoreVertical,
  DollarSign,
  Calendar as CalendarIcon,
  Building2,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  GripVertical,
  Brain,
  Filter,
  Trash2,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Opportunity } from '@/hooks/useCRM';
import { cn } from '@/lib/utils';

interface CRMPipelineProps {
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

export function CRMPipeline({ crm }: CRMPipelineProps) {
  const { stages, opportunities, companies, contacts, createOpportunity, updateOpportunity, deleteOpportunity, moveOpportunityStage, loading } = crm;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [draggedOpportunity, setDraggedOpportunity] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    company_id: '',
    contact_id: '',
    stage_id: '',
    expected_close_date: undefined as Date | undefined,
    description: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<string, Opportunity[]> = {};
    stages.forEach(stage => {
      grouped[stage.id] = [];
    });
    opportunities
      .filter(o => o.status === 'open')
      .filter(o => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          o.name.toLowerCase().includes(searchLower) ||
          o.company?.name?.toLowerCase().includes(searchLower) ||
          o.contact?.first_name?.toLowerCase().includes(searchLower) ||
          o.contact?.last_name?.toLowerCase().includes(searchLower)
        );
      })
      .forEach(opp => {
        if (opp.stage_id && grouped[opp.stage_id]) {
          grouped[opp.stage_id].push(opp);
        }
      });
    return grouped;
  }, [opportunities, stages, searchQuery]);

  const getStageValue = (stageId: string) => {
    return (opportunitiesByStage[stageId] || []).reduce((sum, o) => sum + (o.value || 0), 0);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    const data = {
      name: formData.name,
      value: formData.value ? parseFloat(formData.value) : 0,
      company_id: formData.company_id || null,
      contact_id: formData.contact_id || null,
      stage_id: formData.stage_id || stages[0]?.id || null,
      expected_close_date: formData.expected_close_date ? format(formData.expected_close_date, 'yyyy-MM-dd') : null,
      description: formData.description || null,
    };
    
    if (selectedOpportunity) {
      await updateOpportunity(selectedOpportunity.id, data);
    } else {
      await createOpportunity(data);
    }
    
    setIsAddDialogOpen(false);
    setSelectedOpportunity(null);
    resetForm();
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData({
      name: opportunity.name,
      value: opportunity.value?.toString() || '',
      company_id: opportunity.company_id || '',
      contact_id: opportunity.contact_id || '',
      stage_id: opportunity.stage_id || '',
      expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : undefined,
      description: opportunity.description || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette opportunité ?')) {
      await deleteOpportunity(id);
    }
  };

  const handleMarkWon = async (id: string) => {
    await updateOpportunity(id, { status: 'won', actual_close_date: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleMarkLost = async (id: string) => {
    await updateOpportunity(id, { status: 'lost', actual_close_date: format(new Date(), 'yyyy-MM-dd') });
  };

  const resetForm = () => {
    setFormData({ name: '', value: '', company_id: '', contact_id: '', stage_id: '', expected_close_date: undefined, description: '' });
  };

  const handleDragStart = (opportunityId: string) => {
    setDraggedOpportunity(opportunityId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (draggedOpportunity) {
      await moveOpportunityStage(draggedOpportunity, stageId);
      setDraggedOpportunity(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une opportunité..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setSelectedOpportunity(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle opportunité
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedOpportunity ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nom de l'opportunité *</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contrat annuel ACME"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant (€)</Label>
                  <Input 
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Étape</Label>
                  <Select value={formData.stage_id} onValueChange={(value) => setFormData({ ...formData, stage_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                            {stage.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Entreprise</Label>
                <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Select value={formData.contact_id} onValueChange={(value) => setFormData({ ...formData, contact_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de closing prévue</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expected_close_date ? format(formData.expected_close_date, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expected_close_date}
                      onSelect={(date) => setFormData({ ...formData, expected_close_date: date })}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'opportunité..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.name}>
                  {selectedOpportunity ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="flex-1">
        <div className="flex gap-4 pb-4 min-w-max">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="w-80 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <Card className={cn(
                "border-border/50 bg-card/30 backdrop-blur-sm h-full",
                draggedOpportunity && "ring-2 ring-primary/20"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {(opportunitiesByStage[stage.id] || []).length}
                      </Badge>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatCurrency(getStageValue(stage.id))}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(opportunitiesByStage[stage.id] || []).map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className={cn(
                        "cursor-grab active:cursor-grabbing border-border/50 bg-card hover:shadow-md transition-all",
                        draggedOpportunity === opportunity.id && "opacity-50"
                      )}
                      draggable
                      onDragStart={() => handleDragStart(opportunity.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <p className="font-medium text-sm truncate">{opportunity.name}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-primary">
                                {formatCurrency(opportunity.value || 0)}
                              </span>
                            </div>
                            {opportunity.company && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate">{opportunity.company.name}</span>
                              </div>
                            )}
                            {opportunity.contact && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span className="truncate">{opportunity.contact.first_name} {opportunity.contact.last_name}</span>
                              </div>
                            )}
                            {opportunity.expected_close_date && (
                              <div className="flex items-center gap-1 mt-2">
                                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                <span className={cn(
                                  "text-xs",
                                  new Date(opportunity.expected_close_date) < new Date() ? "text-destructive" : "text-muted-foreground"
                                )}>
                                  {format(new Date(opportunity.expected_close_date), 'dd MMM', { locale: fr })}
                                </span>
                              </div>
                            )}
                            {(opportunity.ai_risk_score || 0) > 50 && (
                              <Badge variant="destructive" className="mt-2 text-xs gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                À risque
                              </Badge>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(opportunity)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Brain className="h-4 w-4 mr-2" />
                                Analyser avec l'IA
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleMarkWon(opportunity.id)} className="text-success">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Marquer gagné
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkLost(opportunity.id)} className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Marquer perdu
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(opportunity.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(opportunitiesByStage[stage.id] || []).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Aucune opportunité
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
