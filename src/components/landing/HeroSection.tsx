import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroDiagram } from "./consulting/HeroDiagram";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: 40, suffix: "+", label: "Missions réalisées" },
  { value: 15, suffix: "M€", label: "Économies identifiées" },
  { value: 12, suffix: "", label: "Secteurs couverts" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
];

function HeroStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { formattedCount } = useCountUp({ end: value, duration: 2000, suffix });
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tabular-nums">{formattedCount}</div>
      <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-white">
      {/* Mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-[radial-gradient(ellipse,hsl(239_84%_67%/0.06),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[radial-gradient(ellipse,hsl(260_70%_55%/0.04),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="animate-cloud-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-slate-600">Conseil en optimisation opérationnelle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 text-balance">
              Optimisez vos opérations grâce à la puissance de{" "}
              <span className="bg-gradient-to-r from-primary to-[hsl(260_70%_65%)] bg-clip-text text-transparent">l'Intelligence Artificielle</span>
            </h1>
            <p
              className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed mb-8 animate-cloud-fade-in"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Nous aidons les entreprises à identifier et corriger les inefficacités dans leurs processus critiques, avec des résultats concrets et mesurables.
            </p>
            <div
              className="animate-cloud-fade-in"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <a href="mailto:contact@aether-connect.com">
                <Button
                  size="lg"
                  className="h-12 px-8 text-sm font-medium bg-primary hover:bg-primary/90 border border-primary/50 shadow-[0_0_20px_hsl(239_84%_67%/0.2)] hover:shadow-[0_0_30px_hsl(239_84%_67%/0.3)] transition-all"
                >
                  Demander un échange
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>

          {/* Diagram */}
          <div
            className="animate-cloud-fade-in"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <HeroDiagram />
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 border-t border-slate-200 pt-10 animate-cloud-fade-in"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          {stats.map((s, i) => (
            <HeroStat key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
