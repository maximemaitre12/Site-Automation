import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShieldCheck, Settings, Plus, Trash2, AlertTriangle, CheckCircle, XCircle,
  Eye, History, ChevronDown, ChevronUp, Loader2, Info
} from 'lucide-react';
import { useSalesCompliance, type ComplianceRule, type ComplianceCheck } from '@/hooks/useSalesCompliance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddRuleDialog({ onAdd }: { onAdd: (rule: Omit<ComplianceRule, 'id' | 'user_id' | 'created_at'>) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    rule_type: 'claim' as ComplianceRule['rule_type'],
    rule_name: '',
    rule_description: '',
    forbidden_phrases: '',
    max_discount_percent: 30,
    severity: 'warning' as ComplianceRule['severity']
  });

  const handleSubmit = () => {
    const rule: Omit<ComplianceRule, 'id' | 'user_id' | 'created_at'> = {
      rule_type: form.rule_type,
      rule_name: form.rule_name,
      rule_description: form.rule_description,
      is_active: true,
      severity: form.severity,
      forbidden_phrases: form.forbidden_phrases ? form.forbidden_phrases.split(',').map(s => s.trim()) : [],
      max_discount_percent: form.rule_type === 'discount' ? form.max_discount_percent : undefined
    };
    onAdd(rule);
    setOpen(false);
    setForm({
      rule_type: 'claim',
      rule_name: '',
      rule_description: '',
      forbidden_phrases: '',
      max_discount_percent: 30,
      severity: 'warning'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une règle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle règle de conformité</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground text-sm"
                value={form.rule_type}
                onChange={(e) => setForm(f => ({ ...f, rule_type: e.target.value as any }))}
              >
                <option value="claim">Affirmations</option>
                <option value="discount">Remises</option>
                <option value="legal">Légal</option>
                <option value="competitor">Concurrence</option>
                <option value="tone">Ton</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sévérité</Label>
              <select
                className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground text-sm"
                value={form.severity}
                onChange={(e) => setForm(f => ({ ...f, severity: e.target.value as any }))}
              >
                <option value="info">Info</option>
                <option value="warning">Avertissement</option>
                <option value="blocker">Bloquant</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nom de la règle *</Label>
            <Input
              placeholder="Ex: Promesses interdites"
              value={form.rule_name}
              onChange={(e) => setForm(f => ({ ...f, rule_name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Décrivez ce que cette règle vérifie..."
              value={form.rule_description}
              onChange={(e) => setForm(f => ({ ...f, rule_description: e.target.value }))}
            />
          </div>

          {form.rule_type === 'discount' ? (
            <div className="space-y-2">
              <Label>Remise maximale autorisée (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.max_discount_percent}
                onChange={(e) => setForm(f => ({ ...f, max_discount_percent: parseInt(e.target.value) || 0 }))}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Phrases interdites (séparées par des virgules)</Label>
              <Textarea
                placeholder="garanti 100%, le meilleur, sans risque"
                value={form.forbidden_phrases}
                onChange={(e) => setForm(f => ({ ...f, forbidden_phrases: e.target.value }))}
              />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!form.rule_name} className="w-full">
            Créer la règle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RuleCard({ rule, onToggle, onDelete }: { 
  rule: ComplianceRule; 
  onToggle: (active: boolean) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = () => {
    switch (rule.severity) {
      case 'blocker': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      claim: 'Affirmations',
      discount: 'Remises',
      legal: 'Légal',
      competitor: 'Concurrence',
      tone: 'Ton',
      pricing: 'Tarification'
    };
    return labels[rule.rule_type] || rule.rule_type;
  };

  return (
    <div className={`border rounded-lg p-3 ${rule.is_active ? 'bg-card' : 'bg-muted/50 opacity-60'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Switch checked={rule.is_active} onCheckedChange={onToggle} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{rule.rule_name}</span>
              <Badge variant="outline" className={`text-xs ${getSeverityColor()}`}>
                {rule.severity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{getTypeLabel()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border text-sm">
          {rule.rule_description && (
            <p className="text-muted-foreground mb-2">{rule.rule_description}</p>
          )}
          {rule.forbidden_phrases && rule.forbidden_phrases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs text-muted-foreground">Phrases interdites:</span>
              {rule.forbidden_phrases.map((phrase, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{phrase}</Badge>
              ))}
            </div>
          )}
          {rule.max_discount_percent !== undefined && (
            <p className="text-xs mt-2">
              <span className="text-muted-foreground">Remise max:</span> {rule.max_discount_percent}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryItem({ check }: { check: ComplianceCheck }) {
  const getStatusIcon = () => {
    switch (check.status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'blocked': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'review': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-3 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{check.content_type}</span>
        </div>
        <Badge variant="outline">{check.compliance_score || 0}%</Badge>
      </div>
      {check.content_preview && (
        <p className="text-xs text-muted-foreground truncate">{check.content_preview}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {new Date(check.checked_at).toLocaleDateString('fr-FR', { 
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        })}
      </p>
    </div>
  );
}

export function ComplianceChecker() {
  const {
    rules,
    complianceHistory,
    loadingRules,
    checking,
    addRule,
    toggleRule,
    deleteRule,
    initializeDefaultRules
  } = useSalesCompliance();

  const [activeView, setActiveView] = useState<'rules' | 'history'>('rules');

  useEffect(() => {
    // Initialize default rules if none exist
    if (!loadingRules && rules.length === 0) {
      initializeDefaultRules();
    }
  }, [loadingRules, rules.length]);

  const stats = {
    total: complianceHistory.length,
    approved: complianceHistory.filter(c => c.status === 'approved').length,
    review: complianceHistory.filter(c => c.status === 'review').length,
    blocked: complianceHistory.filter(c => c.status === 'blocked').length,
    avgScore: complianceHistory.length > 0
      ? Math.round(complianceHistory.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / complianceHistory.length)
      : 0
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <Card className="border-agent-sales/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-agent-sales" />
              Conformité Interne
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'rules' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('rules')}
                className={activeView === 'rules' ? 'bg-agent-sales hover:bg-agent-sales/90' : ''}
              >
                <Settings className="w-4 h-4 mr-2" />
                Règles
              </Button>
              <Button
                variant={activeView === 'history' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('history')}
                className={activeView === 'history' ? 'bg-agent-sales hover:bg-agent-sales/90' : ''}
              >
                <History className="w-4 h-4 mr-2" />
                Historique
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Vérifications</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Conformes</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-500/10">
              <p className="text-2xl font-bold text-amber-600">{stats.review}</p>
              <p className="text-xs text-muted-foreground">À réviser</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-500/10">
              <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
              <p className="text-xs text-muted-foreground">Bloqués</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-agent-sales/10">
              <p className="text-2xl font-bold text-agent-sales">{stats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Score moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules View */}
      {activeView === 'rules' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Règles de conformité ({rules.length})</CardTitle>
              <AddRuleDialog onAdd={addRule} />
            </div>
          </CardHeader>
          <CardContent>
            {loadingRules ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune règle configurée</p>
                <p className="text-xs mt-1">Les règles par défaut seront créées automatiquement</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map(rule => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onToggle={(active) => toggleRule(rule.id, active)}
                    onDelete={() => deleteRule(rule.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historique des vérifications</CardTitle>
          </CardHeader>
          <CardContent>
            {complianceHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune vérification effectuée</p>
                <p className="text-xs mt-1">Les vérifications apparaîtront ici automatiquement</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {complianceHistory.map(check => (
                    <HistoryItem key={check.id} check={check} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Comment fonctionne la conformité ?</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Chaque contenu généré (présentation, proposition, email) est vérifié automatiquement</li>
                <li>L'IA analyse le contenu selon vos règles et détecte les problèmes potentiels</li>
                <li>Les règles bloquantes empêchent le téléchargement jusqu'à correction</li>
                <li>Ajoutez vos propres règles adaptées à votre politique commerciale</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
