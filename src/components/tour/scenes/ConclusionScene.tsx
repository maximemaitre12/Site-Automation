import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database, Clock, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CountUp } from '../animations';

interface ConclusionSceneProps {
  isActive: boolean;
  progress: number;
  onRestart?: () => void;
}

const agents = [
  { icon: Users, label: 'RH', color: 'from-violet-500 to-purple-600' },
  { icon: TrendingUp, label: 'Ventes', color: 'from-emerald-500 to-teal-600' },
  { icon: Headphones, label: 'Support', color: 'from-amber-500 to-orange-600' },
  { icon: Brain, label: 'Brain', color: 'from-cyan-500 to-blue-600' },
  { icon: Shield, label: 'Conformité', color: 'from-red-500 to-rose-600' },
  { icon: GitBranch, label: 'Flow', color: 'from-indigo-500 to-violet-600' },
  { icon: Database, label: 'Data', color: 'from-orange-500 to-amber-600' },
];

const stats = [
  { icon: Clock, value: 70, suffix: '%', label: 'Temps économisé', color: 'text-emerald-400' },
  { icon: Zap, value: 24, suffix: 'h', label: 'Déploiement', color: 'text-amber-400' },
  { icon: Award, value: 99, suffix: '%', label: 'Satisfaction', color: 'text-violet-400' },
];

const features = [
  '7 agents IA spécialisés',
  'Déploiement en 24h',
  'Support dédié 24/7',
  'Essai gratuit 14 jours',
];

export function ConclusionScene({ isActive, progress, onRestart }: ConclusionSceneProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    if (progress < 12) setPhase(1);
    else if (progress < 28) setPhase(2);
    else if (progress < 45) setPhase(3);
    else if (progress < 65) setPhase(4);
    else if (progress < 82) setPhase(5);
    else setPhase(6);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        {/* Mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, hsl(262, 83%, 58% / 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(187, 85%, 43% / 0.08) 0%, transparent 60%)
            `
          }}
        />
        
        {/* Animated gradient orbs */}
        <div 
          className={cn(
            "absolute top-[10%] left-[15%] w-[30%] aspect-square rounded-full blur-[60px] transition-all duration-1000",
            phase >= 1 ? "bg-primary/20 opacity-100" : "opacity-0"
          )}
          style={{ animation: phase >= 1 ? 'float 8s ease-in-out infinite' : 'none' }}
        />
        <div 
          className={cn(
            "absolute bottom-[20%] right-[10%] w-[25%] aspect-square rounded-full blur-[50px] transition-all duration-1000",
            phase >= 2 ? "bg-violet-500/15 opacity-100" : "opacity-0"
          )}
          style={{ animation: phase >= 2 ? 'float 10s ease-in-out infinite reverse' : 'none' }}
        />

        {/* Floating particles */}
        {phase >= 3 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
                style={{
                  left: `${10 + (i * 6)}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + (i % 3)}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto">
        
        {/* Hero Title */}
        <div 
          className={cn(
            "text-center mb-6 transition-all duration-700",
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 text-primary transition-all duration-500",
              phase >= 2 && "animate-pulse"
            )} />
          </div>
          <h1 
            className="font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-violet-400 bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              animation: phase >= 2 ? 'gradient-shift 4s ease infinite' : 'none'
            }}
          >
            Prêt à transformer votre entreprise ?
          </h1>
          <p 
            className="text-muted-foreground max-w-lg mx-auto"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
          >
            Rejoignez les entreprises qui utilisent AETHER pour automatiser leurs opérations
          </p>
        </div>

        {/* Stats Row - Glassmorphism cards */}
        <div 
          className={cn(
            "flex justify-center gap-3 sm:gap-4 mb-6 transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "relative px-4 py-3 sm:px-5 sm:py-4 rounded-xl transition-all duration-500",
                  "bg-card/50 backdrop-blur-md border border-border/50",
                  "hover:border-primary/30 hover:bg-card/70"
                )}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5 mb-1", stat.color)} />
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  <CountUp value={stat.value} active={phase >= 2} delay={index * 150} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Agents Grid - 2 rows */}
        <div 
          className={cn(
            "w-full max-w-2xl mb-6 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Row 1: 4 agents */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-2">
            {agents.slice(0, 4).map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className={cn(
                    "flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all duration-300",
                    "bg-card/30 backdrop-blur-sm border border-border/30",
                    "hover:scale-105 hover:border-primary/40 hover:bg-card/50"
                  )}
                  style={{ 
                    transitionDelay: `${index * 60}ms`,
                    opacity: phase >= 3 ? 1 : 0,
                  }}
                >
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1 bg-gradient-to-br",
                    agent.color
                  )}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">{agent.label}</span>
                </div>
              );
            })}
          </div>
          
          {/* Row 2: 3 agents centered */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {agents.slice(4).map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className={cn(
                    "flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all duration-300",
                    "bg-card/30 backdrop-blur-sm border border-border/30",
                    "hover:scale-105 hover:border-primary/40 hover:bg-card/50"
                  )}
                  style={{ 
                    transitionDelay: `${(index + 4) * 60}ms`,
                    opacity: phase >= 3 ? 1 : 0,
                  }}
                >
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1 bg-gradient-to-br",
                    agent.color
                  )}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">{agent.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features badges */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-2 mb-6 transition-all duration-700",
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {features.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              style={{ 
                transitionDelay: `${index * 80}ms`,
                opacity: phase >= 4 ? 1 : 0,
              }}
            >
              <CheckCircle className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-foreground/90">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-3 transition-all duration-700",
            phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className={cn(
              "px-6 py-5 text-base rounded-xl relative overflow-hidden",
              "bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90",
              phase >= 5 && "shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onRestart}
            className="px-6 py-5 text-base rounded-xl border-border/50 hover:bg-card/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Revoir la démo
          </Button>
        </div>

        {/* Trust badge */}
        <div 
          className={cn(
            "mt-6 text-center transition-all duration-700",
            phase >= 6 ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-xs text-muted-foreground">
            Aucune carte bancaire requise • Configuration en 5 minutes • Support 24/7
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
