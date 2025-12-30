import { useState, useRef, useCallback, useEffect } from 'react';
import { tourScripts, TourScript } from '@/data/tourNarration';
import { supabase } from '@/integrations/supabase/client';

interface UseTourNarrationReturn {
  currentSceneIndex: number;
  currentScript: TourScript | null;
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  progress: number;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  skipToScene: (index: number) => void;
  reset: () => void;
}

export function useTourNarration(): UseTourNarrationReturn {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneStartTimeRef = useRef<number>(0);

  const currentScript = tourScripts[currentSceneIndex] || null;

  // Preload audio for a script
  const preloadAudio = useCallback(async (script: TourScript) => {
    if (audioCache.current.has(script.id)) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text: script.text,
            voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah voice
          }),
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        audioCache.current.set(script.id, audioUrl);
      }
    } catch (error) {
      console.error('Failed to preload audio:', error);
    }
  }, []);

  // Preload next scenes
  useEffect(() => {
    if (isPlaying) {
      // Preload next 2 scenes
      const nextScripts = tourScripts.slice(currentSceneIndex + 1, currentSceneIndex + 3);
      nextScripts.forEach(preloadAudio);
    }
  }, [currentSceneIndex, isPlaying, preloadAudio]);

  // Play audio for current scene (with graceful fallback)
  const playSceneAudio = useCallback(async () => {
    if (!currentScript || isMuted) return;

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const cachedUrl = audioCache.current.get(currentScript.id);
    
    if (cachedUrl) {
      audioRef.current = new Audio(cachedUrl);
      audioRef.current.play().catch(console.error);
    } else {
      // Try to generate audio, but don't block the tour if it fails
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ 
              text: currentScript.text,
              voiceId: 'EXAVITQu4vr4xnSDxMaL'
            }),
          }
        );

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          audioCache.current.set(currentScript.id, audioUrl);
          audioRef.current = new Audio(audioUrl);
          audioRef.current.play().catch(console.error);
        } else {
          // TTS failed - tour continues without audio
          console.warn('TTS unavailable, continuing tour without audio');
        }
      } catch (error) {
        // Silently continue without audio
        console.warn('TTS error, continuing tour without audio:', error);
      }
    }
  }, [currentScript, isMuted]);

  // Start scene timer and progress tracking
  const startSceneTimer = useCallback(() => {
    if (!currentScript) return;

    sceneStartTimeRef.current = Date.now();
    
    // Clear existing timers
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    // Progress update every 100ms
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - sceneStartTimeRef.current;
      const totalDuration = tourScripts.reduce((acc, s) => acc + s.duration, 0);
      const previousDuration = tourScripts
        .slice(0, currentSceneIndex)
        .reduce((acc, s) => acc + s.duration, 0);
      
      setProgress(((previousDuration + elapsed) / totalDuration) * 100);
    }, 100);

    // Scene complete timer
    sceneTimerRef.current = setTimeout(() => {
      if (currentSceneIndex < tourScripts.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        // Tour complete
        setIsPlaying(false);
        setProgress(100);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    }, currentScript.duration);
  }, [currentScript, currentSceneIndex]);

  // Handle scene changes
  useEffect(() => {
    if (isPlaying && currentScript) {
      playSceneAudio();
      startSceneTimer();
    }
  }, [currentSceneIndex, isPlaying]);

  const play = useCallback(() => {
    setIsPlaying(true);
    if (progress >= 100) {
      // Restart from beginning
      setCurrentSceneIndex(0);
      setProgress(0);
    }
    // Preload first scene
    if (tourScripts[currentSceneIndex]) {
      preloadAudio(tourScripts[currentSceneIndex]);
    }
  }, [progress, currentSceneIndex, preloadAudio]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (audioRef.current) {
        audioRef.current.muted = !prev;
      }
      return !prev;
    });
  }, []);

  const skipToScene = useCallback((index: number) => {
    if (index < 0 || index >= tourScripts.length) return;
    
    // Stop current audio and timers
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    // Calculate new progress
    const previousDuration = tourScripts
      .slice(0, index)
      .reduce((acc, s) => acc + s.duration, 0);
    const totalDuration = tourScripts.reduce((acc, s) => acc + s.duration, 0);
    setProgress((previousDuration / totalDuration) * 100);

    setCurrentSceneIndex(index);
  }, []);

  const reset = useCallback(() => {
    pause();
    setCurrentSceneIndex(0);
    setProgress(0);
  }, [pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      // Revoke object URLs
      audioCache.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return {
    currentSceneIndex,
    currentScript,
    isPlaying,
    isMuted,
    isLoading,
    progress,
    play,
    pause,
    toggleMute,
    skipToScene,
    reset,
  };
}
