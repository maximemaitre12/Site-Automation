import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, MapPin, Monitor } from "lucide-react";

const trainings = [
  {
    title: "IA Générative : comprendre les enjeux techniques",
    description: "Démystifiez le fonctionnement des LLM pour mieux anticiper leurs limites et sécuriser vos déploiements.",
    format: "Distanciel",
    duration: "3 heures",
    icon: Monitor,
    gradient: "from-[hsl(280_80%_60%)] to-[hsl(320_70%_55%)]",
  },
  {
    title: "IA Générative : structurer vos prompts",
    description: "Apprenez à structurer vos instructions pour obtenir des résultats 100% exploitables par vos équipes.",
    format: "Présentiel",
    duration: "8 heures",
    icon: MapPin,
    gradient: "from-primary to-[hsl(260_70%_60%)]",
  },
  {
    title: "IA et automatisation des processus",
    description: "Utilisez l'IA pour automatiser vos workflows critiques et libérer du temps sur les tâches à forte valeur ajoutée.",
    format: "Présentiel",
    duration: "16 heures",
    icon: MapPin,
    gradient: "from-[hsl(200_80%_55%)] to-[hsl(260_70%_60%)]",
  },
];

export function TrainingsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div
        ref={ref}
        className={cn(
          "max-w-6xl mx-auto px-4 sm:px-6 relative z-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Nos formations IA
          </h2>
          <p className="text-sm text-slate-500 max-w-lg">
            Des programmes conçus pour vos équipes, du niveau découverte à l'expertise opérationnelle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training, i) => (
            <div
              key={i}
              className={cn(
                "group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Gradient orb */}
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg", training.gradient)}>
                <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm" />
              </div>

              <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                {training.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                {training.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <training.icon className="w-3.5 h-3.5" />
                  {training.format}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {training.duration}
                </div>
              </div>

              {/* CTA */}
              <a
                href="mailto:contact@aether-connect.com?subject=Formation IA — Demande d'information"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
              >
                Découvrir
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
