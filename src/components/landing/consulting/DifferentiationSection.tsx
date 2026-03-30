import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import {
  Brain, Workflow, MessageSquareText, Eye, Settings,
  FileBarChart, Activity, Cpu, ChevronRight
} from "lucide-react";
import { useState } from "react";

const capabilities = [
  {
    icon: Brain,
    label: "Analyse prédictive",
    tag: "PRED-01",
    desc: "Anticipez les risques et opportunités avant vos concurrents grâce à nos modèles prédictifs entraînés sur vos données métier.",
    pct: 94,
    gradient: "from-[hsl(220,80%,55%)] to-primary",
    glowColor: "hsl(239,84%,67%)",
    metrics: [
      { label: "Précision", value: "94.2%" },
      { label: "Latence", value: "< 80ms" },
      { label: "Modèles", value: "12" },
    ],
  },
  {
    icon: Workflow,
    label: "Automatisation",
    tag: "AUTO-02",
    desc: "Réduisez les tâches manuelles répétitives. Orchestration intelligente multi-étapes avec validation humaine intégrée.",
    pct: 88,
    gradient: "from-[hsl(200,80%,55%)] to-[hsl(210,85%,50%)]",
    glowColor: "hsl(200,80%,55%)",
    metrics: [
      { label: "Workflows", value: "340+" },
      { label: "Temps gagné", value: "62%" },
      { label: "Fiabilité", value: "99.8%" },
    ],
  },
  {
    icon: MessageSquareText,
    label: "NLP avancé",
    tag: "NLP-03",
    desc: "Compréhension contextuelle du langage métier. Extraction d'intentions, sentiment analysis et résumé automatique.",
    pct: 91,
    gradient: "from-[hsl(270,65%,55%)] to-[hsl(290,60%,50%)]",
    glowColor: "hsl(280,62%,52%)",
    metrics: [
      { label: "Langues", value: "14" },
      { label: "F1 Score", value: "0.96" },
      { label: "Contexte", value: "128K" },
    ],
  },
  {
    icon: Eye,
    label: "Vision documentaire",
    tag: "VIS-04",
    desc: "Extraction intelligente de données depuis vos documents : factures, contrats, rapports. OCR + compréhension sémantique.",
    pct: 86,
    gradient: "from-[hsl(30,80%,50%)] to-[hsl(15,75%,50%)]",
    glowColor: "hsl(22,77%,50%)",
    metrics: [
      { label: "Formats", value: "50+" },
      { label: "Extraction", value: "97%" },
      { label: "Temps/doc", value: "1.2s" },
    ],
  },
  {
    icon: Settings,
    label: "Optimisation",
    tag: "OPT-05",
    desc: "Amélioration continue et auto-apprentissage. Feedback loops automatiques et ré-entraînement des modèles en production.",
    pct: 92,
    gradient: "from-[hsl(340,70%,50%)] to-[hsl(320,65%,50%)]",
    glowColor: "hsl(330,67%,50%)",
    metrics: [
      { label: "Itérations", value: "∞" },
      { label: "Gain/cycle", value: "+3.2%" },
      { label: "Uptime", value: "99.99%" },
    ],
  },
  {
    icon: FileBarChart,
    label: "Reporting IA",
    tag: "RPT-06",
    desc: "Tableaux de bord auto-générés et personnalisés. Insights narratifs et alertes proactives sur vos KPIs critiques.",
    pct: 85,
    gradient: "from-[hsl(195,75%,45%)] to-[hsl(210,70%,50%)]",
    glowColor: "hsl(202,72%,47%)",
    metrics: [
      { label: "Dashboards", value: "∞" },
      { label: "Refresh", value: "Real-time" },
      { label: "Exports", value: "PDF/CSV" },
    ],
  },
];

/* ── Animated Gauge Ring (SVG) ── */
function GaugeRing({ value, size = 44, stroke = 3.5, color, isVisible, delay }: {
  value: number; size?: number; stroke?: number; color: string; isVisible: boolean; delay: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = isVisible ? circ - (value / 100) * circ : circ;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(220,15%,18%)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all ease-out"
        style={{ transitionDuration: '1.4s', transitionDelay: `${delay}ms` }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        className="fill-slate-300 font-mono font-bold"
        style={{ fontSize: '9px' }}
        transform={`rotate(90 ${size / 2} ${size / 2})`}>
        {value}%
      </text>
    </svg>
  );
}

/* ── Sparkline SVG ── */
function Sparkline({ color, delay, isVisible }: { color: string; delay: number; isVisible: boolean }) {
  const points = [8, 14, 10, 18, 12, 20, 16, 22, 18, 24];
  const polyline = points.map((y, i) => `${i * 8},${28 - y}`).join(' ');
  return (
    <svg width="72" height="28" className="shrink-0">
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all ease-out"
        style={{
          strokeDasharray: isVisible ? '0' : '200',
          strokeDashoffset: isVisible ? '0' : '200',
          transitionDuration: '1.5s',
          transitionDelay: `${delay}ms`,
        }}
      />
    </svg>
  );
}

/* ── Desktop capability row ── */
function CapabilityRow({ cap, index, isActive, onClick, isVisible }: {
  cap: typeof capabilities[0]; index: number; isActive: boolean;
  onClick: () => void; isVisible: boolean;
}) {
  const Icon = cap.icon;
  const delay = index * 80 + 200;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full text-left px-4 py-3 border-b border-slate-700/20 transition-all duration-300 group",
        isActive ? "bg-primary/5" : "hover:bg-white/[0.02]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 ring-1 ring-white/10 transition-shadow",
        cap.gradient
      )}
        style={{ boxShadow: isActive ? `0 0 14px ${cap.glowColor}30` : undefined }}
      >
        <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
      </div>

      {/* Label + tag */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-300 truncate">{cap.label}</span>
          <span className="text-[8px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{cap.tag}</span>
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline color={cap.glowColor} delay={delay + 300} isVisible={isVisible} />

      {/* Gauge */}
      <GaugeRing value={cap.pct} color={cap.glowColor} isVisible={isVisible} delay={delay + 200} />

      <ChevronRight className={cn(
        "w-3.5 h-3.5 shrink-0 transition-colors",
        isActive ? "text-primary" : "text-slate-700"
      )} />
    </button>
  );
}

