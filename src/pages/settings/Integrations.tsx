import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  CheckCircle, 
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  AlertTriangle,
  // Icons for categories and connectors
  Users,
  Megaphone,
  MessageSquare,
  CheckSquare,
  CreditCard,
  ShoppingCart,
  BarChart,
  Code,
  Brain,
  HardDrive,
  Database,
  Share2,
  Briefcase,
  HeadphonesIcon,
  Cloud,
  GitBranch,
  Mail,
  Send,
  Zap,
  UserPlus,
  FileText,
  Grid,
  Layout,
  Calendar,
  CheckCircle2,
  Phone,
  MessageCircle,
  Tent,
  DollarSign,
  BookOpen,
  Receipt,
  Waves,
  Square,
  Globe,
  ShoppingBag,
  Package,
  Gift,
  BarChart2,
  PieChart,
  Activity,
  Sparkles,
  Layers,
  Github,
  GitMerge,
  Triangle,
  Train,
  Plane,
  Box,
  AlertTriangle as AlertTriangleIcon,
  Cpu,
  Bot,
  Wand2,
  Volume2,
  Mic,
  FileAudio,
  Hexagon,
  Archive,
  Flame,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Music,
  Image,
  Sprout,
  LifeBuoy,
  Inbox
} from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { toast } from 'sonner';
import { BUILT_IN_CONNECTORS, CONNECTOR_CATEGORIES, ConnectorCategory } from '@/lib/workflow-connectors';

// Map icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Users, Megaphone, MessageSquare, CheckSquare, CreditCard, ShoppingCart, BarChart, Code, Brain, 
  HardDrive, Database, Share2, Briefcase, HeadphonesIcon, Cloud, GitBranch, Mail, Send, Zap, 
  UserPlus, FileText, Grid, Layout, Calendar, CheckCircle: CheckCircle2, Phone, MessageCircle, 
  Tent, DollarSign, BookOpen, Receipt, Waves, Square, Globe, ShoppingBag, Package, Gift, 
  BarChart2, PieChart, Activity, Sparkles, Layers, Github, GitMerge, Triangle, Train, Plane, 
  Box, AlertTriangle: AlertTriangleIcon, Cpu, Bot, Wand2, Volume2, Mic, FileAudio, Hexagon, 
  Archive, Flame, Twitter, Linkedin, Facebook, Instagram, Youtube, Music, Image, Sprout, 
  LifeBuoy, Inbox
};

interface IntegrationConfig {
  id: string;
  name: string;
  category: ConnectorCategory;
  icon: string;
  color: string;
  verified: boolean;
  placeholder?: string;
  helpUrl?: string;
}

