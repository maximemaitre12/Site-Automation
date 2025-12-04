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
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: options,
    });

    if (error) {
      console.error('AI function error:', error);
      return { content: '', error: error.message };
    }

    if (data.error) {
      return { content: '', error: data.error };
    }

    return { content: data.content };
  } catch (err) {
    console.error('AI call error:', err);
    return { content: '', error: err instanceof Error ? err.message : 'Unknown error' };
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
