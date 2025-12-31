import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, Users, TrendingUp, Zap, Brain, Shield, Workflow, Database, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { tourScripts } from '@/data/tourNarration';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentScript = tourScripts[currentSceneIndex];
  const totalScenes = tourScripts.length;
  const overallProgress = ((currentSceneIndex + sceneProgress / 100) / totalScenes) * 100;

  // Get agent intro data for current scene
  const currentAgentIntro = agentIntros[currentScript.id];
  const isAgentScene = currentAgentIntro !== undefined;

  // Hide intro after delay
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

  // Use ref to track progress start time to avoid resetting on dependency changes
  const progressStartRef = useRef<{ startTime: number; initialProgress: number } | null>(null);
  const goToNextSceneRef = useRef<() => void>();

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex >= totalScenes - 1) return;
    
    setIsTransitioning(true);
    
    const nextSceneId = tourScripts[currentSceneIndex + 1]?.id;
    const isNextAgentScene = nextSceneId && agentIntros[nextSceneId] !== undefined;
    
    setTimeout(() => {
      if (isNextAgentScene) {
        setShowIntro(true);
      }
      setSceneProgress(0);
      progressStartRef.current = null;
      setCurrentSceneIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 600);
  }, [currentSceneIndex, totalScenes]);

  // Keep ref updated
  goToNextSceneRef.current = goToNextScene;

  useEffect(() => {
    if (!isPlaying || isTransitioning || showIntro || isDragging) {
      // Reset progress tracking when paused
      progressStartRef.current = null;
      return;
    }

    // Initialize progress tracking only once per scene
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
          goToNextSceneRef.current?.();
        } else {
          setIsPlaying(false);
        }
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [currentSceneIndex, isPlaying, isTransitioning, currentScript.duration, showIntro, isDragging, totalScenes]);

  const handleClose = () => navigate('/');
  const togglePlay = () => setIsPlaying(prev => !prev);
  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  // Handle progress bar interaction
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    // Calculate which scene and progress
    const targetProgress = Math.max(0, Math.min(100, percentage));
    const sceneFloat = (targetProgress / 100) * totalScenes;
    const newSceneIndex = Math.min(Math.floor(sceneFloat), totalScenes - 1);
    const newSceneProgress = (sceneFloat - newSceneIndex) * 100;
    
    setCurrentSceneIndex(newSceneIndex);
    setSceneProgress(newSceneProgress);
    setShowIntro(false);
  };

  const handleProgressBarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressBarRef.current) return;
    handleProgressBarClick(e);
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
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-100 pt-14">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-start px-3 md:px-8 py-1 overflow-hidden">
        {/* 16:9 Frame - reduced max height for mobile */}
        <div
          className="relative w-full overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-2xl shrink-0"
          style={{
            aspectRatio: '16 / 9',
            maxWidth: 'calc((100vh - 14rem) * 16 / 9)',
            maxHeight: 'calc(100vh - 14rem)',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            <X className="w-4 h-4 text-foreground/70" />
          </button>

          {/* Agent intro overlay */}
          {isAgentScene && renderAgentIntro()}

          {/* Scene content */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-600 ease-out bg-white",
              isTransitioning && "opacity-0 scale-105 blur-sm",
              showIntro && "opacity-0"
            )}
          >
            {renderScene()}
          </div>

          {/* Play button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full bg-primary/90 backdrop-blur-xl flex items-center justify-center hover:scale-110 transition-transform"
              style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.5)' }}
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </button>
          )}
        </div>

        {/* Interactive progress bar */}
        <div className="w-full max-w-2xl mt-2 px-4">
          <div
            ref={progressBarRef}
            className="relative h-1.5 bg-slate-200 rounded-full cursor-pointer group"
            onClick={handleProgressBarClick}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleProgressBarDrag}
          >
            {/* Scene markers */}
            {tourScripts.map((_, idx) => (
              <div
                key={idx}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-300"
                style={{ left: `${(idx / totalScenes) * 100}%` }}
              />
            ))}
            
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-100"
              style={{ width: `${overallProgress}%` }}
            />
            
            {/* Drag handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${overallProgress}% - 6px)` }}
            />
          </div>
          
          {/* Scene title */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-muted-foreground">
              {currentSceneIndex + 1}/{totalScenes}
            </span>
            <span className="text-xs font-medium text-foreground">
              {currentScript.title}
            </span>
            <button
              onClick={togglePlay}
              className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-2.5 h-2.5 text-primary" />
              ) : (
                <Play className="w-2.5 h-2.5 text-primary ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-3 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/contact')}
            className="px-3 py-1.5 text-xs rounded-lg border-primary/30 hover:bg-primary/5 hover:border-primary/50 group"
          >
            <Calendar className="w-3 h-3 mr-1.5 text-primary group-hover:scale-110 transition-transform" />
            Demander une démo
          </Button>
          
          <Button
            size="sm"
            onClick={() => navigate('/auth')}
            className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-md shadow-primary/20"
          >
            Commencer gratuitement
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
