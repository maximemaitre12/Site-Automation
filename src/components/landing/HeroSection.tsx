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
            <span className="text-sm font-medium text-foreground">La nouvelle ère de l&apos;automatisation</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Automatisez.</span>
            <br />
            <span className="text-foreground">Accélérez.</span>
            <br />
            <span className="text-gradient">Dominez.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in font-light" style={{ animationDelay: "0.2s" }}>
            AETHER est la plateforme d&apos;automatisation IA qui permet aux entreprises leaders 
            de <span className="text-foreground font-medium">transformer leurs opérations</span> et 
            de <span className="text-foreground font-medium">libérer leur plein potentiel.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/demo">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-8 py-6 rounded-full font-semibold shadow-2xl shadow-foreground/10"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 rounded-full font-medium border-border/50 hover:bg-secondary/50"
              >
                <Play className="w-4 h-4 mr-2" />
                Découvrir comment
              </Button>
            </a>
          </div>
          
          {/* Credibility Statement */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary/30 border border-border/30 mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-[hsl(260_100%_65%/0.2)] border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-primary">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <div className="h-6 w-px bg-border/50" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">+500 entreprises</span> automatisent déjà avec AETHER
              </p>
            </div>
            
            {/* Enterprise Logos */}
            <div className="flex items-center justify-center gap-8 lg:gap-16 opacity-30">
              {["Doctolib", "Qonto", "Alan", "Swile", "Payfit"].map((company) => (
                <span key={company} className="text-lg lg:text-xl font-semibold text-foreground tracking-tight">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Preview */}
        <div className="mt-24 lg:mt-32 max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
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
                  <span className="hidden sm:block text-sm text-muted-foreground">aether.ai — Centre de contrôle</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-success">Système opérationnel</span>
                </div>
              </div>
              
              {/* Dashboard Content Preview */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {/* Stats Cards */}
                  {[
                    { label: "Tâches automatisées", value: "12,847", change: "+23% ce mois" },
                    { label: "Heures économisées", value: "847", change: "équivalent 5 ETP" },
                    { label: "Précision IA", value: "99.7%", change: "SLA respecté" },
                  ].map((stat, i) => (
                    <div 
                      key={i}
                      className="p-5 lg:p-6 rounded-xl bg-secondary/30 border border-border/30"
                    >
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                      </div>
                      <p className="text-xs text-success font-medium mt-1">{stat.change}</p>
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
                        <p className="font-semibold text-foreground">Workflow automatisé #1247</p>
                        <p className="text-sm text-muted-foreground">Traitement factures fournisseurs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">Succès</p>
                      <p className="text-xs text-muted-foreground">Exécuté il y a 2 min</p>
                    </div>
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="flex items-center gap-2">
                    {["Email reçu", "Extraction IA", "Validation", "Intégration ERP"].map((step, i) => (
                      <div key={step} className="flex-1">
                        <div className="h-1.5 rounded-full bg-success" />
                        <p className="text-xs mt-2 text-foreground">{step}</p>
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
