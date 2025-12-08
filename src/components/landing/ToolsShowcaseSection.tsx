import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Workflow, Bot, Headphones, Users, Shield, MessageSquare,
  ArrowRight, Check
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    id: "flow",
    name: "Flow",
    fullName: "AETHER Flow",
    description: "Orchestrez des workflows complexes en glisser-déposer. L'IA génère et optimise vos automatisations.",
    icon: Workflow,
    features: ["Éditeur visuel", "Génération IA", "100+ intégrations", "Temps réel"],
    path: "/tools/flow",
  },
  {
    id: "brain",
    name: "Brain",
    fullName: "AETHER Brain",
    description: "Un assistant qui connaît tous vos documents. Questions en langage naturel, réponses instantanées.",
    icon: Bot,
    features: ["Recherche sémantique", "Analyse de docs", "Base de connaissances", "Multi-langues"],
    path: "/tools/brain",
  },
  {
    id: "support",
    name: "Support",
    fullName: "AETHER Support",
    description: "Classifiez et répondez aux tickets automatiquement. Réduisez le temps de réponse de 90%.",
    icon: Headphones,
    features: ["Classification IA", "Réponses auto", "Escalade smart", "Analytics"],
    path: "/tools/support",
  },
  {
    id: "hr",
    name: "HR",
    fullName: "AETHER HR",
    description: "Analysez les CV, scorez les candidats et accélérez vos recrutements avec l'IA.",
    icon: Users,
    features: ["Analyse CV", "Matching", "Scoring", "Génération fiches"],
    path: "/tools/hr",
  },
  {
    id: "compliance",
    name: "Compliance",
    fullName: "AETHER Compliance",
    description: "Auditez vos processus RGPD, détectez les risques et générez des rapports automatiquement.",
    icon: Shield,
    features: ["Audit RGPD", "Détection risques", "Score conformité", "Rapports PDF"],
    path: "/tools/compliance",
  },
  {
    id: "sales",
    name: "Sales",
    fullName: "AETHER Sales",
    description: "Transcrivez vos appels, analysez le sentiment et générez des propositions commerciales.",
    icon: MessageSquare,
    features: ["Transcription", "Analyse sentiment", "Scoring", "Génération"],
    path: "/tools/sales",
  },
];

export function ToolsShowcaseSection() {
  const [activeTool, setActiveTool] = useState(tools[0]);

  return (
    <section id="tools" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Plateforme unifiée
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Six outils, un seul objectif
          </h2>
          <p className="text-lg text-muted-foreground">
            Chaque module résout un problème métier précis. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        {/* Tool Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 lg:mb-16">
          {tools.map((tool) => {
            const isActive = tool.id === activeTool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Active Tool Display */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Info */}
            <div className="order-2 lg:order-1">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {activeTool.fullName}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {activeTool.description}
                </p>
              </div>
              
              {/* Features */}
              <ul className="grid grid-cols-2 gap-3 mb-8">
                {activeTool.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={activeTool.path}>
                <Button 
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold"
                >
                  Explorer {activeTool.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Right - Visual */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-[hsl(260_100%_65%/0.05)]" />
                
                {/* Icon Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Orbiting dots */}
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-primary/30"
                        style={{
                          top: `${50 + 45 * Math.sin((i * Math.PI) / 2)}%`,
                          left: `${50 + 45 * Math.cos((i * Math.PI) / 2)}%`,
                          transform: "translate(-50%, -50%)",
                          animation: `orbit 8s linear infinite`,
                          animationDelay: `${i * 2}s`,
                        }}
                      />
                    ))}
                    
                    {/* Center Icon */}
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center shadow-2xl shadow-primary/20">
                      <activeTool.icon className="w-16 h-16 lg:w-20 lg:h-20 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
