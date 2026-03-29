import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Award, BarChart3, Compass } from "lucide-react";

const blocks = [
  {
    icon: Award,
    title: "Double expertise",
    content: "Nous combinons une compréhension approfondie des métiers de la supply chain avec une maîtrise des technologies d'intelligence artificielle. Cette double compétence nous permet de concevoir des solutions réellement adaptées à vos enjeux opérationnels.",
  },
  {
    icon: BarChart3,
    title: "Résultats démontrés",
    content: "Nos interventions ont permis l'identification de plusieurs centaines de milliers d'euros d'optimisation chez nos clients. Amélioration significative de la performance opérationnelle, réduction des coûts et fiabilisation des processus sont au cœur de chaque mission.",
  },
  {
    icon: Compass,
    title: "Partenaire stratégique",
    content: "Nous intervenons en amont des projets pour identifier les leviers de performance, puis accompagnons leur mise en œuvre. Notre rôle est celui d'un partenaire qui s'inscrit dans la durée, pas d'un prestataire technique ponctuel.",
  },
];

export function SupplyCaseStudy() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Pourquoi nous
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          L'expertise au service de vos résultats
        </h2>

        <div className="space-y-6">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <div
                key={block.title}
                className={`bg-background rounded-2xl border border-border p-8 sm:p-10 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 80}ms` : '0ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{block.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
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
