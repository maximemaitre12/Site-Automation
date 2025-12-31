import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts } from '@/data/tourNarration';

// Import scenes
import { IntroScene } from './scenes/IntroScene';
import { HRScene } from './scenes/HRScene';
import { SalesScene } from './scenes/SalesScene';
import { SupportScene } from './scenes/SupportScene';
import { BrainScene } from './scenes/BrainScene';
import { ComplianceScene } from './scenes/ComplianceScene';
import { FlowScene } from './scenes/FlowScene';
import { DataScene } from './scenes/DataScene';
import { ConclusionScene } from './scenes/ConclusionScene';

interface ChapterDot {
  id: string;
  label: string;
  agentType?: string;
}

const chapters: ChapterDot[] = [
  { id: 'intro', label: 'Intro' },
  { id: 'hr', label: 'RH', agentType: 'hr' },
  { id: 'sales', label: 'Ventes', agentType: 'sales' },
  { id: 'support', label: 'Support', agentType: 'support' },
  { id: 'brain', label: 'Brain', agentType: 'brain' },
  { id: 'compliance', label: 'Conformité', agentType: 'compliance' },
  { id: 'flow', label: 'Flow', agentType: 'flow' },
  { id: 'data', label: 'Data', agentType: 'data' },
  { id: 'conclusion', label: 'Conclusion' },
];

