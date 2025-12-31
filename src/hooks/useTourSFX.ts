import { useCallback, useRef, useEffect } from 'react';

// Pre-defined sound effect prompts for each scene
const sceneSFX: Record<string, { prompt: string; duration: number }> = {
  intro: {
    prompt: "Futuristic technology startup sound, digital whoosh with ascending synth tones, magical reveal",
    duration: 3,
  },
  hr: {
    prompt: "Digital scanning beep, data processing sound, soft clicks and positive confirmation chime",
    duration: 2,
  },
  sales: {
    prompt: "Cash register ding mixed with digital success sound, upward trending notification",
    duration: 2,
  },
  support: {
    prompt: "Friendly notification ping, quick digital response sound, helpful chime",
    duration: 2,
  },
  brain: {
    prompt: "Neural network activation, deep thinking electronic hum, knowledge synapse spark",
    duration: 2,
  },
  compliance: {
    prompt: "Security shield activation, protective barrier sound, official stamp approval",
    duration: 2,
  },
  flow: {
    prompt: "Workflow automation sequence, connecting nodes sound, fluid digital stream",
    duration: 2,
  },
  data: {
    prompt: "Data visualization appearing, charts loading, analytical processing beeps",
    duration: 2,
  },
  conclusion: {
    prompt: "Grand finale orchestral hit, triumphant success fanfare, inspiring achievement sound",
    duration: 3,
  },
};

// Transition sound
const transitionSFX = {
  prompt: "Smooth digital transition swoosh, gentle scene change whoosh",
  duration: 1,
};

export function useTourSFX() {
  const audioCache = useRef<Map<string, string>>(new Map());
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const isMuted = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioCache.current.forEach((url) => URL.revokeObjectURL(url));
      audioCache.current.clear();
      if (currentAudio.current) {
        currentAudio.current.pause();
      }
    };
  }, []);

  const generateSFX = useCallback(async (prompt: string, duration: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, duration }),
        }
      );

      if (!response.ok) {
        console.warn(`SFX generation failed: ${response.status}`);
        return null;
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.warn("SFX generation error:", error);
      return null;
    }
  }, []);

  const playSceneSFX = useCallback(async (sceneId: string) => {
    if (isMuted.current) return;

    const sfxConfig = sceneSFX[sceneId];
    if (!sfxConfig) return;

    // Check cache first
    let audioUrl = audioCache.current.get(sceneId);
    
    if (!audioUrl) {
      audioUrl = await generateSFX(sfxConfig.prompt, sfxConfig.duration);
      if (audioUrl) {
        audioCache.current.set(sceneId, audioUrl);
      }
    }

    if (audioUrl) {
      // Stop current audio
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.4;
      currentAudio.current = audio;
      
      try {
        await audio.play();
      } catch (e) {
        console.warn("Audio playback failed:", e);
      }
    }
  }, [generateSFX]);

  const playTransitionSFX = useCallback(async () => {
    if (isMuted.current) return;

    let audioUrl = audioCache.current.get('transition');
    
    if (!audioUrl) {
      audioUrl = await generateSFX(transitionSFX.prompt, transitionSFX.duration);
      if (audioUrl) {
        audioCache.current.set('transition', audioUrl);
      }
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.volume = 0.25;
      
      try {
        await audio.play();
      } catch (e) {
        console.warn("Transition audio playback failed:", e);
      }
    }
  }, [generateSFX]);

  const toggleMute = useCallback(() => {
    isMuted.current = !isMuted.current;
    if (isMuted.current && currentAudio.current) {
      currentAudio.current.pause();
    }
    return isMuted.current;
  }, []);

  const preloadSFX = useCallback(async (sceneIds: string[]) => {
    // Preload in background without blocking
    for (const sceneId of sceneIds) {
      if (audioCache.current.has(sceneId)) continue;
      
      const sfxConfig = sceneSFX[sceneId];
      if (sfxConfig) {
        const url = await generateSFX(sfxConfig.prompt, sfxConfig.duration);
        if (url) {
          audioCache.current.set(sceneId, url);
        }
      }
    }
  }, [generateSFX]);

  return {
    playSceneSFX,
    playTransitionSFX,
    toggleMute,
    preloadSFX,
    isMuted: () => isMuted.current,
  };
}
