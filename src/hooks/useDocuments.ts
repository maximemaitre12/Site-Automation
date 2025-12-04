import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface Document {
  id: string;
  user_id: string;
  title: string;
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

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
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
      setDocuments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const createDocument = async (title: string, content: string): Promise<Document | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title,
        raw_text: content,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return null;
    }

    await fetchDocuments();
    return data;
  };

  const analyzeDocument = async (docId: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get summary
      const summaryResponse = await callAI({
        messages: [{ role: 'user', content: `Résume ce document de manière concise en français:\n\n${content}` }],
        type: 'summarize'
      });

      // Get analysis
      const analysisResponse = await callAI({
        messages: [{ 
          role: 'user', 
          content: `Analyse ce document et extrais les informations clés en JSON (type, themes, entites, dates_importantes, points_cles):\n\n${content}` 
        }],
        type: 'extract'
      });

      let analysis = null;
      try {
        analysis = JSON.parse(analysisResponse.content);
      } catch {
        analysis = { raw: analysisResponse.content };
      }

      const { error } = await supabase
        .from('documents')
        .update({
          summary: summaryResponse.content,
          analysis,
          status: 'processed'
        })
        .eq('id', docId);

      if (error) throw error;

      await fetchDocuments();
      toast({ title: 'Succès', description: 'Document analysé avec succès' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return false;
    }
  };

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

  return {
    documents,
    loading,
    createDocument,
    analyzeDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments
  };
}
