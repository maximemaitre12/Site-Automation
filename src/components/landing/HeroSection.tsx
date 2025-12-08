import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      </div>
      
      {/* Subtle Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(260_100%_65%/0.05)] rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Nouveau : Workflows IA génératifs</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">L'IA qui</span>
            <br />
            <span className="text-gradient">automatise tout</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in font-light" style={{ animationDelay: "0.2s" }}>
            Déployez des agents IA en quelques clics. Support, RH, Ventes, Compliance — 
            <span className="text-foreground font-medium"> une seule plateforme, zéro code.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/demo">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-8 py-6 rounded-full font-semibold shadow-2xl shadow-foreground/10"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#tools">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 rounded-full font-medium border-border/50 hover:bg-secondary/50"
              >
                <Play className="w-4 h-4 mr-2" />
                Voir en action
              </Button>
            </a>
          </div>
          
          {/* Social Proof */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm text-muted-foreground mb-6">Utilisé par des équipes visionnaires</p>
            <div className="flex items-center justify-center gap-8 lg:gap-12 opacity-40">
              {["Doctolib", "Qonto", "Alan", "Swile", "Payfit"].map((company) => (
                <span key={company} className="text-lg lg:text-xl font-semibold text-foreground tracking-tight">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Preview */}
        <div className="mt-20 lg:mt-28 max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 lg:-inset-8 bg-gradient-to-r from-primary/20 via-[hsl(260_100%_65%/0.15)] to-primary/20 rounded-3xl blur-3xl opacity-50" />
            
            {/* Main Preview Card */}
            <div className="relative rounded-2xl lg:rounded-3xl border border-border/50 bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-border/30 bg-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="hidden sm:block h-6 w-px bg-border/50" />
                  <span className="hidden sm:block text-sm text-muted-foreground">aether.ai/workflows</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-success">3 workflows actifs</span>
                </div>
              </div>
              
              {/* Dashboard Content Preview */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {/* Stats Cards */}
                  {[
                    { label: "Tâches automatisées", value: "12,847", change: "+23%" },
                    { label: "Heures économisées", value: "847", change: "ce mois" },
                    { label: "Précision IA", value: "99.7%", change: "moyenne" },
                  ].map((stat, i) => (
                    <div 
                      key={i}
                      className="p-5 lg:p-6 rounded-xl bg-secondary/30 border border-border/30"
                    >
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-success font-medium">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Workflow Preview */}
                <div className="mt-6 p-5 lg:p-6 rounded-xl bg-secondary/20 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Traitement factures</p>
                        <p className="text-sm text-muted-foreground">En cours d'exécution...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">75% complété</p>
                      <p className="text-xs text-muted-foreground">~2 min restantes</p>
                    </div>
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="flex items-center gap-2">
                    {["Réception", "Extraction", "Validation", "Export"].map((step, i) => (
                      <div key={step} className="flex-1">
                        <div className={`h-1.5 rounded-full ${i < 3 ? "bg-primary" : "bg-border/50"}`} />
                        <p className={`text-xs mt-2 ${i < 3 ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
