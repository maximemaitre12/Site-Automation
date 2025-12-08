import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const metrics = [
  { value: "70%", label: "Moins de tâches manuelles" },
  { value: "120h", label: "Économisées par équipe/mois" },
  { value: "99.7%", label: "Précision IA" },
  { value: "<30j", label: "Retour sur investissement" },
];

export function ResultsSection() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3">Impact mesurable</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Des résultats concrets.
          </h2>
          <p className="text-muted-foreground">
            Métriques vérifiables dès les premières semaines.
          </p>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {metrics.map((metric, i) => (
            <div 
              key={i}
              className="p-6 md:p-8 rounded-xl bg-card/50 border border-border/30 text-center hover:border-border/60 transition-colors"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gradient mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="p-8 md:p-10 rounded-2xl bg-secondary/30 border border-border/30">
            <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-6">
              "AETHER a transformé notre façon de travailler. Ce qui prenait des jours 
              se fait maintenant en heures."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(280_100%_60%)] flex items-center justify-center text-sm font-semibold text-white">
                MD
              </div>
              <div>
                <p className="font-medium text-foreground">Marie Dupont</p>
                <p className="text-sm text-muted-foreground">COO, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6"
            >
              Obtenir ces résultats
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
