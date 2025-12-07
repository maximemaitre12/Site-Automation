import { useState } from 'react';
import { WorkflowBlock, BlockType, BLOCK_DEFINITIONS, BlockCategory, ConfigField } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Search, Plus, X,
  ChevronRight, Check, ArrowLeft, ArrowDown, MoreVertical,
  Copy, Trash2, Settings, Zap, Play, GripVertical, Info,
  HelpCircle, Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText
};

interface WorkflowBuilderProps {
  blocks: WorkflowBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onAddBlock: (type: BlockType) => void;
  onUpdateBlock: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (id: string) => void;
}

export function WorkflowBuilder({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock
}: WorkflowBuilderProps) {
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'canvas' | 'config'>('canvas');

  const sortedBlocks = [...blocks].sort((a, b) => a.position.y - b.position.y);
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const handleAddBlockClick = () => {
    setIsBlockPickerOpen(true);
    setSearch('');
  };

  const handleSelectBlockType = (type: BlockType) => {
    onAddBlock(type);
    setIsBlockPickerOpen(false);
  };

  // Filter blocks for search
  const allBlocks = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];
  const filteredBlocks = search
    ? allBlocks.filter(([_, def]) => 
        def.name.toLowerCase().includes(search.toLowerCase()) ||
        def.description.toLowerCase().includes(search.toLowerCase())
      )
    : allBlocks;

  const blocksByCategory = filteredBlocks.reduce((acc, [type, def]) => {
    if (!acc[def.category]) acc[def.category] = [];
    acc[def.category].push([type, def] as const);
    return acc;
  }, {} as Record<BlockCategory, [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][]>);

  const categories: { key: BlockCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'trigger', label: 'Déclencheurs', icon: <Zap className="w-4 h-4" />, color: 'bg-blue-500' },
    { key: 'ai', label: 'Intelligence IA', icon: <Sparkles className="w-4 h-4" />, color: 'bg-violet-500' },
    { key: 'transform', label: 'Transformation', icon: <Braces className="w-4 h-4" />, color: 'bg-emerald-500' },
    { key: 'control', label: 'Contrôle', icon: <GitBranch className="w-4 h-4" />, color: 'bg-amber-500' },
    { key: 'integration', label: 'Intégrations', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-600' },
    { key: 'system', label: 'Actions', icon: <Send className="w-4 h-4" />, color: 'bg-slate-500' },
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Tabs */}
        <div className="lg:hidden border-b border-border bg-card/50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('canvas')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                activeTab === 'canvas' 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              Workflow
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                activeTab === 'config' 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground",
                !selectedBlock && "opacity-50"
              )}
              disabled={!selectedBlock}
            >
              Configuration
            </button>
          </div>
        </div>

        {/* Canvas Content */}
        <div className={cn(
          "flex-1 overflow-auto p-4 md:p-6",
          activeTab !== 'canvas' && "hidden lg:block"
        )}>
          {blocks.length === 0 ? (
            <EmptyState onAddBlock={handleAddBlockClick} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Step by step workflow visualization */}
              {sortedBlocks.map((block, index) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  index={index}
                  isSelected={selectedBlockId === block.id}
                  isFirst={index === 0}
                  isLast={index === sortedBlocks.length - 1}
                  onSelect={() => {
                    onSelectBlock(block.id);
                    if (window.innerWidth < 1024) setActiveTab('config');
                  }}
                  onDelete={() => onDeleteBlock(block.id)}
                  onMoveUp={() => onMoveBlock(block.id, 'up')}
                  onMoveDown={() => onMoveBlock(block.id, 'down')}
                  onDuplicate={() => onDuplicateBlock(block.id)}
                />
              ))}

              {/* Add more steps button */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddBlockClick}
                  className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une étape
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Panel - Desktop sidebar, Mobile full panel */}
      <div className={cn(
        "lg:w-96 lg:border-l border-border bg-card flex flex-col",
        activeTab !== 'config' && "hidden lg:flex",
        !selectedBlock && "lg:hidden"
      )}>
        {selectedBlock ? (
          <BlockConfigPanel
            block={selectedBlock}
            onUpdate={(updates) => onUpdateBlock(selectedBlock.id, updates)}
            onClose={() => {
              onSelectBlock(null);
              setActiveTab('canvas');
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Settings className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Sélectionnez un bloc pour le configurer</p>
            </div>
          </div>
        )}
      </div>

      {/* Block Picker Dialog */}
      <BlockPickerDialog
        open={isBlockPickerOpen}
        onOpenChange={setIsBlockPickerOpen}
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        blocksByCategory={blocksByCategory}
        onSelectBlock={handleSelectBlockType}
      />
    </div>
  );
}

