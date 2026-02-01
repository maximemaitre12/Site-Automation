const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-stream`;
const CONFIDENTIAL_CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-confidential`;

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Attachment {
  type: 'image' | 'document';
  content: string;
  name: string;
  mimeType?: string;
}

export interface StreamAIChatOptions {
  messages: AIMessage[];
  systemPrompt?: string;
  userId?: string;
  attachments?: Attachment[];
  confidentialMode?: boolean;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
  abortSignal?: AbortSignal;
}

export async function streamAIChat({
  messages,
  systemPrompt,
  userId,
  attachments,
  confidentialMode = false,
  onDelta,
  onDone,
  onError,
  abortSignal,
}: StreamAIChatOptions) {
  try {
    // Use confidential endpoint when mode is enabled
    const endpoint = confidentialMode ? CONFIDENTIAL_CHAT_URL : CHAT_URL;
    
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages, 
        systemPrompt,
        userId,
        attachments
      }),
      signal: abortSignal,
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${resp.status}`);
    }

    if (!resp.body) {
      throw new Error('No response body');
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamDone = false;

    while (!streamDone) {
      // Check if aborted
      if (abortSignal?.aborted) {
        reader.cancel();
        throw new Error('Generation cancelled');
      }

      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (error) {
    // Handle abort specifically
    if (error instanceof Error && error.name === 'AbortError') {
      onError?.(new Error('Generation cancelled'));
      return;
    }
    console.error('Stream error:', error);
    onError?.(error instanceof Error ? error : new Error('Unknown error'));
  }
}

// Generate a smart conversation title based on the first message
export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: firstMessage }],
        systemPrompt: `Tu es un assistant qui génère des titres courts et pertinents pour des conversations.
Génère UN titre court (3-6 mots maximum) qui résume le sujet principal de ce message.
Le titre doit être en français, clair et informatif.
Réponds UNIQUEMENT avec le titre, sans guillemets, sans ponctuation finale, sans explication.
Exemples de bons titres: "Analyse données ventes Q3", "Création workflow automatisé", "Questions RH recrutement".`,
      }),
    });

    if (!resp.ok) {
      return firstMessage.slice(0, 40);
    }

    if (!resp.body) {
      return firstMessage.slice(0, 40);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let fullTitle = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) fullTitle += content;
        } catch { /* ignore */ }
      }
    }

    // Clean up the title
    const cleanTitle = fullTitle.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\.$/g, '') // Remove trailing period
      .slice(0, 50); // Max 50 chars

    return cleanTitle || firstMessage.slice(0, 40);
  } catch (error) {
    console.error('Error generating title:', error);
    return firstMessage.slice(0, 40);
  }
}