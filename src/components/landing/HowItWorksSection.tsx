import { Plug, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Plug,
    title: "Connectez",
    description: "Branchez vos outils existants en quelques clics. Email, CRM, ERP, Slack — plus de 100 intégrations natives.",
    detail: "Configuration en moins de 5 minutes",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Configurez",
    description: "Décrivez ce que vous voulez automatiser en langage naturel. Notre IA génère le workflow optimal.",
    detail: "Zéro code requis",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Déployez",
    description: "Activez vos automatisations en un clic. Surveillez, ajustez, optimisez en temps réel.",
    detail: "ROI visible dès le premier mois",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Simplicité radicale
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Trois étapes. Aucune friction.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De la découverte à la production en quelques heures, pas en quelques mois.
            </p>
          </div>
          
          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative p-8 lg:p-10 rounded-3xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all duration-500 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-background border border-border/50 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.number}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
