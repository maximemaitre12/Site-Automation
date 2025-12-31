import React, { useState, useEffect, useCallback } from 'react';
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
    }, 600);
  }, [currentSceneIndex, totalScenes]);

  const handleClose = () => navigate('/');
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
    if (currentSceneIndex < totalScenes - 1) goToNextScene();
  };

  const renderScene = () => {
    const sceneProps = {
      isActive: !isTransitioning && isPlaying,
      progress: sceneProgress,
    };

    switch (currentScript.id) {
      case 'intro': return <IntroScene {...sceneProps} />;
      case 'hr': return <HRScene {...sceneProps} />;
      case 'sales': return <SalesScene {...sceneProps} />;
      case 'support': return <SupportScene {...sceneProps} />;
      case 'brain': return <BrainScene {...sceneProps} />;
      case 'compliance': return <ComplianceScene {...sceneProps} />;
      case 'flow': return <FlowScene {...sceneProps} />;
      case 'data': return <DataScene {...sceneProps} />;
      case 'conclusion': return <ConclusionScene {...sceneProps} onRestart={handleRestart} />;
      default: return <IntroScene {...sceneProps} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
    >
      {/* 16:9 Container - strictly contained */}
      <div 
        className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
        style={{
          boxShadow: '0 0 100px hsl(var(--primary) / 0.2)',
        }}
      >
        {/* Scene content - fills entire container */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-600 ease-out",
            isTransitioning && "opacity-0 scale-105 blur-sm"
          )}
        >
          {renderScene()}
        </div>

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-40">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-100"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Scene indicator dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          {tourScripts.map((script, index) => (
            <div
              key={script.id}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === currentSceneIndex
                  ? "w-8 h-2 bg-primary"
                  : index < currentSceneIndex
                    ? "w-2 h-2 bg-primary/60"
                    : "w-2 h-2 bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Play button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center hover:scale-110 transition-transform border border-primary/30"
            style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.4)' }}
          >
            <Play className="w-8 h-8 text-primary ml-1" />
          </button>
        )}

        {/* Bottom controls */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 z-40 p-4 transition-all duration-300",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 border-0"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 border-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm text-primary hover:bg-primary/30 border border-primary/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                disabled={currentSceneIndex >= totalScenes - 1}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 border-0 disabled:opacity-30"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Scene title */}
            <div className="text-right">
              <div className="text-white/60 text-xs">{currentSceneIndex + 1}/{totalScenes}</div>
              <div className="text-white font-medium text-sm">{currentScript.title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
