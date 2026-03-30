import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const problems = [
  { label: "Processus trop longs ou manuels", shortLabel: "Processus manuels", icon: "⏱" },
  { label: "Difficulté à recruter sur postes critiques", shortLabel: "Recrutement lent", icon: "👥" },
  { label: "Tâches répétitives à faible valeur", shortLabel: "Tâches répétitives", icon: "🔄" },
  { label: "Manque de visibilité sur les flux", shortLabel: "Flux opaques", icon: "👁" },
  { label: "Opérations peu structurées", shortLabel: "Non structuré", icon: "📋" },
];

function ProblemsDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setScanY((prev) => {
        if (prev >= 400) { clearInterval(interval); return 400; }
        return prev + 2;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    problems.forEach((_, i) => {
      const threshold = 30 + i * 75;
      if (scanY >= threshold) {
        setActiveIndex((prev) => Math.max(prev, i));
      }
    });
  }, [scanY, isVisible]);

  const nodeHeight = 44;
  const gap = 75;
  const startY = 50;

  return (
    <svg viewBox="0 0 360 430" className="w-full max-w-sm mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="scan-problems" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--destructive))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
        </linearGradient>
        <filter id="red-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Vertical connection line */}
      <line
        x1="180" y1={startY + nodeHeight / 2}
        x2="180" y2={startY + (problems.length - 1) * gap + nodeHeight / 2}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.15"
      />

      {/* Scan beam */}
      {isVisible && scanY < 400 && (
        <rect x="20" y={scanY - 20} width="320" height="40" fill="url(#scan-problems)" />
      )}

      {/* Nodes */}
      {problems.map((p, i) => {
        const isActive = i <= activeIndex;
        const cy = startY + i * gap;
        return (
          <g key={i}>
            {/* Connection dots */}
            {i < problems.length - 1 && (
              <circle
                cx="180" cy={cy + nodeHeight / 2 + gap / 2}
                r="3"
                fill={isActive ? "hsl(var(--destructive) / 0.4)" : "hsl(var(--muted-foreground) / 0.15)"}
                className="transition-all duration-500"
              />
            )}

            {/* Pulse ring */}
            {isActive && (
              <rect
                x="35" y={cy - 4}
                width="290" height={nodeHeight + 8}
                rx="14"
                fill="none"
                stroke="hsl(var(--destructive))"
                strokeWidth="1"
                opacity="0"
              >
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="3" />
              </rect>
            )}

            {/* Node background */}
            <rect
              x="40" y={cy}
              width="280" height={nodeHeight}
              rx="10"
              fill={isActive ? "hsl(var(--destructive) / 0.06)" : "hsl(var(--muted) / 0.5)"}
              stroke={isActive ? "hsl(var(--destructive) / 0.35)" : "hsl(var(--muted-foreground) / 0.1)"}
              strokeWidth={isActive ? 1.5 : 1}
              className="transition-all duration-600"
            />

            {/* Warning indicator */}
            {isActive && (
              <circle
                cx="62" cy={cy + nodeHeight / 2}
                r="10"
                fill="hsl(var(--destructive) / 0.12)"
                stroke="hsl(var(--destructive) / 0.4)"
                strokeWidth="1"
                filter="url(#red-glow)"
              >
                <animate attributeName="r" values="8;11;8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            {isActive && (
              <text
                x="62" y={cy + nodeHeight / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                className="text-[8px]"
              >
                ⚠
              </text>
            )}

            {/* Label */}
            <text
              x="90" y={cy + nodeHeight / 2 + 1}
              dominantBaseline="middle"
              className={cn(
                "text-[11px] font-medium transition-colors duration-500 select-none",
                isActive ? "fill-destructive" : "fill-muted-foreground"
              )}
            >
              {p.shortLabel}
            </text>

            {/* Status bar */}
            <rect
              x="250" y={cy + nodeHeight / 2 - 3}
              width={isActive ? "50" : "0"}
              height="6"
              rx="3"
              fill="hsl(var(--destructive) / 0.3)"
              className="transition-all duration-700"
              style={{ transitionDelay: `${i * 100}ms` }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function ProblemsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--destructive)/0.03),transparent_60%)]" />
      
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-12 sm:mb-16 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Des inefficacités invisibles qui{" "}
            <span className="text-destructive">ralentissent</span> votre activité
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Dans de nombreuses organisations, des points de friction freinent la performance sans être toujours identifiés.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,1.1fr] gap-10 md:gap-14 items-center">
          {/* Diagram — prominent */}
          <div className={cn(
            "order-2 md:order-1 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <ProblemsDiagram isVisible={isVisible} />
          </div>

          {/* Text list */}
          <div className="order-1 md:order-2 space-y-5">
            {problems.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 p-3 rounded-lg transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0 bg-destructive/3" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="text-lg">{p.icon}</span>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">{p.label}</p>
              </div>
            ))}
            <p className={cn(
              "text-sm text-muted-foreground italic pt-2 border-l-2 border-destructive/30 pl-4 transition-all duration-500",
              isVisible ? "opacity-100" : "opacity-0"
            )} style={{ transitionDelay: "700ms" }}>
              Ces inefficacités ont un impact direct sur vos coûts, vos délais et votre capacité à exécuter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
