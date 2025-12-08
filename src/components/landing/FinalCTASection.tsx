import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Démo personnalisée gratuite",
  "Déploiement en 48h",
  "Support dédié",
  "Sans engagement",
];

export function FinalCTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-6">
            Prêt à transformer
            <br />
            <span className="text-gradient">vos opérations ?</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Rejoignez les équipes qui ont déjà automatisé des milliers d'heures de travail répétitif.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-10 py-7 rounded-full font-semibold shadow-2xl shadow-foreground/10"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-10 py-7 rounded-full font-medium border-border/50"
              >
                Essayer gratuitement
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
