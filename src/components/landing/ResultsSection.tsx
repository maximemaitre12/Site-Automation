import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const benefits = [
  { 
    icon: Clock,
    label: "Save Time",
    description: "Automate repetitive tasks and focus on what matters" 
  },
  { 
    icon: TrendingUp,
    label: "Boost Productivity",
    description: "Let AI handle the heavy lifting for your team" 
  },
  { 
    icon: Target,
    label: "High Accuracy",
    description: "AI-powered precision on automated workflows" 
  },
  { 
    icon: Zap,
    label: "Quick Setup",
    description: "Get started in minutes, see results fast" 
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
            Why Teams Choose Aether
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Transform your operations and measure the impact from day one.
          </p>
        </div>
        
        {/* Benefits */}
        <div 
          ref={ref}
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children",
            isVisible && "visible"
          )}
        >
          {benefits.map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={i} 
                className="relative text-center p-4 sm:p-5 rounded-xl bg-background border border-border hover:border-primary/20 transition-all duration-300 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{benefit.label}</div>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
