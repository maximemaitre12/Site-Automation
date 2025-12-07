import { TrendingDown, Clock, Rocket } from "lucide-react";

const metrics = [
  {
    icon: TrendingDown,
    value: "–70%",
    label: "de tâches manuelles",
    description: "Éliminez les opérations répétitives grâce à l'automatisation intelligente",
  },
  {
    icon: Clock,
    value: "120h",
    label: "économisées / mois / équipe",
    description: "Libérez vos équipes pour des tâches à haute valeur ajoutée",
  },
  {
    icon: Rocket,
    value: "30-60",
    label: "jours pour un ROI positif",
    description: "Retour sur investissement mesurable dès le premier mois",
  },
];

export function MetricsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-secondary/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Des <span className="text-gradient">gains mesurables</span> pour votre entreprise
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            AETHER remplace les opérations répétitives, standardise les process, 
            et crée des agents IA qui travaillent pour vous, 24/7.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <metric.icon className="w-7 h-7 text-primary" />
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-3">
                  {metric.label}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
