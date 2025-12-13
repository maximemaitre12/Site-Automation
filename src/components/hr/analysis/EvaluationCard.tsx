import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface EvaluationCardProps {
  name: string;
  score: number;
  evidence?: string;
  icon?: React.ReactNode;
}

export function EvaluationCard({ name, score, evidence, icon }: EvaluationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStars = (score: number) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn(
        'text-lg',
        i < stars ? 'text-yellow-400' : 'text-muted-foreground/30'
      )}>
        ★
      </span>
    ));
  };

  return (
    <div 
      className={cn(
        'border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer',
        'bg-card hover:bg-accent/5'
      )}
      onClick={() => evidence && setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{name}</div>
            <div className="flex items-center gap-2 mt-1">
              {getStars(score)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn('text-2xl font-bold', getScoreColor(score))}>
            {score}%
          </span>
          {evidence && (
            <ChevronDown className={cn(
              'w-5 h-5 text-muted-foreground transition-transform',
              isExpanded && 'rotate-180'
            )} />
          )}
        </div>
      </div>

      <div className="mt-3">
        <Progress 
          value={score} 
          className="h-2"
          style={{
            ['--progress-background' as any]: getProgressColor(score),
          }}
        />
      </div>

      {evidence && isExpanded && (
        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Evidence</div>
          {evidence}
        </div>
      )}
    </div>
  );
}
