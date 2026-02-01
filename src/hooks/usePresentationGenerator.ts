import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { callAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import PptxGenJS from 'pptxgenjs';
import {
  COLOR_PALETTES,
  StyleType,
  applyMasterStyles,
  createTitleSlide,
  createAgendaSlide,
  createContentSlide,
  createProofSlide,
  createCTASlide,
  createContactSlide
} from '@/lib/pptx-templates';

export interface PresentationSlide {
  type: 'title' | 'agenda' | 'problem' | 'solution' | 'benefits' | 'proof' | 'pricing' | 'cta' | 'contact';
  title: string;
  content?: string;
  bullets?: string[];
  notes?: string;
  stats?: { value: string; label: string }[];
  testimonial?: { quote: string; author: string };
}

export interface PresentationData {
  title: string;
  subtitle?: string;
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

      const slideCount = params.slideCount || 8;
      const style = params.style || 'professional';

      const prompt = `Tu es un directeur commercial senior avec 25 ans d'expérience. Tu crées des présentations PowerPoint stratégiques de niveau C-level.

CLIENT CIBLE: ${params.clientName}
PRODUIT/SERVICE: ${params.productName}
OBJECTIF COMMERCIAL: ${params.objective}
ARGUMENTS CLÉS: ${params.keyPoints || 'À déterminer selon l\'analyse du contexte'}
NOMBRE DE SLIDES: ${slideCount}
STYLE VISUEL: ${style}

GÉNÈRE une présentation JSON ultra-professionnelle avec cette structure:
{
  "title": "Titre accrocheur et stratégique (pas générique)",
  "subtitle": "Proposition de valeur en une phrase",
  "slides": [
    {
      "type": "title",
      "title": "Titre impactant",
      "content": "Sous-titre stratégique"
    },
    {
      "type": "agenda",
      "title": "Notre approche",
      "bullets": ["Point 1 stratégique", "Point 2", "Point 3"]
    },
    {
      "type": "problem",
      "title": "Les défis de ${params.clientName}",
      "content": "Accroche empathique sur les enjeux",
      "bullets": ["Défi 1 chiffré", "Défi 2 avec impact", "Défi 3"],
      "notes": "Notes pour le présentateur"
    },
    {
      "type": "solution",
      "title": "Notre réponse sur mesure",
      "content": "Positionnement différenciant",
      "bullets": ["Capacité 1", "Capacité 2", "Capacité 3"]
    },
    {
      "type": "benefits",
      "title": "Vos bénéfices concrets",
      "bullets": ["ROI chiffré", "Gain de temps", "Réduction des risques", "Avantage compétitif"]
    },
    {
      "type": "proof",
      "title": "Nos résultats prouvés",
      "stats": [
        {"value": "+45%", "label": "Croissance moyenne"},
        {"value": "98%", "label": "Satisfaction client"},
        {"value": "6 mois", "label": "Retour sur investissement"}
      ],
      "testimonial": {
        "quote": "Citation client impactante et crédible",
        "author": "Nom, Titre, Entreprise similaire"
      }
    },
    {
      "type": "pricing|cta",
      "title": "Prochaines étapes",
      "bullets": ["Action 1 claire", "Action 2", "Action 3"],
      "content": "Phrase d'urgence ou offre limitée"
    },
    {
      "type": "contact",
      "title": "Construisons ensemble votre succès",
      "content": "Coordonnées et disponibilité"
    }
  ]
}

RÈGLES ABSOLUES:
- Slide 1 = "title", dernier slide = "contact"
- Chiffres et données concrètes obligatoires (invente des chiffres réalistes)
- Bullets de 6-10 mots maximum, percutants
- Langage business senior, pas de jargon technique
- Le slide "proof" DOIT contenir des stats et un testimonial
- Contenu orienté bénéfices client, pas caractéristiques produit
- Notes de présentateur stratégiques pour chaque slide content

RÉPONDS UNIQUEMENT avec le JSON valide.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un expert en présentations commerciales C-level. Tu génères uniquement du JSON valide, sans aucun texte avant ou après.',
        type: 'generate'
      });

      if (response.error) throw new Error(response.error);

      // Parse JSON response
      let presentationData: PresentationData;
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('JSON non trouvé');
        presentationData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        throw new Error('Erreur de parsing de la présentation générée');
      }

      // Save to database
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
        description: `${presentationData.slides.length} slides créés avec succès`
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
      pptx.subject = `Présentation pour ${presentation.client_name}`;

      const data = presentation.presentation_json as PresentationData;
      const totalSlides = data.slides.length;

      data.slides.forEach((slideData, index) => {
        switch (slideData.type) {
          case 'title':
            createTitleSlide(
              pptx,
              colors,
              slideData.title || data.title,
              slideData.content || data.subtitle || '',
              presentation.client_name || ''
            );
            break;

          case 'agenda':
            createAgendaSlide(
              pptx,
              colors,
              slideData.title,
              slideData.bullets || []
            );
            break;

          case 'proof':
            createProofSlide(
              pptx,
              colors,
              slideData.title,
              slideData.stats || [
                { value: '+40%', label: 'Performance' },
                { value: '98%', label: 'Satisfaction' },
                { value: '<6 mois', label: 'ROI' }
              ],
              slideData.testimonial
            );
            break;

          case 'cta':
            createCTASlide(
              pptx,
              colors,
              slideData.title,
              slideData.bullets || ['Planifier un appel de suivi', 'Recevoir une proposition détaillée', 'Démarrer un pilote'],
              slideData.content
            );
            break;

          case 'contact':
            const contactSlide = createContactSlide(
              pptx,
              colors,
              {
                name: presentation.client_name,
                email: 'contact@company.com',
                phone: '+33 1 23 45 67 89',
                website: 'www.company.com'
              },
              slideData.title || 'Merci !'
            );
            if (slideData.notes) {
              contactSlide.addNotes(slideData.notes);
            }
            break;

          case 'problem':
          case 'solution':
          case 'benefits':
          case 'pricing':
          default:
            const contentSlide = createContentSlide(
              pptx,
              colors,
              slideData.title,
              slideData.content,
              slideData.bullets,
              index + 1,
              totalSlides,
              slideData.type as any
            );
            if (slideData.notes) {
              contentSlide.addNotes(slideData.notes);
            }
        }
      });

      // Generate and download
      const fileName = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pptx`;
      await pptx.writeFile({ fileName });

      toast({
        title: 'Téléchargement réussi',
        description: `${fileName} téléchargé`
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
