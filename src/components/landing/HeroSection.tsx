import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogosCloud } from "./BrandLogos";
import { FloatingClouds } from "./CloudShapes";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center bg-background pt-16 md:pt-14 overflow-hidden">
      {/* Cloud-style background */}
      <FloatingClouds />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-cloud-fade-in">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Next-Generation AI Automation</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3 sm:mb-4 animate-cloud-fade-in text-balance" style={{ animationDelay: "0.1s" }}>
          AI That Works <span className="text-primary">For You</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed animate-cloud-fade-in px-2" style={{ animationDelay: "0.2s", opacity: 0 }}>
          6 specialized AI agents. One platform. Automate your operations in support, HR, sales, and compliance, without writing a single line of code.
        </p>
        
        {/* Real brand logos cloud - moved above CTAs */}
        <div className="animate-cloud-fade-in mb-8 sm:mb-10" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <p className="text-xs text-muted-foreground mb-2">Integrates with your favorite tools</p>
          <BrandLogosCloud maxItems={8} />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-cloud-fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <Link to="/signup" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all animate-pulse-glow"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium"
            >
              Request a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
