import { useState } from 'react';
import { DocBlock } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Type, List, Quote, AlertCircle, Image, Table2, Sparkles,
  Trash2, GripVertical, ChevronUp, ChevronDown, Heading1, Heading2, Heading3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocEditorProps {
  blocks: DocBlock[];
  onChange: (blocks: DocBlock[]) => void;
  onImproveText?: (text: string, action: string) => Promise<string | null>;
  processing?: boolean;
}

export function DocEditor({ blocks, onChange, onImproveText, processing }: DocEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: DocBlock['type'], afterId?: string) => {
    const newBlock: DocBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
      level: type === 'heading' ? 1 : undefined,
      items: type === 'list' ? [''] : undefined,
      style: type === 'callout' ? 'info' : undefined,
    };

    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    } else {
      onChange([...blocks, newBlock]);
    }
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<DocBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
    setSelectedBlockId(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      onChange(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      onChange(newBlocks);
    }
  };

  const handleImproveBlock = async (blockId: string, action: string) => {
    if (!onImproveText) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const improved = await onImproveText(block.content, action);
    if (improved) {
      updateBlock(blockId, { content: improved });
    }
  };

  const renderBlock = (block: DocBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <div
        key={block.id}
        className={`group relative rounded-lg transition-all ${
          isSelected ? 'bg-primary/5 ring-1 ring-primary/30' : 'hover:bg-card/50'
        }`}
        onClick={() => setSelectedBlockId(block.id)}
      >
        {/* Block controls */}
        <div className={`absolute -left-10 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(block.id, 'up')}>
            <ChevronUp className="h-3 w-3" />
          </Button>
          <div className="cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(block.id, 'down')}>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="p-3">
          {/* Heading */}
          {block.type === 'heading' && (
            <div className="flex items-center gap-2">
              <Select
                value={String(block.level || 1)}
                onValueChange={(v) => updateBlock(block.id, { level: parseInt(v) })}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Titre..."
                className={`flex-1 border-none bg-transparent ${
                  block.level === 1 ? 'text-2xl font-bold' : 
                  block.level === 2 ? 'text-xl font-semibold' : 'text-lg font-medium'
                }`}
              />
            </div>
          )}

          {/* Paragraph */}
          {block.type === 'paragraph' && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Écrivez votre texte..."
              className="min-h-[80px] border-none bg-transparent resize-none"
            />
          )}

          {/* List */}
          {block.type === 'list' && (
            <div className="space-y-2">
              {(block.items || ['']).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(block.items || [])];
                      newItems[i] = e.target.value;
                      updateBlock(block.id, { items: newItems });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newItems = [...(block.items || [])];
                        newItems.splice(i + 1, 0, '');
                        updateBlock(block.id, { items: newItems });
                      }
                      if (e.key === 'Backspace' && item === '' && (block.items?.length || 0) > 1) {
                        e.preventDefault();
                        const newItems = [...(block.items || [])];
                        newItems.splice(i, 1);
                        updateBlock(block.id, { items: newItems });
                      }
                    }}
                    placeholder="Élément de liste..."
                    className="flex-1 border-none bg-transparent"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quote */}
          {block.type === 'quote' && (
            <div className="border-l-4 border-primary pl-4">
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Citation..."
                className="min-h-[60px] border-none bg-transparent resize-none italic"
              />
            </div>
          )}

          {/* Callout */}
          {block.type === 'callout' && (
            <div className={`p-4 rounded-lg ${
              block.style === 'info' ? 'bg-blue-500/10 border border-blue-500/30' :
              block.style === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
              block.style === 'success' ? 'bg-green-500/10 border border-green-500/30' :
              'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`h-4 w-4 ${
                  block.style === 'info' ? 'text-blue-400' :
                  block.style === 'warning' ? 'text-yellow-400' :
                  block.style === 'success' ? 'text-green-400' :
                  'text-red-400'
                }`} />
                <Select
                  value={block.style || 'info'}
                  onValueChange={(v) => updateBlock(block.id, { style: v as any })}
                >
                  <SelectTrigger className="w-24 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Attention</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Note importante..."
                className="min-h-[40px] border-none bg-transparent resize-none"
              />
            </div>
          )}

          {/* AI Block */}
          {block.type === 'ai' && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Bloc IA</span>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Décrivez ce que vous voulez générer..."
                className="min-h-[60px] border-none bg-transparent resize-none"
              />
            </div>
          )}
        </div>

        {/* Block actions */}
        {isSelected && (
          <div className="absolute right-2 top-2 flex items-center gap-1">
            {onImproveText && (block.type === 'paragraph' || block.type === 'quote') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={processing}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Améliorer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'shorter')}>
                    Plus court
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'longer')}>
                    Plus long
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'professional')}>
                    Plus professionnel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'clear')}>
                    Plus clair
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'grammar')}>
                    Corriger orthographe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImproveBlock(block.id, 'translate_en')}>
                    Traduire en anglais
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteBlock(block.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Add block button */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                <Plus className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addBlock('heading', block.id)}>
                <Heading1 className="h-4 w-4 mr-2" /> Titre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('paragraph', block.id)}>
                <Type className="h-4 w-4 mr-2" /> Paragraphe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('list', block.id)}>
                <List className="h-4 w-4 mr-2" /> Liste
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('quote', block.id)}>
                <Quote className="h-4 w-4 mr-2" /> Citation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('callout', block.id)}>
                <AlertCircle className="h-4 w-4 mr-2" /> Callout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addBlock('ai', block.id)}>
                <Sparkles className="h-4 w-4 mr-2" /> Bloc IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 py-4">
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Document vide. Ajoutez votre premier bloc.</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un bloc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addBlock('heading')}>
                <Heading1 className="h-4 w-4 mr-2" /> Titre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('paragraph')}>
                <Type className="h-4 w-4 mr-2" /> Paragraphe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('list')}>
                <List className="h-4 w-4 mr-2" /> Liste
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('quote')}>
                <Quote className="h-4 w-4 mr-2" /> Citation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('callout')}>
                <AlertCircle className="h-4 w-4 mr-2" /> Callout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addBlock('ai')}>
                <Sparkles className="h-4 w-4 mr-2" /> Bloc IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        blocks.map((block, index) => renderBlock(block, index))
      )}
    </div>
  );
}
