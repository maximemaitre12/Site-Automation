import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const benefits = [
  { icon: Clock, label: "Save Time" },
  { icon: TrendingUp, label: "Boost Productivity" },
  { icon: Target, label: "High Accuracy" },
  { icon: Zap, label: "Quick Setup" },
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
          "flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14",
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {benefits.map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={i} 
                className={cn(
                  "flex items-center gap-2.5 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <IconComponent className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">{benefit.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}