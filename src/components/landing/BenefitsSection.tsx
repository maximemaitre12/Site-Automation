import { TrendingDown, Shield, Plug, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Réduction massive des coûts",
    description: "AETHER remplace des dizaines d'heures humaines par des agents IA autonomes, réduisant vos coûts opérationnels de façon significative.",
    highlights: ["Jusqu'à 70% de réduction des coûts", "ROI mesurable en 30 jours", "Scalabilité sans coûts additionnels"],
  },
  {
    icon: Shield,
    title: "Sécurité & conformité Enterprise",
    description: "Infrastructure sécurisée répondant aux exigences les plus strictes des grandes entreprises et réglementations.",
    highlights: ["Conformité RGPD", "Audit logs complets", "Chiffrement de bout en bout", "Permissions granulaires"],
  },
  {
    icon: Plug,
    title: "Intégration simple",
    description: "AETHER se connecte à votre écosystème existant en quelques minutes, sans développement complexe.",
    highlights: ["CRM, ERP, emails", "APIs internes", "Stockage cloud", "Connecteurs prêts à l'emploi"],
  },
];

export function BenefitsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Pourquoi les entreprises <span className="text-gradient">choisissent AETHER</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Une plateforme pensée pour les exigences des organisations modernes
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{benefit.description}</p>
              
              {/* Highlights */}
              <ul className="space-y-2">
                {benefit.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
