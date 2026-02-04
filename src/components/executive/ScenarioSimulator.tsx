import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Beaker, Play, RotateCcw, TrendingUp, TrendingDown, 
  DollarSign, Users, Target, ArrowRight, Sparkles, Loader2,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';

interface SimulationResult {
  scenario: string;
  impact: {
    revenue: number;
    margin: number;
    roi: number;
    timeline: string;
  };
  risks: string[];
  opportunities: string[];
  confidence: number;
  projectionData: Array<{ month: string; baseline: number; simulated: number }>;
}

const presetScenarios = [
  {
    id: 'growth',
    name: 'Croissance Agressive',
    icon: TrendingUp,
    description: 'Augmentation des investissements marketing de 50%',
    params: { marketingBudget: 150, salesTeam: 120, pricing: 100 },
  },
  {
    id: 'efficiency',
    name: 'Optimisation Coûts',
    icon: Target,
    description: 'Réduction des coûts opérationnels de 20%',
    params: { marketingBudget: 80, salesTeam: 90, pricing: 105 },
  },
  {
    id: 'expansion',
    name: 'Expansion Marché',
    icon: Users,
    description: 'Lancement sur un nouveau segment de marché',
    params: { marketingBudget: 130, salesTeam: 140, pricing: 95 },
  },
];

