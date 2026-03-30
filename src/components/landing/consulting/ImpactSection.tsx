import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp, Workflow, Users, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";

const metrics = [
  { icon: Clock, label: "Réduction des délais opérationnels", value: 40, color: "primary" },
  { icon: Users, label: "Gain de temps pour les équipes", value: 60, color: "primary" },
  { icon: Workflow, label: "Fluidité des processus", value: 35, color: "primary" },
  { icon: TrendingUp, label: "Meilleure allocation des ressources", value: 50, color: "primary" },
  { icon: PiggyBank, label: "Économies mesurables identifiées", value: 25, color: "primary" },
];

function ImpactGauge({ value, isVisible, delay, label, icon: Icon }: {
  value: number;
  isVisible: boolean;
  delay: number;
  label: string;
  icon: React.ElementType;
}) {
  const { formattedCount } = useCountUp({
    end: value,
    duration: 1800,
    suffix: "%",
    enabled: isVisible,
  });

  return (
    <div
      className={cn(
        "group relative p-4 sm:p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-600 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs sm:text-sm text-foreground font-medium truncate pr-2">{label}</span>
            <span className="text-lg sm:text-xl font-bold text-primary tabular-nums shrink-0">
              +{formattedCount}
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1200 ease-out relative overflow-hidden"
              style={{
                width: isVisible ? `${value}%` : "0%",
                transitionDelay: `${delay + 300}ms`,
                background: "linear-gradient(90deg, hsl(var(--primary) / 0.7), hsl(var(--primary)))",
              }}
            >
              {/* Shimmer */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                style={{ animationDelay: `${delay + 1500}ms` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImpactSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.04),transparent_60%)]" />
      
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-12 sm:mb-16 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Des gains{" "}
            <span className="text-primary">rapides</span> sur vos opérations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Notre approche permet d'identifier et d'activer des leviers d'amélioration concrets.
          </p>
        </div>

        <div className="space-y-4">
          {metrics.map((m, i) => (
            <ImpactGauge
              key={i}
              value={m.value}
              isVisible={isVisible}
              delay={i * 150}
              label={m.label}
              icon={m.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
