import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import aetherLogo from '@/assets/aether-logo-final.png';

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
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
        />
      </div>
    </div>
  );
}
