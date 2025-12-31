import { Link } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

export function DemoSection() {
  return (
    <section className="py-10 lg:py-14 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
          <Sparkles className="w-3 h-3" />
          <span>Interactive Tour</span>
        </div>
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
          See the Platform in Action
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
          Take a guided tour of all 7 AI agents and discover how they work together.
        </p>
        
        {/* Preview card - mimics the intro scene */}
        <Link to="/product-tour" className="block">
          <div className="relative group cursor-pointer max-w-xl mx-auto">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card - white background like IntroScene */}
            <div className="relative rounded-xl border border-border bg-white dark:bg-slate-900 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 aspect-[2/1] flex items-center justify-center">
              {/* Logo centered like in IntroScene */}
              <div className="relative flex flex-col items-center">
                <img 
                  src={aetherLogo} 
                  alt="AETHER" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" />
                  </div>
                </div>
              </div>
              
              {/* Bottom overlay with CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Play className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Start Interactive Tour</span>
                  <span className="text-[10px] text-white/70">• 3 min</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Watch button below the banner */}
        <div className="mt-4">
          <Link to="/product-tour">
            <Button 
              size="default" 
              className="h-9 px-6 text-sm font-medium gap-2 group bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-md shadow-primary/20"
            >
              <Play className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Watch the Tour</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
