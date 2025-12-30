import React from 'react';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipBubbleProps {
  x: number;
  y: number;
  content: string;
  title?: string;
  isVisible?: boolean;
  position?: TooltipPosition;
  maxWidth?: number;
  className?: string;
}

export function TooltipBubble({
  x,
  y,
  content,
  title,
  isVisible = true,
  position = 'top',
  maxWidth = 280,
  className,
}: TooltipBubbleProps) {
  if (!isVisible) return null;

  const getPositionStyles = (): React.CSSProperties => {
    const offset = 16;
    
    switch (position) {
      case 'top':
        return {
          left: x,
          top: y - offset,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          left: x,
          top: y + offset,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          left: x - offset,
          top: y,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          left: x + offset,
          top: y,
          transform: 'translate(0, -50%)',
        };
    }
  };

  const getArrowStyles = (): string => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-background border-x-transparent border-b-transparent';
      case 'bottom':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-background border-x-transparent border-t-transparent';
      case 'left':
        return 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-background border-y-transparent border-r-transparent';
      case 'right':
        return 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-background border-y-transparent border-l-transparent';
    }
  };

  return (
    <div
      className={cn(
        "fixed z-[9995] pointer-events-none",
        "animate-[tooltip-appear_0.3s_ease-out_forwards]",
        className
      )}
      style={{
        ...getPositionStyles(),
        maxWidth,
      }}
    >
      {/* Tooltip content */}
      <div
        className="relative px-4 py-3 rounded-xl bg-background border border-border/50 shadow-2xl"
        style={{
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 60px hsl(var(--primary) / 0.1)',
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent)',
          }}
        />
        
        {/* Content */}
        <div className="relative">
          {title && (
            <h4 className="text-sm font-semibold text-primary mb-1">{title}</h4>
          )}
          <p className="text-sm text-foreground/90 leading-relaxed">{content}</p>
        </div>
        
        {/* Arrow */}
        <div
          className={cn(
            "absolute w-0 h-0 border-8",
            getArrowStyles()
          )}
        />
      </div>
    </div>
  );
}

// Multiple tooltips manager
interface TooltipSequenceProps {
  tooltips: Array<{
    id: string;
    x: number;
    y: number;
    content: string;
    title?: string;
    position?: TooltipPosition;
  }>;
  activeId?: string | null;
}

export function TooltipSequence({ tooltips, activeId }: TooltipSequenceProps) {
  return (
    <>
      {tooltips.map(tooltip => (
        <TooltipBubble
          key={tooltip.id}
          x={tooltip.x}
          y={tooltip.y}
          content={tooltip.content}
          title={tooltip.title}
          position={tooltip.position}
          isVisible={activeId === tooltip.id}
        />
      ))}
    </>
  );
}
