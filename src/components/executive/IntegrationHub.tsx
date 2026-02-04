import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, CheckCircle2, XCircle, AlertCircle, Settings,
  RefreshCw, ExternalLink, Database, Cloud, Zap,
  CreditCard, MessageSquare, Users, BarChart3, Shield, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionStatus } from '@/hooks/useExecutiveInsights';
import { useNavigate } from 'react-router-dom';

interface IntegrationHubProps {
  connections: ConnectionStatus[];
  onRefresh: () => void;
  loading?: boolean;
}

interface IntegrationCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  integrations: IntegrationConfig[];
}

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: string;
  features: string[];
  dataPoints: string[];
}

const availableIntegrations: IntegrationConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Paiements et facturation',
    icon: CreditCard,
    color: 'text-violet-500',
    category: 'payment',
    features: ['Suivi des paiements', 'Revenus récurrents', 'Analyse des transactions'],
    dataPoints: ['MRR', 'ARR', 'Churn rate', 'LTV'],
  },
  {
    id: 'google',
    name: 'Google Workspace',
    description: 'Email, Calendar, Drive',
    icon: Mail,
    color: 'text-red-500',
    category: 'productivity',
    features: ['Sync emails', 'Calendrier partagé', 'Documents'],
    dataPoints: ['Emails envoyés', 'Réunions', 'Documents créés'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Communication d\'équipe',
    icon: MessageSquare,
    color: 'text-purple-500',
    category: 'communication',
    features: ['Notifications', 'Channels sync', 'Bots intégrés'],
    dataPoints: ['Messages', 'Réactions', 'Canaux actifs'],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Collaboration Microsoft',
    icon: Users,
    color: 'text-blue-500',
    category: 'communication',
    features: ['Appels vidéo', 'Chat d\'équipe', 'Intégration Office'],
    dataPoints: ['Appels', 'Messages', 'Fichiers partagés'],
  },
  {
    id: 'crm',
    name: 'CRM Interne',
    description: 'Gestion de la relation client',
    icon: BarChart3,
    color: 'text-emerald-500',
    category: 'crm',
    features: ['Pipeline ventes', 'Contacts', 'Opportunités'],
    dataPoints: ['Deals', 'Valeur pipeline', 'Taux conversion'],
  },
  {
    id: 'workflows',
    name: 'AETHER Flow',
    description: 'Automatisation et ERP',
    icon: Zap,
    color: 'text-amber-500',
    category: 'erp',
    features: ['Workflows auto', 'Intégrations', 'Triggers'],
    dataPoints: ['Workflows actifs', 'Exécutions', 'Temps gagné'],
  },
];

const categories: IntegrationCategory[] = [
  { id: 'all', name: 'Toutes', icon: Plug, integrations: [] },
  { id: 'payment', name: 'Paiement', icon: CreditCard, integrations: [] },
  { id: 'communication', name: 'Communication', icon: MessageSquare, integrations: [] },
  { id: 'productivity', name: 'Productivité', icon: Database, integrations: [] },
  { id: 'crm', name: 'CRM', icon: Users, integrations: [] },
  { id: 'erp', name: 'ERP', icon: Zap, integrations: [] },
];

export function IntegrationHub({ connections, onRefresh, loading }: IntegrationHubProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getConnectionStatus = (integrationId: string): ConnectionStatus | undefined => {
    return connections.find(c => c.id === integrationId);
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalIntegrations = availableIntegrations.length;
  const integrationScore = Math.round((connectedCount / totalIntegrations) * 100);

  const filteredIntegrations = selectedCategory === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter(i => i.category === selectedCategory);

  const getStatusConfig = (status?: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Connecté' };
      case 'partial':
        return { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Partiel' };
      default:
        return { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Non connecté' };
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plug className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Hub d'Intégrations</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Connectez vos outils métier
              </p>
            </div>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Actualiser
          </Button>
        </div>

        {/* Integration Score */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Score d'intégration</span>
            <Badge variant={integrationScore >= 70 ? 'default' : integrationScore >= 40 ? 'secondary' : 'destructive'}>
              {connectedCount}/{totalIntegrations} actives
            </Badge>
          </div>
          <Progress value={integrationScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {integrationScore >= 70 
              ? 'Excellent ! Vos données sont bien centralisées.'
              : integrationScore >= 40
              ? 'Bon début. Connectez plus d\'outils pour une vue complète.'
              : 'Connectez vos outils pour débloquer tout le potentiel de l\'IA.'}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto">
        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              className="gap-2 flex-shrink-0"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="w-3 h-3" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="space-y-3">
          {filteredIntegrations.map((integration) => {
            const connection = getConnectionStatus(integration.id);
            const statusConfig = getStatusConfig(connection?.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card 
                key={integration.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  connection?.status === 'connected' && "border-emerald-500/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", statusConfig.bg)}>
                      <integration.icon className={cn("w-6 h-6", integration.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={cn("w-4 h-4", statusConfig.color)} />
                          <span className={cn("text-xs", statusConfig.color)}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {integration.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {integration.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Data Points when connected */}
                      {connection?.status === 'connected' && connection.metrics && (
                        <div className="flex gap-3 p-2 rounded-lg bg-muted/50">
                          {Object.entries(connection.metrics).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-sm font-semibold">{value}</div>
                              <div className="text-[10px] text-muted-foreground capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-end mt-3">
                        <Button
                          variant={connection?.status === 'connected' ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => navigate('/settings/integrations')}
                          className="gap-2"
                        >
                          {connection?.status === 'connected' ? (
                            <>
                              <Settings className="w-3 h-3" />
                              Configurer
                            </>
                          ) : (
                            <>
                              <Plug className="w-3 h-3" />
                              Connecter
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
