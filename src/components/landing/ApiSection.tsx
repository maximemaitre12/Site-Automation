import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Key, Check } from "lucide-react";
import { ApiConnectionDemo } from "./ApiConnectionDemo";

export function ApiSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Key className="w-3.5 h-3.5" />
            <span>Simple API Integration</span>
          </div>
          <h2 className={cn(
            "text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Connect Everything in Seconds
          </h2>
          <p className={cn(
            "text-sm sm:text-base text-muted-foreground transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            One API key. Instant connection. No complex setup required.
          </p>
        </div>

        {/* Demo */}
        <div className={cn(
          "flex justify-center mb-8 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <ApiConnectionDemo />
        </div>

        {/* Bottom tagline */}
        <div className={cn(
          "text-center transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              No coding required
            </span>
            <span className="mx-1 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              100+ integrations
            </span>
            <span className="mx-1 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              Secure & encrypted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
