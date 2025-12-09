import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompanyAlert } from '@/hooks/useEnrichedCompanies';
import { 
  AlertTriangle, Bell, CheckCircle, TrendingUp, TrendingDown, 
  Users, ExternalLink, Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompanyAlertsListProps {
  alerts: CompanyAlert[];
  onMarkAsRead: (id: string) => Promise<boolean>;
}

export function CompanyAlertsList({ alerts, onMarkAsRead }: CompanyAlertsListProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'risk_high':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'opportunity_high':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'financial_growth':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'financial_decline':
        return <TrendingDown className="h-5 w-5 text-amber-400" />;
      case 'new_executive':
        return <Users className="h-5 w-5 text-blue-400" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critique</Badge>;
      case 'high':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Élevé</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Modéré</Badge>;
      case 'low':
        return <Badge variant="secondary">Faible</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const unreadAlerts = alerts.filter(a => !a.is_read);
  const readAlerts = alerts.filter(a => a.is_read);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertes ({alerts.length})
          </span>
          {unreadAlerts.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400">
              {unreadAlerts.length} non lue{unreadAlerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-4 text-emerald-400" />
            <p className="text-lg font-medium">Aucune alerte</p>
            <p className="text-sm">Tout semble en ordre pour cette entreprise</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {/* Unread Alerts */}
              {unreadAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Non lues</h3>
                  {unreadAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.alert_type)}
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.content}
                            </p>
                          </div>
                        </div>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>
                            {format(new Date(alert.detected_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                          {alert.source_name && (
                            <>
                              <span>•</span>
                              <span>{alert.source_name}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.source_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={alert.source_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Source
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onMarkAsRead(alert.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Marquer lu
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Read Alerts */}
              {readAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Lues</h3>
                  {readAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-4 rounded-lg bg-muted/20 border border-border/50 space-y-3 opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.alert_type)}
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.content}
                            </p>
                          </div>
                        </div>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(alert.detected_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </span>
                        {alert.source_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={alert.source_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Source
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
