import { Shield, Lock, Server, Award } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Conforme RGPD",
    description: "Vos données restent en Europe, chiffrées et protégées.",
  },
  {
    icon: Lock,
    title: "Sécurité enterprise",
    description: "SOC 2 Type II, SSO, audit logs complets.",
  },
  {
    icon: Server,
    title: "99.99% uptime",
    description: "Infrastructure redondante, SLA garanti.",
  },
  {
    icon: Award,
    title: "Support premium",
    description: "Équipe dédiée, réponse en moins de 2h.",
  },
];

const logos = [
  "BNP Paribas", "Société Générale", "Orange", "Total", "Carrefour", "LVMH"
];

export function TrustSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-t border-border/20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/5" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Confiance & Sécurité
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Construit pour les exigences enterprise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les plus grandes entreprises nous font confiance pour automatiser leurs processus critiques.
            </p>
          </div>
          
          {/* Trust Points Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {trustPoints.map((point, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-card/30 border border-border/30 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
          
          {/* Enterprise Logos */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-8">
              Ils nous font confiance pour leurs opérations critiques
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30">
              {logos.map((logo) => (
                <span 
                  key={logo} 
                  className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
