import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Essai gratuit 14 jours",
  "Sans carte bancaire",
  "Déploiement en 5 min",
  "Support inclus",
];

export function FinalCTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280_100%_55%)] via-[hsl(250_100%_55%)] to-[hsl(220_100%_55%)]" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Rejoignez 2,000+ entreprises</span>
        </div>
        
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          Prêt à automatiser
          <br />
          votre entreprise ?
        </h2>
        
        {/* Subtitle */}
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Déployez vos premiers agents IA en 5 minutes. 
          Voyez les résultats dès le premier jour.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg bg-white text-[hsl(250_100%_45%)] hover:bg-white/90 rounded-full font-semibold shadow-2xl"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold"
            >
              Demander une démo
            </Button>
          </Link>
        </div>
        
        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span className="text-white/90">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
