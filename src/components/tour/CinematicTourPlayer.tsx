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
// Each scene can have multiple zoom phases: { start: progress%, end: progress%, scale: number, focusX: %, focusY: % }
const sceneZoomConfigs: Record<string, Array<{ start: number; end: number; scale: number; focusX: number; focusY: number }>> = {
  intro: [],
  hr: [
    { start: 0, end: 10, scale: 1, focusX: 50, focusY: 50 }, // Full view
    { start: 10, end: 25, scale: 1.5, focusX: 80, focusY: 20 }, // Zoom on + button
    { start: 25, end: 50, scale: 1.3, focusX: 50, focusY: 50 }, // Dialog zoom
    { start: 50, end: 70, scale: 1, focusX: 50, focusY: 50 }, // Back to full
    { start: 70, end: 90, scale: 1.4, focusX: 70, focusY: 70 }, // Zoom on new candidate
    { start: 90, end: 100, scale: 1, focusX: 50, focusY: 50 }, // Full view finale
  ],
  sales: [
    { start: 0, end: 15, scale: 1, focusX: 50, focusY: 50 },
    { start: 15, end: 35, scale: 1.4, focusX: 30, focusY: 40 }, // Zoom on deal card
    { start: 35, end: 55, scale: 1.3, focusX: 60, focusY: 50 }, // Recording area
    { start: 55, end: 75, scale: 1.5, focusX: 70, focusY: 60 }, // AI analysis
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  support: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 40, scale: 1.4, focusX: 75, focusY: 30 }, // New ticket
    { start: 40, end: 65, scale: 1.3, focusX: 60, focusY: 55 }, // AI response
    { start: 65, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  brain: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.3, focusX: 50, focusY: 70 }, // Chat input
    { start: 45, end: 75, scale: 1.4, focusX: 50, focusY: 50 }, // AI thinking
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  compliance: [
    { start: 0, end: 25, scale: 1, focusX: 50, focusY: 50 },
    { start: 25, end: 50, scale: 1.3, focusX: 40, focusY: 40 }, // Audit selector
    { start: 50, end: 80, scale: 1.4, focusX: 60, focusY: 60 }, // Results
    { start: 80, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  flow: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.5, focusX: 30, focusY: 50 }, // Block palette
    { start: 45, end: 70, scale: 1.3, focusX: 60, focusY: 50 }, // Canvas
    { start: 70, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  data: [
    { start: 0, end: 20, scale: 1, focusX: 50, focusY: 50 },
    { start: 20, end: 45, scale: 1.4, focusX: 50, focusY: 30 }, // Search
    { start: 45, end: 75, scale: 1.3, focusX: 60, focusY: 60 }, // Company details
    { start: 75, end: 100, scale: 1, focusX: 50, focusY: 50 },
  ],
  conclusion: [],
};

function getZoomTransform(sceneId: string, progress: number): { scale: number; translateX: number; translateY: number } {
  const config = sceneZoomConfigs[sceneId] || [];
  
  if (config.length === 0) {
    return { scale: 1, translateX: 0, translateY: 0 };
  }

  // Find current zoom phase
  let currentPhase = config.find(phase => progress >= phase.start && progress < phase.end);
  
  if (!currentPhase) {
    // Use last phase if beyond all phases
    currentPhase = config[config.length - 1];
    if (progress < config[0].start) {
      currentPhase = config[0];
    }
  }

  // Find next phase for smooth interpolation
  const currentIndex = config.indexOf(currentPhase);
  const nextPhase = config[currentIndex + 1];

  if (nextPhase && progress >= currentPhase.end - 5) {
    // Smooth transition to next phase
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

  // Calculate zoom transform
  const zoomTransform = useMemo(() => {
    return getZoomTransform(currentScript.id, sceneProgress);
  }, [currentScript.id, sceneProgress]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Scene progression
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

  // Render current scene
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
      className="fixed inset-0 z-50 bg-background overflow-hidden flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
      onClick={() => !showControls && setShowControls(true)}
    >
      {/* Animated background - clouds like landing page */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
          }}
        />
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-cloud-float" />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-cloud-drift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[30%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-cloud-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className={cn(
          "absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Main widget container - rectangular bounded area */}
      <div className="relative w-[90vw] max-w-6xl aspect-[16/9] flex flex-col">
        {/* Widget header with progress */}
        <div className="relative h-2 bg-muted/50 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Scene viewport - bounded rectangle with zoom */}
        <div 
          className={cn(
            "relative flex-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-b-2xl overflow-hidden",
            "shadow-2xl"
          )}
          style={{
            boxShadow: '0 25px 80px -20px hsl(var(--primary) / 0.3), 0 10px 30px -10px rgba(0,0,0,0.3)',
          }}
        >
          {/* Inner scene container with zoom effect */}
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

          {/* Zoom indicator */}
          {zoomTransform.scale > 1.1 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground flex items-center gap-1.5 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Zoom {Math.round(zoomTransform.scale * 100)}%
            </div>
          )}

          {/* Large play button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl animate-glow-pulse hover:scale-105 transition-transform"
            >
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </button>
          )}
        </div>

        {/* Subtitles - positioned below widget */}
        <div 
          className={cn(
            "mt-6 px-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-70"
          )}
        >
          <div 
            className="max-w-2xl mx-auto bg-background/80 backdrop-blur-md rounded-xl px-5 py-3 border border-border/30"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <p className="text-center text-foreground/90 text-sm md:text-base leading-relaxed">
              {currentScript.text}
            </p>
          </div>
        </div>

        {/* Chapter navigation */}
        <div className="mt-4 flex items-center justify-center gap-1.5 md:gap-2">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => goToScene(index)}
              className={cn(
                "group relative px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300",
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
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-foreground/50 rounded-full transition-all duration-100"
                  style={{ width: `${sceneProgress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Playback controls */}
        <div 
          className={cn(
            "mt-4 flex items-center justify-center gap-2 md:gap-3 transition-all duration-300",
            showControls ? "opacity-100" : "opacity-50"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            disabled={currentSceneIndex >= totalScenes - 1}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            <SkipForward className="w-3 h-3 md:w-4 md:h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
            )}
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div 
          className={cn(
            "mt-3 text-center text-[10px] md:text-xs text-muted-foreground transition-opacity duration-300",
            showControls ? "opacity-40" : "opacity-0"
          )}
        >
          <span className="hidden md:inline">Espace: pause • →: suivant • Échap: fermer</span>
        </div>
      </div>
    </div>
  );
}
