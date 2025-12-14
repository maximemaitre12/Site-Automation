import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  deal_id: string | null;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ['sales-proposals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('sales_proposals')
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

  const { data: callAnalyses = [], isLoading: callsLoading } = useQuery({
    queryKey: ['call-analyses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('call_analyses')
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

  const loading = proposalsLoading || callsLoading;

  const invalidateSales = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales-proposals', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['call-analyses', user?.id] });
  }, [queryClient, user?.id]);

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
          content: `Tu es un commercial senior expert. Génère une proposition commerciale NATURELLE et HUMAINE en français.

RÈGLES STRICTES:
- INTERDIT d'utiliser des astérisques (*), des étoiles, du markdown, des titres avec #
- Écrire comme un humain, pas comme une IA
- Phrases courtes et percutantes
- Pas de longs paragraphes ennuyeux
- Aller droit au but
- Ton professionnel mais chaleureux

Client: ${data.prospectName}
Produit: ${data.productName}
Contact: ${data.persona}
Objections potentielles: ${data.objections}

Réponds en JSON avec cette structure exacte (sans markdown autour):
{
  "accroche": "Une phrase d'accroche percutante personnalisée",
  "probleme": "Le problème principal du client en 1-2 phrases",
  "solution": "Comment notre solution résout ce problème en 2-3 phrases",
  "benefices": ["Bénéfice concret 1", "Bénéfice concret 2", "Bénéfice concret 3"],
  "preuves": "Chiffres ou témoignages courts",
  "objection_reponse": "Réponse à la principale objection",
  "prochaine_etape": "Une action concrète simple",
  "email_court": "Un email de 4-5 lignes max, direct et humain"
}`
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
      
      invalidateSales();
      toast({ title: 'Succès', description: 'Proposition générée' });
      return proposal;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  const analyzeCall = async (title: string, transcript: string, dealId?: string): Promise<CallAnalysis | null> => {
    if (!user) return null;

    try {
      const currentYear = new Date().getFullYear();
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse cet appel commercial. Nous sommes en ${currentYear}. Réponds UNIQUEMENT en JSON valide:
{
  "summary": "résumé concis en 2-3 phrases",
  "sentiment": "positif" ou "neutre" ou "négatif",
  "key_points": ["point clé 1", "point clé 2"],
  "objections": ["objection soulevée"],
  "next_steps": ["prochaine action"],
  "mentioned_date": "YYYY-MM-DD ou null si aucune date de signature/décision mentionnée",
  "budget_mentioned": nombre ou null,
  "decision_maker_identified": true ou false
}

IMPORTANT: Si une date de signature, décision ou closing est mentionnée (ex: "en mars", "fin février", "le 15"), convertis-la en format YYYY-MM-DD. Pour "mars" sans jour précis, utilise le 15 du mois.

Transcript:
${transcript}`
        }],
        type: 'analyze'
      });

      let parsed: any = {};
      try {
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
          deal_id: dealId || null,
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

      // Update deal with last activity, probability, and notes if dealId is provided
      if (dealId) {
        // Get current deal to update probability based on sentiment
        const { data: currentDeal } = await supabase
          .from('sales_deals')
          .select('probability, custom_fields')
          .eq('id', dealId)
          .single();

        // Calculate new probability based on call sentiment
        let probabilityChange = 0;
        const sentiment = (parsed.sentiment || 'neutre').toLowerCase();
        if (sentiment === 'positif' || sentiment === 'positive' || sentiment === 'très positif') {
          probabilityChange = 10;
        } else if (sentiment === 'négatif' || sentiment === 'negative' || sentiment === 'très négatif') {
          probabilityChange = -10;
        }

        const currentProbability = currentDeal?.probability || 50;
        const newProbability = Math.max(0, Math.min(100, currentProbability + probabilityChange));

        // Merge with existing custom_fields
        const existingCustomFields = (currentDeal?.custom_fields as Record<string, unknown>) || {};
        const existingNotes = (existingCustomFields.call_notes as string[]) || [];
        const noteContent = `[${new Date().toLocaleDateString('fr-FR')}] ${parsed.summary || title}`;
        
        const updatedCustomFields = {
          ...existingCustomFields,
          last_call_date: new Date().toISOString(),
          last_call_summary: parsed.summary,
          last_call_sentiment: parsed.sentiment,
          last_call_next_steps: parsed.next_steps,
          last_call_objections: parsed.objections,
          budget_mentioned: parsed.budget_mentioned,
          decision_maker_identified: parsed.decision_maker_identified,
          call_notes: [noteContent, ...existingNotes]
        };

        // Build update object
        const updateData: Record<string, unknown> = {
          last_activity_at: new Date().toISOString(),
          probability: newProbability,
          custom_fields: updatedCustomFields
        };

        // Update expected_close_date if a date was mentioned in the call
        if (parsed.mentioned_date) {
          updateData.expected_close_date = parsed.mentioned_date;
        }

        // Update value if budget was mentioned
        if (parsed.budget_mentioned && typeof parsed.budget_mentioned === 'number') {
          updateData.value = parsed.budget_mentioned;
        }

        const { error: updateError } = await supabase
          .from('sales_deals')
          .update(updateData)
          .eq('id', dealId);

        if (updateError) {
          console.error('Error updating deal:', updateError);
        }

        // Invalidate deals query to refresh pipeline
        queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      }
      
      invalidateSales();
      toast({ title: 'Succès', description: dealId ? 'Appel analysé et deal mis à jour' : 'Appel analysé' });
      return analysis;
    } catch (err) {
      console.error('Analyze call error:', err);
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
    refreshData: invalidateSales
  };
}
