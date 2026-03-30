import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "./MacWindow";
import { useState } from "react";
import {
  Cpu, MessageSquare, Zap, Download, ChevronRight,
  Play, Users, Clock, Award, Layers, Sparkles
} from "lucide-react";

const trainings = [
  {
    id: "genai",
    title: "IA Générative : enjeux techniques",
    seller: "AETHER LEARNING",
    icon: Cpu,
    iconGradient: "from-[hsl(280_80%_55%)] to-[hsl(320_70%_50%)]",
    rating: 4.8,
    reviews: 124,
    price: "Sur devis",
    size: "3h",
    category: "INTELLIGENCE ARTIFICIELLE",
    age: "Tous niveaux",
    description: "Comprenez le fonctionnement interne des LLM, leurs architectures (Transformer, attention), limites et cas d'usage stratégiques pour votre organisation.",
    highlights: [
      { icon: Layers, text: "Architecture Transformer & mécanismes d'attention" },
      { icon: Sparkles, text: "Cas d'usage concrets par industrie" },
      { icon: Users, text: "Atelier pratique en équipe" },
    ],
    screenshots: [
      { label: "Module 1", desc: "Fondamentaux LLM" },
      { label: "Module 2", desc: "Tokenization & embeddings" },
      { label: "Module 3", desc: "Fine-tuning & RAG" },
    ],
    badge: "Populaire",
    badgeColor: "bg-amber-500",
  },
  {
    id: "prompting",
    title: "Structurer vos prompts",
    seller: "AETHER LEARNING",
    icon: MessageSquare,
    iconGradient: "from-primary to-[hsl(260_70%_55%)]",
    rating: 4.9,
    reviews: 89,
    price: "Sur devis",
    size: "8h",
    category: "PRODUCTIVITÉ",
    age: "Intermédiaire",
    description: "Maîtrisez les techniques avancées de prompt engineering : chain-of-thought, few-shot, system prompts. Obtenez des résultats 100% exploitables.",
    highlights: [
      { icon: MessageSquare, text: "Chain-of-thought & few-shot learning" },
      { icon: Award, text: "Templates réutilisables par métier" },
      { icon: Zap, text: "Résultats exploitables dès J+1" },
    ],
    screenshots: [
      { label: "Module 1", desc: "Anatomy d'un prompt" },
      { label: "Module 2", desc: "Patterns avancés" },
      { label: "Module 3", desc: "Scoring & itération" },
    ],
    badge: "Recommandé",
    badgeColor: "bg-primary",
  },
  {
    id: "automation",
    title: "IA et automatisation de process",
    seller: "AETHER LEARNING",
    icon: Zap,
    iconGradient: "from-[hsl(200_80%_50%)] to-[hsl(260_70%_55%)]",
    rating: 4.7,
    reviews: 67,
    price: "Sur devis",
    size: "16h",
    category: "OPÉRATIONS",
    age: "Avancé",
    description: "Identifiez, concevez et déployez des workflows automatisés avec l'IA. Connectez vos outils, éliminez les tâches répétitives et libérez du temps stratégique.",
    highlights: [
      { icon: Zap, text: "Cartographie & priorisation des workflows" },
      { icon: Layers, text: "Orchestration multi-outils (n8n, Make, custom)" },
      { icon: Award, text: "ROI mesurable en 4 semaines" },
    ],
    screenshots: [
      { label: "Module 1", desc: "Audit de processus" },
      { label: "Module 2", desc: "Design de workflows" },
      { label: "Module 3", desc: "Déploiement & monitoring" },
    ],
    badge: "Nouveau",
    badgeColor: "bg-emerald-500",
  },
];

