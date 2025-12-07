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
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Réponse sous 24h garantie</span>
        </div>
        
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Prêt à <span className="text-gradient">automatiser</span> vos opérations ?
        </h2>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Rejoignez les entreprises qui économisent des centaines d'heures chaque mois. 
          Un expert AETHER vous présente les solutions adaptées à vos besoins.
        </p>
        
        {/* CTA Button */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/demo">
            <Button variant="hero" size="xl" className="text-lg px-10 py-7">
              <Zap className="w-5 h-5 mr-2" />
              Demander ma démo gratuite
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {guarantees.map((guarantee, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
