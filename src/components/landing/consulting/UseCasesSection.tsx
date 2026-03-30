import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const useCases = [
  {
    title: "Recrutement de profils critiques",
    metric: "45j → 12j",
    before: ["Tri manuel", "Flux lent", "Admin lourd"],
    after: ["Tri accéléré", "Flux optimisé", "Automatisé"],
  },
  {
    title: "Optimisation des processus",
    metric: "−40% délais",
    before: ["Répétitif", "Blocages", "Non structuré"],
    after: ["Simplifié", "Fluidifié", "Structuré"],
  },
];

function TransformationDiagram({ useCase, isVisible, index }: {
  useCase: typeof useCases[0]; isVisible: boolean; index: number;
}) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShowAfter(true), 700 + index * 400);
    return () => clearTimeout(timer);
  }, [isVisible, index]);

  return (
    <svg viewBox="0 0 300 140" className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Before */}
      <text x="60" y="12" textAnchor="middle" className="text-[8px] font-medium fill-muted-foreground/50 uppercase tracking-wider select-none">Avant</text>
      {useCase.before.map((label, i) => (
        <g key={`b-${i}`}>
          <rect x="10" y={22 + i * 28} width="100" height="22" rx="4"
            fill={showAfter ? "hsl(var(--muted) / 0.2)" : "hsl(var(--destructive) / 0.04)"}
            stroke={showAfter ? "hsl(var(--border) / 0.4)" : "hsl(var(--destructive) / 0.15)"}
            strokeWidth="0.8"
            className="transition-all duration-700"
          />
          <text x="60" y={35 + i * 28} textAnchor="middle" dominantBaseline="middle"
            className={cn("text-[8px] font-medium select-none transition-all duration-500", showAfter ? "fill-muted-foreground/30" : "fill-muted-foreground/60")}
          >{label}</text>
        </g>
      ))}

      {/* Arrow */}
      <line x1="125" y1="50" x2="165" y2="50"
        stroke={showAfter ? "hsl(var(--primary))" : "hsl(var(--border))"}
        strokeWidth="1" opacity={showAfter ? 0.5 : 0.15}
        className="transition-all duration-500"
      />
      {showAfter && (
        <polygon points="163,46 172,50 163,54" fill="hsl(var(--primary))" opacity="0.5" />
      )}

      {/* After */}
      <text x="240" y="12" textAnchor="middle" className="text-[8px] font-medium fill-primary/40 uppercase tracking-wider select-none">Après</text>
      {useCase.after.map((label, i) => (
        <g key={`a-${i}`}>
          <rect x="190" y={22 + i * 28} width="100" height="22" rx="4"
            fill={showAfter ? "hsl(var(--primary) / 0.05)" : "hsl(var(--muted) / 0.15)"}
            stroke={showAfter ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border) / 0.3)"}
            strokeWidth={showAfter ? 1 : 0.8}
            className="transition-all duration-700"
          />
          <text x="240" y={35 + i * 28} textAnchor="middle" dominantBaseline="middle"
            className={cn("text-[8px] font-medium select-none transition-all duration-500", showAfter ? "fill-foreground/70" : "fill-muted-foreground/20")}
          >{label}</text>
        </g>
      ))}

      {/* Metric badge */}
      {showAfter && (
        <g>
          <rect x="115" y="108" width="70" height="22" rx="11" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.8" />
          <text x="150" y="120" textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-semibold fill-primary/70 select-none">{useCase.metric}</text>
        </g>
      )}
    </svg>
  );
}

export function UseCasesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Cas d'usage</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Transformations concrètes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border border-border/40 p-5 sm:p-6 transition-all duration-500 hover:border-primary/20",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 180 + 200}ms` }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">{uc.title}</h3>
              <TransformationDiagram useCase={uc} isVisible={isVisible} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
