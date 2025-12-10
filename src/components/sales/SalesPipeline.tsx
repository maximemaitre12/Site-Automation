import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  ArrowRight, 
  Trash2, 
  Euro, 
  Calendar, 
  User, 
  Building2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAIIntelligence, SalesDeal } from '@/hooks/useAIIntelligence';

const SALES_STATUSES = [
  { value: 'lead_created', label: 'Lead créé', color: 'bg-gray-500', order: 1 },
  { value: 'contacted', label: 'Contacté', color: 'bg-blue-500', order: 2 },
  { value: 'engaged', label: 'Engagé', color: 'bg-cyan-500', order: 3 },
  { value: 'qualifying', label: 'Qualification', color: 'bg-indigo-500', order: 4 },
  { value: 'qualified', label: 'Qualifié', color: 'bg-purple-500', order: 5 },
  { value: 'proposal_sent', label: 'Proposition', color: 'bg-pink-500', order: 6 },
  { value: 'negotiation', label: 'Négociation', color: 'bg-orange-500', order: 7 },
  { value: 'closing_imminent', label: 'Closing', color: 'bg-amber-500', order: 8 },
  { value: 'won', label: 'Gagné', color: 'bg-green-500', order: 9 },
  { value: 'lost', label: 'Perdu', color: 'bg-red-500', order: 10 },
  { value: 'to_recontact', label: 'À relancer', color: 'bg-yellow-500', order: 11 },
  { value: 'inactive', label: 'Inactif', color: 'bg-slate-400', order: 12 },
];

export function SalesPipeline() {
  const { deals, loading, createDeal, updateDealStatus, deleteDeal } = useAIIntelligence();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
  const [creating, setCreating] = useState(false);
  
  const [newDeal, setNewDeal] = useState({
    title: '',
    contact_name: '',
    contact_email: '',
    value: 0,
    probability: 20,
    expected_close_date: '',
    source: '',
    description: '',
  });

  const handleCreateDeal = async () => {
    if (!newDeal.title) return;
    setCreating(true);
    await createDeal({
      ...newDeal,
      status: 'lead_created',
    });
    setNewDeal({
      title: '',
      contact_name: '',
      contact_email: '',
      value: 0,
      probability: 20,
      expected_close_date: '',
      source: '',
      description: '',
    });
    setIsCreateOpen(false);
    setCreating(false);
  };

  const getStatusLabel = (status: string) => {
    return SALES_STATUSES.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    return SALES_STATUSES.find(s => s.value === status)?.color || 'bg-gray-500';
  };

  const getNextStatus = (currentStatus: string) => {
    const currentOrder = SALES_STATUSES.find(s => s.value === currentStatus)?.order || 0;
    const next = SALES_STATUSES.find(s => s.order === currentOrder + 1);
    return next?.value;
  };

  const dealsByStatus = SALES_STATUSES.reduce((acc, status) => {
    acc[status.value] = (deals as any[]).filter(d => d.status === status.value);
    return acc;
  }, {} as Record<string, any[]>);

  const pipelineValue = (deals as any[])
    .filter(d => !['won', 'lost', 'inactive'].includes(d.status))
    .reduce((sum, d) => sum + ((d.value || 0) * ((d.probability || 0) / 100)), 0);

  const wonValue = (deals as any[])
    .filter(d => d.status === 'won')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deals Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.filter(d => !['won', 'lost', 'inactive'].includes(d.status)).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Pondéré</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">€{pipelineValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus Gagnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">€{wonValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.filter(d => ['won', 'lost'].includes(d.status)).length > 0
                ? ((deals.filter(d => d.status === 'won').length / deals.filter(d => ['won', 'lost'].includes(d.status)).length) * 100).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Deal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pipeline de Vente</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Deal</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle opportunité au pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Titre *</Label>
                <Input
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="Ex: Contrat Enterprise ABC"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact</Label>
                  <Input
                    value={newDeal.contact_name}
                    onChange={(e) => setNewDeal({ ...newDeal, contact_name: e.target.value })}
                    placeholder="Nom du contact"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newDeal.contact_email}
                    onChange={(e) => setNewDeal({ ...newDeal, contact_email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valeur (€)</Label>
                  <Input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Probabilité (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de closing prévue</Label>
                  <Input
                    type="date"
                    value={newDeal.expected_close_date}
                    onChange={(e) => setNewDeal({ ...newDeal, expected_close_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input
                    value={newDeal.source}
                    onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })}
                    placeholder="Ex: Site web, Salon..."
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newDeal.description}
                  onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                  placeholder="Notes sur l'opportunité..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateDeal} disabled={creating || !newDeal.title}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Kanban View */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {SALES_STATUSES.filter(s => !['inactive'].includes(s.value)).map((status) => (
            <div key={status.value} className="w-72 flex-shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <CardTitle className="text-sm">{status.label}</CardTitle>
                    </div>
                    <Badge variant="secondary">{dealsByStatus[status.value]?.length || 0}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    €{(dealsByStatus[status.value] || []).reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {(dealsByStatus[status.value] || []).map((deal) => (
                        <Card 
                          key={deal.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
                              {deal.ai_risk_score && deal.ai_risk_score > 60 && (
                                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="space-y-1 text-xs text-muted-foreground">
                              {deal.contact_name && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {deal.contact_name}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Euro className="h-3 w-3" />
                                €{deal.value.toLocaleString()}
                              </div>
                              {deal.expected_close_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(deal.expected_close_date).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t">
                              <Badge variant="outline" className="text-xs">
                                {deal.probability}%
                              </Badge>
                              {deal.ai_score && (
                                <Badge className="text-xs bg-primary/10 text-primary">
                                  Score: {deal.ai_score}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Deal Detail Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="max-w-lg">
          {selectedDeal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDeal.title}</DialogTitle>
                <DialogDescription>
                  <Badge className={getStatusColor(selectedDeal.status)}>
                    {getStatusLabel(selectedDeal.status)}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Valeur</Label>
                    <p className="font-semibold">€{selectedDeal.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Probabilité</Label>
                    <p className="font-semibold">{selectedDeal.probability}%</p>
                  </div>
                </div>

                {selectedDeal.contact_name && (
                  <div>
                    <Label className="text-muted-foreground">Contact</Label>
                    <p>{selectedDeal.contact_name}</p>
                    {selectedDeal.contact_email && (
                      <p className="text-sm text-muted-foreground">{selectedDeal.contact_email}</p>
                    )}
                  </div>
                )}

                {selectedDeal.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm">{selectedDeal.description}</p>
                  </div>
                )}

                {selectedDeal.ai_factors && selectedDeal.ai_factors.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Facteurs IA</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDeal.ai_factors.map((f: any, i: number) => (
                        <Badge key={i} variant={f.impact === 'positive' ? 'default' : 'destructive'}>
                          {f.factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Change */}
                <div>
                  <Label className="text-muted-foreground">Changer le statut</Label>
                  <Select
                    value={selectedDeal.status}
                    onValueChange={(value) => {
                      updateDealStatus(selectedDeal.id, value);
                      setSelectedDeal({ ...selectedDeal, status: value });
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SALES_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color}`} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteDeal(selectedDeal.id);
                    setSelectedDeal(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
                {getNextStatus(selectedDeal.status) && !['won', 'lost'].includes(selectedDeal.status) && (
                  <Button
                    onClick={() => {
                      const next = getNextStatus(selectedDeal.status);
                      if (next) {
                        updateDealStatus(selectedDeal.id, next);
                        setSelectedDeal({ ...selectedDeal, status: next });
                      }
                    }}
                  >
                    Avancer
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}