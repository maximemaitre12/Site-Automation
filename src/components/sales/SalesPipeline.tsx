import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Euro, 
  Calendar, 
  User, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Loader2,
  GripVertical
} from 'lucide-react';
import { useAIIntelligence, SalesDeal } from '@/hooks/useAIIntelligence';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const SALES_STATUSES = [
  { value: 'lead_created', label: 'Lead', color: 'bg-slate-500', order: 1 },
  { value: 'contacted', label: 'Contacté', color: 'bg-blue-500', order: 2 },
  { value: 'qualifying', label: 'Qualification', color: 'bg-indigo-500', order: 3 },
  { value: 'qualified', label: 'Qualifié', color: 'bg-purple-500', order: 4 },
  { value: 'proposal_sent', label: 'Proposition', color: 'bg-pink-500', order: 5 },
  { value: 'negotiation', label: 'Négociation', color: 'bg-orange-500', order: 6 },
  { value: 'won', label: 'Gagné', color: 'bg-green-500', order: 7 },
  { value: 'lost', label: 'Perdu', color: 'bg-red-500', order: 8 },
];

interface DealActivity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting';
  content: string;
  created_at: string;
}

// Calcul du score IA basé sur les données réelles
function calculateAIScore(deal: SalesDeal): { score: number; factors: { label: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }[] } {
  const factors: { label: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }[] = [];
  let score = 50;

  // Valeur du deal
  if ((deal.value || 0) > 50000) {
    factors.push({ label: 'Gros deal (>50k€)', impact: 'positive', weight: 10 });
    score += 10;
  } else if ((deal.value || 0) > 10000) {
    factors.push({ label: 'Deal moyen', impact: 'neutral', weight: 5 });
    score += 5;
  } else if ((deal.value || 0) < 1000) {
    factors.push({ label: 'Petit deal', impact: 'negative', weight: -5 });
    score -= 5;
  }

  // Contact renseigné
  if (deal.contact_email && deal.contact_name) {
    factors.push({ label: 'Contact complet', impact: 'positive', weight: 10 });
    score += 10;
  } else if (!deal.contact_email && !deal.contact_name) {
    factors.push({ label: 'Pas de contact', impact: 'negative', weight: -15 });
    score -= 15;
  }

  // Date de closing
  if (deal.expected_close_date) {
    const daysUntilClose = differenceInDays(new Date(deal.expected_close_date), new Date());
    if (daysUntilClose < 0) {
      factors.push({ label: 'Date dépassée', impact: 'negative', weight: -20 });
      score -= 20;
    } else if (daysUntilClose <= 7) {
      factors.push({ label: 'Closing imminent', impact: 'positive', weight: 15 });
      score += 15;
    } else if (daysUntilClose <= 30) {
      factors.push({ label: 'Closing ce mois', impact: 'positive', weight: 10 });
      score += 10;
    }
  } else {
    factors.push({ label: 'Pas de date prévue', impact: 'negative', weight: -10 });
    score -= 10;
  }

  // Probabilité
  if ((deal.probability || 0) >= 70) {
    factors.push({ label: 'Haute probabilité', impact: 'positive', weight: 15 });
    score += 15;
  } else if ((deal.probability || 0) <= 20) {
    factors.push({ label: 'Faible probabilité', impact: 'negative', weight: -10 });
    score -= 10;
  }

  // Dernière activité
  if (deal.last_activity_at) {
    const daysSinceActivity = differenceInDays(new Date(), new Date(deal.last_activity_at));
    if (daysSinceActivity > 14) {
      factors.push({ label: `Inactif depuis ${daysSinceActivity}j`, impact: 'negative', weight: -15 });
      score -= 15;
    } else if (daysSinceActivity <= 3) {
      factors.push({ label: 'Activité récente', impact: 'positive', weight: 10 });
      score += 10;
    }
  } else {
    const daysSinceCreation = differenceInDays(new Date(), new Date(deal.created_at));
    if (daysSinceCreation > 7) {
      factors.push({ label: 'Jamais contacté', impact: 'negative', weight: -20 });
      score -= 20;
    }
  }

  // Source
  if (deal.source) {
    factors.push({ label: 'Source connue', impact: 'positive', weight: 5 });
    score += 5;
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

// Recommandations d'actions intelligentes
function getRecommendations(deal: SalesDeal): string[] {
  const recommendations: string[] = [];
  const now = new Date();

  if (!deal.contact_email && !deal.contact_name) {
    recommendations.push("🔴 Priorité : Identifier le contact décisionnaire");
  }

  if (!deal.expected_close_date) {
    recommendations.push("📅 Définir une date de closing prévisionnelle");
  } else if (isPast(new Date(deal.expected_close_date))) {
    recommendations.push("⚠️ Date dépassée - Replanifier le closing");
  }

  const daysSinceActivity = deal.last_activity_at 
    ? differenceInDays(now, new Date(deal.last_activity_at))
    : differenceInDays(now, new Date(deal.created_at));

  if (daysSinceActivity > 7) {
    recommendations.push(`📞 Relancer - ${daysSinceActivity} jours sans activité`);
  }

  if ((deal.probability || 0) < 30 && deal.status !== 'lead_created') {
    recommendations.push("💡 Probabilité faible - Qualifier les objections");
  }

  if (deal.status === 'proposal_sent' && daysSinceActivity > 3) {
    recommendations.push("📧 Suivre la proposition envoyée");
  }

  if (deal.status === 'negotiation') {
    recommendations.push("🎯 Identifier les derniers points de blocage");
  }

  if ((deal.value || 0) > 50000 && !deal.description) {
    recommendations.push("📝 Documenter ce deal stratégique");
  }

  return recommendations.slice(0, 3);
}

// Détection des risques
function getRiskLevel(deal: SalesDeal): { level: 'high' | 'medium' | 'low'; reasons: string[] } {
  const reasons: string[] = [];
  let riskScore = 0;

  if (deal.expected_close_date && isPast(new Date(deal.expected_close_date))) {
    reasons.push("Date de closing dépassée");
    riskScore += 30;
  }

  const daysSinceActivity = deal.last_activity_at 
    ? differenceInDays(new Date(), new Date(deal.last_activity_at))
    : differenceInDays(new Date(), new Date(deal.created_at));

  if (daysSinceActivity > 14) {
    reasons.push(`Aucune activité depuis ${daysSinceActivity} jours`);
    riskScore += 25;
  }

  if (!deal.contact_email && !deal.contact_name) {
    reasons.push("Aucun contact identifié");
    riskScore += 20;
  }

  if ((deal.probability || 0) < 20) {
    reasons.push("Probabilité très faible");
    riskScore += 15;
  }

  if (riskScore >= 50) return { level: 'high', reasons };
  if (riskScore >= 25) return { level: 'medium', reasons };
  return { level: 'low', reasons };
}

export function SalesPipeline() {
  const { deals, loading, createDeal, updateDealStatus, deleteDeal } = useAIIntelligence();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
  const [creating, setCreating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  
  const [newDeal, setNewDeal] = useState({
    title: '',
    contact_name: '',
    contact_email: '',
    value: 0,
    probability: 30,
    expected_close_date: '',
    source: '',
    description: '',
  });

  // Stats calculées
  const stats = useMemo(() => {
    const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.status));
    const wonDeals = deals.filter(d => d.status === 'won');
    const lostDeals = deals.filter(d => d.status === 'lost');
    
    const pipelineValue = activeDeals.reduce((sum, d) => sum + ((d.value || 0) * ((d.probability || 0) / 100)), 0);
    const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const conversionRate = (wonDeals.length + lostDeals.length) > 0 
      ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100 
      : 0;
    
    const avgDealValue = wonDeals.length > 0 
      ? wonValue / wonDeals.length 
      : 0;

    const atRiskDeals = activeDeals.filter(d => getRiskLevel(d).level === 'high');

    return { 
      activeCount: activeDeals.length, 
      pipelineValue, 
      wonValue, 
      conversionRate,
      avgDealValue,
      atRiskCount: atRiskDeals.length
    };
  }, [deals]);

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
      probability: 30,
      expected_close_date: '',
      source: '',
      description: '',
    });
    setIsCreateOpen(false);
    setCreating(false);
  };

  const handleAddNote = async () => {
    if (!selectedDeal || !newNote.trim()) return;
    setSavingNote(true);
    
    try {
      // Update description with note appended
      const timestamp = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr });
      const currentDesc = selectedDeal.description || '';
      const newDesc = currentDesc 
        ? `${currentDesc}\n\n---\n📝 ${timestamp}\n${newNote}`
        : `📝 ${timestamp}\n${newNote}`;

      const { error } = await supabase
        .from('sales_deals')
        .update({ 
          description: newDesc,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', selectedDeal.id);

      if (error) throw error;

      setSelectedDeal({ ...selectedDeal, description: newDesc, last_activity_at: new Date().toISOString() });
      setNewNote('');
      toast({ title: 'Note ajoutée' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    } finally {
      setSavingNote(false);
    }
  };

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = async (status: string) => {
    if (draggedDeal) {
      await updateDealStatus(draggedDeal, status);
    }
    setDraggedDeal(null);
    setDragOverStatus(null);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStatus(null);
  };

  const getStatusLabel = (status: string) => {
    return SALES_STATUSES.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    return SALES_STATUSES.find(s => s.value === status)?.color || 'bg-gray-500';
  };

  const dealsByStatus = useMemo(() => {
    return SALES_STATUSES.reduce((acc, status) => {
      acc[status.value] = deals.filter(d => d.status === status.value);
      return acc;
    }, {} as Record<string, SalesDeal[]>);
  }, [deals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats - Plus utiles */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Deals actifs</span>
            </div>
            <div className="text-2xl font-bold">{stats.activeCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Pipeline pondéré</span>
            </div>
            <div className="text-2xl font-bold">€{stats.pipelineValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Revenus gagnés</span>
            </div>
            <div className="text-2xl font-bold text-green-600">€{stats.wonValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Taux conversion</span>
            </div>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Euro className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Deal moyen</span>
            </div>
            <div className="text-2xl font-bold">€{stats.avgDealValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>

        <Card className={stats.atRiskCount > 0 ? 'bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`h-4 w-4 ${stats.atRiskCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">À risque</span>
            </div>
            <div className={`text-2xl font-bold ${stats.atRiskCount > 0 ? 'text-red-600' : ''}`}>{stats.atRiskCount}</div>
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
                Ajoutez une nouvelle opportunité commerciale
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
                  <Label>Date de closing</Label>
                  <Input
                    type="date"
                    value={newDeal.expected_close_date}
                    onChange={(e) => setNewDeal({ ...newDeal, expected_close_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Select value={newDeal.source} onValueChange={(v) => setNewDeal({ ...newDeal, source: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Site web</SelectItem>
                      <SelectItem value="referral">Recommandation</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="cold_call">Prospection</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
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
                {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Kanban avec Drag & Drop */}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4" style={{ minWidth: 'max-content' }}>
          {SALES_STATUSES.map((status) => (
            <div 
              key={status.value} 
              className={`w-72 flex-shrink-0 transition-all ${dragOverStatus === status.value ? 'scale-[1.02]' : ''}`}
              onDragOver={(e) => handleDragOver(e, status.value)}
              onDrop={() => handleDrop(status.value)}
              onDragLeave={() => setDragOverStatus(null)}
            >
              <Card className={`h-full ${dragOverStatus === status.value ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <CardTitle className="text-sm">{status.label}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{dealsByStatus[status.value]?.length || 0}</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    €{(dealsByStatus[status.value] || []).reduce((sum, d) => sum + (d.value || 0), 0).toLocaleString('fr-FR')}
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[450px]">
                    <div className="space-y-2 p-1">
                      {(dealsByStatus[status.value] || []).map((deal) => {
                        const { score, factors } = calculateAIScore(deal);
                        const risk = getRiskLevel(deal);
                        const recommendations = getRecommendations(deal);
                        
                        return (
                          <Card 
                            key={deal.id} 
                            className={`cursor-pointer hover:shadow-md transition-all group ${
                              draggedDeal === deal.id ? 'opacity-50 scale-95' : ''
                            } ${risk.level === 'high' ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' : ''}`}
                            onClick={() => setSelectedDeal(deal)}
                            draggable
                            onDragStart={() => handleDragStart(deal.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-2 flex-1">
                                  <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 cursor-grab" />
                                  <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
                                </div>
                                {risk.level === 'high' && (
                                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              
                              <div className="space-y-1.5 text-xs text-muted-foreground">
                                {deal.contact_name && (
                                  <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">{deal.contact_name}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <Euro className="h-3 w-3" />
                                  {(deal.value || 0).toLocaleString('fr-FR')}
                                </div>
                                {deal.expected_close_date && (
                                  <div className={`flex items-center gap-1.5 ${
                                    isPast(new Date(deal.expected_close_date)) ? 'text-red-500' : ''
                                  }`}>
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(deal.expected_close_date), 'dd MMM', { locale: fr })}
                                    {isPast(new Date(deal.expected_close_date)) && ' (retard)'}
                                  </div>
                                )}
                              </div>

                              {/* Score et indicateurs */}
                              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                                <div className="flex items-center gap-1.5">
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  <div className="flex items-center gap-1">
                                    <Progress value={score} className="w-12 h-1.5" />
                                    <span className="text-xs font-medium">{score}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {deal.probability || 0}%
                                </Badge>
                              </div>

                              {/* Recommandation prioritaire */}
                              {recommendations.length > 0 && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                                    {recommendations[0]}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Deal Detail Dialog - Beaucoup plus complet */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDeal && (() => {
            const { score, factors } = calculateAIScore(selectedDeal);
            const risk = getRiskLevel(selectedDeal);
            const recommendations = getRecommendations(selectedDeal);
            
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-xl">{selectedDeal.title}</DialogTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedDeal.status)}>
                          {getStatusLabel(selectedDeal.status)}
                        </Badge>
                        {risk.level === 'high' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            À risque
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">€{(selectedDeal.value || 0).toLocaleString('fr-FR')}</div>
                      <div className="text-sm text-muted-foreground">{selectedDeal.probability}% probabilité</div>
                    </div>
                  </div>
                </DialogHeader>
                
                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="ai">Score IA</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Infos contact */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <Label className="text-muted-foreground text-xs">Contact</Label>
                          <p className="font-medium">{selectedDeal.contact_name || 'Non renseigné'}</p>
                          {selectedDeal.contact_email && (
                            <a href={`mailto:${selectedDeal.contact_email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedDeal.contact_email}
                            </a>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <Label className="text-muted-foreground text-xs">Date de closing</Label>
                          <p className={`font-medium ${selectedDeal.expected_close_date && isPast(new Date(selectedDeal.expected_close_date)) ? 'text-red-500' : ''}`}>
                            {selectedDeal.expected_close_date 
                              ? format(new Date(selectedDeal.expected_close_date), 'dd MMMM yyyy', { locale: fr })
                              : 'Non définie'}
                          </p>
                          {selectedDeal.source && (
                            <p className="text-sm text-muted-foreground">Source: {selectedDeal.source}</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommandations */}
                    {recommendations.length > 0 && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Actions recommandées
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Risques */}
                    {risk.level !== 'low' && (
                      <Card className={risk.level === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-950/20' : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20'}>
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-sm flex items-center gap-2 ${risk.level === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                            <AlertTriangle className="h-4 w-4" />
                            Signaux de risque
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          {risk.reasons.map((reason, i) => (
                            <p key={i} className="text-sm">{reason}</p>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Changer statut */}
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
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4 mt-4">
                    {/* Score global */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Score IA</h3>
                            <p className="text-sm text-muted-foreground">Basé sur l'analyse des données du deal</p>
                          </div>
                          <div className={`text-4xl font-bold ${
                            score >= 70 ? 'text-green-500' : score >= 40 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {score}
                          </div>
                        </div>
                        <Progress value={score} className="h-3" />
                      </CardContent>
                    </Card>

                    {/* Facteurs */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Facteurs d'analyse</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {factors.map((factor, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                            <div className="flex items-center gap-2">
                              {factor.impact === 'positive' && <TrendingUp className="h-4 w-4 text-green-500" />}
                              {factor.impact === 'negative' && <TrendingDown className="h-4 w-4 text-red-500" />}
                              {factor.impact === 'neutral' && <Activity className="h-4 w-4 text-amber-500" />}
                              <span className="text-sm">{factor.label}</span>
                            </div>
                            <Badge variant={factor.impact === 'positive' ? 'default' : factor.impact === 'negative' ? 'destructive' : 'secondary'}>
                              {factor.weight > 0 ? '+' : ''}{factor.weight}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4 mt-4">
                    {/* Ajouter une note */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Ajouter une note</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Compte-rendu d'appel, point de blocage, prochaine action..."
                          rows={3}
                        />
                        <Button onClick={handleAddNote} disabled={savingNote || !newNote.trim()} size="sm">
                          {savingNote && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Ajouter
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Historique */}
                    {selectedDeal.description && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Historique & Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-wrap text-sm">
                            {selectedDeal.description}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
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
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
