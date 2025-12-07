import { X, ArrowRight, Clock, AlertTriangle, Users, FileX } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    problem: "Heures perdues sur des tâches répétitives",
    description: "Vos équipes passent 40% de leur temps sur la saisie manuelle, le copier-coller et les vérifications",
  },
  {
    icon: AlertTriangle,
    problem: "Erreurs humaines coûteuses",
    description: "Les erreurs de saisie et les oublis génèrent des retards, des litiges et des pertes financières",
  },
  {
    icon: FileX,
    problem: "Documents traités manuellement",
    description: "Factures, contrats, emails — tout est lu et saisi à la main, créant des goulots d'étranglement",
  },
  {
    icon: Users,
    problem: "Équipes surchargées",
    description: "Vos talents passent leur temps sur des tâches à faible valeur au lieu de se concentrer sur la stratégie",
  },
];

export function PainPointsSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-destructive/[0.02]">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <X className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
            <span className="text-xs md:text-sm font-medium text-destructive">Les problèmes qu'on résout</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Vous reconnaissez ces situations ?
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-card/50 border border-destructive/10 hover:border-destructive/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/15 transition-colors">
                <point.icon className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{point.problem}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Transition */}
        <div className="flex items-center justify-center mt-8 md:mt-12">
          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs md:text-sm font-medium text-primary">AETHER élimine ces problèmes</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
