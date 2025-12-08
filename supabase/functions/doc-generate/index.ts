import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  templateId: string;
  variables: Record<string, string>;
  title: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateId, variables, title } = await req.json() as GenerateRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get template info
    const { data: template } = await supabase
      .from('doc_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    const templateName = template?.name || 'Document';
    const templateCategory = template?.category || 'general';

    // Build the prompt
    const userPrompt = variables.prompt || '';
    
    const systemPrompt = `Tu es un rédacteur professionnel d'entreprise avec 20 ans d'expérience. Tu génères des documents comme si une équipe d'experts y avait passé des heures.

RÈGLES ABSOLUES - TRÈS IMPORTANT:
1. Le texte doit être 100% HUMAIN - Aucune trace d'IA visible
2. PAS de marqueurs markdown visibles (pas de **, pas de ##, pas de -)
3. PAS d'astérisques, PAS de puces avec tirets simples
4. Structure avec des titres en MAJUSCULES ou numérotés
5. Paragraphes fluides et naturels
6. Numérote les sections professionnellement (1., 1.1, a), etc.)
7. Vocabulaire riche et varié
8. Transitions naturelles entre sections
9. Formulations originales, jamais de phrases types d'IA
10. Ton adapté au contexte professionnel français

FORMAT DE SORTIE:
- Titres principaux: TOUT EN MAJUSCULES
- Sous-titres: Numérotés (1.1, 1.2, etc.)
- Listes: Utiliser "•" ou numéros, jamais "-"
- Paragraphes: Complets et bien développés

Le document doit sembler rédigé par un humain expert, pas par une IA.`;

    const generatePrompt = `Génère un document professionnel de type "${templateName}" (catégorie: ${templateCategory}).

TITRE DU DOCUMENT: ${title}

INSTRUCTIONS SPÉCIFIQUES:
${userPrompt || 'Génère un document professionnel complet et détaillé basé sur le template sélectionné.'}

Génère le document complet. Il doit être irréprochable et prêt à l'emploi en entreprise.`;

    console.log(`Generating document for user ${user.id}, template: ${templateId}`);

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
          { role: 'user', content: generatePrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content generated');
    }

    // Create the document in the database
    const { data: document, error: insertError } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content,
        template_id: templateId,
        file_type: 'text/markdown',
        status: 'completed',
        embedding_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save document');
    }

    return new Response(
      JSON.stringify({ document }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in doc-generate function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
