import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader2, Sparkles, Target, Plus } from 'lucide-react';
import { useNegotiationSheets, NegotiationSheet } from '@/hooks/useNegotiationSheets';
import { useAIIntelligence, SalesDeal } from '@/hooks/useAIIntelligence';
import { NegotiationSheetCard } from './NegotiationSheetCard';
import { DealSelector } from './DealSelector';

interface NegotiationSheetGeneratorProps {
  preselectedDeal?: SalesDeal | null;
  onSheetGenerated?: (sheet: NegotiationSheet) => void;
}

export function NegotiationSheetGenerator({ preselectedDeal, onSheetGenerated }: NegotiationSheetGeneratorProps) {
  const { sheets, generateNegotiationSheet, deleteSheet, loading } = useNegotiationSheets();
  const { deals } = useAIIntelligence();
  
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(preselectedDeal || null);
  const [selectedSheet, setSelectedSheet] = useState<NegotiationSheet | null>(null);
  
  const [form, setForm] = useState({
    currentSituation: '',
    product: '',
  });

  const handleGenerate = async () => {
    if (!selectedDeal) return;
    
    setGenerating(true);
    const sheet = await generateNegotiationSheet({
      dealId: selectedDeal.id,
      dealTitle: selectedDeal.title,
      companyName: selectedDeal.title.split(' - ')[0] || selectedDeal.title,
      contactName: selectedDeal.contact_name || 'Non spécifié',
      value: selectedDeal.value || 0,
      currentSituation: form.currentSituation,
      product: form.product,
    });
    
    if (sheet) {
      setSelectedSheet(sheet);
      onSheetGenerated?.(sheet);
      setIsOpen(false);
      setForm({ currentSituation: '', product: '' });
    }
    setGenerating(false);
  };

  // Get sheets for selected deal
  const dealSheets = selectedDeal 
    ? sheets.filter(s => s.deal_id === selectedDeal.id)
    : sheets;

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Fiches de Négociation
        </h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Fiche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Créer une Fiche de Négociation
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <DealSelector
                selectedDealId={selectedDeal?.id || null}
                onSelectDeal={setSelectedDeal}
              />
              
              {selectedDeal && (
                <>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-sm font-medium">{selectedDeal.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedDeal.contact_name && `${selectedDeal.contact_name} • `}
                      {selectedDeal.value && `€${selectedDeal.value.toLocaleString('fr-FR')}`}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Produit/Service proposé</Label>
                    <Input
                      value={form.product}
                      onChange={(e) => setForm(f => ({ ...f, product: e.target.value }))}
                      placeholder="Ex: Pack Enterprise, Consulting, SaaS..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Situation actuelle / Contexte</Label>
                    <Textarea
                      value={form.currentSituation}
                      onChange={(e) => setForm(f => ({ ...f, currentSituation: e.target.value }))}
                      placeholder="Décrivez la situation: où en est la négociation, quels points ont été discutés, quelles objections ont été soulevées..."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={generating || !selectedDeal}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Selected sheet display */}
      {selectedSheet && (
        <NegotiationSheetCard 
          sheet={selectedSheet} 
          expanded 
          onDelete={() => {
            deleteSheet(selectedSheet.id);
            setSelectedSheet(null);
          }}
        />
      )}
      
      {/* List of sheets */}
      {!selectedSheet && (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {dealSheets.map((sheet) => (
              <div key={sheet.id} onClick={() => setSelectedSheet(sheet)}>
                <NegotiationSheetCard sheet={sheet} />
              </div>
            ))}
            
            {dealSheets.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Aucune fiche de négociation
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Créez une fiche pour préparer vos arguments
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      )}
      
      {selectedSheet && (
        <Button 
          variant="ghost" 
          onClick={() => setSelectedSheet(null)}
          className="w-full"
        >
          Voir toutes les fiches
        </Button>
      )}
    </div>
  );
}
