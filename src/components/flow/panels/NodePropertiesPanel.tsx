import { memo, useState, useMemo, useEffect } from 'react';
import { WorkflowBlock, ExecutionStatus } from '@/types/workflow';
import { getBlockByType, BlockDefinition, BlockParam, BLOCK_LIBRARY } from '@/types/block-library';
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
  Mail, FolderOpen, Tag, Loader2, LogOut, Brain, Code, Box
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
  main: { label: '⚙️ Paramètres', icon: Settings },
  settings: { label: '🔧 Options', icon: Settings },
  advanced: { label: '🔬 Avancé', icon: Code },
  connection: { label: 'Connexion', icon: Mail },
};

function NodePropertiesPanelComponent({
  block,
  executionStatus = 'idle',
  lastOutput,
  onUpdate,
  onClose,
}: NodePropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['main', 'settings', 'connection'])
  );
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  
  // Google OAuth hook
  const { status: googleOAuthStatus, loading: googleOAuthLoading, connect: connectGoogle, disconnect: disconnectGoogle } = useGoogleOAuth();

  if (!block) return null;

  // Get definition from BLOCK_LIBRARY (single source of truth)
  const definition = getBlockByType(block.type);
  
  // Get icon component
  const Icon = definition?.icon 
    ? (LucideIcons as any)[definition.icon] || Box 
    : Box;

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

  // Get effective config value with fallback to default
  const getEffectiveConfigValue = (key: string) => {
    const raw = block.config?.[key];
    if (raw !== undefined) return raw;
    const paramDef = definition?.params?.find((p) => p.key === key);
    return paramDef?.defaultValue;
  };

  // Check if param should be visible based on showWhen condition
  const isParamVisible = (param: BlockParam): boolean => {
    if (!param.showWhen) return true;
    const conditionValue = getEffectiveConfigValue(param.showWhen.field);
    return conditionValue === param.showWhen.value;
  };

  // Group params by section
  const paramsBySection = useMemo(() => {
    const sections: Record<string, BlockParam[]> = { main: [], settings: [], advanced: [] };
    
    definition?.params?.forEach((param) => {
      if (!isParamVisible(param)) return;
      
      const sectionKey = param.section || 'main';
      if (!sections[sectionKey]) {
        sections[sectionKey] = [];
      }
      sections[sectionKey].push(param);
    });
    
    return sections;
  }, [definition?.params, block.config]);

  const renderParam = (param: BlockParam) => {
    const value = block.config?.[param.key];
    const defaultVal = param.defaultValue;

    switch (param.type) {
      case 'string':
      case 'expression':
        return (
          <div className="space-y-1">
            <Input
              value={value || ''}
              onChange={(e) => handleConfigChange(param.key, e.target.value)}
              placeholder={param.placeholder}
              className={cn("h-8 text-sm", param.expressionEnabled && "font-mono")}
            />
            {param.expressionEnabled && (
              <p className="text-[9px] text-muted-foreground">
                💡 Utilisez {'{{ $json.field }}'} pour les expressions
              </p>
            )}
          </div>
        );
      
      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleConfigChange(param.key, e.target.value)}
            placeholder={param.placeholder}
            className="text-sm min-h-[80px]"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value ?? defaultVal ?? ''}
            onChange={(e) => handleConfigChange(param.key, Number(e.target.value))}
            placeholder={param.placeholder}
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
              onCheckedChange={(checked) => handleConfigChange(param.key, checked)}
            />
          </div>
        );
      
      case 'select':
        return (
          <Select
            value={value || defaultVal || ''}
            onValueChange={(val) => handleConfigChange(param.key, val)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option) => {
                const optValue = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optValue} value={optValue}>
                    {optLabel}
                  </SelectItem>
                );
              })}
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
                handleConfigChange(param.key, parsed);
              } catch {
                handleConfigChange(param.key, e.target.value);
              }
            }}
            placeholder={param.placeholder}
            className="text-sm min-h-[60px] font-mono text-xs"
          />
        );
      
      case 'code':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleConfigChange(param.key, e.target.value)}
            placeholder={param.placeholder || '// Your code here'}
            className="text-sm min-h-[100px] font-mono text-xs"
          />
        );

      case 'keyvalue':
        return (
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleConfigChange(param.key, parsed);
              } catch {
                handleConfigChange(param.key, e.target.value);
              }
            }}
            placeholder='{"key": "value"}'
            className="text-sm min-h-[60px] font-mono text-xs"
          />
        );

      case 'cron':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleConfigChange(param.key, e.target.value)}
            placeholder={param.placeholder || '0 9 * * 1-5'}
            className="h-8 text-sm font-mono"
          />
        );
      
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleConfigChange(param.key, e.target.value)}
            placeholder={param.placeholder}
            className="h-8 text-sm"
          />
        );
    }
  };

  // ===== Gmail OAuth section (for email_trigger/trigger_gmail/email_oauth) =====
  const isEmailTrigger = ['email_trigger', 'trigger_gmail', 'email_oauth', 'trigger_email'].includes(block.type);
  const selectedProvider = block.config?.provider || 'gmail';
  const isGmailProvider = selectedProvider === 'gmail';
  const showOAuthSection = isEmailTrigger && isGmailProvider;

  const renderGmailOAuthSection = () => {
    if (!showOAuthSection) return null;

    const isConnected = googleOAuthStatus?.connected && !googleOAuthStatus?.expired;
    const isExpired = googleOAuthStatus?.expired;
    const email = googleOAuthStatus?.email;

    const handleConnect = () => {
      const clientId = block.config?.clientId || block.config?.googleClientId;
      const clientSecret = block.config?.clientSecret || block.config?.googleClientSecret;
      
      connectGoogle(['gmail.readonly', 'gmail.send'], clientId && clientSecret ? { clientId, clientSecret } : undefined);
    };

    const renderGoogleCredentialsFields = (variant: 'compact' | 'full' = 'full') => (
      <div className={cn(
        "space-y-2 rounded-lg border border-border bg-muted/30",
        variant === 'compact' ? 'p-2' : 'p-3'
      )}>
        <p className="text-[10px] text-muted-foreground font-medium">
          Identifiants Google Cloud (Client ID / Secret)
        </p>
        <Input
          value={block.config?.clientId || block.config?.googleClientId || ''}
          onChange={(e) => handleConfigChange('clientId', e.target.value)}
          placeholder="Client ID"
          className={cn('text-xs', variant === 'compact' ? 'h-7' : 'h-8')}
        />
        <Input
          type="password"
          value={block.config?.clientSecret || block.config?.googleClientSecret || ''}
          onChange={(e) => handleConfigChange('clientSecret', e.target.value)}
          placeholder="Client Secret"
          className={cn('text-xs', variant === 'compact' ? 'h-7' : 'h-8')}
        />
        <p className="text-[10px] text-muted-foreground">
          Si vous voyez l’erreur “missing_credentials”, renseignez ces champs puis cliquez sur “Connecter/Reconnecter”.
        </p>
      </div>
    );

    return (
      <Collapsible
        open={expandedSections.has('connection')}
        onOpenChange={() => toggleSection('connection')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">🔗 Connexion Gmail</span>
            {isConnected && <span className="w-2 h-2 rounded-full bg-green-500" />}
            {isExpired && <span className="w-2 h-2 rounded-full bg-orange-500" />}
          </div>
          <ChevronRight className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expandedSections.has('connection') && "rotate-90"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 space-y-3 border-l-2 border-muted ml-2">
            {/* Status */}
            {isConnected ? (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Compte connecté</span>
                </div>
                {email && <p className="text-xs text-muted-foreground">{email}</p>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectGoogle}
                  disabled={googleOAuthLoading}
                  className="mt-2 text-xs h-7"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Déconnecter
                </Button>
              </div>
            ) : isExpired ? (
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Token expiré</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Votre connexion Gmail a expiré. Reconnectez-vous pour continuer.
                </p>

                {/* Credentials are required for BYOK refresh/reconnect flows */}
                {renderGoogleCredentialsFields('compact')}

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConnect}
                  disabled={googleOAuthLoading}
                  className="text-xs h-7"
                >
                  {googleOAuthLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Mail className="w-3 h-3 mr-1" />}
                  Reconnecter Gmail
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Connectez votre compte Google pour accéder à Gmail.
                </p>
                {renderGoogleCredentialsFields('full')}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConnect}
                  disabled={googleOAuthLoading}
                  className="w-full text-xs h-8"
                >
                  {googleOAuthLoading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Mail className="w-3 h-3 mr-2" />}
                  Connecter Gmail
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderSection = (sectionKey: string, params: BlockParam[]) => {
    if (!params || params.length === 0) return null;
    
    const sectionInfo = SECTION_LABELS[sectionKey];
    const SectionIcon = sectionInfo?.icon || Settings;
    
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
            <span className="text-xs text-muted-foreground">({params.length})</span>
          </div>
          <ChevronRight className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expandedSections.has(sectionKey) && "rotate-90"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 space-y-4 border-l-2 border-muted ml-2">
            {params.map((param) => (
              <div key={param.key} className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1">
                  {param.label}
                  {param.required && <span className="text-red-500">*</span>}
                </Label>
                {renderParam(param)}
                {param.helpText && (
                  <p className="text-[10px] text-muted-foreground">{param.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Get ordered sections
  const orderedSections = useMemo(() => {
    const order = ['main', 'settings', 'advanced'];
    return order.filter(s => paramsBySection[s]?.length > 0);
  }, [paramsBySection]);

  // Show warning if no definition found
  const noDefinition = !definition;

  return (
    <div className="w-80 h-full min-h-0 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: definition?.color || '#6b7280' }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Input
                value={block.name}
                onChange={(e) => onUpdate(block.id, { name: e.target.value })}
                className="h-7 text-sm font-semibold border-none p-0 focus-visible:ring-0"
              />
              <p className="text-xs text-muted-foreground">{definition?.name || block.type}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        {definition?.description && (
          <p className="text-xs text-muted-foreground mb-2">{definition.description}</p>
        )}

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
          {/* Warning if no definition */}
          {noDefinition && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">Block type non reconnu</span>
              </div>
              <p className="text-[10px] text-amber-600">
                Le type "{block.type}" n'est pas dans la bibliothèque. 
                Ce block peut avoir été créé par une ancienne version.
              </p>
            </div>
          )}

          {/* No params message */}
          {definition && (!definition.params || definition.params.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Ce block n'a pas de paramètres configurables.</p>
            </div>
          )}

          {/* Gmail OAuth Section (for email_trigger, trigger_gmail, email_oauth blocks) */}
          {renderGmailOAuthSection()}

          {/* Render sections in order */}
          {orderedSections.map(sectionKey => 
            renderSection(sectionKey, paramsBySection[sectionKey])
          )}

          {/* Typed Ports Info */}
          {definition?.inputPorts && definition.inputPorts.length > 0 && (
            <Collapsible
              open={expandedSections.has('ports')}
              onOpenChange={() => toggleSection('ports')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ports d'entrée</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  expandedSections.has('ports') && "rotate-90"
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-2 border-l-2 border-muted ml-2">
                  {definition.inputPorts.map((port) => (
                    <div key={port.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: definition.color }} />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{port.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Type: {port.type} {port.required && '(requis)'} {port.multiple && '(multiple)'}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground">
                    💡 Connectez des sub-nodes aux ports typés depuis le canvas.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
              <div className="p-3 space-y-4 border-l-2 border-muted ml-2">
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

          {/* Debug: show raw config */}
          <Collapsible
            open={expandedSections.has('debug')}
            onOpenChange={() => toggleSection('debug')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors opacity-50">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Debug</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedSections.has('debug') && "rotate-90"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Block Type</Label>
                  <code className="block text-[10px] bg-secondary/50 p-1 rounded">{block.type}</code>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Config (JSON)</Label>
                  <pre className="text-[10px] bg-secondary/50 p-2 rounded-lg overflow-auto max-h-32">
                    {JSON.stringify(block.config, null, 2)}
                  </pre>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export const NodePropertiesPanel = memo(NodePropertiesPanelComponent);
