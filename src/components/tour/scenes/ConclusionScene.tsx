import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConclusionSceneProps {
  isActive: boolean;
  progress: number;
  onRestart?: () => void;
}

const features = [
  '7 agents IA spécialisés',
  'Déploiement en 24h',
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

    if (progress < 20) setPhase(1);
    else if (progress < 40) setPhase(2);
    else if (progress < 60) setPhase(3);
    else setPhase(4);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, hsl(262, 83%, 58% / 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Content - compact layout */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-4">
        
        {/* Icon */}
        <div 
          className={cn(
            "mb-3 transition-all duration-700",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div 
          className={cn(
            "text-center mb-4 transition-all duration-700",
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Prêt à transformer votre entreprise ?
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Rejoignez les entreprises qui utilisent AETHER
          </p>
        </div>

        {/* Features badges - horizontal compact */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-2 mb-5 transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {features.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              style={{ 
                transitionDelay: `${index * 80}ms`,
                opacity: phase >= 2 ? 1 : 0,
              }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground/90">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons - side by side */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-3 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            size="default"
            onClick={() => navigate('/auth')}
            className="px-5 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            size="default"
            variant="outline"
            onClick={onRestart}
            className="px-5 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Revoir
          </Button>
        </div>

        {/* Trust badge */}
        <div 
          className={cn(
            "mt-4 text-center transition-all duration-700",
            phase >= 4 ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-xs text-muted-foreground">
            Sans carte bancaire • Config en 5 min
          </p>
        </div>
      </div>
    </div>
  );
}
