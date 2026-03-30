import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Brain, Workflow, MessageSquareText, Eye, Settings, FileBarChart } from "lucide-react";

const capabilities = [
  { icon: Brain, label: "Analyse prédictive", desc: "Anticipez les risques et opportunités", pct: 94 },
  { icon: Workflow, label: "Automatisation", desc: "Réduisez les tâches manuelles répétitives", pct: 88 },
  { icon: MessageSquareText, label: "NLP avancé", desc: "Compréhension du langage métier", pct: 91 },
  { icon: Eye, label: "Vision documentaire", desc: "Extraction intelligente de données", pct: 86 },
  { icon: Settings, label: "Optimisation", desc: "Amélioration continue des processus", pct: 92 },
  { icon: FileBarChart, label: "Reporting IA", desc: "Tableaux de bord auto-générés", pct: 85 },
];

function CircularProgress({ pct, isVisible, delay }: { pct: number; isVisible: boolean; delay: number }) {
  const r = 20, c = 2 * Math.PI * r;
  const offset = c - (c * (isVisible ? pct : 0)) / 100;

  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="3" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="hsl(239 84% 67%)"
        strokeWidth="3" strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 24 24)"
        className="transition-all duration-[1500ms] ease-out"
        style={{ transitionDelay: `${delay}ms` }}
      />
      <text x="24" y="25" textAnchor="middle" dominantBaseline="middle"
        className="text-[9px] font-bold fill-white/70"
      >{isVisible ? pct : 0}%</text>
    </svg>
  );
}

export function DifferentiationSection() {
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
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Capacités</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Technologies IA de pointe
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-5 transition-all duration-600 hover:border-primary/20 hover:bg-white/[0.04]",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(239 84% 67% / 0.4))" }} />
                  </div>
                  <CircularProgress pct={cap.pct} isVisible={isVisible} delay={i * 100 + 400} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cap.label}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
