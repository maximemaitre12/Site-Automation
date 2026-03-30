import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const rings = [
  { label: "Opérations critiques", radius: 40 },
  { label: "Simplifier", radius: 80 },
  { label: "Structurer", radius: 120 },
  { label: "Améliorer", radius: 160 },
];

function ConcentricDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeRing, setActiveRing] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    rings.forEach((_, i) => {
      setTimeout(() => setActiveRing(i), 400 + i * 400);
    });
  }, [isVisible]);

  return (
    <svg viewBox="0 0 340 340" className="w-full max-w-[280px] sm:max-w-[320px] mx-auto" preserveAspectRatio="xMidYMid meet">
      {rings.slice().reverse().map((ring, reverseI) => {
        const i = rings.length - 1 - reverseI;
        const isActive = i <= activeRing;
        return (
          <g key={i}>
            <circle
              cx="170" cy="170"
              r={ring.radius}
              fill={i === 0 && isActive ? "hsl(var(--primary) / 0.1)" : "none"}
              stroke={isActive ? `hsl(var(--primary) / ${1 - i * 0.2})` : "hsl(var(--muted-foreground) / 0.1)"}
              strokeWidth={i === 0 ? 2 : 1}
              className="transition-all duration-700"
            />
            {isActive && i > 0 && (
              <circle
                cx="170" cy="170" r={ring.radius}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0"
              >
                <animate attributeName="opacity" values="0;0.3;0" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )}
            <text
              x="170"
              y={170 - ring.radius + (i === 0 ? 4 : 14)}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(
                "transition-all duration-500",
                isActive ? "fill-primary" : "fill-muted-foreground/40",
                i === 0 ? "text-[10px] font-semibold" : "text-[8px] font-medium"
              )}
            >
              {ring.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function PositioningSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Diagram */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <ConcentricDiagram isVisible={isVisible} />
          </div>

          {/* Text */}
          <div className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )} style={{ transitionDelay: "200ms" }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
              Une approche orientée résultats
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
              Nous intervenons là où les inefficacités ont le plus d'impact : <span className="text-foreground font-medium">les opérations critiques</span>.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Notre objectif n'est pas d'ajouter de la complexité, mais de simplifier, structurer et améliorer ce qui existe déjà.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
