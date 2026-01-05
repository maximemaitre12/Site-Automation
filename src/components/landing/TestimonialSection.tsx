import { Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const words = [
  { text: "We", highlight: false },
  { text: "built", highlight: false },
  { text: "Aether", highlight: true },
  { text: "because", highlight: false },
  { text: "we", highlight: false },
  { text: "believe", highlight: false },
  { text: "AI", highlight: true },
  { text: "should", highlight: false },
  { text: "work", highlight: false },
  { text: "for", highlight: false },
  { text: "you,", highlight: true },
  { text: "not", highlight: false },
  { text: "the", highlight: false },
  { text: "other", highlight: false },
  { text: "way", highlight: false },
  { text: "around.", highlight: false },
  { text: "Our", highlight: false },
  { text: "mission", highlight: false },
  { text: "is", highlight: false },
  { text: "to", highlight: false },
  { text: "give", highlight: false },
  { text: "every", highlight: false },
  { text: "team", highlight: false },
  { text: "—", highlight: false },
  { text: "from", highlight: false },
  { text: "headquarters", highlight: false },
  { text: "to", highlight: false },
  { text: "the", highlight: false },
  { text: "field", highlight: true },
  { text: "—", highlight: false },
  { text: "the", highlight: false },
  { text: "power", highlight: false },
  { text: "of", highlight: false },
  { text: "intelligent", highlight: true },
  { text: "automation.", highlight: true },
];

export function TestimonialSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div 
        ref={ref}
        className={cn(
          "max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Rectangle container */}
        <div className="relative rounded-2xl border border-border/50 bg-secondary/30 backdrop-blur-sm p-8 sm:p-10 md:p-12 shadow-lg">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30 mx-auto mb-4 sm:mb-6" />
          
          <blockquote className="text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-4 sm:mb-6">
            <span className="text-muted-foreground">"</span>
            {words.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "inline transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                  word.highlight ? "text-primary font-semibold" : "text-foreground"
                )}
                style={{ 
                  transitionDelay: isVisible ? `${index * 40}ms` : "0ms"
                }}
              >
                {word.text}{" "}
              </span>
            ))}
            <span className="text-muted-foreground">"</span>
          </blockquote>
          
          <div className={cn(
            "flex flex-col items-center transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
          style={{ transitionDelay: isVisible ? "1200ms" : "0ms" }}
          >
            <p className="font-semibold text-foreground text-sm">The Aether Team</p>
            <p className="text-xs text-muted-foreground">Building the future of work</p>
          </div>
        </div>
      </div>
    </section>
  );
}