export function ScenarioSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [params, setParams] = useState({
    marketingBudget: 100, // % of current
    salesTeam: 100, // % of current
    pricing: 100, // % of current
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate simulated results based on params
    const revenueImpact = ((params.marketingBudget - 100) * 0.3) + 
                          ((params.salesTeam - 100) * 0.4) + 
                          ((params.pricing - 100) * -0.2);
    
    const marginImpact = ((params.pricing - 100) * 0.5) - 
                         ((params.marketingBudget - 100) * 0.1) -
                         ((params.salesTeam - 100) * 0.15);

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const projectionData = months.map((month, i) => {
      const baseline = 100000 + (i * 5000) + (Math.random() * 10000);
      const growthFactor = 1 + (revenueImpact / 100) * (i / 12);
      return {
        month,
        baseline: Math.round(baseline),
        simulated: Math.round(baseline * growthFactor),
      };
    });

    setResult({
      scenario: selectedScenario ? 
        presetScenarios.find(s => s.id === selectedScenario)?.name || 'Personnalisé' : 
        'Personnalisé',
      impact: {
        revenue: Math.round(revenueImpact * 10) / 10,
        margin: Math.round(marginImpact * 10) / 10,
        roi: Math.round((revenueImpact - marginImpact) * 1.5 * 10) / 10,
        timeline: revenueImpact > 10 ? '6-9 mois' : revenueImpact > 0 ? '3-6 mois' : '12+ mois',
      },
      risks: revenueImpact > 20 ? [
        'Surcharge potentielle des équipes commerciales',
        'Risque de dilution de la marge brute',
        'Besoins en recrutement accélérés',
      ] : revenueImpact < 0 ? [
        'Perte de parts de marché potentielle',
        'Démotivation des équipes',
      ] : [
        'Adaptation du marché incertaine',
        'Timing de retour sur investissement variable',
      ],
      opportunities: [
        'Gain de parts de marché sur le segment premium',
        'Amélioration de la notoriété de marque',
        'Économies d\'échelle sur les opérations',
      ],
      confidence: 75 + Math.random() * 20,
      projectionData,
    });

    setIsSimulating(false);
  };

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setSelectedScenario(preset.id);
    setParams(preset.params);
  };

  const reset = () => {
    setSelectedScenario(null);
    setParams({ marketingBudget: 100, salesTeam: 100, pricing: 100 });
    setResult(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Beaker className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <span>Simulateur de Scénarios</span>
            <p className="text-xs font-normal text-muted-foreground mt-0.5">
              Jumeau numérique de votre business
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="configure" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="configure">Configuration</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="flex-1 space-y-6">
            {/* Preset Scenarios */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Scénarios Prédéfinis</Label>
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
              <Label className="text-xs text-muted-foreground">Paramètres Personnalisés</Label>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Budget Marketing</Label>
                  <Badge variant="outline">{params.marketingBudget}%</Badge>
                </div>
                <Slider
                  value={[params.marketingBudget]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, marketingBudget: v }));
                    setSelectedScenario(null);
                  }}
                  min={50}
                  max={200}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Taille Équipe Commerciale</Label>
                  <Badge variant="outline">{params.salesTeam}%</Badge>
                </div>
                <Slider
                  value={[params.salesTeam]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, salesTeam: v }));
                    setSelectedScenario(null);
                  }}
                  min={50}
                  max={200}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Niveau de Prix</Label>
                  <Badge variant="outline">{params.pricing}%</Badge>
                </div>
                <Slider
                  value={[params.pricing]}
                  onValueChange={([v]) => {
                    setParams(p => ({ ...p, pricing: v }));
                    setSelectedScenario(null);
                  }}
                  min={80}
                  max={130}
                  step={5}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={runSimulation} disabled={isSimulating}>
                {isSimulating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Simuler
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
                <div className="grid grid-cols-2 gap-3">
                  <Card className={cn(
                    "p-3",
                    result.impact.revenue >= 0 ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className={cn("w-4 h-4", result.impact.revenue >= 0 ? "text-emerald-500" : "text-red-500")} />
                      <span className="text-xs text-muted-foreground">Impact CA</span>
                    </div>
                    <div className={cn("text-xl font-bold", result.impact.revenue >= 0 ? "text-emerald-500" : "text-red-500")}>
                      {result.impact.revenue > 0 ? '+' : ''}{result.impact.revenue}%
                    </div>
                  </Card>

                  <Card className={cn(
                    "p-3",
                    result.impact.margin >= 0 ? "border-blue-500/30 bg-blue-500/5" : "border-amber-500/30 bg-amber-500/5"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className={cn("w-4 h-4", result.impact.margin >= 0 ? "text-blue-500" : "text-amber-500")} />
                      <span className="text-xs text-muted-foreground">Impact Marge</span>
                    </div>
                    <div className={cn("text-xl font-bold", result.impact.margin >= 0 ? "text-blue-500" : "text-amber-500")}>
                      {result.impact.margin > 0 ? '+' : ''}{result.impact.margin}%
                    </div>
                  </Card>

                  <Card className="p-3 border-violet-500/30 bg-violet-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-violet-500" />
                      <span className="text-xs text-muted-foreground">ROI Estimé</span>
                    </div>
                    <div className="text-xl font-bold text-violet-500">
                      {result.impact.roi > 0 ? '+' : ''}{result.impact.roi}%
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Confiance</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {Math.round(result.confidence)}%
                    </div>
                  </Card>
                </div>

                {/* Projection Chart */}
                <Card className="p-4">
                  <div className="text-sm font-medium mb-3">Projection 12 mois</div>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.projectionData}>
                        <defs>
                          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-[10px]" />
                        <YAxis className="text-[10px]" tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number, name: string) => [
                            `${(value/1000).toFixed(0)}k€`,
                            name === 'baseline' ? 'Baseline' : 'Simulé'
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="baseline"
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="3 3"
                          fillOpacity={1}
                          fill="url(#colorBaseline)"
                        />
                        <Area
                          type="monotone"
                          dataKey="simulated"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSimulated)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Risks & Opportunities */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="text-xs font-medium text-red-500 mb-2">Risques identifiés</div>
                    <ul className="space-y-1">
                      {result.risks.map((risk, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-1">
                          <span className="text-red-500">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-3">
                    <div className="text-xs font-medium text-emerald-500 mb-2">Opportunités</div>
                    <ul className="space-y-1">
                      {result.opportunities.map((opp, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-1">
                          <span className="text-emerald-500">•</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
