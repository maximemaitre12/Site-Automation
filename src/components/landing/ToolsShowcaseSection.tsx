import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Workflow, Bot, Headphones, Users, Shield, TrendingUp,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    id: "flow",
    name: "Flow",
    description: "Orchestration visuelle de workflows. Glissez-déposez, connectez, automatisez.",
    icon: Workflow,
    color: "from-blue-500 to-cyan-500",
    features: ["Éditeur visuel", "Génération IA", "100+ connecteurs"],
    path: "/tools/flow",
  },
  {
    id: "brain",
    name: "Brain",
    description: "Assistant qui connaît vos documents. Posez des questions, obtenez des réponses.",
    icon: Bot,
    color: "from-violet-500 to-purple-500",
    features: ["Recherche sémantique", "Analyse documents", "Base connaissances"],
    path: "/tools/brain",
  },
  {
    id: "support",
    name: "Support",
    description: "Classification et réponse automatique aux tickets. -90% temps de réponse.",
    icon: Headphones,
    color: "from-emerald-500 to-teal-500",
    features: ["Classification IA", "Réponses auto", "Analytics temps réel"],
    path: "/tools/support",
  },
  {
    id: "hr",
    name: "HR",
    description: "Analyse de CV, scoring candidats, matching intelligent avec vos offres.",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    features: ["Analyse CV", "Scoring", "Matching postes"],
    path: "/tools/hr",
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Audit RGPD automatisé. Détection des risques, génération de rapports.",
    icon: Shield,
    color: "from-rose-500 to-pink-500",
    features: ["Audit RGPD", "Score conformité", "Rapports PDF"],
    path: "/tools/compliance",
  },
  {
    id: "sales",
    name: "Sales",
    description: "Transcription d'appels, analyse sentiment, génération de propositions.",
    icon: TrendingUp,
    color: "from-indigo-500 to-blue-500",
    features: ["Transcription", "Sentiment", "Propositions"],
    path: "/tools/sales",
  },
];

export function ToolsShowcaseSection() {
  const [activeTool, setActiveTool] = useState(tools[0]);

  return (
    <section id="tools" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-primary mb-3">Plateforme</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Six outils. Une mission.
          </h2>
          <p className="text-muted-foreground">
            Chaque module résout un problème métier précis. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Tool list */}
          <div className="lg:col-span-2 space-y-2">
            {tools.map((tool) => {
              const isActive = tool.id === activeTool.id;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "bg-secondary/80 border-border"
                      : "bg-transparent border-transparent hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium mb-0.5 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {tool.name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Active tool display */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Tool header */}
              <div className="p-6 border-b border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center`}>
                    <activeTool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">AETHER {activeTool.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground">{activeTool.description}</p>
              </div>
              
              {/* Features */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeTool.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-secondary/50 text-sm text-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link to={activeTool.path}>
                  <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                    Découvrir {activeTool.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {/* Visual mockup */}
              <div className="mx-6 mb-6 p-4 rounded-xl bg-secondary/30 border border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Aperçu en temps réel</span>
                </div>
                <div className="h-32 bg-gradient-to-br from-secondary/50 to-background rounded-lg flex items-center justify-center">
                  <activeTool.icon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
