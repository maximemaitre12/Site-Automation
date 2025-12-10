import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface Candidate {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cv_url: string | null;
  cv_text: string | null;
  skills: any;
  experience_years: number | null;
  match_score: number | null;
  status: string | null;
  interview_notes: string | null;
  ai_analysis: any;
  job_id: string | null;
  created_at: string;
  description?: string | null;
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  department: string | null;
  salary_range: string | null;
  skills: any;
  requirements: any;
  is_active: boolean | null;
  created_at: string;
}

export function useHR() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setCandidates([]);
      setJobs([]);
      setLoading(false);
      return;
    }
    
    const [candidatesRes, jobsRes] = await Promise.all([
      supabase.from('candidates').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('job_descriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    if (!candidatesRes.error) {
      setCandidates(candidatesRes.data || []);
    }
    if (!jobsRes.error) {
      setJobs(jobsRes.data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const createCandidate = async (data: {
    name: string;
    email?: string;
    phone?: string;
    cvText?: string;
    skills?: string[];
    experience_years?: number;
    match_score?: number;
    ai_analysis?: any;
  }): Promise<Candidate | null> => {
    if (!user) return null;

    try {
      // If we have AI analysis data, create as 'new' with score visible
      // User will need to validate the score to move to 'analyzed'
      const { data: candidate, error } = await supabase
        .from('candidates')
        .insert({
          user_id: user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          cv_text: data.cvText,
          skills: data.skills || [],
          experience_years: data.experience_years || null,
          match_score: data.match_score || null,
          ai_analysis: data.ai_analysis || null,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchData();
      return candidate;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout', variant: 'destructive' });
      return null;
    }
  };

  const updateCandidate = async (candidateId: string, updates: Partial<Candidate>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la mise à jour', variant: 'destructive' });
      return false;
    }
  };

  const validateScore = async (candidateId: string, score: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          match_score: score,
          status: 'analyzed'
        })
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Score validé, candidat passé en "Analysé"' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la validation', variant: 'destructive' });
      return false;
    }
  };

  const activateCandidate = async (candidateId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          status: 'active'
        })
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Candidat validé et passé en "Actif"' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'activation', variant: 'destructive' });
      return false;
    }
  };

  const linkToJob = async (candidateId: string, jobId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('candidates')
        .update({ job_id: jobId })
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Candidat relié au poste' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la liaison', variant: 'destructive' });
      return false;
    }
  };

  const updateDescription = async (candidateId: string, description: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Store description in ai_analysis.description field
      const candidate = candidates.find(c => c.id === candidateId);
      const currentAnalysis = candidate?.ai_analysis || {};
      
      const { error } = await supabase
        .from('candidates')
        .update({
          ai_analysis: { ...currentAnalysis, user_description: description }
        })
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Description mise à jour' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la mise à jour', variant: 'destructive' });
      return false;
    }
  };

  const addInterviewNotes = async (candidateId: string, notes: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const candidate = candidates.find(c => c.id === candidateId);
      const existingNotes = candidate?.interview_notes || '';
      const timestamp = new Date().toLocaleString('fr-FR');
      const newNotes = existingNotes 
        ? `${existingNotes}\n\n--- ${timestamp} ---\n${notes}`
        : `--- ${timestamp} ---\n${notes}`;

      const { error } = await supabase
        .from('candidates')
        .update({ interview_notes: newNotes })
        .eq('id', candidateId);

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Notes d\'entretien ajoutées' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout des notes', variant: 'destructive' });
      return false;
    }
  };

  const analyzeCandidate = async (candidateId: string, cvText: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse ce CV et extrais les informations en JSON:
{
  "skills": ["compétence1", "compétence2"],
  "experience_years": number,
  "summary": "résumé du profil",
  "strengths": ["force1", "force2"],
  "concerns": ["point d'attention"],
  "recommended_roles": ["poste1", "poste2"]
}

CV:
${cvText}`
        }],
        type: 'analyze'
      });

      let analysis: any = {};
      try {
        analysis = JSON.parse(response.content);
      } catch {
        analysis = { summary: response.content };
      }

      await supabase
        .from('candidates')
        .update({
          skills: analysis.skills || [],
          experience_years: analysis.experience_years,
          ai_analysis: analysis,
          status: 'analyzed'
        })
        .eq('id', candidateId);

      await fetchData();
      toast({ title: 'Succès', description: 'CV analysé' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return false;
    }
  };

  const matchCandidateToJob = async (candidateId: string, jobId: string): Promise<number | null> => {
    if (!user) return null;

    const candidate = candidates.find(c => c.id === candidateId);
    const job = jobs.find(j => j.id === jobId);
    if (!candidate || !job) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Évalue la correspondance entre ce candidat et ce poste. Réponds en JSON:
{
  "score": number (0-100),
  "match_reasons": ["raison1"],
  "gaps": ["écart1"],
  "recommendation": "recommandation"
}

Candidat:
- Nom: ${candidate.name}
- Compétences: ${JSON.stringify(candidate.skills || [])}
- Expérience: ${candidate.experience_years || 'N/A'} ans
- Analyse: ${JSON.stringify(candidate.ai_analysis || {})}

Poste:
- Titre: ${job.title}
- Description: ${job.description}
- Compétences requises: ${JSON.stringify(job.skills || [])}
- Exigences: ${JSON.stringify(job.requirements || [])}`
        }],
        type: 'analyze'
      });

      let result: any = {};
      try {
        result = JSON.parse(response.content);
      } catch {}

      const score = result.score || 50;

      await supabase
        .from('candidates')
        .update({
          match_score: score,
          job_id: jobId,
          ai_analysis: { ...candidate.ai_analysis, job_match: result }
        })
        .eq('id', candidateId);

      await fetchData();
      toast({ title: 'Succès', description: `Score de matching: ${score}%` });
      return score;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors du matching', variant: 'destructive' });
      return null;
    }
  };

  const createJob = async (data: {
    title: string;
    description?: string;
    department?: string;
    salaryRange?: string;
    skills?: string[];
    requirements?: string[];
  }): Promise<JobDescription | null> => {
    if (!user) return null;

    try {
      const { data: job, error } = await supabase
        .from('job_descriptions')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          department: data.department,
          salary_range: data.salaryRange,
          skills: data.skills || [],
          requirements: data.requirements || [],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Poste créé' });
      return job;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la création', variant: 'destructive' });
      return null;
    }
  };

  const generateJobPost = async (requirements: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Génère une offre d'emploi professionnelle et attractive en français basée sur ces besoins:
${requirements}

Inclus: titre accrocheur, présentation entreprise, missions, profil recherché, avantages, processus de candidature.`
        }],
        type: 'generate'
      });

      toast({ title: 'Succès', description: 'Offre générée' });
      return response.content;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  const analyzeInterview = async (candidateId: string, notes: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse ces notes d'entretien et fournis une évaluation structurée:
- Points forts observés
- Points d'attention
- Recommandation (embaucher/ne pas embaucher/à revoir)
- Score global /100

Notes d'entretien:
${notes}`
        }],
        type: 'analyze'
      });

      await supabase
        .from('candidates')
        .update({ interview_notes: notes + '\n\n--- Analyse IA ---\n' + response.content })
        .eq('id', candidateId);

      await fetchData();
      toast({ title: 'Succès', description: 'Entretien analysé' });
      return response.content;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return null;
    }
  };

  const deleteCandidate = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('candidates').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchData();
    toast({ title: 'Succès', description: 'Candidat supprimé' });
    return true;
  };

  return {
    candidates,
    jobs,
    loading,
    createCandidate,
    updateCandidate,
    validateScore,
    activateCandidate,
    linkToJob,
    updateDescription,
    addInterviewNotes,
    analyzeCandidate,
    matchCandidateToJob,
    createJob,
    generateJobPost,
    analyzeInterview,
    deleteCandidate,
    refreshData: fetchData
  };
}
