import React from 'react';
import { cn } from '@/lib/utils';
import { easings } from '@/lib/animation-easings';

interface ScalePopProps {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  scale?: { from: number; overshoot: number; to: number };
}

/**
 * Scale pop with overshoot - great for stamps and badges
 */
export function ScalePop({
  children,
  active,
  delay = 0,
  duration = 400,
  className,
  scale = { from: 0, overshoot: 1.2, to: 1 },
}: ScalePopProps) {
  return (
    <div
      className={cn('will-change-transform', className)}
      style={{
        transform: active ? `scale(${scale.to})` : `scale(${scale.from})`,
        opacity: active ? 1 : 0,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easings.backOut,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
