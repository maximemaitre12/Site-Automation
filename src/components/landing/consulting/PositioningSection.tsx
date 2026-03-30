import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const rings = [
  { label: "Opérations critiques", radius: 45 },
  { label: "Simplifier", radius: 95 },
  { label: "Structurer", radius: 145 },
  { label: "Améliorer", radius: 195 },
];

function ConcentricDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeRing, setActiveRing] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    const timers = rings.map((_, i) =>
      setTimeout(() => setActiveRing(i), 300 + i * 450)
    );
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  const cx = 210, cy = 210;

  return (
    <svg viewBox="0 0 420 420" className="w-full max-w-[360px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="center-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rings outer to inner */}
      {rings.slice().reverse().map((ring, ri) => {
        const i = rings.length - 1 - ri;
        const active = i <= activeRing;

        return (
          <g key={i}>
            <circle
              cx={cx} cy={cy} r={ring.radius}
              fill={i === 0 && active ? "url(#center-fill)" : "none"}
              stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={i === 0 ? 2 : 1}
              opacity={active ? (i === 0 ? 0.7 : 0.25 - i * 0.04) : 0.06}
              className="transition-all duration-700"
            />

            {/* Subtle orbit dot */}
            {active && i > 0 && (
              <circle r="3" fill="hsl(var(--primary))" opacity="0.25">
                <animateMotion
                  dur={`${8 + i * 4}s`}
                  repeatCount="indefinite"
                  path={`M ${cx + ring.radius} ${cy} A ${ring.radius} ${ring.radius} 0 1 1 ${cx + ring.radius - 0.01} ${cy}`}
                />
              </circle>
            )}

            {/* Label */}
            {i === 0 ? (
              <>
                <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle"
                  className={cn("text-[10px] font-semibold select-none transition-all duration-500", active ? "fill-foreground" : "fill-muted-foreground/20")}
                >Opérations</text>
                <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle"
                  className={cn("text-[10px] font-semibold select-none transition-all duration-500", active ? "fill-foreground" : "fill-muted-foreground/20")}
                >critiques</text>
              </>
            ) : (
              <text x={cx} y={cy - ring.radius + 14} textAnchor="middle" dominantBaseline="middle"
                className={cn("text-[9px] font-medium select-none transition-all duration-500", active ? "fill-muted-foreground" : "fill-muted-foreground/15")}
              >{ring.label}</text>
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
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className={cn("transition-all duration-700", isVisible ? "opacity-100" : "opacity-0")}>
            <ConcentricDiagram isVisible={isVisible} />
          </div>

          <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")} style={{ transitionDelay: "200ms" }}>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Positionnement</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
              Une approche orientée résultats
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Nous intervenons là où les inefficacités ont le plus d'impact : les opérations critiques de votre organisation.
            </p>
            <div className="space-y-3">
              {rings.slice(1).map((ring, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border border-border/40 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                  )}
                  style={{ transitionDelay: `${400 + i * 120}ms` }}
                >
                  <div className="w-7 h-7 rounded bg-muted flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-muted-foreground">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{ring.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
