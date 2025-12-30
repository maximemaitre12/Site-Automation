import React from 'react';
import { cn } from '@/lib/utils';
import { tourScripts } from '@/data/tourNarration';

interface TourProgressProps {
  progress: number;
  currentSceneIndex: number;
  onSceneClick: (index: number) => void;
}

export function TourProgress({ progress, currentSceneIndex, onSceneClick }: TourProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scene markers */}
      <div className="flex justify-between gap-2">
        {tourScripts.map((script, index) => (
          <button
            key={script.id}
            onClick={() => onSceneClick(index)}
            className={cn(
              "flex-1 text-center py-2 px-1 rounded-lg transition-all duration-300 cursor-pointer",
              index === currentSceneIndex 
                ? "bg-primary/10 text-primary" 
                : index < currentSceneIndex 
                  ? "text-muted-foreground hover:bg-muted/50"
                  : "text-muted-foreground/50 hover:bg-muted/30"
            )}
          >
            <span className="text-xs font-medium truncate block">
              {script.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
