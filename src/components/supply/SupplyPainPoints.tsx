import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, Shield, Truck, FileCheck } from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    title: "Demand Blindness",
    problem: "Your forecasts are wrong 40% of the time",
    cost: "$2.1M avg excess inventory per site",
    solution: "Probabilistic multi-scenario forecasting that learns from your data",
  },
  {
    icon: Shield,
    title: "Supplier Risk",
    problem: "You discover supplier failures after impact",
    cost: "72h average detection delay",
    solution: "Real-time supplier scoring & early warnings before disruption",
  },
  {
    icon: Truck,
    title: "Logistics Waste",
    problem: "Routes and loads are planned manually",
    cost: "15–25% transport cost overruns",
    solution: "Automated consolidation & route optimization across all sites",
  },
  {
    icon: FileCheck,
    title: "Compliance Gaps",
    problem: "Audits are reactive, traceability is fragmented",
    cost: "€500K+ avg regulatory penalty",
    solution: "Continuous automated compliance monitoring & ESG tracking",
  },
];

export function SupplyPainPoints() {
  const { ref, isVisible } = useStaggerAnimation(painPoints.length, { threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 sm:py-32 px-4 sm:px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-600 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          The problems you already know
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight transition-all duration-600 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          Every day without visibility costs you money
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`group relative bg-card rounded-2xl border border-border p-7 sm:p-8 transition-all duration-500 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: isVisible ? `${150 + i * 80}ms` : '0ms' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center shrink-0 group-hover:bg-foreground/[0.07] transition-colors duration-300">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">{point.title}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{point.problem}</p>
                    <p className="text-xs font-medium text-destructive/80 tracking-wide">{point.cost}</p>
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-sm text-muted-foreground leading-relaxed">{point.solution}</p>
                    </div>
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
