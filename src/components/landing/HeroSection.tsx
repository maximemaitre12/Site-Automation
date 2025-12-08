import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background pt-14">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4" />
          <span>Nouvelle génération d'automatisation IA</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6 animate-fade-up text-balance">
          L'IA qui travaille{" "}
          <span className="text-primary">pour vous</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1">
          6 agents IA spécialisés. Une seule plateforme. Support, RH, ventes, compliance — automatisez 90% de vos opérations sans écrire une ligne de code.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up-delay-2">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="h-12 px-8 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Essayer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-sm font-medium"
            >
              Voir une démo
            </Button>
          </Link>
        </div>
        
        {/* Trust */}
        <div className="animate-fade-up-delay-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["Doctolib", "Qonto", "Alan", "Swile", "Payfit"].map((company) => (
              <span key={company} className="text-base font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
