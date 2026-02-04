import { BusinessMetric } from '@/hooks/useExecutiveInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Headphones, Shield, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessMetricsPanelProps {
  metrics: BusinessMetric[];
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  revenue: { icon: DollarSign, color: 'text-emerald-500', label: 'Revenus' },
  sales: { icon: BarChart3, color: 'text-blue-500', label: 'Ventes' },
  hr: { icon: Users, color: 'text-violet-500', label: 'RH' },
  support: { icon: Headphones, color: 'text-amber-500', label: 'Support' },
  compliance: { icon: Shield, color: 'text-red-500', label: 'Conformité' },
  operations: { icon: BarChart3, color: 'text-slate-500', label: 'Opérations' },
};

function formatValue(value: number | string): string {
  if (typeof value === 'string') return value;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
  return value.toString();
}

export function BusinessMetricsPanel({ metrics }: BusinessMetricsPanelProps) {
  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, BusinessMetric[]>);

  const getTrendIcon = (direction?: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Métriques Business</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => {
          const config = categoryConfig[category] || categoryConfig.operations;
          const Icon = config.icon;

          return (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Icon className={cn("w-4 h-4", config.color)} />
                  {config.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryMetrics.map((metric) => (
                  <div 
                    key={metric.id}
                    className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {formatValue(metric.value)}
                      </span>
                      {metric.trendDirection && getTrendIcon(metric.trendDirection)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Aucune métrique disponible</p>
            <p className="text-sm mt-1">
              Les métriques apparaîtront lorsque vous aurez des données dans vos outils AETHER.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
