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
    <section id="features" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
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
            <div key={i}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-background" strokeWidth={2.5} />
                </div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
