import { ArrowUpRight } from "lucide-react";

export function StorySection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/5" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* The Vision */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 lg:mb-32">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                Notre vision
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                Le travail répétitif appartient au passé.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nous croyons que le potentiel humain est gaspillé dans des tâches que les machines 
                peuvent accomplir mieux, plus vite, sans fatigue. AETHER libère ce potentiel.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-[hsl(260_100%_65%/0.1)] border border-border/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-7xl md:text-8xl font-bold text-gradient mb-4">∞</div>
                  <p className="text-muted-foreground">Possibilités infinies</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Mission Statement */}
          <div className="text-center mb-24 lg:mb-32">
            <div className="inline-block p-8 lg:p-12 rounded-3xl bg-secondary/20 border border-border/30">
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed max-w-3xl">
                "Nous construisons les outils qui permettent aux entreprises de 
                <span className="font-semibold text-primary"> se concentrer sur ce qui compte vraiment</span> : 
                innover, créer, grandir."
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center text-primary-foreground font-bold text-lg">
                  A
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Équipe fondatrice</p>
                  <p className="text-sm text-muted-foreground">AETHER AI Suite</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Numbers That Matter */}
          <div>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                En chiffres
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Une croissance qui parle
              </h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "500+", label: "Entreprises", sublabel: "nous font confiance" },
                { value: "2M+", label: "Tâches", sublabel: "automatisées/mois" },
                { value: "98%", label: "Satisfaction", sublabel: "client mesurée" },
                { value: "24/7", label: "Disponibilité", sublabel: "garantie" },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="group p-6 lg:p-8 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all duration-500 text-center"
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">
                    {stat.value}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
