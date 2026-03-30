import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const problems = [
  { label: "Processus manuels chronophages", severity: 85 },
  { label: "Recrutement sur postes critiques", severity: 70 },
  { label: "Tâches répétitives à faible valeur", severity: 90 },
  { label: "Manque de visibilité sur les flux", severity: 65 },
  { label: "Organisation non structurée", severity: 75 },
];

function BottleneckDiagram({ isVisible }: { isVisible: boolean }) {
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timers = problems.map((_, i) =>
      setTimeout(() => setRevealCount(i + 1), 400 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  return (
    <svg viewBox="0 0 320 310" className="w-full max-w-[320px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="bar-shadow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Vertical axis */}
      <line x1="110" y1="20" x2="110" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Nodes */}
      {problems.map((p, i) => {
        const y = 35 + i * 55;
        const detected = i < revealCount;
        const barW = (p.severity / 100) * 180;

        return (
          <g key={i}>
            {/* Label left */}
            <text
              x="105" y={y + 10}
              textAnchor="end" dominantBaseline="middle"
              className={cn(
                "text-[9px] font-medium transition-all duration-500 select-none",
                detected ? "fill-foreground" : "fill-muted-foreground/25"
              )}
            >
              {p.label.length > 22 ? p.label.substring(0, 20) + "…" : p.label}
            </text>

            {/* Bar track */}
            <rect x="118" y={y + 3} width="180" height="14" rx="3" fill="hsl(var(--muted) / 0.4)" />

            {/* Bar fill */}
            <rect
              x="118" y={y + 3}
              width={detected ? barW : 0}
              height="14" rx="3"
              fill="hsl(var(--destructive) / 0.55)"
              className="transition-all duration-800 ease-out"
              style={{ transitionDelay: `${i * 100}ms` }}
            />

            {/* Percentage */}
            {detected && (
              <text
                x={120 + barW + 6} y={y + 11}
                dominantBaseline="middle"
                className="text-[8px] font-semibold fill-destructive/70 select-none"
              >
                {p.severity}%
              </text>
            )}

            {/* Critical indicator dot */}
            {detected && p.severity >= 80 && (
              <circle cx="310" cy={y + 10} r="3.5" fill="hsl(var(--destructive) / 0.6)">
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g>
        <circle cx="280" cy="300" r="3" fill="hsl(var(--destructive) / 0.6)" />
        <text x="288" y="301" dominantBaseline="middle" className="text-[7px] fill-muted-foreground select-none">Critique</text>
      </g>
    </svg>
  );
}

export function ProblemsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Diagnostic</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Identifier les freins à la performance
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Des points de friction souvent invisibles, mais dont l'impact cumulé est significatif.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* Diagram */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            <BottleneckDiagram isVisible={isVisible} />
          </div>

          {/* Description cards */}
          <div className="space-y-3">
            {problems.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border border-border/40 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: `${i * 80 + 200}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-sm text-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
