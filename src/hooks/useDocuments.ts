import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface DocBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'callout' | 'image' | 'table' | 'ai';
  content: string;
  level?: number; // For headings: 1, 2, 3
  items?: string[]; // For lists
  style?: 'info' | 'warning' | 'success' | 'error'; // For callouts
  imageUrl?: string;
  tableData?: string[][];
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: DocBlock[];
  type: string;
  template_id: string | null;
  tags: string[];
  file_url: string | null;
  file_type: string | null;
  raw_text: string | null;
  ocr_text: string | null;
  summary: string | null;
  analysis: any;
  improved_content: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content: DocBlock[];
  type: string;
  tags: string[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      const docs = (data || []).map(d => ({
        ...d,
        content: (Array.isArray(d.content) ? d.content : []) as unknown as DocBlock[],
        tags: (Array.isArray(d.tags) ? d.tags : []) as string[]
      }));
      setDocuments(docs as Document[]);
    }
    setLoading(false);
  };

  const fetchTemplates = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .or(`user_id.eq.${user.id},is_default.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      const tmpl = (data || []).map(t => ({
        ...t,
        content: (Array.isArray(t.content) ? t.content : []) as unknown as DocBlock[],
        tags: (Array.isArray(t.tags) ? t.tags : []) as string[]
      }));
      setTemplates(tmpl as Template[]);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
  }, [user]);

  // Create new document
  const createDocument = async (
    title: string, 
    content: DocBlock[] = [], 
    type: string = 'libre',
    templateId?: string
  ): Promise<Document | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('documents')
      .insert([{
        user_id: user.id,
        title,
        content: content as unknown as any,
        type,
        template_id: templateId || null,
        status: 'draft'
      }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return null;
    }

    await fetchDocuments();
    toast({ title: 'Succès', description: 'Document créé' });
    return {
      ...data,
      content: (Array.isArray(data.content) ? data.content : []) as unknown as DocBlock[],
      tags: (Array.isArray(data.tags) ? data.tags : []) as string[]
    } as Document;
  };

  // Update document
  const updateDocument = async (id: string, updates: Partial<Document>): Promise<boolean> => {
    const updateData: any = { ...updates };
    if (updates.content) {
      updateData.content = updates.content as unknown as any;
    }
    if (updates.tags) {
      updateData.tags = updates.tags as unknown as any;
    }
    
    const { error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }

    await fetchDocuments();
    return true;
  };

  // Delete document
  const deleteDocument = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }

    await fetchDocuments();
    toast({ title: 'Succès', description: 'Document supprimé' });
    return true;
  };

  // AI: Generate document from scratch
  const generateDocument = async (params: {
    type: string;
    subject: string;
    target: string;
    tone: string;
    detailLevel: string;
  }): Promise<DocBlock[] | null> => {
    setProcessing(true);
    try {
      const prompt = `Tu es un expert en rédaction de documents professionnels.
Génère un document complet de type "${params.type}" sur le sujet "${params.subject}".
Public cible: ${params.target}
Ton: ${params.tone}
Niveau de détail: ${params.detailLevel}

Retourne le document au format JSON avec la structure suivante:
{
  "blocks": [
    {"type": "heading", "content": "Titre", "level": 1},
    {"type": "paragraph", "content": "texte..."},
    {"type": "list", "items": ["item1", "item2"]},
    {"type": "callout", "content": "note importante", "style": "info"}
  ]
}

Génère un document professionnel, structuré et complet.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        type: 'generate'
      });

      if (response.error) {
        toast({ title: 'Erreur IA', description: response.error, variant: 'destructive' });
        return null;
      }

      // Parse JSON response
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.blocks || [];
        }
      } catch {
        // Fallback: create blocks from text
        return [
          { id: crypto.randomUUID(), type: 'paragraph', content: response.content }
        ];
      }

      return null;
    } finally {
      setProcessing(false);
    }
  };

  // AI: Analyze imported document
  const analyzeDocument = async (docId: string, text: string): Promise<boolean> => {
    if (!user) return false;
    setProcessing(true);

    try {
      // Summary
      const summaryResponse = await callAI({
        messages: [{ role: 'user', content: `Résume ce document de manière concise et professionnelle en français:\n\n${text.slice(0, 10000)}` }],
        type: 'summarize'
      });

      // Analysis
      const analysisResponse = await callAI({
        messages: [{ 
          role: 'user', 
          content: `Analyse ce document et extrais les informations clés au format JSON:
{
  "type": "type de document",
  "themes": ["thème1", "thème2"],
  "entites": ["entité1", "entité2"],
  "dates_importantes": ["date1"],
  "montants": ["montant1"],
  "points_cles": ["point1", "point2"],
  "risques": ["risque potentiel si applicable"]
}

Document:\n${text.slice(0, 10000)}` 
        }],
        type: 'extract'
      });

      let analysis = null;
      try {
        const jsonMatch = analysisResponse.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        }
      } catch {
        analysis = { raw: analysisResponse.content };
      }

      const { error } = await supabase
        .from('documents')
        .update({
          summary: summaryResponse.content,
          analysis,
          status: 'analyzed'
        })
        .eq('id', docId);

      if (error) throw error;

      await fetchDocuments();
      toast({ title: 'Succès', description: 'Document analysé avec succès' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return false;
    } finally {
      setProcessing(false);
    }
  };

  // AI: Improve text block
  const improveText = async (text: string, action: string): Promise<string | null> => {
    setProcessing(true);
    try {
      const actions: Record<string, string> = {
        shorter: 'Rends ce texte plus concis sans perdre l\'essentiel',
        longer: 'Développe et enrichis ce texte avec plus de détails',
        professional: 'Reformule ce texte dans un ton très professionnel et formel',
        clear: 'Simplifie et clarifie ce texte pour le rendre plus accessible',
        corporate: 'Adapte ce texte au style corporate d\'entreprise',
        translate_en: 'Traduis ce texte en anglais',
        translate_fr: 'Traduis ce texte en français',
        grammar: 'Corrige l\'orthographe et la grammaire de ce texte'
      };

      const response = await callAI({
        messages: [{ 
          role: 'user', 
          content: `${actions[action] || action}:\n\n${text}`
        }],
        type: 'generate'
      });

      if (response.error) {
        toast({ title: 'Erreur IA', description: response.error, variant: 'destructive' });
        return null;
      }

      return response.content;
    } finally {
      setProcessing(false);
    }
  };

  // AI: Generate table of contents
  const generateTableOfContents = async (blocks: DocBlock[]): Promise<string | null> => {
    setProcessing(true);
    try {
      const content = blocks.map(b => 
        b.type === 'heading' ? `${'#'.repeat(b.level || 1)} ${b.content}` : b.content
      ).join('\n');

      const response = await callAI({
        messages: [{ 
          role: 'user', 
          content: `Génère une table des matières structurée pour ce document:\n\n${content}`
        }],
        type: 'generate'
      });

      return response.error ? null : response.content;
    } finally {
      setProcessing(false);
    }
  };

  // Template management
  const createTemplate = async (
    title: string,
    description: string,
    content: DocBlock[],
    type: string = 'libre'
  ): Promise<Template | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('templates')
      .insert([{
        user_id: user.id,
        title,
        description,
        content: content as unknown as any,
        type
      }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return null;
    }

    await fetchTemplates();
    toast({ title: 'Succès', description: 'Modèle créé' });
    return {
      ...data,
      content: (Array.isArray(data.content) ? data.content : []) as unknown as DocBlock[],
      tags: (Array.isArray(data.tags) ? data.tags : []) as string[]
    } as Template;
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }

    await fetchTemplates();
    toast({ title: 'Succès', description: 'Modèle supprimé' });
    return true;
  };

  // Export document to different formats
  const exportDocument = async (doc: Document, format: 'md' | 'html' | 'json'): Promise<string> => {
    const blocks = doc.content || [];
    
    if (format === 'json') {
      return JSON.stringify(doc, null, 2);
    }

    if (format === 'md') {
      return blocks.map(block => {
        switch (block.type) {
          case 'heading':
            return `${'#'.repeat(block.level || 1)} ${block.content}\n`;
          case 'paragraph':
            return `${block.content}\n`;
          case 'list':
            return (block.items || []).map(item => `- ${item}`).join('\n') + '\n';
          case 'quote':
            return `> ${block.content}\n`;
          case 'callout':
            return `> **${block.style?.toUpperCase() || 'NOTE'}:** ${block.content}\n`;
          default:
            return `${block.content || ''}\n`;
        }
      }).join('\n');
    }

    if (format === 'html') {
      return `<!DOCTYPE html>
<html><head><title>${doc.title}</title>
<style>body{font-family:Inter,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}
h1,h2,h3{color:#1a1a2e}blockquote{border-left:4px solid #3C4DFE;padding-left:16px;color:#666}
.callout{padding:16px;border-radius:8px;margin:16px 0}
.callout-info{background:#e8f4fd;border-left:4px solid #3C4DFE}
.callout-warning{background:#fff3cd;border-left:4px solid #ffc107}
.callout-success{background:#d4edda;border-left:4px solid #28a745}
.callout-error{background:#f8d7da;border-left:4px solid #dc3545}</style></head>
<body>
${blocks.map(block => {
  switch (block.type) {
    case 'heading':
      return `<h${block.level || 1}>${block.content}</h${block.level || 1}>`;
    case 'paragraph':
      return `<p>${block.content}</p>`;
    case 'list':
      return `<ul>${(block.items || []).map(item => `<li>${item}</li>`).join('')}</ul>`;
    case 'quote':
      return `<blockquote>${block.content}</blockquote>`;
    case 'callout':
      return `<div class="callout callout-${block.style || 'info'}">${block.content}</div>`;
    default:
      return `<p>${block.content || ''}</p>`;
  }
}).join('\n')}
</body></html>`;
    }

    return '';
  };

  return {
    documents,
    templates,
    loading,
    processing,
    createDocument,
    updateDocument,
    deleteDocument,
    generateDocument,
    analyzeDocument,
    improveText,
    generateTableOfContents,
    createTemplate,
    deleteTemplate,
    exportDocument,
    refreshDocuments: fetchDocuments,
    refreshTemplates: fetchTemplates
  };
}
