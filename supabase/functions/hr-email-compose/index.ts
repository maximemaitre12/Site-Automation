import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, emailContent, context, candidateInfo, jobInfo, tone = 'professional' } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let systemPrompt = '';
    let userPrompt = '';

    const toneInstructions: Record<string, string> = {
      professional: 'Adopte un ton professionnel et courtois, formel mais chaleureux.',
      formal: 'Adopte un ton très formel et institutionnel.',
      friendly: 'Adopte un ton amical et accessible, tout en restant professionnel.',
      concise: 'Sois direct et concis, va à l\'essentiel.',
    };

    switch (action) {
      case 'generate':
        systemPrompt = `Tu es un assistant RH expert en communication professionnelle. Tu rédiges des emails de recrutement en français.
${toneInstructions[tone] || toneInstructions.professional}

Règles importantes:
- Commence toujours par une salutation appropriée
- Personnalise le message avec les informations disponibles
- Inclus toujours une phrase sur les prochaines étapes
- Termine par une formule de politesse appropriée
- Ne mentionne jamais que tu es une IA`;

        userPrompt = `Génère une réponse email professionnelle pour ce contexte:

Email reçu:
${context?.originalEmail || 'Aucun email précédent'}

Informations candidat:
- Nom: ${candidateInfo?.name || 'Non spécifié'}
- Email: ${candidateInfo?.email || 'Non spécifié'}
- Compétences: ${candidateInfo?.skills?.join(', ') || 'Non spécifiées'}
- Expérience: ${candidateInfo?.experience_years || 'Non spécifiée'} ans

${jobInfo ? `Poste concerné: ${jobInfo.title}` : ''}

${context?.intent ? `Intention de la réponse: ${context.intent}` : ''}

Génère uniquement le corps de l'email, sans le sujet.`;
        break;

      case 'improve':
        systemPrompt = `Tu es un expert en communication RH. Tu améliores les emails pour les rendre plus professionnels et impactants.
${toneInstructions[tone] || toneInstructions.professional}

Tu dois:
- Corriger les fautes d'orthographe et de grammaire
- Améliorer la structure et la clarté
- Rendre le message plus engageant
- Garder le sens original du message`;

        userPrompt = `Améliore cet email tout en gardant son intention originale:

${emailContent}

Retourne uniquement le texte amélioré, sans explication.`;
        break;

      case 'shorten':
        systemPrompt = `Tu es un expert en communication concise. Tu raccourcis les emails tout en gardant l'essentiel du message.`;
        
        userPrompt = `Raccourcis cet email en gardant les points clés:

${emailContent}

Retourne uniquement la version courte, sans explication.`;
        break;

      case 'check':
        systemPrompt = `Tu es un correcteur expert en français. Tu vérifies les emails et proposes des corrections.`;
        
        userPrompt = `Vérifie cet email et corrige les erreurs d'orthographe, de grammaire et de style:

${emailContent}

Retourne le texte corrigé suivi d'une ligne "---CORRECTIONS---" puis liste les corrections apportées.`;
        break;

      case 'suggest_improvements':
        systemPrompt = `Tu es un consultant RH expert. Tu proposes des améliorations concrètes pour les emails de recrutement.`;
        
        userPrompt = `Analyse cet email et propose 3-5 suggestions d'amélioration concrètes:

${emailContent}

Contexte:
${context?.originalEmail ? `Email original du candidat: ${context.originalEmail}` : ''}
${candidateInfo ? `Candidat: ${candidateInfo.name}` : ''}
${jobInfo ? `Poste: ${jobInfo.title}` : ''}

Retourne les suggestions sous forme de liste JSON avec format:
[{"id": "1", "label": "suggestion courte", "improved_text": "version améliorée si applicable"}]`;
        break;

      case 'propose_interview':
        systemPrompt = `Tu es un assistant RH. Tu génères des propositions d'entretien professionnelles et claires.`;
        
        userPrompt = `Génère un email proposant un entretien à ce candidat:

Candidat: ${candidateInfo?.name || 'le candidat'}
Poste: ${jobInfo?.title || 'le poste'}

L'email doit:
- Féliciter le candidat pour l'intérêt de sa candidature
- Proposer un entretien (préciser que le candidat peut suggérer un créneau)
- Mentionner la durée estimée (30-45 minutes)
- Rester ouvert sur le format (visio ou présentiel)

Retourne uniquement le corps de l'email.`;
        break;

      default:
        throw new Error(`Action non supportée: ${action}`);
    }

    // Call Lovable AI
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedText = aiResponse.choices[0]?.message?.content || '';

    // Parse suggestions if action is suggest_improvements
    let result: any = { text: generatedText };

    if (action === 'suggest_improvements') {
      try {
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          result.suggestions = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('Could not parse suggestions as JSON');
        result.suggestions = [];
      }
    }

    if (action === 'check') {
      const parts = generatedText.split('---CORRECTIONS---');
      result.text = parts[0]?.trim() || generatedText;
      result.corrections = parts[1]?.trim() || '';
    }

    console.log(`HR Email Compose - Action: ${action}, Success`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in hr-email-compose:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
