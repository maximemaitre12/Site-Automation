import React, { useState, useEffect } from 'react';
import { Zap, Brain, Users, TrendingUp, Shield, Database, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

interface IntroSceneProps {
  isActive: boolean;
  progress: number;
}

const agents = [
  { icon: Users, label: 'HR', color: 'text-agent-hr' },
  { icon: TrendingUp, label: 'Sales', color: 'text-agent-sales' },
  { icon: Zap, label: 'Support', color: 'text-agent-support' },
  { icon: Brain, label: 'Brain', color: 'text-agent-brain' },
  { icon: Shield, label: 'Compliance', color: 'text-agent-compliance' },
  { icon: Workflow, label: 'Flow', color: 'text-agent-flow' },
  { icon: Database, label: 'Data', color: 'text-agent-data' },
];

export function IntroScene({ isActive, progress }: IntroSceneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Phase transitions based on progress
    if (progress < 15) setPhase(1);       // Logo appears
    else if (progress < 35) setPhase(2);  // Title appears
    else if (progress < 70) setPhase(3);  // Agents grid
    else setPhase(4);                      // Final state
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden">
      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        
        {/* Logo - clean, no frame */}
        <div 
          className={cn(
            "relative mb-6 sm:mb-8 transition-all duration-1000",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        >
          {/* Subtle glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl bg-primary/20"
            style={{ transform: 'scale(1.3)' }}
          />
          
          {/* Logo image - clean, no border frame */}
          <img 
            src={aetherLogo} 
            alt="AETHER" 
            className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-2xl sm:rounded-3xl"
            style={{
              filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.3))',
            }}
          />
        </div>

        {/* Title and tagline - responsive */}
        <div 
          className={cn(
            "text-center mb-8 sm:mb-12 transition-all duration-700 w-full",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h1 
            className="font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
          >
            AETHER
          </h1>
          <p 
            className="text-muted-foreground max-w-2xl mx-auto px-2"
            style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)' }}
          >
            The revolutionary AI platform that transforms 
            <span className="text-primary font-medium"> how businesses operate</span>
          </p>
        </div>

        {/* Agents preview - responsive */}
        <div 
          className={cn(
            "w-full transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p 
            className="text-center text-muted-foreground mb-4 sm:mb-6"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
          >
            7 specialized AI agents
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/50 border border-border/50 backdrop-blur-sm transition-all duration-500",
                    phase >= 4 && "hover:scale-105"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: phase >= 3 ? 1 : 0,
                    transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${index * 80}ms`
                  }}
                >
                  <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", agent.color)} />
                  <span className="text-xs sm:text-sm font-medium">{agent.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={cn(
            "absolute top-1/4 left-1/4 w-1/2 aspect-square rounded-full bg-primary/5 blur-[100px] transition-opacity duration-1000",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
        />
        <div 
          className={cn(
            "absolute bottom-1/4 right-1/4 w-1/3 aspect-square rounded-full bg-primary/3 blur-[80px] transition-opacity duration-1000",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  );
}
