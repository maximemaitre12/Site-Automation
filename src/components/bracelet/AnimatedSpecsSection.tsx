import { useEffect, useRef, useState } from "react";

interface Props {
  specsSrc: string;
}

export default function AnimatedSpecsSection({ specsSrc }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 pb-28 overflow-hidden"
      style={{ background: "#0a2d6e" }}
    >
      {/* Floating particles continuing */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: `rgba(168,221,255,${0.08 + (i % 3) * 0.03})`,
            top: `${10 + i * 18}%`,
            left: `${15 + (i * 13) % 70}%`,
            animation: `specs-particle-${i} ${8 + i * 1.5}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Cyan pulse when entering */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,221,255,0.1) 0%, transparent 60%)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1.2)" : "scale(0.8)",
          transition: "opacity 0.8s ease, transform 1.2s ease",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header with staggered fade-in */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-white/45 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            Technical specifications
          </p>
          <h2
            className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
            }}
          >
            Engineered for performance
          </h2>
          <p
            className="text-base text-white/60 max-w-[500px] mx-auto"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            }}
          >
            Every component is designed to combine durability, comfort and cryptographic security
          </p>
        </div>

        {/* Specs image with scale-in */}
        <div
          style={{
            opacity: visible && imageLoaded ? 1 : 0,
            transform: visible && imageLoaded ? "scale(1) translateY(0)" : "scale(0.97) translateY(16px)",
            transition: "opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s",
          }}
        >
          <img
            src={specsSrc}
            alt="Oreon bracelet technical specifications — NFC, silicone, integrated antenna"
            className="w-full max-w-[1200px] mx-auto rounded-sm"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      <style>{`
        @keyframes specs-particle-0 { 0%,100% { transform: translate(0,0); opacity: 0.12; } 50% { transform: translate(8px,-14px); opacity: 0.25; } }
        @keyframes specs-particle-1 { 0%,100% { transform: translate(0,0); opacity: 0.1; } 50% { transform: translate(-12px,10px); opacity: 0.22; } }
        @keyframes specs-particle-2 { 0%,100% { transform: translate(0,0); opacity: 0.08; } 50% { transform: translate(6px,16px); opacity: 0.2; } }
        @keyframes specs-particle-3 { 0%,100% { transform: translate(0,0); opacity: 0.1; } 50% { transform: translate(-10px,-8px); opacity: 0.18; } }
        @keyframes specs-particle-4 { 0%,100% { transform: translate(0,0); opacity: 0.06; } 50% { transform: translate(14px,6px); opacity: 0.16; } }
      `}</style>
    </section>
  );
}