/* ── Detail pane ── */
function DetailPane({ cap, isVisible }: { cap: typeof capabilities[0]; isVisible: boolean }) {
  const Icon = cap.icon;
  return (
    <div className={cn("p-5 lg:p-6 transition-all duration-400", isVisible ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={cn(
          "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl ring-1 ring-white/10 shrink-0",
          cap.gradient
        )} style={{ boxShadow: `0 0 24px ${cap.glowColor}20` }}>
          <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base lg:text-lg font-bold text-white">{cap.label}</h3>
            <span className="text-[9px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/30">{cap.tag}</span>
          </div>
          <p className="text-[11px] lg:text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md">{cap.desc}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {cap.metrics.map((m) => (
          <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center hover:border-primary/15 transition-colors">
            <div className="text-sm lg:text-base font-bold font-mono text-white">{m.value}</div>
            <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Performance bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performance globale</span>
          <span className="text-xs font-mono font-bold text-white">{cap.pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all ease-out", cap.gradient)}
            style={{ width: isVisible ? `${cap.pct}%` : '0%', transitionDuration: '1.4s', transitionDelay: '300ms' }}
          />
        </div>
      </div>

      {/* System status mini-grid */}
      <div className="flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Opérationnel
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500 font-mono">Dernière maj : 2 min</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500 font-mono">v3.2.1</span>
      </div>
    </div>
  );
}

/* ── Mobile card ── */
function MobileCard({ cap, index, isVisible }: {
  cap: typeof capabilities[0]; index: number; isVisible: boolean;
}) {
  const Icon = cap.icon;
  const delay = index * 100 + 200;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-500",
        expanded ? "border-primary/15" : "",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 w-full text-left p-3">
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 ring-1 ring-white/10",
          cap.gradient
        )} style={{ boxShadow: `0 0 12px ${cap.glowColor}20` }}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">{cap.label}</span>
            <span className="text-[8px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{cap.tag}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all ease-out", cap.gradient)}
                style={{ width: isVisible ? `${cap.pct}%` : '0%', transitionDuration: '1.2s', transitionDelay: `${delay + 200}ms` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 shrink-0">{cap.pct}%</span>
          </div>
        </div>

        <ChevronRight className={cn(
          "w-4 h-4 text-slate-600 shrink-0 transition-transform duration-300",
          expanded ? "rotate-90" : ""
        )} />
      </button>

      {/* Expanded content */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        expanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-3 pb-3 pt-1 border-t border-white/5">
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{cap.desc}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {cap.metrics.map((m) => (
              <div key={m.label} className="rounded-lg bg-slate-800/50 p-2 text-center">
                <div className="text-[11px] font-bold font-mono text-white">{m.value}</div>
                <div className="text-[8px] text-slate-600 uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DifferentiationSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = capabilities[activeIndex];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220,20%,18%/0.4)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Capacités</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Technologies IA de pointe
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Six modules d'intelligence artificielle, entraînés et optimisés pour vos opérations.
          </p>
        </div>

        <div className={cn(
          "transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
        )}>
          <MacWindow
            variant="dark"
            title="AETHER CAPABILITIES v3.0 — System Monitor"
            toolbar={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {["Modules", "Performance", "Logs"].map((t, i) => (
                    <span key={t} className={cn(
                      "text-[11px] transition-colors cursor-default",
                      i === 0
                        ? "font-semibold text-primary border-b-2 border-primary pb-0.5"
                        : "text-slate-500 hover:text-slate-300"
                    )}>{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    6/6 active
                  </span>
                </div>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">6 modules · avg {Math.round(capabilities.reduce((a, c) => a + c.pct, 0) / capabilities.length)}% perf</span>
                <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Tous systèmes opérationnels
                </span>
              </div>
            }
          >
            {/* ── MOBILE ── */}
            <div className="sm:hidden p-3 space-y-2">
              {capabilities.map((cap, i) => (
                <MobileCard key={cap.tag} cap={cap} index={i} isVisible={isVisible} />
              ))}
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden sm:grid sm:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
              {/* Left list */}
              <div className="border-r border-slate-700/30 bg-slate-900/40">
                <div className="px-4 py-2.5 border-b border-slate-700/20">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-800/60">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] text-slate-500">Filtrer les modules…</span>
                  </div>
                </div>
                {capabilities.map((cap, i) => (
                  <CapabilityRow
                    key={cap.tag}
                    cap={cap}
                    index={i}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                    isVisible={isVisible}
                  />
                ))}
              </div>

              {/* Right detail */}
              <DetailPane cap={active} isVisible={isVisible} />
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
