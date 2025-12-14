import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, mimeType = 'audio/webm' } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Received audio data, processing...');
    console.log('MIME type:', mimeType);
    console.log('Audio data length:', audio.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      // Use Gemini Flash for audio transcription with proper audio format
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
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Tu es un transcripteur audio professionnel. Transcris cet enregistrement audio mot à mot.

Instructions:
- Identifie les différents interlocuteurs avec [Locuteur 1], [Locuteur 2], etc.
- Transcris dans la langue de l'audio (français par défaut)
- Inclure les hésitations notables (euh, hmm)
- Si l'audio est inaudible ou vide, réponds exactement: "Audio inaudible ou vide"
- Ne mets pas de préambule, commence directement la transcription`
                },
                {
                  type: 'input_audio',
                  input_audio: {
                    data: audio,
                    format: mimeType.includes('mp3') ? 'mp3' : mimeType.includes('wav') ? 'wav' : 'webm'
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        
        // Try alternative format with image_url for compatibility
        console.log('Trying alternative format...');
        const altResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Transcris cet audio mot à mot. Identifie les locuteurs avec [Locuteur 1], [Locuteur 2]. Commence directement la transcription sans préambule.`
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
        });

        if (!altResponse.ok) {
          const altError = await altResponse.text();
          console.error('Alternative format also failed:', altError);
          
          return new Response(JSON.stringify({ 
            text: '',
            error: 'Transcription non disponible. Veuillez coller le transcript manuellement.',
            fallback: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const altData = await altResponse.json();
        const altTranscription = altData.choices?.[0]?.message?.content || '';
        
        if (altTranscription && altTranscription.trim() !== '' && !altTranscription.includes('inaudible')) {
          console.log('Alternative transcription succeeded, length:', altTranscription.length);
          return new Response(
            JSON.stringify({ text: altTranscription }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      const data = await response.json();
      const transcription = data.choices?.[0]?.message?.content || '';
      
      console.log('Transcription completed, length:', transcription.length);

      if (!transcription || transcription.trim() === '' || transcription.includes('inaudible') || transcription.includes('vide')) {
        return new Response(JSON.stringify({ 
          text: '',
          error: 'Audio inaudible ou vide. Veuillez coller le transcript manuellement.',
          fallback: true
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
        console.error('Request timed out');
        return new Response(JSON.stringify({ 
          text: '',
          error: 'Transcription timeout. Veuillez réessayer avec un audio plus court.',
          fallback: true
        }), {
          status: 504,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
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
