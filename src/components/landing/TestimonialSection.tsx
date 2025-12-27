import { Quote } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary/20 mx-auto mb-6 sm:mb-8" />
        
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6 sm:mb-8">
          "Nous avons créé Aether parce que nous croyons que l'IA doit travailler pour vous, pas l'inverse. Notre mission est de donner à chaque équipe le pouvoir de l'automatisation intelligente."
        </blockquote>
        
        <div className="flex flex-col items-center">
          <p className="font-semibold text-foreground">L'équipe Aether</p>
          <p className="text-sm text-muted-foreground">Construire le futur du travail</p>
        </div>
      </div>
    </section>
  );
}
