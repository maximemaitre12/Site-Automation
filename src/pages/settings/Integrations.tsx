import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  Mic, 
  Globe, 
  Search, 
  Zap, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Sparkles,
  Brain,
  FileSearch,
  MessageSquare,
  Key,
  Settings,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  Link2,
  Mail,
  Phone,
  CreditCard,
  Github,
  Database,
  Bot
} from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'ai' | 'productivity' | 'communication' | 'payment';
  serviceName: string; // maps to user_api_keys.service_name
  placeholder: string;
  helpUrl?: string;
  color: string;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5 et autres modèles pour l\'IA générative',
    icon: Bot,
    category: 'ai',
    serviceName: 'openai',
    placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://platform.openai.com/api-keys',
    color: 'from-emerald-500 to-teal-500',
    features: ['GPT-4', 'GPT-3.5', 'Embeddings', 'Whisper']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude et les modèles conversationnels avancés',
    icon: Brain,
    category: 'ai',
    serviceName: 'anthropic',
    placeholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://console.anthropic.com/settings/keys',
    color: 'from-orange-500 to-amber-500',
    features: ['Claude 3', 'Claude 2', 'Analyse de documents']
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'API d\'envoi d\'emails transactionnels et marketing',
    icon: Mail,
    category: 'communication',
    serviceName: 'resend',
    placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://resend.com/api-keys',
    color: 'from-blue-500 to-indigo-500',
    features: ['Emails transactionnels', 'Templates', 'Analytics']
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Token de bot Telegram pour envoyer des messages',
    icon: MessageSquare,
    category: 'communication',
    serviceName: 'telegram',
    placeholder: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
    helpUrl: 'https://core.telegram.org/bots#creating-a-new-bot',
    color: 'from-sky-500 to-blue-500',
    features: ['Messages', 'Notifications', 'Bots interactifs']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Token OAuth pour poster des messages dans Slack',
    icon: MessageSquare,
    category: 'communication',
    serviceName: 'slack',
    placeholder: 'xoxb-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://api.slack.com/tutorials/tracks/getting-a-token',
    color: 'from-purple-500 to-pink-500',
    features: ['Messages', 'Channels', 'Workflows']
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Envoi de SMS et appels vocaux (format: SID:AuthToken)',
    icon: Phone,
    category: 'communication',
    serviceName: 'twilio',
    placeholder: 'ACxxxxxxxx:xxxxxxxx',
    helpUrl: 'https://console.twilio.com/',
    color: 'from-red-500 to-rose-500',
    features: ['SMS', 'Appels', 'WhatsApp']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Clé API pour les paiements et abonnements',
    icon: CreditCard,
    category: 'payment',
    serviceName: 'stripe',
    placeholder: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://dashboard.stripe.com/apikeys',
    color: 'from-violet-500 to-purple-500',
    features: ['Paiements', 'Abonnements', 'Factures']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Token d\'accès personnel pour l\'API GitHub',
    icon: Github,
    category: 'productivity',
    serviceName: 'github',
    placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://github.com/settings/tokens',
    color: 'from-gray-600 to-gray-800',
    features: ['Repos', 'Issues', 'Actions']
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Token d\'intégration Notion pour accéder aux bases de données',
    icon: Database,
    category: 'productivity',
    serviceName: 'notion',
    placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://www.notion.so/my-integrations',
    color: 'from-stone-600 to-stone-800',
    features: ['Bases de données', 'Pages', 'Blocs']
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Token API Airtable pour accéder aux bases',
    icon: Database,
    category: 'productivity',
    serviceName: 'airtable',
    placeholder: 'patxxxxxxxxxxxxxxxx',
    helpUrl: 'https://airtable.com/create/tokens',
    color: 'from-yellow-500 to-orange-500',
    features: ['Bases', 'Automatisations', 'Sync']
  }
];

