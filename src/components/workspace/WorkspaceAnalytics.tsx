import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, TrendingUp, Users, FolderKanban, CheckSquare, DollarSign, Target, Clock, Brain
} from 'lucide-react';

interface WorkspaceAnalyticsProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

export function WorkspaceAnalytics({ workspace, crm }: WorkspaceAnalyticsProps) {
  const { stats, projects, tasks, members } = workspace;

  const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;
  const crmWinRate = crm.opportunities.length > 0 ? Math.round((crm.opportunities.filter(o => o.status === 'won').length / crm.opportunities.length) * 100) : 0;

  const projectsByStatus = {
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    on_hold: projects.filter(p => p.status === 'on_hold').length,
  };

  const tasksByPriority = {
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length,
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
    medium: tasks.filter(t => t.priority === 'medium' && t.status !== 'done').length,
    low: tasks.filter(t => t.priority === 'low' && t.status !== 'done').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Analytics 360°</h2>
          <p className="text-sm text-muted-foreground">Vue globale de la performance</p>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pipeline CRM</p>
                <p className="text-2xl font-bold">{formatCurrency(crm.stats.openValue)}</p>
                <p className="text-xs text-success mt-1">+{crmWinRate}% win rate</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deals gagnés</p>
                <p className="text-2xl font-bold">{formatCurrency(crm.stats.wonValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">{crm.opportunities.filter(o => o.status === 'won').length} deals</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tâches terminées</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.doneTasks}/{stats.totalTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets actifs</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.totalProjects} total</p>
              </div>
              <FolderKanban className="h-8 w-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span>Actifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${(projectsByStatus.active / (stats.totalProjects || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{projectsByStatus.active}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Terminés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(projectsByStatus.completed / (stats.totalProjects || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{projectsByStatus.completed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span>En pause</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${(projectsByStatus.on_hold / (stats.totalProjects || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{projectsByStatus.on_hold}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Tâches par priorité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>Urgentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: `${(tasksByPriority.urgent / (stats.totalTasks - stats.doneTasks || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{tasksByPriority.urgent}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Hautes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(tasksByPriority.high / (stats.totalTasks - stats.doneTasks || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{tasksByPriority.high}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Moyennes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${(tasksByPriority.medium / (stats.totalTasks - stats.doneTasks || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{tasksByPriority.medium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span>Basses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground" style={{ width: `${(tasksByPriority.low / (stats.totalTasks - stats.doneTasks || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{tasksByPriority.low}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CRM Overview */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance CRM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold">{crm.stats.totalContacts}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Entreprises</p>
                <p className="text-2xl font-bold">{crm.stats.totalCompanies}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Opportunités</p>
                <p className="text-2xl font-bold">{crm.stats.totalOpportunities}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-success">{crmWinRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Membres</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-success">{members.filter(m => m.status === 'active').length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Tâches/membre</p>
                <p className="text-2xl font-bold">{stats.totalMembers > 0 ? Math.round(stats.totalTasks / stats.totalMembers) : 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-destructive">{stats.overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/80 border border-border/50">
              <p className="text-sm font-medium">Prévision mensuelle</p>
              <p className="text-xs text-muted-foreground mt-1">
                Basé sur votre pipeline et taux de conversion, vous devriez clôturer environ {formatCurrency(crm.stats.openValue * (crmWinRate / 100))} ce mois.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/80 border border-border/50">
              <p className="text-sm font-medium">Productivité équipe</p>
              <p className="text-xs text-muted-foreground mt-1">
                Taux de complétion de {completionRate}%. {completionRate >= 70 ? 'Excellent travail !' : 'Des améliorations sont possibles.'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/80 border border-border/50">
              <p className="text-sm font-medium">Recommandation</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.overdueTasks > 0 ? `Priorisez ${stats.overdueTasks} tâches en retard.` : 'Continuez sur cette lancée !'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
