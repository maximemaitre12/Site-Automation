import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RewriteRequest {
  documentId: string;
  instructions?: string;
  style?: 'professional' | 'formal' | 'concise' | 'detailed' | 'simplified';
  format?: 'report' | 'memo' | 'procedure' | 'email' | 'presentation' | 'contract';
  companyRules?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, instructions, style = 'professional', format, companyRules } = await req.json() as RewriteRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get document
    const { data: document, error: docError } = await supabase
      .from('aether_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    if (!document.content || document.content.length < 20) {
      throw new Error('Document content is too short to rewrite');
    }

    console.log(`Rewriting document: ${document.title} for user ${user.id}`);

    const styleInstructions: Record<string, string> = {
      professional: 'Ton professionnel et soigné, vocabulaire précis, structure claire',
      formal: 'Ton très formel, langage soutenu, formules de politesse appropriées',
      concise: 'Aller droit au but, phrases courtes, éliminer le superflu',
      detailed: 'Détaillé et exhaustif, explications complètes, exemples si pertinent',
      simplified: 'Langage simple et accessible, éviter le jargon technique'
    };

    const formatInstructions: Record<string, string> = {
      report: 'Structure de rapport: introduction, développement avec sections numérotées, conclusion, recommandations',
      memo: 'Format mémo: objet, destinataires, contexte bref, points clés, actions requises',
      procedure: 'Format procédure: objectif, périmètre, étapes numérotées, responsabilités, points d\'attention',
      email: 'Format email professionnel: objet clair, salutation, corps structuré, signature',
      presentation: 'Format présentation: titres impactants, points clés en liste, messages forts',
      contract: 'Format contractuel: clauses numérotées, termes juridiques précis, structure formelle'
    };

    const systemPrompt = `Tu es un rédacteur professionnel d'entreprise avec 20 ans d'expérience. Tu réécris des documents pour qu'ils soient irréprochables, comme s'ils avaient été rédigés par une équipe de professionnels pendant des heures.

RÈGLES ABSOLUES - TRÈS IMPORTANT:
1. Le texte doit être 100% humain - JAMAIS de traces d'IA visible
2. Pas de marqueurs markdown (pas de **, pas de ##, pas de -)
3. Pas d'astérisques, pas de puces avec tirets
4. Structure avec des titres en MAJUSCULES ou soulignés naturellement
5. Utilise des paragraphes fluides et naturels
6. Numérote les sections de façon professionnelle (1., 1.1, a), etc.)
7. Vocabulaire varié et professionnel
8. Transitions naturelles entre les sections
9. Aucune répétition de formules types d'IA

STYLE DE RÉDACTION:
${styleInstructions[style] || styleInstructions.professional}

${format ? `FORMAT ATTENDU:\n${formatInstructions[format] || ''}` : ''}

${companyRules ? `RÈGLES SPÉCIFIQUES DE L'ENTREPRISE:\n${companyRules}` : ''}

${instructions ? `INSTRUCTIONS SPÉCIFIQUES:\n${instructions}` : ''}

Le document final doit sembler avoir été rédigé par un expert humain, pas par une IA.`;

    const userPrompt = `Réécris ce document de manière professionnelle et humaine:

TITRE: ${document.title}

CONTENU ORIGINAL:
${document.content}

Réécris complètement ce document en respectant toutes les règles ci-dessus. Le résultat doit être impeccable et prêt à être utilisé tel quel dans un contexte professionnel.`;

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
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Trop de requêtes, veuillez réessayer dans quelques instants' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédit IA épuisé' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let rewrittenContent = aiResponse.choices?.[0]?.message?.content || '';

    if (!rewrittenContent) {
      throw new Error('Aucun contenu généré');
    }

    // Clean up any remaining markdown artifacts
    rewrittenContent = rewrittenContent
      .replace(/\*\*/g, '')
      .replace(/\*\s/g, '')
      .replace(/^#+\s/gm, '')
      .replace(/^-\s/gm, '• ')
      .trim();

    // Update the document with the new version
    const newVersion = (document.version || 1) + 1;
    
    const { data: updatedDoc, error: updateError } = await supabase
      .from('aether_documents')
      .update({
        content: rewrittenContent,
        version: newVersion,
        embedding_status: 'pending',
        metadata: {
          ...document.metadata,
          lastRewrite: {
            style,
            format,
            previousVersion: document.version || 1,
            rewrittenAt: new Date().toISOString()
          }
        }
      })
      .eq('id', documentId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to save rewritten document');
    }

    console.log(`Successfully rewrote document: ${documentId}, new version: ${newVersion}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document: updatedDoc,
        previousVersion: document.version || 1,
        newVersion 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in doc-rewrite function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
