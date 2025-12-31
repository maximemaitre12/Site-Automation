import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, Users, TrendingUp, Zap, Brain, Shield, Workflow, Database, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts } from '@/data/tourNarration';

// Agent icons mapping
const agentIcons: Record<string, React.ElementType> = {
  hr: Users,
  sales: TrendingUp,
  support: Zap,
  brain: Brain,
  compliance: Shield,
  flow: Workflow,
  data: Database,
};

// Agent colors
const agentColors: Record<string, string> = {
  hr: 'from-violet-500 to-purple-600',
  sales: 'from-emerald-500 to-teal-600',
  support: 'from-amber-500 to-orange-600',
  brain: 'from-cyan-500 to-blue-600',
  compliance: 'from-rose-500 to-red-600',
  flow: 'from-indigo-500 to-violet-600',
  data: 'from-sky-500 to-cyan-600',
};

interface Segment {
  id: string;
  title: string;
  text: string;
  agentType?: string;
  startTime: number;
  endTime: number;
}

export const ProductTourVideoPlayer = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Build segments from tourScripts with timing
  const segments: Segment[] = useMemo(() => {
    const totalScriptDuration = tourScripts.reduce((sum, s) => sum + s.duration, 0) / 1000;
    let cumulative = 0;
    
    return tourScripts.map(script => {
      const scriptDurationSec = script.duration / 1000;
      const scale = duration > 0 ? duration / totalScriptDuration : 1;
      
      const segment: Segment = {
        id: script.id,
        title: script.title,
        text: script.text,
        agentType: script.agentType,
        startTime: cumulative * scale,
        endTime: (cumulative + scriptDurationSec) * scale,
      };
      
      cumulative += scriptDurationSec;
      return segment;
    });
  }, [duration]);

  // Find current segment based on currentTime
  const currentSegment = useMemo(() => {
    if (segments.length === 0) return null;
    for (let i = segments.length - 1; i >= 0; i--) {
      if (currentTime >= segments[i].startTime) {
        return segments[i];
      }
    }
    return segments[0];
  }, [segments, currentTime]);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsReady(true);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [isScrubbing]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setIsEnded(true);
  }, []);

  const handleError = useCallback(() => {
    setVideoError(true);
  }, []);

  // Play/Pause controls
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isEnded) {
      videoRef.current.currentTime = 0;
      setIsEnded(false);
    }
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, isEnded]);

  const handleReplay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsEnded(false);
  }, []);

  // Progress bar seeking
  const calculateTimeFromPosition = useCallback((clientX: number): number => {
    if (!progressBarRef.current || duration === 0) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * duration;
  }, [duration]);

  const seekTo = useCallback((time: number) => {
    if (!videoRef.current) return;
    const clampedTime = Math.max(0, Math.min(time, duration));
    videoRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    if (isEnded) setIsEnded(false);
  }, [duration, isEnded]);

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    const time = calculateTimeFromPosition(e.clientX);
    seekTo(time);
  }, [calculateTimeFromPosition, seekTo]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const time = calculateTimeFromPosition(e.clientX);
    seekTo(time);
  }, [calculateTimeFromPosition, seekTo]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isScrubbing) return;
    const time = calculateTimeFromPosition(e.clientX);
    seekTo(time);
  }, [isScrubbing, calculateTimeFromPosition, seekTo]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }, [isScrubbing]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Get agent icon component
  const AgentIcon = currentSegment?.agentType ? agentIcons[currentSegment.agentType] : Calendar;
  const agentGradient = currentSegment?.agentType ? agentColors[currentSegment.agentType] : 'from-primary to-primary/80';

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Video container with 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        {videoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground p-8 text-center">
            <p className="text-lg font-medium mb-2">Vidéo introuvable</p>
            <p className="text-sm opacity-70">
              Ajoutez le fichier vidéo dans <code className="bg-background/50 px-2 py-1 rounded">/public/videos/product-tour.mp4</code>
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src="/videos/product-tour.mp4"
              poster="/videos/product-tour-poster.jpg"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={handleError}
              playsInline
            />

            {/* Play/Pause overlay */}
            {!isPlaying && isReady && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  {isEnded ? (
                    <RotateCcw className="w-8 h-8 text-foreground ml-0" />
                  ) : (
                    <Play className="w-8 h-8 text-foreground ml-1" />
                  )}
                </div>
              </button>
            )}

            {/* Loading state */}
            {!isReady && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 px-1">
        <div
          ref={progressBarRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer group"
          onClick={handleProgressClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Segment markers */}
          {segments.map((segment, index) => {
            if (index === 0) return null;
            const position = (segment.startTime / duration) * 100;
            return (
              <div
                key={segment.id}
                className="absolute top-0 w-0.5 h-full bg-foreground/20 z-10"
                style={{ left: `${position}%` }}
              />
            );
          })}

          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />

          {/* Handle */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md transition-transform",
              "group-hover:scale-125",
              isScrubbing && "scale-125"
            )}
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Current segment info */}
      {currentSegment && (
        <div className="mt-6 p-4 bg-card rounded-xl border border-border/50 transition-all duration-300">
          <div className="flex items-start gap-4">
            {/* Agent icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
              agentGradient
            )}>
              <AgentIcon className="w-6 h-6 text-white" />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1">
                {currentSegment.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {currentSegment.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="default"
          onClick={() => navigate('/contact')}
          className="gap-2"
        >
          Demander une démo
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/auth')}
          className="gap-2"
        >
          Commencer gratuitement
        </Button>
      </div>
    </div>
  );
};
