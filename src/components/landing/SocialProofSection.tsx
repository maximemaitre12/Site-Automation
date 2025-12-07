import { Building2, Users, Globe, Award } from "lucide-react";

const stats = [
  { icon: Building2, value: "150+", label: "Entreprises" },
  { icon: Users, value: "10K+", label: "Utilisateurs" },
  { icon: Globe, value: "12", label: "Pays" },
  { icon: Award, value: "99.9%", label: "Uptime" },
];

export function SocialProofSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3 animate-fade-in">
            La confiance des leaders
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Déployé dans des PME, ETI et grands groupes
          </h3>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Logos placeholder */}
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-28 h-10 rounded bg-foreground/10 animate-fade-in"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
