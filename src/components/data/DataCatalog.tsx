import { useState } from 'react';
import { useDataPlatform, DataCatalogEntry } from '@/hooks/useDataPlatform';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Table, Eye, Trash2, Shield, AlertTriangle, FileText, Loader2 } from 'lucide-react';

const sensitivityConfig = {
  public: { label: 'Public', color: 'bg-green-500/10 text-green-600', icon: '🌍' },
  internal: { label: 'Interne', color: 'bg-blue-500/10 text-blue-600', icon: '🏢' },
  confidential: { label: 'Confidentiel', color: 'bg-orange-500/10 text-orange-600', icon: '🔒' },
  restricted: { label: 'Restreint', color: 'bg-red-500/10 text-red-600', icon: '⛔' }
};

const DataCatalog = () => {
  const { catalog, sources, loading, createCatalogEntry, deleteCatalogEntry } = useDataPlatform();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DataCatalogEntry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source_id: '',
    sensitivity_level: 'internal' as const,
    owner: '',
    tags: ''
  });

  const handleCreate = async () => {
    if (!formData.name) return;
    await createCatalogEntry({
      name: formData.name,
      description: formData.description || null,
      source_id: formData.source_id || null,
      sensitivity_level: formData.sensitivity_level,
      owner: formData.owner || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      schema_info: {},
      pii_detected: false,
      row_count: 0,
      column_count: 0,
      last_updated_at: null,
      lineage: [],
      quality_score: 0
    });
    setDialogOpen(false);
    setFormData({ name: '', description: '', source_id: '', sensitivity_level: 'internal', owner: '', tags: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Catalogue de données</h2>
          <p className="text-sm text-muted-foreground">Inventaire et métadonnées de tous vos datasets</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Ajouter un dataset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau dataset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom du dataset</Label>
                <Input 
                  placeholder="Ex: customers, orders, products..." 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Description du contenu et de l'usage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select 
                    value={formData.source_id || "none"} 
                    onValueChange={(v) => setFormData({ ...formData, source_id: v === "none" ? "" : v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {sources.map(source => (
                        <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Niveau de sensibilité</Label>
                  <Select 
                    value={formData.sensitivity_level} 
                    onValueChange={(v) => setFormData({ ...formData, sensitivity_level: v as typeof formData.sensitivity_level })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(sensitivityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.icon} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Propriétaire</Label>
                  <Input 
                    placeholder="Ex: Data Team, Marketing..."
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (séparés par virgule)</Label>
                  <Input 
                    placeholder="crm, customers, pii..."
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreate} disabled={!formData.name} className="w-full">
                Ajouter au catalogue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dataset Grid */}
      {catalog.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun dataset dans le catalogue</p>
            <p className="text-sm">Ajoutez des datasets pour les documenter et suivre leur qualité</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map(entry => {
            const sensitivity = sensitivityConfig[entry.sensitivity_level];
            const source = sources.find(s => s.id === entry.source_id);
            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Table className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{entry.name}</CardTitle>
                    </div>
                    <Badge className={sensitivity.color}>
                      {sensitivity.icon} {sensitivity.label}
                    </Badge>
                  </div>
                  {entry.description && (
                    <CardDescription className="line-clamp-2">{entry.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <div className="text-lg font-semibold">{entry.row_count.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Lignes</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="text-lg font-semibold">{entry.column_count}</div>
                      <div className="text-xs text-muted-foreground">Colonnes</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="text-lg font-semibold">{entry.quality_score}%</div>
                      <div className="text-xs text-muted-foreground">Qualité</div>
                    </div>
                  </div>

                  {/* Quality Score Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Score qualité</span>
                      <span className={entry.quality_score >= 80 ? 'text-green-600' : entry.quality_score >= 50 ? 'text-orange-600' : 'text-red-600'}>
                        {entry.quality_score}%
                      </span>
                    </div>
                    <Progress value={entry.quality_score} className="h-2" />
                  </div>

                  {/* PII Warning */}
                  {entry.pii_detected && (
                    <div className="flex items-center gap-2 p-2 rounded bg-orange-500/10 text-orange-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Données personnelles détectées</span>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{entry.owner || 'Non assigné'}</span>
                    {source && <span>via {source.name}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Détails
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteCatalogEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              {selectedEntry?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">{selectedEntry.description || 'Pas de description'}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Propriétaire</Label>
                  <p className="font-medium">{selectedEntry.owner || 'Non assigné'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Sensibilité</Label>
                  <Badge className={sensitivityConfig[selectedEntry.sensitivity_level].color}>
                    {sensitivityConfig[selectedEntry.sensitivity_level].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Schéma</Label>
                <pre className="p-3 rounded bg-muted text-xs overflow-auto max-h-48">
                  {JSON.stringify(selectedEntry.schema_info, null, 2) || '{}'}
                </pre>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Lineage</Label>
                {selectedEntry.lineage.length > 0 ? (
                  <div className="space-y-1">
                    {selectedEntry.lineage.map((l, i) => (
                      <div key={i} className="text-sm">{l.from} → {l.to}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun lineage défini</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataCatalog;
