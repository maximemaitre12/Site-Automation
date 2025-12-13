import { cn } from '@/lib/utils';

interface MetricGaugeProps {
  value: number;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'default' | 'stress' | 'success';
}

export function MetricGauge({ value, label, description, size = 'md', colorScheme = 'default' }: MetricGaugeProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', stroke: 4, fontSize: 'text-sm' },
    md: { container: 'w-24 h-24', stroke: 6, fontSize: 'text-lg' },
    lg: { container: 'w-32 h-32', stroke: 8, fontSize: 'text-2xl' },
  };

  const getColor = () => {
    if (colorScheme === 'stress') {
      if (value <= 30) return { stroke: 'stroke-emerald-500', bg: 'stroke-emerald-500/20' };
      if (value <= 60) return { stroke: 'stroke-amber-500', bg: 'stroke-amber-500/20' };
      return { stroke: 'stroke-red-500', bg: 'stroke-red-500/20' };
    }
    if (colorScheme === 'success') {
      return { stroke: 'stroke-emerald-500', bg: 'stroke-emerald-500/20' };
    }
    if (value >= 80) return { stroke: 'stroke-emerald-500', bg: 'stroke-emerald-500/20' };
    if (value >= 60) return { stroke: 'stroke-blue-500', bg: 'stroke-blue-500/20' };
    if (value >= 40) return { stroke: 'stroke-amber-500', bg: 'stroke-amber-500/20' };
    return { stroke: 'stroke-red-500', bg: 'stroke-red-500/20' };
  };

  const { container, stroke, fontSize } = sizes[size];
  const colors = getColor();
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={colors.bg}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className={cn(colors.stroke, 'transition-all duration-700 ease-out')}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', fontSize)}>{value}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-medium text-sm">{label}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
    </div>
  );
}
