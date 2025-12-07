import { TrendingUp, Clock, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const results = [
  {
    metric: "–70%",
    label: "Tâches manuelles",
    description: "Automatisation complète des processus répétitifs",
    icon: TrendingUp,
  },
  {
    metric: "120h",
    label: "Économisées/mois",
    description: "Par équipe grâce à l'IA",
    icon: Clock,
  },
  {
    metric: "99.7%",
    label: "Précision",
    description: "Moins d'erreurs que le traitement manuel",
    icon: CheckCircle2,
  },
  {
    metric: "30j",
    label: "ROI positif",
    description: "Retour sur investissement rapide",
    icon: Zap,
  },
];

const testimonial = {
  quote: "AETHER a transformé notre gestion des factures. Ce qui prenait 2 jours se fait maintenant en 2 heures, sans erreur.",
  author: "Marie Dupont",
  role: "DAF, Entreprise Tech",
  image: null,
};

export function ResultsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Résultats prouvés</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Des résultats <span className="text-gradient">mesurables</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos clients voient des améliorations concrètes dès les premières semaines
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {results.map((result, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <result.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{result.metric}</div>
              <div className="text-sm font-semibold text-foreground mb-1">{result.label}</div>
              <div className="text-xs text-muted-foreground">{result.description}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-primary to-[hsl(260_100%_65%)] rounded-full" />
            <div>
              <p className="text-lg md:text-xl text-foreground mb-4 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">MD</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/demo">
            <Button variant="hero" size="xl">
              Obtenez ces résultats
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
