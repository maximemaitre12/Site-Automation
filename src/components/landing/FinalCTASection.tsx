import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Calendar, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const guarantees = [
  "Démo personnalisée gratuite",
  "Déploiement en 48h",
  "Support dédié inclus",
  "Sans engagement",
];

export function FinalCTASection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/10 rounded-full blur-[150px] md:blur-[200px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 animate-fade-in">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <span className="text-xs md:text-sm font-medium text-primary">Réponse sous 24h garantie</span>
        </div>
        
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Prêt à <span className="text-gradient">automatiser</span> vos opérations ?
        </h2>
        
        {/* Subheadline */}
        <p className="text-sm md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Rejoignez les entreprises qui économisent des centaines d'heures chaque mois. 
          Un expert AETHER vous présente les solutions adaptées à vos besoins.
        </p>
        
        {/* CTA Button */}
        <div className="mb-8 md:mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/demo">
            <Button variant="hero" size="lg" className="text-sm md:text-lg px-6 md:px-10 py-5 md:py-7">
              <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Demander ma démo gratuite
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {guarantees.map((guarantee, index) => (
            <div key={index} className="flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-success flex-shrink-0" />
              <span className="text-xs md:text-sm text-muted-foreground">{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
