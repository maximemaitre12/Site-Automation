import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maximum audio size in bytes (5MB for base64 ~ 3.75MB raw)
const MAX_AUDIO_SIZE = 5 * 1024 * 1024;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Transcribe-audio function started');
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request body',
        text: '',
        fallback: true
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { audio, mimeType = 'audio/webm' } = requestBody;
    
    if (!audio) {
      console.error('No audio data provided');
      return new Response(JSON.stringify({ 
        error: 'No audio data provided',
        text: '',
        fallback: true
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Received audio data, processing...');
    console.log('MIME type:', mimeType);
    console.log('Audio data length (base64):', audio.length);
    
    // Check audio size
    if (audio.length > MAX_AUDIO_SIZE) {
      console.error('Audio too large:', audio.length, 'bytes');
      return new Response(JSON.stringify({ 
        error: 'Audio file too large. Maximum size is 5MB. Please use a shorter recording.',
        text: '',
        fallback: true
      }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Transcription service not configured',
        text: '',
        fallback: true
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set a timeout for the request (90 seconds for longer audio)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Request timeout triggered after 90s');
      controller.abort();
    }, 90000);

    try {
      console.log('Calling Lovable AI Gateway for transcription...');
      
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `Tu es un transcripteur audio professionnel. Transcris l'audio mot à mot.

Instructions:
- Identifie les différents interlocuteurs avec [Locuteur 1], [Locuteur 2], etc.
- Transcris dans la langue de l'audio (français, anglais, etc.)
- Inclure les hésitations notables (euh, hmm)
- Si l'audio est inaudible, vide ou trop court, indique "[Audio inaudible]"
- Ne fais pas de résumé, transcris mot à mot`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Transcris cet enregistrement audio mot à mot.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${audio}`
                  }
                }
              ]
            }
          ],
          max_tokens: 8000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('AI Gateway response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ 
            error: 'Service surchargé. Veuillez réessayer dans quelques instants.',
            text: '',
            fallback: true 
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ 
            error: 'Limite d\'utilisation atteinte. Veuillez ajouter des crédits.',
            text: '',
            fallback: true 
          }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ 
          text: '',
          error: 'Erreur de transcription. Veuillez coller le transcript manuellement.',
          fallback: true
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const transcription = data.choices?.[0]?.message?.content || '';
      
      console.log('Transcription completed successfully, length:', transcription.length);

      if (!transcription || transcription.trim() === '' || transcription.includes('[Audio inaudible]')) {
        return new Response(JSON.stringify({ 
          text: transcription || '',
          error: transcription ? null : 'Transcription vide. L\'audio est peut-être trop court ou inaudible.',
          fallback: !transcription
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ text: transcription }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timed out after 90s');
        return new Response(JSON.stringify({ 
          text: '',
          error: 'Transcription trop longue. Utilisez un audio plus court (< 2 min) ou collez le texte manuellement.',
          fallback: true
        }), {
          status: 504,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        text: '',
        fallback: true
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
