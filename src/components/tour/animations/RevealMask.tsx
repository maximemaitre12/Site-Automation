import React from 'react';
import { cn } from '@/lib/utils';

interface RevealMaskProps {
  children: React.ReactNode;
  active: boolean;
  direction?: 'left' | 'right' | 'up' | 'down' | 'center';
  duration?: number;
  delay?: number;
  className?: string;
}

const clipPaths: Record<string, { from: string; to: string }> = {
  left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0 0 0)' },
  right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0)' },
  up: { from: 'inset(100% 0 0 0)', to: 'inset(0 0 0 0)' },
  down: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' },
  center: { from: 'inset(50% 50% 50% 50%)', to: 'inset(0 0 0 0)' },
};

/**
 * Reveal content with clip-path mask animation
 */
export function RevealMask({
  children,
  active,
  direction = 'left',
  duration = 800,
  delay = 0,
  className,
}: RevealMaskProps) {
  const { from, to } = clipPaths[direction];

  return (
    <div
      className={cn('will-change-[clip-path]', className)}
      style={{
        clipPath: active ? to : from,
        transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
