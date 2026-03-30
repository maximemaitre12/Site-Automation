import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Database, Brain, Target, ArrowUp, Zap, BarChart3, Shield } from "lucide-react";

const layers = [
  {
    label: "Données brutes",
    desc: "Sources structurées et non structurées",
    icon: Database,
    gradient: "from-slate-500 to-slate-600",
    bgGlow: "hsl(220 14% 50% / 0.06)",
    stats: ["CRM", "ERP", "IoT", "Docs"],
  },
  {
    label: "Moteur IA",
    desc: "Analyse, corrélation et prédiction",
    icon: Brain,
    gradient: "from-primary to-[hsl(260_70%_60%)]",
    bgGlow: "hsl(239 84% 67% / 0.08)",
    stats: ["NLP", "ML", "Deep Learning", "LLM"],
  },
  {
    label: "Décisions optimisées",
    desc: "Actions concrètes et mesurables",
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "hsl(160 84% 39% / 0.06)",
    stats: ["+12% marge", "−40% coûts", "×2 vitesse"],
  },
];

export function PositioningSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.10)_1px,transparent_1px)] bg-[length:28px_28px]" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,hsl(239_84%_67%/0.04),transparent_70%)] blur-3xl" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 sm:mb-20 transition-all duration-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Architecture</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            De la donnée brute à la décision optimisée
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Notre IA transforme vos données opérationnelles en leviers d'action concrets, couche par couche.
          </p>
        </div>

        {/* Vertical pipeline */}
        <div className="relative max-w-lg mx-auto">
          {/* Central vertical line */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px transition-all duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )}
            style={{
              background: "linear-gradient(180deg, hsl(220 14% 85%), hsl(239 84% 67% / 0.4), hsl(160 84% 39% / 0.3))",
            }}
          />

          {layers.map((layer, i) => {
            const Icon = layer.icon;
            const isMiddle = i === 1;

            return (
              <div key={layer.label}>
                {/* Layer card */}
                <div
                  className={cn(
                    "relative transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                  )}
                  style={{ transitionDelay: `${i * 200 + 300}ms` }}
                >
                  <div className={cn(
                    "relative rounded-2xl border p-5 sm:p-6 backdrop-blur-sm transition-all duration-500",
                    isMiddle
                      ? "bg-slate-900 border-slate-700 shadow-[0_8px_40px_hsl(239_84%_67%/0.15),0_0_0_1px_hsl(239_84%_67%/0.1)]"
                      : "bg-white border-slate-200 shadow-[0_4px_24px_hsl(220_20%_50%/0.06)]"
                  )}>
                    {/* Glow for middle card */}
                    {isMiddle && (
                      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-[hsl(260_70%_60%/0.2)] to-primary/20 -z-10 blur-sm" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        isMiddle
                          ? "bg-gradient-to-br from-primary to-[hsl(260_70%_60%)] shadow-[0_4px_16px_hsl(239_84%_67%/0.3)]"
                          : `bg-gradient-to-br ${layer.gradient} shadow-sm`
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[10px] font-bold tracking-[0.15em] uppercase",
                            isMiddle ? "text-primary/60" : "text-slate-300"
                          )}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className={cn(
                            "text-base sm:text-lg font-bold",
                            isMiddle ? "text-white" : "text-slate-900"
                          )}>
                            {layer.label}
                          </h3>
                        </div>
                        <p className={cn(
                          "text-xs sm:text-sm mb-3",
                          isMiddle ? "text-slate-400" : "text-slate-500"
                        )}>
                          {layer.desc}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {layer.stats.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                                isMiddle
                                  ? "bg-white/10 text-white/70 border border-white/10"
                                  : "bg-slate-50 text-slate-500 border border-slate-100"
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Scan line for AI layer */}
                    {isMiddle && isVisible && (
                      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden rounded-b-2xl">
                        <div
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                          style={{
                            animation: "scan-line 3s ease-in-out infinite",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow connector */}
                {i < layers.length - 1 && (
                  <div
                    className={cn(
                      "flex items-center justify-center h-12 sm:h-16 transition-all duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{ transitionDelay: `${i * 200 + 500}ms` }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                        <ArrowUp className="w-3 h-3 text-primary rotate-180" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(400%); }
        }
      `}</style>
    </section>
  );
}
