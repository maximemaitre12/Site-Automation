import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Démo gratuite",
  "Déploiement 48h",
  "Support dédié",
  "Sans engagement",
];

export function FinalCTASection() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Prêt à automatiser ?
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Rejoignez les équipes qui ont automatisé des milliers d'heures de travail.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-sm px-6 h-12 rounded-lg font-medium"
              >
                Démarrer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-sm px-6 h-12 rounded-lg font-medium border-border/50 bg-transparent hover:bg-secondary/50"
              >
                Demander une démo
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
