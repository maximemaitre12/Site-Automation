import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SectionTransitionZone() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = zoneRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)));
        setScrollProgress(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  const lineHeight = Math.min(1, scrollProgress * 2.5); // line draws in first 40% of scroll
  const taglineOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 4)); // fades in 30-55%
  const taglineY = 12 - taglineOpacity * 12;

  return (
    <div
      ref={zoneRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: 240,
        background: "#0a2d6e",
      }}
    >
      {/* Floating particles continuing from above */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            background: `rgba(168,221,255,${0.1 + (i % 3) * 0.04})`,
            top: `${15 + i * 20}%`,
            left: `${20 + (i * 17) % 60}%`,
            animation: `transition-particle-${i} ${7 + i * 2}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Vertical dotted line drawing in */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-px"
        style={{
          height: `${lineHeight * 100}%`,
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 4px, transparent 4px, transparent 12px)",
          transition: "height 0.1s linear",
        }}
      />

      {/* Tagline */}
      <p
        className="relative z-10 text-[15px] italic font-light text-center px-6"
        style={{
          color: `rgba(255,255,255,${0.6 * taglineOpacity})`,
          transform: `translateY(${taglineY}px)`,
          transition: "transform 0.15s ease",
        }}
      >
        Et voilà ce qui se cache à l'intérieur.
      </p>

      {/* Scroll chevron */}
      <div
        className="relative z-10 mt-5"
        style={{
          opacity: Math.max(0, taglineOpacity * 0.5),
        }}
      >
        <ChevronDown
          className="w-5 h-5"
          style={{
            color: "rgba(255,255,255,0.35)",
            animation: "bounce-chevron 2s ease-in-out infinite",
          }}
          strokeWidth={1.5}
        />
      </div>

      {/* Cyan pulse at bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(168,221,255,0.06) 0%, transparent 70%)",
          opacity: scrollProgress > 0.6 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      <style>{`
        @keyframes bounce-chevron {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes transition-particle-0 { 0%,100% { transform: translate(0,0); opacity: 0.15; } 50% { transform: translate(6px,-10px); opacity: 0.3; } }
        @keyframes transition-particle-1 { 0%,100% { transform: translate(0,0); opacity: 0.1; } 50% { transform: translate(-8px,8px); opacity: 0.25; } }
        @keyframes transition-particle-2 { 0%,100% { transform: translate(0,0); opacity: 0.12; } 50% { transform: translate(10px,6px); opacity: 0.28; } }
        @keyframes transition-particle-3 { 0%,100% { transform: translate(0,0); opacity: 0.1; } 50% { transform: translate(-5px,-12px); opacity: 0.22; } }
      `}</style>
    </div>
  );
}
