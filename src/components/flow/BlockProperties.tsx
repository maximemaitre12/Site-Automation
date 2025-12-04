import { WorkflowBlock, BLOCK_DEFINITIONS } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockPropertiesProps {
  block: WorkflowBlock;
  onUpdate: (updates: Partial<WorkflowBlock>) => void;
  onClose: () => void;
}

export function BlockProperties({ block, onUpdate, onClose }: BlockPropertiesProps) {
  const def = BLOCK_DEFINITIONS[block.type];

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      config: { ...block.config, [key]: value }
    });
  };

  return (
    <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground">Block Properties</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
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

        {/* Type info */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="text-xs text-muted-foreground mb-1">Type</div>
          <div className="font-medium text-foreground">{def?.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{def?.description}</div>
        </div>

        {/* Config fields */}
        {def?.configFields && def.configFields.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Configuration</h4>
            
            {def.configFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`config-${field.key}`}>{field.label}</Label>
                
                {field.type === 'text' && (
                  <Input
                    id={`config-${field.key}`}
                    value={block.config?.[field.key] || ''}
                    onChange={(e) => updateConfig(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}

                {field.type === 'textarea' && (
                  <Textarea
                    id={`config-${field.key}`}
                    value={block.config?.[field.key] || ''}
                    onChange={(e) => updateConfig(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={3}
                  />
                )}

                {field.type === 'select' && field.options && (
                  <Select
                    value={block.config?.[field.key] || field.options[0]}
                    onValueChange={(value) => updateConfig(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Usage tips */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="text-xs font-medium text-primary mb-1">💡 Tip</div>
          <div className="text-xs text-muted-foreground">
            {block.type.startsWith('trigger_') && 
              'This block starts your workflow. It receives initial input data.'}
            {block.type.startsWith('ai_') && 
              'This AI block processes the input from the previous step and produces new output.'}
            {block.type.startsWith('system_') && 
              'This system action performs external operations like sending emails or saving data.'}
          </div>
        </div>
      </div>
    </aside>
  );
}
