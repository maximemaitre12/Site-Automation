import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Beaker, Play, RotateCcw, TrendingUp, TrendingDown, 
  DollarSign, Target, ArrowRight, Sparkles, Loader2,
  AlertTriangle, Lightbulb, Shield, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePredictiveIntelligence, SimulationResult } from '@/hooks/usePredictiveIntelligence';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Bar, BarChart
} from 'recharts';

const presetScenarios = [
  {
    id: 'growth',
    name: 'Croissance Agressive',
    icon: TrendingUp,
    description: '+50% Marketing, +30% Commerciaux',
    params: { marketingChange: 50, salesTeamChange: 30, pricingChange: 0, costReduction: 0 },
  },
  {
    id: 'pricing',
    name: 'Repositionnement Prix',
    icon: DollarSign,
    description: '+10% Prix, optimisation coûts',
    params: { pricingChange: 10, costReduction: 15, marketingChange: 0, salesTeamChange: 0 },
  },
  {
    id: 'efficiency',
    name: 'Optimisation Opérationnelle',
    icon: Target,
    description: '-20% Coûts, focus marge',
    params: { costReduction: 20, marketingChange: -10, salesTeamChange: -5, pricingChange: 5 },
  },
];

export function StrategicSimulator() {
  const { runSimulation, simulationResult, loading } = usePredictiveIntelligence();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [params, setParams] = useState({
    pricingChange: 0,
    salesTeamChange: 0,
    marketingChange: 0,
    costReduction: 0,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRunSimulation = async () => {
    const simResult = await runSimulation(params, 12);
    if (simResult) {
      setResult(simResult);
    }
  };

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setSelectedScenario(preset.id);
    setParams(preset.params);
  };

  const reset = () => {
    setSelectedScenario(null);
    setParams({ pricingChange: 0, salesTeamChange: 0, marketingChange: 0, costReduction: 0 });
    setResult(null);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
    return `${value.toFixed(0)}€`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <Beaker className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <span>Simulateur Stratégique</span>
            <p className="text-xs font-normal text-muted-foreground mt-0.5">
              Jumeau numérique • Stress tests ComEx
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="configure" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="configure">Configuration</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Analyse</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="flex-1 space-y-5">
            {/* Preset Scenarios */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Scénarios Stratégiques Prédéfinis
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {presetScenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant={selectedScenario === scenario.id ? 'default' : 'outline'}
                    className="h-auto py-3 justify-start gap-3"
                    onClick={() => applyPreset(scenario)}
                  >
                    <scenario.icon className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{scenario.name}</div>
                      <div className="text-xs opacity-70">{scenario.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Parameters */}
            <div className="space-y-4">
              <Label className="text-xs text-muted-foreground">
                Paramètres de Simulation (% de variation)
              </Label>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Politique Tarifaire</Label>
                  <Badge variant={params.pricingChange > 0 ? 'default' : params.pricingChange < 0 ? 'destructive' : 'secondary'}>
                    {params.pricingChange > 0 ? '+' : ''}{params.pricingChange}%
                  </Badge>
                </div>
                <Slider
                  value={[params.pricingChange]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, pricingChange: v }));
                    setSelectedScenario(null);
                  }}
                  min={-20}
                  max={30}
                  step={1}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Impact: élasticité négative sur volume, positif sur marge
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Force Commerciale</Label>
                  <Badge variant={params.salesTeamChange > 0 ? 'default' : params.salesTeamChange < 0 ? 'destructive' : 'secondary'}>
                    {params.salesTeamChange > 0 ? '+' : ''}{params.salesTeamChange}%
                  </Badge>
                </div>
                <Slider
                  value={[params.salesTeamChange]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, salesTeamChange: v }));
                    setSelectedScenario(null);
                  }}
                  min={-30}
                  max={50}
                  step={5}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Rendements décroissants au-delà de +30%
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Budget Marketing</Label>
                  <Badge variant={params.marketingChange > 0 ? 'default' : params.marketingChange < 0 ? 'destructive' : 'secondary'}>
                    {params.marketingChange > 0 ? '+' : ''}{params.marketingChange}%
                  </Badge>
                </div>
                <Slider
                  value={[params.marketingChange]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, marketingChange: v }));
                    setSelectedScenario(null);
                  }}
                  min={-30}
                  max={100}
                  step={5}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Effet retardé de 2-3 mois, saturation possible
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Réduction Coûts</Label>
                  <Badge variant={params.costReduction > 0 ? 'default' : 'secondary'}>
                    -{params.costReduction}%
                  </Badge>
                </div>
                <Slider
                  value={[params.costReduction]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, costReduction: v }));
                    setSelectedScenario(null);
                  }}
                  min={0}
                  max={30}
                  step={5}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Au-delà de 15%: risque de sous-investissement
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleRunSimulation} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Lancer la Simulation
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1 space-y-4">
            {result && (
              <>
                {/* Impact Summary */}
                <div className="grid grid-cols-3 gap-2">
                  <Card className={cn(
                    "p-3",
                    result.delta.revenue >= 0 ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                  )}>
                    <div className="flex items-center gap-1 mb-1">
                      {result.delta.revenue >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-[10px] text-muted-foreground">CA</span>
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      result.delta.revenue >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {result.delta.revenue > 0 ? '+' : ''}{result.delta.revenue}%
                    </div>
                  </Card>

                  <Card className={cn(
                    "p-3",
                    result.delta.margin >= 0 ? "border-blue-500/30 bg-blue-500/5" : "border-amber-500/30 bg-amber-500/5"
                  )}>
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] text-muted-foreground">Marge</span>
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      result.delta.margin >= 0 ? "text-blue-600" : "text-amber-600"
                    )}>
                      {result.delta.margin > 0 ? '+' : ''}{result.delta.margin}%
                    </div>
                  </Card>

                  <Card className={cn(
                    "p-3",
                    result.delta.profit >= 0 ? "border-violet-500/30 bg-violet-500/5" : "border-red-500/30 bg-red-500/5"
                  )}>
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-violet-500" />
                      <span className="text-[10px] text-muted-foreground">Profit</span>
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      result.delta.profit >= 0 ? "text-violet-600" : "text-red-600"
                    )}>
                      {result.delta.profit > 0 ? '+' : ''}{result.delta.profit}%
                    </div>
                  </Card>
                </div>

                {/* Comparison Chart */}
                <Card className="p-4">
                  <div className="text-sm font-medium mb-3">Comparaison Base vs Simulé</div>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'CA', base: result.baseCase.revenue, simulated: result.simulatedCase.revenue },
                          { name: 'Marge', base: result.baseCase.margin, simulated: result.simulatedCase.margin },
                          { name: 'Profit', base: result.baseCase.profit / 1000, simulated: result.simulatedCase.profit / 1000 },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-[10px]" />
                        <YAxis type="category" dataKey="name" className="text-[10px]" width={50} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="base" fill="hsl(var(--muted-foreground))" name="Base" />
                        <Bar dataKey="simulated" fill="hsl(var(--primary))" name="Simulé" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Recommendation */}
                <Card className="p-4 border-primary/30 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">Recommandation ComEx</div>
                      <p className="text-xs text-muted-foreground">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Second Order Effects & Risks */}
                <div className="grid grid-cols-2 gap-3">
                  {result.secondOrderEffects.length > 0 && (
                    <Card className="p-3">
                      <div className="text-xs font-medium text-amber-600 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Effets de second ordre
                      </div>
                      <ul className="space-y-1">
                        {result.secondOrderEffects.map((effect, i) => (
                          <li key={i} className="text-[11px] text-muted-foreground flex gap-1">
                            <span className="text-amber-500">•</span>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {result.hiddenRisks.length > 0 && (
                    <Card className="p-3 border-red-500/30 bg-red-500/5">
                      <div className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Risques non évidents
                      </div>
                      <ul className="space-y-1">
                        {result.hiddenRisks.map((risk, i) => (
                          <li key={i} className="text-[11px] text-muted-foreground flex gap-1">
                            <span className="text-red-500">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
