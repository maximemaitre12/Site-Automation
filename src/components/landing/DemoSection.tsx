import { Link } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

export function DemoSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Tour</span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-3">
          See the Platform in Action
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-10">
          Take a guided tour of all 7 AI agents and discover how they work together to automate your business.
        </p>
        
        {/* Preview card - mimics the intro scene */}
        <Link to="/product-tour" className="block">
          <div className="relative group cursor-pointer max-w-2xl mx-auto">
            {/* Glow effect on hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card - white background like IntroScene */}
            <div className="relative rounded-2xl border border-border bg-white dark:bg-slate-900 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 aspect-video flex items-center justify-center">
              {/* Logo centered like in IntroScene */}
              <div className="relative flex flex-col items-center">
                <img 
                  src={aetherLogo} 
                  alt="AETHER" 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Bottom overlay with CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Start Interactive Tour</span>
                  <span className="text-xs text-white/70">• 3 min</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Watch button below the banner */}
        <div className="mt-6">
          <Link to="/product-tour">
            <Button 
              size="lg" 
              className="h-11 px-8 text-sm font-medium gap-2 group bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Watch the Tour</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
