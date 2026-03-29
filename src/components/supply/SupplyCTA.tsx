import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Mail } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

export function SupplyCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground tracking-tight transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Échangez avec un expert pour identifier vos leviers d'optimisation
        </h2>

        <div className={`mt-8 transition-all duration-700 delay-150 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <a
            href={`mailto:${EMAILS.join(',')}?subject=AETHER — Planifier un appel`}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium text-primary-foreground bg-foreground rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 active:scale-[0.97] group"
          >
            <Mail className="w-4 h-4" />
            Planifier un appel
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>

        <p className={`mt-5 text-xs text-muted-foreground/60 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Sans engagement · Réponse sous 24h
        </p>
      </div>
    </section>
  );
}
