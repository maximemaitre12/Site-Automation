import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Target, Wrench, Zap, HeartHandshake } from "lucide-react";

const axes = [
  { label: "Résultats", value: 0.9, icon: Target },
  { label: "Opérationnel", value: 0.85, icon: Wrench },
  { label: "Impact", value: 0.95, icon: Zap },
  { label: "Accompagnement", value: 0.8, icon: HeartHandshake },
];

const points = [
  { title: "Résultats business", desc: "Approche orientée ROI mesurable", icon: Target },
  { title: "Expertise opérationnelle", desc: "Compréhension des enjeux terrain", icon: Wrench },
  { title: "Interventions ciblées", desc: "Fort impact, effort minimal", icon: Zap },
  { title: "Accompagnement complet", desc: "De l'analyse à la mise en œuvre", icon: HeartHandshake },
];

function RadarChart({ isVisible }: { isVisible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let start: number | null = null;
    const duration = 1500;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 500);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [isVisible]);

  const cx = 180, cy = 180, maxR = 130;
  const angleStep = (2 * Math.PI) / axes.length;

  const getPoint = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return { x: cx + Math.cos(angle) * maxR * ratio, y: cy + Math.sin(angle) * maxR * ratio };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = axes.map((axis, i) => getPoint(i, axis.value * progress));

  return (
    <svg viewBox="0 0 360 360" className="w-full max-w-[320px] sm:max-w-[360px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="radar-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Grid */}
      {gridLevels.map((level, i) => (
        <polygon
          key={i}
          points={axes.map((_, j) => { const p = getPoint(j, level); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.1" />;
      })}

      {/* Data area */}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="url(#radar-fill)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        filter="url(#radar-glow)"
        className="transition-all duration-300"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="hsl(var(--primary))" className="transition-all duration-300" />
          <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0">
            <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
        </g>
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const p = getPoint(i, 1.25);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] sm:text-[11px] fill-foreground font-semibold select-none"
          >
            {axis.label}
          </text>
        );
      })}

      {/* Value labels */}
      {axes.map((axis, i) => {
        const p = getPoint(i, axis.value * progress + 0.12);
        const val = Math.round(axis.value * 100 * progress);
        return (
          <text key={`v-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[9px] fill-primary font-bold select-none"
          >
            {val > 0 ? `${val}%` : ""}
          </text>
        );
      })}
    </svg>
  );
}

export function DifferentiationSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.04),transparent_60%)]" />
      
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-12 sm:mb-16 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Pourquoi <span className="text-primary">nous</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Radar */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-85"
          )}>
            <RadarChart isVisible={isVisible} />
          </div>

          {/* Points */}
          <div className="space-y-4">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/40 transition-all duration-500 hover:border-primary/30 hover:bg-card/60",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                  )}
                  style={{ transitionDelay: `${i * 150 + 400}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{point.title}</p>
                    <p className="text-xs text-muted-foreground">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
