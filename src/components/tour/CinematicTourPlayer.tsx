import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts } from '@/data/tourNarration';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

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
  const [showLogo, setShowLogo] = useState(true);

  const currentScript = tourScripts[currentSceneIndex];
  const totalScenes = tourScripts.length;
  const overallProgress = ((currentSceneIndex + sceneProgress / 100) / totalScenes) * 100;

  // Show logo at the start of each agent scene
  useEffect(() => {
    if (currentScript.id !== 'intro' && currentScript.id !== 'conclusion') {
      setShowLogo(true);
      const timer = setTimeout(() => setShowLogo(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowLogo(false);
    }
  }, [currentSceneIndex, currentScript.id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (!isPlaying || isTransitioning || showLogo) return;

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
  }, [currentSceneIndex, isPlaying, isTransitioning, currentScript.duration, showLogo]);

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
      isActive: !isTransitioning && isPlaying && !showLogo,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 p-4 md:p-8"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Available area (accounts for padding) */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* 16:9 Frame (YouTube style - wide rectangle) */}
        <div
          className="relative w-full h-auto max-h-full overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{
            aspectRatio: '16 / 9',
            maxWidth: 'calc((100vh - 4rem) * 16 / 9)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Frameless Aether Logo - shows at start of each agent scene */}
          <div
            className={cn(
              "absolute inset-0 z-30 flex items-center justify-center bg-white transition-all duration-700",
              showLogo ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <img
              src={aetherLogo}
              alt="Aether"
              className={cn(
                "w-32 h-32 md:w-48 md:h-48 object-contain rounded-2xl transition-all duration-700",
                showLogo ? "scale-100 blur-0" : "scale-110 blur-sm"
              )}
              style={{
                filter: showLogo ? 'drop-shadow(0 0 40px hsl(var(--primary) / 0.3))' : 'none',
              }}
            />
          </div>

          {/* Scene content - fills entire 16:9 frame */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-600 ease-out bg-white",
              isTransitioning && "opacity-0 scale-105 blur-sm",
              showLogo && "opacity-0"
            )}
          >
            {renderScene()}
          </div>

          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-40">
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
                    ? "w-8 h-2 bg-primary shadow-lg"
                    : index < currentSceneIndex
                      ? "w-2 h-2 bg-primary/60"
                      : "w-2 h-2 bg-slate-300"
                )}
                style={index === currentSceneIndex ? { 
                  boxShadow: '0 0 10px hsl(var(--primary) / 0.5)' 
                } : {}}
              />
            ))}
          </div>

          {/* Play button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-20 h-20 rounded-full bg-primary/90 backdrop-blur-xl flex items-center justify-center hover:scale-110 transition-transform"
              style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.5)' }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
          )}

          {/* Bottom controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 z-40 p-4 transition-all duration-300",
              "bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent",
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
                  className="w-12 h-12 rounded-full bg-primary backdrop-blur-sm text-white hover:bg-primary/90"
                  style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' }}
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
                <div className="text-white/60 text-xs">
                  {currentSceneIndex + 1}/{totalScenes}
                </div>
                <div className="text-white font-medium text-sm">{currentScript.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
