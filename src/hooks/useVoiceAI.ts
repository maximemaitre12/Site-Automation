import { useState, useRef, useCallback } from 'react';
import { elevenlabsApi } from '@/lib/api/integrations';
import { useToast } from '@/hooks/use-toast';

interface UseVoiceAIOptions {
  defaultVoiceId?: string;
}

export function useVoiceAI(options: UseVoiceAIOptions = {}) {
  const { defaultVoiceId = 'FvmvwvObRqIHojkEGh5N' } = options; // Adina - French young female voice
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async (text: string, voiceId?: string) => {
    if (!text.trim()) return;

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);
    try {
      const audio = await elevenlabsApi.playText(text, voiceId || defaultVoiceId);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
        toast({
          title: "Erreur audio",
          description: "Impossible de lire l'audio",
          variant: "destructive"
        });
      };
    } catch (error) {
      console.error('Voice AI error:', error);
      toast({
        title: "Erreur vocale",
        description: error instanceof Error ? error.message : "Échec de la synthèse vocale",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [defaultVoiceId, toast]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const getAudioBlob = useCallback(async (text: string, voiceId?: string) => {
    if (!text.trim()) return null;
    
    try {
      return await elevenlabsApi.textToSpeech(text, voiceId || defaultVoiceId);
    } catch (error) {
      console.error('Voice AI error:', error);
      return null;
    }
  }, [defaultVoiceId]);

  return {
    speak,
    stop,
    getAudioBlob,
    isPlaying,
    isLoading,
  };
}
