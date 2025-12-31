import React from 'react';
import { cn } from '@/lib/utils';

interface PulseGlowProps {
  active: boolean;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  children?: React.ReactNode;
}

const intensityMap = {
  low: { blur: 10, spread: 5 },
  medium: { blur: 20, spread: 10 },
  high: { blur: 40, spread: 20 },
};

const speedMap = {
  slow: '3s',
  normal: '2s',
  fast: '1s',
};

/**
 * Pulsing glow effect around an element
 */
export function PulseGlow({
  active,
  color = 'hsl(var(--primary))',
  intensity = 'medium',
  speed = 'normal',
  className,
  children,
}: PulseGlowProps) {
  const { blur, spread } = intensityMap[intensity];
  const animationDuration = speedMap[speed];

  return (
    <div
      className={cn('relative', className)}
      style={{
        animation: active ? `pulseGlow ${animationDuration} ease-in-out infinite` : 'none',
      }}
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          boxShadow: active 
            ? `0 0 ${blur}px ${spread}px ${color}40, 0 0 ${blur * 2}px ${spread * 2}px ${color}20`
            : 'none',
          transition: 'box-shadow 0.5s ease-out',
          borderRadius: 'inherit',
        }}
      />
      
      {/* Content */}
      <div className="relative">{children}</div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </div>
  );
}
