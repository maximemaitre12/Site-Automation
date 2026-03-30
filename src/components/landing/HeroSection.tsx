import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroDiagram } from "./consulting/HeroDiagram";

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-background pt-16 md:pt-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <div className="animate-cloud-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.15] mb-4 text-balance">
              Optimisez vos opérations et réduisez vos coûts grâce à{" "}
              <span className="text-primary">l'IA</span>
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed mb-6 sm:mb-8 animate-cloud-fade-in"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Nous aidons les entreprises à identifier et corriger les inefficacités dans leurs processus critiques, avec des résultats concrets et mesurables.
            </p>
            <div
              className="animate-cloud-fade-in"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <a href="mailto:contact@aether-connect.com">
                <Button
                  size="lg"
                  className="h-10 sm:h-11 px-6 sm:px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Demander un échange
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>

          {/* Diagram */}
          <div
            className="animate-cloud-fade-in"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <HeroDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
