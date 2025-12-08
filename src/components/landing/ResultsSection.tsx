import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const metrics = [
  { value: "70%", label: "Réduction des tâches manuelles", description: "Automatisation intelligente" },
  { value: "120h", label: "Économisées par mois", description: "Par équipe en moyenne" },
  { value: "99.7%", label: "Précision des traitements", description: "IA supervisée" },
  { value: "<30j", label: "Retour sur investissement", description: "Amortissement rapide" },
];

export function ResultsSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Résultats mesurables
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            L'impact est concret
          </h2>
          <p className="text-lg text-muted-foreground">
            Des métriques vérifiables dès les premières semaines d'utilisation.
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group text-center p-8 lg:p-10 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all duration-500"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-3 tracking-tight">
                {metric.value}
              </div>
              <p className="text-sm md:text-base font-semibold text-foreground mb-1">
                {metric.label}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 lg:p-12 rounded-2xl lg:rounded-3xl bg-secondary/30 border border-border/30">
            {/* Quote Mark */}
            <div className="absolute -top-4 left-10 text-6xl text-primary/20 font-serif">"</div>
            
            <blockquote className="relative z-10">
              <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-light leading-relaxed mb-8">
                AETHER a transformé notre façon de travailler. Ce qui prenait des jours 
                se fait maintenant en quelques heures, <span className="text-primary font-medium">avec une précision remarquable.</span>
              </p>
              
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center text-primary-foreground font-bold">
                  MD
                </div>
                <div>
                  <p className="font-semibold text-foreground">Marie Dupont</p>
                  <p className="text-sm text-muted-foreground">Directrice des Opérations, TechCorp</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold px-8"
            >
              Obtenez ces résultats
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
