import { supabase } from '@/integrations/supabase/client';

// ElevenLabs TTS API
export const elevenlabsApi = {
  async textToSpeech(text: string, voiceId?: string): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voiceId }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to generate speech');
    }

    return await response.blob();
  },

  async playText(text: string, voiceId?: string): Promise<HTMLAudioElement> {
    const audioBlob = await this.textToSpeech(text, voiceId);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    return audio;
  },
};

// Firecrawl API
export const firecrawlApi = {
  async scrape(url: string, options?: {
    formats?: ('markdown' | 'html' | 'links' | 'screenshot' | 'branding')[];
    onlyMainContent?: boolean;
  }) {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { url, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async search(query: string, options?: {
    limit?: number;
    lang?: string;
    country?: string;
    scrapeOptions?: { formats?: ('markdown' | 'html')[] };
  }) {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};

// Perplexity API
export const perplexityApi = {
  async search(query: string, options?: {
    model?: 'sonar' | 'sonar-pro' | 'sonar-reasoning';
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
    domainFilter?: string[];
    recencyFilter?: 'day' | 'week' | 'month' | 'year';
  }) {
    const { data, error } = await supabase.functions.invoke('perplexity-search', {
      body: { query, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
