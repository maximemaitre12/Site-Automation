import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroDiagram } from "./consulting/HeroDiagram";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center bg-background pt-16 md:pt-14 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.04),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr,1.3fr] gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="animate-cloud-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Conseil en optimisation opérationnelle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-foreground leading-[1.12] mb-5 text-balance">
              Optimisez vos opérations et réduisez vos coûts grâce à{" "}
              <span className="text-primary">l'IA</span>
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed mb-7 animate-cloud-fade-in"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Nous aidons les entreprises à identifier et corriger les inefficacités dans leurs processus critiques, avec des résultats concrets et mesurables.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-3 animate-cloud-fade-in"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <a href="mailto:contact@aether-connect.com">
                <Button
                  size="lg"
                  className="h-11 px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Demander un échange
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>

          {/* Diagram — large and prominent */}
          <div
            className="animate-cloud-fade-in lg:pl-4"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <HeroDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
