import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.04),transparent_60%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div
        ref={ref}
        className={cn(
          "max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
          Identifiez vos leviers d'<span className="text-primary">optimisation</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-8">
          Échangez avec nous pour analyser vos opérations et identifier des opportunités concrètes d'amélioration.
        </p>
        <a href="mailto:contact@aether-connect.com">
          <Button
            size="lg"
            className="h-12 px-10 text-sm font-medium bg-primary hover:bg-primary/90 border border-primary/50 shadow-[0_0_30px_hsl(239_84%_67%/0.3)] hover:shadow-[0_0_40px_hsl(239_84%_67%/0.4)] transition-all"
          >
            Planifier un appel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  );
}
