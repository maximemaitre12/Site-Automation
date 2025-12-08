import { Check } from "lucide-react";

const features = [
  {
    title: "Déploiement en minutes",
    description: "Configurez vos agents IA en quelques clics. Aucune expertise technique requise.",
  },
  {
    title: "Intégrations natives",
    description: "Connectez vos outils existants. Slack, Gmail, Salesforce, et plus de 100 autres.",
  },
  {
    title: "IA supervisée",
    description: "Gardez le contrôle. Validez les actions critiques, ajustez les paramètres en temps réel.",
  },
  {
    title: "Sécurité entreprise",
    description: "Conformité RGPD, chiffrement de bout en bout, hébergement en Europe.",
  },
  {
    title: "Analyses détaillées",
    description: "Suivez les performances de vos automatisations. Mesurez le temps économisé.",
  },
  {
    title: "Support dédié",
    description: "Une équipe d'experts vous accompagne dans le déploiement et l'optimisation.",
  },
];

export function ToolsShowcaseSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Conçu pour l'entreprise
          </h2>
          <p className="text-lg text-muted-foreground">
            Les fonctionnalités dont vous avez besoin pour automatiser à grande échelle.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
