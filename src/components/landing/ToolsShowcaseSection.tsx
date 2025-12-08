import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Workflow, Bot, Headphones, Users, Shield, TrendingUp,
  ArrowRight, Check, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  features: string[];
  path: string;
  stat: { value: string; label: string };
}

const tools: Tool[] = [
  {
    id: "flow",
    name: "Flow",
    tagline: "Orchestration visuelle",
    description: "Créez des workflows complexes en glisser-déposer. L'IA génère et optimise vos automatisations automatiquement.",
    icon: Workflow,
    gradient: "from-[hsl(280_100%_60%)] to-[hsl(250_100%_60%)]",
    features: ["Éditeur drag & drop", "Génération IA", "100+ intégrations", "Exécution temps réel"],
    path: "/tools/flow",
    stat: { value: "10x", label: "plus rapide" },
  },
  {
    id: "brain",
    name: "Brain",
    tagline: "Intelligence documentaire",
    description: "Un assistant IA qui connaît tous vos documents. Posez des questions naturelles, obtenez des réponses précises.",
    icon: Bot,
    gradient: "from-[hsl(250_100%_60%)] to-[hsl(220_100%_60%)]",
    features: ["Recherche sémantique", "Analyse multi-docs", "Base de connaissances", "Réponses sourcées"],
    path: "/tools/brain",
    stat: { value: "95%", label: "précision" },
  },
  {
    id: "support",
    name: "Support",
    tagline: "Automatisation support",
    description: "Classifiez et répondez aux tickets automatiquement. Réduisez le temps de réponse de 90%.",
    icon: Headphones,
    gradient: "from-[hsl(220_100%_60%)] to-[hsl(180_100%_50%)]",
    features: ["Classification IA", "Réponses auto", "Escalade intelligente", "Analytics avancés"],
    path: "/tools/support",
    stat: { value: "-90%", label: "temps réponse" },
  },
  {
    id: "hr",
    name: "HR",
    tagline: "Recrutement augmenté",
    description: "Analysez les CV, scorez les candidats et matchez-les avec vos offres instantanément.",
    icon: Users,
    gradient: "from-[hsl(180_100%_50%)] to-[hsl(160_84%_39%)]",
    features: ["Parsing CV", "Scoring candidats", "Matching postes", "Génération fiches"],
    path: "/tools/hr",
    stat: { value: "5x", label: "plus de CV traités" },
  },
  {
    id: "compliance",
    name: "Compliance",
    tagline: "Conformité automatisée",
    description: "Auditez vos processus RGPD, détectez les risques et générez des rapports en un clic.",
    icon: Shield,
    gradient: "from-[hsl(160_84%_39%)] to-[hsl(200_100%_50%)]",
    features: ["Audit RGPD", "Détection risques", "Score conformité", "Rapports PDF"],
    path: "/tools/compliance",
    stat: { value: "100%", label: "couverture" },
  },
  {
    id: "sales",
    name: "Sales",
    tagline: "Intelligence commerciale",
    description: "Transcrivez vos appels, analysez le sentiment et générez des propositions commerciales gagnantes.",
    icon: TrendingUp,
    gradient: "from-[hsl(200_100%_50%)] to-[hsl(280_100%_60%)]",
    features: ["Transcription", "Analyse sentiment", "Scoring leads", "Génération proposals"],
    path: "/tools/sales",
    stat: { value: "+35%", label: "conversion" },
  },
];

export function ToolsShowcaseSection() {
  const [activeTool, setActiveTool] = useState<Tool>(tools[0]);

  return (
    <section id="tools" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-[hsl(250_100%_60%/0.2)] mb-6">
            <Sparkles className="w-4 h-4 text-[hsl(250_100%_70%)]" />
            <span className="text-sm font-medium text-foreground">Plateforme unifiée</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Six outils.<br />
            <span className="text-gradient-hero">Une révolution.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Chaque module résout un problème métier précis. Ensemble, ils transforment votre entreprise.
          </p>
        </div>
        
        {/* Tools Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-12">
          {tools.map((tool) => {
            const isActive = tool.id === activeTool.id;
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`relative group text-left p-6 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-secondary/60 border-[hsl(250_100%_60%/0.3)] shadow-lg shadow-[hsl(250_100%_60%/0.1)]"
                    : "bg-card/30 border-border/30 hover:bg-secondary/40 hover:border-border/50"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{tool.stat.value}</div>
                    <div className="text-xs text-muted-foreground">{tool.stat.label}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">AETHER {tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.tagline}</p>
              </button>
            );
          })}
        </div>
        
        {/* Active Tool Detail */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(280_100%_60%/0.1)] via-transparent to-[hsl(220_100%_60%/0.1)] rounded-3xl blur-xl" />
          
          <div className="relative p-8 lg:p-12 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Info */}
              <div>
                <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTool.gradient} items-center justify-center shadow-xl mb-6`}>
                  <activeTool.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  AETHER {activeTool.name}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {activeTool.description}
                </p>
                
                {/* Features */}
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {activeTool.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${activeTool.gradient} flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={activeTool.path}>
                  <Button 
                    size="lg"
                    className={`bg-gradient-to-r ${activeTool.gradient} hover:opacity-90 text-white border-0 shadow-lg`}
                  >
                    Découvrir {activeTool.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {/* Right - Visual */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${activeTool.gradient} opacity-5 rounded-2xl`} />
                <div className="relative p-8 rounded-2xl bg-secondary/30 border border-border/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)] animate-pulse" />
                    <span className="text-sm text-muted-foreground">Aperçu en temps réel</span>
                  </div>
                  
                  {/* Mock UI */}
                  <div className="space-y-4">
                    <div className="h-4 bg-secondary/50 rounded-full w-3/4" />
                    <div className="h-4 bg-secondary/50 rounded-full w-1/2" />
                    <div className="h-24 bg-secondary/30 rounded-xl mt-6" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-16 bg-secondary/40 rounded-lg" />
                      <div className="h-16 bg-secondary/40 rounded-lg" />
                      <div className="h-16 bg-secondary/40 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Floating stat */}
                  <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-xl">
                    <div className="text-2xl font-bold text-foreground">{activeTool.stat.value}</div>
                    <div className="text-xs text-muted-foreground">{activeTool.stat.label}</div>
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