function AppDetailView({ training, isVisible }: {
  training: typeof trainings[0]; isVisible: boolean;
}) {
  const Icon = training.icon;

  return (
    <div className={cn(
      "transition-all duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* App header */}
      <div className="flex gap-4 p-4 sm:p-5">
        <div className={cn(
          "w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] bg-gradient-to-br flex items-center justify-center shadow-xl shrink-0 ring-1 ring-black/5",
          training.iconGradient
        )}>
          <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{training.title}</h3>
          <p className="text-xs text-primary font-medium mt-0.5">{training.seller}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{training.category}</p>

          <div className="flex items-center gap-3 mt-3">
            <a
              href="mailto:contact@aether-connect.com?subject=Formation IA — Demande d'information"
              className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              OBTENIR
            </a>
            <span className="text-[11px] text-slate-400 font-medium">{training.price}</span>
          </div>
        </div>
      </div>

      {/* Info pills */}
      <div className="grid grid-cols-4 border-y border-slate-100">
        {[
          { label: "Durée", value: training.size },
          { label: "Niveau", value: training.age },
          { label: "Note", value: `${training.rating}★` },
          { label: "Avis", value: `${training.reviews}` },
        ].map((pill) => (
          <div key={pill.label} className="text-center py-3 border-r border-slate-100 last:border-r-0">
            <div className="text-sm font-bold text-slate-800">{pill.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{pill.label}</div>
          </div>
        ))}
      </div>

      {/* Screenshots / Modules */}
      <div className="p-4 sm:p-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Aperçu du programme</h4>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
          {training.screenshots.map((s, i) => (
            <div
              key={i}
              className="shrink-0 w-32 sm:w-40 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 p-3 sm:p-4 hover:border-primary/30 hover:shadow-sm transition-all group cursor-default"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Play className="w-3 h-3 text-primary/50 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-xs font-medium text-slate-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description + highlights */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{training.description}</p>
        <div className="space-y-2">
          {training.highlights.map((h, i) => {
            const HIcon = h.icon;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-primary/8 flex items-center justify-center">
                  <HIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-slate-600 font-medium">{h.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AppListItem({ training, isActive, onClick, isVisible, delay }: {
  training: typeof trainings[0]; isActive: boolean; onClick: () => void; isVisible: boolean; delay: number;
}) {
  const Icon = training.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full text-left px-3 py-3 transition-all duration-500 border-b border-slate-100 last:border-b-0",
        isActive ? "bg-primary/5" : "hover:bg-slate-50",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn(
        "w-11 h-11 rounded-[12px] bg-gradient-to-br flex items-center justify-center shadow-md shrink-0 ring-1 ring-black/5",
        training.iconGradient
      )}>
        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-semibold text-slate-800 truncate">{training.title}</h4>
          <span className={cn(
            "text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shrink-0",
            training.badgeColor
          )}>{training.badge}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">{training.category} · {training.size}</p>
      </div>

      <ChevronRight className={cn(
        "w-4 h-4 shrink-0 transition-colors",
        isActive ? "text-primary" : "text-slate-300"
      )} />
    </button>
  );
}

export function TrainingsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTraining = trainings[activeIndex];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-700",
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
            title="AETHER ACADEMY v2.0 — Catalogue de formations"
            toolbar={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-semibold text-primary border-b-2 border-primary pb-0.5">Aujourd'hui</span>
                  <span className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-default">Catégories</span>
                  <span className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-default">Rechercher</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">3 formations · {trainings.reduce((a, t) => a + t.reviews, 0)} avis</span>
                <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Inscriptions ouvertes
                </span>
              </div>
            }
          >
            {/* Mobile: stacked cards */}
            <div className="sm:hidden">
              <AppDetailView training={activeTraining} isVisible={isVisible} />
              <div className="border-t border-slate-100 bg-slate-50/50">
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Autres formations</span>
                </div>
                {trainings.filter((_, i) => i !== activeIndex).map((t, i) => (
                  <AppListItem
                    key={t.id}
                    training={t}
                    isActive={false}
                    onClick={() => setActiveIndex(trainings.indexOf(t))}
                    isVisible={isVisible}
                    delay={i * 100 + 300}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: sidebar + detail */}
            <div className="hidden sm:grid sm:grid-cols-[220px_1fr]">
              {/* Sidebar list */}
              <div className="border-r border-slate-100 bg-slate-50/30">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-100/80">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="text-[11px] text-slate-400">Rechercher…</span>
                  </div>
                </div>
                {trainings.map((t, i) => (
                  <AppListItem
                    key={t.id}
                    training={t}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                    isVisible={isVisible}
                    delay={i * 100 + 200}
                  />
                ))}
              </div>

              {/* Detail pane */}
              <AppDetailView training={activeTraining} isVisible={isVisible} />
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
