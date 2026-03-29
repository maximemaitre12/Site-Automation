import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Mail } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

export function SupplyHero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center relative">
        <h1 className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-foreground tracking-tight leading-[1.1] transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Améliorez la performance de votre supply chain grâce à l'IA
        </h1>

        <p className={`mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Nous aidons les entreprises à réduire leurs coûts, fiabiliser leurs opérations et identifier des gains mesurables en quelques semaines.
        </p>

        <div className={`mt-10 transition-all duration-700 delay-[350ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <a
            href={`mailto:${EMAILS.join(',')}?subject=AETHER — Demande d'échange`}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium text-primary-foreground bg-foreground rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 active:scale-[0.97] group"
          >
            <Mail className="w-4 h-4" />
            Demander un échange
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
