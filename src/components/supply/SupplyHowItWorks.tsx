import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Analyse",
    description: "Nous étudions vos opérations, vos données et vos processus pour comprendre votre contexte et vos enjeux spécifiques.",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Identification",
    description: "Nous identifions et priorisons les opportunités d'amélioration à fort impact sur votre performance opérationnelle.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Déploiement",
    description: "Nous accompagnons la mise en œuvre de solutions adaptées à votre organisation, avec des résultats mesurables rapidement.",
  },
];

export function SupplyHowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Notre approche
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          Une méthodologie éprouvée
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`bg-background rounded-2xl border border-border p-8 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 60}ms` : '0ms' }}
              >
                <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">{step.step}</span>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mt-3 mb-5">
                  <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
