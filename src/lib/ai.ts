import { supabase } from '@/integrations/supabase/client';

export type AIRequestType = 'chat' | 'summarize' | 'analyze' | 'generate' | 'classify' | 'extract';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIRequestOptions {
  messages: AIMessage[];
  systemPrompt?: string;
  type?: AIRequestType;
}

interface AIResponse {
  content: string;
  error?: string;
}

export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  try {
    const response = await supabase.functions.invoke('ai-chat', {
      body: options,
    });

    // Handle case where response itself has an error
    if (response.error) {
      console.error('AI function error:', response.error);
      // Check if it's a body reading error and provide a cleaner message
      const errorMessage = response.error.message || 'AI service error';
      if (errorMessage.includes('body is disturbed') || errorMessage.includes('body is locked')) {
        return { content: '', error: 'AI service temporarily unavailable. Please try again.' };
      }
      return { content: '', error: errorMessage };
    }

    // Handle case where data is null or undefined
    if (!response.data) {
      console.error('AI function returned no data');
      return { content: '', error: 'No response from AI service' };
    }

    // Handle case where data contains an error property
    if (response.data.error) {
      return { content: '', error: response.data.error };
    }

    // Return successful content
    return { content: response.data.content || '' };
  } catch (err) {
    console.error('AI call error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // Provide user-friendly error message for body reading issues
    if (errorMessage.includes('body is disturbed') || errorMessage.includes('body is locked')) {
      return { content: '', error: 'AI service temporarily unavailable. Please try again.' };
    }
    return { content: '', error: errorMessage };
  }
}

// Convenience functions for specific AI tasks
export async function summarizeText(text: string): Promise<AIResponse> {
  return callAI({
    messages: [{ role: 'user', content: `Please summarize the following text:\n\n${text}` }],
    type: 'summarize',
  });
}

export async function analyzeContent(content: string, analysisType: string): Promise<AIResponse> {
  return callAI({
    messages: [{ role: 'user', content: `Please perform a ${analysisType} analysis on:\n\n${content}` }],
    type: 'analyze',
  });
}

export async function generateContent(prompt: string, contentType: string): Promise<AIResponse> {
  return callAI({
    messages: [{ role: 'user', content: `Generate a ${contentType}:\n\n${prompt}` }],
    type: 'generate',
  });
}

export async function classifyText(text: string, categories: string[]): Promise<AIResponse> {
  return callAI({
    messages: [{ 
      role: 'user', 
      content: `Classify the following text into one of these categories: ${categories.join(', ')}\n\nText: ${text}\n\nRespond with just the category name and a brief explanation.` 
    }],
    type: 'classify',
  });
}

export async function extractData(text: string, fields: string[]): Promise<AIResponse> {
  return callAI({
    messages: [{ 
      role: 'user', 
      content: `Extract the following information from this text: ${fields.join(', ')}\n\nText: ${text}\n\nRespond in JSON format with the extracted fields.` 
    }],
    type: 'extract',
  });
}
