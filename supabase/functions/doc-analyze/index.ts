import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  documentId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json() as AnalyzeRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get document
    const { data: document, error: docError } = await supabase
      .from('aether_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    console.log(`Analyzing document: ${document.title} (${document.file_type})`);

    // Get content to analyze
    let contentToAnalyze = document.content || '';
    
    // If it's a file, try to extract text (for text-based files)
    if (!contentToAnalyze && document.file_url) {
      const textMimeTypes = [
        'text/plain', 'text/csv', 'text/markdown', 
        'application/json', 'application/xml'
      ];
      
      if (textMimeTypes.includes(document.file_type || '')) {
        try {
          const fileResponse = await fetch(document.file_url);
          if (fileResponse.ok) {
            contentToAnalyze = await fileResponse.text();
          }
        } catch (e) {
          console.error('Failed to fetch file content:', e);
        }
      }
    }

    if (!contentToAnalyze || contentToAnalyze.length < 50) {
      // Not enough content to analyze meaningfully
      await supabase
        .from('aether_documents')
        .update({ 
          embedding_status: 'skipped',
          ai_summary: 'Contenu insuffisant pour analyse'
        })
        .eq('id', documentId);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Skipped - insufficient content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Truncate content if too long
    const maxChars = 15000;
    const truncatedContent = contentToAnalyze.length > maxChars 
      ? contentToAnalyze.substring(0, maxChars) + '...[tronqué]'
      : contentToAnalyze;

    // Analyze with AI
    const systemPrompt = `Tu es un expert senior en analyse de documents d'entreprise avec 25 ans d'expérience. Tu analyses comme un être humain brillant de 200 de QI.

RÈGLES ABSOLUES POUR LE RÉSUMÉ:
1. Écris comme un humain cultivé et intelligent, JAMAIS comme une IA
2. INTERDITS dans le résumé: *, #, **, ##, [], (), markdown, bullet points, tirets
3. Le résumé doit être fluide, en phrases complètes et naturelles
4. Pas de formules type "Ce document présente..." ou "Il s'agit de..."
5. Commence directement par le sujet principal
6. Style élégant et professionnel, comme un cadre supérieur qui résume oralement

Retourne TOUJOURS un JSON valide avec exactement cette structure:
{
  "summary": "Résumé en 2-3 phrases fluides et naturelles, sans aucun formatage markdown",
  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "weaknesses": ["Point faible ou amélioration possible 1", "Point faible 2"],
  "spellingErrors": [
    {"original": "mot mal écrit", "correction": "correction suggérée", "context": "phrase où apparaît l'erreur"}
  ],
  "grammarIssues": [
    {"issue": "description du problème grammatical", "suggestion": "correction suggérée", "context": "phrase concernée"}
  ],
  "styleIssues": [
    {"issue": "problème de style détecté", "suggestion": "amélioration suggérée"}
  ],
  "keywords": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "entities": {
    "personnes": ["noms de personnes mentionnées"],
    "organisations": ["noms d'entreprises/organisations"],
    "dates": ["dates importantes"],
    "montants": ["montants financiers"],
    "lieux": ["lieux mentionnés"]
  },
  "category": "contrat|rapport|procedure|facture|presentation|correspondance|technique|autre",
  "readabilityScore": 85,
  "readabilityComment": "Commentaire sur la lisibilité",
  "recommendations": ["Recommandation d'amélioration 1", "Recommandation 2"],
  "sentiment": "positif|neutre|negatif",
  "language": "fr|en|autre"
}

EXEMPLES DE BONS RÉSUMÉS (à imiter):
- "La société Dupont propose une restructuration de sa dette auprès de trois créanciers principaux, avec un échéancier étalé sur 24 mois et un taux préférentiel de 3,2%. L'accord prévoit une clause de sortie anticipée sous conditions de performance."
- "Le rapport trimestriel révèle une croissance de 12% du chiffre d'affaires, portée par l'expansion sur le marché asiatique. Les marges restent sous pression en raison de l'augmentation des coûts logistiques."

EXEMPLES DE MAUVAIS RÉSUMÉS (à éviter):
- "**Résumé:** Ce document présente..."
- "## Points clés\n- Point 1\n- Point 2"
- "Le document [titre] contient les informations suivantes:"`;

    const userPrompt = `Analyse ce document en profondeur - détecte les erreurs, points forts/faibles:

Titre: ${document.title}
Type de fichier: ${document.file_type || 'inconnu'}

Contenu:
${truncatedContent}

Retourne uniquement le JSON, sans texte supplémentaire.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429 || response.status === 402) {
        await supabase
          .from('aether_documents')
          .update({ embedding_status: 'rate_limited' })
          .eq('id', documentId);
        
        return new Response(
          JSON.stringify({ error: 'Rate limited' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let analysisContent = aiResponse.choices?.[0]?.message?.content || '';

    // Parse the JSON response
    let analysis: any = {};
    try {
      // Remove markdown code blocks if present
      analysisContent = analysisContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      analysis = JSON.parse(analysisContent);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      analysis = {
        summary: analysisContent.substring(0, 500),
        keywords: [],
        entities: {},
        category: 'autre',
        strengths: [],
        weaknesses: [],
        spellingErrors: [],
        recommendations: []
      };
    }

    // Update document with analysis
    const { error: updateError } = await supabase
      .from('aether_documents')
      .update({
        ai_summary: analysis.summary || null,
        ai_keywords: analysis.keywords || [],
        ai_entities: analysis.entities || {},
        embedding_status: 'completed',
        metadata: {
          ...document.metadata,
          ai_analysis: {
            category: analysis.category,
            sentiment: analysis.sentiment,
            language: analysis.language,
            strengths: analysis.strengths || [],
            weaknesses: analysis.weaknesses || [],
            spellingErrors: analysis.spellingErrors || [],
            grammarIssues: analysis.grammarIssues || [],
            styleIssues: analysis.styleIssues || [],
            readabilityScore: analysis.readabilityScore,
            readabilityComment: analysis.readabilityComment,
            recommendations: analysis.recommendations || [],
            analyzedAt: new Date().toISOString()
          }
        }
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to save analysis');
    }

    console.log(`Successfully analyzed document: ${documentId}`);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in doc-analyze function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
