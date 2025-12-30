import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypeWriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  onComplete?: () => void;
  isActive?: boolean;
}

export function TypeWriter({
  text,
  delay = 0,
  speed = 50,
  className,
  cursorClassName,
  showCursor = true,
  onComplete,
  isActive = true,
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      
      const typeChar = () => {
        if (charIndex < text.length) {
          // Add slight randomness to typing speed for realism
          const variance = Math.random() * 30 - 15;
          const charSpeed = speed + variance;
          
          // Pause longer on punctuation
          const currentChar = text[charIndex];
          const isPunctuation = ['.', ',', '!', '?', ';', ':'].includes(currentChar);
          const pauseMultiplier = isPunctuation ? 3 : 1;
          
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          
          timeoutId = setTimeout(typeChar, charSpeed * pauseMultiplier);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      };

      typeChar();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, delay, speed, isActive, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;
    
    const interval = setInterval(() => {
      setShowCursorBlink(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <span className={cn("inline", className)}>
      {displayedText}
      {showCursor && (
        <span
          className={cn(
            "inline-block w-0.5 h-[1.1em] ml-0.5 align-middle transition-opacity duration-100",
            isTyping ? "bg-primary" : "bg-primary/70",
            !showCursorBlink && !isTyping && "opacity-0",
            cursorClassName
          )}
        />
      )}
    </span>
  );
}

// Hook for programmatic typewriter control
export function useTypeWriter(text: string, options?: { speed?: number; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const start = () => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setIsComplete(false);
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < text.length) {
          const variance = Math.random() * 20 - 10;
          const speed = (options?.speed || 50) + variance;
          
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          
          setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          resolve();
        }
      };

      setTimeout(typeChar, options?.delay || 0);
    });
  };

  const reset = () => {
    setDisplayedText('');
    setIsComplete(false);
    setIsTyping(false);
  };

  return {
    displayedText,
    isComplete,
    isTyping,
    start,
    reset,
  };
}
