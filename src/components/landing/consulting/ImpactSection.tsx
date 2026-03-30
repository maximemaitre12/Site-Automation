import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Réduction des délais opérationnels", value: 40, suffix: "%" },
  { label: "Gain de temps pour les équipes", value: 60, suffix: "%" },
  { label: "Fluidité des processus", value: 35, suffix: "%" },
  { label: "Meilleure allocation des ressources", value: 50, suffix: "%" },
  { label: "Économies mesurables identifiées", value: 25, suffix: "%" },
];

function MetricBar({ label, value, suffix, isVisible, delay }: {
  label: string; value: number; suffix: string; isVisible: boolean; delay: number;
}) {
  const { formattedCount } = useCountUp({ end: value, duration: 1600, suffix, enabled: isVisible });

  return (
    <div
      className={cn(
        "group p-4 rounded-lg border border-border/40 transition-all duration-500 hover:border-primary/20",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="text-sm text-foreground font-medium">{label}</span>
        <span className="text-lg font-semibold text-primary tabular-nums">+{formattedCount}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/60 transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${value}%` : "0%",
            transitionDelay: `${delay + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}

export function ImpactSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Résultats</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Des gains mesurables sur vos opérations
          </h2>
        </div>

        <div className="space-y-3">
          {metrics.map((m, i) => (
            <MetricBar key={i} {...m} isVisible={isVisible} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
