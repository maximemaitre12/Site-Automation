import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Interview {
  id: string;
  user_id: string;
  candidate_id: string;
  scheduled_at: string;
  duration_minutes: number;
  interview_type: 'video' | 'phone' | 'in_person';
  location: string | null;
  interviewers: string[];
  ai_suggested_questions: {
    technical?: string[];
    behavioral?: string[];
    experience?: string[];
    motivation?: string[];
    specific?: string[];
  };
  notes: string | null;
  outcome: 'passed' | 'failed' | 'pending' | null;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  candidate?: {
    id: string;
    name: string;
    email: string | null;
    job_id: string | null;
  };
}

export interface CreateInterviewData {
  candidate_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  interview_type?: 'video' | 'phone' | 'in_person';
  location?: string;
  interviewers?: string[];
  ai_suggested_questions?: Interview['ai_suggested_questions'];
}

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInterviews = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('candidate_interviews')
        .select(`
          *,
          candidate:candidates(id, name, email, job_id)
        `)
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      setInterviews((data || []).map(item => ({
        ...item,
        interviewers: item.interviewers as string[] || [],
        ai_suggested_questions: item.ai_suggested_questions as Interview['ai_suggested_questions'] || {},
        interview_type: item.interview_type as Interview['interview_type'],
        outcome: item.outcome as Interview['outcome'],
        status: item.status as Interview['status'],
      })));
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const createInterview = async (data: CreateInterviewData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: newInterview, error } = await supabase
        .from('candidate_interviews')
        .insert({
          user_id: user.id,
          candidate_id: data.candidate_id,
          scheduled_at: data.scheduled_at,
          duration_minutes: data.duration_minutes || 60,
          interview_type: data.interview_type || 'video',
          location: data.location,
          interviewers: data.interviewers || [],
          ai_suggested_questions: data.ai_suggested_questions || {},
        })
        .select()
        .single();

      if (error) throw error;

      await fetchInterviews();
      toast({
        title: "Entretien planifié",
        description: "L'entretien a été ajouté au calendrier",
      });

      return newInterview;
    } catch (error) {
      console.error('Error creating interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de planifier l'entretien",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const { error } = await supabase
        .from('candidate_interviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchInterviews();
      toast({
        title: "Entretien mis à jour",
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'entretien",
        variant: "destructive",
      });
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidate_interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchInterviews();
      toast({
        title: "Entretien supprimé",
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entretien",
        variant: "destructive",
      });
    }
  };

  const getInterviewsForCandidate = (candidateId: string) => {
    return interviews.filter(i => i.candidate_id === candidateId);
  };

  const getUpcomingInterviews = () => {
    const now = new Date().toISOString();
    return interviews.filter(i => i.scheduled_at > now && i.status !== 'cancelled');
  };

  return {
    interviews,
    loading,
    createInterview,
    updateInterview,
    deleteInterview,
    getInterviewsForCandidate,
    getUpcomingInterviews,
    refetch: fetchInterviews,
  };
}
