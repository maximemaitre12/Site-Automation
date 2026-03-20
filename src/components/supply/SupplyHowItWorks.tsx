import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Cable, Brain, Zap } from "lucide-react";

const steps = [
  {
    icon: Cable,
    step: "01",
    title: "Connect",
    description: "Your ERP, WMS, TMS integrated in 48h. No migration, no disruption.",
    tags: ["SAP", "Oracle", "Microsoft Dynamics", "Custom API"],
  },
  {
    icon: Brain,
    step: "02",
    title: "Analyze",
    description: "AI maps your flows, detects anomalies, and builds prediction models from your historical data.",
    tags: ["Pattern detection", "Anomaly scoring", "Risk mapping"],
  },
  {
    icon: Zap,
    step: "03",
    title: "Act",
    description: "Alerts, forecasts, and recommendations — before problems become crises.",
    tags: ["Real-time alerts", "Scenario planning", "Auto-reports"],
  },
];

export function SupplyHowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 sm:py-32 px-4 sm:px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-600 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          How it works
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-600 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          From data silos to full visibility in weeks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`relative bg-card rounded-2xl border border-border p-7 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: isVisible ? `${200 + i * 100}ms` : '0ms' }}
              >
                <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">{step.step}</span>
                <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center mt-3 mb-4">
                  <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-muted-foreground/60 bg-secondary px-2.5 py-1 rounded-full border border-border/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
