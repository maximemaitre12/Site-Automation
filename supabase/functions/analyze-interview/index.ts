import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  transcript: string;
  candidateName: string;
  candidateSkills?: string[];
  candidateExperience?: number;
  jobTitle?: string;
  jobDescription?: string;
  jobRequirements?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      transcript, 
      candidateName, 
      candidateSkills, 
      candidateExperience,
      jobTitle, 
      jobDescription,
      jobRequirements 
    }: AnalyzeRequest = await req.json();

    if (!transcript) {
      throw new Error('Transcript is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Tu es un expert RH senior spécialisé dans l'analyse d'entretiens d'embauche. 
Tu dois analyser la transcription d'un entretien et fournir une évaluation complète et objective.

IMPORTANT: Réponds UNIQUEMENT en JSON valide, sans markdown ni texte supplémentaire.`;

    const userPrompt = `Analyse cet entretien et génère une évaluation complète.

CANDIDAT:
- Nom: ${candidateName}
- Compétences connues: ${candidateSkills?.join(', ') || 'Non spécifiées'}
- Années d'expérience: ${candidateExperience || 'Non spécifié'}

${jobTitle ? `POSTE:
- Titre: ${jobTitle}
- Description: ${jobDescription || 'Non spécifiée'}
- Compétences requises: ${jobRequirements?.join(', ') || 'Non spécifiées'}` : ''}

TRANSCRIPTION DE L'ENTRETIEN:
${transcript}

Génère une analyse JSON avec cette structure EXACTE:
{
  "voice_analysis": {
    "confidence_score": <0-100>,
    "stress_level": "low" | "medium" | "high",
    "fluency_score": <0-100>,
    "clarity_score": <0-100>,
    "emotional_state": "calm" | "nervous" | "enthusiastic" | "hesitant",
    "hesitation_count": <number>,
    "speaking_pace": "slow" | "moderate" | "fast",
    "key_insights": ["<observation 1>", "<observation 2>", ...]
  },
  "technical_evaluation": {
    "score": <0-100>,
    "details": [
      {"skill": "<compétence>", "score": <0-100>, "evidence": "<justification basée sur l'entretien>"},
      ...
    ]
  },
  "behavioral_evaluation": {
    "score": <0-100>,
    "criteria": [
      {"name": "Communication", "score": <0-100>, "evidence": "<justification>"},
      {"name": "Résolution de problèmes", "score": <0-100>, "evidence": "<justification>"},
      {"name": "Travail d'équipe", "score": <0-100>, "evidence": "<justification>"},
      {"name": "Adaptabilité", "score": <0-100>, "evidence": "<justification>"},
      {"name": "Leadership", "score": <0-100>, "evidence": "<justification>"}
    ]
  },
  "cultural_fit_evaluation": {
    "score": <0-100>,
    "alignment_points": ["<point d'alignement 1>", ...],
    "concerns": ["<préoccupation 1>", ...]
  },
  "match_score": <0-100>,
  "match_breakdown": {
    "technical": {"score": <0-100>, "weight": 0.6},
    "behavioral": {"score": <0-100>, "weight": 0.3},
    "cultural": {"score": <0-100>, "weight": 0.1}
  },
  "ai_report": {
    "summary": "<résumé de 2-3 phrases sur la performance globale du candidat>",
    "strengths": ["<point fort 1>", "<point fort 2>", ...],
    "areas_for_improvement": ["<axe d'amélioration 1>", ...],
    "recommendations": ["<recommandation 1>", "<recommandation 2>", ...],
    "suggested_follow_up_questions": ["<question 1>", "<question 2>", ...],
    "hiring_recommendation": "strongly_recommend" | "recommend" | "consider" | "not_recommend"
  }
}`;

    console.log('Calling Lovable AI Gateway for interview analysis...');

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response
      let jsonStr = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw content:', content);
      
      // Return a default structure if parsing fails
      analysis = {
        voice_analysis: {
          confidence_score: 70,
          stress_level: 'medium',
          fluency_score: 70,
          clarity_score: 75,
          emotional_state: 'calm',
          key_insights: ['Analyse automatique non disponible - veuillez réessayer']
        },
        technical_evaluation: { score: 70, details: [] },
        behavioral_evaluation: { score: 70, criteria: [] },
        cultural_fit_evaluation: { score: 70, alignment_points: [], concerns: [] },
        match_score: 70,
        match_breakdown: {
          technical: { score: 70, weight: 0.6 },
          behavioral: { score: 70, weight: 0.3 },
          cultural: { score: 70, weight: 0.1 }
        },
        ai_report: {
          summary: 'Analyse en cours de traitement.',
          strengths: [],
          areas_for_improvement: [],
          recommendations: ['Réessayer l\'analyse pour obtenir des résultats détaillés'],
          suggested_follow_up_questions: [],
          hiring_recommendation: 'consider'
        }
      };
    }

    console.log('Interview analysis completed successfully');

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in analyze-interview:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to analyze interview' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