// Extended connector info with API key placeholders
const CONNECTOR_DETAILS: Record<string, { placeholder: string; helpUrl?: string }> = {
  // CRM
  hubspot: { placeholder: 'pat-xxx-xxxxxxxx-xxxx-xxxx', helpUrl: 'https://developers.hubspot.com/docs/api/private-apps' },
  salesforce: { placeholder: 'OAuth access token', helpUrl: 'https://developer.salesforce.com/' },
  pipedrive: { placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://pipedrive.readme.io/docs/core-api-concepts-authentication' },
  zoho_crm: { placeholder: 'OAuth token', helpUrl: 'https://www.zoho.com/crm/developer/' },
  freshsales: { placeholder: 'API Key', helpUrl: 'https://www.freshworks.com/freshsales/' },
  copper: { placeholder: 'API Key', helpUrl: 'https://developer.copper.com/' },
  
  // Marketing
  mailchimp: { placeholder: 'xxxxxxxx-us1', helpUrl: 'https://mailchimp.com/developer/' },
  sendgrid: { placeholder: 'SG.xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://app.sendgrid.com/settings/api_keys' },
  klaviyo: { placeholder: 'pk_xxxxxxxxxxxxxxxx', helpUrl: 'https://www.klaviyo.com/account' },
  activecampaign: { placeholder: 'API Key', helpUrl: 'https://developers.activecampaign.com/' },
  convertkit: { placeholder: 'API Secret', helpUrl: 'https://app.convertkit.com/account_settings/advanced_settings' },
  brevo: { placeholder: 'xkeysib-xxx', helpUrl: 'https://app.brevo.com/settings/keys/api' },
  mailerlite: { placeholder: 'API Key', helpUrl: 'https://dashboard.mailerlite.com/integrations/api' },
  constant_contact: { placeholder: 'API Key', helpUrl: 'https://developer.constantcontact.com/' },
  
  // Communication
  slack: { placeholder: 'xoxb-xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://api.slack.com/tutorials/tracks/getting-a-token' },
  discord: { placeholder: 'Bot token or Webhook URL', helpUrl: 'https://discord.com/developers/applications' },
  telegram: { placeholder: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz', helpUrl: 'https://core.telegram.org/bots' },
  twilio: { placeholder: 'AccountSID:AuthToken', helpUrl: 'https://console.twilio.com/' },
  whatsapp: { placeholder: 'WhatsApp Business API Token', helpUrl: 'https://business.whatsapp.com/' },
  intercom: { placeholder: 'Access Token', helpUrl: 'https://developers.intercom.com/' },
  crisp: { placeholder: 'API Key', helpUrl: 'https://developers.crisp.chat/' },
  zendesk_chat: { placeholder: 'API Token', helpUrl: 'https://developer.zendesk.com/' },
  
  // Productivity
  notion: { placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://www.notion.so/my-integrations' },
  airtable: { placeholder: 'patxxxxxxxxxxxxxxxx', helpUrl: 'https://airtable.com/create/tokens' },
  asana: { placeholder: 'Bearer Token', helpUrl: 'https://developers.asana.com/' },
  trello: { placeholder: 'API Key', helpUrl: 'https://trello.com/app-key' },
  monday: { placeholder: 'API Token', helpUrl: 'https://monday.com/developers/' },
  clickup: { placeholder: 'pk_xxxxxxxx', helpUrl: 'https://clickup.com/api' },
  todoist: { placeholder: 'API Token', helpUrl: 'https://todoist.com/app/settings/integrations' },
  linear: { placeholder: 'lin_api_xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://linear.app/settings/api' },
  basecamp: { placeholder: 'OAuth Token', helpUrl: 'https://github.com/basecamp/api' },
  jira: { placeholder: 'API Token', helpUrl: 'https://id.atlassian.com/manage-profile/security/api-tokens' },
  
  // Finance
  stripe: { placeholder: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://dashboard.stripe.com/apikeys' },
  paypal: { placeholder: 'Client ID:Secret', helpUrl: 'https://developer.paypal.com/dashboard/applications' },
  quickbooks: { placeholder: 'OAuth Token', helpUrl: 'https://developer.intuit.com/' },
  xero: { placeholder: 'OAuth Token', helpUrl: 'https://developer.xero.com/' },
  freshbooks: { placeholder: 'API Token', helpUrl: 'https://www.freshbooks.com/api' },
  wave: { placeholder: 'API Token', helpUrl: 'https://developer.waveapps.com/' },
  square: { placeholder: 'Access Token', helpUrl: 'https://developer.squareup.com/' },
  wise: { placeholder: 'API Token', helpUrl: 'https://api-docs.wise.com/' },
  
  // E-commerce
  shopify: { placeholder: 'shpat_xxxxxxxxxxxxxxxx', helpUrl: 'https://shopify.dev/' },
  woocommerce: { placeholder: 'Consumer Key:Consumer Secret', helpUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/' },
  magento: { placeholder: 'Access Token', helpUrl: 'https://devdocs.magento.com/' },
  bigcommerce: { placeholder: 'API Token', helpUrl: 'https://developer.bigcommerce.com/' },
  prestashop: { placeholder: 'Webservice Key', helpUrl: 'https://devdocs.prestashop-project.org/' },
  amazon_seller: { placeholder: 'AWS Access Key', helpUrl: 'https://developer-docs.amazon.com/sp-api/' },
  etsy: { placeholder: 'API Key', helpUrl: 'https://www.etsy.com/developers/' },
  
  // Analytics
  google_analytics: { placeholder: 'Service Account JSON', helpUrl: 'https://developers.google.com/analytics' },
  mixpanel: { placeholder: 'Project Token', helpUrl: 'https://developer.mixpanel.com/' },
  amplitude: { placeholder: 'API Key', helpUrl: 'https://amplitude.com/docs/apis/' },
  segment: { placeholder: 'Write Key', helpUrl: 'https://segment.com/docs/' },
  posthog: { placeholder: 'API Key', helpUrl: 'https://posthog.com/docs/api' },
  heap: { placeholder: 'API Key', helpUrl: 'https://developers.heap.io/' },
  hotjar: { placeholder: 'Site ID', helpUrl: 'https://www.hotjar.com/' },
  
  // Developer
  github: { placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://github.com/settings/tokens' },
  gitlab: { placeholder: 'glpat-xxxxxxxx', helpUrl: 'https://gitlab.com/-/profile/personal_access_tokens' },
  bitbucket: { placeholder: 'App Password', helpUrl: 'https://bitbucket.org/account/settings/app-passwords/' },
  vercel: { placeholder: 'Bearer Token', helpUrl: 'https://vercel.com/account/tokens' },
  netlify: { placeholder: 'Personal Access Token', helpUrl: 'https://app.netlify.com/user/applications' },
  railway: { placeholder: 'API Token', helpUrl: 'https://railway.app/account/tokens' },
  render: { placeholder: 'API Key', helpUrl: 'https://render.com/docs/api' },
  fly_io: { placeholder: 'API Token', helpUrl: 'https://fly.io/docs/reference/api/' },
  docker_hub: { placeholder: 'Access Token', helpUrl: 'https://hub.docker.com/settings/security' },
  npm: { placeholder: 'Access Token', helpUrl: 'https://www.npmjs.com/settings/~/tokens' },
  sentry: { placeholder: 'Auth Token', helpUrl: 'https://sentry.io/settings/account/api/auth-tokens/' },
  datadog: { placeholder: 'API Key', helpUrl: 'https://app.datadoghq.com/organization-settings/api-keys' },
  
  // AI & ML
  openai: { placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://platform.openai.com/api-keys' },
  anthropic: { placeholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://console.anthropic.com/settings/keys' },
  cohere: { placeholder: 'API Key', helpUrl: 'https://dashboard.cohere.com/api-keys' },
  replicate: { placeholder: 'r8_xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://replicate.com/account/api-tokens' },
  huggingface: { placeholder: 'hf_xxxxxxxxxxxxxxxx', helpUrl: 'https://huggingface.co/settings/tokens' },
  stability: { placeholder: 'sk-xxxxxxxx', helpUrl: 'https://platform.stability.ai/' },
  elevenlabs: { placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx', helpUrl: 'https://elevenlabs.io/app/settings/api-keys' },
  deepgram: { placeholder: 'API Key', helpUrl: 'https://console.deepgram.com/' },
  assembly: { placeholder: 'API Key', helpUrl: 'https://www.assemblyai.com/app/account' },
  pinecone: { placeholder: 'API Key', helpUrl: 'https://app.pinecone.io/' },
  weaviate: { placeholder: 'API Key', helpUrl: 'https://weaviate.io/developers/wcs/quickstart' },
  
  // Storage
  aws_s3: { placeholder: 'AccessKeyId:SecretAccessKey', helpUrl: 'https://console.aws.amazon.com/iam/' },
  google_cloud_storage: { placeholder: 'Service Account JSON', helpUrl: 'https://console.cloud.google.com/' },
  azure_blob: { placeholder: 'Connection String', helpUrl: 'https://portal.azure.com/' },
  dropbox: { placeholder: 'Access Token', helpUrl: 'https://www.dropbox.com/developers/apps' },
  google_drive: { placeholder: 'Service Account JSON', helpUrl: 'https://console.cloud.google.com/' },
  onedrive: { placeholder: 'OAuth Token', helpUrl: 'https://developer.microsoft.com/' },
  box: { placeholder: 'Access Token', helpUrl: 'https://developer.box.com/' },
  cloudflare_r2: { placeholder: 'Access Key', helpUrl: 'https://dash.cloudflare.com/' },
  
  // Database
  mongodb: { placeholder: 'Connection String', helpUrl: 'https://www.mongodb.com/docs/atlas/' },
  firebase: { placeholder: 'Service Account JSON', helpUrl: 'https://console.firebase.google.com/' },
  planetscale: { placeholder: 'Service Token', helpUrl: 'https://planetscale.com/docs/' },
  redis: { placeholder: 'Connection URL', helpUrl: 'https://redis.io/docs/' },
  elasticsearch: { placeholder: 'API Key', helpUrl: 'https://www.elastic.co/guide/' },
  algolia: { placeholder: 'Admin API Key', helpUrl: 'https://dashboard.algolia.com/' },
  
  // Social
  twitter: { placeholder: 'Bearer Token', helpUrl: 'https://developer.twitter.com/' },
  linkedin: { placeholder: 'Access Token', helpUrl: 'https://www.linkedin.com/developers/' },
  facebook: { placeholder: 'Access Token', helpUrl: 'https://developers.facebook.com/' },
  instagram: { placeholder: 'Access Token', helpUrl: 'https://developers.facebook.com/products/instagram/' },
  youtube: { placeholder: 'API Key', helpUrl: 'https://console.cloud.google.com/' },
  tiktok: { placeholder: 'Access Token', helpUrl: 'https://developers.tiktok.com/' },
  pinterest: { placeholder: 'Access Token', helpUrl: 'https://developers.pinterest.com/' },
  
  // HR
  bamboohr: { placeholder: 'API Key', helpUrl: 'https://documentation.bamboohr.com/docs' },
  workday: { placeholder: 'API Credentials', helpUrl: 'https://community.workday.com/' },
  gusto: { placeholder: 'API Token', helpUrl: 'https://docs.gusto.com/' },
  lever: { placeholder: 'API Key', helpUrl: 'https://hire.lever.co/developer/' },
  greenhouse: { placeholder: 'API Token', helpUrl: 'https://developers.greenhouse.io/' },
  deel: { placeholder: 'API Token', helpUrl: 'https://developer.deel.com/' },
  rippling: { placeholder: 'API Key', helpUrl: 'https://developer.rippling.com/' },
  
  // Support
  zendesk: { placeholder: 'API Token', helpUrl: 'https://developer.zendesk.com/' },
  freshdesk: { placeholder: 'API Key', helpUrl: 'https://developers.freshdesk.com/' },
  helpscout: { placeholder: 'API Key', helpUrl: 'https://developer.helpscout.com/' },
  front: { placeholder: 'API Token', helpUrl: 'https://dev.frontapp.com/' },
  gorgias: { placeholder: 'API Key', helpUrl: 'https://developers.gorgias.com/' },
  kustomer: { placeholder: 'API Key', helpUrl: 'https://developer.kustomer.com/' },
};

// Build full integrations list from BUILT_IN_CONNECTORS
const integrations: IntegrationConfig[] = BUILT_IN_CONNECTORS.map((connector) => {
  const id = connector.id!;

  const base: IntegrationConfig = {
    id,
    name: connector.name!,
    category: connector.category!,
    icon: connector.icon!,
    color: connector.color!,
    verified: connector.verified || false,
    placeholder: CONNECTOR_DETAILS[id]?.placeholder,
    helpUrl: CONNECTOR_DETAILS[id]?.helpUrl,
  };

  // UI branding: do not display “supabase” wording in Aether APIs.
  if (id === 'supabase') {
    return {
      ...base,
      name: 'Backend Cloud',
      placeholder: 'Jeton backend',
      helpUrl: undefined,
    };
  }

  return base;
});

export default function Integrations() {
  const { 
    keysByService, 
    loading, 
    saveKey, 
    deleteKey, 
    hasKey 
  } = useUserApiKeys();
  
  const [activeTab, setActiveTab] = useState<'all' | ConnectorCategory>('all');
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savingServices, setSavingServices] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize editing keys from saved values
  useEffect(() => {
    const initial: Record<string, string> = {};
    integrations.forEach(integration => {
      const savedKey = keysByService[integration.id];
      if (savedKey) {
        initial[integration.id] = savedKey;
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
        i.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeTab, searchQuery]);

  const connectedCount = integrations.filter(i => hasKey(i.id)).length;

  const handleSave = async (serviceId: string) => {
    const value = editingKeys[serviceId];
    if (!value?.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }

    setSavingServices(prev => new Set(prev).add(serviceId));
    const success = await saveKey(serviceId, value);
    setSavingServices(prev => {
      const next = new Set(prev);
      next.delete(serviceId);
      return next;
    });

    if (success) {
      toast.success('Clé API sauvegardée');
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (serviceId: string) => {
    const success = await deleteKey(serviceId);
    if (success) {
      setEditingKeys(prev => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
      toast.success('Clé API supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getIcon = (iconName: string): React.ElementType => {
    return iconMap[iconName] || Key;
  };

  const categories = Object.entries(CONNECTOR_CATEGORIES) as [ConnectorCategory, { label: string; icon: string; color: string }][];

  return (
    <DashboardLayout>
      <div className="h-full min-h-0 flex flex-col">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Security notice */}
            <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Sécurité des clés API</p>
                <p className="text-muted-foreground mt-1">
                  Vos clés sont chiffrées et stockées de manière sécurisée. Ne partagez jamais vos clés API.
                  {connectedCount > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      {connectedCount} service{connectedCount > 1 ? 's' : ''} connecté{connectedCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une intégration (Slack, OpenAI, Stripe...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="flex flex-wrap gap-1 h-auto p-1 bg-muted/50">
                <TabsTrigger value="all" className="text-xs">
                  Tous ({integrations.length})
                </TabsTrigger>
                {categories.map(([key, { label }]) => {
                  const count = integrations.filter(i => i.category === key).length;
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {label} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredIntegrations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucune intégration trouvée pour "{searchQuery}"
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredIntegrations.map((integration) => {
                      const Icon = getIcon(integration.icon);
                      const isConnected = hasKey(integration.id);
                      const isSaving = savingServices.has(integration.id);
                      const currentValue = editingKeys[integration.id] || '';
                      const isVisible = showKeys[integration.id];

                      return (
                        <Card
                          key={integration.id}
                          className={`transition-all hover:shadow-md ${isConnected ? 'border-success/30 bg-success/5' : ''}`}
                        >
                          <CardContent className="p-4 space-y-3">
                            {/* Header */}
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${integration.color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color: integration.color }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm truncate">{integration.name}</h3>
                                  {integration.verified && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                      Vérifié
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {CONNECTOR_CATEGORIES[integration.category]?.label}
                                </p>
                              </div>
                              {isConnected ? (
                                <CheckCircle className="w-4 h-4 text-success shrink-0" />
                              ) : null}
                            </div>

                            {/* API Key input */}
                            <div className="space-y-2">
                              <div className="relative">
                                <Input
                                  type={isVisible ? 'text' : 'password'}
                                  placeholder={integration.placeholder || 'Entrez votre clé API'}
                                  value={currentValue}
                                  onChange={(e) => setEditingKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                  className="pr-10 h-9 text-xs font-mono"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-9 w-9 p-0"
                                  onClick={() => setShowKeys(prev => ({ ...prev, [integration.id]: !isVisible }))}
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </Button>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 h-8 text-xs"
                                  onClick={() => handleSave(integration.id)}
                                  disabled={isSaving || !currentValue.trim()}
                                >
                                  {isSaving ? (
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                  ) : (
                                    <Save className="w-3 h-3 mr-1" />
                                  )}
                                  Sauvegarder
                                </Button>
                                {isConnected && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleDelete(integration.id)}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                )}
                                {integration.helpUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    asChild
                                  >
                                    <a href={integration.helpUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
}
