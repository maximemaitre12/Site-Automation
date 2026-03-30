import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const problems = [
  { label: "Processus trop longs ou manuels", shortLabel: "Process" },
  { label: "Difficulté à recruter sur postes critiques", shortLabel: "Recrutement" },
  { label: "Tâches répétitives à faible valeur", shortLabel: "Répétitif" },
  { label: "Manque de visibilité sur les flux", shortLabel: "Visibilité" },
  { label: "Opérations peu structurées", shortLabel: "Structure" },
];

function ProblemsDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setScanY((prev) => {
        if (prev >= 260) {
          clearInterval(interval);
          return 260;
        }
        return prev + 3;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    problems.forEach((_, i) => {
      const threshold = 20 + i * 50;
      if (scanY >= threshold) {
        setTimeout(() => setActiveIndex((prev) => Math.max(prev, i)), i * 80);
      }
    });
  }, [scanY, isVisible]);

  return (
    <svg viewBox="0 0 200 280" className="w-full max-w-[160px] sm:max-w-[200px] mx-auto" preserveAspectRatio="xMidYMid meet">
      {/* Connections (dashed = slow) */}
      {problems.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1="100" y1={40 + i * 50 + 16}
          x2="100" y2={40 + (i + 1) * 50 - 16}
          stroke={i <= activeIndex ? "hsl(var(--destructive) / 0.4)" : "hsl(var(--muted-foreground) / 0.15)"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="transition-all duration-500"
        />
      ))}

      {/* Scan beam */}
      {isVisible && scanY < 260 && (
        <rect x="20" y={scanY} width="160" height="2" fill="hsl(var(--primary))" opacity="0.25" rx="1" />
      )}

      {/* Nodes */}
      {problems.map((p, i) => {
        const isActive = i <= activeIndex;
        const cy = 40 + i * 50;
        return (
          <g key={i}>
            <rect
              x="40" y={cy - 14}
              width="120" height="28"
              rx="6"
              fill={isActive ? "hsl(var(--destructive) / 0.08)" : "hsl(var(--muted))"}
              stroke={isActive ? "hsl(var(--destructive) / 0.5)" : "hsl(var(--muted-foreground) / 0.15)"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            {isActive && (
              <rect
                x="40" y={cy - 14}
                width="120" height="28"
                rx="6"
                fill="none"
                stroke="hsl(var(--destructive) / 0.3)"
                strokeWidth="1"
              >
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="3" />
              </rect>
            )}
            <text
              x="100" y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(
                "text-[8px] font-medium transition-colors duration-500",
                isActive ? "fill-destructive" : "fill-muted-foreground"
              )}
            >
              {p.shortLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProblemsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Des inefficacités invisibles qui ralentissent votre activité
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Dans de nombreuses organisations, des points de friction freinent la performance sans être toujours identifiés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Diagram */}
          <div className={cn(
            "order-2 md:order-1 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <ProblemsDiagram isVisible={isVisible} />
          </div>

          {/* Text list */}
          <div className="order-1 md:order-2 space-y-4">
            {problems.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-2 h-2 rounded-full bg-destructive/60 mt-1.5 shrink-0" />
                <p className="text-sm sm:text-base text-foreground">{p.label}</p>
              </div>
            ))}
            <p className={cn(
              "text-sm text-muted-foreground italic pt-2 transition-all duration-500",
              isVisible ? "opacity-100" : "opacity-0"
            )} style={{ transitionDelay: "600ms" }}>
              Ces inefficacités ont un impact direct sur vos coûts, vos délais et votre capacité à exécuter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
