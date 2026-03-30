import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";


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
        <div className="max-w-2xl mx-auto text-center">
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
              className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed mb-10 animate-cloud-fade-in"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Nous identifions et corrigeons les inefficacités dans vos processus critiques, avec des résultats concrets et mesurables dès les premières semaines.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-cloud-fade-in"
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

      </div>
    </section>
  );
}
