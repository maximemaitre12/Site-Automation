import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, Users, TrendingUp, Shield, Database, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

interface IntroSceneProps {
  isActive: boolean;
  progress: number;
}

const stats = [
  { value: '10K+', label: 'Utilisateurs actifs', delay: 0 },
  { value: '50K', label: 'Tâches automatisées/jour', delay: 100 },
  { value: '99.9%', label: 'Disponibilité', delay: 200 },
];

const agents = [
  { icon: Users, label: 'RH', color: 'text-agent-hr' },
  { icon: TrendingUp, label: 'Ventes', color: 'text-agent-sales' },
  { icon: Zap, label: 'Support', color: 'text-agent-support' },
  { icon: Brain, label: 'Brain', color: 'text-agent-brain' },
  { icon: Shield, label: 'Conformité', color: 'text-agent-compliance' },
  { icon: GitBranch, label: 'Flow', color: 'text-agent-flow' },
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
    if (progress < 10) setPhase(1);       // Logo appears
    else if (progress < 25) setPhase(2);  // Title appears
    else if (progress < 45) setPhase(3);  // Stats appear
    else if (progress < 70) setPhase(4);  // Agents grid
    else setPhase(5);                      // Final state
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl">
        
        {/* Logo */}
        <div 
          className={cn(
            "relative mb-8 transition-all duration-1000",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-3xl blur-3xl bg-primary/30 animate-glow-pulse"
            style={{ transform: 'scale(1.5)' }}
          />
          
          {/* Logo container */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl">
            <img 
              src={aetherLogo} 
              alt="AETHER" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Orbiting sparkles */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <Sparkles className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 text-primary" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <Sparkles className="absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-primary/70" />
          </div>
        </div>

        {/* Title and tagline */}
        <div 
          className={cn(
            "text-center mb-12 transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AETHER
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            La plateforme IA révolutionnaire qui transforme 
            <span className="text-primary font-medium"> comment les entreprises opèrent</span>
          </p>
        </div>

        {/* Stats */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-8 md:gap-16 mb-16 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-stagger-in"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Agents preview */}
        <div 
          className={cn(
            "transition-all duration-700",
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-center text-muted-foreground mb-6">
            7 agents IA spécialisés à votre service
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border/50 backdrop-blur-sm animate-stagger-in",
                    phase >= 5 && "animate-float"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    ...(phase >= 5 && { animationDelay: `${index * 200}ms` })
                  }}
                >
                  <Icon className={cn("w-5 h-5", agent.color)} />
                  <span className="text-sm font-medium">{agent.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
