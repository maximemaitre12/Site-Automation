import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import { useState } from "react";

const metrics = [
  {
    name: "Délais opérationnels", value: 40, suffix: "%", prefix: "+",
    color: "hsl(239 84% 67%)", barColor: "from-primary to-[hsl(260_70%_60%)]",
    trend: [20, 35, 28, 45, 38, 60, 55, 78, 72, 90],
    threads: 142, idle: "8.2%",
  },
  {
    name: "Productivité équipes", value: 60, suffix: "%", prefix: "+",
    color: "hsl(160 84% 39%)", barColor: "from-emerald-500 to-emerald-400",
    trend: [15, 25, 30, 40, 42, 55, 60, 68, 75, 85],
    threads: 89, idle: "3.1%",
  },
  {
    name: "Vitesse d'analyse", value: 3, suffix: "×", prefix: "",
    color: "hsl(38 92% 50%)", barColor: "from-amber-500 to-amber-400",
    trend: [10, 18, 22, 35, 45, 52, 65, 72, 80, 92],
    threads: 256, idle: "12.4%",
  },
  {
    name: "Économies identifiées", value: 25, suffix: "%", prefix: "+",
    color: "hsl(210 85% 50%)", barColor: "from-blue-500 to-cyan-400",
    trend: [12, 20, 18, 30, 35, 42, 50, 58, 65, 80],
    threads: 67, idle: "5.7%",
  },
];

const tabs = ["CPU", "Mémoire", "Réseau", "Énergie"];

function Sparkline({ trend, color, isVisible }: { trend: number[]; color: string; isVisible: boolean }) {
  const w = 80, h = 24;
  const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * w},${h - (v / 100) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-6" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isVisible ? "0" : "300"}
        strokeDashoffset={isVisible ? "0" : "300"}
        className="transition-all duration-[2000ms] ease-out"
      />
    </svg>
  );
}

function MetricRow({ metric, isVisible, delay }: {
  metric: typeof metrics[0]; isVisible: boolean; delay: number;
}) {
  const { formattedCount } = useCountUp({
    end: metric.value, duration: 1800, suffix: metric.suffix, enabled: isVisible,
  });

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_80px_60px_60px] sm:grid-cols-[1fr_100px_80px_80px] items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b border-slate-100 transition-all duration-500",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: metric.color }} />
        <span className="text-xs font-medium text-slate-700 truncate">{metric.name}</span>
      </div>
      <Sparkline trend={metric.trend} color={metric.color} isVisible={isVisible} />
      <span className="font-mono text-xs font-bold text-slate-900 text-right">
        {metric.prefix}{formattedCount}
      </span>
      <span className="font-mono text-[10px] text-slate-400 text-right">{metric.idle}</span>
    </div>
  );
}

function CPUHistoryChart({ isVisible }: { isVisible: boolean }) {
  const points1 = [0,12,8,25,18,35,28,42,38,52,48,62,55,70,65,78,72,85,80,90];
  const points2 = [5,8,15,10,22,18,28,22,32,28,38,35,42,38,48,42,52,48,58,55];
  const w = 400, h = 60;

  const toPath = (pts: number[]) =>
    pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / 100) * h}`).join(" ");

  return (
    <div className="px-3 sm:px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">CPU History</span>
        <span className="font-mono text-[10px] text-emerald-400">● Active</span>
      </div>
      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
          {[0, 25, 50, 75, 100].map(v => (
            <line key={v} x1="0" y1={h - (v / 100) * h} x2={w} y2={h - (v / 100) * h}
              stroke="hsl(220 14% 20%)" strokeWidth="0.5" />
          ))}
          <polyline points={toPath(points2)} fill="none" stroke="hsl(160 84% 39% / 0.3)"
            strokeWidth="1" className={cn("transition-all duration-[2500ms]", isVisible ? "opacity-100" : "opacity-0")} />
          <polyline points={toPath(points1)} fill="none" stroke="hsl(239 84% 67%)"
            strokeWidth="1.5" strokeLinecap="round"
            className={cn("transition-all duration-[2500ms]", isVisible ? "opacity-100" : "opacity-0")} />
        </svg>
      </div>
    </div>
  );
}

export function ImpactSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />

      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Performance</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Des gains mesurables sur vos opérations
          </h2>
        </div>

        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER PERFORMANCE MONITOR v3.1"
            toolbar={
              <div className="flex items-center gap-1">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all",
                      activeTab === i
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">Threads: 554</span>
                <span className="font-mono text-[10px] text-slate-400">Processus: 312</span>
                <span className="font-mono text-[10px] text-emerald-400">System: Optimal</span>
              </div>
            }
          >
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_80px_60px_60px] sm:grid-cols-[1fr_100px_80px_80px] gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-slate-50/80 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Processus</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tendance</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Gain</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Idle</span>
            </div>

            {metrics.map((m, i) => (
              <MetricRow key={i} metric={m} isVisible={isVisible} delay={i * 150 + 300} />
            ))}

            <CPUHistoryChart isVisible={isVisible} />
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
