import { FileText, Headphones, Users, FileSearch, Scale, MessageSquare } from "lucide-react";

const useCases = [
  {
    icon: FileText,
    title: "Traitement automatique des factures",
    description: "Extraction, validation et intégration comptable automatisées. Réduisez le temps de traitement de 95%.",
    example: "Une PME traite 500 factures/mois en 2h au lieu de 40h.",
  },
  {
    icon: Headphones,
    title: "Service client automatisé",
    description: "Classification intelligente, réponses automatiques et escalade contextuelle des demandes.",
    example: "Temps de réponse moyen réduit de 24h à 5 minutes.",
  },
  {
    icon: Users,
    title: "Partner & supplier intelligence",
    description: "Enrichissement automatique de vos bases partenaires et fournisseurs avec des données officielles.",
    example: "Qualité des données améliorée de 40% en 30 jours.",
  },
  {
    icon: FileSearch,
    title: "Extraction d'informations métier",
    description: "Analysez contrats, rapports et documents pour en extraire les données critiques automatiquement.",
    example: "Analyse de 1000 contrats en 1h au lieu de 2 semaines.",
  },
  {
    icon: Scale,
    title: "Analyse de conformité",
    description: "Vérification automatique RGPD, détection de risques et génération de rapports d'audit.",
    example: "Audits de conformité réalisés en temps réel.",
  },
  {
    icon: MessageSquare,
    title: "Internal operations assistants",
    description: "Assistants IA pour vos équipes: RH, IT, juridique, opérations. Réponses instantanées basées sur vos procédures.",
    example: "Réduction de 60% des tickets support internes.",
  },
];

export function UseCasesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            <span className="text-gradient">Cas d'usage</span> concrets
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Découvrez comment AETHER transforme les opérations de nos clients
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:bg-card/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <useCase.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{useCase.description}</p>
              
              {/* Example */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-primary/90 italic">
                  💡 {useCase.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
