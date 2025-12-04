import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

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
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTickets = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

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
      // First create the ticket
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

      // Then classify it with AI
      await classifyTicket(ticket.id, data.subject + '\n' + data.content);
      
      toast({ title: 'Succès', description: 'Ticket créé et classifié' });
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

      await fetchTickets();
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
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Génère une réponse professionnelle et empathique pour ce ticket support en français:

Sujet: ${ticket.subject}
Contenu: ${ticket.content}
Catégorie: ${ticket.category}
Priorité: ${ticket.priority}

La réponse doit:
- Accuser réception du problème
- Montrer de l'empathie
- Proposer une solution ou les prochaines étapes
- Rester professionnel et courtois`
        }],
        type: 'generate'
      });

      await supabase
        .from('support_tickets')
        .update({ ai_suggested_response: response.content })
        .eq('id', ticketId);

      await fetchTickets();
      toast({ title: 'Succès', description: 'Réponse générée' });
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

      await fetchTickets();
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

      await fetchTickets();
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
    await fetchTickets();
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
        const resolved = new Date(t.resolved_at!).getTime();
        return sum + (resolved - created);
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
    refreshTickets: fetchTickets
  };
}
