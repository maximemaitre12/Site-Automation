import { useMemo, useCallback } from 'react';
import { getElementProgress, isElementVisible, isElementAnimating, clamp } from '@/lib/animation-utils';

export interface TimelineElement {
  start: number; // Start percent (0-100)
  end: number;   // End percent (0-100)
  stagger?: number; // Stagger delay in ms for groups
  items?: number;   // Number of items for stagger groups
}

export interface Timeline {
  [key: string]: TimelineElement;
}

export interface ElementAnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  progress: number; // 0-1 within this element's animation window
  style: React.CSSProperties;
}

/**
 * Professional animation timeline orchestrator
 * Manages timing and state for all animated elements in a scene
 */
export function useAnimationTimeline(globalProgress: number, timeline: Timeline) {
  // Get animation state for a specific element
  const getElementState = useCallback((elementKey: string): ElementAnimationState => {
    const element = timeline[elementKey];
    if (!element) {
      return {
        isVisible: false,
        isAnimating: false,
        progress: 0,
        style: { opacity: 0 },
      };
    }

    const isVisible = isElementVisible(globalProgress, element.start);
    const isAnimatingNow = isElementAnimating(globalProgress, element.start, element.end);
    const progress = getElementProgress(globalProgress, element.start, element.end);

    return {
      isVisible,
      isAnimating: isAnimatingNow,
      progress: clamp(progress, 0, 1),
      style: {
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      } as React.CSSProperties,
    };
  }, [globalProgress, timeline]);

  // Check if element is active (visible and past start)
  const isActive = useCallback((elementKey: string): boolean => {
    const element = timeline[elementKey];
    if (!element) return false;
    return globalProgress >= element.start;
  }, [globalProgress, timeline]);

  // Get progress for a specific element (0-1)
  const getProgress = useCallback((elementKey: string): number => {
    const element = timeline[elementKey];
    if (!element) return 0;
    return clamp(getElementProgress(globalProgress, element.start, element.end), 0, 1);
  }, [globalProgress, timeline]);

  // Get stagger delay for an item in a group
  const getStaggerDelay = useCallback((elementKey: string, index: number): number => {
    const element = timeline[elementKey];
    if (!element || !element.stagger) return 0;
    return index * element.stagger;
  }, [timeline]);

  // Check if a staggered item should be visible
  const isStaggerItemActive = useCallback((elementKey: string, index: number): boolean => {
    const element = timeline[elementKey];
    if (!element) return false;
    
    const stagger = element.stagger || 100;
    const itemDelay = (index * stagger) / 10; // Convert to percent offset
    const adjustedStart = element.start + itemDelay;
    
    return globalProgress >= adjustedStart;
  }, [globalProgress, timeline]);

  // Get all active elements
  const activeElements = useMemo(() => {
    return Object.keys(timeline).filter(key => isActive(key));
  }, [timeline, isActive]);

  // Get current phase (which element is actively animating)
  const currentPhase = useMemo(() => {
    for (const key of Object.keys(timeline)) {
      const element = timeline[key];
      if (isElementAnimating(globalProgress, element.start, element.end)) {
        return key;
      }
    }
    return null;
  }, [globalProgress, timeline]);

  return {
    getElementState,
    isActive,
    getProgress,
    getStaggerDelay,
    isStaggerItemActive,
    activeElements,
    currentPhase,
    globalProgress,
  };
}

export type AnimationTimeline = ReturnType<typeof useAnimationTimeline>;
