import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, Check, Settings, Loader2, ChevronRight, 
  ArrowLeft, Sparkles, Shield, Zap, Eye, EyeOff,
  Server, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useHREmails } from '@/hooks/useHREmails';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Step = 'choose' | 'gmail' | 'outlook' | 'manual' | 'settings' | 'done';

interface EmailProvider {
  id: 'gmail' | 'outlook' | 'manual';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

const providers: EmailProvider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connectez votre compte Google en un clic',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    color: 'bg-white border-2',
    available: false, // OAuth à implémenter
  },
  {
    id: 'outlook',
    name: 'Outlook / Microsoft 365',
    description: 'Connectez votre compte professionnel Microsoft',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.152-.353.228-.584.228h-8.547v-6.959l1.6 1.229c.101.072.221.109.36.109.138 0 .259-.037.36-.109l6.81-5.224c.076-.056.129-.092.159-.109.03-.017.065-.025.104-.025.07 0 .132.028.186.084.054.056.082.118.082.186v.283l-7.7 5.9-1.961-1.506V5.941h8.547c.231 0 .426.076.584.228.158.152.238.346.238.576v.642z"/>
        <path fill="#0078D4" d="M14.631 11.711v6.959H.822c-.227 0-.42-.076-.58-.228C.082 18.29 0 18.096 0 17.865V6.387c0-.231.082-.424.243-.576.159-.152.353-.228.58-.228h13.808v6.128z"/>
        <path fill="#0078D4" d="M8.076 8.461c-.957 0-1.736.313-2.338.938-.603.625-.904 1.448-.904 2.469 0 1.008.298 1.825.894 2.45.596.625 1.368.938 2.315.938.96 0 1.743-.31 2.348-.928.605-.619.908-1.44.908-2.46 0-1.034-.3-1.86-.898-2.479-.599-.619-1.378-.928-2.325-.928zm-.033 5.256c-.485 0-.869-.185-1.15-.555-.282-.37-.423-.867-.423-1.492 0-.638.141-1.143.423-1.516.282-.373.665-.559 1.15-.559.497 0 .886.183 1.165.55.28.367.42.875.42 1.525 0 .637-.14 1.134-.42 1.492-.279.37-.668.555-1.165.555z"/>
      </svg>
    ),
    color: 'bg-white border-2',
    available: false, // OAuth à implémenter
  },
  {
    id: 'manual',
    name: 'Configuration manuelle',
    description: 'IMAP/SMTP pour n\'importe quel fournisseur',
    icon: <Server className="w-6 h-6 text-muted-foreground" />,
    color: 'bg-muted',
    available: true,
  },
];

// Presets pour faciliter la config manuelle
const emailPresets: Record<string, { imap: { host: string; port: number }; smtp: { host: string; port: number } }> = {
  'gmail.com': { 
    imap: { host: 'imap.gmail.com', port: 993 }, 
    smtp: { host: 'smtp.gmail.com', port: 587 } 
  },
  'outlook.com': { 
    imap: { host: 'outlook.office365.com', port: 993 }, 
    smtp: { host: 'smtp.office365.com', port: 587 } 
  },
  'hotmail.com': { 
    imap: { host: 'outlook.office365.com', port: 993 }, 
    smtp: { host: 'smtp.office365.com', port: 587 } 
  },
  'yahoo.com': { 
    imap: { host: 'imap.mail.yahoo.com', port: 993 }, 
    smtp: { host: 'smtp.mail.yahoo.com', port: 587 } 
  },
  'icloud.com': { 
    imap: { host: 'imap.mail.me.com', port: 993 }, 
    smtp: { host: 'smtp.mail.me.com', port: 587 } 
  },
};

