import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Search, BarChart3, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01", title: "Analyse", duration: "1-2 semaines", icon: Search,
    accent: "primary",
    desc: "Cartographie complète de vos opérations et identification des points de friction via notre moteur IA.",
    miniStats: [
      { label: "Flux analysés", pct: 92 },
      { label: "Données collectées", pct: 78 },
      { label: "Points identifiés", pct: 85 },
      { label: "Score global", pct: 96 },
    ],
  },
  {
    num: "02", title: "Priorisation", duration: "1 semaine", icon: BarChart3,
    accent: "violet",
    desc: "Évaluation des opportunités à plus fort impact business et construction du plan d'action.",
    miniStats: [
      { label: "Impact estimé", pct: 88 },
      { label: "Effort requis", pct: 45 },
      { label: "ROI projeté", pct: 94 },
      { label: "Quick wins", pct: 72 },
    ],
  },
  {
    num: "03", title: "Déploiement", duration: "2-4 semaines", icon: Rocket,
    accent: "emerald",
    desc: "Mise en place des solutions et accompagnement opérationnel pour des résultats durables.",
    miniStats: [
      { label: "Actions déployées", pct: 100 },
      { label: "KPIs suivis", pct: 82 },
      { label: "Gains réalisés", pct: 91 },
      { label: "Adoption", pct: 97 },
    ],
  },
];

const accentMap: Record<string, { bar: string; numBg: string; numText: string; iconBg: string; glow: string }> = {
  primary: {
    bar: "bg-primary",
    numBg: "bg-primary",
    numText: "text-white",
    iconBg: "bg-gradient-to-br from-primary to-[hsl(260_70%_60%)]",
    glow: "shadow-[0_8px_30px_hsl(239_84%_67%/0.12)]",
  },
  violet: {
    bar: "bg-[hsl(260_70%_60%)]",
    numBg: "bg-[hsl(260_70%_60%)]",
    numText: "text-white",
    iconBg: "bg-gradient-to-br from-[hsl(260_70%_60%)] to-[hsl(280_60%_55%)]",
    glow: "shadow-[0_8px_30px_hsl(260_70%_60%/0.12)]",
  },
  emerald: {
    bar: "bg-[hsl(200_80%_55%)]",
    numBg: "bg-[hsl(200_80%_55%)]",
    numText: "text-white",
    iconBg: "bg-gradient-to-br from-[hsl(200_80%_55%)] to-[hsl(210_85%_50%)]",
    glow: "shadow-[0_8px_30px_hsl(200_80%_55%/0.12)]",
  },
};

export function MethodSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section id="methode" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,hsl(239_84%_67%/0.04),transparent_70%)]" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-14 sm:mb-20 transition-all duration-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/70 mb-3">Méthodologie</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Un pipeline structuré en 3 phases
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            Chaque phase est conçue pour maximiser l'impact et minimiser les risques.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 relative">
          {/* Connector (desktop) */}
          <div className="hidden md:flex absolute top-16 left-[20%] right-[20%] items-center z-0">
            {[0, 1].map(i => (
              <div key={i} className={cn("flex-1 flex items-center", i === 0 ? "" : "")}>
                <div className={cn(
                  "flex-1 h-px transition-all duration-1000",
                  isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
                  style={{
                    background: "linear-gradient(90deg, hsl(239 84% 67% / 0.3), hsl(260 70% 60% / 0.3))",
                    transitionDelay: `${800 + i * 300}ms`,
                  }}
                />
                <ArrowRight className={cn(
                  "w-3 h-3 text-primary/40 mx-1 transition-all duration-500",
                  isVisible ? "opacity-100" : "opacity-0"
                )} style={{ transitionDelay: `${1000 + i * 300}ms` }} />
              </div>
            ))}
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            const a = accentMap[step.accent];

            return (
              <div
                key={i}
                className={cn(
                  "group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-700 hover:bg-white/[0.06] hover:border-white/[0.12]",
                  a.glow.replace(/shadow/, "hover:shadow"),
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 200 + 300}ms` }}
              >
                {/* Top: Number + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black",
                    a.numBg, a.numText
                  )}
                    style={{ boxShadow: `0 4px 14px ${step.accent === 'primary' ? 'hsl(239 84% 67% / 0.3)' : step.accent === 'violet' ? 'hsl(260 70% 60% / 0.3)' : 'hsl(160 84% 39% / 0.3)'}` }}
                  >
                    {step.num}
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", a.iconBg)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Title + desc */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{step.desc}</p>

                {/* Mini dashboard */}
                <div className="space-y-2.5 mb-5">
                  {step.miniStats.map((stat, j) => (
                    <div key={j}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-slate-500">{stat.label}</span>
                        <span className={cn(
                          "text-[10px] font-bold tabular-nums transition-all duration-700",
                          isVisible ? "opacity-100" : "opacity-0",
                          step.accent === "primary" ? "text-primary" : step.accent === "violet" ? "text-[hsl(260_70%_65%)]" : "text-emerald-400"
                        )}
                          style={{ transitionDelay: `${i * 200 + j * 100 + 800}ms` }}
                        >
                          {isVisible ? stat.pct : 0}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000 ease-out", a.bar)}
                          style={{
                            width: isVisible ? `${stat.pct}%` : "0%",
                            transitionDelay: `${i * 200 + j * 100 + 600}ms`,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duration */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse_2s_ease-in-out_infinite]" />
                  <span className="text-[10px] font-semibold text-slate-400">{step.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
