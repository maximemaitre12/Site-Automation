import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, TrendingDown, TrendingUp, Activity } from "lucide-react";

const useCases = [
  {
    sector: "Supply Chain", icon: "📦", color: "blue",
    sparkline: [30, 55, 45, 70, 42],
    kpis: [
      { label: "Délai moyen", before: "72h", after: "43h", delta: -40, unit: "h" },
      { label: "Taux erreur", before: "12%", after: "3%", delta: -75, unit: "%" },
      { label: "Processus", before: "Manuel", after: "Auto", delta: 100, unit: "" },
    ],
    metric: "−40%", metricLabel: "délais opérationnels", status: "LIVE",
  },
  {
    sector: "Recrutement", icon: "👥", color: "purple",
    sparkline: [60, 50, 35, 20, 15],
    kpis: [
      { label: "Time-to-hire", before: "45j", after: "15j", delta: -67, unit: "j" },
      { label: "Recall", before: "8/100", after: "42/100", delta: 425, unit: "" },
      { label: "Scoring", before: "Subjectif", after: "IA", delta: 100, unit: "" },
    ],
    metric: "÷3", metricLabel: "temps d'analyse", status: "LIVE",
  },
  {
    sector: "Finance", icon: "📈", color: "emerald",
    sparkline: [20, 25, 18, 30, 85],
    kpis: [
      { label: "Variance", before: "±22%", after: "±4%", delta: -82, unit: "%" },
      { label: "Reporting", before: "5j", after: "Temps réel", delta: -100, unit: "" },
      { label: "Outil", before: "Tableur", after: "Dashboard", delta: 100, unit: "" },
    ],
    metric: "+85%", metricLabel: "précision prédictive", status: "DONE",
  },
];

/* ── Sparkline SVG ── */
function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const pts = points.map((v, i) => `${i * 12},${24 - (v / max) * 20}`).join(" ");
  const strokeColor = color === "blue" ? "#60a5fa" : color === "purple" ? "#a78bfa" : "#34d399";
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" className="shrink-0">
      <polyline fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={48} cy={24 - (points[4] / max) * 20} r="2" fill={strokeColor} className="animate-pulse" />
    </svg>
  );
}

