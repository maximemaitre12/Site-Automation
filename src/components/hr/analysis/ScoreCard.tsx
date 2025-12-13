import { cn } from '@/lib/utils';

interface ScoreCardProps {
  label: string;
  score: number;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function ScoreCard({ label, score, icon, size = 'md', showPercentage = true }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score >= 60) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (score >= 40) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  const scoreClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  return (
    <div className={cn(
      'rounded-xl border transition-all hover:shadow-md',
      getScoreColor(score),
      sizeClasses[size]
    )}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="opacity-70">{icon}</span>}
        <span className="font-medium opacity-80">{label}</span>
      </div>
      <div className={scoreClasses[size]}>
        {score}{showPercentage && '%'}
      </div>
    </div>
  );
}
