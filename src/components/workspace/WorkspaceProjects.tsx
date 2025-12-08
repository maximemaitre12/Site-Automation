import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Plus, MoreVertical, FolderKanban, Calendar, Filter, Trash2, Edit, CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkspaceProject } from '@/hooks/useWorkspace';

interface WorkspaceProjectsProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
}

const statusConfig = {
  active: { label: 'Actif', color: 'bg-success/10 text-success' },
  completed: { label: 'Terminé', color: 'bg-primary/10 text-primary' },
  on_hold: { label: 'En pause', color: 'bg-warning/10 text-warning' },
  cancelled: { label: 'Annulé', color: 'bg-muted text-muted-foreground' },
};

const priorityConfig = {
  low: { label: 'Basse', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Moyenne', color: 'bg-yellow-500/10 text-yellow-600' },
  high: { label: 'Haute', color: 'bg-orange-500/10 text-orange-600' },
  critical: { label: 'Critique', color: 'bg-destructive/10 text-destructive' },
};

export function WorkspaceProjects({ workspace }: WorkspaceProjectsProps) {
  const { projects, tasks, createProject, updateProject, deleteProject, loading } = workspace;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', priority: 'medium' as WorkspaceProject['priority'], color: '#2D6FFF' });

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getProjectTasks = (projectId: string) => tasks.filter(t => t.project_id === projectId);
  const getProjectProgress = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    return Math.round((projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    if (selectedProject) {
      await updateProject(selectedProject.id, formData);
    } else {
      await createProject(formData);
    }
    setIsAddDialogOpen(false);
    setSelectedProject(null);
    setFormData({ name: '', description: '', priority: 'medium', color: '#2D6FFF' });
  };

  const handleEdit = (project: WorkspaceProject) => {
    setSelectedProject(project);
    setFormData({ name: project.name, description: project.description || '', priority: project.priority, color: project.color });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce projet ?')) await deleteProject(id);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un projet..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) { setSelectedProject(null); setFormData({ name: '', description: '', priority: 'medium', color: '#2D6FFF' }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Nouveau projet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{selectedProject ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Nom *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Mon projet" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as WorkspaceProject['priority'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (<SelectItem key={key} value={key}>{config.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-10 p-1" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.name}>{selectedProject ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{projects.length}</p><p className="text-sm text-muted-foreground">Total projets</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p><p className="text-sm text-muted-foreground">Actifs</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p><p className="text-sm text-muted-foreground">Terminés</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{tasks.length}</p><p className="text-sm text-muted-foreground">Tâches total</p></CardContent></Card>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun projet. Créez votre premier projet !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const projectTasks = getProjectTasks(project.id);
            const progress = getProjectProgress(project.id);
            return (
              <Card key={project.id} className="border-border/50 bg-card/50 hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
                      <CardTitle className="text-base font-semibold">{project.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(project)}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={statusConfig[project.status].color}>{statusConfig[project.status].label}</Badge>
                    <Badge className={priorityConfig[project.priority].color}>{priorityConfig[project.priority].label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground"><CheckSquare className="h-4 w-4" />{projectTasks.filter(t => t.status === 'done').length}/{projectTasks.length} tâches</div>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {project.end_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{format(new Date(project.end_date), 'dd MMM yyyy', { locale: fr })}</div>
                    )}
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
