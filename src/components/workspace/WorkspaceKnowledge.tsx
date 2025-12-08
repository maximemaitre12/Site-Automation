import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Plus, MoreVertical, BookOpen, FileText, Trash2, Edit, Eye, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { KnowledgeArticle } from '@/hooks/useWorkspace';

interface WorkspaceKnowledgeProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
}

export function WorkspaceKnowledge({ workspace }: WorkspaceKnowledgeProps) {
  const { articles, createArticle, updateArticle, deleteArticle, loading } = workspace;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [viewArticle, setViewArticle] = useState<KnowledgeArticle | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSubmit = async () => {
    if (!formData.title) return;
    if (selectedArticle) {
      await updateArticle(selectedArticle.id, formData);
    } else {
      await createArticle(formData);
    }
    setIsAddDialogOpen(false);
    setSelectedArticle(null);
    setFormData({ title: '', content: '' });
  };

  const handleEdit = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setFormData({ title: article.title, content: article.content || '' });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ?')) await deleteArticle(id);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher dans la base de connaissances..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) { setSelectedArticle(null); setFormData({ title: '', content: '' }); } }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Nouvel article</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{selectedArticle ? 'Modifier l\'article' : 'Nouvel article'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Titre *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Titre de l'article" /></div>
              <div className="space-y-2"><Label>Contenu</Label><Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={15} placeholder="Écrivez votre article ici... (Markdown supporté)" className="font-mono text-sm" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.title}>{selectedArticle ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{articles.length}</p><p className="text-sm text-muted-foreground">Total articles</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{articles.filter(a => a.content_type === 'wiki').length}</p><p className="text-sm text-muted-foreground">Wiki</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{articles.filter(a => a.content_type === 'doc').length}</p><p className="text-sm text-muted-foreground">Documents</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{articles.reduce((sum, a) => sum + a.views_count, 0)}</p><p className="text-sm text-muted-foreground">Vues totales</p></CardContent></Card>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun article. Créez votre première documentation !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="border-border/50 bg-card/50 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setViewArticle(article)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold truncate">{article.title}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(article.updated_at), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(article); }}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {article.content && <p className="text-sm text-muted-foreground line-clamp-3">{article.content.slice(0, 150)}...</p>}
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="text-xs">{article.content_type}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Eye className="h-3 w-3" />
                    {article.views_count}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Article Dialog */}
      <Dialog open={!!viewArticle} onOpenChange={(open) => !open && setViewArticle(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{viewArticle.title}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Mis à jour le {format(new Date(viewArticle.updated_at), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
                <div className="whitespace-pre-wrap">{viewArticle.content || 'Aucun contenu'}</div>
              </div>
              {viewArticle.ai_summary && (
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium text-primary mb-2">Résumé IA</p>
                  <p className="text-sm text-muted-foreground">{viewArticle.ai_summary}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
