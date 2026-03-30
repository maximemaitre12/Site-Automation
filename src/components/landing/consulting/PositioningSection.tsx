import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Database, Brain, Target } from "lucide-react";

const layers = [
  { label: "Données brutes", desc: "Sources structurées et non structurées", icon: Database, color: "text-slate-500 bg-slate-50 border-slate-200" },
  { label: "Moteur IA", desc: "Analyse, corrélation et prédiction", icon: Brain, color: "text-primary bg-primary/10 border-primary/25 shadow-[0_0_20px_hsl(239_84%_67%/0.08)]" },
  { label: "Décisions optimisées", desc: "Actions concrètes et mesurables", icon: Target, color: "text-emerald-600 bg-emerald-50 border-emerald-200 shadow-[0_0_20px_hsl(142_76%_36%/0.08)]" },
];

export function PositioningSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.03),transparent_60%)]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Isometric stack */}
          <div className={cn("transition-all duration-700", isVisible ? "opacity-100" : "opacity-0")} style={{ transitionDelay: "200ms" }}>
            <div className="relative flex flex-col items-center gap-4 py-8" style={{ perspective: "800px" }}>
              {layers.slice().reverse().map((layer, ri) => {
                const i = layers.length - 1 - ri;
                const Icon = layer.icon;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-full max-w-[320px] px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-600",
                      layer.color,
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}
                    style={{
                      transitionDelay: `${(layers.length - 1 - ri) * 200 + 400}ms`,
                      transform: isVisible
                        ? `rotateX(8deg) translateZ(${ri * 8}px)`
                        : `rotateX(8deg) translateZ(${ri * 8}px) translateY(24px)`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{layer.label}</p>
                      <p className="text-xs text-slate-500">{layer.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Vertical arrows between layers */}
              {[0, 1].map(i => (
                <div
                  key={`arrow-${i}`}
                  className={cn(
                    "absolute w-px h-4 bg-gradient-to-b from-primary/40 to-primary/10 transition-all duration-500",
                    isVisible ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    top: `${28 + i * 37}%`,
                    left: "50%",
                    transitionDelay: `${800 + i * 200}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")} style={{ transitionDelay: "300ms" }}>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Architecture</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5">
              De la donnée brute à la décision optimisée
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mb-8 leading-relaxed">
              Notre approche transforme vos données opérationnelles en leviers d'action concrets grâce à une intelligence artificielle entraînée sur vos processus métier.
            </p>
            <div className="space-y-4">
              {layers.map((layer, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${600 + i * 120}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{layer.label}</p>
                    <p className="text-xs text-slate-500">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
