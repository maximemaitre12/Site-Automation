import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import { Brain, Workflow, MessageSquareText, Eye, Settings, FileBarChart, Search } from "lucide-react";
import { useState } from "react";

const capabilities = [
  { icon: Brain, label: "Analyse prédictive", desc: "Anticipez les risques et opportunités avant vos concurrents", pct: 94, color: "from-blue-500 to-primary" },
  { icon: Workflow, label: "Automatisation", desc: "Réduisez les tâches manuelles répétitives de vos équipes", pct: 88, color: "from-emerald-400 to-teal-500" },
  { icon: MessageSquareText, label: "NLP avancé", desc: "Compréhension du langage métier en contexte", pct: 91, color: "from-purple-400 to-violet-500" },
  { icon: Eye, label: "Vision documentaire", desc: "Extraction intelligente de données depuis vos documents", pct: 86, color: "from-amber-400 to-orange-500" },
  { icon: Settings, label: "Optimisation", desc: "Amélioration continue et auto-apprentissage", pct: 92, color: "from-rose-400 to-pink-500" },
  { icon: FileBarChart, label: "Reporting IA", desc: "Tableaux de bord auto-générés et personnalisés", pct: 85, color: "from-cyan-400 to-blue-500" },
];

function CapabilityPanel({ cap, isVisible, delay }: {
  cap: typeof capabilities[0]; isVisible: boolean; delay: number;
}) {
  const Icon = cap.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl cursor-default transition-all duration-500",
        hovered ? "bg-slate-50 shadow-sm" : "bg-transparent",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon orb */}
      <div className={cn(
        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform duration-300",
        cap.color,
        hovered ? "scale-110" : ""
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Label */}
      <span className="text-[11px] font-semibold text-slate-700 text-center">{cap.label}</span>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-[1500ms] ease-out", cap.color)}
          style={{ width: isVisible ? `${cap.pct}%` : "0%", transitionDelay: `${delay + 300}ms` }}
        />
      </div>

      {/* Percentage */}
      <span className="font-mono text-[10px] text-slate-400">{cap.pct}%</span>

      {/* Expanded info on hover */}
      <div className={cn(
        "text-[10px] text-slate-500 text-center leading-relaxed transition-all duration-300 overflow-hidden",
        hovered ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0"
      )}>
        {cap.desc}
      </div>

      {/* Toggle */}
      <div className={cn(
        "w-8 h-[18px] rounded-full relative transition-colors duration-300",
        "bg-emerald-400"
      )}>
        <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
      </div>
    </div>
  );
}

export function DifferentiationSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(239_84%_67%/0.03),transparent_60%)]" />

      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Capacités</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Technologies IA de pointe
          </h2>
        </div>

        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER CAPABILITIES v1.5"
            toolbar={
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2 flex-1 bg-slate-100 rounded-lg px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400">Rechercher une capacité…</span>
                </div>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">6 modules actifs</span>
                <span className="font-mono text-[10px] text-emerald-500">● Tous les systèmes opérationnels</span>
              </div>
            }
          >
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {capabilities.map((cap, i) => (
                  <CapabilityPanel key={i} cap={cap} isVisible={isVisible} delay={i * 100 + 200} />
                ))}
              </div>
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
