import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building, Plus, Search, Euro, Target } from 'lucide-react';
import { useAIIntelligence, SalesDeal } from '@/hooks/useAIIntelligence';

interface DealSelectorProps {
  selectedDealId: string | null;
  onSelectDeal: (deal: SalesDeal | null) => void;
  onCreateDeal?: (deal: SalesDeal) => void;
}

export function DealSelector({ selectedDealId, onSelectDeal, onCreateDeal }: DealSelectorProps) {
  const { deals, createDeal } = useAIIntelligence();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [newDeal, setNewDeal] = useState({
    title: '',
    contact_name: '',
    contact_email: '',
    value: 0,
  });

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.contact_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const handleCreateDeal = async () => {
    if (!newDeal.title) return;
    setCreating(true);
    
    const created = await createDeal({
      ...newDeal,
      status: 'lead_created',
      probability: 30,
    });
    
    if (created) {
      onSelectDeal(created);
      onCreateDeal?.(created);
      setIsCreateOpen(false);
      setIsOpen(false);
      setNewDeal({ title: '', contact_name: '', contact_email: '', value: 0 });
    }
    setCreating(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead_created: 'bg-slate-500',
      contacted: 'bg-blue-500',
      qualifying: 'bg-indigo-500',
      qualified: 'bg-purple-500',
      proposal_sent: 'bg-pink-500',
      negotiation: 'bg-orange-500',
      won: 'bg-green-500',
      lost: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Building className="w-4 h-4" />
        Lier à un Deal
      </Label>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start h-auto py-3">
            {selectedDeal ? (
              <div className="flex items-center gap-3 w-full">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedDeal.status)}`} />
                <div className="text-left flex-1">
                  <div className="font-medium">{selectedDeal.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {selectedDeal.contact_name && <span>{selectedDeal.contact_name}</span>}
                    {selectedDeal.value && (
                      <span className="flex items-center gap-1">
                        <Euro className="w-3 h-3" />
                        {selectedDeal.value.toLocaleString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Sélectionner ou créer un deal...</span>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sélectionner un Deal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un deal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un Deal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre du deal *</Label>
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
                    <div>
                      <Label>Valeur (€)</Label>
                      <Input
                        type="number"
                        value={newDeal.value}
                        onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateDeal} disabled={creating || !newDeal.title}>
                      {creating ? 'Création...' : 'Créer'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    onSelectDeal(null);
                    setIsOpen(false);
                  }}
                >
                  Aucun deal (analyse libre)
                </Button>
                
                {filteredDeals.map((deal) => (
                  <Button
                    key={deal.id}
                    variant={deal.id === selectedDealId ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-auto py-3"
                    onClick={() => {
                      onSelectDeal(deal);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(deal.status)}`} />
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium truncate">{deal.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          {deal.contact_name && <span className="truncate">{deal.contact_name}</span>}
                          {deal.value && (
                            <Badge variant="outline" className="shrink-0">
                              €{deal.value.toLocaleString('fr-FR')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {deal.probability && (
                        <Badge variant="secondary" className="shrink-0">
                          {deal.probability}%
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
                
                {filteredDeals.length === 0 && search && (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    Aucun deal trouvé
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
