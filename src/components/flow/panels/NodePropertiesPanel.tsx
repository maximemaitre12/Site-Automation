import { memo, useState, useMemo } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS, ExecutionStatus, ConfigField } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { 
  X, ChevronRight, Settings, RefreshCw, 
  FileJson, Zap, AlertCircle, CheckCircle2,
  Eye, EyeOff, ExternalLink, Key, Shield, Copy,
  Mail, FolderOpen, Tag, Loader2, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';

interface NodePropertiesPanelProps {
  block: WorkflowBlock | null;
  executionStatus?: ExecutionStatus;
  lastOutput?: any;
  onUpdate: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onClose: () => void;
}

// Section labels for better UX
const SECTION_LABELS: Record<string, { label: string; icon: typeof Settings }> = {
  connection: { label: 'Connexion Google OAuth', icon: Mail },
  auth: { label: 'Authentification', icon: Key },
  filters: { label: 'Filtres', icon: Settings },
  message: { label: 'Message', icon: Mail },
  reply: { label: 'Réponse', icon: Mail },
  search: { label: 'Recherche', icon: Settings },
  format: { label: 'Format', icon: FileJson },
  destinations: { label: 'Destinations', icon: FolderOpen },
  advanced: { label: 'Options avancées', icon: Settings },
};

function NodePropertiesPanelComponent({
  block,
  executionStatus = 'idle',
  lastOutput,
  onUpdate,
  onClose,
}: NodePropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['config', 'connection', 'auth', 'filters', 'message', 'format', 'destinations'])
  );
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  
  // Google OAuth hook
  const { status: googleOAuthStatus, loading: googleOAuthLoading, connect: connectGoogle, disconnect: disconnectGoogle } = useGoogleOAuth();

  if (!block) return null;

  const definition = BLOCK_DEFINITIONS[block.type];
  const Icon = definition?.icon 
    ? (LucideIcons as any)[definition.icon] || LucideIcons.Box 
    : LucideIcons.Box;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    onUpdate(block.id, {
      config: { ...block.config, [key]: value },
    });
  };

  const handleRetryChange = (updates: Partial<NonNullable<WorkflowBlock['retryConfig']>>) => {
    onUpdate(block.id, {
      retryConfig: { ...block.retryConfig, enabled: true, maxRetries: 3, backoffMs: 1000, ...updates },
    });
  };

  const handleOAuthConnect = async (provider: string) => {
    if (provider.toLowerCase() === 'google') {
      // Get credentials from block config
      const clientId = block?.config?.googleClientId;
      const clientSecret = block?.config?.googleClientSecret;
      
      // Determine scopes based on block type
      const scopes = ['gmail.readonly', 'gmail.send'];
      
      // Pass user-provided credentials if available
      const credentials = clientId && clientSecret 
        ? { clientId, clientSecret } 
        : undefined;
        
      await connectGoogle(scopes, credentials);
    } else {
      toast.info(`Connexion OAuth ${provider}`, {
        description: 'Ce fournisseur n\'est pas encore supporté.',
      });
    }
  };

  // Returns the effective config value for a key, falling back to the field defaultValue.
  // This is important for conditional fields (showWhen) so defaults are respected even
  // before the user manually touches the controlling field.
  const getEffectiveConfigValue = (key: string) => {
    const raw = block.config?.[key];
    if (raw !== undefined) return raw;
    const fieldDef = definition?.configFields?.find((f) => f.key === key);
    return fieldDef?.defaultValue;
  };

  // Check if field should be visible based on showWhen condition
  const isFieldVisible = (field: ConfigField): boolean => {
    if (!field.showWhen) return true;
    const conditionValue = getEffectiveConfigValue(field.showWhen.field);
    return conditionValue === field.showWhen.value;
  };

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const sections: Record<string, ConfigField[]> = { default: [] };
    
    definition?.configFields.forEach((field) => {
      if (!isFieldVisible(field)) return;
      
      const sectionKey = field.section || 'default';
      if (!sections[sectionKey]) {
        sections[sectionKey] = [];
      }
      sections[sectionKey].push(field);
    });
    
    return sections;
  }, [definition?.configFields, block.config]);

  const renderField = (field: ConfigField) => {
    const value = block.config[field.key];
    const defaultVal = field.defaultValue;

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        );
      
      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPasswords.has(field.key) ? 'text' : 'password'}
              value={value || ''}
              onChange={(e) => handleConfigChange(field.key, e.target.value)}
              placeholder={field.placeholder || '••••••••'}
              className="h-8 text-sm pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-8 w-8 p-0"
              onClick={() => togglePasswordVisibility(field.key)}
            >
              {showPasswords.has(field.key) ? (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
        );
      
      case 'oauth_button':
        // Check if user has provided credentials in the block config
        const hasCredentials = block?.config?.googleClientId && block?.config?.googleClientSecret;
        
        // Show connected state if Google OAuth is connected
        if (googleOAuthStatus?.connected && googleOAuthStatus.email) {
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-700">Compte connecté</p>
                  <p className="text-[10px] text-green-600 truncate">{googleOAuthStatus.email}</p>
                </div>
              </div>
              
              {/* Switch account button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 gap-2 text-xs"
                onClick={() => handleOAuthConnect('Google')}
                disabled={googleOAuthLoading || !hasCredentials}
              >
                {googleOAuthLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Changer de compte
              </Button>
              
              {/* Disconnect button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 gap-2 text-[10px] text-muted-foreground hover:text-destructive"
                onClick={disconnectGoogle}
                disabled={googleOAuthLoading}
              >
                {googleOAuthLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3" />
                )}
                Déconnecter ce compte
              </Button>
            </div>
          );
        }
        
        // Show message if credentials are not configured
        if (!hasCredentials) {
          return (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] text-amber-700">
                Renseignez d'abord votre Google Client ID et Client Secret ci-dessus pour activer la connexion OAuth.
              </p>
            </div>
          );
        }
        
        // Show connect button when credentials are available
        return (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 gap-2"
              onClick={() => handleOAuthConnect('Google')}
              disabled={googleOAuthLoading}
            >
              {googleOAuthLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Connecter votre compte Google
            </Button>
            <p className="text-[10px] text-muted-foreground">
              Vous serez redirigé vers Google pour autoriser l'accès.
            </p>
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="text-sm min-h-[80px]"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value ?? defaultVal ?? ''}
            onChange={(e) => handleConfigChange(field.key, Number(e.target.value))}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        );
      
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {value ?? defaultVal ? 'Activé' : 'Désactivé'}
            </span>
            <Switch
              checked={value ?? defaultVal ?? false}
              onCheckedChange={(checked) => handleConfigChange(field.key, checked)}
            />
          </div>
        );
      
      case 'select':
        return (
          <Select
            value={value || defaultVal}
            onValueChange={(val) => handleConfigChange(field.key, val)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'json':
        return (
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleConfigChange(field.key, parsed);
              } catch {
                handleConfigChange(field.key, e.target.value);
              }
            }}
            placeholder={field.placeholder}
            className="text-sm min-h-[60px] font-mono text-xs"
          />
        );
      
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        );
    }
  };

  const formatOptionLabel = (option: string): string => {
    const labels: Record<string, string> = {
      'oauth_google': '🔐 Google OAuth (recommandé)',
      'api_key': '🔑 Clé API',
      'imap': '📬 IMAP (tout fournisseur)',
      'smtp': '📤 SMTP (tout fournisseur)',
      'service_account': '🤖 Service Account',
      'pdf': '📄 PDF',
      'docx': '📝 Word (.docx)',
      'xlsx': '📊 Excel (.xlsx)',
      'csv': '📋 CSV',
      'json': '🔧 JSON',
      'txt': '📃 Texte brut',
      'html': '🌐 HTML',
      'md': '📝 Markdown',
    };
    return labels[option] || option;
  };

  const renderSection = (sectionKey: string, fields: ConfigField[]) => {
    if (fields.length === 0) return null;
    
    const sectionInfo = SECTION_LABELS[sectionKey];
    const SectionIcon = sectionInfo?.icon || Settings;
    
    if (sectionKey === 'default') {
      // Render fields without section grouping
      return fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label className="text-xs font-medium flex items-center gap-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          {renderField(field)}
          {field.helpText && (
            <p className="text-[10px] text-muted-foreground">{field.helpText}</p>
          )}
        </div>
      ));
    }

    // Redirect URI for Google OAuth configuration - use the custom domain
    const GOOGLE_REDIRECT_URI = `https://aether-connect.com/oauth/google/callback`;

    return (
      <Collapsible
        key={sectionKey}
        open={expandedSections.has(sectionKey)}
        onOpenChange={() => toggleSection(sectionKey)}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-2">
            <SectionIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{sectionInfo?.label || sectionKey}</span>
            <span className="text-xs text-muted-foreground">({fields.length})</span>
          </div>
          <ChevronRight className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expandedSections.has(sectionKey) && "rotate-90"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 space-y-4 border-l-2 border-muted ml-2">
            {/* Show redirect URI info for connection section */}
            {sectionKey === 'connection' && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Configuration Google Cloud</span>
                </div>
                <p className="text-[10px] text-blue-600">
                  Ajoutez cette URI de redirection dans votre{' '}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    Google Cloud Console
                  </a>
                  {' '}→ OAuth Client ID → URIs de redirection autorisées :
                </p>
                <div className="flex items-center gap-1">
                  <code className="flex-1 text-[9px] bg-blue-500/10 px-2 py-1.5 rounded font-mono break-all text-blue-800">
                    {GOOGLE_REDIRECT_URI}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(GOOGLE_REDIRECT_URI);
                      toast.success('URI copiée !');
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
                {field.helpText && (
                  <p className="text-[10px] text-muted-foreground">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Get ordered sections (connection first, then others, default last)
  const orderedSections = useMemo(() => {
    const order = ['connection', 'auth', 'filters', 'message', 'reply', 'search', 'format', 'destinations', 'advanced', 'default'];
    return order.filter(s => fieldsBySection[s]?.length > 0);
  }, [fieldsBySection]);

  return (
    <div className="w-80 h-full min-h-0 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              `bg-gradient-to-br ${definition?.color || 'from-gray-500 to-gray-400'}`
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Input
                value={block.name}
                onChange={(e) => onUpdate(block.id, { name: e.target.value })}
                className="h-7 text-sm font-semibold border-none p-0 focus-visible:ring-0"
              />
              <p className="text-xs text-muted-foreground">{definition?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Status badge */}
        {executionStatus !== 'idle' && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-lg text-xs",
            executionStatus === 'success' && "bg-green-500/10 text-green-600",
            executionStatus === 'error' && "bg-red-500/10 text-red-600",
            executionStatus === 'running' && "bg-blue-500/10 text-blue-600",
            executionStatus === 'pending' && "bg-yellow-500/10 text-yellow-600"
          )}>
            {executionStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {executionStatus === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
            <span className="capitalize">{executionStatus}</span>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="p-3 space-y-2 pb-8">
          {/* Render sections in order */}
          {orderedSections.map(sectionKey => 
            renderSection(sectionKey, fieldsBySection[sectionKey])
          )}

          {/* Retry & Timeout Section */}
          <Collapsible
            open={expandedSections.has('retry')}
            onOpenChange={() => toggleSection('retry')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Retry & Timeout</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedSections.has('retry') && "rotate-90"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Retry automatique</Label>
                  <Switch
                    checked={block.retryConfig?.enabled ?? false}
                    onCheckedChange={(enabled) => handleRetryChange({ enabled })}
                  />
                </div>
                
                {block.retryConfig?.enabled && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nombre de tentatives</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={block.retryConfig.maxRetries}
                        onChange={(e) => handleRetryChange({ maxRetries: Number(e.target.value) })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Délai entre tentatives (ms)</Label>
                      <Input
                        type="number"
                        min={100}
                        step={100}
                        value={block.retryConfig.backoffMs}
                        onChange={(e) => handleRetryChange({ backoffMs: Number(e.target.value) })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Timeout (ms)</Label>
                  <Input
                    type="number"
                    min={1000}
                    step={1000}
                    value={block.timeout || 30000}
                    onChange={(e) => onUpdate(block.id, { timeout: Number(e.target.value) })}
                    placeholder="30000"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Output Preview Section */}
          {lastOutput && (
            <Collapsible
              open={expandedSections.has('output')}
              onOpenChange={() => toggleSection('output')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dernier résultat</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  expandedSections.has('output') && "rotate-90"
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3">
                  <pre className="text-[10px] bg-secondary/50 p-2 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(lastOutput, null, 2)}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
}

export const NodePropertiesPanel = memo(NodePropertiesPanelComponent);
