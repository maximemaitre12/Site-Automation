import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipForward, RotateCcw, Users, TrendingUp, Zap, Brain, Shield, Workflow, Database, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts } from '@/data/tourNarration';
import aetherLogo from '@/assets/aether-new-logo.jpeg';
import { SpringIn } from './animations';

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

// Agent intro data with Lucide icons (consistent with Landing Page)
const agentIntros: Record<string, { icon: React.ElementType; color: string; bgColor: string; title: string; description: string }> = {
  hr: { 
    icon: Users, 
    color: 'text-agent-hr',
    bgColor: 'bg-agent-hr/10',
    title: 'HR Copilot', 
    description: 'AI-powered recruitment and talent management. From CV analysis to interview scheduling.'
  },
  sales: { 
    icon: TrendingUp, 
    color: 'text-agent-sales',
    bgColor: 'bg-agent-sales/10',
    title: 'Sales Copilot', 
    description: 'Intelligent sales acceleration. Call analysis, proposals, and deal insights.'
  },
  support: { 
    icon: Zap, 
    color: 'text-agent-support',
    bgColor: 'bg-agent-support/10',
    title: 'Support Agent', 
    description: 'Automated customer service with instant resolution and smart escalation.'
  },
  brain: { 
    icon: Brain, 
    color: 'text-agent-brain',
    bgColor: 'bg-agent-brain/10',
    title: 'Brain', 
    description: 'Your company knowledge hub. Semantic search across all documents.'
  },
  compliance: { 
    icon: Shield, 
    color: 'text-agent-compliance',
    bgColor: 'bg-agent-compliance/10',
    title: 'Compliance Agent', 
    description: 'Automated regulatory compliance. GDPR audits and risk detection.'
  },
  flow: { 
    icon: Workflow, 
    color: 'text-agent-flow',
    bgColor: 'bg-agent-flow/10',
    title: 'Flow Automation', 
    description: 'No-code workflow builder. Automate any process visually.'
  },
  data: { 
    icon: Database, 
    color: 'text-agent-data',
    bgColor: 'bg-agent-data/10',
    title: 'Data Platform', 
    description: 'Business intelligence and company enrichment in real-time.'
  },
};

export function CinematicTourPlayer() {
  const navigate = useNavigate();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const currentScript = tourScripts[currentSceneIndex];
  const totalScenes = tourScripts.length;
  const overallProgress = ((currentSceneIndex + sceneProgress / 100) / totalScenes) * 100;

  // Get agent intro data for current scene
  const currentAgentIntro = agentIntros[currentScript.id];
  const isAgentScene = currentAgentIntro !== undefined;

  // Hide intro after delay - intro is pre-activated in goToNextScene
  useEffect(() => {
    if (isAgentScene && showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (!isAgentScene) {
      setShowIntro(false);
    }
  }, [currentSceneIndex, isAgentScene, showIntro]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (!isPlaying || isTransitioning || showIntro) return;

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
  }, [currentSceneIndex, isPlaying, isTransitioning, currentScript.duration, showIntro]);

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex >= totalScenes - 1) return;
    
    setIsTransitioning(true);
    
    // Pre-activate intro for the next scene BEFORE transitioning
    const nextSceneId = tourScripts[currentSceneIndex + 1]?.id;
    const isNextAgentScene = nextSceneId && agentIntros[nextSceneId] !== undefined;
    
    setTimeout(() => {
      // Set intro BEFORE changing scene to avoid flash
      if (isNextAgentScene) {
        setShowIntro(true);
      }
      setSceneProgress(0);
      setCurrentSceneIndex(prev => prev + 1);
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
      isActive: !isTransitioning && isPlaying && !showIntro,
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

  // Render agent intro overlay - refined, smaller styling
  const renderAgentIntro = () => {
    if (!currentAgentIntro) return null;
    const Icon = currentAgentIntro.icon;

    return (
      <div
        className={cn(
          "absolute inset-0 z-30 flex flex-col items-center justify-center bg-white transition-all duration-700 overflow-hidden",
          showIntro ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Subtle background accent */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          showIntro ? "opacity-100" : "opacity-0"
        )}>
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full blur-[120px]",
            currentAgentIntro.bgColor,
            "opacity-30"
          )} />
        </div>

        <SpringIn active={showIntro} delay={100}>
          <div className={cn(
            "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg",
            currentAgentIntro.bgColor
          )}>
            <Icon className={cn("w-7 h-7 md:w-8 md:h-8", currentAgentIntro.color)} />
          </div>
        </SpringIn>
        
        <SpringIn active={showIntro} delay={200}>
          <h2 className={cn(
            "text-lg md:text-xl font-semibold mb-2 text-center",
            currentAgentIntro.color
          )}>
            {currentAgentIntro.title}
          </h2>
        </SpringIn>
        
        <SpringIn active={showIntro} delay={300}>
          <p className="text-muted-foreground text-center max-w-xs px-6 text-xs md:text-sm line-clamp-2">
            {currentAgentIntro.description}
          </p>
        </SpringIn>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-slate-100 pt-14"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Main content area - 16:9 frame centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-4 overflow-hidden">
        {/* 16:9 Frame (YouTube style - wide rectangle) */}
        <div
          className="relative w-full h-auto overflow-hidden rounded-2xl bg-white shadow-2xl shrink-0"
          style={{
            aspectRatio: '16 / 9',
            maxWidth: 'calc((100vh - 14rem) * 16 / 9)',
            maxHeight: 'calc(100vh - 14rem)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Agent-specific intro overlay */}
          {isAgentScene && renderAgentIntro()}

          {/* Scene content - fills entire 16:9 frame */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-600 ease-out bg-white",
              isTransitioning && "opacity-0 scale-105 blur-sm",
              showIntro && "opacity-0"
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
        </div>

        {/* CTA Buttons under video */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 shrink-0">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/contact')}
            className="px-6 py-5 text-sm rounded-xl border-primary/30 hover:bg-primary/5 hover:border-primary/50 group"
          >
            <Calendar className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
            Demander une démo
          </Button>
          
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="px-6 py-5 text-sm rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Bottom controls - fixed at page bottom, outside the rectangle */}
      <div
        className={cn(
          "w-full px-4 md:px-8 pb-4 pt-2 transition-all duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-slate-900/90 backdrop-blur-xl rounded-full px-4 py-2 shadow-xl">
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
          <div className="text-right min-w-[100px]">
            <div className="text-white/60 text-xs">
              {currentSceneIndex + 1}/{totalScenes}
            </div>
            <div className="text-white font-medium text-sm truncate">{currentScript.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
