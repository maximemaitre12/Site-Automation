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

      // RESPECT EXACT SLIDE COUNT requested by user
      const slideCount = params.slideCount || 5;
      const style = params.style || 'professional';

      const prompt = `Tu es un DIRECTEUR ASSOCIÉ chez McKinsey avec 30 ans d'expérience. Tu crées des présentations stratégiques pour des COMEX et conseils d'administration.

CLIENT: ${params.clientName}
OFFRE: ${params.productName}
OBJECTIF: ${params.objective}
ARGUMENTS: ${params.keyPoints || 'À déterminer'}
NOMBRE EXACT DE SLIDES: ${slideCount}

GÉNÈRE EXACTEMENT ${slideCount} slides au format JSON. NE DÉPASSE JAMAIS ce nombre.

Structure OBLIGATOIRE pour ${slideCount} slides:
${slideCount <= 3 ? `
- Slide 1: "title" (couverture)
- Slide 2: "solution" ou "benefits" (proposition de valeur)
- Slide 3: "cta" (prochaines étapes)` : ''}
${slideCount === 4 ? `
- Slide 1: "title" (couverture)
- Slide 2: "problem" (enjeux client)
- Slide 3: "solution" (notre réponse)
- Slide 4: "cta" (prochaines étapes)` : ''}
${slideCount === 5 ? `
- Slide 1: "title" (couverture)
- Slide 2: "problem" (enjeux client)
- Slide 3: "solution" (proposition de valeur)
- Slide 4: "proof" (résultats prouvés avec stats)
- Slide 5: "cta" (prochaines étapes)` : ''}
${slideCount >= 6 && slideCount <= 8 ? `
- Slide 1: "title" (couverture)
- Slide 2: "agenda" (feuille de route)
- Slide 3: "problem" (enjeux client)
- Slide 4: "solution" (proposition)
- Slide 5: "benefits" (bénéfices concrets)
- Slide 6: "proof" (résultats + témoignage)
${slideCount >= 7 ? '- Slide 7: "cta" (prochaines étapes)' : ''}
${slideCount === 8 ? '- Slide 8: "contact" (coordonnées)' : ''}` : ''}
${slideCount > 8 ? `
- Slide 1: "title"
- Slides 2-${slideCount - 1}: Alterner entre "problem", "solution", "benefits", "proof"
- Slide ${slideCount}: "cta" ou "contact"` : ''}

FORMAT JSON STRICT:
{
  "title": "Titre stratégique percutant",
  "subtitle": "Proposition de valeur en une ligne",
  "slides": [
    {"type": "title", "title": "Titre", "content": "Sous-titre"},
    {"type": "problem|solution|benefits", "title": "Titre slide", "content": "Accroche", "bullets": ["Point 1", "Point 2", "Point 3"]},
    {"type": "proof", "title": "Résultats", "stats": [{"value": "+XX%", "label": "Métrique"}], "testimonial": {"quote": "Citation", "author": "Nom, Poste"}},
    {"type": "cta", "title": "Prochaines étapes", "bullets": ["Action 1", "Action 2"], "content": "Phrase d'urgence"}
  ]
}

RÈGLES ABSOLUES:
1. EXACTEMENT ${slideCount} slides, pas plus, pas moins
2. Chiffres concrets et réalistes (invente si nécessaire)
3. Bullets de 8 mots maximum, percutants
4. Le slide "proof" DOIT avoir "stats" (array) et "testimonial" (objet)
5. Langage senior, pas de jargon technique
6. PAS de slide "contact" si ${slideCount} < 6
7. PAS de slide "agenda" si ${slideCount} < 6

RÉPONDS UNIQUEMENT avec le JSON valide, rien d'autre.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un expert McKinsey en présentations stratégiques C-level. Tu génères UNIQUEMENT du JSON valide sans texte avant/après. Tu respectes STRICTEMENT le nombre de slides demandé.',
        type: 'generate'
      });

      if (response.error) throw new Error(response.error);

      // Parse JSON response
      let presentationData: PresentationData;
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('JSON non trouvé');
        presentationData = JSON.parse(jsonMatch[0]);
        
        // ENFORCE slide count - truncate if AI generated too many
        if (presentationData.slides.length > slideCount) {
          console.warn(`AI generated ${presentationData.slides.length} slides, truncating to ${slideCount}`);
          presentationData.slides = presentationData.slides.slice(0, slideCount);
        }
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
        let slide: PptxGenJS.Slide;
        
        switch (slideData.type) {
          case 'title':
            slide = createTitleSlide(
              pptx,
              colors,
              slideData.title || data.title,
              slideData.content || data.subtitle || '',
              presentation.client_name || ''
            );
            break;

          case 'agenda':
            slide = createAgendaSlide(
              pptx,
              colors,
              slideData.title,
              slideData.bullets || []
            );
            break;

          case 'proof':
            slide = createProofSlide(
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
            slide = createCTASlide(
              pptx,
              colors,
              slideData.title,
              slideData.bullets || ['Planifier un appel de suivi', 'Recevoir une proposition détaillée', 'Démarrer un pilote'],
              slideData.content
            );
            break;

          case 'contact':
            slide = createContactSlide(
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
            break;

          case 'problem':
          case 'solution':
          case 'benefits':
          case 'pricing':
          default:
            slide = createContentSlide(
              pptx,
              colors,
              slideData.title,
              slideData.content,
              slideData.bullets,
              index + 1,
              totalSlides,
              slideData.type as 'problem' | 'solution' | 'benefits' | 'pricing' | 'cta'
            );
            break;
        }
        
        // Add presenter notes if available
        if (slideData.notes && slide) {
          slide.addNotes(slideData.notes);
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
