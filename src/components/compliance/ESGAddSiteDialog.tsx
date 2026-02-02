import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Building2 } from 'lucide-react';

interface ESGAddSiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    site_name: string;
    location: string;
    scope1_emissions: number;
    scope2_emissions: number;
    scope3_emissions: number;
    reporting_year: number;
    reporting_period: string;
    data_source: string | null;
    is_verified: boolean;
    notes: string | null;
  }) => void;
  isLoading?: boolean;
}

export function ESGAddSiteDialog({ open, onOpenChange, onSubmit, isLoading }: ESGAddSiteDialogProps) {
  const [siteName, setSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [scope1, setScope1] = useState('');
  const [scope2, setScope2] = useState('');
  const [scope3, setScope3] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [dataSource, setDataSource] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      site_name: siteName,
      location,
      scope1_emissions: parseFloat(scope1) || 0,
      scope2_emissions: parseFloat(scope2) || 0,
      scope3_emissions: parseFloat(scope3) || 0,
      reporting_year: parseInt(year),
      reporting_period: 'annual',
      data_source: dataSource || null,
      is_verified: isVerified,
      notes: notes || null,
    });
    // Reset form
    setSiteName('');
    setLocation('');
    setScope1('');
    setScope2('');
    setScope3('');
    setDataSource('');
    setIsVerified(false);
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Ajouter un site
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nom du site *</Label>
              <Input
                id="site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Siège Social"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Paris, France"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scope1">Scope 1 (tCO₂e)</Label>
              <Input
                id="scope1"
                type="number"
                step="0.01"
                min="0"
                value={scope1}
                onChange={(e) => setScope1(e.target.value)}
                placeholder="0"
              />
              <p className="text-[10px] text-muted-foreground">Émissions directes</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope2">Scope 2 (tCO₂e)</Label>
              <Input
                id="scope2"
                type="number"
                step="0.01"
                min="0"
                value={scope2}
                onChange={(e) => setScope2(e.target.value)}
                placeholder="0"
              />
              <p className="text-[10px] text-muted-foreground">Énergie achetée</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope3">Scope 3 (tCO₂e)</Label>
              <Input
                id="scope3"
                type="number"
                step="0.01"
                min="0"
                value={scope3}
                onChange={(e) => setScope3(e.target.value)}
                placeholder="0"
              />
              <p className="text-[10px] text-muted-foreground">Chaîne de valeur</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Année de reporting *</Label>
              <Input
                id="year"
                type="number"
                min="2020"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-source">Source des données</Label>
              <Input
                id="data-source"
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                placeholder="Bilan Carbone, ADEME..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="verified" className="cursor-pointer">Données vérifiées</Label>
              <p className="text-xs text-muted-foreground">Auditées par un tiers indépendant</p>
            </div>
            <Switch
              id="verified"
              checked={isVerified}
              onCheckedChange={setIsVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Méthodologie, périmètre, facteurs d'émission utilisés..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !siteName || !location}>
              {isLoading ? 'Ajout...' : 'Ajouter le site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
