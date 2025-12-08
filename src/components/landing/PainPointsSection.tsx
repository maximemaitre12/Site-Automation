import { Clock, AlertTriangle, Users, FileX, ArrowDown, Zap } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    problem: "40% du temps gaspillé",
    description: "Saisie manuelle, copier-coller, vérifications répétitives qui tuent la productivité.",
  },
  {
    icon: AlertTriangle,
    problem: "Erreurs coûteuses",
    description: "Retards, litiges et pertes financières causés par les erreurs humaines évitables.",
  },
  {
    icon: FileX,
    problem: "Traitement manuel",
    description: "Factures, contrats, emails lus et traités à la main, créant des goulots d'étranglement.",
  },
  {
    icon: Users,
    problem: "Talents sous-utilisés",
    description: "Vos meilleurs éléments perdent leur temps sur des tâches à faible valeur ajoutée.",
  },
];

export function PainPointsSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Vos équipes méritent
            <br />
            <span className="text-gradient-hero">mieux que ça.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ces situations vous parlent ?
          </p>
        </div>
        
        {/* Pain points grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {painPoints.map((point, i) => {
            const IconComponent = point.icon;
            return (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-card/30 border border-[hsl(0_72%_51%/0.1)] hover:border-[hsl(0_72%_51%/0.2)] transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(0_72%_51%/0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(0_72%_51%/0.15)] transition-colors">
                    <IconComponent className="w-7 h-7 text-[hsl(0_72%_51%)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{point.problem}</h3>
                    <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Transition to solution */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(280_100%_60%/0.1)] via-[hsl(250_100%_60%/0.1)] to-[hsl(220_100%_60%/0.1)] border border-[hsl(250_100%_60%/0.2)]">
            <Zap className="w-5 h-5 text-[hsl(250_100%_70%)]" />
            <span className="font-medium text-foreground">AETHER élimine tous ces problèmes</span>
            <ArrowDown className="w-4 h-4 text-[hsl(250_100%_70%)] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
