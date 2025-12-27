import { Check, Zap, Shield, Globe, BarChart3, Users, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Déploiement en minutes",
    description: "Configurez vos agents IA en quelques clics. Aucune expertise technique requise.",
  },
  {
    icon: Globe,
    title: "Intégrations natives",
    description: "Connectez vos outils existants. Slack, Gmail, Salesforce et 100+ autres.",
  },
  {
    icon: Shield,
    title: "IA supervisée",
    description: "Gardez le contrôle. Validez les actions critiques, ajustez les paramètres en temps réel.",
  },
  {
    icon: Users,
    title: "Sécurité entreprise",
    description: "Conforme RGPD, chiffrement de bout en bout, hébergé en Europe.",
  },
  {
    icon: BarChart3,
    title: "Analytics détaillées",
    description: "Suivez la performance de vos automatisations. Mesurez le temps gagné.",
  },
  {
    icon: Headphones,
    title: "Support dédié",
    description: "Une équipe d'experts vous accompagne dans le déploiement et l'optimisation.",
  },
];

export function ToolsShowcaseSection() {
  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Conçu pour l'entreprise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Les fonctionnalités dont vous avez besoin pour automatiser à grande échelle.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-12 sm:gap-y-10">
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div key={i} className="group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
