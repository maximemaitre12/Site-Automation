import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, TrendingUp, AlertTriangle, Target, RefreshCw,
  ChevronRight, Gauge, BarChart3, Activity, Sparkles,
  Shield, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePredictiveIntelligence, ProbabilisticScenario, TippingPoint } from '@/hooks/usePredictiveIntelligence';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

export function PredictiveIntelligencePanel() {
  const { data, loading, error, fetchForecast } = usePredictiveIntelligence();
  const [activeTab, setActiveTab] = useState('scenarios');

  useEffect(() => {
    fetchForecast(12);
  }, [fetchForecast]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
    return `${value.toFixed(0)}€`;
  };

  if (loading && !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
              <Brain className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <span>Intelligence Prédictive</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Modélisation probabiliste • Niveau CAC 40
              </p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2">
            {data?.historicalAccuracy && (
              <Badge variant="outline" className="gap-1">
                <Shield className="w-3 h-3" />
                Fiabilité: {Math.round(data.historicalAccuracy.overall)}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchForecast(12)}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-destructive bg-destructive/10">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scenarios" className="gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              Scénarios
            </TabsTrigger>
            <TabsTrigger value="projections" className="gap-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              Projections
            </TabsTrigger>
            <TabsTrigger value="tipping" className="gap-1 text-xs">
              <AlertTriangle className="w-3 h-3" />
              Seuils Critiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="flex-1 space-y-4 mt-0">
            {/* Scenario Cards */}
            <div className="grid gap-3">
              {data?.scenarios.map((scenario, index) => (
                <ScenarioCard key={index} scenario={scenario} formatCurrency={formatCurrency} />
              ))}
            </div>

            {/* Model Confidence */}
            {data?.historicalAccuracy && (
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Fiabilité du modèle</span>
                  </div>
                  <Badge 
                    variant={data.historicalAccuracy.confidence === 'high' ? 'default' : 'secondary'}
                  >
                    {data.historicalAccuracy.confidence === 'high' ? 'Haute' : 
                     data.historicalAccuracy.confidence === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all"
                        style={{ width: `${data.historicalAccuracy.overall}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(data.historicalAccuracy.overall)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tendance: {data.historicalAccuracy.trend === 'improving' ? '📈 En amélioration' : 
                             data.historicalAccuracy.trend === 'declining' ? '📉 En baisse' : '➡️ Stable'}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projections" className="flex-1 mt-0">
            {data?.monthlyProjections && data.monthlyProjections.length > 0 && (
              <div className="space-y-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthlyProjections}>
                      <defs>
                        <linearGradient id="colorCentral" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHaussier" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBaissier" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                          `${formatCurrency(value)}`,
                          name === 'central' ? 'Central (55%)' : 
                          name === 'haussier' ? 'Haussier (25%)' : 'Baissier (20%)'
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="haussier"
                        name="Haussier"
                        stroke="#10b981"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fillOpacity={1}
                        fill="url(#colorHaussier)"
                      />
                      <Area
                        type="monotone"
                        dataKey="central"
                        name="Central"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCentral)"
                      />
                      <Area
                        type="monotone"
                        dataKey="baissier"
                        name="Baissier"
                        stroke="#ef4444"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fillOpacity={1}
                        fill="url(#colorBaissier)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <Card className="p-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Points de basculement entre scénarios
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="w-3 h-3 mt-0.5 text-emerald-500" />
                      <span><strong>Vers Haussier:</strong> Amélioration du taux de conversion &gt;40%, nouveau segment activé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowDownRight className="w-3 h-3 mt-0.5 text-red-500" />
                      <span><strong>Vers Baissier:</strong> Churn &gt;15%, rallongement cycle +30%, pression prix concurrentielle</span>
                    </li>
                  </ul>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tipping" className="flex-1 mt-0 space-y-3">
            {data?.tippingPoints && data.tippingPoints.length > 0 ? (
              data.tippingPoints.map((tp, index) => (
                <TippingPointCard key={index} point={tp} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                <h4 className="font-medium text-emerald-600">Aucun seuil critique détecté</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Tous les indicateurs sont dans les plages acceptables
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ScenarioCard({ 
  scenario, 
  formatCurrency 
}: { 
  scenario: ProbabilisticScenario; 
  formatCurrency: (v: number) => string;
}) {
  const isPositive = scenario.name.includes('Haussier');
  const isNegative = scenario.name.includes('Baissier');

  return (
    <Card className={cn(
      "p-4 transition-colors",
      isPositive && "border-emerald-500/30 bg-emerald-500/5",
      isNegative && "border-red-500/30 bg-red-500/5",
      !isPositive && !isNegative && "border-primary/30 bg-primary/5"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium flex items-center gap-2">
            {scenario.name}
            <Badge variant="outline" className="text-[10px]">
              {scenario.probability}%
            </Badge>
          </h4>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(scenario.revenue)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Marge</div>
          <div className="font-semibold">{scenario.margin.toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground mb-1">Drivers clés:</div>
        {scenario.drivers.slice(0, 2).map((driver, i) => (
          <div key={i} className="text-xs flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            {driver}
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Activity className="w-3 h-3" />
          Confiance: {scenario.confidence}%
        </div>
        <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full",
              isPositive ? "bg-emerald-500" : isNegative ? "bg-red-500" : "bg-primary"
            )}
            style={{ width: `${scenario.confidence}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function TippingPointCard({ point }: { point: TippingPoint }) {
  const riskColors = {
    critical: 'border-red-500 bg-red-500/10 text-red-700',
    high: 'border-amber-500 bg-amber-500/10 text-amber-700',
    medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-700',
  };

  const riskLabels = {
    critical: 'CRITIQUE',
    high: 'ÉLEVÉ',
    medium: 'MODÉRÉ',
  };

  const isBreached = point.direction === 'above' 
    ? point.currentValue > point.threshold 
    : point.currentValue < point.threshold;

  return (
    <Card className={cn("p-4", riskColors[point.risk])}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium text-sm">{point.metric}</span>
        </div>
        <Badge variant="destructive" className="text-[10px]">
          {riskLabels[point.risk]}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="text-xs opacity-70">Valeur actuelle</div>
          <div className={cn(
            "text-xl font-bold",
            isBreached ? "text-red-600" : "text-current"
          )}>
            {point.currentValue}
          </div>
        </div>
        <div className="text-xl">→</div>
        <div>
          <div className="text-xs opacity-70">Seuil critique</div>
          <div className="text-xl font-bold">{point.threshold}</div>
        </div>
      </div>

      <p className="text-xs mb-3">{point.impact}</p>

      <div className="flex items-center gap-1 text-xs opacity-70">
        <Clock className="w-3 h-3" />
        Horizon: {point.timeframe}
      </div>
    </Card>
  );
}
