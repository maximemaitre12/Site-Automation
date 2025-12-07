import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface SalesProposal {
  id: string;
  user_id: string;
  title: string;
  prospect_name: string | null;
  product_name: string | null;
  persona: string | null;
  objections: string | null;
  generated_proposal: string | null;
  email_draft: string | null;
  prospect_score: number | null;
  score_justification: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallAnalysis {
  id: string;
  user_id: string;
  title: string;
  transcript: string | null;
  summary: string | null;
  sentiment: string | null;
  key_points: any;
  objections: any;
  next_steps: any;
  created_at: string;
}

export function useSalesProposals() {
  const [proposals, setProposals] = useState<SalesProposal[]>([]);
  const [callAnalyses, setCallAnalyses] = useState<CallAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!user) return;
    
    const [proposalsRes, callsRes] = await Promise.all([
      supabase.from('sales_proposals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('call_analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    if (!proposalsRes.error) setProposals(proposalsRes.data || []);
    if (!callsRes.error) setCallAnalyses(callsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const generateProposal = async (data: {
    prospectName: string;
    productName: string;
    persona: string;
    objections: string;
  }): Promise<SalesProposal | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Génère une proposition commerciale professionnelle en français:
Client: ${data.prospectName}
Produit: ${data.productName}
Persona/Contact: ${data.persona}
Objections potentielles: ${data.objections}

Génère une proposition structurée avec: introduction, valeur ajoutée, réponse aux objections, call-to-action.`
        }],
        type: 'generate'
      });

      const scoreResponse = await callAI({
        messages: [{
          role: 'user',
          content: `Évalue ce prospect sur 100 et justifie. Réponds en JSON: {"score": number, "justification": string}
Client: ${data.prospectName}, Produit: ${data.productName}, Objections: ${data.objections}`
        }],
        type: 'analyze'
      });

      let score = 70;
      let justification = '';
      try {
        const parsed = JSON.parse(scoreResponse.content);
        score = parsed.score || 70;
        justification = parsed.justification || '';
      } catch {}

      const { data: proposal, error } = await supabase
        .from('sales_proposals')
        .insert({
          user_id: user.id,
          title: `Proposition - ${data.prospectName}`,
          prospect_name: data.prospectName,
          product_name: data.productName,
          persona: data.persona,
          objections: data.objections,
          generated_proposal: response.content,
          prospect_score: score,
          score_justification: justification
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Proposition générée' });
      return proposal;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  const analyzeCall = async (title: string, transcript: string): Promise<CallAnalysis | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse cet appel commercial. Réponds en JSON:
{
  "summary": "résumé en 3-4 phrases",
  "sentiment": "positif/neutre/négatif",
  "key_points": ["point1", "point2"],
  "objections": ["objection1"],
  "next_steps": ["action1", "action2"]
}

Transcript:
${transcript}`
        }],
        type: 'analyze'
      });

      let parsed: any = {};
      try {
        // Handle markdown-wrapped JSON responses
        let jsonContent = response.content;
        const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1].trim();
        }
        parsed = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        parsed = { summary: response.content };
      }

      const { data: analysis, error } = await supabase
        .from('call_analyses')
        .insert({
          user_id: user.id,
          title,
          transcript,
          summary: parsed.summary || '',
          sentiment: parsed.sentiment || 'neutre',
          key_points: parsed.key_points || [],
          objections: parsed.objections || [],
          next_steps: parsed.next_steps || []
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Appel analysé' });
      return analysis;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return null;
    }
  };

  const generateEmail = async (proposalId: string, type: string, tone: string, context: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Génère un email commercial en français:
Type: ${type}
Ton: ${tone}
Contexte: ${context}

Génère un email professionnel avec objet, corps et signature.`
        }],
        type: 'generate'
      });

      if (proposalId) {
        await supabase
          .from('sales_proposals')
          .update({ email_draft: response.content })
          .eq('id', proposalId);
      }

      toast({ title: 'Succès', description: 'Email généré' });
      return response.content;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  return {
    proposals,
    callAnalyses,
    loading,
    generateProposal,
    analyzeCall,
    generateEmail,
    refreshData: fetchData
  };
}
