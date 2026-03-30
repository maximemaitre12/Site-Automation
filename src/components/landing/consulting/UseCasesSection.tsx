import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const useCases = [
  {
    title: "Recrutement de profils critiques",
    metric: "45j → 12j",
    before: { labels: ["Tri manuel", "Flux lent", "Admin lourd"], score: 35 },
    after: { labels: ["Tri IA", "Flux optimisé", "Automatisé"], score: 92 },
  },
  {
    title: "Optimisation des processus",
    metric: "−40% délais",
    before: { labels: ["Répétitif", "Blocages", "Non structuré"], score: 28 },
    after: { labels: ["Simplifié", "Fluidifié", "Structuré"], score: 88 },
  },
];

function TransformationDiagram({ useCase, isVisible, index }: {
  useCase: typeof useCases[0]; isVisible: boolean; index: number;
}) {
  const [showAfter, setShowAfter] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShowAfter(true), 800 + index * 400);
    return () => clearTimeout(timer);
  }, [isVisible, index]);

  useEffect(() => {
    if (!showAfter) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [showAfter]);

  const beforeScore = useCase.before.score;
  const afterScore = Math.round(useCase.after.score * progress);

  return (
    <svg viewBox="0 0 320 180" className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={`tf-glow-${index}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Before column */}
      <text x="70" y="16" textAnchor="middle" className="text-[9px] font-bold fill-muted-foreground/50 uppercase select-none">Avant</text>
      {useCase.before.labels.map((label, i) => (
        <g key={`b-${i}`}>
          <rect x="15" y={28 + i * 30} width="110" height="24" rx="6"
            fill={showAfter ? "hsl(var(--muted) / 0.3)" : "hsl(var(--destructive) / 0.06)"}
            stroke={showAfter ? "hsl(var(--muted-foreground) / 0.06)" : "hsl(var(--destructive) / 0.2)"}
            strokeWidth="1"
            className="transition-all duration-700"
          />
          {showAfter && <line x1="20" y1={40 + i * 30} x2="120" y2={40 + i * 30} stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth="0.8" />}
          <text x="70" y={42 + i * 30} textAnchor="middle" dominantBaseline="middle"
            className={cn("text-[9px] font-medium select-none transition-all duration-500", showAfter ? "fill-muted-foreground/35" : "fill-destructive/60")}
          >{label}</text>
        </g>
      ))}

      {/* Score gauge - before */}
      <rect x="30" y="125" width="80" height="8" rx="4" fill="hsl(var(--destructive) / 0.1)" />
      <rect x="30" y="125" width={80 * beforeScore / 100} height="8" rx="4" fill="hsl(var(--destructive) / 0.4)" />
      <text x="115" y="131" className="text-[8px] font-bold fill-destructive select-none">{beforeScore}%</text>

      {/* Arrow */}
      <g className={cn("transition-all duration-700", showAfter ? "opacity-100" : "opacity-20")}>
        <line x1="140" y1="55" x2="175" y2="55" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#tf-arrow)" />
        <defs>
          <marker id="tf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="hsl(var(--primary))" />
          </marker>
        </defs>
        {showAfter && (
          <circle r="3" fill="hsl(var(--primary))" opacity="0.6">
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 140 55 L 175 55" />
          </circle>
        )}
      </g>

      {/* After column */}
      <text x="250" y="16" textAnchor="middle" className="text-[9px] font-bold fill-primary/50 uppercase select-none">Après</text>
      {useCase.after.labels.map((label, i) => (
        <g key={`a-${i}`}>
          <rect x="195" y={28 + i * 30} width="110" height="24" rx="6"
            fill={showAfter ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted) / 0.2)"}
            stroke={showAfter ? "hsl(var(--primary) / 0.3)" : "hsl(var(--muted-foreground) / 0.06)"}
            strokeWidth={showAfter ? 1.5 : 1}
            className="transition-all duration-700"
            filter={showAfter ? `url(#tf-glow-${index})` : undefined}
          />
          {showAfter && (
            <circle cx="207" cy={40 + i * 30} r="4" fill="hsl(var(--primary) / 0.25)">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          )}
          <text x={showAfter ? "255" : "250"} y={42 + i * 30} textAnchor="middle" dominantBaseline="middle"
            className={cn("text-[9px] font-medium select-none transition-all duration-500", showAfter ? "fill-primary" : "fill-muted-foreground/25")}
          >{label}</text>
        </g>
      ))}

      {/* Score gauge - after */}
      <rect x="210" y="125" width="80" height="8" rx="4" fill="hsl(var(--primary) / 0.1)" />
      <rect x="210" y="125" width={showAfter ? 80 * progress : 0} height="8" rx="4" fill="hsl(var(--primary) / 0.6)" className="transition-all duration-300" />
      <text x="295" y="131" className={cn("text-[8px] font-bold select-none transition-all duration-500", showAfter ? "fill-primary" : "fill-muted-foreground/20")}>
        {afterScore}%
      </text>

      {/* Metric badge */}
      {showAfter && (
        <g className="animate-fade-in">
          <rect x="120" y="145" width="80" height="24" rx="12" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1" />
          <text x="160" y="158" textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-bold fill-primary select-none">{useCase.metric}</text>
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
                "group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 sm:p-6 transition-all duration-600 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 200 + 200}ms` }}
            >
              <h3 className="text-base font-semibold text-foreground mb-4">{uc.title}</h3>
              <TransformationDiagram useCase={uc} isVisible={isVisible} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
