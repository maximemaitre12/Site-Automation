import { memo, useState } from 'react';
import { WorkflowBlock, BLOCK_DEFINITIONS, ExecutionStatus } from '@/types/workflow';
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
  X, ChevronRight, Settings, Link2, RefreshCw, 
  Clock, FileJson, History, Zap, AlertCircle, CheckCircle2
} from 'lucide-react';

interface NodePropertiesPanelProps {
  block: WorkflowBlock | null;
  executionStatus?: ExecutionStatus;
  lastOutput?: any;
  onUpdate: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onClose: () => void;
}

function NodePropertiesPanelComponent({
  block,
  executionStatus = 'idle',
  lastOutput,
  onUpdate,
  onClose,
}: NodePropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['config', 'retry'])
  );

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

  return (
    <div className="w-80 h-full border-l border-border bg-card flex flex-col">
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

        {/* Real action warning */}
        {definition?.isRealAction && (
          <div className="flex items-center gap-2 p-2 mt-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>Action réelle - Affecte les données en production</span>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {/* Configuration Section */}
          <Collapsible
            open={expandedSections.has('config')}
            onOpenChange={() => toggleSection('config')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Configuration</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedSections.has('config') && "rotate-90"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-4">
                {definition?.configFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </Label>
                    
                    {field.type === 'text' && (
                      <Input
                        value={block.config[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="h-8 text-sm"
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <Textarea
                        value={block.config[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="text-sm min-h-[80px]"
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <Input
                        type="number"
                        value={block.config[field.key] || field.defaultValue || ''}
                        onChange={(e) => handleConfigChange(field.key, Number(e.target.value))}
                        placeholder={field.placeholder}
                        className="h-8 text-sm"
                      />
                    )}
                    
                    {field.type === 'boolean' && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={block.config[field.key] ?? field.defaultValue ?? false}
                          onCheckedChange={(checked) => handleConfigChange(field.key, checked)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {block.config[field.key] ? 'Activé' : 'Désactivé'}
                        </span>
                      </div>
                    )}
                    
                    {field.type === 'select' && field.options && (
                      <Select
                        value={block.config[field.key] || field.defaultValue}
                        onValueChange={(value) => handleConfigChange(field.key, value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {field.helpText && (
                      <p className="text-[10px] text-muted-foreground">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

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
      </ScrollArea>
    </div>
  );
}

export const NodePropertiesPanel = memo(NodePropertiesPanelComponent);
