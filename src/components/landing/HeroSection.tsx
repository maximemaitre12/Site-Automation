import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background pt-14">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6 animate-fade-up text-balance">
          L'automatisation intelligente pour l'entreprise
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1">
          Une plateforme unifiée qui déploie des agents IA pour automatiser vos opérations. Support client, RH, ventes, compliance — sans écrire une ligne de code.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-fade-up-delay-2">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="h-12 px-6 text-sm bg-foreground text-background hover:bg-foreground/90"
            >
              Essayer AETHER
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-6 text-sm"
            >
              Demander une démo
            </Button>
          </Link>
        </div>
        
        {/* Trust */}
        <div className="animate-fade-up-delay-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Utilisé par des équipes chez
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["Doctolib", "Qonto", "Alan", "Swile", "Payfit"].map((company) => (
              <span key={company} className="text-sm font-medium text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
