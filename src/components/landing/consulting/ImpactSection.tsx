import { TrendingDown, Target, Clock, Package } from "lucide-react";

const metrics = [
  {
    icon: TrendingDown,
    value: "-15 to 25%",
    label: "Logistics costs",
    description: "Reduction in transportation and warehousing costs through better planning.",
  },
  {
    icon: Target,
    value: "+30%",
    label: "Forecast accuracy",
    description: "Significant improvement in demand forecast reliability.",
  },
  {
    icon: Clock,
    value: "÷3",
    label: "Analysis time",
    description: "Faster decision-making through automated data analysis.",
  },
  {
    icon: Package,
    value: "-20%",
    label: "Inventory requirements",
    description: "Optimized stock levels without impacting service rates.",
  },
];

export function ImpactSection() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Proven results
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Measurable impact on your operations
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="bg-card rounded-2xl border border-border/50 p-8 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
