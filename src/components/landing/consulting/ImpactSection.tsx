import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp, Workflow, Users, PiggyBank } from "lucide-react";

const metrics = [
  { icon: Clock, label: "Réduction des délais opérationnels", value: 40, suffix: "%" },
  { icon: Users, label: "Gain de temps pour les équipes", value: 60, suffix: "%" },
  { icon: Workflow, label: "Fluidité des processus", value: 35, suffix: "%" },
  { icon: TrendingUp, label: "Meilleure allocation des ressources", value: 50, suffix: "%" },
  { icon: PiggyBank, label: "Économies mesurables identifiées", value: 25, suffix: "%" },
];

function AnimatedBar({ value, isVisible, delay, label, suffix, icon: Icon }: {
  value: number;
  isVisible: boolean;
  delay: number;
  label: string;
  suffix: string;
  icon: React.ElementType;
}) {
  const { formattedCount } = useCountUp({
    end: value,
    duration: 1500,
    suffix,
    enabled: isVisible,
  });

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-xs sm:text-sm text-foreground">{label}</span>
        </div>
        <span className="text-sm font-semibold text-primary tabular-nums">
          +{formattedCount}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
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
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-12 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Des gains rapides sur vos opérations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Notre approche permet d'identifier et d'activer des leviers d'amélioration concrets.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {metrics.map((m, i) => (
            <AnimatedBar
              key={i}
              value={m.value}
              isVisible={isVisible}
              delay={i * 120}
              label={m.label}
              suffix={m.suffix}
              icon={m.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
