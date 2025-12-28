import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Cloud-style animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      
      {/* Cloud decorations */}
      <div 
        className="absolute top-0 right-[10%] w-80 h-56 bg-white/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl animate-cloud-float"
        style={{ animationDuration: "12s" }}
      />
      <div 
        className="absolute bottom-0 left-[5%] w-64 h-48 bg-white/8 rounded-[40%_60%_70%_30%/50%_40%_60%_50%] blur-3xl animate-cloud-drift"
        style={{ animationDuration: "15s", animationDelay: "-3s" }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-white/5 rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-3xl animate-cloud-pulse"
        style={{ animationDuration: "10s", animationDelay: "-5s" }}
      />

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