// Zoom keyframes configuration per scene
const sceneZoomConfigs: Record<string, Array<{ start: number; end: number; scale: number; focusX: number; focusY: number }>> = {
  intro: [],
  hr: [
    { start: 0, end: 10, scale: 1, focusX: 50, focusY: 50 },
    { start: 10, end: 25, scale: 1.5, focusX: 80, focusY: 20 },
    { start: 25, end: 50, scale: 1.3, focusX: 50, focusY: 50 },
    { start: 50, end: 70, scale: 1, focusX: 50, focusY: 50 },
    { start: 70, end: 90, scale: 1.4, focusX: 70, focusY: 70 },
    { start: 90, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  sales: [
    { start: 0, end: 15, scale: 1, focusX: 50, focusY: 50 },
    { start: 15, end: 35, scale: 1.4, focusX: 30, focusY: 40 },
    { start: 35, end: 55, scale: 1.3, focusX: 60, focusY: 50 },
    { start: 55, end: 75, scale: 1.5, focusX: 70, focusY: 60 },
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  support: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 40, scale: 1.4, focusX: 75, focusY: 30 },
    { start: 40, end: 65, scale: 1.3, focusX: 60, focusY: 55 },
    { start: 65, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  brain: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.3, focusX: 50, focusY: 70 },
    { start: 45, end: 75, scale: 1.4, focusX: 50, focusY: 50 },
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  compliance: [
    { start: 0, end: 25, scale: 1, focusX: 50, focusY: 50 },
    { start: 25, end: 50, scale: 1.3, focusX: 40, focusY: 40 },
    { start: 50, end: 80, scale: 1.4, focusX: 60, focusY: 60 },
    { start: 80, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  flow: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.5, focusX: 30, focusY: 50 },
    { start: 45, end: 70, scale: 1.3, focusX: 60, focusY: 50 },
    { start: 70, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  data: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.4, focusX: 50, focusY: 30 },
    { start: 45, end: 75, scale: 1.3, focusX: 60, focusY: 60 },
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  conclusion: [],
};

function getZoomTransform(sceneId: string, progress: number): { scale: number; translateX: number; translateY: number } {
  const config = sceneZoomConfigs[sceneId] || [];
  
  if (config.length === 0) {
    return { scale: 1, translateX: 0, translateY: 0 };
  }

  let currentPhase = config.find(phase => progress >= phase.start && progress < phase.end);
  
  if (!currentPhase) {
    currentPhase = config[config.length - 1];
    if (progress < config[0].start) {
      currentPhase = config[0];
    }
  }

  const currentIndex = config.indexOf(currentPhase);
  const nextPhase = config[currentIndex + 1];

  if (nextPhase && progress >= currentPhase.end - 5) {
    const transitionProgress = (progress - (currentPhase.end - 5)) / 5;
    const eased = Math.min(1, Math.max(0, transitionProgress));
    
    const scale = currentPhase.scale + (nextPhase.scale - currentPhase.scale) * eased;
    const focusX = currentPhase.focusX + (nextPhase.focusX - currentPhase.focusX) * eased;
    const focusY = currentPhase.focusY + (nextPhase.focusY - currentPhase.focusY) * eased;
    
    return {
      scale,
      translateX: (50 - focusX) * (scale - 1) * 0.5,
      translateY: (50 - focusY) * (scale - 1) * 0.5,
    };
  }

  return {
    scale: currentPhase.scale,
    translateX: (50 - currentPhase.focusX) * (currentPhase.scale - 1) * 0.5,
    translateY: (50 - currentPhase.focusY) * (currentPhase.scale - 1) * 0.5,
  };
}

export function CinematicTourPlayer() {
  const navigate = useNavigate();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentScript = tourScripts[currentSceneIndex];
  const totalScenes = tourScripts.length;
  const overallProgress = ((currentSceneIndex + sceneProgress / 100) / totalScenes) * 100;

  const zoomTransform = useMemo(() => {
    return getZoomTransform(currentScript.id, sceneProgress);
  }, [currentScript.id, sceneProgress]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (!isPlaying || isTransitioning) return;

    const startTime = Date.now();
    const duration = currentScript.duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setSceneProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        if (currentSceneIndex < totalScenes - 1) {
          goToNextScene();
        } else {
          setIsPlaying(false);
        }
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [currentSceneIndex, isPlaying, isTransitioning, currentScript.duration]);

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex >= totalScenes - 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneIndex(prev => prev + 1);
      setSceneProgress(0);
      setIsTransitioning(false);
    }, 400);
  }, [currentSceneIndex, totalScenes]);

  const goToScene = useCallback((index: number) => {
    if (index === currentSceneIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneIndex(index);
      setSceneProgress(0);
      setIsTransitioning(false);
      setIsPlaying(true);
    }, 400);
  }, [currentSceneIndex]);

  const handleClose = () => {
    navigate('/');
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
    setShowControls(true);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const handleSkip = () => {
    if (currentSceneIndex < totalScenes - 1) {
      goToNextScene();
    }
  };

  const renderScene = () => {
    const sceneProps = {
      isActive: !isTransitioning && isPlaying,
      progress: sceneProgress,
    };

    switch (currentScript.id) {
      case 'intro':
        return <IntroScene {...sceneProps} />;
      case 'hr':
        return <HRScene {...sceneProps} />;
      case 'sales':
        return <SalesScene {...sceneProps} />;
      case 'support':
        return <SupportScene {...sceneProps} />;
      case 'brain':
        return <BrainScene {...sceneProps} />;
      case 'compliance':
        return <ComplianceScene {...sceneProps} />;
      case 'flow':
        return <FlowScene {...sceneProps} />;
      case 'data':
        return <DataScene {...sceneProps} />;
      case 'conclusion':
        return <ConclusionScene {...sceneProps} onRestart={handleRestart} />;
      default:
        return <IntroScene {...sceneProps} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-background overflow-hidden flex items-center justify-center p-4 md:p-8"
      onMouseMove={() => setShowControls(true)}
      onClick={() => !showControls && setShowControls(true)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
          }}
        />
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-cloud-float" />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-cloud-drift" style={{ animationDelay: '2s' }} />
      </div>

      {/* THE WIDGET - Fixed 16:9 rectangle containing EVERYTHING */}
      <div 
        className="relative w-full max-w-6xl rounded-2xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm"
        style={{
          aspectRatio: '16 / 9',
          boxShadow: '0 25px 80px -20px hsl(var(--primary) / 0.3), 0 10px 30px -10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Progress bar at top - INSIDE widget */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 z-30">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Close button - INSIDE widget */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={cn(
            "absolute top-3 right-3 z-40 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Scene viewport with zoom - MAIN CONTENT AREA */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out origin-center",
              isTransitioning && "opacity-0"
            )}
            style={{
              transform: `scale(${zoomTransform.scale}) translate(${zoomTransform.translateX}%, ${zoomTransform.translateY}%)`,
            }}
          >
            {renderScene()}
          </div>

          {/* Vignette overlay for zoom effect */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: zoomTransform.scale > 1.1 
                ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
                : 'none',
              opacity: zoomTransform.scale > 1.1 ? (zoomTransform.scale - 1) * 2 : 0,
            }}
          />
        </div>

        {/* Zoom indicator - INSIDE widget */}
        {zoomTransform.scale > 1.1 && (
          <div className="absolute top-3 left-3 z-30 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-[10px] font-medium text-muted-foreground flex items-center gap-1 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {Math.round(zoomTransform.scale * 100)}%
          </div>
        )}

        {/* Large play button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl animate-glow-pulse hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6 text-primary-foreground ml-1" />
          </button>
        )}

        {/* Bottom overlay with controls - INSIDE widget */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: 'linear-gradient(to top, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.6) 50%, transparent 100%)',
          }}
        >
          {/* Subtitles */}
          <div className="px-4 pb-2 pt-6">
            <div className="max-w-xl mx-auto bg-background/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/20">
              <p className="text-center text-foreground/90 text-xs md:text-sm leading-relaxed line-clamp-2">
                {currentScript.text}
              </p>
            </div>
          </div>

          {/* Chapter navigation */}
          <div className="px-4 py-2 flex items-center justify-center gap-1">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => goToScene(index)}
                className={cn(
                  "relative px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium transition-all duration-300",
                  index === currentSceneIndex
                    ? "bg-primary text-primary-foreground"
                    : index < currentSceneIndex
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                )}
              >
                {chapter.label}
                {index === currentSceneIndex && (
                  <div 
                    className="absolute bottom-0 left-0 h-0.5 bg-primary-foreground/50 rounded-full"
                    style={{ width: `${sceneProgress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Playback controls */}
          <div className="px-4 pb-3 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRestart}
              className="w-7 h-7 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              disabled={currentSceneIndex >= totalScenes - 1}
              className="w-7 h-7 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
            >
              <SkipForward className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="w-7 h-7 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
