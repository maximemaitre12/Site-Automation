import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

interface AnimatedCursorProps {
  targetPosition: Position;
  isClicking?: boolean;
  isVisible?: boolean;
  delay?: number;
  duration?: number;
  onArrival?: () => void;
  onClickComplete?: () => void;
}

export function AnimatedCursor({
  targetPosition,
  isClicking = false,
  isVisible = true,
  delay = 0,
  duration = 800,
  onArrival,
  onClickComplete,
}: AnimatedCursorProps) {
  const [position, setPosition] = useState<Position>({ x: -100, y: -100 });
  const [showRipple, setShowRipple] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);

  // Move cursor to target
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsMoving(true);
      setHasArrived(false);
      
      // Animate position
      const startTime = Date.now();
      const startPos = { ...position };
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - cubic bezier approximation
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const newX = startPos.x + (targetPosition.x - startPos.x) * eased;
        const newY = startPos.y + (targetPosition.y - startPos.y) * eased;
        
        setPosition({ x: newX, y: newY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsMoving(false);
          setHasArrived(true);
          onArrival?.();
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetPosition.x, targetPosition.y, delay, duration, isVisible]);

  // Handle click animation
  useEffect(() => {
    if (isClicking && hasArrived) {
      setShowRipple(true);
      const timer = setTimeout(() => {
        setShowRipple(false);
        onClickComplete?.();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isClicking, hasArrived, onClickComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Cursor trail */}
      {isMoving && (
        <div
          className="absolute w-8 h-8 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'cursor-trail 0.3s ease-out forwards',
          }}
        />
      )}

      {/* Main cursor */}
      <div
        className={cn(
          "relative transition-transform duration-100",
          isClicking && "scale-90"
        )}
      >
        {/* Outer ring */}
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 border-primary/60 transition-all duration-200",
            isMoving && "scale-110 border-primary/40",
            isClicking && "scale-75 border-primary"
          )}
          style={{
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
          }}
        />
        
        {/* Center dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-100",
            isClicking && "scale-150 bg-white"
          )}
        />
      </div>

      {/* Click ripple effect */}
      {showRipple && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'cursor-ripple 0.4s ease-out forwards',
          }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary opacity-80" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border border-primary/50" 
               style={{ animation: 'cursor-ripple-inner 0.3s ease-out forwards' }} />
        </div>
      )}
    </div>
  );
}

// Hook for managing cursor animations
export function useCursorAnimation() {
  const [cursorState, setCursorState] = useState({
    position: { x: 100, y: 100 },
    isClicking: false,
    isVisible: true,
  });

  const moveTo = (x: number, y: number, duration = 800) => {
    return new Promise<void>((resolve) => {
      setCursorState(prev => ({
        ...prev,
        position: { x, y },
      }));
      setTimeout(resolve, duration + 100);
    });
  };

  const click = () => {
    return new Promise<void>((resolve) => {
      setCursorState(prev => ({ ...prev, isClicking: true }));
      setTimeout(() => {
        setCursorState(prev => ({ ...prev, isClicking: false }));
        resolve();
      }, 400);
    });
  };

  const hide = () => {
    setCursorState(prev => ({ ...prev, isVisible: false }));
  };

  const show = () => {
    setCursorState(prev => ({ ...prev, isVisible: true }));
  };

  return {
    cursorState,
    moveTo,
    click,
    hide,
    show,
  };
}
