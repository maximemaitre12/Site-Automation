import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConclusionSceneProps {
  isActive: boolean;
  progress: number;
  onRestart?: () => void;
}

export function ConclusionScene({ isActive, progress, onRestart }: ConclusionSceneProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    if (progress < 30) setPhase(1);
    else if (progress < 60) setPhase(2);
    else setPhase(3);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center">
      {/* Content - ultra compact */}
      <div className="flex flex-col items-center text-center px-4">
        
        {/* Icon */}
        <div 
          className={cn(
            "mb-4 transition-all duration-700",
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={cn(
            "text-lg sm:text-xl font-bold text-foreground mb-1 transition-all duration-700",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
        >
          Ready to get started?
        </h1>
        <p 
          className={cn(
            "text-xs sm:text-sm text-muted-foreground mb-5 transition-all duration-700",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
        >
          Try AETHER free for 14 days
        </p>

        {/* CTA Buttons */}
        <div 
          className={cn(
            "flex gap-2 transition-all duration-700",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="sm"
            onClick={() => navigate('/auth')}
            className="px-4 rounded-lg bg-gradient-to-r from-primary to-violet-600"
          >
            Start Free
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onRestart}
            className="px-4 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Replay
          </Button>
        </div>
      </div>
    </div>
  );
}
