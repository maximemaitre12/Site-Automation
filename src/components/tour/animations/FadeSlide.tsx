import React from 'react';
import { cn } from '@/lib/utils';
import { easings } from '@/lib/animation-easings';

type Direction = 'up' | 'down' | 'left' | 'right';

interface FadeSlideProps {
  children: React.ReactNode;
  active: boolean;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

const directionTransforms: Record<Direction, (distance: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  down: (d) => `translateY(-${d}px)`,
  left: (d) => `translateX(${d}px)`,
  right: (d) => `translateX(-${d}px)`,
};

/**
 * Fade in with directional slide
 */
export function FadeSlide({
  children,
  active,
  direction = 'up',
  distance = 30,
  delay = 0,
  duration = 500,
  className,
}: FadeSlideProps) {
  const getTransform = () => {
    if (active) return 'translate(0, 0)';
    return directionTransforms[direction](distance);
  };

  return (
    <div
      className={cn(
        'transition-all will-change-transform',
        className
      )}
      style={{
        transform: getTransform(),
        opacity: active ? 1 : 0,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easings.easeOutExpo,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
