import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";

export function SupplyHero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '64px 64px'
      }} />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Eyebrow */}
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          Supply Chain Intelligence Platform
        </p>

        {/* Main headline */}
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.08] transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Anticipate. Optimize.
          <br />
          Deliver.
        </h1>

        {/* Subtitle */}
        <p className={`mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          The intelligent platform that gives supply chain leaders full visibility — from supplier risk to last-mile delivery.
        </p>

        {/* Credibility stat */}
        <p className={`mt-8 text-sm text-muted-foreground/70 max-w-lg mx-auto transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Companies using predictive supply chain AI reduce stockouts by 35% and logistics costs by 23%.
        </p>

        {/* CTA */}
        <div className={`mt-10 transition-all duration-700 delay-[400ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium text-primary-foreground bg-foreground rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 active:scale-[0.97] group"
          >
            Book a Supply Chain Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
