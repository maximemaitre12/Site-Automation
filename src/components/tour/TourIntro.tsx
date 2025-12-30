import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Cpu, Brain, Zap } from 'lucide-react';

interface TourIntroProps {
  isActive: boolean;
}

export function TourIntro({ isActive }: TourIntroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      setPhase(0);
      const timers = [
        setTimeout(() => setPhase(1), 500),
        setTimeout(() => setPhase(2), 1500),
        setTimeout(() => setPhase(3), 2500),
        setTimeout(() => setPhase(4), 3500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl transition-all duration-1000",
          phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl transition-all duration-1000 delay-300",
          phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
      </div>

      {/* Logo and title */}
      <div className={cn(
        "relative z-10 flex flex-col items-center gap-8 transition-all duration-1000",
        phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        {/* Animated logo */}
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-2xl transition-all duration-700",
            phase >= 2 ? "scale-100 rotate-0" : "scale-75 rotate-12"
          )}>
            <Brain className="w-16 h-16 text-primary-foreground" />
          </div>
          
          {/* Orbiting icons */}
          <div className={cn(
            "absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg transition-all duration-500",
            phase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}>
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className={cn(
            "absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg transition-all duration-500 delay-150",
            phase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className={cn(
            "absolute -bottom-4 -right-4 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg transition-all duration-500 delay-300",
            phase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className={cn(
            "text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}>
            AETHER
          </h1>
          <p className={cn(
            "mt-4 text-xl md:text-2xl text-muted-foreground transition-all duration-700 delay-300",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}>
            6 AI Agents. One Platform. Infinite Possibilities.
          </p>
        </div>

        {/* Animated badge */}
        <div className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 transition-all duration-700 delay-500",
          phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Next-Generation AI Automation</span>
        </div>
      </div>
    </div>
  );
}
