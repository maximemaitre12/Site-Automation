import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProposedSlot {
  date: string;
  time: string;
  duration: number;
}

export interface InterviewProposal {
  id: string;
  user_id: string;
  interview_id: string | null;
  candidate_id: string;
  proposed_slots: ProposedSlot[];
  selected_slot_index: number | null;
  candidate_response: 'pending' | 'accepted' | 'rejected' | 'counter_proposed';
  candidate_counter_proposal: string | null;
  message_to_candidate: string | null;
  candidate_email_sent_at: string | null;
  confirmation_email_sent_at: string | null;
  confirmation_token: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProposalData {
  candidate_id: string;
  proposed_slots: ProposedSlot[];
  message_to_candidate?: string;
}

export function useInterviewProposals() {
  const [proposals, setProposals] = useState<InterviewProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProposals = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('interview_date_proposals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProposals((data || []).map(item => ({
        ...item,
        proposed_slots: (item.proposed_slots as unknown as ProposedSlot[]) || [],
        candidate_response: item.candidate_response as InterviewProposal['candidate_response'],
      })));
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const createProposal = async (data: CreateProposalData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: newProposal, error } = await supabase
        .from('interview_date_proposals')
        .insert({
          user_id: user.id,
          candidate_id: data.candidate_id,
          proposed_slots: data.proposed_slots as unknown as any,
          message_to_candidate: data.message_to_candidate,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProposals();
      toast({
        title: "Proposition envoyée",
        description: "Les créneaux ont été proposés au candidat",
      });

      return newProposal;
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la proposition",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProposal = async (id: string, updates: Partial<InterviewProposal>) => {
    try {
      const { proposed_slots, ...rest } = updates;
      const updateData: any = { ...rest, updated_at: new Date().toISOString() };
      if (proposed_slots) updateData.proposed_slots = proposed_slots as unknown as any;
      
      const { error } = await supabase
        .from('interview_date_proposals')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchProposals();
      toast({
        title: "Proposition mise à jour",
      });
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la proposition",
        variant: "destructive",
      });
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interview_date_proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProposals();
      toast({
        title: "Proposition supprimée",
      });
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la proposition",
        variant: "destructive",
      });
    }
  };

  const getProposalsForCandidate = (candidateId: string) => {
    return proposals.filter(p => p.candidate_id === candidateId);
  };

  const getPendingProposals = () => {
    return proposals.filter(p => p.candidate_response === 'pending');
  };

  return {
    proposals,
    loading,
    createProposal,
    updateProposal,
    deleteProposal,
    getProposalsForCandidate,
    getPendingProposals,
    refetch: fetchProposals,
  };
}
