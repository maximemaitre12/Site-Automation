import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Commencez gratuitement</span>
        </div>
        
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Prêt à automatiser{" "}
          <span className="text-gradient">90% de vos opérations</span> ?
        </h2>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Rejoignez les entreprises qui ont déjà transformé leurs opérations avec AETHER. 
          Démo personnalisée, déploiement en 48h.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/demo">
            <Button variant="hero" size="xl" className="min-w-[280px]">
              Demander une démo personnalisée
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sans engagement
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Déploiement rapide
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Support dédié
          </div>
        </div>
      </div>
    </section>
  );
}
