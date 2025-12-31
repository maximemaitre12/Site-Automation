import React from 'react';
import { cn } from '@/lib/utils';

interface ScanLineProps {
  active: boolean;
  direction?: 'horizontal' | 'vertical';
  duration?: number;
  delay?: number;
  color?: string;
  thickness?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Scanning laser line effect that reveals content
 */
export function ScanLine({
  active,
  direction = 'vertical',
  duration = 1500,
  delay = 0,
  color = 'hsl(var(--primary))',
  thickness = 2,
  className,
  children,
}: ScanLineProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Content with reveal animation */}
      <div
        style={{
          clipPath: active 
            ? 'inset(0 0 0 0)' 
            : isHorizontal 
              ? 'inset(0 100% 0 0)' 
              : 'inset(0 0 100% 0)',
          transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      >
        {children}
      </div>

      {/* Scan line */}
      <div
        className="absolute pointer-events-none"
        style={{
          background: `linear-gradient(${isHorizontal ? '90deg' : '180deg'}, 
            transparent, 
            ${color}, 
            ${color}, 
            transparent
          )`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          ...(isHorizontal ? {
            width: `${thickness}px`,
            height: '100%',
            top: 0,
            left: active ? '100%' : '0%',
          } : {
            width: '100%',
            height: `${thickness}px`,
            left: 0,
            top: active ? '100%' : '0%',
          }),
          transition: `${isHorizontal ? 'left' : 'top'} ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          opacity: active ? 0 : 1,
        }}
      />
    </div>
  );
}
