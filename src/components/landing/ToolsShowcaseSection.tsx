import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Workflow, FileSearch, Bot, Headphones, Users, Shield,
  ArrowRight, CheckCircle2, Zap, MessageSquare, FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    id: "flow",
    name: "AETHER Flow",
    tagline: "Orchestration intelligente",
    description: "Créez des workflows automatisés en quelques clics. Connectez vos outils, ajoutez de l'IA, et laissez le système travailler.",
    icon: Workflow,
    color: "primary",
    features: [
      "Éditeur visuel drag & drop",
      "Génération de workflows par IA",
      "100+ connecteurs (Email, Slack, CRM...)",
      "Exécution en temps réel 24/7",
    ],
    example: {
      title: "Traitement factures",
      steps: ["Email reçu", "Extraction IA", "Validation", "Export ERP"],
    },
    path: "/tools/flow",
  },
  {
    id: "brain",
    name: "AETHER Brain",
    tagline: "Assistant IA interne",
    description: "Un assistant qui connaît tous vos documents. Posez des questions, obtenez des réponses instantanées basées sur vos données.",
    icon: Bot,
    color: "purple",
    features: [
      "Recherche sémantique intelligente",
      "Analyse de documents automatique",
      "Génération de procédures",
      "Base de connaissances vivante",
    ],
    example: {
      title: "Question employé",
      steps: ["Question posée", "Recherche docs", "Réponse IA", "Source citée"],
    },
    path: "/tools/brain",
  },
  {
    id: "support",
    name: "AETHER Support",
    tagline: "Service client automatisé",
    description: "Classifiez, priorisez et répondez aux tickets automatiquement. Réduisez le temps de réponse de 90%.",
    icon: Headphones,
    color: "cyan",
    features: [
      "Classification intelligente",
      "Réponses auto-générées",
      "Escalade contextuelle",
      "Dashboard KPI en temps réel",
    ],
    example: {
      title: "Ticket client",
      steps: ["Ticket reçu", "Classification IA", "Réponse auto", "Résolu"],
    },
    path: "/tools/support",
  },
  {
    id: "hr",
    name: "AETHER HR",
    tagline: "Recrutement augmenté",
    description: "Analysez les CV, scorez les candidats et accélérez vos recrutements avec l'IA.",
    icon: Users,
    color: "green",
    features: [
      "Analyse CV automatique",
      "Matching candidat-poste",
      "Score de compatibilité",
      "Génération fiches de poste",
    ],
    example: {
      title: "Nouveau CV",
      steps: ["CV uploadé", "Extraction IA", "Scoring", "Shortlist"],
    },
    path: "/tools/hr",
  },
  {
    id: "compliance",
    name: "AETHER Compliance",
    tagline: "Conformité automatisée",
    description: "Auditez vos processus RGPD, détectez les risques et générez des rapports de conformité.",
    icon: Shield,
    color: "orange",
    features: [
      "Audit RGPD automatique",
      "Détection de risques",
      "Score de conformité",
      "Rapports PDF exportables",
    ],
    example: {
      title: "Audit process",
      steps: ["Process analysé", "Risques détectés", "Score calculé", "Rapport"],
    },
    path: "/tools/compliance",
  },
  {
    id: "sales",
    name: "AETHER Sales",
    tagline: "Ventes augmentées",
    description: "Analysez vos appels, scorez vos prospects et générez des propositions commerciales.",
    icon: MessageSquare,
    color: "pink",
    features: [
      "Transcription d'appels",
      "Analyse de sentiment",
      "Scoring prospects",
      "Génération de propositions",
    ],
    example: {
      title: "Appel commercial",
      steps: ["Appel enregistré", "Transcription", "Analyse IA", "Actions"],
    },
    path: "/tools/sales",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    gradient: "from-primary to-[hsl(260_100%_65%)]",
  },
  purple: {
    bg: "bg-[hsl(280_100%_60%/0.1)]",
    border: "border-[hsl(280_100%_60%/0.3)]",
    text: "text-[hsl(280_100%_60%)]",
    gradient: "from-[hsl(280_100%_60%)] to-[hsl(320_100%_55%)]",
  },
  cyan: {
    bg: "bg-[hsl(190_100%_50%/0.1)]",
    border: "border-[hsl(190_100%_50%/0.3)]",
    text: "text-[hsl(190_100%_50%)]",
    gradient: "from-[hsl(190_100%_50%)] to-[hsl(170_100%_45%)]",
  },
  green: {
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
    gradient: "from-success to-[hsl(160_76%_55%)]",
  },
  orange: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    gradient: "from-warning to-[hsl(25_100%_55%)]",
  },
  pink: {
    bg: "bg-[hsl(330_100%_60%/0.1)]",
    border: "border-[hsl(330_100%_60%/0.3)]",
    text: "text-[hsl(330_100%_60%)]",
    gradient: "from-[hsl(330_100%_60%)] to-[hsl(350_100%_55%)]",
  },
};

