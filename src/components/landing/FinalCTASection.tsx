import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Démo personnalisée gratuite",
  "Déploiement en 48h",
  "Support premium inclus",
  "Sans engagement",
];

export function FinalCTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[hsl(250_100%_60%/0.1)] to-transparent blur-[100px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-[hsl(250_100%_60%/0.2)] mb-8">
            <Sparkles className="w-4 h-4 text-[hsl(250_100%_70%)]" />
            <span className="text-sm font-medium text-foreground">Commencez dès aujourd'hui</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-6">
            Prêt à<br />
            <span className="text-gradient-hero">révolutionner</span><br />
            vos opérations ?
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Rejoignez les entreprises qui ont automatisé des milliers d'heures de travail répétitif et multiplié leur productivité.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="h-16 px-10 text-lg bg-gradient-to-r from-[hsl(280_100%_60%)] via-[hsl(250_100%_60%)] to-[hsl(220_100%_60%)] hover:from-[hsl(280_100%_65%)] hover:via-[hsl(250_100%_65%)] hover:to-[hsl(220_100%_65%)] text-white border-0 shadow-2xl shadow-[hsl(250_100%_60%/0.4)] transition-all duration-300 hover:shadow-[hsl(250_100%_60%/0.6)] hover:scale-105"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 px-10 text-lg border-border/50 bg-secondary/30 hover:bg-secondary/50"
              >
                Demander une démo
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[hsl(160_84%_39%/0.2)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[hsl(160_84%_50%)]" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
