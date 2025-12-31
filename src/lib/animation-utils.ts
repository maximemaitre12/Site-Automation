// Animation utility functions for professional motion design

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, (value - inMin) / (inMax - inMin));
}

/**
 * Get normalized progress (0-1) for an element within its animation window
 */
export function getElementProgress(
  globalProgress: number,
  startPercent: number,
  endPercent: number
): number {
  if (globalProgress < startPercent) return 0;
  if (globalProgress >= endPercent) return 1;
  return (globalProgress - startPercent) / (endPercent - startPercent);
}

/**
 * Check if an element should be visible based on progress
 */
export function isElementVisible(
  globalProgress: number,
  startPercent: number
): boolean {
  return globalProgress >= startPercent;
}

/**
 * Check if an element is currently animating
 */
export function isElementAnimating(
  globalProgress: number,
  startPercent: number,
  endPercent: number
): boolean {
  return globalProgress >= startPercent && globalProgress < endPercent;
}

/**
 * Easing functions for programmatic animation
 */
export const easingFunctions = {
  linear: (t: number) => t,
  
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

/**
 * Apply easing function to a value
 */
export function applyEasing(
  progress: number,
  easingFn: keyof typeof easingFunctions = 'easeOutCubic'
): number {
  return easingFunctions[easingFn](clamp(progress, 0, 1));
}

/**
 * Generate random number within range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer within range
 */
export function randomIntInRange(min: number, max: number): number {
  return Math.floor(randomInRange(min, max + 1));
}

/**
 * Create an array of stagger delays
 */
export function createStaggerDelays(
  count: number,
  staggerMs: number,
  baseDelay: number = 0
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * staggerMs);
}

/**
 * Format number with suffix (K, M, etc.)
 */
export function formatNumber(value: number, suffix: string = ''): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M${suffix}`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${suffix}`;
  }
  return `${Math.round(value)}${suffix}`;
}
