import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { callAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import PptxGenJS from 'pptxgenjs';

export interface PresentationSlide {
  type: 'title' | 'agenda' | 'problem' | 'solution' | 'benefits' | 'proof' | 'pricing' | 'cta' | 'contact';
  title: string;
  content?: string;
  bullets?: string[];
  notes?: string;
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

// Agent Sales colors
const COLORS = {
  primary: 'F59E0B',      // amber-500
  primaryDark: 'D97706',  // amber-600
  secondary: '1E293B',    // slate-800
  text: '1F2937',         // gray-800
  textLight: '6B7280',    // gray-500
  white: 'FFFFFF',
  background: 'FEF3C7',   // amber-100
};

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

      const prompt = `Tu es un expert en présentations commerciales. Génère une présentation PowerPoint complète et persuasive.

CLIENT: ${params.clientName}
PRODUIT/SERVICE: ${params.productName}
OBJECTIF: ${params.objective}
POINTS CLÉS À INCLURE: ${params.keyPoints || 'À déterminer selon le contexte'}
NOMBRE DE SLIDES: ${slideCount}
STYLE: ${style}

Génère une présentation au format JSON avec cette structure exacte:
{
  "title": "Titre principal accrocheur",
  "subtitle": "Sous-titre contextuel",
  "slides": [
    {
      "type": "title|agenda|problem|solution|benefits|proof|pricing|cta|contact",
      "title": "Titre du slide",
      "content": "Contenu principal (1-2 phrases)",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Notes pour le présentateur"
    }
  ]
}

Types de slides à utiliser:
- title: Slide de titre (obligatoire en premier)
- agenda: Sommaire de la présentation
- problem: Problématique client / points de douleur
- solution: Votre solution / produit
- benefits: Liste des avantages
- proof: Preuves sociales, chiffres, témoignages
- pricing: Options tarifaires (si pertinent)
- cta: Appel à l'action, prochaines étapes
- contact: Coordonnées (obligatoire en dernier)

Règles:
- Commence TOUJOURS par un slide "title"
- Termine TOUJOURS par un slide "contact"
- Contenu percutant et orienté bénéfices client
- Bullets courts (max 8 mots chacun)
- Notes utiles pour le présentateur

IMPORTANT: Réponds UNIQUEMENT avec le JSON valide, sans aucun texte avant ou après.`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un assistant spécialisé en génération de présentations commerciales. Tu réponds uniquement en JSON valide.',
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
      pptx.author = 'Sales Copilot';
      pptx.title = presentation.title;
      pptx.subject = `Présentation pour ${presentation.client_name}`;

      const data = presentation.presentation_json as PresentationData;

      data.slides.forEach((slideData, index) => {
        const slide = pptx.addSlide();

        // Add gradient background
        slide.background = { color: COLORS.white };

        // Add accent bar at top
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: 0.15,
          fill: { color: COLORS.primary }
        });

        switch (slideData.type) {
          case 'title':
            // Title slide
            slide.addText(slideData.title, {
              x: 0.5, y: 2.5, w: 9, h: 1.2,
              fontSize: 44, bold: true, color: COLORS.secondary,
              align: 'center'
            });
            if (slideData.content || data.subtitle) {
              slide.addText(slideData.content || data.subtitle || '', {
                x: 0.5, y: 3.8, w: 9, h: 0.8,
                fontSize: 24, color: COLORS.textLight,
                align: 'center'
              });
            }
            slide.addText(presentation.client_name || '', {
              x: 0.5, y: 4.8, w: 9, h: 0.5,
              fontSize: 18, color: COLORS.primary, bold: true,
              align: 'center'
            });
            break;

          case 'agenda':
          case 'benefits':
            // Bullet list slides
            slide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 32, bold: true, color: COLORS.secondary
            });
            if (slideData.bullets && slideData.bullets.length > 0) {
              slide.addText(
                slideData.bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
                {
                  x: 0.7, y: 1.5, w: 8.5, h: 3.5,
                  fontSize: 20, color: COLORS.text,
                  bullet: { type: 'bullet' },
                  lineSpacing: 28
                }
              );
            }
            break;

          case 'problem':
          case 'solution':
          case 'proof':
          case 'pricing':
          case 'cta':
            // Content slides
            slide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 32, bold: true, color: COLORS.secondary
            });
            if (slideData.content) {
              slide.addText(slideData.content, {
                x: 0.5, y: 1.5, w: 9, h: 1,
                fontSize: 18, color: COLORS.text,
                align: 'left'
              });
            }
            if (slideData.bullets && slideData.bullets.length > 0) {
              slide.addText(
                slideData.bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
                {
                  x: 0.7, y: slideData.content ? 2.7 : 1.5, w: 8.5, h: 2.5,
                  fontSize: 18, color: COLORS.text,
                  bullet: { type: 'bullet' },
                  lineSpacing: 24
                }
              );
            }
            break;

          case 'contact':
            // Contact slide
            slide.addShape(pptx.ShapeType.rect, {
              x: 0, y: 0, w: '100%', h: '100%',
              fill: { color: COLORS.secondary }
            });
            slide.addText('Merci', {
              x: 0.5, y: 1.5, w: 9, h: 1,
              fontSize: 48, bold: true, color: COLORS.white,
              align: 'center'
            });
            slide.addText(slideData.title || "Prêts à démarrer ?", {
              x: 0.5, y: 2.7, w: 9, h: 0.6,
              fontSize: 24, color: COLORS.primary,
              align: 'center'
            });
            if (slideData.content) {
              slide.addText(slideData.content, {
                x: 0.5, y: 3.5, w: 9, h: 1,
                fontSize: 18, color: COLORS.white,
                align: 'center'
              });
            }
            break;

          default:
            // Generic slide
            slide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 32, bold: true, color: COLORS.secondary
            });
            if (slideData.content) {
              slide.addText(slideData.content, {
                x: 0.5, y: 1.5, w: 9, h: 3,
                fontSize: 18, color: COLORS.text
              });
            }
        }

        // Add slide number (except for title and contact)
        if (slideData.type !== 'title' && slideData.type !== 'contact') {
          slide.addText(`${index + 1}`, {
            x: 9, y: 5.2, w: 0.5, h: 0.3,
            fontSize: 10, color: COLORS.textLight,
            align: 'right'
          });
        }

        // Add notes if present
        if (slideData.notes) {
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
