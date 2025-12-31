import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { easingFunctions, formatNumber } from '@/lib/animation-utils';

interface CountUpProps {
  value: number;
  active: boolean;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  onComplete?: () => void;
  formatFn?: (value: number) => string;
  easing?: keyof typeof easingFunctions;
}

/**
 * Animated counter with professional easing
 */
export function CountUp({
  value,
  active,
  duration = 1500,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  onComplete,
  formatFn,
  easing = 'easeOutExpo',
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setDisplayValue(0);
      hasCompletedRef.current = false;
      return;
    }

    const startAnimation = () => {
      const easingFn = easingFunctions[easing];
      
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);
        
        setDisplayValue(easedProgress * value);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [active, value, duration, delay, easing, onComplete]);

  const formattedValue = formatFn 
    ? formatFn(displayValue)
    : displayValue.toFixed(decimals);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
