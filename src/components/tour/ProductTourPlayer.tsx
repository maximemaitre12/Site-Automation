import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourScripts } from '@/data/tourNarration';
import { TourAgentHR } from './agents/TourAgentHR';
import { TourAgentSales } from './agents/TourAgentSales';
import { TourAgentSupport } from './agents/TourAgentSupport';
import { TourAgentBrain } from './agents/TourAgentBrain';
import { TourAgentCompliance } from './agents/TourAgentCompliance';
import { TourAgentFlow } from './agents/TourAgentFlow';
import { TourAgentData } from './agents/TourAgentData';
import { Play, Pause, Volume2, VolumeX, SkipForward, Maximize2, X, RotateCcw, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductTourPlayer() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentScript = tourScripts[currentSceneIndex];
  const totalScenes = tourScripts.length;

  // Auto-hide controls after 3s
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
          if (currentSceneIndex < totalScenes - 1) {
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
  }, [isPlaying, currentSceneIndex, currentScript.duration, totalScenes]);

  // Reset progress on scene change
  useEffect(() => {
    setSceneProgress(0);
  }, [currentSceneIndex]);

  // Auto-start
  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const skipNext = () => {
    if (currentSceneIndex < totalScenes - 1) {
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

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.log('Fullscreen not supported');
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    navigate('/');
  };

  const renderScene = () => {
    const isActive = isPlaying;

    if (currentScript.id === 'intro') {
      return <IntroScene isActive={isActive} />;
    }

    if (currentScript.id === 'conclusion') {
      return <ConclusionScene isActive={isActive} onRestart={restart} />;
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-6">
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
      {/* 16:9 Video container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[1400px] aspect-video bg-background rounded-xl overflow-hidden shadow-2xl mx-4"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main content */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {renderScene()}
        </div>

        {/* Subtitles */}
        {currentScript.id !== 'intro' && currentScript.id !== 'conclusion' && (
          <div className="absolute bottom-28 left-0 right-0 flex justify-center px-8 pointer-events-none z-20">
            <div className="max-w-3xl bg-black/80 backdrop-blur-md rounded-lg px-6 py-3 border border-white/10">
              <p className="text-white text-center text-sm md:text-base leading-relaxed">
                {currentScript.text}
              </p>
            </div>
          </div>
        )}

        {/* YouTube-style controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 z-30",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress bar segments */}
          <div className="mb-3">
            <div className="flex gap-1">
              {tourScripts.map((script, i) => (
                <button
                  key={script.id}
                  onClick={() => seekToScene(i)}
                  className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 hover:bg-white/30 transition-all group relative"
                  title={script.title}
                >
                  <div
                    className={cn(
                      "h-full bg-red-600 transition-all duration-100",
                      i < currentSceneIndex ? "w-full" : i === currentSceneIndex ? "" : "w-0"
                    )}
                    style={i === currentSceneIndex ? { width: `${sceneProgress}%` } : undefined}
                  />
                </button>
              ))}
            </div>
            {/* Scene labels */}
            <div className="flex gap-1 mt-2">
              {tourScripts.map((script, i) => (
                <div
                  key={script.id}
                  className={cn(
                    "flex-1 text-center text-[10px] truncate transition-all",
                    i === currentSceneIndex ? "text-white font-medium" : "text-white/40"
                  )}
                >
                  {script.title.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Skip */}
              <button
                onClick={skipNext}
                disabled={currentSceneIndex >= totalScenes - 1}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Restart */}
              <button
                onClick={restart}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Progress */}
              <span className="text-white/70 text-sm ml-3 font-medium">
                {currentSceneIndex + 1} / {totalScenes}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Current title */}
              <span className="text-white font-medium text-sm hidden md:block">
                {currentScript.title}
              </span>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Big play button when paused */}
        {!isPlaying && currentScript.id !== 'conclusion' && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-20"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-red-600/90 flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-red-600 transition-all">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Intro Scene - immediately visible
function IntroScene({ isActive }: { isActive: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse" />

      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 relative">
          <span className="text-5xl font-bold text-white">A</span>
          <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl blur-xl opacity-50 -z-10" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
        AETHER
      </h1>

      {/* Subtitle with sparkle */}
      <div className="flex items-center gap-2 text-xl md:text-2xl text-violet-200 mb-12">
        <Sparkles className="w-5 h-5 text-violet-400" />
        <span>7 AI Agents. Une Plateforme. Zéro Code.</span>
      </div>

      {/* Stats */}
      <div className="flex gap-12">
        {[
          { value: '10K+', label: 'Utilisateurs' },
          { value: '1M+', label: 'Tâches automatisées' },
          { value: '95%', label: 'Satisfaction' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-white/60 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Conclusion Scene
function ConclusionScene({ isActive, onRestart }: { isActive: boolean; onRestart: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      return;
    }

    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10" />

      {/* Checkmark */}
      <div
        className={cn(
          "mb-8 transition-all duration-700 ease-out",
          step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
      >
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      {/* Title */}
      <h2
        className={cn(
          "text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700 ease-out",
          step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        Prêt à transformer votre entreprise ?
      </h2>

      {/* Subtitle */}
      <p
        className={cn(
          "text-lg text-white/60 mb-10 max-w-2xl transition-all duration-700 ease-out",
          step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        Rejoignez les milliers d'entreprises qui utilisent AETHER pour automatiser
        leurs opérations et gagner des heures chaque semaine.
      </p>

      {/* CTAs */}
      <div
        className={cn(
          "flex gap-4 transition-all duration-700 ease-out",
          step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <button
          onClick={() => navigate('/auth')}
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
        >
          Commencer Gratuitement
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
        >
          <RotateCcw className="w-5 h-5" />
          Revoir
        </button>
      </div>
    </div>
  );
}
