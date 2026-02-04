import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, BellOff, AlertTriangle, TrendingUp, Shield, 
  Users, DollarSign, Clock, CheckCircle2, X, Loader2,
  Zap, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutiveAlert {
  id: string;
  type: 'strategic' | 'operational' | 'compliance' | 'market' | 'hr' | 'financial';
  level: 'critical' | 'high' | 'medium';
  title: string;
  summary: string;
  actionRequired: string;
  source: string;
  timestamp: Date;
  dismissed: boolean;
}

const alertTypeConfig = {
  strategic: { icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  operational: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  compliance: { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  market: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  hr: { icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  financial: { icon: DollarSign, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
};

const levelConfig = {
  critical: { color: 'border-red-500 bg-red-500/5', badge: 'bg-red-500' },
  high: { color: 'border-orange-500 bg-orange-500/5', badge: 'bg-orange-500' },
  medium: { color: 'border-yellow-500 bg-yellow-500/5', badge: 'bg-yellow-500' },
};

interface ExecutiveAlertsPanelProps {
  insights?: Array<{
    id: string;
    title: string;
    content: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    suggestedAction?: string;
    createdAt: string;
  }>;
}

export function ExecutiveAlertsPanel({ insights = [] }: ExecutiveAlertsPanelProps) {
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all');

  // Transform insights into executive alerts
  useEffect(() => {
    const transformedAlerts: ExecutiveAlert[] = insights
      .filter(i => i.priority !== 'low')
      .map(insight => {
        // Map category to alert type
        let alertType: ExecutiveAlert['type'] = 'operational';
        const category = insight.category.toLowerCase();
        if (category.includes('vente') || category.includes('sales')) alertType = 'strategic';
        else if (category.includes('conformité') || category.includes('compliance')) alertType = 'compliance';
        else if (category.includes('marché') || category.includes('market')) alertType = 'market';
        else if (category.includes('rh') || category.includes('hr')) alertType = 'hr';
        else if (category.includes('finance')) alertType = 'financial';

        return {
          id: insight.id,
          type: alertType,
          level: insight.priority === 'low' ? 'medium' : insight.priority as 'critical' | 'high' | 'medium',
          title: insight.title,
          summary: insight.content,
          actionRequired: insight.suggestedAction || 'Analyser et décider',
          source: insight.category,
          timestamp: new Date(insight.createdAt),
          dismissed: false,
        };
      });

    setAlerts(transformedAlerts);
  }, [insights]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (a.dismissed) return false;
    if (filter === 'critical') return a.level === 'critical';
    if (filter === 'high') return a.level === 'critical' || a.level === 'high';
    return true;
  });

  const criticalCount = alerts.filter(a => !a.dismissed && a.level === 'critical').length;
  const highCount = alerts.filter(a => !a.dismissed && a.level === 'high').length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={cn(
              'p-2 rounded-lg',
              criticalCount > 0 ? 'bg-red-500/10 animate-pulse' : 'bg-primary/10'
            )}>
              <Bell className={cn('w-5 h-5', criticalCount > 0 ? 'text-red-500' : 'text-primary')} />
            </div>
            <div>
              <span>Alertes Dirigeant</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Push ultra-sélectif • Décisions requises uniquement
              </p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Push</span>
              <Switch 
                checked={pushEnabled} 
                onCheckedChange={setPushEnabled}
                className="scale-75"
              />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full transition-colors',
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            )}
          >
            Toutes ({alerts.filter(a => !a.dismissed).length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1',
              filter === 'critical' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Critiques ({criticalCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1',
              filter === 'high' ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Prioritaires ({highCount})
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500/50" />
                <h4 className="font-medium mb-2">Aucune alerte prioritaire</h4>
                <p className="text-sm text-muted-foreground">
                  Votre tableau de bord stratégique est sous contrôle.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const typeConf = alertTypeConfig[alert.type];
                const levelConf = levelConfig[alert.level];
                const TypeIcon = typeConf.icon;

                return (
                  <Card 
                    key={alert.id} 
                    className={cn('border-l-4 transition-all hover:shadow-md', levelConf.color)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('p-2 rounded-lg flex-shrink-0', typeConf.bg)}>
                          <TypeIcon className={cn('w-4 h-4', typeConf.color)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm">{alert.title}</h4>
                                <Badge className={cn('text-[10px] text-white', levelConf.badge)}>
                                  {alert.level === 'critical' ? 'CRITIQUE' : alert.level === 'high' ? 'PRIORITAIRE' : 'MOYEN'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {alert.timestamp.toLocaleString('fr-FR', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                <span className="mx-1">•</span>
                                {alert.source}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <p className="text-sm mt-2">{alert.summary}</p>

                          <div className="mt-3 p-2 rounded-md bg-primary/5 border border-primary/10">
                            <div className="text-xs font-medium text-primary flex items-center gap-1 mb-1">
                              <Zap className="w-3 h-3" />
                              ACTION REQUISE
                            </div>
                            <p className="text-sm font-medium">{alert.actionRequired}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
