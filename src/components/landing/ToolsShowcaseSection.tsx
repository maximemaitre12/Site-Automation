import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Workflow, Bot, Headphones, Users, Shield, TrendingUp,
  ArrowRight, Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  icon: LucideIcon;
  color: string;
  stats: { value: string; label: string }[];
  features: string[];
  path: string;
}

const tools: Tool[] = [
  {
    id: "flow",
    name: "Flow",
    tagline: "Automatisation visuelle",
    problem: "Vos équipes perdent du temps sur des tâches répétitives",
    solution: "Créez des workflows automatisés en glisser-déposer. L'IA exécute, vous supervisez.",
    icon: Workflow,
    color: "from-violet-500 to-purple-600",
    stats: [
      { value: "10x", label: "plus rapide" },
      { value: "0", label: "code requis" },
    ],
    features: ["Éditeur drag & drop", "100+ intégrations", "Exécution temps réel", "Logs détaillés"],
    path: "/tools/flow",
  },
  {
    id: "brain",
    name: "Brain",
    tagline: "IA documentaire",
    problem: "L'information est dispersée, introuvable, inutilisée",
    solution: "Un assistant qui a lu tous vos documents. Posez une question, obtenez LA réponse.",
    icon: Bot,
    color: "from-blue-500 to-cyan-500",
    stats: [
      { value: "95%", label: "précision" },
      { value: "<2s", label: "réponse" },
    ],
    features: ["Recherche sémantique", "Multi-documents", "Sources citées", "Multi-langues"],
    path: "/tools/brain",
  },
  {
    id: "support",
    name: "Support",
    tagline: "Support automatisé",
    problem: "Vos agents sont submergés de tickets répétitifs",
    solution: "L'IA classifie, répond, et escalade intelligemment. -90% de temps de réponse.",
    icon: Headphones,
    color: "from-emerald-500 to-teal-500",
    stats: [
      { value: "-90%", label: "temps réponse" },
      { value: "24/7", label: "disponibilité" },
    ],
    features: ["Classification auto", "Réponses suggérées", "Escalade smart", "Dashboard KPI"],
    path: "/tools/support",
  },
  {
    id: "hr",
    name: "HR",
    tagline: "Recrutement augmenté",
    problem: "Vous croulez sous les CV sans trouver les bons profils",
    solution: "Analyse automatique des CV, scoring, matching avec vos offres. Recrutez 5x plus vite.",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    stats: [
      { value: "5x", label: "plus de CV traités" },
      { value: "87%", label: "matching précis" },
    ],
    features: ["Parsing CV", "Scoring candidats", "Matching offres", "Génération fiches"],
    path: "/tools/hr",
  },
  {
    id: "compliance",
    name: "Compliance",
    tagline: "Conformité auto",
    problem: "L'audit RGPD est un cauchemar coûteux et chronophage",
    solution: "Audit automatique de vos process. Détection des risques. Rapport en 1 clic.",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    stats: [
      { value: "100%", label: "couverture" },
      { value: "1h", label: "vs 1 semaine" },
    ],
    features: ["Scan RGPD", "Score conformité", "Détection risques", "Rapports PDF"],
    path: "/tools/compliance",
  },
  {
    id: "sales",
    name: "Sales",
    tagline: "Vente augmentée",
    problem: "Vos commerciaux perdent du temps sur l'admin au lieu de vendre",
    solution: "Transcription d'appels, analyse sentiment, propositions générées automatiquement.",
    icon: TrendingUp,
    color: "from-pink-500 to-fuchsia-500",
    stats: [
      { value: "+35%", label: "conversion" },
      { value: "30s", label: "proposition" },
    ],
    features: ["Transcription", "Analyse sentiment", "Scoring leads", "Génération auto"],
    path: "/tools/sales",
  },
];

export function ToolsShowcaseSection() {
  const [activeTool, setActiveTool] = useState<Tool>(tools[0]);

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border mb-6">
            <span className="text-sm font-medium text-[hsl(250_100%_45%)]">6 outils, 1 plateforme</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Chaque problème a <span className="text-gradient">son agent IA.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Cliquez sur un outil pour découvrir comment il transforme votre quotidien.
          </p>
        </div>
        
        {/* Tool selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tools.map((tool) => {
            const isActive = tool.id === activeTool.id;
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-white text-foreground border-border hover:border-[hsl(250_100%_70%)]"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{tool.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Active tool detail */}
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xl">
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${activeTool.color} items-center justify-center mb-6`}>
                <activeTool.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                AETHER {activeTool.name}
              </h3>
              <p className="text-lg text-[hsl(250_100%_55%)] font-medium mb-4">{activeTool.tagline}</p>
              
              <div className="mb-6">
                <p className="text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Le problème :</span> {activeTool.problem}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">La solution :</span> {activeTool.solution}
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-6 mb-8">
                {activeTool.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Features */}
              <ul className="grid grid-cols-2 gap-2 mb-8">
                {activeTool.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[hsl(160_84%_39%)]" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={activeTool.path}>
                <Button className={`bg-gradient-to-r ${activeTool.color} hover:opacity-90 text-white rounded-full`}>
                  Essayer {activeTool.name} gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Right - Visual */}
            <div className={`bg-gradient-to-br ${activeTool.color} p-8 lg:p-12 flex items-center justify-center`}>
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="flex-1 h-2 bg-white/20 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-4 bg-white/20 rounded w-1/2" />
                  <div className="h-20 bg-white/10 rounded-lg mt-4" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-white/30 rounded-lg flex-1" />
                    <div className="h-8 bg-white/20 rounded-lg flex-1" />
                  </div>
                </div>
                
                {/* Floating stats */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-2xl p-4 hidden lg:block">
                  <div className="text-2xl font-bold text-foreground">{activeTool.stats[0].value}</div>
                  <div className="text-xs text-muted-foreground">{activeTool.stats[0].label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
