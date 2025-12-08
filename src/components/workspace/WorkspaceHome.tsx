import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  DollarSign,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  Workflow,
  Brain,
  Plus,
  ArrowRight,
  Clock,
  AlertTriangle,
  Sparkles,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkspaceHomeProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
  onNavigate: (tab: string) => void;
}

export function WorkspaceHome({ workspace, crm, onNavigate }: WorkspaceHomeProps) {
  const { stats, projects, tasks, activities, loading } = workspace;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const quickActions = [
    { icon: FileText, label: 'Créer doc', color: 'bg-blue-500/10 text-blue-500', href: '/tools/doc' },
    { icon: Workflow, label: 'Nouveau flow', color: 'bg-purple-500/10 text-purple-500', href: '/tools/flow' },
    { icon: Users, label: 'Ajouter lead', color: 'bg-green-500/10 text-green-500', href: '/tools/crm' },
    { icon: FolderKanban, label: 'Créer projet', color: 'bg-orange-500/10 text-orange-500', action: () => onNavigate('projects') },
    { icon: Brain, label: 'Ask Brain', color: 'bg-primary/10 text-primary', href: '/tools/brain' },
  ];

  const recentTasks = tasks.filter(t => t.status !== 'done').slice(0, 5);
  const overdueCount = stats.overdueTasks;
  const recentActivities = activities.slice(0, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bonjour 👋</h2>
          <p className="text-muted-foreground">Voici votre vue d'ensemble</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
          <Sparkles className="h-4 w-4" />
          <span>IA Active</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickActions.map((action, i) => (
          <Button 
            key={i}
            variant="outline" 
            className="h-auto py-4 flex-col gap-2 hover:shadow-md transition-all"
            onClick={() => action.action ? action.action() : window.location.href = action.href || '#'}
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('projects')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-xs text-muted-foreground">Projets actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('tasks')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todoTasks + stats.inProgressTasks}</p>
                <p className="text-xs text-muted-foreground">Tâches en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('team')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-xs text-muted-foreground">Membres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(crm.stats.openValue)}</p>
                <p className="text-xs text-muted-foreground">Pipeline CRM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{crm.stats.totalOpportunities}</p>
                <p className="text-xs text-muted-foreground">Opportunités</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 hover:shadow-md transition-shadow" onClick={() => onNavigate('knowledge')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <FileText className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalArticles}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Panel */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Tâches importantes
              {overdueCount > 0 && (
                <Badge variant="destructive" className="ml-2">{overdueCount} en retard</Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')} className="gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune tâche en attente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => {
                    const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                    return (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-card/50'} hover:shadow-sm transition-shadow`}>
                        <div className={`p-2 rounded-lg ${
                          task.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                          task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <CheckSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{task.title}</p>
                          {task.project && (
                            <p className="text-xs text-muted-foreground">{task.project.name}</p>
                          )}
                          {task.due_date && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              <span className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge variant={task.status === 'in_progress' ? 'default' : 'secondary'} className="text-xs">
                          {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Révision'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Insights & Activity */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Recommandations IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueCount > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Tâches en retard</p>
                      <p className="text-xs text-muted-foreground">{overdueCount} tâche{overdueCount > 1 ? 's' : ''} nécessite{overdueCount > 1 ? 'nt' : ''} votre attention</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Focus du jour</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.inProgressTasks > 0 ? `Terminez vos ${stats.inProgressTasks} tâches en cours` : 'Commencez une nouvelle tâche'}
                    </p>
                  </div>
                </div>
              </div>
              {crm.stats.openValue > 0 && (
                <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pipeline actif</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(crm.stats.openValue)} en opportunités ouvertes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {recentActivities.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-sm">Aucune activité</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">{activity.action_type}</span> {activity.entity_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.created_at), 'dd MMM HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Projects Row */}
      {projects.filter(p => p.status === 'active').length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets actifs
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('projects')} className="gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.filter(p => p.status === 'active').slice(0, 3).map((project) => (
                <div key={project.id} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                    <span className="font-medium truncate">{project.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter(t => t.project_id === project.id && t.status !== 'done').length} tâches
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
