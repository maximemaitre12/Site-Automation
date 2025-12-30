import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ClickRippleProps {
  x: number;
  y: number;
  isActive?: boolean;
  onComplete?: () => void;
  color?: string;
  size?: number;
}

export function ClickRipple({
  x,
  y,
  isActive = false,
  onComplete,
  color = 'hsl(var(--primary))',
  size = 60,
}: ClickRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const id = Date.now();
      setRipples(prev => [...prev, { id, x, y }]);
      
      const timer = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
        onComplete?.();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isActive, x, y, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Primary ripple */}
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid ${color}`,
              animation: 'ripple-expand 0.6s ease-out forwards',
            }}
          />
          
          {/* Secondary ripple */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: color,
              opacity: 0.3,
              animation: 'ripple-fade 0.4s ease-out forwards',
            }}
          />
          
          {/* Center dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: color,
              animation: 'ripple-dot 0.3s ease-out forwards',
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Multiple click ripple manager
interface RippleManagerProps {
  clicks: Array<{ x: number; y: number; timestamp: number }>;
}

export function RippleManager({ clicks }: RippleManagerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {clicks.map(click => (
        <ClickRipple
          key={click.timestamp}
          x={click.x}
          y={click.y}
          isActive={true}
        />
      ))}
    </div>
  );
}
