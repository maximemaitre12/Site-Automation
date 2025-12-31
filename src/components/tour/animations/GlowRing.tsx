import React from 'react';
import { cn } from '@/lib/utils';

interface GlowRingProps {
  active: boolean;
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

/**
 * Animated glowing ring that expands
 */
export function GlowRing({
  active,
  color = 'hsl(var(--primary))',
  size = 100,
  thickness = 3,
  className,
}: GlowRingProps) {
  return (
    <div
      className={cn('absolute pointer-events-none', className)}
      style={{
        width: active ? size : 0,
        height: active ? size : 0,
        borderRadius: '50%',
        border: `${thickness}px solid ${color}`,
        boxShadow: active 
          ? `0 0 20px ${color}, 0 0 40px ${color}50, inset 0 0 20px ${color}30`
          : 'none',
        opacity: active ? 0 : 1,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  );
}
