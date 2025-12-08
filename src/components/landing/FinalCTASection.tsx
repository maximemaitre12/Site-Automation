import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTASection() {
  return (
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
          Prêt à automatiser vos opérations ?
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
          Rejoignez les entreprises qui économisent des centaines d'heures chaque mois grâce à l'automatisation intelligente.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="h-12 px-8 text-sm font-medium bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-sm font-medium border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Contacter l'équipe commerciale
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
