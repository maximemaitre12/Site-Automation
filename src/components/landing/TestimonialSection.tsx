import { Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const quote = "We built Aether because we believe AI should work for you, not the other way around. Our mission is to give every team the power of intelligent automation.";

export function TestimonialSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const words = quote.split(" ");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start animation when visible
  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
      setDisplayedText("");
      setCurrentWordIndex(0);
    }
  }, [isVisible, hasStarted]);

  // Animate words appearing one by one
  useEffect(() => {
    if (!hasStarted) return;

    if (currentWordIndex < words.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedText(prev => {
          if (prev === "") return words[0];
          return prev + " " + words[currentWordIndex];
        });
        setCurrentWordIndex(prev => prev + 1);
      }, 80);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [hasStarted, currentWordIndex, words]);

  // Reset when scrolling away
  useEffect(() => {
    if (!isVisible && hasStarted) {
      setHasStarted(false);
      setDisplayedText("");
      setCurrentWordIndex(0);
    }
  }, [isVisible, hasStarted]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div 
        ref={ref}
        className={cn(
          "max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/20 mx-auto mb-4 sm:mb-6" />
        
        <blockquote className="text-base sm:text-lg md:text-xl font-medium text-foreground leading-relaxed mb-4 sm:mb-6 min-h-[4rem] sm:min-h-[5rem]">
          <span className="text-muted-foreground">"</span>
          {displayedText.split(" ").map((word, index) => {
            // Highlight key words
            const isHighlight = ["AI", "you", "intelligent", "automation"].includes(word.replace(/[.,]/g, ""));
            return (
              <span
                key={index}
                className={cn(
                  "inline animate-fade-in mr-[0.3em]",
                  isHighlight ? "text-primary font-semibold" : "text-foreground"
                )}
                style={{ 
                  animationDelay: `${index * 20}ms`,
                  animationDuration: "300ms"
                }}
              >
                {word}
              </span>
            );
          })}
          {currentWordIndex < words.length && (
            <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5" />
          )}
          {currentWordIndex >= words.length && <span className="text-muted-foreground">"</span>}
        </blockquote>
        
        <div className={cn(
          "flex flex-col items-center transition-all duration-500",
          currentWordIndex >= words.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <p className="font-semibold text-foreground text-sm">The Aether Team</p>
          <p className="text-xs text-muted-foreground">Building the future of work</p>
        </div>
      </div>
    </section>
  );
}