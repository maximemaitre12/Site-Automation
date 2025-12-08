import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Target, 
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Brain,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CRMDashboardProps {
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

export function CRMDashboard({ crm }: CRMDashboardProps) {
  const { stats, opportunities, tasks, activities, stages, loading } = crm;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<string, { count: number; value: number; stage: typeof stages[0] }> = {};
    stages.forEach(stage => {
      grouped[stage.id] = { count: 0, value: 0, stage };
    });
    opportunities.filter(o => o.status === 'open').forEach(opp => {
      if (opp.stage_id && grouped[opp.stage_id]) {
        grouped[opp.stage_id].count++;
        grouped[opp.stage_id].value += opp.value || 0;
      }
    });
    return Object.values(grouped);
  }, [opportunities, stages]);

  const recentActivities = activities.slice(0, 5);
  const upcomingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  const atRiskDeals = opportunities.filter(o => o.status === 'open' && (o.ai_risk_score || 0) > 50);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pipeline Total</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.openValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+12% ce mois</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Opportunités</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOpportunities}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">{opportunities.filter(o => o.status === 'open').length} en cours</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalContacts}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+5 cette semaine</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entreprises</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCompanies}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">{stats.totalContacts} contacts liés</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stages */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Vue Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunitiesByStage.map(({ stage, count, value }) => (
                <div key={stage.id} className="flex items-center gap-4">
                  <div className="w-28 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-sm font-medium truncate">{stage.name}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-secondary rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full rounded-lg transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (value / (stats.openValue || 1)) * 100)}%`,
                          backgroundColor: stage.color + '40'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-3 justify-between">
                        <span className="text-xs font-medium">{count} deal{count > 1 ? 's' : ''}</span>
                        <span className="text-xs font-semibold">{formatCurrency(value)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-card/80 border border-border/50">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Prévision du mois</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basé sur votre pipeline actuel, vous devriez clôturer environ {formatCurrency(stats.openValue * 0.35)} ce mois.
                  </p>
                </div>
              </div>
            </div>

            {atRiskDeals.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Deals à risque</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {atRiskDeals.length} opportunité{atRiskDeals.length > 1 ? 's' : ''} nécessite{atRiskDeals.length > 1 ? 'nt' : ''} votre attention.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-card/80 border border-border/50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Taux de conversion</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre taux de conversion est de {opportunities.length > 0 ? Math.round((opportunities.filter(o => o.status === 'won').length / opportunities.length) * 100) : 0}%, {opportunities.filter(o => o.status === 'won').length > 2 ? 'excellent' : 'à améliorer'}.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" size="sm">
              <Brain className="h-4 w-4" />
              Demander à l'IA
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Activité récente
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente</p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.activity_type === 'email' ? 'bg-blue-500/10 text-blue-500' :
                        activity.activity_type === 'call' ? 'bg-green-500/10 text-green-500' :
                        activity.activity_type === 'meeting' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.activity_date), 'dd MMM à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      {activity.sentiment && (
                        <Badge variant={activity.sentiment === 'positive' ? 'default' : activity.sentiment === 'negative' ? 'destructive' : 'secondary'} className="text-xs">
                          {activity.sentiment}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Tâches à venir
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune tâche en attente</p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => {
                    const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                    return (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-card/50'}`}>
                        <div className={`p-2 rounded-lg ${
                          task.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                          task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                          task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{task.title}</p>
                          {task.due_date && (
                            <p className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {isOverdue ? 'En retard - ' : ''}{format(new Date(task.due_date), 'dd MMM', { locale: fr })}
                            </p>
                          )}
                        </div>
                        <Badge variant={task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Won/Lost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Deals gagnés</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.wonValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {opportunities.filter(o => o.status === 'won').length} opportunité{opportunities.filter(o => o.status === 'won').length > 1 ? 's' : ''} clôturée{opportunities.filter(o => o.status === 'won').length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">Deals perdus</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.lostValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {opportunities.filter(o => o.status === 'lost').length} opportunité{opportunities.filter(o => o.status === 'lost').length > 1 ? 's' : ''} perdue{opportunities.filter(o => o.status === 'lost').length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
