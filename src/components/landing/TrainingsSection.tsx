import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "./MacWindow";
import { Star, Clock, Monitor, MapPin } from "lucide-react";

const trainings = [
  {
    title: "IA Générative : enjeux techniques",
    subtitle: "Aether Learning",
    description: "Démystifiez le fonctionnement des LLM pour mieux anticiper leurs limites.",
    format: "Distanciel",
    formatIcon: Monitor,
    duration: "3 heures",
    rating: 4.8,
    reviews: 124,
    gradient: "from-[hsl(280_80%_60%)] to-[hsl(320_70%_55%)]",
    badge: "POPULAIRE",
  },
  {
    title: "Structurer vos prompts",
    subtitle: "Aether Learning",
    description: "Obtenez des résultats 100% exploitables par vos équipes.",
    format: "Présentiel",
    formatIcon: MapPin,
    duration: "8 heures",
    rating: 4.9,
    reviews: 89,
    gradient: "from-primary to-[hsl(260_70%_60%)]",
    badge: "RECOMMANDÉ",
  },
  {
    title: "IA et automatisation",
    subtitle: "Aether Learning",
    description: "Automatisez vos workflows critiques et libérez du temps à forte valeur.",
    format: "Présentiel",
    formatIcon: MapPin,
    duration: "16 heures",
    rating: 4.7,
    reviews: 67,
    gradient: "from-[hsl(200_80%_55%)] to-[hsl(260_70%_60%)]",
    badge: "NOUVEAU",
  },
];

function AppCard({ training, isVisible, delay }: {
  training: typeof trainings[0]; isVisible: boolean; delay: number;
}) {
  const FormatIcon = training.formatIcon;

  return (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-500 hover:bg-slate-50",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* App icon */}
      <div className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0",
        training.gradient
      )}>
        <FormatIcon className="w-7 h-7 text-white/90" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{training.title}</h3>
            <p className="text-[11px] text-slate-400">{training.subtitle}</p>
          </div>
          <a
            href="mailto:contact@aether-connect.com?subject=Formation IA — Demande d'information"
            className="shrink-0 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            OBTENIR
          </a>
        </div>

        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{training.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("w-3 h-3", i < Math.floor(training.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200")}
              />
            ))}
            <span className="text-[10px] text-slate-400 ml-1">{training.rating}</span>
            <span className="text-[10px] text-slate-300">({training.reviews})</span>
          </div>

          <span className="text-slate-200">·</span>

          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-300" />
            <span className="text-[10px] text-slate-400">{training.duration}</span>
          </div>

          <span className={cn(
            "text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded",
            training.badge === "POPULAIRE" ? "bg-amber-50 text-amber-600" :
            training.badge === "RECOMMANDÉ" ? "bg-primary/10 text-primary" :
            "bg-emerald-50 text-emerald-600"
          )}>{training.badge}</span>
        </div>
      </div>
    </div>
  );
}

export function TrainingsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Formation</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Nos formations IA
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Des programmes conçus pour vos équipes, du niveau découverte à l'expertise opérationnelle.
          </p>
        </div>

        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER ACADEMY v1.0"
            toolbar={
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-primary">Découvrir</span>
                <span className="text-[11px] text-slate-400">Populaires</span>
                <span className="text-[11px] text-slate-400">Nouveautés</span>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">3 formations disponibles</span>
                <span className="font-mono text-[10px] text-slate-400">Mis à jour aujourd'hui</span>
              </div>
            }
          >
            <div className="divide-y divide-slate-100">
              {trainings.map((t, i) => (
                <AppCard key={i} training={t} isVisible={isVisible} delay={i * 150 + 200} />
              ))}
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
