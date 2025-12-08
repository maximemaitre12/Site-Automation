import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Radial gradient from top */}
      <div className="absolute inset-0 radial-gradient" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[hsl(280_100%_60%/0.12)] rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[hsl(220_100%_60%/0.08)] rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(250_100%_60%/0.05)] rounded-full blur-[180px]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-[hsl(250_100%_60%/0.2)] mb-8 animate-fade-up backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[hsl(160_84%_39%)] animate-pulse" />
            <span className="text-sm font-medium text-foreground">Nouvelle génération d'automatisation</span>
          </div>
          
          {/* Main Headline - Bold & Impactful */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-fade-up-delay-1">
            <span className="text-foreground">L'IA qui</span>
            <br />
            <span className="text-gradient-hero">révolutionne</span>
            <br />
            <span className="text-foreground">votre entreprise.</span>
          </h1>
          
          {/* Subtitle - Clear value prop */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-up-delay-2">
            Automatisez <span className="text-foreground font-medium">90% des tâches répétitives</span> en déployant 
            des agents IA en quelques minutes. Support, RH, Ventes, Compliance — 
            <span className="text-foreground font-medium"> une seule plateforme.</span>
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up-delay-3">
            <Link to="/demo">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base bg-gradient-to-r from-[hsl(280_100%_60%)] via-[hsl(250_100%_60%)] to-[hsl(220_100%_60%)] hover:from-[hsl(280_100%_65%)] hover:via-[hsl(250_100%_65%)] hover:to-[hsl(220_100%_65%)] text-white border-0 shadow-2xl shadow-[hsl(250_100%_60%/0.3)] transition-all duration-300 hover:shadow-[hsl(250_100%_60%/0.5)] hover:scale-105"
              >
                Démarrer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#demo-video">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base border-border/50 bg-secondary/30 hover:bg-secondary/50 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Voir la démo
              </Button>
            </a>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-20 animate-fade-up-delay-4">
            {[
              { icon: Zap, text: "Déploiement en 5 min" },
              { icon: Shield, text: "RGPD compliant" },
              { icon: Clock, text: "ROI en 30 jours" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-4 h-4 text-[hsl(250_100%_70%)]" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Preview - The "wow" factor */}
        <div className="max-w-6xl mx-auto animate-scale-in">
          <div className="relative">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(280_100%_60%/0.2)] via-[hsl(250_100%_60%/0.15)] to-[hsl(220_100%_60%/0.2)] rounded-3xl blur-2xl" />
            
            {/* Main preview card */}
            <div className="relative rounded-2xl border border-[hsl(250_100%_60%/0.2)] bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(0_72%_51%)]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(38_92%_50%)]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)]" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-secondary/50 text-sm text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)]" />
                  app.aether.ai
                </div>
                <div className="w-20" />
              </div>
              
              {/* Dashboard content */}
              <div className="p-6 lg:p-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Tâches automatisées", value: "24,847", change: "+847 aujourd'hui", positive: true },
                    { label: "Heures économisées", value: "1,234h", change: "ce mois", positive: true },
                    { label: "Précision IA", value: "99.7%", change: "+0.3%", positive: true },
                    { label: "Workflows actifs", value: "47", change: "3 en cours", positive: true },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl bg-secondary/40 border border-border/20">
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-[hsl(160_84%_50%)]">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Active workflows */}
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Traitement factures", status: "En cours", progress: 75, eta: "2 min" },
                    { name: "Analyse CV candidats", status: "En cours", progress: 45, eta: "5 min" },
                  ].map((workflow, i) => (
                    <div key={i} className="p-5 rounded-xl bg-secondary/30 border border-border/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(280_100%_60%/0.2)] to-[hsl(220_100%_60%/0.2)] flex items-center justify-center">
                            <Zap className="w-5 h-5 text-[hsl(250_100%_70%)]" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{workflow.name}</p>
                            <p className="text-sm text-muted-foreground">{workflow.status} • {workflow.eta} restantes</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[hsl(160_84%_50%)]">{workflow.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[hsl(280_100%_60%)] to-[hsl(220_100%_60%)] rounded-full transition-all duration-1000"
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social proof */}
        <div className="mt-20 text-center animate-fade-up-delay-4">
          <p className="text-sm text-muted-foreground mb-8">Ils transforment leurs opérations avec AETHER</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {["Doctolib", "Qonto", "Alan", "Swile", "Payfit", "Pennylane"].map((company) => (
              <span key={company} className="text-xl font-semibold text-foreground tracking-tight">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
