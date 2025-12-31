import React from 'react';
import { cn } from '@/lib/utils';

interface ZoomSpotlightProps {
  children: React.ReactNode;
  active: boolean;
  targetArea?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  zoomLevel?: number;
  className?: string;
}

// Map target areas to transform origins and translations
const targetConfig: Record<string, { origin: string; translate: { x: number; y: number } }> = {
  'top-left': { origin: 'top left', translate: { x: 15, y: 15 } },
  'top-center': { origin: 'top center', translate: { x: 0, y: 20 } },
  'top-right': { origin: 'top right', translate: { x: -15, y: 15 } },
  'center-left': { origin: 'center left', translate: { x: 20, y: 0 } },
  'center': { origin: 'center center', translate: { x: 0, y: 0 } },
  'center-right': { origin: 'center right', translate: { x: -20, y: 0 } },
  'bottom-left': { origin: 'bottom left', translate: { x: 15, y: -15 } },
  'bottom-center': { origin: 'bottom center', translate: { x: 0, y: -20 } },
  'bottom-right': { origin: 'bottom right', translate: { x: -15, y: -15 } },
};

/**
 * ZoomSpotlight - Creates a smooth zoom effect to focus on specific areas
 * Used in tour scenes to highlight features without overlapping elements
 */
export function ZoomSpotlight({ 
  children, 
  active, 
  targetArea = 'center',
  zoomLevel = 1.15,
  className 
}: ZoomSpotlightProps) {
  const config = targetConfig[targetArea] || targetConfig.center;
  
  return (
    <div 
      className={cn(
        "w-full h-full transition-all duration-1000 ease-out",
        className
      )}
      style={{
        transformOrigin: config.origin,
        transform: active 
          ? `scale(${zoomLevel}) translate(${config.translate.x}%, ${config.translate.y}%)`
          : 'scale(1) translate(0%, 0%)',
      }}
    >
      {children}
    </div>
  );
}
