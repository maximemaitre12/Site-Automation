import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database, Sparkles, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts, getTotalDuration } from '@/data/tourNarration';

// Import all scenes
import { IntroScene } from './scenes/IntroScene';
import { HRScene } from './scenes/HRScene';
import { SalesScene } from './scenes/SalesScene';
import { SupportScene } from './scenes/SupportScene';
import { BrainScene } from './scenes/BrainScene';
import { ComplianceScene } from './scenes/ComplianceScene';
import { FlowScene } from './scenes/FlowScene';
import { DataScene } from './scenes/DataScene';
import { ConclusionScene } from './scenes/ConclusionScene';

const agentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  hr: Users,
  sales: TrendingUp,
  support: Headphones,
  brain: Brain,
  compliance: Shield,
  flow: GitBranch,
  data: Database,
};

const agentColors: Record<string, string> = {
  hr: 'from-violet-500 to-purple-600',
  sales: 'from-emerald-500 to-teal-600',
  support: 'from-amber-500 to-orange-600',
  brain: 'from-cyan-500 to-blue-600',
  compliance: 'from-red-500 to-rose-600',
  flow: 'from-indigo-500 to-violet-600',
  data: 'from-orange-500 to-amber-600',
};

interface Segment {
  id: string;
  title: string;
  text: string;
  agentType?: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export function ProductTourVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playbackSpeedRef = useRef(playbackSpeed);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speedOptions = [0.5, 1, 1.5, 2];

  // Auto-hide controls on desktop when playing
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      resetControlsTimeout();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, resetControlsTimeout]);

  // Fullscreen handling
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  const totalDuration = useMemo(() => getTotalDuration(), []);

  // Build segments with start/end times
  const segments: Segment[] = useMemo(() => {
    let accumulated = 0;
    return tourScripts.map((script) => {
      const segment: Segment = {
        id: script.id,
        title: script.title,
        text: script.text,
        agentType: script.agentType,
        startTime: accumulated,
        endTime: accumulated + script.duration,
        duration: script.duration,
      };
      accumulated += script.duration;
      return segment;
    });
  }, []);

  // Find current segment based on time
  const currentSegment = useMemo(() => {
    return segments.find(
      (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
    ) || segments[segments.length - 1];
  }, [segments, currentTime]);

  // Calculate progress within current segment (0-100)
  const segmentProgress = useMemo(() => {
    if (!currentSegment) return 0;
    const elapsed = currentTime - currentSegment.startTime;
    return Math.min(100, (elapsed / currentSegment.duration) * 100);
  }, [currentSegment, currentTime]);

  // Animation loop - uses ref for speed to avoid re-creating callback
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    setCurrentTime((prev) => {
      const next = prev + (delta * playbackSpeedRef.current);
      if (next >= totalDuration) {
        setIsPlaying(false);
        setIsEnded(true);
        return totalDuration;
      }
      return next;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [totalDuration]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const togglePlay = () => {
    if (isEnded) {
      setCurrentTime(0);
      setIsEnded(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsEnded(false);
    setIsPlaying(true);
  };

  // Progress bar seeking
  const calculateTimeFromPosition = useCallback((clientX: number): number => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    return percent * totalDuration;
  }, [totalDuration]);

  const seekTo = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(time, totalDuration));
    setCurrentTime(clampedTime);
    setIsEnded(clampedTime >= totalDuration);
  }, [totalDuration]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(calculateTimeFromPosition(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    seekTo(calculateTimeFromPosition(e.clientX));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const overallProgress = (currentTime / totalDuration) * 100;

  const AgentIcon = currentSegment?.agentType ? agentIcons[currentSegment.agentType] : Sparkles;
  const agentColor = currentSegment?.agentType ? agentColors[currentSegment.agentType] : 'from-primary to-violet-600';

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-background"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
    >
      {/* Scene Container - takes full space */}
      <div className="flex-1 relative overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Render all scenes, only the active one is visible */}
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'intro' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <IntroScene isActive={currentSegment?.id === 'intro'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'hr' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <HRScene isActive={currentSegment?.id === 'hr'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'sales' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <SalesScene isActive={currentSegment?.id === 'sales'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'support' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <SupportScene isActive={currentSegment?.id === 'support'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'brain' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <BrainScene isActive={currentSegment?.id === 'brain'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'compliance' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <ComplianceScene isActive={currentSegment?.id === 'compliance'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'flow' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <FlowScene isActive={currentSegment?.id === 'flow'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'data' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <DataScene isActive={currentSegment?.id === 'data'} progress={segmentProgress} />
        </div>
        <div className={cn("absolute inset-0 transition-opacity duration-500", currentSegment?.id === 'conclusion' ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
          <ConclusionScene isActive={currentSegment?.id === 'conclusion'} progress={segmentProgress} onRestart={handleReplay} />
        </div>

        {/* Play overlay - only visible when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-20 focus:outline-none flex items-center justify-center bg-black/20"
            aria-label="Play"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white ml-1" />
            </div>
          </button>
        )}

        {/* Fullscreen button - always visible in top right */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-30 p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5 text-white" />
          ) : (
            <Maximize className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Controls Container - overlay style with auto-hide on desktop */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 space-y-2 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          "md:px-6 md:py-4"
        )}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="relative h-1.5 sm:h-2 bg-white/30 rounded-full cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Segment markers */}
          {segments.slice(1).map((segment) => (
            <div
              key={segment.id}
              className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
              style={{ left: `${(segment.startTime / totalDuration) * 100}%` }}
            />
          ))}
          
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-none"
            style={{ width: `${overallProgress}%` }}
          />
          
          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg border-2 border-white/50 transition-transform hover:scale-110"
            style={{ left: `calc(${overallProgress}% - 6px)` }}
          />
        </div>

        {/* Compact control bar */}
        {currentSegment && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Agent icon */}
            <div className={cn(
              "rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br",
              "w-8 h-8 sm:w-9 sm:h-9",
              agentColor
            )}>
              {AgentIcon && <AgentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            </div>
            
            {/* Title only */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                {currentSegment.title}
              </h3>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Speed selector */}
              <button
                onClick={() => {
                  const currentIndex = speedOptions.indexOf(playbackSpeed);
                  const nextIndex = (currentIndex + 1) % speedOptions.length;
                  setPlaybackSpeed(speedOptions[nextIndex]);
                }}
                className="h-7 sm:h-8 px-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              >
                {playbackSpeed}x
              </button>

              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              {/* Replay */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReplay}
                className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}