import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { callAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import PptxGenJS from 'pptxgenjs';
import { repairPresentationJson, tryCompleteJSON } from '@/lib/pptx-repair';
import {
  applyFuturisticStyles,
  buildTitleSlide,
  buildSectionSlide,
  buildProofSlide,
  buildRoadmapSlide,
  buildCTASlide,
  type FuturisticStyle,
  type FuturisticPalette,
} from '@/lib/pptx-futuristic';

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

  // Generate a presentation with compliance feedback loop
  const generatePresentation = async (
    params: GeneratePresentationParams,
    complianceFeedback?: { issues: any[]; attempt: number }
  ): Promise<Presentation | null> => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const slideCount = params.slideCount || 5;
      const style = params.style || 'professional';
      const attemptNum = complianceFeedback?.attempt || 1;

      // Build compliance correction instructions if this is a retry
      let complianceCorrections = '';
      if (complianceFeedback && complianceFeedback.issues.length > 0) {
        complianceCorrections = `
⚠️ CORRECTIONS OBLIGATOIRES - TENTATIVE ${attemptNum}:
La version précédente a été REJETÉE pour les raisons suivantes. Tu DOIS corriger TOUS ces problèmes:

${complianceFeedback.issues.map((issue, i) => `
${i + 1}. [${issue.severity?.toUpperCase() || 'WARNING'}] ${issue.message}
   → Correction requise: ${issue.suggestion || 'Reformuler de manière plus factuelle et mesurée'}
`).join('')}

RÈGLES DE CONFORMITÉ STRICTES:
- PAS de superlatifs ("le meilleur", "leader mondial", "incontesté", "sans égal")
- PAS de promesses non vérifiables ("100% garanti", "résultats instantanés")
- Toutes les projections financières doivent être présentées comme des "objectifs" ou "estimations"
- Inclure les hypothèses et risques pour chaque projection majeure
- Ton factuel et analytique, pas conquérant ou agressif
- Éviter les tactiques de peur ("dernière chance", "risque de marginalisation")
`;
      }

      // PROMPT NIVEAU PARTNER McKINSEY - CONTENU ULTRA-DENSE ET CONFORME
      const prompt = `Tu es un PARTNER SENIOR chez McKinsey & Company avec 35 ans d'expérience. Tu prépares un deck stratégique pour le COMEX d'un groupe du CAC40.

CONTEXTE DE LA MISSION:
- Client cible: ${params.clientName}
- Notre offre/proposition: ${params.productName}  
- Objectif stratégique: ${params.objective}
- Éléments clés à mettre en avant: ${params.keyPoints || 'Créer de la valeur à long terme'}
- Nombre de slides demandé: ${slideCount}
${complianceCorrections}

EXIGENCES McKINSEY - NIVEAU PARTNER:

1. DENSITÉ D'INFORMATION: Chaque slide doit contenir 3-4x plus de contenu qu'une slide normale. Un dirigeant du CAC40 ne veut pas de slides vides.

2. DONNÉES CHIFFRÉES OBLIGATOIRES: 
   - Chaque bullet point DOIT contenir au moins un chiffre (%, €, x fois, années)
   - Les stats doivent être spécifiques et crédibles (ex: "23.4%" pas "environ 20%")
   - PRÉSENTER les chiffres comme des "estimations" ou "objectifs cibles" avec hypothèses

3. STRUCTURE PAR SECTIONS:
   - Chaque slide de contenu doit avoir 2-3 sections avec des headings
   - Chaque section contient 3-5 points détaillés

4. LANGAGE C-LEVEL PROFESSIONNEL:
   - Vocabulaire stratégique (synergies, EBITDA, TSR, capex, optionalité)
   - Formulations directes mais FACTUELLES et MESURÉES
   - Impact business quantifié avec HYPOTHÈSES mentionnées
   - ÉVITER: superlatifs, promesses absolues, ton conquérant

5. MESSAGE CLÉ: Chaque slide a un "keyMessage" en bas qui résume l'insight principal en une phrase FACTUELLE.

6. CONFORMITÉ STRICTE:
   - Jamais "leader mondial", "le meilleur", "incontesté", "sans égal"
   - Projections = "objectif cible", "estimation base case", "hypothèse de travail"
   - Inclure les risques et conditions de réalisation
   - Ton analytique et objectif, pas marketing

GÉNÈRE EXACTEMENT ${slideCount} slides en JSON:

{
  "title": "Titre stratégique factuel",
  "subtitle": "Sous-titre avec proposition de valeur (objectif: X€ de synergies)",
  "executiveSummary": "2-3 phrases résumant la recommandation stratégique de manière factuelle",
  "slides": [
    {
      "type": "title",
      "title": "Titre principal impactant mais factuel",
      "subtitle": "Proposition de valeur avec objectif chiffré et hypothèses",
      "keyMessage": "Synthèse stratégique factuelle de l'opportunité"
    },
    {
      "type": "executive_summary",
      "title": "Synthèse Exécutive",
      "sections": [
        {
          "heading": "Contexte et Opportunité",
          "points": [
            "Le marché X représente Y€ avec une croissance estimée de Z% CAGR 2024-2028 (source: [analyse interne])",
            "Point stratégique avec données et hypothèses",
            "Insight avec impact quantifié et conditions de réalisation"
          ]
        },
        {
          "heading": "Notre Recommandation",
          "points": [
            "Action recommandée avec ROI cible de X% (scénario base)",
            "Deuxième élément avec timeline estimée",
            "Troisième point avec impact P&L projeté"
          ]
        }
      ],
      "keyMessage": "Message factuel de la recommandation avec conditions clés"
    },
    {
      "type": "context",
      "title": "Diagnostic Stratégique: [Sujet Spécifique]",
      "subtitle": "Analyse des dynamiques de marché",
      "sections": [
        {
          "heading": "Dynamiques de Marché",
          "points": [
            "Tendance 1 avec chiffres de marché vérifiables",
            "Tendance 2 avec impact analysé",
            "Tendance 3 avec projection et hypothèses"
          ]
        },
        {
          "heading": "Position Concurrentielle",
          "points": [
            "Position actuelle: X% de PDM estimée",
            "Écart à combler: analyse factuelle",
            "Fenêtre d'opportunité: timing et facteurs clés"
          ]
        },
        {
          "heading": "Enjeux Stratégiques",
          "points": [
            "Enjeu 1 avec impact quantifié",
            "Enjeu 2 avec analyse risque/opportunité",
            "Enjeu 3 avec délai et conditions"
          ]
        }
      ],
      "keyMessage": "Analyse factuelle des enjeux et opportunités"
    },
    {
      "type": "solution",
      "title": "Notre Proposition: [Nom de l'Initiative]",
      "subtitle": "Création de valeur estimée à X€ sur Y ans (scénario base)",
      "sections": [
        {
          "heading": "Pilier 1: [Nom]",
          "points": [
            "Action spécifique avec investissement estimé",
            "Bénéfice attendu quantifié (hypothèses: ...)",
            "Timeline de mise en œuvre prévue"
          ]
        },
        {
          "heading": "Pilier 2: [Nom]",
          "points": [
            "Deuxième axe stratégique détaillé",
            "Synergies estimées en € avec conditions de réalisation",
            "KPIs de suivi proposés"
          ]
        },
        {
          "heading": "Risques et Mitigations",
          "points": [
            "Risque d'exécution principal et plan de mitigation",
            "Risque réglementaire/politique et approche",
            "Risque d'intégration et gouvernance proposée"
          ]
        }
      ],
      "keyMessage": "Cette approche vise [X€] de valeur avec un profil risque/rendement maîtrisé"
    },
    {
      "type": "proof",
      "title": "Business Case et Création de Valeur",
      "stats": [
        {"value": "+XX%", "label": "Métrique clé (cible)", "subtext": "vs situation actuelle - scénario base"},
        {"value": "X.X€Mds", "label": "Valeur estimée", "subtext": "horizon Y ans - hypothèse H1"},
        {"value": "~X ans", "label": "Payback estimé", "subtext": "sur investissement de Y€"},
        {"value": "XX%", "label": "TRI cible", "subtext": "scénario base - sensibilité ±5%"}
      ],
      "sections": [
        {
          "heading": "Hypothèses Clés",
          "points": [
            "Hypothèse 1: [description et source]",
            "Hypothèse 2: [description et sensibilité]",
            "Hypothèse 3: [description et risque associé]"
          ]
        }
      ],
      "keyMessage": "Le business case repose sur des hypothèses conservatrices avec marge de sécurité"
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
        },
        {
          "heading": "Points de Vigilance",
          "points": ["Risque à surveiller 1", "Condition de succès 2", "Dépendance externe 3"]
        }
      ],
      "keyMessage": "Démarrage recommandé pour optimiser la fenêtre d'opportunité identifiée"
    }
  ]
}

RÈGLES ABSOLUES:
1. EXACTEMENT ${slideCount} slides
2. Chaque slide DOIT avoir un "keyMessage" FACTUEL (pas de superlatifs)
3. Les slides de contenu DOIVENT avoir des "sections" avec "heading" et "points"
4. MINIMUM 8-12 points de contenu par slide (répartis en sections)
5. TOUS les chiffres = "estimation", "cible", "objectif" avec hypothèses
6. Le slide "proof" DOIT avoir "stats" (4 items) ET une section "Hypothèses Clés"
7. JAMAIS: "leader mondial", "le meilleur", "incontesté", "100% garanti", "sans risque"
8. TOUJOURS: ton analytique, projections conditionnelles, risques mentionnés

RÉPONDS UNIQUEMENT avec le JSON valide.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un Partner McKinsey créant des decks stratégiques conformes pour des COMEX du CAC40. Tu génères UNIQUEMENT du JSON valide ultra-dense mais FACTUEL et MESURÉ. Aucun superlatif, projections toujours conditionnelles.',
        type: 'generate'
      });

      if (response.error) throw new Error(response.error);

      let presentationData: PresentationData;
      try {
        let jsonString = response.content;
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('JSON non trouvé');
        
        jsonString = tryCompleteJSON(jsonMatch[0]);
        
        const rawData = JSON.parse(jsonString);
        presentationData = repairPresentationJson(rawData, slideCount);
        
        console.log(`Generated ${presentationData.slides.length} slides (requested: ${slideCount}), attempt: ${attemptNum}`);
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
        title: attemptNum > 1 ? 'Présentation corrigée' : 'Présentation générée',
        description: `${presentationData.slides.length} slides stratégiques créés${attemptNum > 1 ? ` (tentative ${attemptNum})` : ''}`
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

  // Generate with auto-compliance loop (max 3 attempts)
  const generateWithCompliance = async (
    params: GeneratePresentationParams,
    checkComplianceFn: (content: string, type: string, id?: string) => Promise<any>,
    updateComplianceFn: (id: string, status: string, score?: number, issues?: any[]) => Promise<boolean>,
    maxAttempts: number = 3
  ): Promise<{ presentation: Presentation | null; complianceResult: any }> => {
    let attempt = 1;
    let presentation: Presentation | null = null;
    let complianceResult: any = null;
    let previousIssues: any[] = [];

    while (attempt <= maxAttempts) {
      // Generate (with feedback from previous attempt if any)
      presentation = await generatePresentation(
        params,
        attempt > 1 ? { issues: previousIssues, attempt } : undefined
      );

      if (!presentation || !presentation.presentation_json) {
        return { presentation: null, complianceResult: null };
      }

      // Check compliance
      const contentToCheck = JSON.stringify(presentation.presentation_json);
      complianceResult = await checkComplianceFn(contentToCheck, 'presentation', presentation.id);

      // Update presentation with compliance status
      await updateComplianceFn(
        presentation.id,
        complianceResult.status,
        complianceResult.score,
        complianceResult.issues
      );

      // If approved or review (not blocked), we're done
      if (complianceResult.status === 'approved' || complianceResult.status === 'review') {
        console.log(`Presentation approved/review on attempt ${attempt} with score ${complianceResult.score}`);
        break;
      }

      // If blocked and we have more attempts, regenerate
      if (complianceResult.status === 'blocked' && attempt < maxAttempts) {
        console.log(`Presentation blocked on attempt ${attempt}, regenerating...`);
        previousIssues = complianceResult.issues || [];
        
        // Delete the blocked presentation
        await supabase.from('sales_presentations').delete().eq('id', presentation.id);
        attempt++;
      } else {
        // Max attempts reached or not blocked
        break;
      }
    }

    return { presentation, complianceResult };
  };

  const downloadPPTX = async (presentation: Presentation) => {
    if (!presentation.presentation_json) {
      toast({ title: 'Erreur', description: 'Données de présentation manquantes', variant: 'destructive' });
      return;
    }

    try {
      const pptx = new PptxGenJS();
      const styleKey = (presentation.style || 'professional') as FuturisticStyle;
      const colors = applyFuturisticStyles(pptx, styleKey);
      
      pptx.title = presentation.title;
      pptx.subject = `Présentation stratégique pour ${presentation.client_name}`;
      pptx.author = 'AETHER Sales Intelligence';

      const data = presentation.presentation_json as PresentationData;
      const totalSlides = data.slides.length;
      const clientName = presentation.client_name || 'Client';
      
      // Build each slide using futuristic templates
      data.slides.forEach((slideData, index) => {
        const slideNum = index + 1;
        
        switch (slideData.type) {
          case 'title':
            buildTitleSlide(pptx, colors, slideData.title, slideData.subtitle || '', clientName, slideData.keyMessage);
            break;
            
          case 'proof':
          case 'financials':
            buildProofSlide(
              pptx, colors, slideData.title,
              slideData.stats || [],
              slideData.testimonial,
              slideData.keyMessage,
              slideNum, totalSlides,
              slideData.sections // Pass sections for hypotheses
            );
            break;
            
          case 'roadmap':
            buildRoadmapSlide(
              pptx, colors, slideData.title,
              slideData.timeline || [],
              slideData.sections,
              slideData.keyMessage,
              slideNum, totalSlides
            );
            break;
            
          case 'cta':
            buildCTASlide(
              pptx, colors, slideData.title,
              slideData.sections,
              slideData.keyMessage,
              slideData.content,
              slideNum, totalSlides
            );
            break;
            
          case 'executive_summary':
          case 'context':
          case 'problem':
          case 'solution':
          case 'benefits':
          case 'risks':
          case 'team':
          case 'appendix':
          default:
            buildSectionSlide(
              pptx, colors, slideData.title, slideData.subtitle,
              slideData.sections || [],
              slideData.keyMessage,
              slideNum, totalSlides
            );
            break;
        }
      });

      const fileName = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pptx`;
      await pptx.writeFile({ fileName });

      toast({
        title: 'Téléchargement réussi',
        description: `Présentation stratégique téléchargée (${totalSlides} slides)`
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
    generateWithCompliance,
    downloadPPTX,
    deletePresentation,
    updatePresentationCompliance,
    invalidatePresentations
  };
}
