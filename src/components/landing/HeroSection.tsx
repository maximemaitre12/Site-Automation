import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Bot, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/8 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[hsl(260_100%_65%/0.1)] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220_30%_25%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_30%_25%/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center max-w-6xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Plateforme d'automatisation IA Enterprise</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-foreground">Automatisez </span>
          <span className="text-gradient">90% de vos processus.</span>
          <br className="hidden sm:block" />
          <span className="text-foreground">Déployez des </span>
          <span className="text-gradient">agents IA</span>
          <span className="text-foreground"> en quelques minutes.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
          AETHER transforme vos opérations, réduit drastiquement vos coûts, 
          et libère votre équipe des tâches manuelles répétitives.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/demo">
            <Button variant="hero" size="xl" className="min-w-[220px]">
              Demander une démo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="#features">
            <Button variant="outline" size="xl" className="min-w-[220px] bg-background/50 backdrop-blur-sm border-border/50 hover:bg-secondary/50">
              <Play className="w-4 h-4 mr-2" />
              Voir les automatisations
            </Button>
          </Link>
        </div>
        
        {/* Hero Visual - Stylized Interface */}
        <div className="relative max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">AETHER Flow — Workflow Builder</span>
            </div>
            
            {/* Interface Preview */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Workflow Canvas */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Trigger: Email reçu</p>
                      <p className="text-xs text-muted-foreground">Automatiquement détecté</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-gradient-to-b from-primary/50 to-primary/20" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Agent IA: Classification</p>
                      <p className="text-xs text-muted-foreground">Analyse et catégorisation</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-gradient-to-b from-border/50 to-border/20" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Action: Mise à jour CRM</p>
                      <p className="text-xs text-muted-foreground">Synchronisation automatique</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Panel */}
                <div className="md:w-64 space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <h4 className="text-sm font-semibold text-foreground">Performance temps réel</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Exécutions/jour</span>
                        <span className="text-success font-medium">1,247</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-primary to-[hsl(260_100%_65%)] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Temps économisé</span>
                        <span className="text-success font-medium">127h</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-success to-[hsl(160_76%_55%)] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Taux de succès</span>
                        <span className="text-success font-medium">99.7%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[99%] bg-gradient-to-r from-primary to-success rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect behind the card */}
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/20 via-[hsl(260_100%_65%/0.2)] to-primary/20 blur-3xl opacity-50" />
        </div>
      </div>
    </section>
  );
}
