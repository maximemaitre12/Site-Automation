import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TourSceneProps {
  isActive: boolean;
  children: ReactNode;
  className?: string;
}

export function TourScene({ isActive, children, className }: TourSceneProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center transition-all duration-1000',
        isActive 
          ? 'opacity-100 scale-100 z-10' 
          : 'opacity-0 scale-95 z-0 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
}
