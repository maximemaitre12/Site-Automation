import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Search, BarChart3, Rocket } from "lucide-react";

const steps = [
  {
    num: "01", title: "Analyse", duration: "1-2 semaines", icon: Search,
    desc: "Cartographie complète de vos opérations et identification des points de friction via notre moteur IA.",
    miniStats: ["Flux analysés", "Données collectées", "Points identifiés", "Score global"],
  },
  {
    num: "02", title: "Priorisation", duration: "1 semaine", icon: BarChart3,
    desc: "Évaluation des opportunités à plus fort impact business et construction du plan d'action.",
    miniStats: ["Impact estimé", "Effort requis", "ROI projeté", "Quick wins"],
  },
  {
    num: "03", title: "Déploiement", duration: "2-4 semaines", icon: Rocket,
    desc: "Mise en place des solutions et accompagnement opérationnel pour des résultats durables.",
    miniStats: ["Actions déployées", "KPIs suivis", "Gains réalisés", "Adoption"],
  },
];

export function MethodSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Méthodologie</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Un pipeline structuré en 3 phases
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-5 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px">
            <div className={cn(
              "h-full bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 transition-all duration-1000",
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )} style={{ transitionDelay: "600ms" }} />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={cn(
                  "relative rounded-xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 transition-all duration-600",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 180 + 300}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-primary/50">{step.num}</span>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5">{step.desc}</p>

                {/* Mini dashboard preview */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {step.miniStats.map((stat, j) => (
                    <div
                      key={j}
                      className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                    >
                      <div className={cn(
                        "w-full h-1.5 rounded-full mb-1.5 transition-all duration-700",
                        isVisible ? "opacity-100" : "opacity-0",
                        j % 2 === 0 ? "bg-primary/30" : "bg-emerald-500/30"
                      )}
                        style={{
                          width: isVisible ? `${60 + j * 10}%` : "0%",
                          transitionDelay: `${i * 180 + j * 80 + 600}ms`,
                        }}
                      />
                      <span className="text-[9px] text-slate-400">{stat}</span>
                    </div>
                  ))}
                </div>

                {/* Duration badge */}
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-medium text-slate-500">{step.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
