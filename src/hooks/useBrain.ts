import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';
import { streamAIChat, Attachment } from '@/lib/ai-stream';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

// Documents from AETHER Docs
export interface AetherDocument {
  id: string;
  title: string;
  content: string | null;
  ai_summary: string | null;
  description: string | null;
  file_type: string | null;
  file_url: string | null;
  tags: any;
  ai_keywords: any;
  created_at: string;
}

export function useBrain() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<AetherDocument[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const parsed = data.map(conv => ({
        ...conv,
        messages: (conv.messages as any[]) || []
      }));
      setConversations(parsed);
    }
  };

  const fetchDocuments = async () => {
    if (!user) {
      setDocuments([]);
      return;
    }
    
    // Fetch from AETHER Docs (aether_documents table)
    const { data, error } = await supabase
      .from('aether_documents')
      .select('id, title, content, ai_summary, description, file_type, file_url, tags, ai_keywords, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!user) {
        setConversations([]);
        setDocuments([]);
        setLoading(false);
        return;
      }
      
      try {
        const [convResult, docsResult] = await Promise.all([
          supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
          supabase
            .from('aether_documents')
            .select('id, title, content, ai_summary, description, file_type, file_url, tags, ai_keywords, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        if (mounted) {
          if (!convResult.error && convResult.data) {
            setConversations(convResult.data.map(conv => ({
              ...conv,
              messages: (conv.messages as any[]) || []
            })));
          }
          
          if (!docsResult.error && docsResult.data) {
            setDocuments(docsResult.data);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    
    return () => { mounted = false; };
  }, [user?.id]);

  const createConversation = async (initialMessage?: string): Promise<Conversation | null> => {
    if (!user) return null;

    // Reset streaming state when creating new conversation
    setStreamingContent('');
    setSendingMessage(false);

    const newConv: Partial<Conversation> = {
      title: initialMessage?.slice(0, 50) || 'Nouvelle conversation',
      messages: [],
    };

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: newConv.title,
        messages: []
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer la conversation', variant: 'destructive' });
      return null;
    }

    const conversation = { ...data, messages: [] };
    setConversations(prev => [conversation, ...prev]);
    setCurrentConversation(conversation);
    return conversation;
  };

  const sendMessage = useCallback(async (
    content: string, 
    conversationId?: string, 
    options?: { attachments?: Attachment[] }
  ): Promise<Message | null> => {
    if (!user || !content.trim()) return null;

    setSendingMessage(true);
    setStreamingContent('');
    
    try {
      let conv = currentConversation;
      
      // Create new conversation if needed
      if (!conv || (conversationId && conv.id !== conversationId)) {
        if (conversationId) {
          conv = conversations.find(c => c.id === conversationId) || null;
        }
        if (!conv) {
          conv = await createConversation(content);
        }
      }
      
      if (!conv) throw new Error('No conversation');

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
        attachments: options?.attachments
      };

      // Update local state immediately with user message
      const updatedMessages = [...conv.messages, userMessage];
      setCurrentConversation({ ...conv, messages: updatedMessages });

      const systemPrompt = `Tu es AETHER Brain, l'assistant IA interne de l'entreprise ultra-performant.
Tu as accès à tous les documents internes et tu peux analyser des images et documents.
Réponds en français de manière concise, professionnelle et utile.`;

      // Use streaming with document search and attachments
      let fullContent = '';
      const assistantMessageId = crypto.randomUUID();

      await new Promise<void>((resolve, reject) => {
        // Filter out base64 image data from message history to prevent context overflow
        const cleanedMessages = updatedMessages.slice(-10).map(m => {
          let content = m.content;
          // Remove [IMAGE_GENERATED]data:... pattern from messages
          if (content.includes('[IMAGE_GENERATED]data:')) {
            content = content.replace(/\[IMAGE_GENERATED\]data:image\/[^;]+;base64,[^\s]*/g, '[Image générée]');
          }
          // Also clean up very long base64 data that might be in any message
          if (content.length > 5000 && content.includes('base64,')) {
            content = content.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[Image]');
          }
          return { role: m.role, content };
        });

        streamAIChat({
          messages: cleanedMessages,
          systemPrompt,
          userId: user.id,
          attachments: options?.attachments,
          onDelta: (delta) => {
            fullContent += delta;
            setStreamingContent(fullContent);
          },
          onDone: () => resolve(),
          onError: (err) => reject(err),
        });
      });

      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const newTitle = conv.messages.length === 0 ? content.slice(0, 50) : conv.title;

      // Save to database
      const messagesForDb = finalMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
      }));

      await supabase
        .from('conversations')
        .update({ 
          messages: messagesForDb,
          title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', conv.id);

      // Update local state
      const updatedConv = { ...conv, messages: finalMessages, title: newTitle };
      setCurrentConversation(updatedConv);
      setConversations(prev => 
        prev.map(c => c.id === conv!.id ? updatedConv : c)
      );

      setStreamingContent('');
      return assistantMessage;
    } catch (err) {
      setStreamingContent('');
      toast({ 
        title: 'Erreur', 
        description: err instanceof Error ? err.message : 'Erreur lors de l\'envoi', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [user, currentConversation, conversations, toast]);

  const deleteConversation = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
    return true;
  };

  const selectConversation = (id: string) => {
    // Reset streaming state when switching conversations
    setStreamingContent('');
    setSendingMessage(false);
    
    const conv = conversations.find(c => c.id === id);
    if (conv) setCurrentConversation(conv);
  };

  // Document management - now uses aether_documents
  const uploadDocument = async (title: string, content: string, docType: string = 'text', tags: string[] = []): Promise<AetherDocument | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content,
        file_type: docType,
        tags: tags,
        status: 'active'
      })
      .select('id, title, content, ai_summary, description, file_type, file_url, tags, ai_keywords, created_at')
      .single();

    if (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter le document', variant: 'destructive' });
      return null;
    }

    setDocuments(prev => [data, ...prev]);
    toast({ title: 'Succès', description: 'Document ajouté à AETHER Docs' });
    return data;
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('aether_documents').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: 'Succès', description: 'Document supprimé' });
    return true;
  };

  const searchDocuments = async (query: string): Promise<AetherDocument[]> => {
    if (!user || !query.trim()) return documents;

    const { data, error } = await supabase
      .from('aether_documents')
      .select('id, title, content, ai_summary, description, file_type, file_url, tags, ai_keywords, created_at')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,ai_summary.ilike.%${query}%`);

    if (error) return [];
    return data || [];
  };

  // AI-powered features
  const generateProcedure = async (topic: string): Promise<string | null> => {
    const response = await callAI({
      messages: [{ 
        role: 'user', 
        content: `Génère une procédure concise pour: ${topic}. Inclus: objectif, étapes numérotées, points d'attention.` 
      }],
      type: 'generate'
    });

    if (response.error) {
      toast({ title: 'Erreur', description: response.error, variant: 'destructive' });
      return null;
    }
    return response.content;
  };

  const improveText = async (text: string, style: 'formal' | 'casual' | 'concise' | 'detailed' = 'formal'): Promise<string | null> => {
    const styleMap = {
      formal: 'formel et professionnel',
      casual: 'décontracté',
      concise: 'concis et direct',
      detailed: 'détaillé'
    };

    const response = await callAI({
      messages: [{ 
        role: 'user', 
        content: `Améliore ce texte (style ${styleMap[style]}):\n\n${text}` 
      }],
      type: 'generate'
    });

    if (response.error) {
      toast({ title: 'Erreur', description: response.error, variant: 'destructive' });
      return null;
    }
    return response.content;
  };

  const summarizeDocument = async (docId: string): Promise<string | null> => {
    const doc = documents.find(d => d.id === docId);
    if (!doc?.content) {
      toast({ title: 'Erreur', description: 'Document non trouvé ou vide', variant: 'destructive' });
      return null;
    }

    const response = await callAI({
      messages: [{ role: 'user', content: `Résume ce document:\n\n${doc.content}` }],
      type: 'summarize'
    });

    if (response.error) {
      toast({ title: 'Erreur', description: response.error, variant: 'destructive' });
      return null;
    }
    return response.content;
  };

  return {
    conversations,
    documents,
    currentConversation,
    loading,
    sendingMessage,
    streamingContent,
    createConversation,
    sendMessage,
    deleteConversation,
    selectConversation,
    uploadDocument,
    deleteDocument,
    searchDocuments,
    generateProcedure,
    improveText,
    summarizeDocument,
    refreshConversations: fetchConversations,
    refreshDocuments: fetchDocuments,
    setCurrentConversation
  };
}
