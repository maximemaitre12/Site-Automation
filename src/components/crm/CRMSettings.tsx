import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Layers,
  Users,
  Shield,
  Zap,
  Brain,
  FileText
} from 'lucide-react';

interface CRMSettingsProps {
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

export function CRMSettings({ crm }: CRMSettingsProps) {
  const { stages } = crm;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Paramètres CRM</h2>
          <p className="text-sm text-muted-foreground">Configurez votre CRM selon vos besoins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pipeline Settings */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Pipeline de vente
            </CardTitle>
            <CardDescription>Gérez les étapes de votre pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="font-medium">{stage.name}</span>
                  </div>
                  <Badge variant="secondary">{stage.probability}%</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Personnaliser le pipeline
              <Badge variant="secondary" className="ml-2">Bientôt</Badge>
            </Button>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Intelligence Artificielle
            </CardTitle>
            <CardDescription>Configurez les fonctionnalités IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div>
                  <p className="font-medium">Scoring automatique</p>
                  <p className="text-sm text-muted-foreground">Évaluation IA des leads</p>
                </div>
                <Badge className="bg-success/10 text-success">Actif</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div>
                  <p className="font-medium">Suggestions de tâches</p>
                  <p className="text-sm text-muted-foreground">Recommandations intelligentes</p>
                </div>
                <Badge className="bg-success/10 text-success">Actif</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div>
                  <p className="font-medium">Analyse de sentiment</p>
                  <p className="text-sm text-muted-foreground">Sur les communications</p>
                </div>
                <Badge className="bg-success/10 text-success">Actif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Intégrations AETHER
            </CardTitle>
            <CardDescription>Connectez vos modules AETHER</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">AETHER Flow</p>
                    <p className="text-sm text-muted-foreground">Automatisations</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Connecté</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">AETHER Doc</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Connecté</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">AETHER Brain</p>
                    <p className="text-sm text-muted-foreground">Assistant IA</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Connecté</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Sécurité & Permissions
            </CardTitle>
            <CardDescription>Gérez les accès utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Gestion des rôles</p>
                    <p className="text-sm text-muted-foreground">Admin, Manager, Éditeur, Lecteur</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Configurer
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Audit des accès</p>
                    <p className="text-sm text-muted-foreground">Historique des modifications</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Activé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
