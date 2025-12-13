import { useMemo } from 'react';

interface MatchScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MatchScoreGauge({ score, size = 'md', showLabel = true }: MatchScoreGaugeProps) {
  const dimensions = {
    sm: { size: 60, stroke: 6, fontSize: 'text-sm' },
    md: { size: 100, stroke: 8, fontSize: 'text-xl' },
    lg: { size: 140, stroke: 10, fontSize: 'text-3xl' },
  };

  const { size: svgSize, stroke, fontSize } = dimensions[size];
  const radius = (svgSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = useMemo(() => {
    if (score >= 80) return { stroke: '#22c55e', text: 'text-green-500', label: 'Excellent' };
    if (score >= 60) return { stroke: '#eab308', text: 'text-yellow-500', label: 'Bon' };
    if (score >= 40) return { stroke: '#f97316', text: 'text-orange-500', label: 'Moyen' };
    return { stroke: '#ef4444', text: 'text-red-500', label: 'Faible' };
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={getColor.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${fontSize} ${getColor.text}`}>
            {Math.round(score)}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`mt-2 text-sm font-medium ${getColor.text}`}>
          {getColor.label}
        </span>
      )}
    </div>
  );
}
