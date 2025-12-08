import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Bot, Workflow, Headphones, Users, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  { icon: Workflow, name: "Flow", desc: "Automatisez vos workflows" },
  { icon: Bot, name: "Brain", desc: "Assistant IA documentaire" },
  { icon: Headphones, name: "Support", desc: "Tickets auto-répondus" },
  { icon: Users, name: "HR", desc: "Recrutement accéléré" },
  { icon: Shield, name: "Compliance", desc: "Audit RGPD automatique" },
  { icon: TrendingUp, name: "Sales", desc: "Propositions générées" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background pt-16">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(250_50%_98%)] via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[hsl(250_100%_95%)] rounded-full blur-[120px] opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto px-6 pt-20 md:pt-32">
        {/* Main content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(250_100%_95%)] border border-[hsl(250_100%_90%)] mb-6 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-[hsl(160_84%_39%)]" />
            <span className="text-sm font-medium text-[hsl(250_100%_45%)]">+2,000 entreprises automatisées</span>
          </div>
          
          {/* Headline - Clear & Direct */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up-delay-1">
            <span className="text-foreground">6 outils IA.</span>
            <br />
            <span className="text-foreground">1 plateforme.</span>
            <br />
            <span className="text-gradient">Zéro code.</span>
          </h1>
          
          {/* Value prop - Crystal clear */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-2">
            Support client, RH, ventes, compliance — <span className="text-foreground font-semibold">automatisez tout</span> avec des agents IA déployables en 5 minutes.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up-delay-3">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base bg-gradient-to-r from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] hover:from-[hsl(280_100%_50%)] hover:to-[hsl(250_100%_50%)] text-white rounded-full btn-glow"
              >
                Démarrer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base rounded-full border-border"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Voir la démo (2 min)
              </Button>
            </a>
          </div>
          
          {/* Trust */}
          <p className="text-sm text-muted-foreground animate-fade-up-delay-4">
            Gratuit pour commencer • Sans carte bancaire • Déploiement en 5 min
          </p>
        </div>
        
        {/* The 6 tools - Visual proof of the platform */}
        <div className="animate-fade-up-delay-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            TOUT CE DONT VOUS AVEZ BESOIN, EN UNE SEULE PLATEFORME
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
            {tools.map((tool, i) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={i}
                  className="group p-4 rounded-2xl bg-white border border-border hover:border-[hsl(250_100%_80%)] hover:shadow-lg hover:shadow-[hsl(250_100%_60%/0.1)] transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(280_100%_95%)] to-[hsl(250_100%_95%)] flex items-center justify-center mb-3 group-hover:from-[hsl(280_100%_55%)] group-hover:to-[hsl(250_100%_55%)] transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-[hsl(250_100%_55%)] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Product Preview */}
        <div className="relative animate-fade-up-delay-4">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          
          <div className="card-elevated rounded-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[hsl(0_84%_70%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(45_100%_60%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(160_84%_50%)]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground">
                  app.aether.ai
                </div>
              </div>
            </div>
            
            {/* Dashboard mockup */}
            <div className="p-6 bg-secondary/20">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Tâches auto", value: "12,847", change: "+23%" },
                  { label: "Heures économisées", value: "847h", change: "ce mois" },
                  { label: "Précision IA", value: "99.7%", change: "" },
                  { label: "Agents actifs", value: "6", change: "tous opérationnels" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-background border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    {stat.change && <p className="text-xs text-[hsl(160_84%_39%)]">{stat.change}</p>}
                  </div>
                ))}
              </div>
              
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] flex items-center justify-center">
                      <Workflow className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Traitement automatique des factures</p>
                      <p className="text-xs text-muted-foreground">En cours d'exécution...</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[hsl(160_84%_39%)]">75%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social proof */}
      <div className="relative z-10 py-12 border-t border-border bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-6">Adopté par des équipes innovantes</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Doctolib", "Qonto", "Alan", "Swile", "Payfit"].map((company) => (
              <span key={company} className="text-lg font-semibold text-muted-foreground/60">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
