import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipForward, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onToggleMute: () => void;
  onSkip: () => void;
  onReset: () => void;
  onClose: () => void;
}

export function TourControls({
  isPlaying,
  isMuted,
  isLoading,
  progress,
  onPlay,
  onPause,
  onToggleMute,
  onSkip,
  onReset,
  onClose,
}: TourControlsProps) {
  const isComplete = progress >= 100;

  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause/Replay button */}
      {isComplete ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className={cn(
            "w-12 h-12 rounded-full transition-all",
            isPlaying && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>
      )}

      {/* Mute button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className="w-10 h-10 rounded-full"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>

      {/* Skip button */}
      {!isComplete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkip}
          className="w-10 h-10 rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      )}

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="w-10 h-10 rounded-full"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}
