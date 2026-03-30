import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const axes = [
  { label: "Résultats", value: 0.9 },
  { label: "Opérationnel", value: 0.85 },
  { label: "Impact", value: 0.95 },
  { label: "Accompagnement", value: 0.8 },
];

const points = [
  "Approche orientée résultats business",
  "Compréhension des enjeux opérationnels",
  "Interventions ciblées à fort impact",
  "Accompagnement de l'analyse à la mise en œuvre",
];

function RadarChart({ isVisible }: { isVisible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 400);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [isVisible]);

  const cx = 150, cy = 150, maxR = 100;
  const angleStep = (2 * Math.PI) / axes.length;

  const getPoint = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: cx + Math.cos(angle) * maxR * ratio,
      y: cy + Math.sin(angle) * maxR * ratio,
    };
  };

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1];

  // Data polygon
  const dataPoints = axes.map((axis, i) => getPoint(i, axis.value * progress));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[240px] sm:max-w-[280px] mx-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {gridLevels.map((level, i) => (
        <polygon
          key={i}
          points={axes.map((_, j) => {
            const p = getPoint(j, level);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = getPoint(i, 1);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--muted-foreground) / 0.1)" strokeWidth="0.5" />
        );
      })}

      {/* Data area */}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="hsl(var(--primary) / 0.1)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        className="transition-all duration-300"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))" className="transition-all duration-300" />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const p = getPoint(i, 1.2);
        return (
          <text
            key={i}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] sm:text-[9px] fill-muted-foreground font-medium"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

export function DifferentiationSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Pourquoi nous
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Radar */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <RadarChart isVisible={isVisible} />
          </div>

          {/* Points */}
          <div className="space-y-4">
            {points.map((point, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 transition-all duration-500",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                )}
                style={{ transitionDelay: `${i * 120 + 300}ms` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm sm:text-base text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
