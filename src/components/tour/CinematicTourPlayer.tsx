import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts, TourScript } from '@/data/tourNarration';

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
        // Move to next scene
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
      className="fixed inset-0 z-50 bg-background overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={() => !showControls && setShowControls(true)}
    >
      {/* Animated background - clouds like landing page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient base */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Floating clouds */}
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-cloud-float" />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-cloud-drift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[30%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-cloud-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
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

      {/* Main scene container */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-400",
          isTransitioning && "opacity-0 scale-95"
        )}
      >
        {renderScene()}
      </div>

      {/* Subtitles */}
      <div 
        className={cn(
          "absolute bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-full px-8 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div 
          className="bg-background/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-border/30"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <p className="text-center text-foreground/90 text-lg leading-relaxed">
            {currentScript.text}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {/* Chapter navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => goToScene(index)}
              className={cn(
                "group relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                index === currentSceneIndex
                  ? "bg-primary text-primary-foreground"
                  : index < currentSceneIndex
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {chapter.label}
              
              {/* Progress indicator for current chapter */}
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
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="w-14 h-14 rounded-full shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            disabled={currentSceneIndex >= totalScenes - 1}
            className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Large play button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl animate-glow-pulse hover:scale-105 transition-transform"
        >
          <Play className="w-10 h-10 text-primary-foreground ml-1" />
        </button>
      )}

      {/* Keyboard shortcuts hint */}
      <div 
        className={cn(
          "absolute bottom-4 right-6 text-xs text-muted-foreground transition-opacity duration-300",
          showControls ? "opacity-50" : "opacity-0"
        )}
      >
        <span className="hidden md:inline">Espace: pause • →: suivant • Échap: fermer</span>
      </div>
    </div>
  );
}
