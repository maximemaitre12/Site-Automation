import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 animate-gradient-shift" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div 
        ref={ref}
        className={cn(
          "relative max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-6">
          Ready to Automate Your Operations?
        </h2>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Join companies saving hundreds of hours every month with intelligent automation.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full mb-10">
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium bg-white text-primary hover:bg-white/90 shadow-lg animate-pulse-glow"
            >
              Request a Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/signup" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Start for Free
            </Button>
          </Link>
        </div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/70 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>contact@aether-ai.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </section>
  );
}
