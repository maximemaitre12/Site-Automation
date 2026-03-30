import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const problems = [
  { label: "Processus trop longs", severity: 85, color: "destructive" },
  { label: "Recrutement lent", severity: 70, color: "destructive" },
  { label: "Tâches répétitives", severity: 90, color: "destructive" },
  { label: "Flux opaques", severity: 65, color: "destructive" },
  { label: "Non structuré", severity: 75, color: "destructive" },
];

function BottleneckDiagram({ isVisible }: { isVisible: boolean }) {
  const [scanY, setScanY] = useState(-30);
  const [detectedCount, setDetectedCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    const animate = () => {
      setScanY(prev => {
        if (prev >= 320) return 320;
        return prev + 2;
      });
      frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(animate); }, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [isVisible]);

  useEffect(() => {
    problems.forEach((_, i) => {
      const nodeY = 30 + i * 60;
      if (scanY >= nodeY && detectedCount <= i) {
        setDetectedCount(i + 1);
      }
    });
  }, [scanY, detectedCount]);

  return (
    <svg viewBox="0 0 340 340" className="w-full max-w-[340px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="scan-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--destructive))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
        </linearGradient>
        <filter id="alert-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Flow pipe - main vertical */}
      <rect x="155" y="10" width="30" height="320" rx="15" fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--muted-foreground) / 0.08)" strokeWidth="1" />

      {/* Scan beam */}
      {isVisible && scanY < 320 && (
        <rect x="10" y={scanY - 25} width="320" height="50" fill="url(#scan-red)" />
      )}

      {/* Problem nodes */}
      {problems.map((p, i) => {
        const y = 30 + i * 60;
        const detected = i < detectedCount;
        const barWidth = (p.severity / 100) * 100;

        return (
          <g key={i}>
            {/* Bottleneck indicator on pipe */}
            <rect
              x="152" y={y - 3}
              width="36" height="26"
              rx="4"
              fill={detected ? "hsl(var(--destructive) / 0.15)" : "transparent"}
              stroke={detected ? "hsl(var(--destructive) / 0.5)" : "transparent"}
              strokeWidth="1.5"
              className="transition-all duration-500"
            />

            {/* X mark for blockage */}
            {detected && (
              <g filter="url(#alert-glow)">
                <text x="170" y={y + 11} textAnchor="middle" dominantBaseline="middle" className="text-[12px] select-none" fill="hsl(var(--destructive))">✕</text>
              </g>
            )}

            {/* Label + severity bar extending right */}
            <g className={cn("transition-all duration-600", detected ? "opacity-100" : "opacity-0")} style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Connector line */}
              <line x1="190" y1={y + 10} x2="210" y2={y + 10} stroke="hsl(var(--destructive) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />

              {/* Label */}
              <text x="215" y={y + 6} className="text-[10px] font-semibold fill-foreground select-none">{p.label}</text>

              {/* Severity bar */}
              <rect x="215" y={y + 13} width={detected ? barWidth : 0} height="5" rx="2.5" fill="hsl(var(--destructive) / 0.5)" className="transition-all duration-800" style={{ transitionDelay: `${i * 150 + 300}ms` }} />
              <rect x="215" y={y + 13} width="100" height="5" rx="2.5" fill="hsl(var(--destructive) / 0.08)" />

              {/* Severity % */}
              {detected && (
                <text x={218 + barWidth + 5} y={y + 18} className="text-[8px] font-bold fill-destructive select-none">{p.severity}%</text>
              )}
            </g>

            {/* Alert indicator left side */}
            {detected && (
              <g>
                <circle cx="130" cy={y + 10} r="10" fill="hsl(var(--destructive) / 0.1)" stroke="hsl(var(--destructive) / 0.4)" strokeWidth="1">
                  <animate attributeName="r" values="9;12;9" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </circle>
                <text x="130" y={y + 11} textAnchor="middle" dominantBaseline="middle" className="text-[8px] select-none" fill="hsl(var(--destructive))">⚠</text>
              </g>
            )}
          </g>
        );
      })}

      {/* Score badge */}
      {detectedCount >= problems.length && (
        <g className="animate-fade-in">
          <rect x="20" y="300" width="90" height="28" rx="14" fill="hsl(var(--destructive) / 0.1)" stroke="hsl(var(--destructive) / 0.3)" strokeWidth="1" />
          <text x="65" y="315" textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-bold fill-destructive select-none">
            {detectedCount} blocages
          </text>
        </g>
      )}
    </svg>
  );
}

export function ProblemsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--destructive)/0.03),transparent_60%)]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Des inefficacités invisibles qui{" "}
            <span className="text-destructive">ralentissent</span> votre activité
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Notre scan identifie les points de friction cachés dans vos flux opérationnels.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,1fr] gap-8 md:gap-12 items-center">
          {/* Diagram */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <BottleneckDiagram isVisible={isVisible} />
          </div>

          {/* Text */}
          <div className="space-y-4">
            {problems.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/40 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/8 flex items-center justify-center shrink-0">
                  <span className="text-destructive font-bold text-sm">{p.severity}%</span>
                </div>
                <p className="text-sm text-foreground font-medium">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
