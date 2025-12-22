import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, Check, Settings, RefreshCw, Trash2, 
  Plus, Loader2, AlertCircle, ExternalLink
} from 'lucide-react';
import { useHREmails, HREmailAccount } from '@/hooks/useHREmails';
import { toast } from 'sonner';

export function EmailAccountConnect() {
  const { accounts, activeAccount, saveEmailAccount, loading } = useHREmails();
  const [showConfig, setShowConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState({
    email_address: activeAccount?.email_address || '',
    sender_name: activeAccount?.sender_name || 'Service RH',
    auto_parse_cv: activeAccount?.auto_parse_cv ?? true,
    auto_create_candidate: activeAccount?.auto_create_candidate ?? true,
    signature_html: activeAccount?.signature_html || '',
  });

  const handleSaveConfig = async () => {
    if (!config.email_address) {
      toast.error('Entrez une adresse email');
      return;
    }

    setSaving(true);
    try {
      await saveEmailAccount({
        provider: 'manual',
        email_address: config.email_address,
        sender_name: config.sender_name,
        auto_parse_cv: config.auto_parse_cv,
        auto_create_candidate: config.auto_create_candidate,
        signature_html: config.signature_html,
        is_active: true,
      });
      setShowConfig(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (activeAccount && !showConfig) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Compte configuré</CardTitle>
                <CardDescription>{activeAccount.email_address}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Check className="w-3 h-3" />
              Actif
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfig(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Configuration Email
        </CardTitle>
        <CardDescription>
          Configurez votre email pour envoyer des réponses aux candidats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email *</Label>
            <Input
              id="email"
              type="email"
              value={config.email_address}
              onChange={(e) => setConfig({ ...config, email_address: e.target.value })}
              placeholder="recrutement@votreentreprise.com"
            />
            <p className="text-xs text-muted-foreground">
              Cette adresse sera utilisée comme expéditeur pour vos réponses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_name">Nom d'expéditeur</Label>
            <Input
              id="sender_name"
              value={config.sender_name}
              onChange={(e) => setConfig({ ...config, sender_name: e.target.value })}
              placeholder="Service RH"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Automatisations</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_parse" className="text-sm">Parser automatiquement les CV</Label>
                <p className="text-xs text-muted-foreground">
                  Extraire les informations des CV joints automatiquement
                </p>
              </div>
              <Switch
                id="auto_parse"
                checked={config.auto_parse_cv}
                onCheckedChange={(checked) => setConfig({ ...config, auto_parse_cv: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_create" className="text-sm">Créer automatiquement les candidats</Label>
                <p className="text-xs text-muted-foreground">
                  Créer une fiche candidat pour chaque nouvel email
                </p>
              </div>
              <Switch
                id="auto_create"
                checked={config.auto_create_candidate}
                onCheckedChange={(checked) => setConfig({ ...config, auto_create_candidate: checked })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="signature">Signature email</Label>
            <textarea
              id="signature"
              value={config.signature_html}
              onChange={(e) => setConfig({ ...config, signature_html: e.target.value })}
              placeholder="Cordialement,&#10;L'équipe RH"
              className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showConfig && (
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Annuler
            </Button>
          )}
          <Button onClick={handleSaveConfig} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Enregistrer
          </Button>
        </div>

        {/* Future OAuth options */}
        <Separator />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Connexion directe (bientôt disponible)
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled className="justify-start">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connecter Gmail
            </Button>
            
            <Button variant="outline" disabled className="justify-start">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.17 3H2.83A1.83 1.83 0 0 0 1 4.83v14.34A1.83 1.83 0 0 0 2.83 21h18.34A1.83 1.83 0 0 0 23 19.17V4.83A1.83 1.83 0 0 0 21.17 3zM12 12.5L3 7h18l-9 5.5z"/>
              </svg>
              Connecter Outlook
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            La connexion directe permettra de lire et envoyer des emails depuis votre boîte mail
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
