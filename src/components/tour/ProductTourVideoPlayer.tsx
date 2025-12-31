import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database, Sparkles } from 'lucide-react';
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
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    setCurrentTime((prev) => {
      const next = prev + delta;
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
    <div className="relative w-full h-full flex flex-col bg-background">
      {/* Scene Container */}
      <div className="flex-1 relative overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls Container */}
      <div className="bg-card border-t border-border p-4 space-y-3">
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Segment markers */}
          {segments.slice(1).map((segment) => (
            <div
              key={segment.id}
              className="absolute top-0 bottom-0 w-0.5 bg-border z-10"
              style={{ left: `${(segment.startTime / totalDuration) * 100}%` }}
            />
          ))}
          
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-none"
            style={{ width: `${overallProgress}%` }}
          />
          
          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-background transition-transform hover:scale-110"
            style={{ left: `calc(${overallProgress}% - 8px)` }}
          />
        </div>

        {/* Segment info with logo and controls */}
        {currentSegment && (
          <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-muted/30 border border-border/50">
            {/* Agent icon */}
            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br", agentColor)}>
              {AgentIcon && <AgentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            </div>
            
            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-0.5">
                {currentSegment.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {currentSegment.text}
              </p>
            </div>

            {/* Play/Pause controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReplay}
                className="h-9 w-9 rounded-full"
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