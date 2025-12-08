import { Clock, AlertTriangle, Users, FileX, ArrowDown } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    problem: "40% du temps perdu",
    description: "Saisie manuelle, copier-coller, vérifications répétitives",
  },
  {
    icon: AlertTriangle,
    problem: "Erreurs coûteuses",
    description: "Retards, litiges et pertes financières évitables",
  },
  {
    icon: FileX,
    problem: "Traitement manuel",
    description: "Factures, contrats, emails lus et saisis à la main",
  },
  {
    icon: Users,
    problem: "Équipes surchargées",
    description: "Talents mobilisés sur des tâches à faible valeur",
  },
];

export function PainPointsSection() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-muted-foreground mb-3">Le problème</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
            Vos équipes méritent mieux.
          </h2>
          <p className="text-muted-foreground">
            Ces situations vous parlent ?
          </p>
        </div>
        
        {/* Pain points grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl bg-card/30 border border-border/30 hover:border-border/60 transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground mb-3" />
                <h3 className="font-medium text-foreground mb-1">{point.problem}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Transition */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span>AETHER résout ça</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
