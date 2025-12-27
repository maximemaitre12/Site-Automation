import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingLogos } from "./FloatingLogos";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center bg-background pt-20 md:pt-14 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary/[0.03] animate-gradient-shift" />
      
      {/* Floating particles decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Next-Generation AI Automation</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4 sm:mb-6 animate-fade-up text-balance">
          AI That Works{" "}
          <span className="text-primary">For You</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-up-delay-1 px-2">
          6 specialized AI agents. One platform. Automate your operations in support, HR, sales, and compliance — without writing a single line of code.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-up-delay-2">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all animate-pulse-glow"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium"
            >
              Request a Demo
            </Button>
          </Link>
        </div>

        {/* Floating integration logos */}
        <div className="animate-fade-up-delay-3">
          <p className="text-xs text-muted-foreground mb-4">Integrates with your favorite tools</p>
          <FloatingLogos />
        </div>
      </div>
    </section>
  );
}
