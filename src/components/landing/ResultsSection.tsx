import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

const stats = [
  { 
    icon: Clock,
    value: 80, 
    suffix: "%",
    label: "Time Saved",
    description: "Reduction in repetitive tasks" 
  },
  { 
    icon: TrendingUp,
    value: 3, 
    suffix: "x",
    label: "Productivity",
    description: "Increase in team productivity" 
  },
  { 
    icon: Target,
    value: 95, 
    suffix: "%",
    label: "Accuracy",
    description: "Precision on automated tasks" 
  },
  { 
    icon: Zap,
    value: 4, 
    prefix: "<",
    suffix: " wks",
    label: "Fast ROI",
    description: "Return on investment in weeks" 
  },
];

export function ResultsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="results" className="relative py-12 sm:py-16 lg:py-20 bg-secondary/50 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 sm:mb-3">
            Measurable Results
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Transform your operations and measure the impact from day one.
          </p>
        </div>
        
        {/* Stats */}
        <div 
          ref={ref}
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children",
            isVisible && "visible"
          )}
        >
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={i} 
                className="relative text-center p-4 sm:p-5 rounded-xl bg-background border border-border hover:border-primary/20 transition-all duration-300 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
                  {isVisible ? (
                    <AnimatedCounter 
                      end={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  ) : (
                    `${stat.prefix || ""}0${stat.suffix || ""}`
                  )}
                </div>
                <div className="text-xs font-medium text-foreground mb-0.5">{stat.label}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