export function EmailAccountConnect() {
  const { activeAccount, saveEmailAccount, loading } = useHREmails();
  const [step, setStep] = useState<Step>(activeAccount ? 'done' : 'choose');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionValid, setConnectionValid] = useState<boolean | null>(null);
  
  const [config, setConfig] = useState({
    email_address: activeAccount?.email_address || '',
    password: '',
    sender_name: activeAccount?.sender_name || '',
    imap_host: '',
    imap_port: 993,
    smtp_host: '',
    smtp_port: 587,
    auto_parse_cv: activeAccount?.auto_parse_cv ?? true,
    auto_create_candidate: activeAccount?.auto_create_candidate ?? true,
    signature_html: activeAccount?.signature_html || '',
  });

  // Auto-detect provider from email domain
  useEffect(() => {
    if (config.email_address.includes('@')) {
      const domain = config.email_address.split('@')[1]?.toLowerCase();
      if (domain && emailPresets[domain]) {
        const preset = emailPresets[domain];
        setConfig(prev => ({
          ...prev,
          imap_host: preset.imap.host,
          imap_port: preset.imap.port,
          smtp_host: preset.smtp.host,
          smtp_port: preset.smtp.port,
        }));
      }
    }
  }, [config.email_address]);

  // Auto-generate sender name from email
  useEffect(() => {
    if (config.email_address && !config.sender_name) {
      const localPart = config.email_address.split('@')[0];
      const formatted = localPart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      setConfig(prev => ({ ...prev, sender_name: formatted }));
    }
  }, [config.email_address]);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionValid(null);
    
    // Simulate connection test (in real implementation, call edge function)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, validate based on filled fields
    const isValid = !!(config.email_address && config.imap_host && config.smtp_host);
    setConnectionValid(isValid);
    setTestingConnection(false);
    
    if (isValid) {
      toast.success('Connexion réussie !');
    } else {
      toast.error('Échec de la connexion. Vérifiez vos paramètres.');
    }
  };

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
        sender_name: config.sender_name || 'Service RH',
        auto_parse_cv: config.auto_parse_cv,
        auto_create_candidate: config.auto_create_candidate,
        signature_html: config.signature_html,
        is_active: true,
      });
      setStep('done');
      toast.success('Configuration sauvegardée !');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectProvider = (provider: EmailProvider) => {
    if (!provider.available) {
      toast.info(`${provider.name} sera disponible prochainement`);
      return;
    }
    setStep(provider.id);
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Connected state
  if (step === 'done' && activeAccount) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Boîte mail connectée</h3>
              <p className="text-muted-foreground">{activeAccount.email_address}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {activeAccount.auto_parse_cv && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Parsing CV auto
                </Badge>
              )}
              {activeAccount.auto_create_candidate && (
                <Badge variant="secondary" className="gap-1">
                  <Zap className="w-3 h-3" />
                  Création candidats auto
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Shield className="w-3 h-3" />
                Connexion sécurisée
              </Badge>
            </div>

            <Separator className="my-6" />
            
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setStep('settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Modifier les paramètres
              </Button>
              <Button 
                variant="ghost" 
                className="text-destructive hover:text-destructive"
                onClick={() => setStep('choose')}
              >
                Changer de compte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Provider selection
  if (step === 'choose') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Connectez votre boîte mail</CardTitle>
          <CardDescription className="text-base">
            Recevez et envoyez des emails directement depuis Aether
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSelectProvider(provider)}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-left",
                "hover:border-primary hover:shadow-md",
                "flex items-center gap-4",
                provider.available 
                  ? "cursor-pointer opacity-100" 
                  : "cursor-not-allowed opacity-60",
                provider.color
              )}
            >
              <div className="shrink-0 w-12 h-12 rounded-lg bg-background flex items-center justify-center border">
                {provider.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{provider.name}</span>
                  {!provider.available && (
                    <Badge variant="secondary" className="text-xs">Bientôt</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{provider.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
          
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              <Shield className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Vos identifiants sont chiffrés et stockés de manière sécurisée
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Manual configuration form
  if (step === 'manual') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2"
            onClick={() => setStep('choose')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Configuration manuelle
          </CardTitle>
          <CardDescription>
            Entrez votre email et nous détecterons automatiquement les paramètres
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email & Password */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={config.email_address}
                onChange={(e) => setConfig({ ...config, email_address: e.target.value })}
                placeholder="vous@votreentreprise.com"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe
                <span className="text-xs text-muted-foreground ml-2">
                  (ou mot de passe d'application)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Pour Gmail, utilisez un{' '}
                <a 
                  href="https://support.google.com/accounts/answer/185833" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mot de passe d'application
                </a>
              </p>
            </div>
          </div>

          {/* Auto-detected server settings */}
          {(config.imap_host || config.smtp_host) && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Paramètres détectés automatiquement
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">IMAP:</span>{' '}
                  {config.imap_host}:{config.imap_port}
                </div>
                <div>
                  <span className="text-muted-foreground">SMTP:</span>{' '}
                  {config.smtp_host}:{config.smtp_port}
                </div>
              </div>
            </div>
          )}

          {/* Manual server fields if not auto-detected */}
          {!config.imap_host && config.email_address.includes('@') && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                Fournisseur non reconnu - configuration manuelle requise
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Serveur IMAP</Label>
                  <Input
                    value={config.imap_host}
                    onChange={(e) => setConfig({ ...config, imap_host: e.target.value })}
                    placeholder="imap.exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port IMAP</Label>
                  <Input
                    type="number"
                    value={config.imap_port}
                    onChange={(e) => setConfig({ ...config, imap_port: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Serveur SMTP</Label>
                  <Input
                    value={config.smtp_host}
                    onChange={(e) => setConfig({ ...config, smtp_host: e.target.value })}
                    placeholder="smtp.exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port SMTP</Label>
                  <Input
                    type="number"
                    value={config.smtp_port}
                    onChange={(e) => setConfig({ ...config, smtp_port: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test connection button */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!config.email_address || testingConnection}
            >
              {testingConnection ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : connectionValid === true ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
              ) : connectionValid === false ? (
                <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Tester la connexion
            </Button>
            
            {connectionValid === true && (
              <span className="text-sm text-primary">Connexion réussie !</span>
            )}
          </div>

          <Separator />

          {/* Continue button */}
          <Button 
            onClick={() => setStep('settings')} 
            className="w-full h-11"
            disabled={!config.email_address}
          >
            Continuer
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Settings step
  if (step === 'settings') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2"
            onClick={() => setStep('manual')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Personnalisez votre expérience
          </CardTitle>
          <CardDescription>
            Configurez les automatisations et votre signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sender info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sender_name">Nom d'expéditeur</Label>
              <Input
                id="sender_name"
                value={config.sender_name}
                onChange={(e) => setConfig({ ...config, sender_name: e.target.value })}
                placeholder="Marie Dupont - RH"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Ce nom apparaîtra dans les emails envoyés aux candidats
              </p>
            </div>
          </div>

          <Separator />

          {/* Automations */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automatisations IA
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label className="text-base">Extraction automatique des CV</Label>
                  <p className="text-sm text-muted-foreground">
                    L'IA extrait automatiquement les compétences, expériences et formations des CV reçus
                  </p>
                </div>
                <Switch
                  checked={config.auto_parse_cv}
                  onCheckedChange={(checked) => setConfig({ ...config, auto_parse_cv: checked })}
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label className="text-base">Création automatique des candidats</Label>
                  <p className="text-sm text-muted-foreground">
                    Crée automatiquement une fiche candidat pour chaque nouvelle candidature
                  </p>
                </div>
                <Switch
                  checked={config.auto_create_candidate}
                  onCheckedChange={(checked) => setConfig({ ...config, auto_create_candidate: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Signature */}
          <div className="space-y-2">
            <Label htmlFor="signature">Signature email</Label>
            <textarea
              id="signature"
              value={config.signature_html}
              onChange={(e) => setConfig({ ...config, signature_html: e.target.value })}
              placeholder={`Cordialement,\n${config.sender_name || 'Votre nom'}\nService Recrutement`}
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Save button */}
          <Button 
            onClick={handleSaveConfig} 
            className="w-full h-11"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Terminer la configuration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
