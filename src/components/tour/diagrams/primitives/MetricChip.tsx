import React from 'react';

interface MetricChipProps {
  x: number;
  y: number;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'success' | 'warning' | 'accent';
  size?: 'sm' | 'md';
  animated?: boolean;
}

const variantStyles = {
  default: {
    bg: 'hsl(var(--muted))',
    border: 'hsl(var(--border))',
    text: 'hsl(var(--foreground))',
    value: 'hsl(var(--foreground))',
  },
  success: {
    bg: 'hsl(142 76% 36% / 0.15)',
    border: 'hsl(142 76% 46%)',
    text: 'hsl(142 76% 36%)',
    value: 'hsl(142 76% 46%)',
  },
  warning: {
    bg: 'hsl(38 92% 50% / 0.15)',
    border: 'hsl(38 92% 60%)',
    text: 'hsl(38 92% 50%)',
    value: 'hsl(38 92% 60%)',
  },
  accent: {
    bg: 'hsl(var(--accent) / 0.15)',
    border: 'hsl(var(--accent))',
    text: 'hsl(var(--accent-foreground))',
    value: 'hsl(var(--accent))',
  },
};

export function MetricChip({
  x,
  y,
  label,
  value,
  unit = '',
  trend,
  variant = 'default',
  size = 'sm',
  animated = false,
}: MetricChipProps) {
  const styles = variantStyles[variant];
  const width = size === 'sm' ? 56 : 72;
  const height = size === 'sm' ? 28 : 36;
  const fontSize = size === 'sm' ? 7 : 9;
  const valueSize = size === 'sm' ? 10 : 13;

  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  const trendColor = trend === 'up' ? 'hsl(142 76% 46%)' : trend === 'down' ? 'hsl(0 84% 60%)' : styles.value;

  return (
    <g className="metric-chip">
      {/* Background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={styles.bg}
        stroke={styles.border}
        strokeWidth="0.5"
        style={{
          transition: 'all 0.3s ease-out',
        }}
      />

      {/* Label */}
      <text
        x={x + width / 2}
        y={y + height * 0.32}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={styles.text}
        fontSize={fontSize}
        opacity="0.7"
      >
        {label}
      </text>

      {/* Value */}
      <text
        x={x + width / 2}
        y={y + height * 0.72}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={styles.value}
        fontSize={valueSize}
        fontWeight="600"
        className={animated ? 'animate-pulse' : ''}
      >
        {value}{unit}
        {trendArrow && (
          <tspan fill={trendColor} fontSize={fontSize} dx="2">
            {trendArrow}
          </tspan>
        )}
      </text>
    </g>
  );
}
