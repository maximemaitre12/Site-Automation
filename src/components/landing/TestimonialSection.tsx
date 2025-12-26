import { Quote } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary/20 mx-auto mb-6 sm:mb-8" />
        
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6 sm:mb-8">
          "We built Aether because we believe AI should work for you, not the other way around. Our mission is to give every team the power of intelligent automation."
        </blockquote>
        
        <div className="flex flex-col items-center">
          <p className="font-semibold text-foreground">The Aether Team</p>
          <p className="text-sm text-muted-foreground">Building the future of work</p>
        </div>
      </div>
    </section>
  );
}
