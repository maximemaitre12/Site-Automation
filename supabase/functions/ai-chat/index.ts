import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  type?: 'chat' | 'summarize' | 'analyze' | 'generate' | 'classify' | 'extract';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, type = 'chat' } = await req.json() as ChatRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    // System prompts based on type
    const systemPrompts: Record<string, string> = {
      chat: 'You are AETHER Brain, a helpful AI assistant. Provide clear, concise, and accurate responses.',
      summarize: 'You are an expert summarizer. Extract key points and provide a concise summary.',
      analyze: 'You are an expert analyst. Analyze the provided content and provide detailed insights.',
      generate: 'You are a professional content generator. Create high-quality, relevant content based on the request.',
      classify: 'You are a classification expert. Categorize and classify the provided content accurately.',
      extract: 'You are a data extraction expert. Extract structured information from the provided content.',
    };

    const finalSystemPrompt = systemPrompt || systemPrompts[type] || systemPrompts.chat;

    console.log(`Processing ${type} request with ${messages.length} messages`);

    // Use better model for generation tasks, standard for chat
    const isGenerationTask = type === 'generate' || type === 'analyze';
    const model = isGenerationTask ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';
    const maxTokens = isGenerationTask ? 8192 : 4096;
    const temp = isGenerationTask ? 0.8 : 0.7;

    console.log(`Using model: ${model} for ${type} task`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages,
        ],
        temperature: temp,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ content, usage: data.usage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
