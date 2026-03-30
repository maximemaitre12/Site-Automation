import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import { useState, useEffect } from "react";
import { ChevronRight, Folder, FileText } from "lucide-react";

const useCases = [
  {
    sector: "Supply Chain", icon: "📦",
    before: { stats: ["72h", "12%", "Manuel"], labels: ["Délai moyen", "Taux erreur", "Processus"] },
    after: { stats: ["43h", "3%", "Automatisé"], labels: ["Délai moyen", "Taux erreur", "Processus"] },
    metric: "−40%", metricLabel: "délais opérationnels",
    tags: ["logistics", "optimization"],
  },
  {
    sector: "Recrutement", icon: "👥",
    before: { stats: ["45j", "8/100", "Subjectif"], labels: ["Time-to-hire", "Recall", "Scoring"] },
    after: { stats: ["15j", "42/100", "IA-assisted"], labels: ["Time-to-hire", "Recall", "Scoring"] },
    metric: "÷3", metricLabel: "temps d'analyse",
    tags: ["hr", "ai-scoring"],
  },
  {
    sector: "Finance", icon: "📈",
    before: { stats: ["±22%", "5j", "Tableur"], labels: ["Variance", "Reporting", "Outil"] },
    after: { stats: ["±4%", "Temps réel", "Dashboard"], labels: ["Variance", "Reporting", "Outil"] },
    metric: "+85%", metricLabel: "précision prédictive",
    tags: ["finops", "predictive"],
  },
];

function FinderRow({ useCase, isActive, onClick, isVisible, delay }: {
  useCase: typeof useCases[0]; isActive: boolean; onClick: () => void;
  isVisible: boolean; delay: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-300 border-b border-slate-100",
        isActive ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-slate-50",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Folder className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-amber-400")} />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-slate-800">{useCase.sector}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {useCase.tags.map(tag => (
          <span key={tag} className={cn(
            "w-2.5 h-2.5 rounded-full",
            tag.includes("optimization") || tag.includes("finops") ? "bg-blue-400" :
            tag.includes("ai") || tag.includes("predictive") ? "bg-purple-400" :
            "bg-emerald-400"
          )} />
        ))}
      </div>
      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
    </button>
  );
}

function ComparePreview({ useCase, isVisible }: { useCase: typeof useCases[0]; isVisible: boolean }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, [isVisible]);

  return (
    <div className="flex-1 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{useCase.icon}</span>
        <span className="font-mono text-xs font-bold text-slate-700">{useCase.sector}</span>
        <span className="ml-auto font-mono text-lg font-bold text-primary">{useCase.metric}</span>
      </div>

      {/* Before / After columns */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "rounded-lg p-3 transition-all duration-500",
          revealed ? "bg-slate-100 border border-slate-200" : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-red-400">Avant</span>
          </div>
          {useCase.before.stats.map((stat, j) => (
            <div key={j} className="flex justify-between py-0.5">
              <span className="text-[10px] text-slate-400">{useCase.before.labels[j]}</span>
              <span className={cn(
                "font-mono text-[11px] font-medium transition-colors duration-500",
                revealed ? "text-slate-300 line-through" : "text-red-500"
              )}>{stat}</span>
            </div>
          ))}
        </div>

        <div className={cn(
          "rounded-lg p-3 transition-all duration-500",
          revealed ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100"
        )}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500">Après</span>
          </div>
          {useCase.after.stats.map((stat, j) => (
            <div key={j} className="flex justify-between py-0.5">
              <span className="text-[10px] text-slate-400">{useCase.after.labels[j]}</span>
              <span className={cn(
                "font-mono text-[11px] font-semibold transition-colors duration-500",
                revealed ? "text-emerald-600" : "text-slate-300"
              )}>{stat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-[10px] text-slate-400 font-mono text-center">
        {useCase.metricLabel}
      </div>
    </div>
  );
}

export function UseCasesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />

      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Transformations</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Résultats concrets par secteur
          </h2>
        </div>

        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER CASE LAB v2.0"
            toolbar={
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <span className="text-slate-300">Aether</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-300">Cases</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 font-medium">{useCases[activeCase].sector}</span>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">3 éléments</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="font-mono text-[10px] text-slate-400">Avant</span></span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="font-mono text-[10px] text-slate-400">Après</span></span>
                </div>
              </div>
            }
          >
            <div className="flex min-h-[280px] sm:min-h-[320px]">
              {/* File list sidebar */}
              <div className="w-36 sm:w-44 border-r border-slate-100 bg-slate-50/50">
                {useCases.map((uc, i) => (
                  <FinderRow
                    key={i}
                    useCase={uc}
                    isActive={activeCase === i}
                    onClick={() => setActiveCase(i)}
                    isVisible={isVisible}
                    delay={i * 100 + 200}
                  />
                ))}
              </div>

              {/* Preview pane */}
              <ComparePreview
                key={activeCase}
                useCase={useCases[activeCase]}
                isVisible={isVisible}
              />
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
