import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface NegotiationSheet {
  id: string;
  user_id: string;
  deal_id: string | null;
  title: string;
  company_context: string | null;
  contact_context: string | null;
  current_situation: string | null;
  key_arguments: string[];
  anticipated_objections: string[];
  counter_arguments: string[];
  price_justification: string | null;
  competitive_advantages: string[];
  closing_strategies: string[];
  next_steps: string[];
  follow_up_date: string | null;
  follow_up_notes: string | null;
  negotiation_status: string;
  created_at: string;
  updated_at: string;
}

export function useNegotiationSheets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sheets = [], isLoading } = useQuery({
    queryKey: ['negotiation-sheets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('negotiation_sheets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as NegotiationSheet[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['negotiation-sheets', user?.id] });
  }, [queryClient, user?.id]);

  const generateNegotiationSheet = async (params: {
    dealId: string;
    dealTitle: string;
    companyName: string;
    contactName: string;
    value: number;
    currentSituation: string;
    product?: string;
  }): Promise<NegotiationSheet | null> => {
    if (!user) return null;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Tu es un expert en négociation commerciale. Génère une fiche de négociation complète et actionnable.

CONTEXTE:
- Deal: ${params.dealTitle}
- Entreprise: ${params.companyName}
- Contact: ${params.contactName}
- Valeur: ${params.value}€
- Produit/Service: ${params.product || 'Non spécifié'}
- Situation: ${params.currentSituation}

RÈGLES:
- Écrire comme un humain, pas comme une IA
- Pas de markdown, pas d'astérisques
- Arguments concrets et personnalisés
- Réponses directes et actionnables

Réponds en JSON strict:
{
  "key_arguments": ["argument1", "argument2", "argument3"],
  "anticipated_objections": ["objection1", "objection2", "objection3"],
  "counter_arguments": ["contre-argument1", "contre-argument2", "contre-argument3"],
  "price_justification": "justification du prix en 2-3 phrases",
  "competitive_advantages": ["avantage1", "avantage2", "avantage3"],
  "closing_strategies": ["stratégie1", "stratégie2"],
  "next_steps": ["étape1", "étape2", "étape3"]
}`
        }],
        type: 'generate'
      });

      let parsed: any = {};
      try {
        let content = response.content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) content = jsonMatch[1].trim();
        parsed = JSON.parse(content);
      } catch {
        parsed = {
          key_arguments: ['Valeur ajoutée claire', 'ROI démontrable', 'Support dédié'],
          anticipated_objections: ['Prix trop élevé', 'Besoin de réfléchir', 'Concurrence moins chère'],
          counter_arguments: ['Qualité supérieure', 'Économies long terme', 'Références clients'],
          price_justification: 'Notre prix reflète la qualité et le support inclus.',
          competitive_advantages: ['Expertise reconnue', 'Service personnalisé'],
          closing_strategies: ['Offre limitée dans le temps', 'Démonstration des bénéfices'],
          next_steps: ['Planifier un call de suivi', 'Envoyer proposition détaillée']
        };
      }

      const { data: sheet, error } = await supabase
        .from('negotiation_sheets')
        .insert({
          user_id: user.id,
          deal_id: params.dealId,
          title: `Fiche - ${params.dealTitle}`,
          company_context: params.companyName,
          contact_context: params.contactName,
          current_situation: params.currentSituation,
          key_arguments: parsed.key_arguments || [],
          anticipated_objections: parsed.anticipated_objections || [],
          counter_arguments: parsed.counter_arguments || [],
          price_justification: parsed.price_justification || '',
          competitive_advantages: parsed.competitive_advantages || [],
          closing_strategies: parsed.closing_strategies || [],
          next_steps: parsed.next_steps || [],
          negotiation_status: 'preparation'
        })
        .select()
        .single();

      if (error) throw error;
      
      invalidate();
      toast({ title: 'Fiche créée', description: 'Fiche de négociation générée avec succès' });
      return sheet as NegotiationSheet;
    } catch (err) {
      console.error('Error generating sheet:', err);
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return null;
    }
  };

  const updateSheet = async (id: string, updates: Partial<NegotiationSheet>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('negotiation_sheets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      invalidate();
      return data as NegotiationSheet;
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
      return null;
    }
  };

  const deleteSheet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('negotiation_sheets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      invalidate();
      toast({ title: 'Supprimé' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const getSheetsByDeal = (dealId: string) => {
    return sheets.filter(s => s.deal_id === dealId);
  };

  return {
    sheets,
    loading: isLoading,
    generateNegotiationSheet,
    updateSheet,
    deleteSheet,
    getSheetsByDeal,
    refresh: invalidate
  };
}
