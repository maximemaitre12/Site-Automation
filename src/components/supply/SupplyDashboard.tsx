import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, Target, Clock, Package } from "lucide-react";

const results = [
  {
    icon: TrendingDown,
    metric: "-15 à 25%",
    label: "Coûts logistiques",
    description: "Réduction des coûts de transport et d'entreposage grâce à une meilleure planification.",
  },
  {
    icon: Target,
    metric: "+30%",
    label: "Précision des prévisions",
    description: "Amélioration significative de la fiabilité des prévisions de demande.",
  },
  {
    icon: Clock,
    metric: "÷3",
    label: "Temps d'analyse",
    description: "Accélération des processus décisionnels par l'automatisation de l'analyse de données.",
  },
  {
    icon: Package,
    metric: "-20%",
    label: "Besoin en stock",
    description: "Optimisation des niveaux de stock sans impact sur le taux de service.",
  },
];

export function SupplyDashboard() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Résultats concrets
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          Un impact mesurable sur vos opérations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`bg-background rounded-2xl border border-border p-8 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 60}ms` : '0ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground tracking-tight">{item.metric}</p>
                    <p className="text-sm font-medium text-foreground/80 mt-1">{item.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
