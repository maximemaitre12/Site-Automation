import React from 'react';

interface DiagramShellProps {
  children: React.ReactNode;
  viewBox?: string;
  className?: string;
  showGrid?: boolean;
  showNoise?: boolean;
  accentColor?: string;
}

export function DiagramShell({
  children,
  viewBox = '0 0 400 120',
  className = '',
  showGrid = true,
  showNoise = true,
  accentColor = 'hsl(var(--primary))',
}: DiagramShellProps) {
  const patternId = `grid-${Math.random().toString(36).slice(2, 9)}`;
  const noiseId = `noise-${Math.random().toString(36).slice(2, 9)}`;
  const glowId = `ambient-glow-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: '100%' }}
      >
        <defs>
          {/* Grid pattern */}
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.3"
              opacity="0.4"
            />
          </pattern>

          {/* Noise texture */}
          <filter id={noiseId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          {/* Ambient glow */}
          <radialGradient id={glowId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="hsl(var(--background))" />

        {/* Ambient glow */}
        <rect width="100%" height="100%" fill={`url(#${glowId})`} />

        {/* Grid */}
        {showGrid && (
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        )}

        {/* Noise overlay */}
        {showNoise && (
          <rect
            width="100%"
            height="100%"
            filter={`url(#${noiseId})`}
            opacity="0.015"
          />
        )}

        {/* Content */}
        {children}
      </svg>
    </div>
  );
}
