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
  { title: "Résultats business", desc: "Approche orientée ROI mesurable" },
  { title: "Expertise opérationnelle", desc: "Compréhension des enjeux terrain" },
  { title: "Interventions ciblées", desc: "Fort impact, effort minimal" },
  { title: "Accompagnement complet", desc: "De l'analyse à la mise en œuvre" },
];

function RadarChart({ isVisible }: { isVisible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [isVisible]);

  const cx = 160, cy = 160, maxR = 110;
  const angleStep = (2 * Math.PI) / axes.length;

  const getPoint = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return { x: cx + Math.cos(angle) * maxR * ratio, y: cy + Math.sin(angle) * maxR * ratio };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = axes.map((axis, i) => getPoint(i, axis.value * progress));

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[300px] mx-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {gridLevels.map((level, i) => (
        <polygon key={i}
          points={axes.map((_, j) => { const p = getPoint(j, level); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />;
      })}

      {/* Data fill */}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="hsl(var(--primary) / 0.06)"
        stroke="hsl(var(--primary) / 0.4)"
        strokeWidth="1.5"
      />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--primary) / 0.6)" />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const p = getPoint(i, 1.2);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[9px] fill-foreground/70 font-medium select-none"
          >{axis.label}</text>
        );
      })}

      {/* Values */}
      {axes.map((axis, i) => {
        const p = getPoint(i, axis.value * progress + 0.1);
        const val = Math.round(axis.value * 100 * progress);
        return val > 0 ? (
          <text key={`v-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[8px] fill-primary/60 font-semibold select-none"
          >{val}%</text>
        ) : null;
      })}
    </svg>
  );
}

export function DifferentiationSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Différenciation</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            Pourquoi nous
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className={cn("transition-all duration-700", isVisible ? "opacity-100" : "opacity-0")}>
            <RadarChart isVisible={isVisible} />
          </div>

          <div className="space-y-3">
            {points.map((point, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border border-border/40 transition-all duration-500 hover:border-primary/20",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                )}
                style={{ transitionDelay: `${i * 120 + 400}ms` }}
              >
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-semibold text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{point.title}</p>
                  <p className="text-xs text-muted-foreground">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
