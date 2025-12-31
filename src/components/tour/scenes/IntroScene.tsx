import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

interface IntroSceneProps {
  isActive: boolean;
  progress: number;
}

export function IntroScene({ isActive, progress }: IntroSceneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Simple fade in
    if (progress < 20) setPhase(1);
    else setPhase(2);
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white">
      {/* Logo only - centered, no effects */}
      <div 
        className={cn(
          "transition-all duration-1000",
          phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <img 
          src={aetherLogo} 
          alt="AETHER" 
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
        />
      </div>
    </div>
  );
}
