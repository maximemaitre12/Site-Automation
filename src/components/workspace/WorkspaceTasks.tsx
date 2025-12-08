import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, MoreVertical, Calendar as CalendarIcon, Filter, Trash2, Edit, CheckSquare, List, LayoutGrid, Clock, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkspaceTask } from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';

interface WorkspaceTasksProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
}

const statusConfig = {
  todo: { label: 'À faire', color: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'En cours', color: 'bg-primary/10 text-primary' },
  review: { label: 'Révision', color: 'bg-purple-500/10 text-purple-500' },
  done: { label: 'Terminé', color: 'bg-success/10 text-success' },
  cancelled: { label: 'Annulé', color: 'bg-muted text-muted-foreground line-through' },
};

const priorityConfig = {
  low: { label: 'Basse', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Moyenne', color: 'bg-yellow-500/10 text-yellow-600' },
  high: { label: 'Haute', color: 'bg-orange-500/10 text-orange-600' },
  urgent: { label: 'Urgente', color: 'bg-destructive/10 text-destructive' },
};

export function WorkspaceTasks({ workspace }: WorkspaceTasksProps) {
  const { tasks, projects, createTask, updateTask, completeTask, deleteTask, loading } = workspace;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' as WorkspaceTask['priority'], project_id: '', due_date: undefined as Date | undefined });

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done'),
  };

  const handleSubmit = async () => {
    if (!formData.title) return;
    await createTask({ ...formData, due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd HH:mm:ss') : null, project_id: formData.project_id || null });
    setIsAddDialogOpen(false);
    setFormData({ title: '', description: '', priority: 'medium', project_id: '', due_date: undefined });
  };

  const handleToggleComplete = async (task: WorkspaceTask) => {
    if (task.status === 'done') await updateTask(task.id, { status: 'todo', completed_at: null });
    else await completeTask(task.id);
  };

  const handleStatusChange = async (taskId: string, status: WorkspaceTask['status']) => {
    await updateTask(taskId, { status });
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  const TaskCard = ({ task }: { task: WorkspaceTask }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
    return (
      <Card className={cn("border-border/50 bg-card/50 hover:shadow-md transition-shadow group", task.status === 'done' && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox checked={task.status === 'done'} onCheckedChange={() => handleToggleComplete(task)} className="mt-1" />
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-sm", task.status === 'done' && "line-through")}>{task.title}</p>
              {task.project && <p className="text-xs text-muted-foreground mt-1">{task.project.name}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</Badge>
                {task.due_date && (
                  <span className={cn("text-xs flex items-center gap-1", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                    {isOverdue && <AlertCircle className="h-3 w-3" />}
                    <Clock className="h-3 w-3" />
                    {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
                  </span>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in_progress')}>En cours</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'review')}>En révision</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'done')}>Terminé</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (<SelectItem key={key} value={key}>{config.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
            <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('kanban')}><LayoutGrid className="h-4 w-4" /></Button>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Nouvelle tâche</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Nouvelle tâche</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Titre *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(priorityConfig).map(([key, config]) => (<SelectItem key={key} value={key}>{config.label}</SelectItem>))}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label>Projet</Label>
                  <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}><SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger><SelectContent><SelectItem value="">Aucun</SelectItem>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent></Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Échéance</Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{formData.due_date ? format(formData.due_date, 'dd MMM yyyy', { locale: fr }) : 'Sélectionner'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.due_date} onSelect={(date) => setFormData({ ...formData, due_date: date })} locale={fr} className="pointer-events-auto" /></PopoverContent></Popover>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.title}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{tasks.length}</p><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{tasksByStatus.todo.length}</p><p className="text-sm text-muted-foreground">À faire</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{tasksByStatus.in_progress.length}</p><p className="text-sm text-muted-foreground">En cours</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{tasksByStatus.done.length}</p><p className="text-sm text-muted-foreground">Terminées</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold text-destructive">{tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length}</p><p className="text-sm text-muted-foreground">En retard</p></CardContent></Card>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="space-y-3 flex-1 overflow-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Aucune tâche</p></div>
          ) : (
            filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      ) : (
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {(['todo', 'in_progress', 'review', 'done'] as const).map(status => (
            <div key={status} className="w-72 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
                <span className="text-sm text-muted-foreground">{tasksByStatus[status].length}</span>
              </div>
              <div className="space-y-3">
                {tasksByStatus[status].map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
