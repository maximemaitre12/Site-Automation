import React, { Children, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { easings } from '@/lib/animation-easings';

interface StaggerGroupProps {
  children: React.ReactNode;
  active: boolean;
  stagger?: number;
  baseDelay?: number;
  duration?: number;
  className?: string;
  animation?: 'fade' | 'spring' | 'slide';
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Animate children with staggered delays
 */
export function StaggerGroup({
  children,
  active,
  stagger = 100,
  baseDelay = 0,
  duration = 500,
  className,
  animation = 'fade',
  direction = 'up',
}: StaggerGroupProps) {
  const getTransform = (isActive: boolean) => {
    if (isActive) return 'translate(0, 0) scale(1)';
    
    switch (animation) {
      case 'spring':
        return 'scale(0.5)';
      case 'slide':
        const distance = 30;
        switch (direction) {
          case 'up': return `translateY(${distance}px)`;
          case 'down': return `translateY(-${distance}px)`;
          case 'left': return `translateX(${distance}px)`;
          case 'right': return `translateX(-${distance}px)`;
        }
      default:
        return 'translateY(20px)';
    }
  };

  const getEasing = () => {
    switch (animation) {
      case 'spring':
        return easings.spring;
      case 'slide':
        return easings.easeOutExpo;
      default:
        return easings.smooth;
    }
  };

  const childArray = Children.toArray(children);

  return (
    <div className={cn('', className)}>
      {childArray.map((child, index) => {
        const delay = baseDelay + index * stagger;
        const isItemActive = active;

        if (!isValidElement(child)) return child;

        return (
          <div
            key={index}
            style={{
              transform: getTransform(isItemActive),
              opacity: isItemActive ? 1 : 0,
              filter: animation === 'spring' && !isItemActive ? 'blur(8px)' : 'blur(0px)',
              transitionProperty: 'transform, opacity, filter',
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: getEasing(),
              transitionDelay: `${delay}ms`,
              willChange: 'transform, opacity',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
