import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
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

// Zoom keyframes configuration per scene
const sceneZoomConfigs: Record<string, Array<{ start: number; end: number; scale: number; focusX: number; focusY: number }>> = {
  intro: [
    { start: 0, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
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
  conclusion: [
    { start: 0, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
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
      timeout = setTimeout(() => setShowControls(false), 2000);
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
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* THE WIDGET - Fixed 16:9 rectangle */}
      <div 
        className="relative w-full max-w-6xl rounded-2xl overflow-hidden border border-border/30 bg-card"
        style={{
          aspectRatio: '16 / 9',
          boxShadow: '0 25px 80px -20px hsl(var(--primary) / 0.25), 0 10px 40px -15px rgba(0,0,0,0.4)',
        }}
      >
        {/* Progress bar - minimal, at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted/20 z-30">
          <div 
            className="h-full bg-primary/80 transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Scene viewport with zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out origin-center",
              isTransitioning && "opacity-0 scale-95"
            )}
            style={{
              transform: isTransitioning ? undefined : `scale(${zoomTransform.scale}) translate(${zoomTransform.translateX}%, ${zoomTransform.translateY}%)`,
            }}
          >
            {renderScene()}
          </div>

          {/* Vignette overlay for zoom effect */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: zoomTransform.scale > 1.1 
                ? 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)'
                : 'none',
              opacity: zoomTransform.scale > 1.1 ? Math.min((zoomTransform.scale - 1) * 1.5, 0.8) : 0,
            }}
          />
        </div>

        {/* Large play button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
            style={{
              boxShadow: '0 0 60px hsl(var(--primary) / 0.5)',
            }}
          >
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </button>
        )}

        {/* Minimal controls overlay - only visible on hover */}
        <div 
          className={cn(
            "absolute inset-0 z-30 transition-opacity duration-300 pointer-events-none",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border-0 text-white/80 hover:text-white hover:bg-black/60 pointer-events-auto"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Bottom controls */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRestart}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border-0 text-white/80 hover:text-white hover:bg-black/60"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border-0 text-white hover:bg-black/70"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              disabled={currentSceneIndex >= totalScenes - 1}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border-0 text-white/80 hover:text-white hover:bg-black/60 disabled:opacity-30"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Scene dots indicator - minimal */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1">
            {tourScripts.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentSceneIndex
                    ? "bg-white w-4"
                    : index < currentSceneIndex
                      ? "bg-white/60"
                      : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