export default function Integrations() {
  const { 
    keysByService, 
    loading, 
    saveKey, 
    deleteKey, 
    hasKey,
    fetchKeys 
  } = useUserApiKeys();
  
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'productivity' | 'communication' | 'payment'>('all');
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savingServices, setSavingServices] = useState<Set<string>>(new Set());

  // Initialize editing keys from saved values
  useEffect(() => {
    const initial: Record<string, string> = {};
    integrations.forEach(integration => {
      const savedKey = keysByService[integration.serviceName];
      if (savedKey) {
        initial[integration.serviceName] = savedKey;
      }
    });
    setEditingKeys(initial);
  }, [keysByService]);

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  const connectedCount = integrations.filter(i => hasKey(i.serviceName)).length;

  const handleSave = async (serviceName: string) => {
    const value = editingKeys[serviceName];
    if (!value?.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }

    setSavingServices(prev => new Set(prev).add(serviceName));
    const success = await saveKey(serviceName, value);
    setSavingServices(prev => {
      const next = new Set(prev);
      next.delete(serviceName);
      return next;
    });

    if (success) {
      toast.success('Clé API sauvegardée');
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (serviceName: string) => {
    const success = await deleteKey(serviceName);
    if (success) {
      setEditingKeys(prev => {
        const next = { ...prev };
        delete next[serviceName];
        return next;
      });
      toast.success('Clé API supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleShowKey = (serviceName: string) => {
    setShowKeys(prev => ({ ...prev, [serviceName]: !prev[serviceName] }));
  };

  const StatusBadge = ({ serviceName }: { serviceName: string }) => {
    const isConnected = hasKey(serviceName);
    if (isConnected) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 border-0 gap-1">
          <CheckCircle className="w-3 h-3" />
          Connecté
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground gap-1">
        <XCircle className="w-3 h-3" />
        Non configuré
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Plug className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">APIs</h1>
                <p className="text-sm text-muted-foreground">
                  Vos clés API personnelles (non partagées avec votre équipe)
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              {connectedCount} configurées
            </Badge>
          </div>
        </div>

        {/* Security notice */}
        <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-700 dark:text-amber-400">Clés API personnelles</h3>
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                Ces clés sont stockées de manière sécurisée et liées uniquement à votre compte. 
                Elles ne sont pas partagées avec votre entreprise ou équipe. Les connexions OAuth 
                dans les workflows sont également personnelles.
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="all" className="gap-1.5 text-xs sm:text-sm">
              <Plug className="w-3.5 h-3.5" />
              Toutes
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-1.5 text-xs sm:text-sm">
              <Brain className="w-3.5 h-3.5" />
              IA
            </TabsTrigger>
            <TabsTrigger value="communication" className="gap-1.5 text-xs sm:text-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="productivity" className="gap-1.5 text-xs sm:text-sm">
              <Zap className="w-3.5 h-3.5" />
              Productivité
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-1.5 text-xs sm:text-sm">
              <CreditCard className="w-3.5 h-3.5" />
              Paiement
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration) => {
                const isConnected = hasKey(integration.serviceName);
                const isSaving = savingServices.has(integration.serviceName);
                const currentValue = editingKeys[integration.serviceName] || '';
                const savedValue = keysByService[integration.serviceName] || '';
                const hasChanges = currentValue !== savedValue;

                return (
                  <Card key={integration.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center shrink-0`}>
                          <integration.icon className="w-5 h-5 text-white" />
                        </div>
                        <StatusBadge serviceName={integration.serviceName} />
                      </div>
                      <CardTitle className="text-base sm:text-lg mt-3">{integration.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {integration.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-[10px] sm:text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* API Key Input */}
                      <div className="space-y-2">
                        <Label className="text-xs">Clé API</Label>
                        <div className="relative">
                          <Input
                            type={showKeys[integration.serviceName] ? 'text' : 'password'}
                            value={currentValue}
                            onChange={(e) => setEditingKeys(prev => ({ 
                              ...prev, 
                              [integration.serviceName]: e.target.value 
                            }))}
                            placeholder={integration.placeholder}
                            className="pr-10 h-9 text-sm font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => toggleShowKey(integration.serviceName)}
                          >
                            {showKeys[integration.serviceName] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleSave(integration.serviceName)}
                          disabled={isSaving || !currentValue?.trim() || (!hasChanges && isConnected)}
                          size="sm"
                          className="flex-1"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {isConnected && !hasChanges ? 'Sauvegardé' : 'Sauvegarder'}
                        </Button>
                        
                        {isConnected && (
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(integration.serviceName)}
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {integration.helpUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={integration.helpUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Synchronisation automatique</h2>
          </div>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Workflows</h3>
                    <p className="text-xs text-muted-foreground">
                      Les clés configurées ici sont automatiquement disponibles dans vos workflows Aether Flow
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Sauvegarde depuis Flow</h3>
                    <p className="text-xs text-muted-foreground">
                      Les clés entrées dans un workflow peuvent être sauvegardées ici pour une réutilisation facile
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
