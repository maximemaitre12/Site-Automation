import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTASection() {
  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-6">
          Prêt à automatiser vos opérations ?
        </h2>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Rejoignez les entreprises qui économisent des centaines d'heures chaque mois grâce à l'automatisation intelligente.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full mb-10">
          <Link to="/demo" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Demander une démo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/signup" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm font-medium border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Commencer gratuitement
            </Button>
          </Link>
        </div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/70 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>contact@aether-ai.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+33 1 23 45 67 89</span>
          </div>
        </div>
      </div>
    </section>
  );
}
