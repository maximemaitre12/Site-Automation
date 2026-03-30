import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

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
    <div className="text-center group">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tabular-nums transition-colors group-hover:text-primary">
        {formattedCount}
      </div>
      <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-white">
      {/* Premium mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-30%] right-[-15%] w-[70%] h-[80%] rounded-full bg-[radial-gradient(ellipse,hsl(239_84%_67%/0.07),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[70%] rounded-full bg-[radial-gradient(ellipse,hsl(260_70%_55%/0.05),transparent_60%)] blur-3xl" />
        <div className="absolute top-[20%] left-[40%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(ellipse,hsl(200_80%_60%/0.03),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.12)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="animate-cloud-fade-in">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.04] mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Conseil en optimisation opérationnelle</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-7">
              Transformez vos opérations avec{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-[hsl(260_70%_60%)] to-[hsl(200_80%_55%)] bg-clip-text text-transparent">
                  l'Intelligence Artificielle
                </span>
                {/* Underline glow */}
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-[hsl(260_70%_60%)] to-[hsl(200_80%_55%)] rounded-full opacity-40 blur-[1px]" />
              </span>
            </h1>

            <p
              className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed mb-10 animate-cloud-fade-in"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Nous identifions et corrigeons les inefficacités dans vos processus critiques, avec des résultats concrets et mesurables dès les premières semaines.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-4 animate-cloud-fade-in"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <a href="mailto:contact@aether-connect.com">
                <Button
                  size="lg"
                  className="group/btn relative h-13 px-10 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 border-0 shadow-[0_4px_20px_hsl(220_20%_10%/0.15)] hover:shadow-[0_8px_30px_hsl(220_20%_10%/0.25)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Réserver un appel découverte
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-[hsl(260_70%_60%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </Button>
              </a>
              <a href="#methode" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 pt-3 sm:pt-0 sm:self-center">
                Découvrir notre approche →
              </a>
            </div>
          </div>

        </div>

        {/* Stats bar */}
        <div
          className="mt-20 sm:mt-24 animate-cloud-fade-in"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          <div className="relative rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-sm shadow-[0_2px_20px_hsl(220_20%_50%/0.06)] px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
              {stats.map((s, i) => (
                <HeroStat key={i} {...s} />
              ))}
            </div>
            {/* Decorative top line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-y-px" />
          </div>
        </div>
      </div>
    </section>
  );
}
