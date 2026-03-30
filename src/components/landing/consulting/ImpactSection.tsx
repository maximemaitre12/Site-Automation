import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const metrics = [
  {
    value: 40, suffix: "%", label: "Réduction des délais",
    trend: [20, 35, 28, 45, 38, 60, 55, 78, 72, 90],
  },
  {
    value: 60, suffix: "%", label: "Gain de productivité",
    trend: [15, 25, 30, 40, 42, 55, 60, 68, 75, 85],
  },
  {
    value: 3, suffix: "×", label: "Vitesse d'analyse",
    trend: [10, 18, 22, 35, 45, 52, 65, 72, 80, 92],
  },
  {
    value: 25, suffix: "%", label: "Économies identifiées",
    trend: [12, 20, 18, 30, 35, 42, 50, 58, 65, 80],
  },
];

function MiniChart({ trend, isVisible }: { trend: number[]; isVisible: boolean }) {
  const w = 120, h = 40;
  const points = trend.map((v, i) => ({
    x: (i / (trend.length - 1)) * w,
    y: h - (v / 100) * h,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const totalLength = 300;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={`${pathD} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#chart-grad)"
        className={cn("transition-opacity duration-1000", isVisible ? "opacity-100" : "opacity-0")}
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="hsl(239 84% 67%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={totalLength}
        strokeDashoffset={isVisible ? 0 : totalLength}
        className="transition-all duration-[2000ms] ease-out"
      />
    </svg>
  );
}

function MetricCard({ metric, isVisible, delay }: {
  metric: typeof metrics[0]; isVisible: boolean; delay: number;
}) {
  const { formattedCount } = useCountUp({
    end: metric.value, duration: 1800, suffix: metric.suffix, enabled: isVisible,
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
            +{formattedCount}
          </div>
          <div className="text-xs sm:text-sm text-white/40 mt-1">{metric.label}</div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-400">↑</span>
        </div>
      </div>
      <MiniChart trend={metric.trend} isVisible={isVisible} />
    </div>
  );
}

export function ImpactSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-[#0a0e1f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(0_0%_100%/0.02)_1px,transparent_1px)] bg-[length:32px_32px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Performance</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Des gains mesurables sur vos opérations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {metrics.map((m, i) => (
            <MetricCard key={i} metric={m} isVisible={isVisible} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
