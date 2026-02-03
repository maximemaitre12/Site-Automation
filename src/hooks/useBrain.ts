import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';
import { streamAIChat, Attachment, generateConversationTitle } from '@/lib/ai-stream';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getKnowledgeContext } from '@/lib/aether-knowledge-base';
import { detectDomains, isPlatformQuestion, type BrainDomain } from '@/lib/brain-domain-router';
import { detectAction, useBrainActions, type ActionResult } from './useBrainActions';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  actionResult?: ActionResult;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

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
  const queryClient = useQueryClient();
  const { executeAction } = useBrainActions();
  
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [lastActionResult, setLastActionResult] = useState<ActionResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch company ID inline to avoid hook initialization issues
  const fetchCompanyId = useCallback(async (): Promise<string | null> => {
    if (!user?.id) return null;
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.error('Error fetching company ID:', error);
        return null;
      }
      return data?.company_id || null;
    } catch {
      return null;
    }
  }, [user?.id]);

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(conv => ({
        ...conv,
        messages: (conv.messages as any[]) || []
      }));
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['brain-documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('aether_documents')
        .select('id, title, content, ai_summary, description, file_type, file_url, tags, ai_keywords, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const loading = conversationsLoading || documentsLoading;

  const invalidateBrain = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['brain-documents', user?.id] });
  }, [queryClient, user?.id]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setSendingMessage(false);
      setStreamingContent('');
      toast({ title: 'Génération annulée', description: 'La réponse a été interrompue' });
    }
  }, [toast]);

  const createConversation = async (initialMessage?: string): Promise<Conversation | null> => {
    if (!user) return null;

    setStreamingContent('');
    setSendingMessage(false);

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: 'Nouvelle conversation',
        messages: []
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer la conversation', variant: 'destructive' });
      return null;
    }

    const conversation = { ...data, messages: [] };
    invalidateBrain();
    setCurrentConversation(conversation);
    return conversation;
  };

  const sendMessage = useCallback(async (
    content: string, 
    conversationId?: string, 
    options?: { 
      attachments?: Attachment[]; 
      confidentialMode?: boolean;
      onConfidentialMessage?: (role: 'user' | 'assistant', content: string) => void;
      onConfidentialStream?: (content: string) => void;
    }
  ): Promise<Message | null> => {
    if (!user || !content.trim()) return null;

    // CONFIDENTIAL MODE: In-memory only, no database storage
    if (options?.confidentialMode) {
      abortControllerRef.current = new AbortController();
      setSendingMessage(true);
      
      try {
        // Notify about user message (memory only)
        options.onConfidentialMessage?.('user', content);
        
        const systemPrompt = `Tu es AETHER Brain en MODE ULTRA-CONFIDENTIEL.

🔒 SÉCURITÉ MAXIMALE:
- Tu opères dans un environnement 100% sécurisé pour données sensibles
- Aucune donnée n'est stockée ou envoyée à l'extérieur
- Tu réponds uniquement à partir des documents internes fournis
- JAMAIS de recherche web ou de données externes

STYLE DE RÉPONSE:
- Sois CONCIS et DIRECT. Maximum 3-4 paragraphes courts.
- Jamais de markdown (*, #, -, etc.)
- Réponds en français, de manière professionnelle`;

        let fullContent = '';
        
        await new Promise<void>((resolve, reject) => {
          streamAIChat({
            messages: [{ role: 'user', content }],
            systemPrompt,
            userId: user.id,
            attachments: options?.attachments,
            confidentialMode: true,
            abortSignal: abortControllerRef.current?.signal,
            onDelta: (delta) => {
              fullContent += delta;
              options.onConfidentialStream?.(fullContent);
            },
            onDone: () => resolve(),
            onError: (err) => reject(err),
          });
        });

        // Notify about assistant message (memory only)
        options.onConfidentialMessage?.('assistant', fullContent);
        
        abortControllerRef.current = null;
        return {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date()
        };
      } catch (err) {
        abortControllerRef.current = null;
        if (err instanceof Error && err.message === 'Generation cancelled') {
          return null;
        }
        toast({ 
          title: 'Erreur', 
          description: err instanceof Error ? err.message : "Erreur lors de l'envoi", 
          variant: 'destructive' 
        });
        return null;
      } finally {
        setSendingMessage(false);
        options.onConfidentialStream?.('');
      }
    }

    // NORMAL MODE: Standard database storage

    abortControllerRef.current = new AbortController();
    setSendingMessage(true);
    setStreamingContent('');
    
    try {
      // Refresh session to ensure we have a valid token for all subsequent calls
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.warn('Session refresh warning:', refreshError.message);
        // Don't fail here - getSession might still work
      }
      
      let conv = currentConversation;
      
      if (!conv || (conversationId && conv.id !== conversationId)) {
        if (conversationId) {
          conv = conversations.find(c => c.id === conversationId) || null;
        }
        if (!conv) {
          conv = await createConversation(content);
        }
      }
      
      if (!conv) {
        toast({ 
          title: 'Erreur', 
          description: 'Impossible de créer la conversation. Veuillez vous reconnecter.', 
          variant: 'destructive' 
        });
        setSendingMessage(false);
        return null;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
        attachments: options?.attachments
      };

      const updatedMessages = [...conv.messages, userMessage];
      setCurrentConversation({ ...conv, messages: updatedMessages });

      // ACTION DETECTION: Check if user wants to perform an action (e.g., add CV to HR)
      const detectedActionInfo = detectAction(content, options?.attachments);
      let actionResult: ActionResult | null = null;
      let actionContext = '';
      
      if (detectedActionInfo && detectedActionInfo.confidence >= 0.7) {
        console.log('Action detected:', detectedActionInfo);
        
        // Extract file data if needed
        let fileBase64: string | undefined;
        let fileName: string | undefined;
        let mimeType: string | undefined;
        
        if (detectedActionInfo.requiresFile && options?.attachments?.length) {
          const fileAttachment = options.attachments.find(a => 
            a.type === 'document' || 
            a.mimeType?.includes('pdf') || 
            a.mimeType?.includes('word')
          );
          if (fileAttachment) {
            fileBase64 = fileAttachment.content;
            fileName = fileAttachment.name;
            mimeType = fileAttachment.mimeType;
          }
        }
        
        // Execute the action
        actionResult = await executeAction(
          detectedActionInfo.action,
          detectedActionInfo.data,
          fileBase64,
          fileName,
          mimeType
        );
        
        setLastActionResult(actionResult);
        
        if (actionResult.success) {
          actionContext = `\n\nACTION RÉALISÉE:\n✅ ${actionResult.message}`;
          if (actionResult.data) {
            actionContext += `\nDétails: ${JSON.stringify(actionResult.data, null, 2)}`;
          }
        } else {
          actionContext = `\n\nACTION ÉCHOUÉE:\n❌ ${actionResult.message}`;
        }
      }

      // Get relevant knowledge from AETHER Support knowledge base
      const supportKnowledge = getKnowledgeContext(content);
      
      // Fetch company ID for platform context (optional; the fetcher can derive it too)
      const companyId = await fetchCompanyId();
      
      // AGENT ROUTER: Determine what minimal real-time data is needed
      let platformContextStr = '';
      
      try {
        // Step 1: Ask the router agent what data is needed for this query
        console.log('Agent Router - analyzing query...');
        const routerResponse = await supabase.functions.invoke('brain-agent-router', {
          body: { query: content }
        });
        
        const requirements = routerResponse.data;
        console.log('Agent Router - requirements:', requirements);
        
        // Step 2: Fetch only essential targeted data (counts + small sample)
        if (requirements?.needs_data !== false && requirements?.tables?.length > 0) {
          const fetchResponse = await supabase.functions.invoke('brain-fetch-targeted', {
            body: {
              tables: requirements.tables,
              filters: requirements.filters || {},
              limit: requirements.limit || 5,
              fields: requirements.fields || [],
              query: content,
            }
          });
          
          if (fetchResponse.data?.contextText) {
            platformContextStr = `\n\nDONNÉES TEMPS RÉEL (${new Date().toLocaleString('fr-FR')}):\n${fetchResponse.data.contextText}`;
            console.log('Targeted data loaded:', fetchResponse.data.contextText.length, 'chars');
          }
        } else {
          console.log('Agent Router - no data needed for this query');
        }
      } catch (err) {
        console.error('Error in agent router flow:', err);
        // Fallback to simple domain detection if agent fails (needs companyId)
        const detectedDomains = detectDomains(content);
        if (companyId && (detectedDomains.length > 0 || isPlatformQuestion(content))) {
          try {
            const domainsToFetch = detectedDomains.length > 0 ? detectedDomains : ['general'];
            const response = await supabase.functions.invoke('brain-smart-context', {
              body: { userId: user.id, companyId, domains: domainsToFetch, query: content }
            });
            if (response.data?.contextText) {
              platformContextStr = `\n\nDONNÉES TEMPS RÉEL:\n${response.data.contextText}`;
            }
          } catch { /* ignore fallback errors */ }
        }
      }
      
      const systemPrompt = `Tu es AETHER Brain, un assistant expert et dynamique qui peut AGIR sur les données.

STYLE DE RÉPONSE:
- Sois CONCIS et DIRECT. Maximum 3-4 paragraphes courts.
- Commence directement par l'essentiel, pas d'introduction
- Utilise un ton conversationnel et énergique
- Phrases courtes et percutantes
- Jamais d'astérisques, hashtags, tirets en début de ligne
- Pas de listes à puces, reformule en phrases fluides
- Si tu dois lister des éléments, utilise des numéros (1, 2, 3)

PERSONNALITÉ:
- Expert confiant qui va droit au but
- Amical mais professionnel
- Réponds comme un collègue brillant, pas comme une encyclopédie

CAPACITÉS D'ACTION:
Tu peux modifier les données de la plateforme quand l'utilisateur le demande:
- Ajouter des candidats (avec CV)
- Créer des deals/opportunités
- Créer des documents
- Créer des tickets support
- Créer des contacts CRM
- Mettre à jour ou supprimer des éléments

Quand une action est réalisée, confirme-la clairement et propose les prochaines étapes.

RÈGLES ABSOLUES:
- JAMAIS de markdown (*, #, -, etc.)
- JAMAIS de phrases longues et ennuyeuses
- JAMAIS "Je suis là pour vous aider" ou phrases génériques
- TOUJOURS répondre en français

INFORMATIONS CONFIDENTIELLES (NE JAMAIS DIVULGUER À L'EXTÉRIEUR):
- Statistiques globales de la plateforme (nombre total d'utilisateurs, etc.)
- Ces restrictions ne s'appliquent PAS aux données personnelles de l'utilisateur actuel
- Tu DOIS répondre aux questions sur les données de l'utilisateur (ses clés API, workflows, candidats, etc.)

UTILISATION DES DONNÉES TEMPS RÉEL:
1) Quand une section "DONNÉES TEMPS RÉEL" est fournie, c'est la source de vérité.
2) Si un compteur "Total: X" est présent, tu réponds avec ce chiffre (même si X = 0).
3) Si une section indique "Aucun élément" ou une "Erreur", tu le dis clairement et tu proposes l'action suivante.

${supportKnowledge ? `DOCUMENTATION AETHER:\n${supportKnowledge}` : ''}
${platformContextStr}
${actionContext}`;

      let fullContent = '';
      const assistantMessageId = crypto.randomUUID();

      await new Promise<void>((resolve, reject) => {
        const cleanedMessages = updatedMessages.slice(-10).map(m => {
          let messageContent = m.content;
          if (messageContent.includes('[IMAGE_GENERATED]data:')) {
            messageContent = messageContent.replace(/\[IMAGE_GENERATED\]data:image\/[^;]+;base64,[^\s]*/g, '[Image générée]');
          }
          if (messageContent.length > 5000 && messageContent.includes('base64,')) {
            messageContent = messageContent.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[Image]');
          }
          return { role: m.role, content: messageContent };
        });

        streamAIChat({
          messages: cleanedMessages,
          systemPrompt,
          userId: user.id,
          companyId: companyId || undefined,
          attachments: options?.attachments,
          confidentialMode: options?.confidentialMode,
          abortSignal: abortControllerRef.current?.signal,
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
        timestamp: new Date(),
        actionResult: actionResult || undefined
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      
      let newTitle = conv.title;
      if (conv.messages.length === 0) {
        newTitle = await generateConversationTitle(content);
      }

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

      const updatedConv = { ...conv, messages: finalMessages, title: newTitle };
      setCurrentConversation(updatedConv);
      invalidateBrain();

      setStreamingContent('');
      abortControllerRef.current = null;
      return assistantMessage;
    } catch (err) {
      setStreamingContent('');
      abortControllerRef.current = null;
      
      if (err instanceof Error && err.message === 'Generation cancelled') {
        return null;
      }
      
      toast({ 
        title: 'Erreur', 
        description: err instanceof Error ? err.message : "Erreur lors de l'envoi", 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [user, currentConversation, conversations, toast, invalidateBrain]);

  const addMessageWithoutAI = useCallback(async (
    content: string,
    role: 'user' | 'assistant' = 'user',
    conversationId?: string
  ): Promise<Conversation | null> => {
    if (!user || !content.trim()) return null;

    try {
      let conv = currentConversation;
      
      if (!conv || (conversationId && conv.id !== conversationId)) {
        if (conversationId) {
          conv = conversations.find(c => c.id === conversationId) || null;
        }
        if (!conv) {
          conv = await createConversation(content);
        }
      }
      
      if (!conv) return null;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...conv.messages, newMessage];
      
      const updatedConv = { ...conv, messages: updatedMessages };
      setCurrentConversation(updatedConv);
      
      const messagesForDb = updatedMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
      }));

      await supabase
        .from('conversations')
        .update({ 
          messages: messagesForDb,
          updated_at: new Date().toISOString()
        })
        .eq('id', conv.id);

      invalidateBrain();
      return updatedConv;
    } catch (err) {
      console.error('Error adding message:', err);
      return null;
    }
  }, [user, currentConversation, conversations, createConversation, invalidateBrain]);

  const deleteConversation = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    invalidateBrain();
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
    return true;
  };

  const clearAllConversations = async (): Promise<boolean> => {
    if (!user) return false;
    
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    
    setCurrentConversation(null);
    setStreamingContent('');
    invalidateBrain();
    toast({ title: 'Historique effacé', description: 'Toutes les conversations ont été supprimées' });
    return true;
  };

  const selectConversation = (id: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setStreamingContent('');
    setSendingMessage(false);
    
    const conv = conversations.find(c => c.id === id);
    if (conv) setCurrentConversation(conv);
  };

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
      toast({ title: 'Erreur', description: "Impossible d'ajouter le document", variant: 'destructive' });
      return null;
    }

    invalidateBrain();
    toast({ title: 'Succès', description: 'Document ajouté à AETHER Docs' });
    return data;
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('aether_documents').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    invalidateBrain();
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
    setCurrentConversation,
    loading,
    sendingMessage,
    streamingContent,
    lastActionResult,
    createConversation,
    sendMessage,
    cancelGeneration,
    deleteConversation,
    clearAllConversations,
    selectConversation,
    uploadDocument,
    deleteDocument,
    searchDocuments,
    generateProcedure,
    improveText,
    summarizeDocument,
    addMessageWithoutAI,
    executeAction
  };
}
