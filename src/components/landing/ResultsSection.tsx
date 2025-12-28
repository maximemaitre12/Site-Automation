import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const benefits = [
  { icon: Clock, label: "Save Time", stat: "90%" },
  { icon: TrendingUp, label: "Boost Productivity", stat: "3x" },
  { icon: Target, label: "High Accuracy", stat: "99%" },
  { icon: Zap, label: "Quick Setup", stat: "5min" },
];

export function ResultsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });

  return (
    <section id="results" className="py-12 sm:py-16 bg-secondary/30">
      <div 
        ref={ref}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className={cn(
          "flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16",
          "transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          {benefits.map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col items-center text-center transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {benefit.stat}
                </div>
                <div className="flex items-center gap-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-xs sm:text-sm text-muted-foreground">{benefit.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}