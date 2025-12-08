import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const metrics = [
  { value: "70%", label: "Réduction tâches manuelles", description: "Automatisation intelligente" },
  { value: "120h", label: "Économisées par mois", description: "Par équipe en moyenne" },
  { value: "99.7%", label: "Précision des traitements", description: "IA supervisée" },
  { value: "<30j", label: "Retour sur investissement", description: "Amortissement rapide" },
];

const testimonials = [
  {
    quote: "AETHER a transformé notre façon de travailler. Ce qui prenait des jours se fait maintenant en quelques heures, avec une précision remarquable.",
    author: "Marie Dupont",
    role: "Directrice des Opérations",
    company: "TechCorp France",
    avatar: "MD",
  },
  {
    quote: "On a automatisé 80% de notre traitement de factures. L'équipe peut enfin se concentrer sur des tâches à forte valeur ajoutée.",
    author: "Thomas Martin",
    role: "CFO",
    company: "InnovateSAS",
    avatar: "TM",
  },
];

export function ResultsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(250_100%_60%/0.03)] to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(250_100%_60%/0.05)] rounded-full blur-[200px]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Des résultats<br />
            <span className="text-gradient-hero">mesurables.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Impact concret dès les premières semaines d'utilisation.
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card/30 border border-border/30 hover:border-[hsl(250_100%_60%/0.3)] transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(250_100%_60%/0.05)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280_100%_60%/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-hero mb-2">
                  {metric.value}
                </div>
                <p className="text-foreground font-medium mb-1">{metric.label}</p>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 lg:p-10 rounded-2xl bg-card/50 border border-border/30"
            >
              <Quote className="w-10 h-10 text-[hsl(250_100%_60%/0.3)] mb-6" />
              
              <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(280_100%_60%)] to-[hsl(250_100%_60%)] flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link to="/demo">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-gradient-to-r from-[hsl(280_100%_60%)] via-[hsl(250_100%_60%)] to-[hsl(220_100%_60%)] hover:from-[hsl(280_100%_65%)] hover:via-[hsl(250_100%_65%)] hover:to-[hsl(220_100%_65%)] text-white border-0 shadow-2xl shadow-[hsl(250_100%_60%/0.3)]"
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
