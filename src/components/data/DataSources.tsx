import { useState } from 'react';
import { useDataPlatform, DataSource } from '@/hooks/useDataPlatform';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Database, Cloud, FileText, Webhook, RefreshCw, Trash2, Settings, Play, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const connectorConfig = {
  database: {
    icon: Database,
    connectors: [
      { id: 'postgres', name: 'PostgreSQL', icon: '🐘' },
      { id: 'mysql', name: 'MySQL', icon: '🐬' },
      { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
      { id: 'sqlserver', name: 'SQL Server', icon: '🔷' },
    ]
  },
  saas: {
    icon: Cloud,
    connectors: [
      { id: 'salesforce', name: 'Salesforce', icon: '☁️' },
      { id: 'hubspot', name: 'HubSpot', icon: '🧡' },
      { id: 'stripe', name: 'Stripe', icon: '💳' },
      { id: 'zendesk', name: 'Zendesk', icon: '💬' },
      { id: 'slack', name: 'Slack', icon: '💬' },
      { id: 'notion', name: 'Notion', icon: '📝' },
    ]
  },
  file: {
    icon: FileText,
    connectors: [
      { id: 'gdrive', name: 'Google Drive', icon: '📁' },
      { id: 'dropbox', name: 'Dropbox', icon: '📦' },
      { id: 's3', name: 'AWS S3', icon: '🪣' },
      { id: 'sftp', name: 'SFTP', icon: '📂' },
    ]
  },
  webhook: {
    icon: Webhook,
    connectors: [
      { id: 'webhook', name: 'Webhook HTTP', icon: '🔗' },
      { id: 'kafka', name: 'Kafka', icon: '📨' },
    ]
  }
};

const statusConfig = {
  active: { label: 'Actif', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  inactive: { label: 'Inactif', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
  error: { label: 'Erreur', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
  syncing: { label: 'Sync...', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2 }
};

const DataSources = () => {
  const { sources, loading, stats, createSource, deleteSource, syncSource } = useDataPlatform();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('database');
  const [formData, setFormData] = useState({
    name: '',
    connector: '',
    sync_frequency: 'daily' as const
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.connector) return;
    await createSource({
      name: formData.name,
      source_type: selectedType as DataSource['source_type'],
      connector: formData.connector,
      status: 'inactive',
      config: {},
      last_sync_at: null,
      records_count: 0,
      error_message: null,
      sync_frequency: formData.sync_frequency
    });
    setDialogOpen(false);
    setFormData({ name: '', connector: '', sync_frequency: 'daily' });
  };

  const getConnectorName = (connector: string) => {
    for (const type of Object.values(connectorConfig)) {
      const found = type.connectors.find(c => c.id === connector);
      if (found) return `${found.icon} ${found.name}`;
    }
    return connector;
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
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalSources}</div>
            <p className="text-sm text-muted-foreground">Sources totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.activeSources}</div>
            <p className="text-sm text-muted-foreground">Sources actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Records ingérés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalDatasets}</div>
            <p className="text-sm text-muted-foreground">Datasets</p>
          </CardContent>
        </Card>
      </div>

      {/* Sources List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sources de données</CardTitle>
            <CardDescription>Gérez vos connecteurs et synchronisations</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Ajouter une source</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle source de données</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Source Type Selection */}
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(connectorConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => { setSelectedType(type); setFormData({ ...formData, connector: '' }); }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedType === type 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium capitalize">{type}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Connector Selection */}
                <div className="space-y-2">
                  <Label>Connecteur</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {connectorConfig[selectedType as keyof typeof connectorConfig]?.connectors.map(connector => (
                      <button
                        key={connector.id}
                        onClick={() => setFormData({ ...formData, connector: connector.id })}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          formData.connector === connector.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-lg mr-2">{connector.icon}</span>
                        <span className="text-sm font-medium">{connector.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de la source</Label>
                    <Input 
                      placeholder="Ex: Production DB, CRM Salesforce..." 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fréquence de sync</Label>
                    <Select 
                      value={formData.sync_frequency} 
                      onValueChange={(v) => setFormData({ ...formData, sync_frequency: v as typeof formData.sync_frequency })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Temps réel</SelectItem>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="manual">Manuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleCreate} disabled={!formData.name || !formData.connector} className="w-full">
                  Créer la source
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune source configurée</p>
              <p className="text-sm">Ajoutez votre première source de données pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map(source => {
                const status = statusConfig[source.status];
                const StatusIcon = status.icon;
                return (
                  <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getConnectorName(source.connector).split(' ')[0]}</div>
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getConnectorName(source.connector).split(' ').slice(1).join(' ')} • {source.records_count.toLocaleString()} records
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.color}>
                        <StatusIcon className={`h-3 w-3 mr-1 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                        {status.label}
                      </Badge>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => syncSource(source.id)}
                          disabled={source.status === 'syncing'}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSources;
