import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceHome } from '@/components/workspace/WorkspaceHome';
import { WorkspaceProjects } from '@/components/workspace/WorkspaceProjects';
import { WorkspaceTasks } from '@/components/workspace/WorkspaceTasks';
import { WorkspaceTeam } from '@/components/workspace/WorkspaceTeam';
import { WorkspaceKnowledge } from '@/components/workspace/WorkspaceKnowledge';
import { WorkspaceAnalytics } from '@/components/workspace/WorkspaceAnalytics';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useCRM } from '@/hooks/useCRM';
import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BookOpen,
  BarChart3,
  Sparkles,
  Search,
  Command
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const workspace = useWorkspace();
  const crm = useCRM();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Workspace Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)]">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">AETHER Workspace</h1>
                  <p className="text-sm text-muted-foreground">Vue unifiée de votre entreprise</p>
                </div>
              </div>
              
              {/* Global Search */}
              <Button 
                variant="outline" 
                className="gap-2 w-64 justify-start text-muted-foreground"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span>Rechercher...</span>
                <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs">⌘K</kbd>
              </Button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="h-12 bg-transparent border-b-0 gap-1 p-0">
              <TabsTrigger 
                value="home" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Home className="h-4 w-4" />
                Accueil
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <FolderKanban className="h-4 w-4" />
                Projets
              </TabsTrigger>
              <TabsTrigger 
                value="tasks"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Tâches
              </TabsTrigger>
              <TabsTrigger 
                value="team"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Users className="h-4 w-4" />
                Équipe
              </TabsTrigger>
              <TabsTrigger 
                value="knowledge"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Knowledge
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="home" className="m-0 h-full">
              <WorkspaceHome workspace={workspace} crm={crm} onNavigate={setActiveTab} />
            </TabsContent>
            <TabsContent value="projects" className="m-0 h-full">
              <WorkspaceProjects workspace={workspace} />
            </TabsContent>
            <TabsContent value="tasks" className="m-0 h-full">
              <WorkspaceTasks workspace={workspace} />
            </TabsContent>
            <TabsContent value="team" className="m-0 h-full">
              <WorkspaceTeam workspace={workspace} />
            </TabsContent>
            <TabsContent value="knowledge" className="m-0 h-full">
              <WorkspaceKnowledge workspace={workspace} />
            </TabsContent>
            <TabsContent value="analytics" className="m-0 h-full">
              <WorkspaceAnalytics workspace={workspace} crm={crm} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Global Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Command className="h-5 w-5" />
                Recherche globale
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher dans les projets, tâches, documents, contacts..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              {searchQuery && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {/* Search Results */}
                  {workspace.projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(p => (
                    <div key={p.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-primary" />
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">Projet</span>
                      </div>
                    </div>
                  ))}
                  {workspace.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(t => (
                    <div key={t.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-success" />
                        <span className="font-medium">{t.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">Tâche</span>
                      </div>
                    </div>
                  ))}
                  {workspace.articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(a => (
                    <div key={a.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-warning" />
                        <span className="font-medium">{a.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">Article</span>
                      </div>
                    </div>
                  ))}
                  {crm.contacts.filter(c => `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => (
                    <div key={c.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">{c.first_name} {c.last_name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">Contact CRM</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Commencez à taper pour rechercher</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
