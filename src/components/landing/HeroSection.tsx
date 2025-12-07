import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Zap, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[1200px] h-[600px] md:h-[1200px] bg-primary/5 rounded-full blur-[100px] md:blur-[200px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220_30%_25%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_30%_25%/0.05)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:80px_80px]" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div className="max-w-2xl">
            {/* Problem Statement Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4 md:mb-6 animate-fade-in">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
              <span className="text-xs md:text-sm font-medium text-destructive">Vos équipes perdent 40% de leur temps sur des tâches répétitives</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Libérez vos équipes.</span>
              <br />
              <span className="text-gradient">L'IA travaille pour vous.</span>
            </h1>
            
            {/* Solution Statement */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              AETHER automatise vos processus métier en quelques clics. 
              Factures, emails, support client, RH — tout est géré par des agents IA intelligents.
            </p>
            
            {/* Quick Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground">–70% de tâches manuelles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground">120h/mois économisées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-warning" />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground">ROI en 30 jours</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/demo">
                <Button variant="hero" size="lg" className="w-full sm:w-auto md:text-base">
                  Demander une démo gratuite
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Button>
              </Link>
              <a href="#tools">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                  <Play className="w-4 h-4 mr-2" />
                  Voir comment ça marche
                </Button>
              </a>
            </div>
          </div>
          
          {/* Right - Visual Demo */}
          <div className="relative animate-fade-in hidden md:block" style={{ animationDelay: "0.4s" }}>
            {/* Main Interface Card */}
            <div className="relative rounded-xl md:rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-border/50 bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-destructive/60" />
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-warning/60" />
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-success/60" />
                  </div>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-2 hidden sm:inline">AETHER — Automatisation en cours</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full bg-success/10 border border-success/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] md:text-xs text-success font-medium">Live</span>
                </div>
              </div>
              
              {/* Workflow Animation */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Step 1 - Completed */}
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-success/5 border border-success/20">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-foreground truncate">Facture #2847 reçue</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">Extraction automatique des données</p>
                  </div>
                  <span className="text-[10px] md:text-xs text-success font-medium whitespace-nowrap">Terminé</span>
                </div>
                
                {/* Step 2 - Completed */}
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-success/5 border border-success/20">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-foreground truncate">Validation comptable</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">Montant: 2,450€ — Fournisseur: Acme Corp</p>
                  </div>
                  <span className="text-[10px] md:text-xs text-success font-medium whitespace-nowrap">Terminé</span>
                </div>
                
                {/* Step 3 - In Progress */}
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-primary/5 border border-primary/30 animate-pulse">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-foreground truncate">Intégration ERP</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">Synchronisation avec votre comptabilité...</p>
                  </div>
                  <span className="text-[10px] md:text-xs text-primary font-medium whitespace-nowrap">En cours</span>
                </div>
                
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 pt-3 md:pt-4 border-t border-border/30">
                  <div className="text-center p-2 md:p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg md:text-2xl font-bold text-gradient">847</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">Tâches/jour</div>
                  </div>
                  <div className="text-center p-2 md:p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg md:text-2xl font-bold text-success">99.7%</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">Précision</div>
                  </div>
                  <div className="text-center p-2 md:p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg md:text-2xl font-bold text-primary">24/7</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">Disponible</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating notification */}
            <div className="absolute -bottom-4 -left-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 shadow-xl animate-float hidden lg:flex">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-foreground">+127 heures économisées</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Ce mois-ci</p>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/20 via-[hsl(260_100%_65%/0.15)] to-primary/20 blur-3xl opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
