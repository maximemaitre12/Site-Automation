import { useState } from 'react';
import { Template, DocBlock } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Trash2, Copy, Loader2 } from 'lucide-react';

interface DocTemplatesProps {
  templates: Template[];
  onCreateTemplate: (title: string, description: string, content: DocBlock[], type: string) => Promise<any>;
  onDeleteTemplate: (id: string) => Promise<any>;
  onUseTemplate: (template: Template) => void;
}

export function DocTemplates({ templates, onCreateTemplate, onDeleteTemplate, onUseTemplate }: DocTemplatesProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    type: 'libre'
  });

  const handleCreate = async () => {
    if (!newTemplate.title.trim()) return;
    setCreating(true);
    
    // Create default template structure
    const defaultContent: DocBlock[] = [
      { id: crypto.randomUUID(), type: 'heading', content: 'Titre du document', level: 1 },
      { id: crypto.randomUUID(), type: 'paragraph', content: '' },
    ];

    await onCreateTemplate(newTemplate.title, newTemplate.description, defaultContent, newTemplate.type);
    setNewTemplate({ title: '', description: '', type: 'libre' });
    setShowCreate(false);
    setCreating(false);
  };

  const defaultTemplates = [
    { id: 'default-1', title: 'Rapport d\'analyse', description: 'Structure complète pour rapports', type: 'rapport', isDefault: true },
    { id: 'default-2', title: 'Proposition commerciale', description: 'Template de proposition client', type: 'proposition', isDefault: true },
    { id: 'default-3', title: 'Compte-rendu réunion', description: 'Format standard de CR', type: 'compte-rendu', isDefault: true },
    { id: 'default-4', title: 'Procédure interne', description: 'Documentation process', type: 'procedure', isDefault: true },
  ];

  const getDefaultContent = (type: string): DocBlock[] => {
    switch (type) {
      case 'rapport':
        return [
          { id: crypto.randomUUID(), type: 'heading', content: 'Rapport d\'analyse', level: 1 },
          { id: crypto.randomUUID(), type: 'heading', content: 'Résumé exécutif', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Contexte', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Analyse', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Conclusions', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Recommandations', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: ['', '', ''] },
        ];
      case 'proposition':
        return [
          { id: crypto.randomUUID(), type: 'heading', content: 'Proposition commerciale', level: 1 },
          { id: crypto.randomUUID(), type: 'heading', content: 'Notre compréhension de vos besoins', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Solution proposée', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Bénéfices clés', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: ['', '', ''] },
          { id: crypto.randomUUID(), type: 'heading', content: 'Tarification', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Prochaines étapes', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: ['', ''] },
        ];
      case 'compte-rendu':
        return [
          { id: crypto.randomUUID(), type: 'heading', content: 'Compte-rendu de réunion', level: 1 },
          { id: crypto.randomUUID(), type: 'callout', content: 'Date: \nParticipants: ', style: 'info' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Ordre du jour', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: ['', ''] },
          { id: crypto.randomUUID(), type: 'heading', content: 'Points abordés', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Décisions prises', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: [''] },
          { id: crypto.randomUUID(), type: 'heading', content: 'Actions à suivre', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: [''] },
        ];
      case 'procedure':
        return [
          { id: crypto.randomUUID(), type: 'heading', content: 'Procédure: [Titre]', level: 1 },
          { id: crypto.randomUUID(), type: 'callout', content: 'Version: 1.0 | Dernière mise à jour: ', style: 'info' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Objectif', level: 2 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
          { id: crypto.randomUUID(), type: 'heading', content: 'Prérequis', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: [''] },
          { id: crypto.randomUUID(), type: 'heading', content: 'Étapes', level: 2 },
          { id: crypto.randomUUID(), type: 'list', content: '', items: ['Étape 1: ', 'Étape 2: ', 'Étape 3: '] },
          { id: crypto.randomUUID(), type: 'callout', content: 'Points d\'attention importants', style: 'warning' },
        ];
      default:
        return [
          { id: crypto.randomUUID(), type: 'heading', content: '', level: 1 },
          { id: crypto.randomUUID(), type: 'paragraph', content: '' },
        ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Modèles de documents</h3>
        <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un modèle
        </Button>
      </div>

      {/* Default templates */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Modèles par défaut</p>
        <div className="grid gap-2">
          {defaultTemplates.map((template) => (
            <div
              key={template.id}
              className="p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => onUseTemplate({ ...template, content: getDefaultContent(template.type), user_id: '', tags: [], is_default: true, created_at: '', updated_at: '' })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{template.title}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User templates */}
      {templates.filter(t => !t.is_default).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Mes modèles</p>
          <div className="grid gap-2">
            {templates.filter(t => !t.is_default).map((template) => (
              <div
                key={template.id}
                className="p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 flex-1"
                    onClick={() => onUseTemplate(template)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <FileText className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{template.title}</h4>
                      {template.description && (
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(template.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create template modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un modèle</DialogTitle>
            <DialogDescription>
              Créez un modèle réutilisable pour vos documents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du modèle</Label>
              <Input
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                placeholder="Ex: Brief créatif"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Description du modèle..."
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newTemplate.type} onValueChange={(v) => setNewTemplate({ ...newTemplate, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rapport">Rapport</SelectItem>
                  <SelectItem value="proposition">Proposition</SelectItem>
                  <SelectItem value="compte-rendu">Compte-rendu</SelectItem>
                  <SelectItem value="procedure">Procédure</SelectItem>
                  <SelectItem value="libre">Libre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={creating || !newTemplate.title.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Créer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
