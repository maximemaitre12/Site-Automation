import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2,
  X, Clock, TrendingDown, TrendingUp, Users, DollarSign,
  Shield, Headphones, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StrategicInsight } from '@/hooks/useExecutiveInsights';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'sales' | 'hr' | 'support' | 'compliance' | 'finance' | 'system';
  title: string;
  description: string;
  metric?: {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down';
  };
  timestamp: Date;
  isRead: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

interface AlertsPanelProps {
  insights: StrategicInsight[];
}

const typeConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500',
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500',
  },
};

const categoryConfig = {
  sales: { icon: DollarSign, label: 'Ventes' },
  hr: { icon: Users, label: 'RH' },
  support: { icon: Headphones, label: 'Support' },
  compliance: { icon: Shield, label: 'Conformité' },
  finance: { icon: TrendingUp, label: 'Finance' },
  system: { icon: Bell, label: 'Système' },
};

export function AlertsPanel({ insights }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showDismissed, setShowDismissed] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Convert insights to alerts and add simulated real-time alerts
  useEffect(() => {
    const convertedAlerts: Alert[] = insights.map(insight => ({
      id: insight.id,
      type: insight.priority === 'critical' ? 'critical' : 
            insight.priority === 'high' ? 'warning' : 
            insight.priority === 'medium' ? 'info' : 'success',
      category: insight.category.toLowerCase().includes('vente') ? 'sales' :
                insight.category.toLowerCase().includes('rh') ? 'hr' :
                insight.category.toLowerCase().includes('support') ? 'support' :
                insight.category.toLowerCase().includes('conform') ? 'compliance' :
                insight.category.toLowerCase().includes('infra') ? 'system' : 'finance',
      title: insight.title,
      description: insight.content,
      timestamp: new Date(insight.createdAt),
      isRead: false,
      actionLabel: insight.suggestedAction,
    }));

    // Add some simulated real-time alerts for demo
    const demoAlerts: Alert[] = [
      {
        id: 'demo-1',
        type: 'success',
        category: 'sales',
        title: 'Nouveau deal signé',
        description: 'Le contrat TechCorp a été finalisé avec succès.',
        metric: { label: 'Valeur', value: '45,000€', change: 15, trend: 'up' },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        isRead: true,
      },
      {
        id: 'demo-2',
        type: 'info',
        category: 'hr',
        title: 'Entretien planifié',
        description: '3 entretiens sont prévus cette semaine pour le poste de Product Manager.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        isRead: false,
      },
    ];

    setAlerts([...convertedAlerts, ...demoAlerts].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    ));
  }, [insights]);

  const filteredAlerts = alerts.filter(alert => {
    if (dismissedIds.has(alert.id) && !showDismissed) return false;
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'critical') return alert.type === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !dismissedIds.has(a.id)).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !dismissedIds.has(a.id)).length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const dismissAlert = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="relative">
              <Bell className="w-5 h-5 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            Alertes & Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDismissed(!showDismissed)}
            className="text-xs"
          >
            {showDismissed ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showDismissed ? 'Masquer' : 'Afficher'} ignorées
          </Button>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => setFilter('all')}
          >
            Toutes ({alerts.length - dismissedIds.size})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => setFilter('unread')}
          >
            Non lues ({unreadCount})
          </Button>
          <Button
            variant={filter === 'critical' ? 'default' : 'outline'}
            size="sm"
            className={cn("text-xs h-7", criticalCount > 0 && filter !== 'critical' && "border-red-500/50 text-red-500")}
            onClick={() => setFilter('critical')}
          >
            Critiques ({criticalCount})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500/50" />
              <p className="font-medium text-muted-foreground">Aucune alerte</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tout est sous contrôle
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredAlerts.map((alert) => {
                const config = typeConfig[alert.type];
                const catConfig = categoryConfig[alert.category];
                const Icon = config.icon;
                const CatIcon = catConfig.icon;
                const isDismissed = dismissedIds.has(alert.id);

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 transition-all",
                      !alert.isRead && !isDismissed && "bg-primary/5",
                      isDismissed && "opacity-50"
                    )}
                    onClick={() => markAsRead(alert.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              {!alert.isRead && !isDismissed && (
                                <Badge className="h-4 px-1 text-[9px]" variant="default">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {alert.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {alert.metric && (
                          <div className="mt-2 p-2 rounded-lg bg-muted/50 inline-flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{alert.metric.label}:</span>
                            <span className="font-semibold text-sm">{alert.metric.value}</span>
                            {alert.metric.change !== undefined && (
                              <div className={cn(
                                "flex items-center text-xs",
                                alert.metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                              )}>
                                {alert.metric.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 mr-0.5" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-0.5" />
                                )}
                                {Math.abs(alert.metric.change)}%
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="h-5 text-[10px] gap-1">
                              <CatIcon className="w-3 h-3" />
                              {catConfig.label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: fr })}
                            </span>
                          </div>

                          {alert.actionLabel && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              {alert.actionLabel}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
