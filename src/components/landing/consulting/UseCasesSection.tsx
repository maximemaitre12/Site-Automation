import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const useCases = [
  {
    title: "Recrutement de profils critiques",
    subtitle: "De 45 jours à 12 jours en moyenne",
    before: [
      { label: "Tri manuel", status: "slow" },
      { label: "Flux lent", status: "blocked" },
      { label: "Admin lourd", status: "slow" },
    ],
    after: [
      { label: "Tri accéléré", status: "ok" },
      { label: "Flux optimisé", status: "ok" },
      { label: "Automatisé", status: "ok" },
    ],
  },
  {
    title: "Optimisation des processus",
    subtitle: "Réduction de 40% des délais opérationnels",
    before: [
      { label: "Répétitif", status: "slow" },
      { label: "Blocages", status: "blocked" },
      { label: "Non structuré", status: "slow" },
    ],
    after: [
      { label: "Simplifié", status: "ok" },
      { label: "Fluidifié", status: "ok" },
      { label: "Structuré", status: "ok" },
    ],
  },
];

function BeforeAfterDiagram({ useCase, isVisible, delay }: {
  useCase: typeof useCases[0];
  isVisible: boolean;
  delay: number;
}) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShowAfter(true), delay + 1000);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  return (
    <svg viewBox="0 0 380 130" className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={`case-glow-${delay}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Before label */}
      <text x="65" y="14" textAnchor="middle" className="text-[9px] font-semibold fill-muted-foreground/60 select-none uppercase">Avant</text>
      
      {/* After label */}
      <text x="315" y="14" textAnchor="middle" className="text-[9px] font-semibold fill-primary/60 select-none uppercase">Après</text>

      {/* Arrow */}
      <path d="M 155 65 L 225 65" fill="none" stroke={showAfter ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.15)"} strokeWidth="2" className="transition-all duration-700" markerEnd={showAfter ? "url(#case-arrow)" : undefined} />
      <defs>
        <marker id="case-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="hsl(var(--primary))" />
        </marker>
      </defs>

      {/* Particle on arrow */}
      {showAfter && (
        <circle r="3" fill="hsl(var(--primary))" opacity="0.6">
          <animateMotion dur="1.5s" repeatCount="indefinite" path="M 155 65 L 225 65" />
        </circle>
      )}

      {/* Before nodes */}
      {useCase.before.map((item, i) => {
        const y = 30 + i * 32;
        return (
          <g key={`b-${i}`}>
            <rect
              x="10" y={y} width="110" height="26" rx="6"
              fill={showAfter ? "hsl(var(--muted-foreground) / 0.04)" : "hsl(var(--destructive) / 0.06)"}
              stroke={showAfter ? "hsl(var(--muted-foreground) / 0.08)" : "hsl(var(--destructive) / 0.25)"}
              strokeWidth="1"
              className="transition-all duration-700"
            />
            {showAfter && (
              <line x1="15" y1={y + 13} x2="115" y2={y + 13} stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
            )}
            <text x="65" y={y + 14} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[9px] font-medium transition-all duration-500 select-none", showAfter ? "fill-muted-foreground/40" : "fill-destructive/70")}
            >
              {item.label}
            </text>
          </g>
        );
      })}

      {/* After nodes */}
      {useCase.after.map((item, i) => {
        const y = 30 + i * 32;
        return (
          <g key={`a-${i}`}>
            <rect
              x="260" y={y} width="110" height="26" rx="6"
              fill={showAfter ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted) / 0.3)"}
              stroke={showAfter ? "hsl(var(--primary) / 0.35)" : "hsl(var(--muted-foreground) / 0.08)"}
              strokeWidth={showAfter ? 1.5 : 1}
              className="transition-all duration-700"
              filter={showAfter ? `url(#case-glow-${delay})` : undefined}
            />
            {/* Check mark */}
            {showAfter && (
              <circle cx="275" cy={y + 13} r="5" fill="hsl(var(--primary) / 0.2)">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
              </circle>
            )}
            <text x="320" y={y + 14} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[9px] font-medium transition-all duration-500 select-none", showAfter ? "fill-primary" : "fill-muted-foreground/30")}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function UseCasesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-12 sm:mb-16 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Cas d'usage <span className="text-primary">concrets</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Des transformations mesurables chez nos clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className={cn(
                "group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-600 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 200 + 200}ms` }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">{uc.title}</h3>
              <p className="text-xs text-primary font-medium mb-5">{uc.subtitle}</p>
              <BeforeAfterDiagram useCase={uc} isVisible={isVisible} delay={i * 300} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
