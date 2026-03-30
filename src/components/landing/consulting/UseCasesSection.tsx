import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const useCases = [
  {
    title: "Recrutement de profils critiques",
    before: ["Tri manuel", "Flux lent", "Tâches admin"],
    after: ["Tri accéléré", "Flux optimisé", "Automatisé"],
  },
  {
    title: "Optimisation des processus",
    before: ["Répétitif", "Blocages", "Non structuré"],
    after: ["Simplifié", "Fluidifié", "Structuré"],
  },
];

function BeforeAfterDiagram({ beforeItems, afterItems, isVisible, delay }: {
  beforeItems: string[];
  afterItems: string[];
  isVisible: boolean;
  delay: number;
}) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShowAfter(true), delay + 800);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  return (
    <svg viewBox="0 0 300 100" className="w-full max-w-[280px] mx-auto" preserveAspectRatio="xMidYMid meet">
      {/* Before nodes */}
      {beforeItems.map((item, i) => {
        const y = 15 + i * 30;
        return (
          <g key={`before-${i}`}>
            <rect
              x="10" y={y} width="80" height="22" rx="4"
              fill={showAfter ? "hsl(var(--muted-foreground) / 0.05)" : "hsl(var(--destructive) / 0.08)"}
              stroke={showAfter ? "hsl(var(--muted-foreground) / 0.1)" : "hsl(var(--destructive) / 0.3)"}
              strokeWidth="1"
              className="transition-all duration-700"
            />
            {showAfter && (
              <line x1="12" y1={y + 11} x2="88" y2={y + 11} stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" />
            )}
            <text
              x="50" y={y + 12} textAnchor="middle" dominantBaseline="middle"
              className={cn(
                "text-[7px] font-medium transition-all duration-500",
                showAfter ? "fill-muted-foreground/40" : "fill-destructive"
              )}
            >
              {item}
            </text>
          </g>
        );
      })}

      {/* Arrow */}
      <g>
        <line
          x1="105" y1="50" x2="185" y2="50"
          stroke={showAfter ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
          strokeWidth="1.5"
          markerEnd={showAfter ? "url(#uc-arrow)" : undefined}
          className="transition-all duration-500"
        />
        {showAfter && (
          <circle r="2.5" fill="hsl(var(--primary))" opacity="0.7">
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 105 50 L 185 50" />
          </circle>
        )}
      </g>

      <defs>
        <marker id="uc-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="hsl(var(--primary))" />
        </marker>
      </defs>

      {/* After nodes */}
      {afterItems.map((item, i) => {
        const y = 15 + i * 30;
        return (
          <g key={`after-${i}`}>
            <rect
              x="200" y={y} width="80" height="22" rx="4"
              fill={showAfter ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted))"}
              stroke={showAfter ? "hsl(var(--primary) / 0.4)" : "hsl(var(--muted-foreground) / 0.1)"}
              strokeWidth="1"
              className="transition-all duration-700"
            />
            <text
              x="240" y={y + 12} textAnchor="middle" dominantBaseline="middle"
              className={cn(
                "text-[7px] font-medium transition-all duration-500",
                showAfter ? "fill-primary" : "fill-muted-foreground/40"
              )}
            >
              {item}
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
    <section className="py-16 sm:py-24 bg-background">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Exemples d'optimisation
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border bg-card p-5 sm:p-6 transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-4 text-center">{uc.title}</h3>
              <BeforeAfterDiagram
                beforeItems={uc.before}
                afterItems={uc.after}
                isVisible={isVisible}
                delay={i * 300}
              />
              <div className="flex justify-between mt-3 px-2">
                <span className="text-[10px] text-muted-foreground">Avant</span>
                <span className="text-[10px] text-primary font-medium">Après</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
