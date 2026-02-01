import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getKnowledgeContext, getSupportAISystemPrompt, SUPPORT_EMAIL } from '@/lib/aether-knowledge-base';
export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  content: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  customer_email: string | null;
  ai_classification: any;
  ai_suggested_response: string | null;
  actual_response: string | null;
  satisfaction_score: number | null;
  resolved_at: string | null;
  created_at: string;
}

export function useSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading: loading } = useQuery({
    queryKey: ['support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const invalidateTickets = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['support-tickets', user?.id] });
  }, [queryClient, user?.id]);

  const generateTicketNumber = () => {
    return `TKT-${Date.now().toString(36).toUpperCase()}`;
  };

  const createTicket = async (data: {
    subject: string;
    content: string;
    customerEmail?: string;
  }): Promise<SupportTicket | null> => {
    if (!user) return null;

    try {
      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          ticket_number: generateTicketNumber(),
          subject: data.subject,
          content: data.content,
          customer_email: data.customerEmail,
          status: 'open',
          priority: 'medium'
        })
        .select()
        .single();

      if (error) throw error;

      await classifyTicket(ticket.id, data.subject + '\n' + data.content);
      
      toast({ title: 'Succès', description: 'Ticket créé et classifié', duration: 2000 });
      return ticket;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la création', variant: 'destructive' });
      return null;
    }
  };

  const classifyTicket = async (ticketId: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Classifie ce ticket support. Réponds en JSON:
{
  "category": "bug|feature_request|billing|technical|general|urgent",
  "priority": "low|medium|high|critical",
  "sentiment": "positive|neutral|negative|angry",
  "tags": ["tag1", "tag2"],
  "summary": "résumé en une phrase"
}

Ticket:
${content}`
        }],
        type: 'classify'
      });

      let classification: any = {};
      try {
        classification = JSON.parse(response.content);
      } catch {
        classification = { category: 'general', priority: 'medium' };
      }

      await supabase
        .from('support_tickets')
        .update({
          category: classification.category,
          priority: classification.priority,
          ai_classification: classification
        })
        .eq('id', ticketId);

      invalidateTickets();
      return true;
    } catch (err) {
      return false;
    }
  };

  const generateResponse = async (ticketId: string): Promise<string | null> => {
    if (!user) return null;

    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    try {
      // Construire le contexte avec la documentation interne
      const ticketContent = `${ticket.subject}\n${ticket.content}`;
      const knowledgeContext = getKnowledgeContext(ticketContent);
      const systemPrompt = getSupportAISystemPrompt();
      
      const response = await callAI({
        systemPrompt,
        messages: [{
          role: 'user',
          content: `${knowledgeContext}

TICKET CLIENT À TRAITER:
Sujet: ${ticket.subject}
Contenu: ${ticket.content}
Catégorie détectée: ${ticket.category || 'Non classifié'}
Priorité: ${ticket.priority || 'Non définie'}
${ticket.customer_email ? `Email client: ${ticket.customer_email}` : ''}

RAPPEL: Tu dois fournir une solution directe et actionnable. Utilise la documentation ci-dessus pour répondre précisément.
Si et SEULEMENT SI aucune solution ne fonctionne après plusieurs tentatives, tu peux suggérer de contacter ${SUPPORT_EMAIL} en précisant que je réponds rapidement (sous 24h).`
        }],
        type: 'generate'
      });

      await supabase
        .from('support_tickets')
        .update({ ai_suggested_response: response.content })
        .eq('id', ticketId);

      invalidateTickets();
      toast({ title: 'Succès', description: 'Réponse générée avec la documentation interne' });
      return response.content;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  const resolveTicket = async (ticketId: string, response: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await supabase
        .from('support_tickets')
        .update({
          actual_response: response,
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      invalidateTickets();
      toast({ title: 'Succès', description: 'Ticket résolu' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la résolution', variant: 'destructive' });
      return false;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string): Promise<boolean> => {
    try {
      await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      invalidateTickets();
      return true;
    } catch {
      return false;
    }
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    invalidateTickets();
    toast({ title: 'Succès', description: 'Ticket supprimé' });
    return true;
  };

  const getStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const critical = tickets.filter(t => t.priority === 'critical' || t.priority === 'high').length;
    const avgResolutionTime = tickets
      .filter(t => t.resolved_at)
      .reduce((sum, t) => {
        const created = new Date(t.created_at).getTime();
        const resolvedTime = new Date(t.resolved_at!).getTime();
        return sum + (resolvedTime - created);
      }, 0) / (resolved || 1);
    
    return { 
      total, 
      open, 
      resolved, 
      critical,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgResolutionHours: Math.round(avgResolutionTime / (1000 * 60 * 60))
    };
  };

  return {
    tickets,
    loading,
    createTicket,
    classifyTicket,
    generateResponse,
    resolveTicket,
    updateTicketStatus,
    deleteTicket,
    getStats,
    refreshTickets: invalidateTickets
  };
}
