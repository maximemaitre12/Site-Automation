import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourScripts, getTotalDuration } from '@/data/tourNarration';
import { TourAgentHR } from './agents/TourAgentHR';
import { TourAgentSales } from './agents/TourAgentSales';
import { TourAgentSupport } from './agents/TourAgentSupport';
import { TourAgentBrain } from './agents/TourAgentBrain';
import { TourAgentCompliance } from './agents/TourAgentCompliance';
import { TourAgentFlow } from './agents/TourAgentFlow';
import { TourAgentData } from './agents/TourAgentData';
import { Play, Pause, Volume2, VolumeX, SkipForward, Maximize2, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductTourPlayer() {
  const navigate = useNavigate();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentScript = tourScripts[currentSceneIndex];
  const totalProgress = ((currentSceneIndex + sceneProgress / 100) / tourScripts.length) * 100;

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  // Scene progression
  useEffect(() => {
    if (!isPlaying) return;

    const duration = currentScript.duration;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setSceneProgress(prev => {
        if (prev >= 100) {
          if (currentSceneIndex < tourScripts.length - 1) {
            setCurrentSceneIndex(i => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScript.duration]);

  // Reset scene progress on scene change
  useEffect(() => {
    setSceneProgress(0);
  }, [currentSceneIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const skipNext = () => {
    if (currentSceneIndex < tourScripts.length - 1) {
      setCurrentSceneIndex(i => i + 1);
      setSceneProgress(0);
    }
  };

  const restart = () => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const seekToScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSceneProgress(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    navigate('/');
  };

  // Auto-start
  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderScene = () => {
    const isActive = isPlaying;
    
    if (currentScript.id === 'intro') {
      return <IntroScene isActive={isActive} />;
    }
    
    if (currentScript.id === 'conclusion') {
      return <ConclusionScene isActive={isActive} onRestart={restart} />;
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        {currentScript.agentType === 'hr' && <TourAgentHR isActive={isActive} />}
        {currentScript.agentType === 'sales' && <TourAgentSales isActive={isActive} />}
        {currentScript.agentType === 'support' && <TourAgentSupport isActive={isActive} />}
        {currentScript.agentType === 'brain' && <TourAgentBrain isActive={isActive} />}
        {currentScript.agentType === 'compliance' && <TourAgentCompliance isActive={isActive} />}
        {currentScript.agentType === 'flow' && <TourAgentFlow isActive={isActive} />}
        {currentScript.agentType === 'data' && <TourAgentData isActive={isActive} />}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Video container - 16:9 aspect ratio */}
      <div 
        className="relative w-full max-w-[1400px] aspect-video bg-background rounded-lg overflow-hidden shadow-2xl mx-4"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main content area */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          {renderScene()}
        </div>

        {/* Subtitles */}
        {currentScript.id !== 'intro' && currentScript.id !== 'conclusion' && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center px-8 pointer-events-none">
            <div className={cn(
              "max-w-3xl bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 transition-all duration-300",
              showControls ? "opacity-100" : "opacity-90"
            )}>
              <p className="text-white text-center text-sm md:text-base leading-relaxed">
                {currentScript.text}
              </p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-4 px-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex gap-1">
              {tourScripts.map((script, i) => (
                <button
                  key={script.id}
                  onClick={() => seekToScene(i)}
                  className="flex-1 h-1 rounded-full overflow-hidden bg-white/30 hover:bg-white/40 transition-all group"
                >
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-100",
                      i < currentSceneIndex ? "w-full" :
                      i === currentSceneIndex ? "" : "w-0"
                    )}
                    style={i === currentSceneIndex ? { width: `${sceneProgress}%` } : undefined}
                  />
                </button>
              ))}
            </div>
            {/* Scene labels */}
            <div className="flex gap-1 mt-1">
              {tourScripts.map((script, i) => (
                <div 
                  key={script.id}
                  className={cn(
                    "flex-1 text-center text-[10px] transition-all",
                    i === currentSceneIndex ? "text-primary font-medium" : "text-white/50"
                  )}
                >
                  {script.title.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Skip */}
              <button
                onClick={skipNext}
                disabled={currentSceneIndex >= tourScripts.length - 1}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Restart */}
              <button
                onClick={restart}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Time */}
              <span className="text-white/70 text-sm ml-2">
                {currentSceneIndex + 1} / {tourScripts.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Current scene title */}
              <span className="text-white font-medium text-sm hidden md:block">
                {currentScript.title}
              </span>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Play button overlay when paused */}
        {!isPlaying && currentScript.id !== 'conclusion' && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-primary-foreground ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Intro Scene Component
function IntroScene({ isActive }: { isActive: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      return;
    }

    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 3000),
      setTimeout(() => setStep(4), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      {/* Logo */}
      <div className={cn(
        "mb-8 transition-all duration-1000",
        step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
      )}>
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-2xl shadow-primary/30">
          <span className="text-4xl font-bold text-primary-foreground">A</span>
        </div>
      </div>

      {/* Title */}
      <h1 className={cn(
        "text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-4 transition-all duration-1000",
        step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        AETHER
      </h1>

      {/* Subtitle */}
      <p className={cn(
        "text-xl md:text-2xl text-muted-foreground mb-8 transition-all duration-1000",
        step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        7 AI Agents. One Unified Platform.
      </p>

      {/* Stats */}
      <div className={cn(
        "flex gap-8 transition-all duration-1000",
        step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {[
          { value: '10K+', label: 'Utilisateurs' },
          { value: '1M+', label: 'Tâches automatisées' },
          { value: '95%', label: 'Satisfaction' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Conclusion Scene Component
function ConclusionScene({ isActive, onRestart }: { isActive: boolean; onRestart: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      return;
    }

    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      {/* Check mark */}
      <div className={cn(
        "mb-8 transition-all duration-700",
        step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
      )}>
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className={cn(
        "text-4xl md:text-5xl font-bold mb-4 transition-all duration-700",
        step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        Prêt à transformer votre entreprise?
      </h2>

      {/* Subtitle */}
      <p className={cn(
        "text-lg text-muted-foreground mb-8 max-w-2xl transition-all duration-700",
        step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        Rejoignez les milliers d'entreprises qui utilisent AETHER pour automatiser leurs opérations et gagner des heures chaque semaine.
      </p>

      {/* CTAs */}
      <div className={cn(
        "flex gap-4 transition-all duration-700",
        step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <button
          onClick={() => navigate('/auth')}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          Commencer Gratuitement
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-muted text-foreground rounded-xl font-semibold text-lg hover:bg-muted/80 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Revoir
        </button>
      </div>
    </div>
  );
}
