import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, TrendingUp, Target, Zap, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Clock, label: "Save Time", stat: "90%" },
  { icon: TrendingUp, label: "Boost Productivity", stat: "3x" },
  { icon: Target, label: "High Accuracy", stat: "99%" },
  { icon: Zap, label: "Quick Setup", stat: "5min" },
];

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div 
        ref={ref}
        className={cn(
          "max-w-3xl mx-auto px-4 sm:px-6 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Card container matching site style */}
        <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/50 to-primary/10 backdrop-blur-sm p-8 sm:p-10 md:p-12 shadow-lg text-center overflow-hidden">
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 -z-10 pointer-events-none bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_35%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.1)_65%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_4s_ease-in-out_infinite]" />
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Started Today</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Ready to Automate Your Operations?
          </h2>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8">
            Join companies saving hundreds of hours every month with intelligent automation.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            {stats.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-0.5">
                    {stat.stat}
                  </div>
                  <div className="flex items-center gap-1">
                    <IconComponent className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/demo" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium"
              >
                Start for Free
              </Button>
            </Link>
            <Link to="/product-tour" className="w-full sm:w-auto">
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium gap-2 group"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
