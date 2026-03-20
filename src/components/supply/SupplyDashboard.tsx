import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";

const nodes = [
  { id: "shz", label: "Shenzhen", x: 78, y: 38, status: "warning" },
  { id: "fra", label: "Frankfurt", x: 52, y: 28, status: "ok" },
  { id: "chi", label: "Chicago", x: 22, y: 30, status: "ok" },
  { id: "sao", label: "São Paulo", x: 32, y: 62, status: "ok" },
  { id: "dub", label: "Dubai", x: 60, y: 42, status: "ok" },
  { id: "syd", label: "Sydney", x: 85, y: 65, status: "ok" },
];

const edges = [
  ["shz", "fra"], ["shz", "dub"], ["fra", "chi"], ["dub", "sao"], ["chi", "sao"], ["shz", "syd"],
];

function getNode(id: string) {
  return nodes.find(n => n.id === id)!;
}

export function SupplyDashboard() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Your command center
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          One screen. Full visibility.
        </h2>

        {/* Dashboard shell */}
        <div className={`relative bg-[hsl(230_25%_9%)] rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/20 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-medium text-white/50 tracking-wide uppercase">Control Tower — Live</span>
            </div>
            <span className="text-[11px] text-white/30 font-mono tabular-nums">Last sync: 12s ago</span>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* KPIs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "OTIF", value: 94.2, suffix: "%", decimals: 1, trend: "+2.3" },
                { label: "Lead Time", value: 12.3, suffix: " days", decimals: 1, trend: "-18%" },
                { label: "Stock Coverage", value: 32, suffix: " days", decimals: 0, trend: "optimal" },
                { label: "Risk Score", value: 2, suffix: "/10", decimals: 0, trend: "low" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.04]">
                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1 tabular-nums">
                    {isVisible ? (
                      <AnimatedCounter end={kpi.value} suffix={kpi.suffix} decimals={kpi.decimals} duration={1800} />
                    ) : (
                      `0${kpi.suffix}`
                    )}
                  </p>
                  <p className="text-[10px] text-emerald-400/70 mt-1">{kpi.trend}</p>
                </div>
              ))}
            </div>

            {/* Map + Alerts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Map */}
              <div className="lg:col-span-3 bg-white/[0.02] rounded-xl border border-white/[0.04] p-4 relative min-h-[220px]">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-3">Global Flows</p>
                <svg viewBox="0 0 100 80" className="w-full h-auto" fill="none">
                  {edges.map(([from, to]) => {
                    const a = getNode(from);
                    const b = getNode(to);
                    const isWarning = a.status === "warning" || b.status === "warning";
                    return (
                      <line
                        key={`${from}-${to}`}
                        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke={isWarning ? "hsl(38 92% 50% / 0.3)" : "hsl(0 0% 100% / 0.08)"}
                        strokeWidth="0.3"
                        strokeDasharray={isWarning ? "1.5 1" : "none"}
                      />
                    );
                  })}
                  {nodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={node.x} cy={node.y} r="1.8"
                        fill={node.status === "warning" ? "hsl(38 92% 50%)" : "hsl(0 0% 100% / 0.5)"}
                        className={node.status === "warning" ? "animate-pulse" : ""}
                      />
                      <text
                        x={node.x} y={node.y + 5}
                        textAnchor="middle"
                        fill="hsl(0 0% 100% / 0.3)"
                        fontSize="2.5"
                        fontFamily="Inter, system-ui"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Alerts */}
              <div className="lg:col-span-2 space-y-3">
                <div className="bg-warning/[0.08] rounded-xl border border-warning/20 p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white/90">Supplier Delay Risk</p>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                        Shenzhen Electronics — 72h delay risk detected
                      </p>
                      <p className="text-[10px] text-warning/70 mt-2 font-mono">Confidence: 91%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/[0.06] rounded-xl border border-primary/15 p-4">
                  <div className="flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white/90">Demand Prediction</p>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                        Q3 demand spike +18% on SKU category A
                      </p>
                      <p className="text-[10px] text-primary/70 mt-2 font-mono">3 scenarios available</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/[0.06] rounded-xl border border-emerald-500/15 p-4">
                  <div className="flex items-start gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white/90">Route Optimized</p>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                        Frankfurt → Chicago consolidated — 12% cost saved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
