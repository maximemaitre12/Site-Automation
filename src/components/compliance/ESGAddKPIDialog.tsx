import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3 } from 'lucide-react';

interface ESGAddKPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    kpi_name: string;
    kpi_value: number;
    kpi_unit: string;
    target_value: number | null;
    description: string | null;
    reporting_year: number;
    data_source: string | null;
    is_verified: boolean;
  }) => void;
  isLoading?: boolean;
}

const COMMON_KPIS = [
  { name: 'Intensité Carbone', unit: 'tCO₂e/M€', description: 'Émissions par million de CA' },
  { name: 'Part Énergie Renouvelable', unit: '%', description: "Part d'électricité renouvelable" },
  { name: 'Taux de Recyclage', unit: '%', description: 'Déchets recyclés vs total' },
  { name: 'Consommation Eau', unit: 'm³/employé', description: 'Consommation eau par employé' },
  { name: 'Électrification Flotte', unit: '%', description: 'Véhicules électriques dans la flotte' },
  { name: 'Custom', unit: '', description: '' },
];

export function ESGAddKPIDialog({ open, onOpenChange, onSubmit, isLoading }: ESGAddKPIDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [kpiName, setKpiName] = useState('');
  const [kpiValue, setKpiValue] = useState('');
  const [kpiUnit, setKpiUnit] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [dataSource, setDataSource] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const preset = COMMON_KPIS.find(k => k.name === value);
    if (preset && preset.name !== 'Custom') {
      setKpiName(preset.name);
      setKpiUnit(preset.unit);
      setDescription(preset.description);
    } else {
      setKpiName('');
      setKpiUnit('');
      setDescription('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      kpi_name: kpiName,
      kpi_value: parseFloat(kpiValue) || 0,
      kpi_unit: kpiUnit,
      target_value: targetValue ? parseFloat(targetValue) : null,
      description: description || null,
      reporting_year: parseInt(year),
      data_source: dataSource || null,
      is_verified: isVerified,
    });
    // Reset
    setSelectedPreset('');
    setKpiName('');
    setKpiValue('');
    setKpiUnit('');
    setTargetValue('');
    setDescription('');
    setDataSource('');
    setIsVerified(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Ajouter un KPI ESG
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type de KPI</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un KPI standard ou personnalisé" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_KPIS.map((kpi) => (
                  <SelectItem key={kpi.name} value={kpi.name}>
                    {kpi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kpi-name">Nom du KPI *</Label>
              <Input
                id="kpi-name"
                value={kpiName}
                onChange={(e) => setKpiName(e.target.value)}
                placeholder="Intensité Carbone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kpi-unit">Unité *</Label>
              <Input
                id="kpi-unit"
                value={kpiUnit}
                onChange={(e) => setKpiUnit(e.target.value)}
                placeholder="tCO₂e/M€, %, m³..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kpi-value">Valeur actuelle *</Label>
              <Input
                id="kpi-value"
                type="number"
                step="0.01"
                value={kpiValue}
                onChange={(e) => setKpiValue(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-value">Objectif cible</Label>
              <Input
                id="target-value"
                type="number"
                step="0.01"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kpi-year">Année *</Label>
              <Input
                id="kpi-year"
                type="number"
                min="2020"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-source">Source des données</Label>
            <Input
              id="data-source"
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              placeholder="Système de gestion énergie, factures, audit..."
            />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !kpiName || !kpiUnit || !kpiValue}>
              {isLoading ? 'Ajout...' : 'Ajouter le KPI'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
