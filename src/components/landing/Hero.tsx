import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-pattern">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Enterprise Suite</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-foreground">Automate Everything.</span>
          <br />
          <span className="text-gradient">Empower Everyone.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          The unified AI platform for modern businesses. 9 powerful tools, 
          one seamless experience. From workflows to compliance.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="xl">
              Explore Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "9", label: "AI Tools" },
            { value: "1", label: "Unified Platform" },
            { value: "∞", label: "Possibilities" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}