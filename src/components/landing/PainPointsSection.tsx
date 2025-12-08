import { 
  Workflow, Bot, Headphones, Users, Shield, TrendingUp
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const tools: Tool[] = [
  {
    name: "Flow",
    tagline: "Workflows intelligents",
    description: "Créez des automatisations visuellement. Connectez vos outils, l'IA décide et exécute.",
    icon: Workflow,
    color: "bg-blue-500",
  },
  {
    name: "Brain",
    tagline: "Mémoire d'entreprise",
    description: "Un assistant qui connaît vos documents. Posez des questions, obtenez des réponses précises.",
    icon: Bot,
    color: "bg-violet-500",
  },
  {
    name: "Support",
    tagline: "Support automatisé",
    description: "Classification et réponse automatique aux tickets. Réduisez le temps de traitement de 90%.",
    icon: Headphones,
    color: "bg-emerald-500",
  },
  {
    name: "HR",
    tagline: "Recrutement accéléré",
    description: "Analysez les CV, scorez les candidats et accélérez vos recrutements.",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    name: "Compliance",
    tagline: "Conformité RGPD",
    description: "Auditez automatiquement vos processus. Détectez les risques, générez des rapports.",
    icon: Shield,
    color: "bg-rose-500",
  },
  {
    name: "Sales",
    tagline: "Ventes augmentées",
    description: "Transcription d'appels, analyse du sentiment, génération de propositions commerciales.",
    icon: TrendingUp,
    color: "bg-cyan-500",
  },
];

export function PainPointsSection() {
  return (
    <section id="product" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Six agents IA. Une révolution.
          </h2>
          <p className="text-lg text-muted-foreground">
            Chaque agent résout un problème métier précis. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            return (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-5`}>
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                  {tool.tagline}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  AETHER {tool.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
