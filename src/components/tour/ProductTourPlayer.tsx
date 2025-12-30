import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTourNarration } from '@/hooks/useTourNarration';
import { tourScripts } from '@/data/tourNarration';
import { TourScene } from './TourScene';
import { TourIntro } from './TourIntro';
import { TourConclusion } from './TourConclusion';
import { TourProgress } from './TourProgress';
import { TourControls } from './TourControls';
import { AgentHRDemo } from '@/components/landing/AgentHRDemo';
import { AgentSalesDemo } from '@/components/landing/AgentSalesDemo';
import { AgentSupportDemo } from '@/components/landing/AgentSupportDemo';
import { AgentBrainDemo } from '@/components/landing/AgentBrainDemo';
import { AgentComplianceDemo } from '@/components/landing/AgentComplianceDemo';
import { AgentFlowDemo } from '@/components/landing/AgentFlowDemo';
import { cn } from '@/lib/utils';

export function ProductTourPlayer() {
  const navigate = useNavigate();
  const {
    currentSceneIndex,
    currentScript,
    isPlaying,
    isMuted,
    isLoading,
    progress,
    play,
    pause,
    toggleMute,
    skipToScene,
    reset,
  } = useTourNarration();

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      play();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    if (currentSceneIndex < tourScripts.length - 1) {
      skipToScene(currentSceneIndex + 1);
    }
  };

  const handleClose = () => {
    pause();
    navigate('/');
  };

  const renderAgentDemo = (agentType: string | undefined) => {
    switch (agentType) {
      case 'hr':
        return <AgentHRDemo className="w-full max-w-4xl" />;
      case 'sales':
        return <AgentSalesDemo className="w-full max-w-4xl" />;
      case 'support':
        return <AgentSupportDemo className="w-full max-w-4xl" />;
      case 'brain':
        return <AgentBrainDemo className="w-full max-w-4xl" />;
      case 'compliance':
        return <AgentComplianceDemo className="w-full max-w-4xl" />;
      case 'flow':
        return <AgentFlowDemo className="w-full max-w-4xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        {tourScripts.map((script, index) => (
          <TourScene key={script.id} isActive={currentSceneIndex === index}>
            {script.id === 'intro' ? (
              <TourIntro isActive={currentSceneIndex === index} />
            ) : script.id === 'conclusion' ? (
              <TourConclusion isActive={currentSceneIndex === index} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                {/* Scene title */}
                <div className={cn(
                  "text-center mb-8 transition-all duration-700",
                  currentSceneIndex === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {script.title}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {script.title}
                  </h2>
                </div>

                {/* Agent demo */}
                <div className={cn(
                  "transition-all duration-1000 delay-300",
                  currentSceneIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}>
                  {renderAgentDemo(script.agentType)}
                </div>
              </div>
            )}
          </TourScene>
        ))}

        {/* Subtitle overlay */}
        {currentScript && currentScript.id !== 'intro' && currentScript.id !== 'conclusion' && (
          <div className="absolute bottom-32 left-0 right-0 flex justify-center px-8 pointer-events-none">
            <div className={cn(
              "max-w-3xl bg-background/90 backdrop-blur-sm border border-border rounded-xl px-6 py-4 shadow-xl transition-all duration-500",
              isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <p className="text-center text-foreground/90 leading-relaxed">
                {currentScript.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="border-t border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          {/* Left: Controls */}
          <TourControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            isLoading={isLoading}
            progress={progress}
            onPlay={play}
            onPause={pause}
            onToggleMute={toggleMute}
            onSkip={handleSkip}
            onReset={reset}
            onClose={handleClose}
          />

          {/* Right: Progress */}
          <div className="flex-1">
            <TourProgress
              progress={progress}
              currentSceneIndex={currentSceneIndex}
              onSceneClick={skipToScene}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
