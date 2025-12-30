import React from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  isVisible?: boolean;
  borderRadius?: number;
  padding?: number;
  className?: string;
}

export function Spotlight({
  x,
  y,
  width = 200,
  height = 100,
  isVisible = true,
  borderRadius = 12,
  padding = 16,
  className,
}: SpotlightProps) {
  if (!isVisible) return null;

  const adjustedX = x - padding;
  const adjustedY = y - padding;
  const adjustedWidth = width + padding * 2;
  const adjustedHeight = height + padding * 2;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9990] pointer-events-none transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Dark overlay with cutout */}
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={adjustedX}
              y={adjustedY}
              width={adjustedWidth}
              height={adjustedHeight}
              rx={borderRadius}
              fill="black"
              className="animate-[spotlight-pulse_2s_ease-in-out_infinite]"
            />
          </mask>
          <filter id="spotlight-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Dark background */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          className="transition-all duration-500"
        />
        
        {/* Glowing border around spotlight */}
        <rect
          x={adjustedX}
          y={adjustedY}
          width={adjustedWidth}
          height={adjustedHeight}
          rx={borderRadius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          filter="url(#spotlight-glow)"
          className="animate-[spotlight-border_2s_ease-in-out_infinite]"
        />
      </svg>
    </div>
  );
}

// Animated spotlight that follows elements
interface DynamicSpotlightProps {
  target: { x: number; y: number; width: number; height: number } | null;
  isVisible?: boolean;
}

export function DynamicSpotlight({ target, isVisible = true }: DynamicSpotlightProps) {
  if (!target || !isVisible) return null;

  return (
    <Spotlight
      x={target.x}
      y={target.y}
      width={target.width}
      height={target.height}
      isVisible={isVisible}
    />
  );
}
