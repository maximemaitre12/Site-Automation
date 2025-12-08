import { Zap, Clock, Brain, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "1",
    title: "Choisissez votre outil",
    description: "Support, RH, Sales, Compliance... Sélectionnez l'agent IA adapté à votre besoin.",
    icon: Brain,
  },
  {
    number: "2", 
    title: "Configurez en 5 minutes",
    description: "Interface drag & drop. Connectez vos sources de données. Zéro code requis.",
    icon: Clock,
  },
  {
    number: "3",
    title: "L'IA travaille pour vous",
    description: "Vos agents traitent automatiquement tickets, CV, documents, appels... 24/7.",
    icon: Zap,
  },
];

const beforeAfter = [
  { before: "8h pour traiter 50 tickets", after: "50 tickets traités en 10 min" },
  { before: "3 jours pour analyser 100 CV", after: "100 CV analysés en 2 min" },
  { before: "2h pour rédiger une proposition", after: "Proposition générée en 30 sec" },
  { before: "1 semaine d'audit RGPD", after: "Audit complet en 1 heure" },
];

export function PainPointsSection() {
  return (
    <section id="how" className="relative py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(250_100%_95%)] border border-[hsl(250_100%_90%)] mb-6">
            <span className="text-sm font-medium text-[hsl(250_100%_45%)]">Le concept</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Le génie ? <span className="text-gradient">La simplicité.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Fini les mois d'intégration. Fini les développeurs. <br/>
            <span className="text-foreground font-semibold">Déployez des agents IA en quelques clics.</span>
          </p>
        </div>
        
        {/* 3 Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative p-8 rounded-2xl bg-white border border-border hover:shadow-xl hover:shadow-[hsl(250_100%_60%/0.05)] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <IconComponent className="w-6 h-6 text-[hsl(250_100%_55%)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Before / After */}
        <div className="bg-gradient-to-br from-[hsl(250_50%_98%)] to-[hsl(280_50%_98%)] rounded-3xl p-8 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Avant AETHER vs. <span className="text-gradient">Après AETHER</span>
          </h3>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Nos clients constatent des gains immédiats. Voici des exemples réels.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {beforeAfter.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border">
                <div className="flex-1">
                  <p className="text-muted-foreground line-through text-sm">{item.before}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[hsl(250_100%_55%)] flex-shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(160_84%_39%)] flex-shrink-0" />
                  <p className="text-foreground font-medium text-sm">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/demo">
              <Button 
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] hover:from-[hsl(280_100%_50%)] hover:to-[hsl(250_100%_50%)] text-white rounded-full btn-glow"
              >
                Je veux ces résultats
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
