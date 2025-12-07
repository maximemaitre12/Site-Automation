import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Zap, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220_30%_25%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_30%_25%/0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div className="max-w-2xl">
            {/* Problem Statement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6 animate-fade-in">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Vos équipes perdent 40% de leur temps sur des tâches répétitives</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Libérez vos équipes.</span>
              <br />
              <span className="text-gradient">L'IA travaille pour vous.</span>
            </h1>
            
            {/* Solution Statement */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              AETHER automatise vos processus métier en quelques clics. 
              Factures, emails, support client, RH — tout est géré par des agents IA intelligents.
            </p>
            
            {/* Quick Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm font-medium text-foreground">–70% de tâches manuelles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">120h/mois économisées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-warning" />
                </div>
                <span className="text-sm font-medium text-foreground">ROI en 30 jours</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/demo">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Demander une démo gratuite
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#tools">
                <Button variant="outline" size="xl" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                  <Play className="w-4 h-4 mr-2" />
                  Voir comment ça marche
                </Button>
              </a>
            </div>
          </div>
          
          {/* Right - Visual Demo */}
          <div className="relative animate-fade-in lg:animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
            {/* Main Interface Card */}
            <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">AETHER — Automatisation en cours</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 border border-success/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success font-medium">Live</span>
                </div>
              </div>
              
              {/* Workflow Animation */}
              <div className="p-6 space-y-4">
                {/* Step 1 - Completed */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-success/5 border border-success/20">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Facture #2847 reçue</p>
                    <p className="text-xs text-muted-foreground">Extraction automatique des données</p>
                  </div>
                  <span className="text-xs text-success font-medium">Terminé</span>
                </div>
                
                {/* Step 2 - Completed */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-success/5 border border-success/20">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Validation comptable</p>
                    <p className="text-xs text-muted-foreground">Montant: 2,450€ — Fournisseur: Acme Corp</p>
                  </div>
                  <span className="text-xs text-success font-medium">Terminé</span>
                </div>
                
                {/* Step 3 - In Progress */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/30 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Intégration ERP</p>
                    <p className="text-xs text-muted-foreground">Synchronisation avec votre comptabilité...</p>
                  </div>
                  <span className="text-xs text-primary font-medium">En cours</span>
                </div>
                
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-2xl font-bold text-gradient">847</div>
                    <div className="text-xs text-muted-foreground">Tâches/jour</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-2xl font-bold text-success">99.7%</div>
                    <div className="text-xs text-muted-foreground">Précision</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Disponible</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating notification */}
            <div className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-card border border-border/50 shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">+127 heures économisées</p>
                  <p className="text-xs text-muted-foreground">Ce mois-ci</p>
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