// Empty state component
function EmptyState({ onAddBlock }: { onAddBlock: () => void }) {
  const quickStartBlocks: { type: BlockType; label: string; description: string }[] = [
    { type: 'trigger_text', label: 'Entrée texte', description: 'Commencez avec du texte' },
    { type: 'trigger_file', label: 'Upload fichier', description: 'Traitez un document' },
    { type: 'trigger_webhook', label: 'Webhook', description: 'Recevez des données externes' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-lg text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-primary/60" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Créez votre workflow
        </h2>
        <p className="text-muted-foreground mb-8">
          Un workflow est une séquence d'étapes automatisées. Commencez par choisir comment démarrer votre automatisation.
        </p>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Démarrage rapide
          </h3>
          <div className="grid gap-3">
            {quickStartBlocks.map((item) => {
              const def = BLOCK_DEFINITIONS[item.type];
              const Icon = iconMap[def.icon] || Zap;
              return (
                <button
                  key={item.type}
                  onClick={onAddBlock}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${def.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground block">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="outline" onClick={onAddBlock} className="gap-2">
          <Plus className="w-4 h-4" />
          Voir tous les blocs
        </Button>
      </div>
    </div>
  );
}

// Block card in canvas
interface BlockCardProps {
  block: WorkflowBlock;
  index: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
}

function BlockCard({ 
  block, 
  index, 
  isSelected, 
  isFirst, 
  isLast,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate
}: BlockCardProps) {
  const def = BLOCK_DEFINITIONS[block.type as BlockType];
  const Icon = iconMap[def?.icon] || Sparkles;
  const hasConfig = Object.keys(block.config || {}).length > 0;

  // Check if configuration is complete
  const requiredFields = def?.configFields?.filter(f => f.required) || [];
  const isConfigComplete = requiredFields.every(f => block.config?.[f.key]);

  return (
    <div>
      {/* Connector from previous block */}
      {!isFirst && (
        <div className="flex justify-center py-1">
          <div className="w-0.5 h-6 bg-border" />
        </div>
      )}

      <div
        onClick={onSelect}
        className={cn(
          "relative rounded-2xl border-2 transition-all cursor-pointer group",
          isSelected 
            ? "border-primary bg-primary/5 shadow-xl ring-4 ring-primary/10" 
            : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
        )}
      >
        {/* Step number badge */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md",
            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {index + 1}
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform",
              def?.color || 'from-gray-500 to-gray-400',
              isSelected && "scale-110"
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground truncate flex items-center gap-2">
                    {block.name || def?.name}
                    {!isConfigComplete && requiredFields.length > 0 && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/50 text-[10px]">
                        Config requise
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {block.description || def?.description}
                  </p>
                </div>

                {/* Actions */}
                <div className={cn(
                  "flex items-center gap-1 transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      {!isFirst && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMoveUp(); }}>
                          <ArrowDown className="w-4 h-4 mr-2 rotate-180" />
                          Monter
                        </DropdownMenuItem>
                      )}
                      {!isLast && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMoveDown(); }}>
                          <ArrowDown className="w-4 h-4 mr-2" />
                          Descendre
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Config preview */}
              {hasConfig && (
                <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(block.config).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded-md">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-foreground font-medium truncate max-w-[100px]">
                          {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value).slice(0, 20)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(block.config).length > 3 && (
                      <span className="text-xs text-muted-foreground">+{Object.keys(block.config).length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div className={cn(
          "absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-sm",
          def?.category === 'trigger' && 'bg-blue-500 text-white',
          def?.category === 'ai' && 'bg-violet-500 text-white',
          def?.category === 'transform' && 'bg-emerald-500 text-white',
          def?.category === 'control' && 'bg-amber-500 text-white',
          def?.category === 'integration' && 'bg-blue-600 text-white',
          def?.category === 'system' && 'bg-slate-500 text-white'
        )}>
          {def?.category === 'trigger' && 'Déclencheur'}
          {def?.category === 'ai' && 'IA'}
          {def?.category === 'transform' && 'Transform'}
          {def?.category === 'control' && 'Contrôle'}
          {def?.category === 'integration' && 'API'}
          {def?.category === 'system' && 'Action'}
        </div>

        {/* Click to configure hint */}
        {isSelected && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Configurer →
            </Badge>
          </div>
        )}
      </div>

      {/* Connector to next block */}
      {!isLast && (
        <div className="flex justify-center py-1">
          <div className="relative">
            <div className="w-0.5 h-6 bg-border" />
            <ArrowDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

// Block configuration panel
interface BlockConfigPanelProps {
  block: WorkflowBlock;
  onUpdate: (updates: Partial<WorkflowBlock>) => void;
  onClose: () => void;
}

function BlockConfigPanel({ block, onUpdate, onClose }: BlockConfigPanelProps) {
  const def = BLOCK_DEFINITIONS[block.type as BlockType];
  const Icon = def?.icon ? (iconMap[def.icon] || Sparkles) : Sparkles;

  // Handle unknown block types gracefully
  if (!def) {
    return (
      <>
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="gap-1 lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="hidden lg:flex h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{block.name || block.type}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {block.type}
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Info className="w-4 h-4" />
                Informations de base
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="block-name">Nom du bloc</Label>
                  <Input
                    id="block-name"
                    value={block.name || ''}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    placeholder="Nom du bloc"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-desc">Description (optionnelle)</Label>
                  <Textarea
                    id="block-desc"
                    value={block.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Décrivez ce que fait ce bloc..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Raw config editor for unknown types */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Settings className="w-4 h-4" />
                Configuration (JSON)
              </div>
              <Textarea
                value={JSON.stringify(block.config || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    onUpdate({ config: parsed });
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={8}
                className="font-mono text-sm"
                placeholder="{}"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Type de bloc non standard</h4>
                  <p className="text-sm text-muted-foreground">
                    Ce bloc utilise le type "{block.type}" qui n'a pas de définition standard. 
                    Vous pouvez éditer la configuration manuellement en JSON.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </>
    );
  }

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      config: { ...block.config, [key]: value }
    });
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1 lg:hidden">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="hidden lg:flex h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
            def?.color || 'from-gray-500 to-gray-400'
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{def?.name}</h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {def?.category}
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Info className="w-4 h-4" />
              Informations de base
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="block-name">Nom du bloc</Label>
                <Input
                  id="block-name"
                  value={block.name || ''}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  placeholder={def?.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="block-desc">Description (optionnelle)</Label>
                <Textarea
                  id="block-desc"
                  value={block.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Décrivez ce que fait ce bloc..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Configuration fields */}
          {def?.configFields && def.configFields.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Settings className="w-4 h-4" />
                Configuration
              </div>

              <div className="space-y-4">
                <TooltipProvider>
                  {def.configFields.map((field) => (
                    <ConfigFieldInput
                      key={field.key}
                      field={field}
                      value={block.config?.[field.key]}
                      onChange={(value) => updateConfig(field.key, value)}
                    />
                  ))}
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Help section */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">À propos de ce bloc</h4>
                <p className="text-sm text-muted-foreground">{def?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}

// Configuration field input component
interface ConfigFieldInputProps {
  field: ConfigField;
  value: any;
  onChange: (value: any) => void;
}

function ConfigFieldInput({ field, value, onChange }: ConfigFieldInputProps) {
  const currentValue = value ?? field.defaultValue ?? '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`config-${field.key}`} className="flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        {field.helpText && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              {field.helpText}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {field.type === 'text' && (
        <Input
          id={`config-${field.key}`}
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}

      {(field.type === 'textarea' || field.type === 'code') && (
        <Textarea
          id={`config-${field.key}`}
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.type === 'code' ? 5 : 3}
          className={field.type === 'code' ? 'font-mono text-sm' : ''}
        />
      )}

      {field.type === 'select' && (
        <Select
          value={currentValue || field.options?.[0]}
          onValueChange={onChange}
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
      )}

      {field.type === 'boolean' && (
        <div className="flex items-center gap-3 py-1">
          <Switch
            id={`config-${field.key}`}
            checked={!!currentValue}
            onCheckedChange={onChange}
          />
          <span className="text-sm text-muted-foreground">
            {currentValue ? 'Activé' : 'Désactivé'}
          </span>
        </div>
      )}

      {field.type === 'number' && (
        <Input
          id={`config-${field.key}`}
          type="number"
          value={currentValue}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'json' && (
        <Textarea
          id={`config-${field.key}`}
          value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              onChange(e.target.value);
            }
          }}
          placeholder={field.placeholder || '{}'}
          rows={4}
          className="font-mono text-sm"
        />
      )}
    </div>
  );
}

// Block picker dialog
interface BlockPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  categories: { key: BlockCategory; label: string; icon: React.ReactNode; color: string }[];
  blocksByCategory: Record<BlockCategory, [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][]>;
  onSelectBlock: (type: BlockType) => void;
}

function BlockPickerDialog({ 
  open, 
  onOpenChange, 
  search, 
  onSearchChange,
  categories,
  blocksByCategory,
  onSelectBlock
}: BlockPickerDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('trigger');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter une étape
          </DialogTitle>
          <DialogDescription>
            Choisissez le type de bloc à ajouter à votre workflow
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un bloc..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden border-t border-border">
          {/* Category tabs */}
          <div className="w-48 border-r border-border bg-muted/30 p-2 overflow-auto hidden md:block">
            {categories.map(cat => {
              const count = blocksByCategory[cat.key]?.length || 0;
              if (search && count === 0) return null;
              
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors",
                    selectedCategory === cat.key
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                  <span className="text-sm font-medium flex-1">{cat.label}</span>
                  <Badge variant="secondary" className="text-[10px]">{count}</Badge>
                </button>
              );
            })}
          </div>

          {/* Blocks grid */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Mobile category pills */}
              <div className="flex gap-2 overflow-auto pb-3 mb-4 md:hidden">
                {categories.map(cat => {
                  const count = blocksByCategory[cat.key]?.length || 0;
                  if (search && count === 0) return null;
                  
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                        selectedCategory === cat.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full", cat.color)} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Blocks for selected category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(blocksByCategory[selectedCategory] || []).map(([type, def]) => {
                  const Icon = iconMap[def.icon] || Sparkles;
                  return (
                    <button
                      key={type}
                      onClick={() => onSelectBlock(type)}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all text-left group"
                    >
                      <div className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md group-hover:scale-110 transition-transform",
                        def.color
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground block">{def.name}</span>
                        <span className="text-sm text-muted-foreground line-clamp-2">{def.description}</span>
                      </div>
                      <Plus className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  );
                })}
              </div>

              {(blocksByCategory[selectedCategory]?.length || 0) === 0 && (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun bloc trouvé</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
