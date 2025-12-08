import { 
  Workflow, Bot, Headphones, Users, Shield, TrendingUp
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
}

const tools: Tool[] = [
  {
    name: "Flow",
    description: "Créez des workflows automatisés visuellement. Connectez vos outils, l'IA exécute.",
    icon: Workflow,
  },
  {
    name: "Brain",
    description: "Un assistant qui connaît vos documents. Posez des questions, obtenez des réponses précises.",
    icon: Bot,
  },
  {
    name: "Support",
    description: "Classification et réponse automatique aux tickets. Réduisez le temps de traitement de 90%.",
    icon: Headphones,
  },
  {
    name: "HR",
    description: "Analysez les CV, scorez les candidats et accélérez vos recrutements.",
    icon: Users,
  },
  {
    name: "Compliance",
    description: "Auditez automatiquement vos processus RGPD. Détectez les risques, générez des rapports.",
    icon: Shield,
  },
  {
    name: "Sales",
    description: "Transcription d'appels, analyse du sentiment, génération de propositions commerciales.",
    icon: TrendingUp,
  },
];

export function PainPointsSection() {
  return (
    <section id="product" className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Six outils. Une plateforme.
          </h2>
          <p className="text-lg text-muted-foreground">
            Chaque agent IA résout un problème métier précis. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            return (
              <div key={i} className="group">
                <div className="mb-4">
                  <IconComponent className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
