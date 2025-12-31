import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureHighlightProps {
  children: React.ReactNode;
  active: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

/**
 * FeatureHighlight - Highlights an element without moving/zooming content
 * Uses glow effects, subtle scale, and z-index to emphasize without hiding other elements
 */
export function FeatureHighlight({ 
  children, 
  active, 
  intensity = 'medium',
  className 
}: FeatureHighlightProps) {
  const intensityStyles = {
    subtle: { 
      shadow: '0 0 20px hsla(var(--primary), 0.15), 0 0 40px hsla(var(--primary), 0.08)',
      scale: 1.01
    },
    medium: {
      shadow: '0 0 30px hsla(var(--primary), 0.2), 0 0 60px hsla(var(--primary), 0.1)',
      scale: 1.02
    },
    strong: {
      shadow: '0 0 40px hsla(var(--primary), 0.25), 0 0 80px hsla(var(--primary), 0.12)',
      scale: 1.03
    }
  };

  const style = intensityStyles[intensity];

  return (
    <div 
      className={cn(
        "relative transition-all duration-700 ease-out rounded-inherit",
        active && "z-20",
        className
      )}
      style={{
        transform: active ? `scale(${style.scale})` : 'scale(1)',
        boxShadow: active ? style.shadow : 'none',
      }}
    >
      {children}
    </div>
  );
}
