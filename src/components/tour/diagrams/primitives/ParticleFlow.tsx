import React, { useMemo } from 'react';

interface ParticleFlowProps {
  path: string;
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  active?: boolean;
}

export function ParticleFlow({
  path,
  count = 3,
  color = 'hsl(var(--primary))',
  size = 3,
  speed = 2,
  active = true,
}: ParticleFlowProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: (i / count) * speed,
    }));
  }, [count, speed]);

  if (!active) return null;

  return (
    <g className="particle-flow">
      <defs>
        <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {particles.map((particle) => (
        <circle
          key={particle.id}
          r={size}
          fill={color}
          filter="url(#particle-glow)"
          opacity="0.9"
        >
          <animateMotion
            dur={`${speed}s`}
            repeatCount="indefinite"
            begin={`${particle.delay}s`}
            path={path}
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            keyTimes="0;0.1;0.9;1"
            dur={`${speed}s`}
            repeatCount="indefinite"
            begin={`${particle.delay}s`}
          />
        </circle>
      ))}
    </g>
  );
}
