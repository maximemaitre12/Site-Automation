import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'ai' | 'productivity' | 'communication';
  status: 'connected' | 'disconnected' | 'coming_soon';
  color: string;
  features: string[];
  docsUrl?: string;
}

const integrations: Integration[] = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Voix IA ultra-réalistes pour conversations, synthèse vocale et agents vocaux',
    icon: Mic,
    category: 'ai',
    status: 'connected',
    color: 'from-violet-500 to-purple-500',
    features: ['Text-to-Speech', 'Agents vocaux', 'Clonage de voix', 'Transcription'],
    docsUrl: 'https://elevenlabs.io/docs'
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'Scraping web intelligent et extraction de données structurées',
    icon: FileSearch,
    category: 'ai',
    status: 'connected',
    color: 'from-orange-500 to-red-500',
    features: ['Scraping de sites', 'Extraction de données', 'Recherche web', 'Enrichissement'],
    docsUrl: 'https://firecrawl.dev/docs'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Recherche IA avancée avec sources vérifiées et réponses en temps réel',
    icon: Search,
    category: 'ai',
    status: 'connected',
    color: 'from-cyan-500 to-blue-500',
    features: ['Recherche en temps réel', 'Sources vérifiées', 'Réponses contextuelles', 'API de recherche'],
    docsUrl: 'https://docs.perplexity.ai'
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Synchronisation automatique des entretiens et meetings',
    icon: Zap,
    category: 'productivity',
    status: 'coming_soon',
    color: 'from-blue-500 to-indigo-500',
    features: ['Sync bidirectionnelle', 'Rappels automatiques', 'Disponibilités']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notifications et actions directement dans Slack',
    icon: MessageSquare,
    category: 'communication',
    status: 'coming_soon',
    color: 'from-purple-500 to-pink-500',
    features: ['Notifications', 'Commandes slash', 'Workflows']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Synchronisation CRM bidirectionnelle',
    icon: Globe,
    category: 'productivity',
    status: 'coming_soon',
    color: 'from-orange-500 to-amber-500',
    features: ['Sync contacts', 'Sync deals', 'Activités']
  }
];

export default function Integrations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'productivity' | 'communication'>('all');

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const StatusBadge = ({ status }: { status: Integration['status'] }) => {
    if (status === 'connected') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-600 border-0 gap-1">
          <CheckCircle className="w-3 h-3" />
          Connecté
        </Badge>
      );
    }
    if (status === 'coming_soon') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="w-3 h-3" />
          Bientôt
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground gap-1">
        <XCircle className="w-3 h-3" />
        Non connecté
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Plug className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Intégrations</h1>
                <p className="text-sm text-muted-foreground">
                  Connectez vos outils favoris à AETHER
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {connectedCount} actives
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings/api-keys')}>
                <Key className="w-4 h-4 mr-2" />
                Clés API
              </Button>
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
            <TabsTrigger value="productivity" className="gap-1.5 text-xs sm:text-sm">
              <Zap className="w-3.5 h-3.5" />
              Productivité
            </TabsTrigger>
            <TabsTrigger value="communication" className="gap-1.5 text-xs sm:text-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center shrink-0`}>
                        <integration.icon className="w-5 h-5 text-white" />
                      </div>
                      <StatusBadge status={integration.status} />
                    </div>
                    <CardTitle className="text-base sm:text-lg mt-3">{integration.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {integration.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-[10px] sm:text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {integration.features.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          +{integration.features.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === 'coming_soon' ? (
                        <Button variant="secondary" size="sm" className="flex-1" disabled>
                          Bientôt disponible
                        </Button>
                      ) : integration.status === 'connected' ? (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurer
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          <Plug className="w-4 h-4 mr-2" />
                          Connecter
                        </Button>
                      )}
                      {integration.docsUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured AI Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Fonctionnalités IA Révolutionnaires</h2>
          </div>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Voix IA</h3>
                    <p className="text-xs text-muted-foreground">Réponses vocales, entretiens simulés, messages personnalisés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <FileSearch className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Scraping Intelligent</h3>
                    <p className="text-xs text-muted-foreground">Enrichissement automatique, veille concurrentielle</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Recherche Temps Réel</h3>
                    <p className="text-xs text-muted-foreground">Infos prospects, veille réglementaire, benchmarks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
