import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

interface IntroSceneProps {
  isActive: boolean;
  progress: number;
}

const agents = [
  { icon: Users, color: 'from-violet-500 to-purple-600' },
  { icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
  { icon: Headphones, color: 'from-amber-500 to-orange-600' },
  { icon: Brain, color: 'from-cyan-500 to-blue-600' },
  { icon: Shield, color: 'from-red-500 to-rose-600' },
  { icon: GitBranch, color: 'from-indigo-500 to-violet-600' },
  { icon: Database, color: 'from-orange-500 to-amber-600' },
];

export function IntroScene({ isActive, progress }: IntroSceneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    if (progress < 20) setPhase(1);
    else setPhase(2);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div 
          className={cn(
            "transition-all duration-700",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}
        >
          <img 
            src={aetherLogo} 
            alt="AETHER" 
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        </div>
        
        {/* Agent icons row */}
        <div 
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 mt-4 transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                key={index}
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-sm",
                  agent.color
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
