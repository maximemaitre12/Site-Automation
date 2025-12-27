import { useEffect, useState } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  enabled?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
  enabled = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!enabled) {
      setCount(start);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = start + (end - start) * easeOut;
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration, enabled]);

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`;
  
  return { count, formattedCount };
}
