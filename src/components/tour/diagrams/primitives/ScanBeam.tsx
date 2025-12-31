import React from 'react';

interface ScanBeamProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  speed?: number;
  active?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export function ScanBeam({
  x,
  y,
  width,
  height,
  color = 'hsl(var(--primary))',
  speed = 2,
  active = true,
  direction = 'vertical',
}: ScanBeamProps) {
  if (!active) return null;

  const isVertical = direction === 'vertical';
  const gradientId = `scan-gradient-${x}-${y}`;

  return (
    <g className="scan-beam">
      <defs>
        <linearGradient
          id={gradientId}
          x1={isVertical ? '0%' : '0%'}
          y1={isVertical ? '0%' : '0%'}
          x2={isVertical ? '0%' : '100%'}
          y2={isVertical ? '100%' : '0%'}
        >
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="40%" stopColor={color} stopOpacity="0.6" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {isVertical ? (
        <rect
          x={x}
          width={width}
          height={4}
          fill={`url(#${gradientId})`}
          opacity="0.8"
        >
          <animate
            attributeName="y"
            values={`${y};${y + height};${y}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        </rect>
      ) : (
        <rect
          y={y}
          width={4}
          height={height}
          fill={`url(#${gradientId})`}
          opacity="0.8"
        >
          <animate
            attributeName="x"
            values={`${x};${x + width};${x}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        </rect>
      )}

      {/* Scan line glow */}
      <line
        x1={isVertical ? x : x}
        y1={isVertical ? y : y}
        x2={isVertical ? x + width : x}
        y2={isVertical ? y : y + height}
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      >
        {isVertical ? (
          <animate
            attributeName="y1"
            values={`${y};${y + height};${y}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        ) : (
          <animate
            attributeName="x1"
            values={`${x};${x + width};${x}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        )}
        {isVertical ? (
          <animate
            attributeName="y2"
            values={`${y};${y + height};${y}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        ) : (
          <animate
            attributeName="x2"
            values={`${x};${x + width};${x}`}
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        )}
      </line>
    </g>
  );
}
