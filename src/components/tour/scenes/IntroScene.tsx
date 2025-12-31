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
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Central content - constrained */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl max-h-full overflow-hidden">
        
        {/* Logo - reduced size */}
        <div 
          className={cn(
            "relative mb-4 sm:mb-6 transition-all duration-1000 shrink-0",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        >
          {/* Subtle glow effect - reduced */}
          <div 
            className="absolute inset-0 rounded-xl sm:rounded-2xl blur-xl sm:blur-2xl bg-primary/15"
            style={{ transform: 'scale(1.2)' }}
          />
          
          {/* Logo image - smaller */}
          <img 
            src={aetherLogo} 
            alt="AETHER" 
            className="relative w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl sm:rounded-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.25))',
            }}
          />
        </div>

        {/* Title and tagline - reduced */}
        <div 
          className={cn(
            "text-center mb-4 sm:mb-6 transition-all duration-700 w-full shrink-0",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h1 
            className="font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
          >
            AETHER
          </h1>
          <p 
            className="text-muted-foreground max-w-xl mx-auto px-2"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 1.1rem)' }}
          >
            The revolutionary AI platform that transforms 
            <span className="text-primary font-medium"> how businesses operate</span>
          </p>
        </div>

        {/* Agents preview - compact */}
        <div 
          className={cn(
            "w-full transition-all duration-700 shrink-0",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <p 
            className="text-center text-muted-foreground mb-3"
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)' }}
          >
            7 specialized AI agents
          </p>
          
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full bg-background/50 border border-border/50 backdrop-blur-sm transition-all duration-500",
                    phase >= 4 && "hover:scale-105"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: phase >= 3 ? 1 : 0,
                    transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
                    transitionDelay: `${index * 60}ms`
                  }}
                >
                  <Icon className={cn("w-3.5 h-3.5", agent.color)} />
                  <span className="text-xs font-medium">{agent.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle background gradient - reduced blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className={cn(
            "absolute top-1/4 left-1/4 w-1/2 aspect-square rounded-full bg-primary/5 blur-[50px] transition-opacity duration-1000",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
        />
        <div 
          className={cn(
            "absolute bottom-1/4 right-1/4 w-1/3 aspect-square rounded-full bg-primary/3 blur-[40px] transition-opacity duration-1000",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  );
}