export function ToolsShowcaseSection() {
  const [activeTool, setActiveTool] = useState(tools[0]);
  const colors = colorClasses[activeTool.color as keyof typeof colorClasses];

  return (
    <section id="tools" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">6 outils intégrés</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Une plateforme, <span className="text-gradient">toute l'automatisation</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque outil résout un problème métier concret. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        {/* Tool Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-8 md:mb-12">
          {tools.map((tool) => {
            const isActive = tool.id === activeTool.id;
            const toolColors = colorClasses[tool.color as keyof typeof colorClasses];
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border transition-all duration-300 ${
                  isActive
                    ? `${toolColors.bg} ${toolColors.border} ${toolColors.text}`
                    : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tool.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">{tool.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Active Tool Display */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left - Info */}
          <div className="order-2 lg:order-1">
            <div className={`inline-flex items-center gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full ${colors.bg} border ${colors.border} mb-3 md:mb-4`}>
              <activeTool.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${colors.text}`} />
              <span className={`text-xs md:text-sm font-medium ${colors.text}`}>{activeTool.tagline}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">{activeTool.name}</h3>
            <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">{activeTool.description}</p>
            
            {/* Features */}
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {activeTool.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 md:gap-3">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle2 className={`w-2.5 h-2.5 md:w-3 md:h-3 ${colors.text}`} />
                  </div>
                  <span className="text-sm md:text-base text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to={activeTool.path}>
              <Button variant="hero" size="default" className="md:text-base">
                Découvrir {activeTool.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Right - Visual */}
          <div className="order-1 lg:order-2">
            <div className={`relative rounded-xl md:rounded-2xl border ${colors.border} bg-card/80 backdrop-blur-xl overflow-hidden`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b ${colors.border} bg-gradient-to-r ${colors.gradient} bg-opacity-10`}>
                <div className="flex items-center gap-2">
                  <activeTool.icon className={`w-4 h-4 md:w-5 md:h-5 ${colors.text}`} />
                  <span className="text-xs md:text-sm font-medium text-foreground">{activeTool.example.title}</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full ${colors.bg}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')} animate-pulse`} />
                  <span className={`text-[10px] md:text-xs font-medium ${colors.text}`}>En cours</span>
                </div>
              </div>
              
              {/* Workflow Steps */}
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between gap-1 md:gap-2">
                  {activeTool.example.steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl ${i < 3 ? 'bg-success/10 border-success/30' : colors.bg + ' ' + colors.border} border flex items-center justify-center mb-1.5 md:mb-2`}>
                        {i < 3 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-success" />
                        ) : (
                          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                      <span className="text-[9px] md:text-xs text-center text-muted-foreground max-w-[50px] md:max-w-[70px] line-clamp-2">{step}</span>
                    </div>
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border/30">
                  <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground mb-1.5 md:mb-2">
                    <span>Progression</span>
                    <span className={colors.text}>75%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full w-3/4 bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-500`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glow */}
            <div className={`absolute -inset-4 -z-10 bg-gradient-to-r ${colors.gradient} blur-3xl opacity-20 hidden lg:block`} />
          </div>
        </div>
      </div>
    </section>
  );
}
