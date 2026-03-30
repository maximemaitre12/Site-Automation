import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const useCases = [
  {
    sector: "Supply Chain", metric: "−40%", metricLabel: "délais opérationnels",
    before: { stats: ["72h", "12%", "Manuel"], labels: ["Délai moyen", "Erreur", "Processus"] },
    after: { stats: ["43h", "3%", "Automatisé"], labels: ["Délai moyen", "Erreur", "Processus"] },
  },
  {
    sector: "Recrutement", metric: "÷3", metricLabel: "temps d'analyse",
    before: { stats: ["45j", "8/100", "Subjectif"], labels: ["Time-to-hire", "Recall", "Scoring"] },
    after: { stats: ["15j", "42/100", "IA-assisted"], labels: ["Time-to-hire", "Recall", "Scoring"] },
  },
  {
    sector: "Finance", metric: "+85%", metricLabel: "précision prédictive",
    before: { stats: ["±22%", "5j", "Tableur"], labels: ["Variance", "Reporting", "Outil"] },
    after: { stats: ["±4%", "Temps réel", "Dashboard"], labels: ["Variance", "Reporting", "Outil"] },
  },
];

function SplitCard({ useCase, isVisible, index }: {
  useCase: typeof useCases[0]; isVisible: boolean; index: number;
}) {
  const [sliderPos, setSliderPos] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setSliderPos(100), 600 + index * 300);
    return () => clearTimeout(timer);
  }, [isVisible, index]);

  return (
    <div className={cn(
      "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-600",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )} style={{ transitionDelay: `${index * 180 + 200}ms` }}>
      {/* Sector label */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-2">
        <div className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/15">
          {useCase.sector}
        </div>
      </div>

      {/* Split screen */}
      <div className="relative px-5 pb-4">
        <div className="grid grid-cols-2 gap-3 relative">
          {/* Before */}
          <div className={cn(
            "rounded-lg p-3 transition-all duration-700",
            sliderPos > 50 ? "bg-slate-50 border border-slate-100" : "bg-red-50 border border-red-200"
          )}>
            <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 mb-2 block">Avant</span>
            {useCase.before.stats.map((stat, j) => (
              <div key={j} className="flex items-center justify-between py-1">
                <span className="text-[10px] text-slate-400">{useCase.before.labels[j]}</span>
                <span className={cn(
                  "text-xs font-mono transition-all duration-500",
                  sliderPos > 50 ? "text-slate-300" : "text-red-500"
                )}>{stat}</span>
              </div>
            ))}
          </div>

          {/* After */}
          <div className={cn(
            "rounded-lg p-3 transition-all duration-700",
            sliderPos > 50 ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100"
          )}>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-500 mb-2 block">Après</span>
            {useCase.after.stats.map((stat, j) => (
              <div key={j} className="flex items-center justify-between py-1">
                <span className="text-[10px] text-slate-400">{useCase.after.labels[j]}</span>
                <span className={cn(
                  "text-xs font-mono font-semibold transition-all duration-500",
                  sliderPos > 50 ? "text-emerald-600" : "text-slate-300"
                )}>{stat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slider line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2">
          <div className={cn(
            "h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-all duration-700",
            sliderPos > 50 ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </div>

      {/* Metric */}
      <div className="px-5 py-4 border-t border-slate-100 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">{useCase.metric}</span>
        <span className="text-xs sm:text-sm text-slate-500">{useCase.metricLabel}</span>
      </div>
    </div>
  );
}

export function UseCasesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(239_84%_67%/0.03),transparent_60%)]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Transformations</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Résultats concrets par secteur
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {useCases.map((uc, i) => (
            <SplitCard key={i} useCase={uc} isVisible={isVisible} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
