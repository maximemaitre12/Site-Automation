import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const effectiveDelay = Math.round(delay * 0.35);

  const transforms: Record<string, string> = {
    up: "translateY(18px)",
    left: "translateX(-18px)",
    right: "translateX(18px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.42s cubic-bezier(0.16,1,0.3,1) ${effectiveDelay}ms, transform 0.42s cubic-bezier(0.16,1,0.3,1) ${effectiveDelay}ms`,
      }}
    >
      {children}
    </div>
  );
}
