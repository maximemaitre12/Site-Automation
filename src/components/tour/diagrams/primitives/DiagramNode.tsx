import React from 'react';

interface DiagramNodeProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'muted';
  shape?: 'rect' | 'rounded' | 'hexagon' | 'diamond' | 'circle' | 'pill';
  active?: boolean;
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}

const variantStyles = {
  default: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', text: 'hsl(var(--foreground))' },
  primary: { fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))', text: 'hsl(var(--primary-foreground))' },
  accent: { fill: 'hsl(var(--accent))', stroke: 'hsl(var(--accent))', text: 'hsl(var(--accent-foreground))' },
  success: { fill: 'hsl(142 76% 36%)', stroke: 'hsl(142 76% 46%)', text: 'white' },
  warning: { fill: 'hsl(38 92% 50%)', stroke: 'hsl(38 92% 60%)', text: 'white' },
  muted: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', text: 'hsl(var(--muted-foreground))' },
};

export function DiagramNode({
  x,
  y,
  width = 80,
  height = 40,
  label,
  sublabel,
  variant = 'default',
  shape = 'rounded',
  active = false,
  pulse = false,
  glow = false,
  className = '',
}: DiagramNodeProps) {
  const styles = variantStyles[variant];
  const cx = x + width / 2;
  const cy = y + height / 2;

  const getPath = () => {
    switch (shape) {
      case 'hexagon': {
        const hw = width / 2;
        const hh = height / 2;
        const offset = width * 0.15;
        return `M ${x + offset} ${y} L ${x + width - offset} ${y} L ${x + width} ${cy} L ${x + width - offset} ${y + height} L ${x + offset} ${y + height} L ${x} ${cy} Z`;
      }
      case 'diamond': {
        return `M ${cx} ${y} L ${x + width} ${cy} L ${cx} ${y + height} L ${x} ${cy} Z`;
      }
      case 'circle':
        return undefined; // Use circle element
      case 'pill':
        return undefined; // Use rect with full radius
      case 'rect':
        return undefined;
      case 'rounded':
      default:
        return undefined;
    }
  };

  const path = getPath();

  return (
    <g className={`diagram-node ${className}`}>
      {/* Glow effect */}
      {glow && (
        <defs>
          <filter id={`glow-${x}-${y}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Pulse ring */}
      {pulse && (
        <circle
          cx={cx}
          cy={cy}
          r={Math.max(width, height) / 2 + 8}
          fill="none"
          stroke={styles.stroke}
          strokeWidth="2"
          opacity="0.4"
          className="animate-ping"
        />
      )}

      {/* Shape */}
      {path ? (
        <path
          d={path}
          fill={styles.fill}
          stroke={active ? styles.stroke : 'hsl(var(--border))'}
          strokeWidth={active ? 2 : 1}
          filter={glow ? `url(#glow-${x}-${y})` : undefined}
          style={{
            transition: 'all 0.3s ease-out',
            opacity: active ? 1 : 0.85,
          }}
        />
      ) : shape === 'circle' ? (
        <circle
          cx={cx}
          cy={cy}
          r={Math.min(width, height) / 2}
          fill={styles.fill}
          stroke={active ? styles.stroke : 'hsl(var(--border))'}
          strokeWidth={active ? 2 : 1}
          filter={glow ? `url(#glow-${x}-${y})` : undefined}
          style={{
            transition: 'all 0.3s ease-out',
            opacity: active ? 1 : 0.85,
          }}
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={shape === 'pill' ? height / 2 : shape === 'rounded' ? 6 : 0}
          fill={styles.fill}
          stroke={active ? styles.stroke : 'hsl(var(--border))'}
          strokeWidth={active ? 2 : 1}
          filter={glow ? `url(#glow-${x}-${y})` : undefined}
          style={{
            transition: 'all 0.3s ease-out',
            opacity: active ? 1 : 0.85,
          }}
        />
      )}

      {/* Label */}
      {label && (
        <text
          x={cx}
          y={sublabel ? cy - 4 : cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={styles.text}
          fontSize="10"
          fontWeight="500"
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}

      {/* Sublabel */}
      {sublabel && (
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={styles.text}
          fontSize="7"
          opacity="0.7"
          style={{ pointerEvents: 'none' }}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}
