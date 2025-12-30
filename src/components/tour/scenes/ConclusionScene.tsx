import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConclusionSceneProps {
  isActive: boolean;
  progress: number;
  onRestart?: () => void;
}

const agents = [
  { icon: Users, label: 'RH', color: 'bg-agent-hr', stat: '70% temps gagné' },
  { icon: TrendingUp, label: 'Ventes', color: 'bg-agent-sales', stat: '35% conversions' },
  { icon: Headphones, label: 'Support', color: 'bg-agent-support', stat: '72% auto-résolu' },
  { icon: Brain, label: 'Brain', color: 'bg-agent-brain', stat: '100% accessible' },
  { icon: Shield, label: 'Conformité', color: 'bg-agent-compliance', stat: '90% risques réduits' },
  { icon: GitBranch, label: 'Flow', color: 'bg-agent-flow', stat: '20h/sem économisées' },
  { icon: Database, label: 'Data', color: 'bg-agent-data', stat: 'Insights temps réel' },
];

const achievements = [
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

    if (progress < 15) setPhase(1);
    else if (progress < 35) setPhase(2);
    else if (progress < 55) setPhase(3);
    else if (progress < 75) setPhase(4);
    else setPhase(5);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        
        {/* Title */}
        <div 
          className={cn(
            "mb-8 transition-all duration-700",
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Prêt à transformer votre entreprise ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Rejoignez les milliers d'entreprises qui utilisent AETHER pour automatiser leurs opérations
          </p>
        </div>

        {/* Agents grid */}
        <div 
          className={cn(
            "grid grid-cols-7 gap-3 mb-10 transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.label}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 transition-all animate-stagger-in",
                  phase >= 3 && "hover:scale-105 hover:border-primary/50"
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2", agent.color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">{agent.label}</span>
                {phase >= 3 && (
                  <span className="text-xs text-primary mt-1 animate-fade-in">{agent.stat}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-4 mb-10 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {achievements.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-stagger-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-4 transition-all duration-700",
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="px-8 py-6 text-lg rounded-xl animate-glow-pulse"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onRestart}
            className="px-8 py-6 text-lg rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Revoir la démo
          </Button>
        </div>

        {/* Trust badge */}
        <div 
          className={cn(
            "mt-10 text-sm text-muted-foreground transition-all duration-700",
            phase >= 5 ? "opacity-100" : "opacity-0"
          )}
        >
          <p>Aucune carte bancaire requise • Configuration en 5 minutes • Support 24/7</p>
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
            style={{
              left: `${5 + (i * 5)}%`,
              top: `${10 + (i % 5) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
