import { cn } from '@/lib/utils';

interface HealthGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthGauge({ value, size = 'md' }: HealthGaugeProps) {
  const sizeConfig = {
    sm: { width: 80, stroke: 6, textSize: 'text-lg' },
    md: { width: 120, stroke: 8, textSize: 'text-2xl' },
    lg: { width: 160, stroke: 10, textSize: 'text-4xl' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: 'stroke-emerald-500', text: 'text-emerald-500', label: 'Excellent' };
    if (score >= 60) return { stroke: 'stroke-blue-500', text: 'text-blue-500', label: 'Bon' };
    if (score >= 40) return { stroke: 'stroke-amber-500', text: 'text-amber-500', label: 'Attention' };
    return { stroke: 'stroke-red-500', text: 'text-red-500', label: 'Critique' };
  };

  const colorConfig = getColor(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            className={cn("transition-all duration-1000 ease-out", colorConfig.stroke)}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", config.textSize, colorConfig.text)}>
            {value}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className={cn("text-sm font-medium", colorConfig.text)}>
          {colorConfig.label}
        </div>
        <div className="text-xs text-muted-foreground">
          Santé Business
        </div>
      </div>
    </div>
  );
}
