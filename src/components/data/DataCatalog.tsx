import { useState, useMemo } from 'react';
import { useUnifiedDataCatalog, UnifiedDataEntry, DataType } from '@/hooks/useUnifiedDataCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Eye, Trash2, Shield, AlertTriangle, FileText, Loader2, 
  Building2, Users, Bot, MessageSquare, FileCheck,
  Phone, BarChart3, Database, RefreshCw, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const typeConfig: Record<DataType, { label: string; icon: React.ReactNode; color: string }> = {
  document: { label: 'Document', icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-600' },
  company: { label: 'Entreprise enrichie', icon: <Building2 className="h-4 w-4" />, color: 'bg-purple-500/10 text-purple-600' },
  candidate: { label: 'Candidat', icon: <Users className="h-4 w-4" />, color: 'bg-pink-500/10 text-pink-600' },
  workflow: { label: 'Workflow', icon: <Bot className="h-4 w-4" />, color: 'bg-cyan-500/10 text-cyan-600' },
  ticket: { label: 'Ticket', icon: <MessageSquare className="h-4 w-4" />, color: 'bg-orange-500/10 text-orange-600' },
  proposal: { label: 'Proposition', icon: <FileCheck className="h-4 w-4" />, color: 'bg-emerald-500/10 text-emerald-600' },
  audit: { label: 'Audit', icon: <Shield className="h-4 w-4" />, color: 'bg-red-500/10 text-red-600' },
  call_analysis: { label: 'Analyse d\'appel', icon: <Phone className="h-4 w-4" />, color: 'bg-violet-500/10 text-violet-600' }
};

const sensitivityConfig: Record<string, { label: string; color: string; icon: string }> = {
  public: { label: 'Public', color: 'bg-green-500/10 text-green-600', icon: '🌍' },
  internal: { label: 'Interne', color: 'bg-blue-500/10 text-blue-600', icon: '🏢' },
  confidential: { label: 'Confidentiel', color: 'bg-orange-500/10 text-orange-600', icon: '🔒' },
  restricted: { label: 'Restreint', color: 'bg-red-500/10 text-red-600', icon: '⛔' },
  private: { label: 'Privé', color: 'bg-gray-500/10 text-gray-600', icon: '🔐' }
};

const getSensitivityInfo = (sensitivity: string) => {
  return sensitivityConfig[sensitivity] || sensitivityConfig.internal;
};

const DataCatalog = () => {
  const { entries, loading, stats, refresh, deleteEntry } = useUnifiedDataCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DataType | 'all'>('all');
  const [selectedSensitivity, setSelectedSensitivity] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<UnifiedDataEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedType === 'all' || entry.type === selectedType;
      const matchesSensitivity = selectedSensitivity === 'all' || entry.sensitivity === selectedSensitivity;
      
      return matchesSearch && matchesType && matchesSensitivity;
    });
  }, [entries, searchQuery, selectedType, selectedSensitivity]);

  const handleDelete = async (entry: UnifiedDataEntry) => {
    if (!confirm(`Supprimer "${entry.name}" ? Cette action est irréversible.`)) return;
    
    setIsDeleting(true);
    try {
      await deleteEntry(entry);
      toast.success('Donnée supprimée');
      setSelectedEntry(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total données</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.recentCount}</div>
                <div className="text-xs text-muted-foreground">7 derniers jours</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.piiCount}</div>
                <div className="text-xs text-muted-foreground">Données sensibles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Object.keys(stats.byType).filter(k => stats.byType[k as DataType] > 0).length}</div>
                <div className="text-xs text-muted-foreground">Types de données</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Catalogue de données unifié</h2>
          <p className="text-sm text-muted-foreground">Toutes les données de la plateforme AETHER</p>
        </div>
        <Button variant="outline" onClick={() => refresh()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, description, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as DataType | 'all')}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type de données" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(typeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  {config.icon} {config.label} ({stats.byType[key as DataType] || 0})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSensitivity} onValueChange={setSelectedSensitivity}>
          <SelectTrigger className="w-[180px]">
            <Shield className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sensibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Object.entries(sensitivityConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.icon} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Tabs for Quick Access */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" onClick={() => setSelectedType('all')}>
            Tout ({stats.total})
          </TabsTrigger>
          {Object.entries(typeConfig).map(([key, config]) => {
            const count = stats.byType[key as DataType];
            if (count === 0) return null;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                onClick={() => setSelectedType(key as DataType)}
                className="flex items-center gap-1"
              >
                {config.icon}
                <span className="hidden sm:inline">{config.label}</span>
                <span>({count})</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Data Grid */}
      {filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune donnée trouvée</p>
            <p className="text-sm">
              {searchQuery ? 'Essayez une autre recherche' : 'Les données apparaîtront ici au fur et à mesure de votre utilisation'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-500px)] min-h-[400px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {filteredEntries.map(entry => {
              const typeInfo = typeConfig[entry.type];
              const sensitivityInfo = getSensitivityInfo(entry.sensitivity);
              
              return (
                <Card key={`${entry.source_table}-${entry.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <CardTitle className="text-base truncate">{entry.name}</CardTitle>
                      </div>
                      {entry.pii_detected && (
                        <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                    {entry.description && (
                      <CardDescription className="line-clamp-2">{entry.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      <Badge className={typeInfo.color} variant="secondary">
                        {typeInfo.label}
                      </Badge>
                      <Badge className={sensitivityInfo.color} variant="secondary">
                        {sensitivityInfo.icon} {sensitivityInfo.label}
                      </Badge>
                    </div>

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        {entry.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{entry.tags.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: fr })}</span>
                      <span className="truncate max-w-[100px]">{entry.source_table}</span>
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
                        onClick={() => handleDelete(entry)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEntry && typeConfig[selectedEntry.type].icon}
              {selectedEntry?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-4">
              {/* Description */}
              <div className="space-y-1">
                <Label className="text-muted-foreground">Description</Label>
                <p>{selectedEntry.description || 'Pas de description'}</p>
              </div>

              {/* Type & Sensitivity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge className={typeConfig[selectedEntry.type].color}>
                    {typeConfig[selectedEntry.type].label}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Sensibilité</Label>
                  <Badge className={sensitivityConfig[selectedEntry.sensitivity].color}>
                    {sensitivityConfig[selectedEntry.sensitivity].icon} {sensitivityConfig[selectedEntry.sensitivity].label}
                  </Badge>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Créé le</Label>
                  <p className="text-sm">{new Date(selectedEntry.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Modifié le</Label>
                  <p className="text-sm">{new Date(selectedEntry.updated_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>

              {/* PII Warning */}
              {selectedEntry.pii_detected && (
                <div className="flex items-center gap-2 p-3 rounded bg-orange-500/10 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Cette donnée contient des informations personnelles identifiables (PII)</span>
                </div>
              )}

              {/* Tags */}
              {selectedEntry.tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedEntry.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Métadonnées</Label>
                <pre className="p-3 rounded bg-muted text-xs overflow-auto max-h-48">
                  {JSON.stringify(selectedEntry.metadata, null, 2)}
                </pre>
              </div>

              {/* Source */}
              <div className="space-y-1">
                <Label className="text-muted-foreground">Table source</Label>
                <Badge variant="outline">{selectedEntry.source_table}</Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(selectedEntry)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataCatalog;
