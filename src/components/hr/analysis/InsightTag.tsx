import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, Lightbulb, Star, TrendingUp, TrendingDown } from 'lucide-react';

type TagType = 'success' | 'warning' | 'info' | 'insight' | 'star' | 'up' | 'down';

interface InsightTagProps {
  text: string;
  type?: TagType;
  size?: 'sm' | 'md';
}

export function InsightTag({ text, type = 'info', size = 'md' }: InsightTagProps) {
  const config: Record<TagType, { icon: React.ReactNode; className: string }> = {
    success: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    },
    warning: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    },
    info: {
      icon: <Info className="w-3.5 h-3.5" />,
      className: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    },
    insight: {
      icon: <Lightbulb className="w-3.5 h-3.5" />,
      className: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    },
    star: {
      icon: <Star className="w-3.5 h-3.5" />,
      className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    },
    up: {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    },
    down: {
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      className: 'bg-red-500/10 text-red-700 border-red-500/20',
    },
  };

  const { icon, className } = config[type];

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium',
      size === 'sm' ? 'text-xs' : 'text-sm',
      className
    )}>
      {icon}
      {text}
    </span>
  );
}
