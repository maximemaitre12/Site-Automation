// Professional animation easing curves and timing functions

export const easings = {
  // Spring physics - natural bounce feel
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springGentle: 'cubic-bezier(0.25, 1.25, 0.5, 1)',
  springBouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Smooth exponential curves
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  
  // Dramatic entrances
  dramaticIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  dramaticOut: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  
  // Snappy interactions
  snappy: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  snappyOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  
  // Smooth professional
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
  smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // Back easing (overshoot)
  backIn: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  backInOut: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  
  // Elastic feel
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export type EasingName = keyof typeof easings;

// Duration presets in ms
export const durations = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 600,
  verySlow: 1000,
  dramatic: 1500,
} as const;

// Stagger delay presets
export const staggers = {
  fast: 50,
  normal: 100,
  slow: 150,
  dramatic: 200,
} as const;

// Get easing value by name
export function getEasing(name: EasingName): string {
  return easings[name];
}

// Create CSS transition string
export function createTransition(
  properties: string | string[],
  duration: number = durations.normal,
  easing: EasingName = 'smooth',
  delay: number = 0
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const easingValue = easings[easing];
  
  return props
    .map(prop => `${prop} ${duration}ms ${easingValue} ${delay}ms`)
    .join(', ');
}

// Calculate stagger delay for an index
export function getStaggerDelay(
  index: number,
  stagger: number = staggers.normal,
  baseDelay: number = 0
): number {
  return baseDelay + (index * stagger);
}
