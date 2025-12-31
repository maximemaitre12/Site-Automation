import React from 'react';
import { cn } from '@/lib/utils';
import { easings } from '@/lib/animation-easings';

interface SpringInProps {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  scale?: { from: number; to: number };
  blur?: number;
}

/**
 * Spring physics entrance animation
 * Scale from smaller with overshoot + blur fade
 */
export function SpringIn({
  children,
  active,
  delay = 0,
  duration = 600,
  className,
  scale = { from: 0.3, to: 1 },
  blur = 10,
}: SpringInProps) {
  return (
    <div
      className={cn(
        'transition-all will-change-transform',
        className
      )}
      style={{
        transform: active ? `scale(${scale.to})` : `scale(${scale.from})`,
        opacity: active ? 1 : 0,
        filter: active ? 'blur(0px)' : `blur(${blur}px)`,
        transitionProperty: 'transform, opacity, filter',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easings.spring,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
