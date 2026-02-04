import { StrategicInsight } from '@/hooks/useExecutiveInsights';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Info, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategicInsightsPanelProps {
  insights: StrategicInsight[];
}

const priorityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10 border-red-500/30',
    badge: 'bg-red-500 text-white',
  },
  high: {
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'bg-amber-500 text-white',
  },
  medium: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/30',
    badge: 'bg-blue-500 text-white',
  },
  low: {
    icon: Info,
    color: 'text-muted-foreground',
    bg: 'bg-muted/50 border-border',
    badge: 'bg-muted text-muted-foreground',
  },
};

const priorityLabels = {
  critical: 'Critique',
  high: 'Important',
  medium: 'Moyen',
  low: 'Faible',
};

export function StrategicInsightsPanel({ insights }: StrategicInsightsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Conseils Stratégiques</h3>
        <Badge variant="outline" className="ml-2">
          {insights.length} insight(s)
        </Badge>
      </div>

      {insights.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <div className="text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Tout est sous contrôle</p>
            <p className="text-sm mt-1">
              Aucune action urgente requise. Continuez votre excellent travail.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const config = priorityConfig[insight.priority];
            const Icon = config.icon;

            return (
              <Card 
                key={insight.id}
                className={cn("overflow-hidden border", config.bg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5", config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <Badge className={cn("text-[10px] px-1.5 py-0", config.badge)}>
                          {priorityLabels[insight.priority]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.content}
                      </p>
                      {insight.actionable && insight.suggestedAction && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto mt-2 text-primary"
                        >
                          {insight.suggestedAction}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
