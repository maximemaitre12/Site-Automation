import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { callAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import PptxGenJS from 'pptxgenjs';
import {
  StyleType,
  applyMasterStyles,
} from '@/lib/pptx-templates';
import { buildPremiumPresentation } from '@/lib/pptx-builder';

export interface PresentationSlide {
  type: 'title' | 'executive_summary' | 'context' | 'problem' | 'solution' | 'benefits' | 'proof' | 'financials' | 'roadmap' | 'risks' | 'team' | 'cta' | 'contact' | 'appendix';
  title: string;
  subtitle?: string;
  content?: string;
  sections?: {
    heading: string;
    points: string[];
  }[];
  bullets?: string[];
  keyMessage?: string;
  notes?: string;
  stats?: { value: string; label: string; subtext?: string }[];
  testimonial?: { quote: string; author: string; company?: string; role?: string };
  timeline?: { phase: string; description: string; duration: string }[];
  comparison?: { before: string[]; after: string[] };
  callouts?: { icon: string; title: string; description: string }[];
}

export interface PresentationData {
  title: string;
  subtitle?: string;
  executiveSummary?: string;
  slides: PresentationSlide[];
}

export interface Presentation {
  id: string;
  user_id: string;
  deal_id?: string;
  title: string;
  client_name?: string;
  product_name?: string;
  objective?: string;
  key_points?: string;
  style: string;
  slide_count: number;
  presentation_json?: PresentationData;
  compliance_status: string;
  compliance_score?: number;
  compliance_issues?: any[];
  created_at: string;
  updated_at: string;
}

export interface GeneratePresentationParams {
  clientName: string;
  productName: string;
  objective: string;
  keyPoints?: string;
  slideCount?: number;
  style?: string;
  dealId?: string;
}

export function usePresentationGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: presentations = [], isLoading } = useQuery({
    queryKey: ['sales-presentations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('sales_presentations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Presentation[];
    }
  });

  const invalidatePresentations = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-presentations'] });
  };

  const generatePresentation = async (params: GeneratePresentationParams): Promise<Presentation | null> => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const slideCount = params.slideCount || 5;
      const style = params.style || 'professional';

      // PROMPT NIVEAU PARTNER McKINSEY - CONTENU ULTRA-DENSE
      const prompt = `Tu es un PARTNER SENIOR chez McKinsey & Company avec 35 ans d'expérience. Tu prépares un deck stratégique pour le COMEX d'un groupe du CAC40.

CONTEXTE DE LA MISSION:
- Client cible: ${params.clientName}
- Notre offre/proposition: ${params.productName}  
- Objectif stratégique: ${params.objective}
- Éléments clés à mettre en avant: ${params.keyPoints || 'Créer de la valeur à long terme'}
- Nombre de slides demandé: ${slideCount}

EXIGENCES McKINSEY - NIVEAU PARTNER:

1. DENSITÉ D'INFORMATION: Chaque slide doit contenir 3-4x plus de contenu qu'une slide normale. Un dirigeant du CAC40 ne veut pas de slides vides.

2. DONNÉES CHIFFRÉES OBLIGATOIRES: 
   - Chaque bullet point DOIT contenir au moins un chiffre (%, €, x fois, années)
   - Les stats doivent être spécifiques et crédibles (ex: "23.4%" pas "environ 20%")
   - Sources implicites (études de marché, analyses internes)

3. STRUCTURE PAR SECTIONS:
   - Chaque slide de contenu doit avoir 2-3 sections avec des headings
   - Chaque section contient 3-5 points détaillés

4. LANGAGE C-LEVEL:
   - Vocabulaire stratégique (synergies, EBITDA, TSR, capex, optionalité)
   - Formulations directes sans fioritures
   - Impact business quantifié

5. MESSAGE CLÉ: Chaque slide a un "keyMessage" en bas qui résume l'insight principal en une phrase.

GÉNÈRE EXACTEMENT ${slideCount} slides en JSON:

{
  "title": "Titre stratégique avec angle différenciant",
  "subtitle": "Sous-titre avec proposition de valeur chiffrée",
  "executiveSummary": "2-3 phrases résumant la recommandation stratégique",
  "slides": [
    {
      "type": "title",
      "title": "Titre principal impactant",
      "subtitle": "Proposition de valeur en une phrase avec chiffre clé",
      "keyMessage": "Synthèse stratégique de l'opportunité"
    },
    {
      "type": "executive_summary",
      "title": "Synthèse Exécutive",
      "sections": [
        {
          "heading": "Contexte et Opportunité",
          "points": [
            "Le marché X représente Y€ avec une croissance de Z% CAGR 2024-2028",
            "Point stratégique avec données chiffrées",
            "Troisième insight avec impact quantifié"
          ]
        },
        {
          "heading": "Notre Recommandation",
          "points": [
            "Action recommandée avec ROI attendu de X%",
            "Deuxième élément de la recommandation avec timeline",
            "Troisième point avec impact P&L"
          ]
        }
      ],
      "keyMessage": "Message synthétique de la recommandation"
    },
    {
      "type": "context|problem",
      "title": "Diagnostic Stratégique: [Sujet Spécifique]",
      "subtitle": "Analyse des forces en présence",
      "sections": [
        {
          "heading": "Dynamiques de Marché",
          "points": [
            "Tendance 1 avec chiffres de marché (taille, croissance, parts)",
            "Tendance 2 avec impact sur les acteurs",
            "Tendance 3 avec projection"
          ]
        },
        {
          "heading": "Position Concurrentielle",
          "points": [
            "Notre position: X% de PDM vs leader à Y%",
            "Gap à combler: détail avec chiffres",
            "Fenêtre d'opportunité: timing et urgence"
          ]
        },
        {
          "heading": "Impératifs Stratégiques",
          "points": [
            "Impératif 1 avec enjeu chiffré",
            "Impératif 2 avec conséquence si inaction",
            "Impératif 3 avec délai"
          ]
        }
      ],
      "keyMessage": "Le statu quo n'est pas une option: [impact chiffré de l'inaction]"
    },
    {
      "type": "solution",
      "title": "Notre Proposition: [Nom de l'Initiative]",
      "subtitle": "Création de valeur estimée à X€ sur Y ans",
      "sections": [
        {
          "heading": "Pilier 1: [Nom]",
          "points": [
            "Action spécifique avec investissement requis",
            "Bénéfice attendu quantifié",
            "Timeline de mise en œuvre"
          ]
        },
        {
          "heading": "Pilier 2: [Nom]",
          "points": [
            "Deuxième axe stratégique détaillé",
            "Synergies attendues en €",
            "KPIs de suivi"
          ]
        }
      ],
      "keyMessage": "Cette approche génère [X€] de valeur avec un risque maîtrisé"
    },
    {
      "type": "proof|financials",
      "title": "Business Case et Création de Valeur",
      "stats": [
        {"value": "+XX%", "label": "Métrique clé", "subtext": "vs situation actuelle ou benchmark"},
        {"value": "X.X€Mds", "label": "Valeur créée", "subtext": "horizon temporel"},
        {"value": "<X ans", "label": "Payback", "subtext": "sur investissement de Y€"},
        {"value": "XX%", "label": "TRI projeté", "subtext": "scénario base"}
      ],
      "testimonial": {
        "quote": "Citation pertinente et spécifique d'un dirigeant crédible",
        "author": "Prénom Nom",
        "role": "Fonction",
        "company": "Entreprise comparable"
      },
      "keyMessage": "Le business case est robuste avec des hypothèses conservatrices"
    },
    {
      "type": "roadmap",
      "title": "Feuille de Route et Prochaines Étapes",
      "timeline": [
        {"phase": "Phase 1: [Nom]", "description": "Actions concrètes à mener", "duration": "M1-M3"},
        {"phase": "Phase 2: [Nom]", "description": "Deuxième vague d'actions", "duration": "M4-M6"},
        {"phase": "Phase 3: [Nom]", "description": "Déploiement à l'échelle", "duration": "M7-M12"}
      ],
      "sections": [
        {
          "heading": "Quick Wins (30 jours)",
          "points": ["Action 1", "Action 2", "Action 3"]
        },
        {
          "heading": "Décisions Requises",
          "points": ["Validation budget de X€", "Nomination équipe projet", "Go/No-go sur [sujet]"]
        }
      ],
      "keyMessage": "Démarrage immédiat recommandé pour capturer la fenêtre d'opportunité"
    },
    {
      "type": "cta",
      "title": "Recommandation et Appel à l'Action",
      "sections": [
        {
          "heading": "Notre Recommandation",
          "points": [
            "Approuver l'initiative avec budget de X€",
            "Lancer la phase 1 dès [date]",
            "Constituer l'équipe projet sous 2 semaines"
          ]
        }
      ],
      "keyMessage": "Chaque mois de retard représente Y€ de valeur non captée",
      "content": "Fenêtre stratégique: les 6 prochains mois sont critiques"
    }
  ]
}

RÈGLES ABSOLUES:
1. EXACTEMENT ${slideCount} slides
2. Chaque slide DOIT avoir un "keyMessage" 
3. Les slides de contenu DOIVENT avoir des "sections" avec "heading" et "points"
4. MINIMUM 8-12 points de contenu par slide (répartis en sections)
5. TOUS les chiffres doivent être réalistes et spécifiques
6. Le slide "proof" DOIT avoir "stats" (4 items) et "testimonial"
7. Vocabulaire: synergies, EBITDA, TSR, capex, quick wins, go-to-market, time-to-value

RÉPONDS UNIQUEMENT avec le JSON valide.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un Partner McKinsey créant des decks stratégiques pour des COMEX du CAC40. Tu génères UNIQUEMENT du JSON valide ultra-dense en contenu. Chaque slide doit impressionner par sa densité et sa rigueur analytique.',
        type: 'generate'
      });

      if (response.error) throw new Error(response.error);

      let presentationData: PresentationData;
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('JSON non trouvé');
        presentationData = JSON.parse(jsonMatch[0]);
        
        if (presentationData.slides.length > slideCount) {
          presentationData.slides = presentationData.slides.slice(0, slideCount);
        }
      } catch (e) {
        console.error('Parse error:', e);
        throw new Error('Erreur de parsing de la présentation générée');
      }

      const { data, error } = await supabase
        .from('sales_presentations')
        .insert({
          user_id: user.id,
          deal_id: params.dealId || null,
          title: presentationData.title,
          client_name: params.clientName,
          product_name: params.productName,
          objective: params.objective,
          key_points: params.keyPoints,
          style: style,
          slide_count: presentationData.slides.length,
          presentation_json: presentationData as any,
          compliance_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      invalidatePresentations();
      toast({
        title: 'Présentation générée',
        description: `${presentationData.slides.length} slides stratégiques créés`
      });

      return data as unknown as Presentation;
    } catch (error: any) {
      console.error('Error generating presentation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de générer la présentation',
        variant: 'destructive'
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const downloadPPTX = async (presentation: Presentation) => {
    if (!presentation.presentation_json) {
      toast({ title: 'Erreur', description: 'Données de présentation manquantes', variant: 'destructive' });
      return;
    }

    try {
      const pptx = new PptxGenJS();
      const styleKey = (presentation.style || 'professional') as StyleType;
      const colors = applyMasterStyles(pptx, styleKey);
      
      pptx.title = presentation.title;
      pptx.subject = `Présentation stratégique pour ${presentation.client_name}`;
      pptx.author = 'AETHER Sales Intelligence';

      const data = presentation.presentation_json as PresentationData;
      
      // Use the premium builder
      buildPremiumPresentation(pptx, colors, data, presentation.client_name || '');

      const fileName = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pptx`;
      await pptx.writeFile({ fileName });

      toast({
        title: 'Téléchargement réussi',
        description: `Présentation stratégique téléchargée`
      });
    } catch (error: any) {
      console.error('Error generating PPTX:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le fichier PowerPoint',
        variant: 'destructive'
      });
    }
  };

  const deletePresentation = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_presentations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      invalidatePresentations();
      toast({ title: 'Présentation supprimée' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const updatePresentationCompliance = async (
    id: string, 
    status: string, 
    score?: number, 
    issues?: any[]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_presentations')
        .update({
          compliance_status: status,
          compliance_score: score,
          compliance_issues: issues as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      invalidatePresentations();
      return true;
    } catch (error) {
      console.error('Error updating compliance:', error);
      return false;
    }
  };

  return {
    presentations,
    loading: isLoading,
    generating,
    generatePresentation,
    downloadPPTX,
    deletePresentation,
    updatePresentationCompliance,
    invalidatePresentations
  };
}
