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
    <section id="results" className="py-16 sm:py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Measurable Results
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Transform your operations and measure the impact from day one.
          </p>
        </div>
        
        {/* Stats */}
        <div 
          ref={ref}
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20 stagger-children",
            isVisible && "visible"
          )}
        >
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={i} 
                className="text-center p-6 sm:p-8 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
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
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Value proposition */}
        <div className="max-w-3xl mx-auto text-center px-2">
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-snug mb-6 sm:mb-8">
            "Join the companies transforming their operations with intelligent automation."
          </p>
        </div>
      </div>
    </section>
  );
}
