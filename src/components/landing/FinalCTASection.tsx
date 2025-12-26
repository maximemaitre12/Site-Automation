import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTASection() {
  return (
    <section id="enterprise" className="py-16 sm:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-6">
          Ready to automate your operations?
        </h2>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Join companies saving hundreds of hours every month with intelligent automation.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Start free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Contact sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}