import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Play, 
  Pause,
  Settings2,
  Lightbulb,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAIIntelligence, AutomationRule } from '@/hooks/useAIIntelligence';

const TRIGGER_TYPES = [
  { value: 'score_threshold', label: 'Seuil de Score', description: 'Déclenche quand un score dépasse un seuil' },
  { value: 'sentiment', label: 'Sentiment', description: 'Déclenche selon le sentiment détecté' },
  { value: 'status_change', label: 'Changement de Statut', description: 'Déclenche lors d\'un changement de statut' },
  { value: 'prediction', label: 'Prédiction IA', description: 'Déclenche selon les prédictions IA' },
  { value: 'anomaly', label: 'Anomalie Détectée', description: 'Déclenche quand une anomalie est détectée' },
];

const ACTION_TYPES = [
  { value: 'assign', label: 'Assigner', description: 'Assigner à un utilisateur ou équipe' },
  { value: 'alert', label: 'Alerte', description: 'Envoyer une notification' },
  { value: 'email', label: 'Email', description: 'Envoyer un email' },
  { value: 'status_change', label: 'Changer Statut', description: 'Modifier le statut de l\'entité' },
  { value: 'task_create', label: 'Créer Tâche', description: 'Créer une nouvelle tâche' },
];

export function AIAutomationRules() {
  const {
    automationRules,
    loading,
    createAutomationRule,
    toggleAutomationRule,
    getAutomationSuggestions,
  } = useAIIntelligence();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger_type: 'score_threshold',
    trigger_conditions: {} as Record<string, any>,
    action_type: 'alert',
    action_config: {} as Record<string, any>,
    is_active: true,
  });

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    const data = await getAutomationSuggestions();
    if (data?.suggestions) {
      setSuggestions(data.suggestions);
    }
    setLoadingSuggestions(false);
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleCreateRule = async () => {
    if (!newRule.name) return;
    setCreating(true);
    await createAutomationRule(newRule);
    setNewRule({
      name: '',
      description: '',
      trigger_type: 'score_threshold',
      trigger_conditions: {},
      action_type: 'alert',
      action_config: {},
      is_active: true,
    });
    setIsCreateOpen(false);
    setCreating(false);
  };

  const applySuggestion = (suggestion: any) => {
    setNewRule({
      name: suggestion.name,
      description: suggestion.description,
      trigger_type: suggestion.trigger_type,
      trigger_conditions: suggestion.trigger_conditions || {},
      action_type: suggestion.action_type,
      action_config: suggestion.action_config || {},
      is_active: true,
    });
    setIsCreateOpen(true);
  };

  const getTriggerLabel = (type: string) => {
    return TRIGGER_TYPES.find(t => t.value === type)?.label || type;
  };

  const getActionLabel = (type: string) => {
    return ACTION_TYPES.find(a => a.value === type)?.label || type;
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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Règles d'Automatisation IA
          </h2>
          <p className="text-sm text-muted-foreground">
            Automatisez vos processus avec des déclencheurs intelligents
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une Règle d'Automatisation</DialogTitle>
              <DialogDescription>
                Définissez les conditions de déclenchement et les actions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom de la règle *</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Ex: Alerte lead chaud"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Description de la règle..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de Déclencheur</Label>
                  <Select
                    value={newRule.trigger_type}
                    onValueChange={(value) => setNewRule({ ...newRule, trigger_type: value, trigger_conditions: {} })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map((trigger) => (
                        <SelectItem key={trigger.value} value={trigger.value}>
                          {trigger.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type d'Action</Label>
                  <Select
                    value={newRule.action_type}
                    onValueChange={(value) => setNewRule({ ...newRule, action_type: value, action_config: {} })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Trigger Conditions */}
              {newRule.trigger_type === 'score_threshold' && (
                <div>
                  <Label>Seuil de score</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newRule.trigger_conditions.threshold || 80}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      trigger_conditions: { ...newRule.trigger_conditions, threshold: Number(e.target.value) }
                    })}
                  />
                </div>
              )}

              {newRule.trigger_type === 'sentiment' && (
                <div>
                  <Label>Sentiment à détecter</Label>
                  <Select
                    value={newRule.trigger_conditions.sentiment || 'negative'}
                    onValueChange={(value) => setNewRule({
                      ...newRule,
                      trigger_conditions: { ...newRule.trigger_conditions, sentiment: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positif</SelectItem>
                      <SelectItem value="neutral">Neutre</SelectItem>
                      <SelectItem value="negative">Négatif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Config */}
              {newRule.action_type === 'alert' && (
                <div>
                  <Label>Message d'alerte</Label>
                  <Input
                    value={newRule.action_config.message || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      action_config: { ...newRule.action_config, message: e.target.value }
                    })}
                    placeholder="Message de l'alerte..."
                  />
                </div>
              )}

              {newRule.action_type === 'assign' && (
                <div>
                  <Label>Assigner à</Label>
                  <Input
                    value={newRule.action_config.assign_to || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      action_config: { ...newRule.action_config, assign_to: e.target.value }
                    })}
                    placeholder="Nom ou email..."
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  checked={newRule.is_active}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, is_active: checked })}
                />
                <Label>Activer immédiatement</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateRule} disabled={creating || !newRule.name}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Suggestions IA
            </CardTitle>
            <CardDescription>
              Règles recommandées basées sur vos données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestions.slice(0, 6).map((suggestion, idx) => (
                <Card 
                  key={idx} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{suggestion.name}</h4>
                      <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{getTriggerLabel(suggestion.trigger_type)}</Badge>
                      <Badge variant="outline" className="text-xs">{getActionLabel(suggestion.action_type)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-3" onClick={loadSuggestions} disabled={loadingSuggestions}>
              {loadingSuggestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Rafraîchir les suggestions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Règles Actives ({automationRules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {automationRules.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {automationRules.map((rule: any) => (
                  <Card key={rule.id} className={`transition-opacity ${!rule.is_active ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{rule.name}</h4>
                            {rule.is_active ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          {rule.description && (
                            <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {getTriggerLabel(rule.trigger_type)}
                            </span>
                            <span>→</span>
                            <span className="flex items-center gap-1">
                              {getActionLabel(rule.action_type)}
                            </span>
                            {rule.execution_count > 0 && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {rule.execution_count} exécutions
                              </span>
                            )}
                            {rule.last_executed_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(rule.last_executed_at).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={(checked) => toggleAutomationRule(rule.id, checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune règle d'automatisation</p>
              <p className="text-sm">Créez des règles pour automatiser vos processus</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}