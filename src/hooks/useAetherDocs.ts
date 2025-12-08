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
  created_at: string;
  updated_at: string;
}

export function useAetherDocs() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AetherDocument[]>([]);
  const [folders, setFolders] = useState<DocFolder[]>([]);
  const [templates, setTemplates] = useState<DocTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
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

    if (currentFolder) {
      query = query.eq('folder_id', currentFolder);
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
    updates: Partial<AetherDocument>
  ) => {
    const { data, error } = await supabase
      .from('aether_documents')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return null;
    }

    await fetchDocuments();
    toast.success('Document mis à jour');
    return data as AetherDocument;
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

  const analyzeDocument = async (documentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('doc-analyze', {
        body: { documentId }
      });

      if (error) {
        console.error('Analysis error:', error);
      } else {
        await fetchDocuments();
      }
    } catch (e) {
      console.error('Analysis failed:', e);
    }
  };

  const generateDocument = async (
    templateId: string,
    variables: Record<string, string>,
    title: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('doc-generate', {
        body: { templateId, variables, title }
      });

      if (error) {
        toast.error('Erreur lors de la génération');
        return null;
      }

      await fetchDocuments();
      toast.success('Document généré');
      return data;
    } catch (e) {
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
    searchDocuments,
    getDocumentsByTags,
    moveDocument,
    refreshDocuments: fetchDocuments,
    refreshFolders: fetchFolders,
    refreshTemplates: fetchTemplates
  };
}