/* ── Sidebar Item ── */
function DatasetRow({ uc, active, onClick, visible, idx }: {
  uc: typeof useCases[0]; active: boolean; onClick: () => void; visible: boolean; idx: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-3 text-left transition-all duration-300 border-b border-slate-700/40",
        active ? "bg-slate-700/50 border-l-2 border-l-emerald-400" : "hover:bg-slate-800/80",
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${idx * 120 + 200}ms` }}
    >
      <span className="text-base">{uc.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-200 truncate">{uc.sector}</span>
          <span className={cn(
            "text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full",
            uc.status === "LIVE"
              ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
              : "bg-blue-500/20 text-blue-400"
          )}>{uc.status}</span>
        </div>
        <Sparkline points={uc.sparkline} color={uc.color} />
      </div>
      <span className={cn(
        "font-mono text-xs font-bold shrink-0",
        uc.metric.startsWith("+") || uc.metric.startsWith("÷") ? "text-emerald-400" : "text-emerald-400"
      )}>{uc.metric}</span>
    </button>
  );
}

/* ── Progress Bar ── */
function AnimatedBar({ percent, visible }: { percent: number; visible: boolean }) {
  const abs = Math.min(Math.abs(percent), 100);
  return (
    <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-[1.5s] ease-out"
        style={{
          width: visible ? `${abs}%` : "0%",
          background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #10b981 100%)",
        }}
      />
    </div>
  );
}

/* ── Mini Bar Chart SVG ── */
function MiniChart({ kpis, visible }: { kpis: typeof useCases[0]["kpis"]; visible: boolean }) {
  const barW = 18;
  const gap = 8;
  const groupW = barW * 2 + gap;
  const totalW = kpis.length * groupW + (kpis.length - 1) * 24;
  const chartH = 80;

  return (
    <svg width="100%" height={chartH + 24} viewBox={`0 0 ${totalW + 20} ${chartH + 24}`} className="mx-auto">
      {/* Gridlines */}
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1="0" x2={totalW + 20} y1={chartH - (v / 100) * chartH} y2={chartH - (v / 100) * chartH}
            stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={totalW + 14} y={chartH - (v / 100) * chartH + 3} fontSize="7" fill="#64748b" textAnchor="end">{v}</text>
        </g>
      ))}
      {kpis.map((kpi, i) => {
        const x = i * (groupW + 24) + 10;
        const beforeH = Math.abs(kpi.delta) > 50 ? 65 : 40;
        const afterH = Math.min(Math.abs(kpi.delta) + 20, 78);
        return (
          <g key={i}>
            {/* Before bar */}
            <rect x={x} y={chartH - beforeH} width={barW} height={beforeH} rx={3}
              fill="#ef444440" className="transition-all duration-700" />
            {/* After bar */}
            <rect x={x + barW + gap} y={visible ? chartH - afterH : chartH} width={barW}
              height={visible ? afterH : 0} rx={3}
              className="transition-all duration-[1.2s] ease-out"
              style={{ transitionDelay: `${i * 200 + 400}ms` }}
              fill="url(#greenGrad)" />
            {/* Label */}
            <text x={x + groupW / 2} y={chartH + 14} fontSize="8" fill="#94a3b8" textAnchor="middle">{kpi.label}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Mobile KPI Card ── */
function MobileKPICard({ kpi, visible, delay }: { kpi: typeof useCases[0]["kpis"][0]; visible: boolean; delay: number }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{kpi.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-red-400/70 line-through font-mono">{kpi.before}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-sm text-emerald-400 font-bold font-mono">{kpi.after}</span>
        </div>
      </div>
      <div className="w-20">
        <AnimatedBar percent={Math.abs(kpi.delta)} visible={visible} />
      </div>
      <span className={cn(
        "font-mono text-xs font-bold shrink-0",
        kpi.delta < 0 ? "text-emerald-400" : "text-emerald-400"
      )}>
        {kpi.delta > 0 ? "+" : ""}{kpi.delta}%
      </span>
    </div>
  );
}

/* ── Main Section ── */
export function UseCasesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const [activeCase, setActiveCase] = useState(0);
  const [tabIdx, setTabIdx] = useState(1);
  const tabs = ["Overview", "Compare", "Trends"];
  const uc = useCases[activeCase];

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.12)_1px,transparent_1px)] bg-[length:32px_32px]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Transformations</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Résultats concrets par secteur
          </h2>
        </div>

        {/* MacWindow dark */}
        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER ANALYTICS LAB v3.0"
            variant="dark"
            toolbar={
              <div className="flex items-center gap-1">
                {tabs.map((t, i) => (
                  <button key={t} onClick={() => setTabIdx(i)} className={cn(
                    "px-3 py-1 text-[11px] font-mono rounded transition-all",
                    i === tabIdx ? "bg-slate-600/60 text-slate-100" : "text-slate-500 hover:text-slate-300"
                  )}>{t}</button>
                ))}
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Last analysis: 2 min ago
                </span>
                <span>3 datasets loaded</span>
              </div>
            }
          >
            {/* ── Mobile: pills + cards ── */}
            <div className="md:hidden">
              {/* Pills */}
              <div className="flex gap-2 p-3 overflow-x-auto border-b border-slate-700/40 no-scrollbar">
                {useCases.map((u, i) => (
                  <button key={i} onClick={() => setActiveCase(i)} className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-all",
                    activeCase === i
                      ? "bg-slate-700 text-slate-100 ring-1 ring-emerald-500/40"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-700/60"
                  )}>
                    <span>{u.icon}</span>
                    {u.sector}
                  </button>
                ))}
              </div>

              {/* Hero metric */}
              <div className="text-center py-5">
                <span className="font-mono text-4xl font-black text-emerald-400" style={{
                  textShadow: "0 0 24px rgba(16,185,129,0.35)"
                }}>{uc.metric}</span>
                <p className="text-[11px] text-slate-500 font-mono mt-1">{uc.metricLabel}</p>
              </div>

              {/* KPI cards */}
              <div className="flex flex-col gap-2 px-3 pb-4">
                {uc.kpis.map((kpi, i) => (
                  <MobileKPICard key={`${activeCase}-${i}`} kpi={kpi} visible={isVisible} delay={i * 150 + 300} />
                ))}
              </div>
            </div>

            {/* ── Desktop: sidebar + analytics ── */}
            <div className="hidden md:flex min-h-[360px]">
              {/* Sidebar */}
              <div className="w-40 lg:w-52 border-r border-slate-700/40 bg-slate-900/80 shrink-0">
                {useCases.map((u, i) => (
                  <DatasetRow key={i} uc={u} active={activeCase === i} onClick={() => setActiveCase(i)}
                    visible={isVisible} idx={i} />
                ))}
                {/* Sidebar footer */}
                <div className="p-3 mt-auto">
                  <div className="text-[9px] uppercase tracking-wider text-slate-600 font-mono mb-1">Active datasets</div>
                  <div className="flex gap-1">
                    {useCases.map((_, i) => (
                      <div key={i} className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        activeCase === i ? "bg-emerald-400" : "bg-slate-700"
                      )} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Main analytics pane */}
              <div className="flex-1 flex flex-col p-4 lg:p-5 bg-slate-900/40">
                {/* Dataset header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{uc.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 font-mono">{uc.sector}</h3>
                      <p className="text-[10px] text-slate-500 font-mono">{uc.metricLabel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-3xl lg:text-4xl font-black text-emerald-400 block" style={{
                      textShadow: "0 0 24px rgba(16,185,129,0.35)"
                    }}>{uc.metric}</span>
                  </div>
                </div>

                {/* Data table */}
                <div className="rounded-lg border border-slate-700/50 overflow-hidden mb-4">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_80px_80px_1fr] gap-0 bg-slate-800/80 text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                    <div className="px-3 py-2">KPI</div>
                    <div className="px-3 py-2 text-center">Avant</div>
                    <div className="px-3 py-2 text-center">Après</div>
                    <div className="px-3 py-2">Delta</div>
                  </div>
                  {/* Rows */}
                  {uc.kpis.map((kpi, i) => (
                    <div key={`${activeCase}-${i}`} className={cn(
                      "grid grid-cols-[1fr_80px_80px_1fr] gap-0 border-t border-slate-700/30 items-center transition-all duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )} style={{ transitionDelay: `${i * 150 + 400}ms` }}>
                      <div className="px-3 py-2.5 text-[11px] text-slate-300 font-mono">{kpi.label}</div>
                      <div className="px-3 py-2.5 text-center text-[11px] text-red-400/70 line-through font-mono">{kpi.before}</div>
                      <div className="px-3 py-2.5 text-center text-[11px] text-emerald-400 font-bold font-mono">{kpi.after}</div>
                      <div className="px-3 py-2.5 flex items-center gap-2">
                        <div className="flex-1">
                          <AnimatedBar percent={Math.abs(kpi.delta)} visible={isVisible} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 w-10 text-right">
                          {kpi.delta > 0 ? "+" : ""}{kpi.delta}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini chart */}
                <div className="flex-1 flex items-end">
                  <MiniChart kpis={uc.kpis} visible={isVisible} />
                </div>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
