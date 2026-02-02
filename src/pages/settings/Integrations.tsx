import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  Search, 
  Zap, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Brain,
  MessageSquare,
  Key,
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
  Bot,
  Cloud,
  FileText,
  Image,
  Globe,
  Send,
  Webhook,
  Calendar,
  Users,
  ShoppingCart,
  BarChart3,
  HardDrive,
  Video
} from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'ai' | 'productivity' | 'communication' | 'payment' | 'storage' | 'crm';
  serviceName: string;
  placeholder: string;
  helpUrl?: string;
  color: string;
  features: string[];
}

const integrations: Integration[] = [
  // AI
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5, Whisper, DALL-E',
    icon: Bot,
    category: 'ai',
    serviceName: 'openai',
    placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://platform.openai.com/api-keys',
    color: 'from-emerald-500 to-teal-500',
    features: ['GPT-4', 'Whisper', 'DALL-E']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5, Claude 3 Opus/Sonnet',
    icon: Brain,
    category: 'ai',
    serviceName: 'anthropic',
    placeholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://console.anthropic.com/settings/keys',
    color: 'from-orange-500 to-amber-500',
    features: ['Claude 3.5', 'Vision', 'Documents']
  },
  {
    id: 'google-ai',
    name: 'Google AI',
    description: 'Gemini Pro, Gemini Flash',
    icon: Brain,
    category: 'ai',
    serviceName: 'google_ai',
    placeholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://aistudio.google.com/apikey',
    color: 'from-blue-500 to-cyan-500',
    features: ['Gemini Pro', 'Gemini Flash', 'Vision']
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral Large, Mixtral, Codestral',
    icon: Brain,
    category: 'ai',
    serviceName: 'mistral',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://console.mistral.ai/api-keys/',
    color: 'from-indigo-500 to-violet-500',
    features: ['Mistral Large', 'Mixtral', 'Code']
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'LPU ultra-rapide pour LLaMA, Mixtral',
    icon: Zap,
    category: 'ai',
    serviceName: 'groq',
    placeholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://console.groq.com/keys',
    color: 'from-pink-500 to-rose-500',
    features: ['LLaMA 3', 'Ultra-rapide', 'Mixtral']
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Recherche web augmentée par IA',
    icon: Globe,
    category: 'ai',
    serviceName: 'perplexity',
    placeholder: 'pplx-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://www.perplexity.ai/settings/api',
    color: 'from-teal-500 to-emerald-500',
    features: ['Sonar', 'Recherche web', 'Citations']
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'Modèles open-source (Stable Diffusion, etc.)',
    icon: Image,
    category: 'ai',
    serviceName: 'replicate',
    placeholder: 'r8_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://replicate.com/account/api-tokens',
    color: 'from-purple-500 to-fuchsia-500',
    features: ['Images', 'Vidéo', 'Audio']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Synthèse vocale ultra-réaliste',
    icon: Video,
    category: 'ai',
    serviceName: 'elevenlabs',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://elevenlabs.io/app/settings/api-keys',
    color: 'from-cyan-500 to-blue-500',
    features: ['TTS', 'Voix clonées', 'Multilingue']
  },
  // Communication
  {
    id: 'resend',
    name: 'Resend',
    description: 'Emails transactionnels modernes',
    icon: Mail,
    category: 'communication',
    serviceName: 'resend',
    placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://resend.com/api-keys',
    color: 'from-blue-500 to-indigo-500',
    features: ['Transactionnel', 'Templates', 'React Email']
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Envoi d\'emails à grande échelle',
    icon: Send,
    category: 'communication',
    serviceName: 'sendgrid',
    placeholder: 'SG.xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://app.sendgrid.com/settings/api_keys',
    color: 'from-sky-500 to-blue-500',
    features: ['Marketing', 'Transactionnel', 'Analytics']
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Notifications et bots Telegram',
    icon: MessageSquare,
    category: 'communication',
    serviceName: 'telegram',
    placeholder: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
    helpUrl: 'https://core.telegram.org/bots#creating-a-new-bot',
    color: 'from-sky-500 to-blue-500',
    features: ['Messages', 'Bots', 'Groupes']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Messages et notifications Slack',
    icon: MessageSquare,
    category: 'communication',
    serviceName: 'slack',
    placeholder: 'xoxb-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://api.slack.com/tutorials/tracks/getting-a-token',
    color: 'from-purple-500 to-pink-500',
    features: ['Messages', 'Channels', 'Apps']
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Webhooks et bots Discord',
    icon: MessageSquare,
    category: 'communication',
    serviceName: 'discord',
    placeholder: 'Bot token ou Webhook URL',
    helpUrl: 'https://discord.com/developers/applications',
    color: 'from-indigo-500 to-purple-500',
    features: ['Webhooks', 'Bots', 'Embeds']
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS, appels et WhatsApp',
    icon: Phone,
    category: 'communication',
    serviceName: 'twilio',
    placeholder: 'ACxxxxxxxx:AuthToken',
    helpUrl: 'https://console.twilio.com/',
    color: 'from-red-500 to-rose-500',
    features: ['SMS', 'Appels', 'WhatsApp']
  },
  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    description: 'Bases de données et pages Notion',
    icon: FileText,
    category: 'productivity',
    serviceName: 'notion',
    placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://www.notion.so/my-integrations',
    color: 'from-stone-600 to-stone-800',
    features: ['Databases', 'Pages', 'Sync']
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Bases de données collaboratives',
    icon: Database,
    category: 'productivity',
    serviceName: 'airtable',
    placeholder: 'patxxxxxxxxxxxxxxxx',
    helpUrl: 'https://airtable.com/create/tokens',
    color: 'from-yellow-500 to-orange-500',
    features: ['Bases', 'Automations', 'Views']
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Lecture/écriture de feuilles Google',
    icon: FileText,
    category: 'productivity',
    serviceName: 'google_sheets',
    placeholder: 'Service Account JSON (base64)',
    helpUrl: 'https://console.cloud.google.com/apis/credentials',
    color: 'from-green-500 to-emerald-500',
    features: ['Lecture', 'Écriture', 'Formules']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repos, issues et actions',
    icon: Github,
    category: 'productivity',
    serviceName: 'github',
    placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://github.com/settings/tokens',
    color: 'from-gray-600 to-gray-800',
    features: ['Repos', 'Issues', 'PRs']
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Gestion de projets et issues',
    icon: Zap,
    category: 'productivity',
    serviceName: 'linear',
    placeholder: 'lin_api_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://linear.app/settings/api',
    color: 'from-indigo-500 to-violet-500',
    features: ['Issues', 'Projets', 'Cycles']
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Gestion de rendez-vous',
    icon: Calendar,
    category: 'productivity',
    serviceName: 'calendly',
    placeholder: 'eyJhbGcixxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://calendly.com/integrations/api_webhooks',
    color: 'from-blue-500 to-cyan-500',
    features: ['Events', 'Webhooks', 'Invités']
  },
  // CRM
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM, contacts et deals',
    icon: Users,
    category: 'crm',
    serviceName: 'hubspot',
    placeholder: 'pat-xxx-xxxxxxxx-xxxx-xxxx',
    helpUrl: 'https://developers.hubspot.com/docs/api/private-apps',
    color: 'from-orange-500 to-red-500',
    features: ['Contacts', 'Deals', 'Pipelines']
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'CRM et pipeline de ventes',
    icon: BarChart3,
    category: 'crm',
    serviceName: 'pipedrive',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://pipedrive.readme.io/docs/core-api-concepts-authentication',
    color: 'from-green-500 to-teal-500',
    features: ['Deals', 'Contacts', 'Activities']
  },
  // Payment
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Paiements et abonnements',
    icon: CreditCard,
    category: 'payment',
    serviceName: 'stripe',
    placeholder: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://dashboard.stripe.com/apikeys',
    color: 'from-violet-500 to-purple-500',
    features: ['Paiements', 'Subscriptions', 'Invoices']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paiements PayPal',
    icon: CreditCard,
    category: 'payment',
    serviceName: 'paypal',
    placeholder: 'Client ID:Secret',
    helpUrl: 'https://developer.paypal.com/dashboard/applications',
    color: 'from-blue-500 to-indigo-500',
    features: ['Paiements', 'Checkout', 'Webhooks']
  },
  // Storage
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Stockage de fichiers cloud',
    icon: Cloud,
    category: 'storage',
    serviceName: 'aws_s3',
    placeholder: 'AccessKeyId:SecretAccessKey',
    helpUrl: 'https://console.aws.amazon.com/iam/',
    color: 'from-orange-500 to-amber-500',
    features: ['Upload', 'Download', 'Presigned URLs']
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    description: 'Gestion d\'images et vidéos',
    icon: Image,
    category: 'storage',
    serviceName: 'cloudinary',
    placeholder: 'cloud_name:api_key:api_secret',
    helpUrl: 'https://console.cloudinary.com/console',
    color: 'from-blue-500 to-cyan-500',
    features: ['Images', 'Vidéos', 'Transformations']
  },
  {
    id: 'supabase',
    name: 'Supabase externe',
    description: 'Base de données externe Supabase',
    icon: Database,
    category: 'storage',
    serviceName: 'supabase_external',
    placeholder: 'URL:ServiceRoleKey',
    helpUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    color: 'from-emerald-500 to-green-500',
    features: ['Database', 'Auth', 'Storage']
  },
  // Webhooks / HTTP
  {
    id: 'webhook-generic',
    name: 'Webhook générique',
    description: 'Appeler n\'importe quelle API HTTP',
    icon: Webhook,
    category: 'productivity',
    serviceName: 'webhook',
    placeholder: 'Bearer token ou API key',
    color: 'from-gray-500 to-slate-600',
    features: ['GET', 'POST', 'Headers auth']
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'Web scraping et extraction de données',
    icon: Globe,
    category: 'productivity',
    serviceName: 'firecrawl',
    placeholder: 'fc-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://www.firecrawl.dev/app/api-keys',
    color: 'from-orange-500 to-red-500',
    features: ['Scraping', 'Crawling', 'Extraction']
  },
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
  
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'productivity' | 'communication' | 'payment' | 'storage' | 'crm'>('all');
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savingServices, setSavingServices] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredIntegrations = useMemo(() => {
    let result = integrations;
    
    // Filter by category
    if (activeTab !== 'all') {
      result = result.filter(i => i.category === activeTab);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.features.some(f => f.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [activeTab, searchQuery]);

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

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une API (ex: OpenAI, Slack, Stripe...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto flex-wrap h-auto gap-1 p-1">
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
            <TabsTrigger value="crm" className="gap-1.5 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="storage" className="gap-1.5 text-xs sm:text-sm">
              <HardDrive className="w-3.5 h-3.5" />
              Stockage
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
