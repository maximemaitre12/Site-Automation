import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const rings = [
  { label: "Opérations\ncritiques", radius: 50, desc: "Le cœur de votre performance" },
  { label: "Simplifier", radius: 100, desc: "Éliminer le superflu" },
  { label: "Structurer", radius: 150, desc: "Organiser pour durer" },
  { label: "Améliorer", radius: 200, desc: "Optimiser en continu" },
];

function ConcentricDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeRing, setActiveRing] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    rings.forEach((_, i) => {
      setTimeout(() => setActiveRing(i), 400 + i * 500);
    });
  }, [isVisible]);

  const cx = 220, cy = 220;

  return (
    <svg viewBox="0 0 440 440" className="w-full max-w-[380px] sm:max-w-[420px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Center glow */}
      {activeRing >= 0 && (
        <circle cx={cx} cy={cy} r="70" fill="url(#center-glow)">
          <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Rings from outside in */}
      {rings.slice().reverse().map((ring, reverseI) => {
        const i = rings.length - 1 - reverseI;
        const isActive = i <= activeRing;
        const opacity = isActive ? Math.max(0.3, 1 - i * 0.2) : 0.08;
        
        return (
          <g key={i}>
            {/* Ring */}
            <circle
              cx={cx} cy={cy}
              r={ring.radius}
              fill={i === 0 && isActive ? "hsl(var(--primary) / 0.1)" : "none"}
              stroke={isActive ? `hsl(var(--primary))` : "hsl(var(--muted-foreground))"}
              strokeWidth={i === 0 ? 2.5 : 1.5}
              opacity={opacity}
              className="transition-all duration-800"
              filter={isActive && i === 0 ? "url(#ring-glow)" : undefined}
            />

            {/* Pulse ring */}
            {isActive && i > 0 && (
              <circle
                cx={cx} cy={cy} r={ring.radius}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0"
              >
                <animate attributeName="opacity" values="0;0.3;0" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="r" values={`${ring.radius};${ring.radius + 5};${ring.radius}`} dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            )}

            {/* Label */}
            {i === 0 ? (
              <>
                <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
                  className={cn("text-[12px] font-bold transition-all duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/30")}
                >
                  Opérations
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
                  className={cn("text-[12px] font-bold transition-all duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/30")}
                >
                  critiques
                </text>
              </>
            ) : (
              <text
                x={cx} y={cy - ring.radius + 16}
                textAnchor="middle" dominantBaseline="middle"
                className={cn(
                  "transition-all duration-500 font-semibold select-none",
                  isActive ? "fill-primary" : "fill-muted-foreground/20",
                  i === 1 ? "text-[11px]" : "text-[10px]"
                )}
              >
                {ring.label}
              </text>
            )}

            {/* Orbital dots on outer rings */}
            {isActive && i > 0 && (
              <circle r="4" fill="hsl(var(--primary))" opacity="0.5">
                <animateMotion
                  dur={`${4 + i * 2}s`}
                  repeatCount="indefinite"
                  path={`M ${cx + ring.radius} ${cy} A ${ring.radius} ${ring.radius} 0 1 1 ${cx + ring.radius - 0.01} ${cy}`}
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function PositioningSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Diagram — large */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-85"
          )}>
            <ConcentricDiagram isVisible={isVisible} />
          </div>

          {/* Text */}
          <div className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )} style={{ transitionDelay: "300ms" }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-5">
              Une approche orientée{" "}
              <span className="text-primary">résultats</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Nous intervenons là où les inefficacités ont le plus d'impact : <span className="text-foreground font-medium">les opérations critiques</span>.
            </p>
            <div className="space-y-4">
              {rings.slice(1).map((ring, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/30 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${500 + i * 150}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ring.label}</p>
                    <p className="text-xs text-muted-foreground">{ring.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
