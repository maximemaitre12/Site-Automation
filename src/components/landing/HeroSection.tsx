import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[hsl(280_100%_60%/0.06)] rounded-full blur-[100px]" />
      
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">v2.0 disponible</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 animate-fade-up-delay-1">
            <span className="text-foreground">Automatisation IA</span>
            <br />
            <span className="text-gradient">pour entreprises.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-2">
            Déployez des agents IA en minutes, pas en mois. 
            Support, RH, Ventes, Compliance — une plateforme unifiée.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-fade-up-delay-3">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-sm px-6 h-11 rounded-lg font-medium"
              >
                Démarrer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#tools">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-sm px-6 h-11 rounded-lg font-medium border-border/50 bg-transparent hover:bg-secondary/50"
              >
                Voir la démo
              </Button>
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="animate-fade-up-delay-4">
            <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-4">
              Adopté par des équipes innovantes
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              {["Doctolib", "Qonto", "Alan", "Payfit", "Pennylane"].map((company) => (
                <span 
                  key={company} 
                  className="text-sm font-medium text-foreground"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-up-delay-4">
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-secondary/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border/60" />
                <div className="w-3 h-3 rounded-full bg-border/60" />
                <div className="w-3 h-3 rounded-full bg-border/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                  app.aether.ai
                </div>
              </div>
              <div className="w-16" />
            </div>
            
            {/* Dashboard preview */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Automatisations", value: "12,847", trend: "+23%" },
                  { label: "Heures économisées", value: "847h", trend: "ce mois" },
                  { label: "Précision IA", value: "99.7%", trend: "moyenne" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/20">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl md:text-2xl font-semibold text-foreground">{stat.value}</span>
                      <span className="text-xs text-success">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Workflow preview */}
              <div className="p-4 rounded-lg bg-secondary/20 border border-border/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-sm bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Traitement factures</p>
                      <p className="text-xs text-muted-foreground">En exécution</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-success">75%</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-[hsl(280_100%_60%)] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
