import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, PackageX, ClipboardList, Database } from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    title: "Prévisions peu fiables",
    description: "Vos prévisions de demande manquent de précision, entraînant des décisions basées sur l'intuition plutôt que sur les données.",
  },
  {
    icon: PackageX,
    title: "Surstocks et ruptures",
    description: "L'équilibre entre disponibilité produit et coût de stockage reste un défi permanent pour vos équipes.",
  },
  {
    icon: ClipboardList,
    title: "Processus manuels chronophages",
    description: "Des tâches répétitives mobilisent vos équipes sur des activités à faible valeur ajoutée au lieu de se concentrer sur l'analyse.",
  },
  {
    icon: Database,
    title: "Données sous-exploitées",
    description: "Vous disposez de volumes importants de données, mais leur potentiel reste largement inexploité faute d'outils adaptés.",
  },
];

export function SupplyPainPoints() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Vous reconnaissez ces situations ?
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          Des défis que nous comprenons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`bg-background rounded-2xl border border-border p-8 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 60}ms` : '0ms' }}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
