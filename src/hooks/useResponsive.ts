import { useState, useEffect, useMemo } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
};

export function useResponsive() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentBreakpoint = useMemo((): Breakpoint => {
    if (windowWidth < breakpoints.xs) return 'xs';
    if (windowWidth < breakpoints.sm) return 'sm';
    if (windowWidth < breakpoints.md) return 'md';
    if (windowWidth < breakpoints.lg) return 'lg';
    if (windowWidth < breakpoints.xl) return 'xl';
    return '2xl';
  }, [windowWidth]);

  const isMobile = windowWidth < breakpoints.md;
  const isTablet = windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  const isDesktop = windowWidth >= breakpoints.lg;
  const isSmallMobile = windowWidth < breakpoints.sm;

  return {
    windowWidth,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    breakpoints,
  };
}
