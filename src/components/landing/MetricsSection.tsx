import { TrendingDown, Clock, Rocket } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    label: "Reduce manual tasks",
    description: "Automate repetitive operations with intelligent AI agents",
  },
  {
    icon: Clock,
    label: "Save valuable time",
    description: "Free your teams to focus on high-value strategic work",
  },
  {
    icon: Rocket,
    label: "Quick time to value",
    description: "See measurable results within weeks, not months",
  },
];

export function MetricsSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-secondary/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in">
            <span className="text-gradient">Real benefits</span> for your business
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            AETHER replaces repetitive operations, standardizes processes, 
            and creates AI agents that work for you, 24/7.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                
                <div className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {benefit.label}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
