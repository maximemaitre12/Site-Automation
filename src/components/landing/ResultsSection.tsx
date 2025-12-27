import { TrendingUp, Clock, Target, Zap } from "lucide-react";

const stats = [
  { 
    icon: Clock,
    value: "80%", 
    label: "Temps gagné",
    description: "Réduction du temps sur les tâches répétitives" 
  },
  { 
    icon: TrendingUp,
    value: "3x", 
    label: "Productivité",
    description: "Augmentation de la productivité des équipes" 
  },
  { 
    icon: Target,
    value: "95%", 
    label: "Précision",
    description: "Taux de précision sur les tâches automatisées" 
  },
  { 
    icon: Zap,
    value: "<4 sem", 
    label: "ROI rapide",
    description: "Retour sur investissement en quelques semaines" 
  },
];

export function ResultsSection() {
  return (
    <section id="results" className="py-16 sm:py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Des résultats mesurables
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Transformez vos opérations et mesurez l'impact dès le premier jour.
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="text-center p-6 sm:p-8 rounded-2xl bg-background border border-border hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Value proposition */}
        <div className="max-w-3xl mx-auto text-center px-2">
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-snug mb-6 sm:mb-8">
            "Rejoignez les entreprises qui transforment leurs opérations grâce à l'automatisation intelligente."
          </p>
        </div>
      </div>
    </section>
  );
}
