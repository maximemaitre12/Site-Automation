import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface DocFolder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface DocTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  content_structure: Record<string, unknown>;
  branding: Record<string, unknown>;
  variables: unknown[];
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface AetherDocument {
  id: string;
  user_id: string;
  folder_id: string | null;
  template_id: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  content: string | null;
  extracted_data: Record<string, unknown>;
  ai_summary: string | null;
  ai_keywords: string[];
  ai_entities: Record<string, unknown>;
  embedding_status: string;
  tags: string[];
  version: number;
  status: string;
  access_level: string;
  metadata: Record<string, unknown>;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type QuickFilter = 'all' | 'recent' | 'starred' | 'archived' | string;

export function useAetherDocs() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AetherDocument[]>([]);
  const [folders, setFolders] = useState<DocFolder[]>([]);
  const [templates, setTemplates] = useState<DocTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<QuickFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFolders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('doc_folders')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    
    if (error) {
      console.error('Error fetching folders:', error);
      return;
    }
    setFolders(data || []);
  }, [user]);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from('aether_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    // Handle quick filters
    if (currentFolder === 'starred') {
      query = query.eq('is_favorite', true).eq('is_archived', false);
    } else if (currentFolder === 'archived') {
      query = query.eq('is_archived', true);
    } else if (currentFolder === 'recent') {
      // Recent = last 7 days, not archived
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.eq('is_archived', false).gte('updated_at', sevenDaysAgo.toISOString());
    } else if (currentFolder?.startsWith('type:')) {
      // Filter by file type
      const fileType = currentFolder.replace('type:', '');
      query = query.eq('is_archived', false);
      if (fileType === 'pdf') {
        query = query.ilike('file_type', '%pdf%');
      } else if (fileType === 'images') {
        query = query.ilike('file_type', '%image%');
      } else if (fileType === 'spreadsheets') {
        query = query.or('file_type.ilike.%sheet%,file_type.ilike.%excel%,file_type.ilike.%csv%');
      }
    } else if (currentFolder && currentFolder !== 'all') {
      // It's a folder ID
      query = query.eq('folder_id', currentFolder).eq('is_archived', false);
    } else {
      // Show all non-archived documents
      query = query.eq('is_archived', false);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }
    setDocuments((data || []) as AetherDocument[]);
  }, [user, currentFolder, searchQuery]);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('doc_templates')
      .select('*')
      .or(`user_id.eq.${user.id},is_system.eq.true`)
      .order('name');
    
    if (error) {
      console.error('Error fetching templates:', error);
      return;
    }
    setTemplates((data || []) as DocTemplate[]);
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchFolders(), fetchDocuments(), fetchTemplates()])
        .finally(() => setLoading(false));
    }
  }, [user, fetchFolders, fetchDocuments, fetchTemplates]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [currentFolder, searchQuery, user, fetchDocuments]);

  const createFolder = async (name: string, parentId: string | null = null, color: string = '#3C4DFE') => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('doc_folders')
      .insert({
        user_id: user.id,
        name,
        parent_id: parentId,
        color
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création du dossier');
      return null;
    }
    
    await fetchFolders();
    toast.success('Dossier créé');
    return data;
  };

  const deleteFolder = async (folderId: string) => {
    const { error } = await supabase
      .from('doc_folders')
      .delete()
      .eq('id', folderId);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return false;
    }
    
    await fetchFolders();
    await fetchDocuments();
    toast.success('Dossier supprimé');
    return true;
  };

  const uploadDocument = async (
    file: File,
    title: string,
    folderId: string | null = null,
    tags: string[] = []
  ) => {
    if (!user) return null;

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Erreur lors de l\'upload du fichier');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data, error } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        folder_id: folderId,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        tags,
        embedding_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création du document');
      return null;
    }

    await fetchDocuments();
    toast.success('Document uploadé');
    
    // Trigger AI analysis in background
    analyzeDocument(data.id);
    
    return data as AetherDocument;
  };

  const createDocument = async (
    title: string,
    content: string,
    folderId: string | null = null,
    templateId: string | null = null,
    tags: string[] = []
  ) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content,
        folder_id: folderId,
        template_id: templateId,
        tags,
        file_type: 'text/plain',
        embedding_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création du document');
      return null;
    }

    await fetchDocuments();
    toast.success('Document créé');
    
    // Trigger AI analysis
    analyzeDocument(data.id);
    
    return data as AetherDocument;
  };

  const updateDocument = async (
    documentId: string,
    updates: Partial<Pick<AetherDocument, 'title' | 'description' | 'content' | 'tags' | 'status' | 'folder_id' | 'is_favorite' | 'is_archived'>>
  ) => {
    const { data, error } = await supabase
      .from('aether_documents')
      .update(updates as Record<string, unknown>)
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return null;
    }

    await fetchDocuments();
    return data as AetherDocument;
  };

  const toggleFavorite = async (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;
    
    await updateDocument(documentId, { is_favorite: !doc.is_favorite });
    toast.success(doc.is_favorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const toggleArchive = async (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;
    
    await updateDocument(documentId, { is_archived: !doc.is_archived });
    toast.success(doc.is_archived ? 'Document restauré' : 'Document archivé');
  };

  const deleteDocument = async (documentId: string) => {
    const { error } = await supabase
      .from('aether_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return false;
    }

    await fetchDocuments();
    toast.success('Document supprimé');
    return true;
  };

  const analyzeDocument = async (documentId: string, showToasts = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      if (showToasts) {
        toast.info('Analyse IA en cours...');
      }
      
      const { data, error } = await supabase.functions.invoke('doc-analyze', {
        body: { documentId }
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error('Analysis error:', error);
        if (showToasts) {
          toast.error('Erreur lors de l\'analyse: ' + (error.message || 'Erreur inconnue'));
        }
        return false;
      }

      // Check if the response indicates an error
      if (data?.error) {
        console.error('Analysis response error:', data.error);
        if (showToasts) {
          toast.error('Erreur lors de l\'analyse: ' + data.error);
        }
        return false;
      }
      
      await fetchDocuments();
      if (showToasts) {
        toast.success('Analyse IA terminée');
      }
      return true;
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error('Analysis failed:', e);
      
      if (e.name === 'AbortError') {
        if (showToasts) {
          toast.error('L\'analyse a pris trop de temps. Réessayez plus tard.');
        }
      } else if (showToasts) {
        toast.error('Erreur lors de l\'analyse: ' + (e.message || 'Erreur inconnue'));
      }
      return false;
    }
  };

  const rewriteDocument = async (
    documentId: string,
    options?: {
      instructions?: string;
      style?: 'professional' | 'formal' | 'concise' | 'detailed' | 'simplified';
      format?: 'report' | 'memo' | 'procedure' | 'email' | 'presentation' | 'contract';
      companyRules?: string;
    }
  ) => {
    try {
      toast.info('Réécriture en cours...');
      const { data, error } = await supabase.functions.invoke('doc-rewrite', {
        body: { documentId, ...options }
      });

      if (error) {
        console.error('Rewrite error:', error);
        toast.error('Erreur lors de la réécriture');
        return null;
      }

      await fetchDocuments();
      toast.success('Document réécrit avec succès');
      return data;
    } catch (e) {
      console.error('Rewrite failed:', e);
      toast.error('Erreur lors de la réécriture');
      return null;
    }
  };

  const generateDocument = async (
    templateId: string,
    variables: Record<string, string>,
    title: string
  ) => {
    if (!user) return null;

    try {
      toast.info('Génération du document Word en cours...');
      
      const { data, error } = await supabase.functions.invoke('doc-generate-word', {
        body: { templateId, variables, title }
      });

      if (error) {
        console.error('Generate error:', error);
        toast.error('Erreur lors de la génération');
        return null;
      }

      await fetchDocuments();
      toast.success('Document Word généré avec succès');
      
      // Auto-trigger AI analysis in background (silently)
      if (data?.documentId) {
        analyzeDocument(data.documentId, false);
      }
      
      // Auto-download the Word file if URL is available
      if (data?.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `${title}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return data;
    } catch (e) {
      console.error('Generate failed:', e);
      toast.error('Erreur lors de la génération');
      return null;
    }
  };

  const searchDocuments = async (query: string) => {
    if (!user || !query.trim()) return [];

    const { data, error } = await supabase
      .from('aether_documents')
      .select('*')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%,ai_summary.ilike.%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    return (data || []) as AetherDocument[];
  };

  const getDocumentsByTags = async (tags: string[]) => {
    if (!user || tags.length === 0) return [];

    const { data, error } = await supabase
      .from('aether_documents')
      .select('*')
      .eq('user_id', user.id)
      .contains('tags', tags)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Tags search error:', error);
      return [];
    }

    return (data || []) as AetherDocument[];
  };

  const moveDocument = async (documentId: string, targetFolderId: string | null) => {
    const { error } = await supabase
      .from('aether_documents')
      .update({ folder_id: targetFolderId })
      .eq('id', documentId);

    if (error) {
      toast.error('Erreur lors du déplacement');
      return false;
    }

    await fetchDocuments();
    toast.success('Document déplacé');
    return true;
  };

  return {
    documents,
    folders,
    templates,
    loading,
    currentFolder,
    searchQuery,
    setCurrentFolder,
    setSearchQuery,
    createFolder,
    deleteFolder,
    uploadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    generateDocument,
    analyzeDocument,
    rewriteDocument,
    searchDocuments,
    getDocumentsByTags,
    moveDocument,
    toggleFavorite,
    toggleArchive,
    refreshDocuments: fetchDocuments,
    refreshFolders: fetchFolders,
    refreshTemplates: fetchTemplates
  };
}
