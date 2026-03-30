import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div
        ref={ref}
        className={cn(
          "max-w-2xl mx-auto px-4 sm:px-6 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
          Identifiez vos leviers d'optimisation
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6 sm:mb-8">
          Échangez avec nous pour analyser vos opérations et identifier des opportunités concrètes d'amélioration.
        </p>
        <a href="mailto:contact@aether-connect.com">
          <Button
            size="lg"
            className="h-10 sm:h-11 px-8 sm:px-10 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all animate-pulse-glow"
          >
            Planifier un appel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  );
}
