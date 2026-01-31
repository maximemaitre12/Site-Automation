import { WorkflowBlock, BLOCK_DEFINITIONS, BlockType, ConfigField } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X, Settings, Info, Zap, RefreshCw, Clock, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedBlockPropertiesProps {
  block: WorkflowBlock;
  onUpdate: (updates: Partial<WorkflowBlock>) => void;
  onClose: () => void;
}

export function EnhancedBlockProperties({ block, onUpdate, onClose }: EnhancedBlockPropertiesProps) {
  const def = BLOCK_DEFINITIONS[block.type as BlockType];

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      config: { ...block.config, [key]: value }
    });
  };

  const updateRetryConfig = (key: string, value: any) => {
    onUpdate({
      retryConfig: { 
        ...block.retryConfig, 
        enabled: block.retryConfig?.enabled ?? false,
        maxRetries: block.retryConfig?.maxRetries ?? 3,
        backoffMs: block.retryConfig?.backoffMs ?? 1000,
        [key]: value 
      }
    });
  };

  // Check if a field should be visible based on showWhen condition
  const shouldShowField = (field: ConfigField): boolean => {
    if (!field.showWhen) return true;
    const currentValue = block.config?.[field.showWhen.field];
    // Handle both value and notValue conditions
    if ('value' in field.showWhen) {
      return currentValue === field.showWhen.value;
    }
    if ('notValue' in field.showWhen) {
      return currentValue !== field.showWhen.notValue;
    }
    return true;
  };

  const renderConfigField = (field: ConfigField) => {
    // Skip hidden fields
    if (!shouldShowField(field)) return null;
    
    const value = block.config?.[field.key] ?? field.defaultValue ?? '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={`config-${field.key}`}
            value={value}
            onChange={(e) => updateConfig(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'password':
        return (
          <Input
            id={`config-${field.key}`}
            type="password"
            value={value}
            onChange={(e) => updateConfig(field.key, e.target.value)}
            placeholder={field.placeholder || '••••••••'}
          />
        );

      case 'textarea':
      case 'code':
        return (
          <Textarea
            id={`config-${field.key}`}
            value={value}
            onChange={(e) => updateConfig(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={field.type === 'code' ? 5 : 3}
            className={field.type === 'code' ? 'font-mono text-sm' : ''}
          />
        );

      case 'select':
        return (
          <Select
            value={value || field.options?.[0]}
            onValueChange={(val) => updateConfig(field.key, val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <Switch
              id={`config-${field.key}`}
              checked={!!value}
              onCheckedChange={(checked) => updateConfig(field.key, checked)}
            />
            <span className="text-sm text-muted-foreground">
              {value ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        );

      case 'number':
        return (
          <Input
            id={`config-${field.key}`}
            type="number"
            value={value}
            onChange={(e) => updateConfig(field.key, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
          />
        );

      case 'json':
        return (
          <Textarea
            id={`config-${field.key}`}
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateConfig(field.key, parsed);
              } catch {
                updateConfig(field.key, e.target.value);
              }
            }}
            placeholder={field.placeholder || 'Enter JSON...'}
            rows={4}
            className="font-mono text-sm"
          />
        );

      default:
        return (
          <Input
            id={`config-${field.key}`}
            value={value}
            onChange={(e) => updateConfig(field.key, e.target.value)}
          />
        );
    }
  };

  // Group fields by section
  const groupFieldsBySection = (fields: ConfigField[]) => {
    const sections: Record<string, ConfigField[]> = {};
    fields.forEach(field => {
      if (!shouldShowField(field)) return;
      const section = field.section || 'general';
      if (!sections[section]) sections[section] = [];
      sections[section].push(field);
    });
    return sections;
  };

  // Define section order - connection first!
  const sectionOrder = ['connection', 'auth', 'message', 'reply', 'filters', 'search', 'general'];

  const sectionLabels: Record<string, string> = {
    connection: '🔗 Connexion Email',
    auth: '🔐 Authentification',
    filters: '🔍 Filtres',
    message: '✉️ Message',
    reply: '↩️ Réponse',
    search: '🔎 Recherche',
    general: '⚙️ Paramètres',
  };

  // Sort sections according to order
  const sortedSections = (sections: Record<string, ConfigField[]>) => {
    return Object.entries(sections).sort(([a], [b]) => {
      const indexA = sectionOrder.indexOf(a);
      const indexB = sectionOrder.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  };

  return (
    <aside className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def?.color} flex items-center justify-center shadow-md`}>
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Block Properties</h3>
            <p className="text-xs text-muted-foreground">{def?.name}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="config" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 grid grid-cols-3">
          <TabsTrigger value="config" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Config
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="help" className="text-xs">
            <Info className="w-3 h-3 mr-1" />
            Help
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="config" className="p-4 space-y-6 mt-0">
            {/* Block name */}
            <div className="space-y-2">
              <Label htmlFor="block-name">Block Name</Label>
              <Input
                id="block-name"
                value={block.name || def?.name || ''}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder={def?.name}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="block-desc">Description (optional)</Label>
              <Textarea
                id="block-desc"
                value={block.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Add a note about what this block does..."
                rows={2}
              />
            </div>

            {/* Config fields grouped by section */}
            {def?.configFields && def.configFields.length > 0 && (
              <div className="space-y-6">
              {sortedSections(groupFieldsBySection(def.configFields)).map(([section, fields]) => (
                  <div key={section} className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                      {sectionLabels[section] || section}
                    </h4>
                    
                    <TooltipProvider>
                      {fields.map((field) => {
                        const renderedField = renderConfigField(field);
                        if (!renderedField) return null;
                        
                        return (
                          <div key={field.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`config-${field.key}`} className="flex items-center gap-1 text-sm">
                                {field.label}
                                {field.required && <span className="text-destructive">*</span>}
                              </Label>
                              {field.helpText && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="w-3 h-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-xs">
                                    {field.helpText}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            {renderedField}
                          </div>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-6 mt-0">
            {/* Retry configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Enable Retries
                </Label>
                <Switch
                  checked={block.retryConfig?.enabled ?? false}
                  onCheckedChange={(checked) => updateRetryConfig('enabled', checked)}
                />
              </div>

              {block.retryConfig?.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-border">
                  <div className="space-y-2">
                    <Label>Max Retries</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[block.retryConfig?.maxRetries ?? 3]}
                        onValueChange={([val]) => updateRetryConfig('maxRetries', val)}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-8 text-center">
                        {block.retryConfig?.maxRetries ?? 3}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Backoff (ms)</Label>
                    <Input
                      type="number"
                      value={block.retryConfig?.backoffMs ?? 1000}
                      onChange={(e) => updateRetryConfig('backoffMs', parseInt(e.target.value) || 1000)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timeout */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeout (ms)
              </Label>
              <Input
                type="number"
                value={block.timeout ?? 30000}
                onChange={(e) => onUpdate({ timeout: parseInt(e.target.value) || 30000 })}
                placeholder="30000"
              />
              <p className="text-xs text-muted-foreground">
                Maximum time to wait for this block to complete
              </p>
            </div>
          </TabsContent>

          <TabsContent value="help" className="p-4 space-y-4 mt-0">
            {/* Block type info */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def?.color} flex items-center justify-center`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{def?.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    def?.category === 'trigger' ? 'bg-blue-500/20 text-blue-400' :
                    def?.category === 'ai' ? 'bg-violet-500/20 text-violet-400' :
                    def?.category === 'transform' ? 'bg-emerald-500/20 text-emerald-400' :
                    def?.category === 'logic' ? 'bg-amber-500/20 text-amber-400' :
                    def?.category === 'http' ? 'bg-green-500/20 text-green-400' :
                    def?.category === 'email' ? 'bg-red-500/20 text-red-400' :
                    def?.category === 'database' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {def?.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{def?.description}</p>
            </div>

            {/* Usage tips */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Tips</h4>
              
              {block.type.startsWith('trigger_') && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    This is a <strong>trigger block</strong> that starts your workflow. 
                    It receives the initial input data.
                  </p>
                </div>
              )}
              
              {block.type.startsWith('ai_') && (
                <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-sm text-violet-400">
                    This <strong>AI block</strong> processes input using Lovable AI. 
                    Configure the prompt and parameters for best results.
                  </p>
                </div>
              )}
              
              {block.type.startsWith('system_') && (
                <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/20">
                  <p className="text-sm text-slate-400">
                    This <strong>system block</strong> performs external actions like 
                    sending emails or saving to the database.
                  </p>
                </div>
              )}

              {block.type.startsWith('control_') && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-400">
                    This <strong>control block</strong> manages workflow flow with 
                    conditions, loops, or parallel execution.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
