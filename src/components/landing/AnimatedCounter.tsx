import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2000,
  className = "",
}: AnimatedCounterProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 });
  const { formattedCount } = useCountUp({
    end,
    suffix,
    prefix,
    decimals,
    duration,
    enabled: isVisible,
  });

  return (
    <span ref={ref} className={className}>
      {formattedCount}
    </span>
  );
}
