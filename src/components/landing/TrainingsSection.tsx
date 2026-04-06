import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "./MacWindow";
import { useState } from "react";
import {
  Cpu, MessageSquare, Zap, Download, Clock, Award,
  Layers, Sparkles, BookOpen, Target, Code, Brain,
  ChevronRight, GraduationCap, Users
} from "lucide-react";

const trainings = [
  {
    id: "genai",
    shortName: "GenAI",
    title: "IA Générative : enjeux techniques",
    icon: Cpu,
    iconGradient: "from-[hsl(260,70%,60%)] to-primary",
    glowColor: "hsl(260,70%,60%)",
    duration: "3h",
    level: "Tous niveaux",
    format: "Présentiel / Visio",
    progress: 92,
    description: "Comprenez le fonctionnement interne des LLM, leurs architectures (Transformer, attention), limites et cas d'usage stratégiques.",
    modules: [
      { icon: Brain, title: "Fondamentaux LLM", desc: "Architecture Transformer & mécanismes d'attention" },
      { icon: Code, title: "Tokenization & Embeddings", desc: "Représentation vectorielle et traitement du langage" },
      { icon: Layers, title: "Fine-tuning & RAG", desc: "Adaptation de modèles et retrieval augmented generation" },
    ],
    skills: [
      { label: "Architecture LLM", value: 90 },
      { label: "Prompt Design", value: 75 },
      { label: "Cas d'usage IA", value: 85 },
    ],
    takeaways: [
      { icon: Target, text: "Évaluer la pertinence des LLM" },
      { icon: Sparkles, text: "Identifier les cas d'usage" },
      { icon: Award, text: "Certification incluse" },
    ],
  },
  {
    id: "prompting",
    shortName: "Prompts",
    title: "Structurer vos prompts",
    icon: MessageSquare,
    iconGradient: "from-primary to-[hsl(260,70%,55%)]",
    glowColor: "hsl(245,70%,55%)",
    duration: "8h",
    level: "Intermédiaire",
    format: "Workshop intensif",
    progress: 87,
    description: "Maîtrisez les techniques avancées de prompt engineering : chain-of-thought, few-shot, system prompts.",
    modules: [
      { icon: BookOpen, title: "Anatomie d'un prompt", desc: "Structure, rôles et paramètres de contrôle" },
      { icon: Code, title: "Patterns avancés", desc: "Chain-of-thought, few-shot, tree-of-thought" },
      { icon: Target, title: "Scoring & itération", desc: "Évaluation systématique et boucles d'amélioration" },
    ],
    skills: [
      { label: "Chain-of-Thought", value: 95 },
      { label: "System Prompts", value: 88 },
      { label: "Few-shot Learning", value: 82 },
    ],
    takeaways: [
      { icon: Target, text: "Templates réutilisables" },
      { icon: Sparkles, text: "Résultats dès J+1" },
      { icon: Award, text: "Certification incluse" },
    ],
  },
  {
    id: "automation",
    shortName: "Auto",
    title: "IA et automatisation de process",
    icon: Zap,
    iconGradient: "from-[hsl(200,80%,50%)] to-[hsl(260,70%,55%)]",
    glowColor: "hsl(230,75%,52%)",
    duration: "16h",
    level: "Avancé",
    format: "Programme complet",
    progress: 78,
    description: "Identifiez, concevez et déployez des workflows automatisés avec l'IA. Connectez vos outils et éliminez les tâches répétitives.",
    modules: [
      { icon: Target, title: "Audit de processus", desc: "Cartographie et priorisation des workflows à automatiser" },
      { icon: Layers, title: "Design de workflows", desc: "Orchestration multi-outils (n8n, Make, custom)" },
      { icon: Zap, title: "Déploiement & monitoring", desc: "Mise en production, alertes et ROI tracking" },
    ],
    skills: [
      { label: "Workflow Design", value: 92 },
      { label: "Orchestration", value: 85 },
      { label: "ROI Measurement", value: 80 },
    ],
    takeaways: [
      { icon: Target, text: "ROI mesurable en 4 sem." },
      { icon: Sparkles, text: "Workflows déployés" },
      { icon: Award, text: "Certification incluse" },
    ],
  },
];

/* ── Circular Progress Ring ── */
function ProgressRing({ value, size = 36, stroke = 3, color }: {
  value: number; size?: number; stroke?: number; color: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(220,15%,20%)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        className="fill-slate-300 text-[8px] font-bold rotate-90 origin-center"
        transform={`rotate(90 ${size / 2} ${size / 2})`}>
        {value}%
      </text>
    </svg>
  );
}

/* ── Animated Skill Bar ── */
function SkillBar({ label, value, isVisible, delay }: {
  label: string; value: number; isVisible: boolean; delay: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">{label}</span>
        <span className="text-[10px] font-mono font-bold text-slate-300">{value}%</span>
      </div>
      <div className="h-1.5 sm:h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(280,70%,55%)] transition-all ease-out"
          style={{
            width: isVisible ? `${value}%` : '0%',
            transitionDuration: '1.2s',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Timeline Node ── */
function TimelineNode({ module, index, isLast, isVisible }: {
  module: typeof trainings[0]["modules"][0];
  index: number; isLast: boolean; isVisible: boolean;
}) {
  const Icon = module.icon;
  return (
    <div
      className={cn(
        "flex gap-3 transition-all duration-500",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${index * 150 + 200}ms` }}
    >
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-primary to-[hsl(280,70%,55%)] flex items-center justify-center ring-2 ring-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={2} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[28px] bg-gradient-to-b from-primary/40 to-[hsl(280,70%,55%)/0.2]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-4 sm:pb-5 -mt-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 leading-tight">{module.title}</h4>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">{module.desc}</p>
      </div>
    </div>
  );
}

export function TrainingsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = trainings[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220,20%,18%/0.4)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Formation</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Nos formations IA
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Des programmes conçus pour vos équipes, du niveau découverte à l'expertise opérationnelle.
          </p>
        </div>

        <div className={cn(
          "transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
        )}>
          <MacWindow
            variant="dark"
            title="AETHER LEARNING STUDIO v3.0 — Formation IA"
            toolbar={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {["Curriculum", "Compétences", "Certification"].map((t, i) => (
                    <span key={t} className={cn(
                      "text-[11px] transition-colors cursor-default",
                      i === 0
                        ? "font-semibold text-primary border-b-2 border-primary pb-0.5"
                        : "text-slate-500 hover:text-slate-300"
                    )}>{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">3 programmes · 27h de formation</span>
                <span className="font-mono text-[10px] text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Inscriptions ouvertes
                </span>
              </div>
            }
          >
            {/* ── MOBILE: Tabs + Content ── */}
            <div className="sm:hidden">
              {/* Horizontal tabs */}
              <div className="flex border-b border-slate-700/50 overflow-x-auto">
                {trainings.map((t, i) => {
                  const TIcon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium whitespace-nowrap shrink-0 border-b-2 transition-all",
                        i === activeIndex
                          ? "text-primary border-primary bg-primary/5"
                          : "text-slate-500 border-transparent hover:text-slate-300"
                      )}
                    >
                      <TIcon className="w-3.5 h-3.5" />
                      {t.shortName}
                    </button>
                  );
                })}
              </div>

              {/* Mobile content */}
              <div className="p-4 space-y-5">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg ring-1 ring-white/10", active.iconGradient)}
                    style={{ boxShadow: `0 0 20px ${active.glowColor}30` }}
                  >
                    <ActiveIcon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">{active.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{active.description}</p>
                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {[
                      { icon: Clock, text: active.duration },
                      { icon: Users, text: active.level },
                      { icon: BookOpen, text: active.format },
                    ].map((b) => (
                      <span key={b.text} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 backdrop-blur border border-white/10 text-[10px] text-slate-400">
                        <b.icon className="w-3 h-3" />{b.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Programme</h4>
                  {active.modules.map((m, i) => (
                    <TimelineNode key={i} module={m} index={i} isLast={i === active.modules.length - 1} isVisible={isVisible} />
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Compétences acquises</h4>
                  <div className="space-y-2.5">
                    {active.skills.map((s, i) => (
                      <SkillBar key={s.label} label={s.label} value={s.value} isVisible={isVisible} delay={i * 200 + 400} />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="mailto:maxime.maitre@edu.em-lyon.com,youriy.strashnyi@edu.em-lyon.com?subject=Formation IA — Demande d'information"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Demander un devis
                </a>
              </div>
            </div>

            {/* ── DESKTOP: Sidebar + Detail ── */}
            <div className="hidden sm:grid sm:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <div className="border-r border-slate-700/40 bg-slate-900/60">
                <div className="px-3 py-2.5 border-b border-slate-700/30">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Programmes</span>
                </div>
                {trainings.map((t, i) => {
                  const TIcon = t.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "flex items-center gap-3 w-full text-left px-3 py-3 border-b border-slate-700/20 transition-all duration-300",
                        isActive ? "bg-primary/5" : "hover:bg-white/[0.02]",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      )}
                      style={{ transitionDelay: `${i * 100 + 200}ms` }}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0 ring-1 ring-white/10",
                        t.iconGradient
                      )}
                        style={{ boxShadow: isActive ? `0 0 16px ${t.glowColor}25` : undefined }}
                      >
                        <TIcon className="w-4 h-4 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-semibold text-slate-300 truncate">{t.title}</h4>
                        <span className="text-[9px] text-slate-600">{t.duration} · {t.level}</span>
                      </div>
                      <ProgressRing value={t.progress} color={t.glowColor} />
                    </button>
                  );
                })}
              </div>

              {/* Main pane */}
              <div className={cn(
                "transition-all duration-400",
                isVisible ? "opacity-100" : "opacity-0"
              )}>
                {/* Course header */}
                <div className="p-5 lg:p-6 border-b border-slate-700/30">
                  <div className="flex gap-4 items-start">
                    <div
                      className={cn("w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl ring-1 ring-white/10 shrink-0", active.iconGradient)}
                      style={{ boxShadow: `0 0 24px ${active.glowColor}25` }}
                    >
                      <ActiveIcon className="w-7 h-7 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base lg:text-lg font-bold text-white leading-tight">{active.title}</h3>
                      <p className="text-[11px] lg:text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md">{active.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {[
                          { icon: Clock, text: active.duration },
                          { icon: Users, text: active.level },
                          { icon: BookOpen, text: active.format },
                        ].map((b) => (
                          <span key={b.text} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 backdrop-blur border border-white/10 text-[10px] text-slate-400">
                            <b.icon className="w-3 h-3" />{b.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href="mailto:contact@aether-connect.com?subject=Formation IA — Demande d'information"
                      className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-[0_0_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Demander un devis
                    </a>
                  </div>
                </div>

                {/* Body: Timeline + Skills side by side on lg */}
                <div className="p-5 lg:p-6 lg:grid lg:grid-cols-[1fr_200px] lg:gap-6">
                  {/* Timeline */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Curriculum</h4>
                    {active.modules.map((m, i) => (
                      <TimelineNode key={i} module={m} index={i} isLast={i === active.modules.length - 1} isVisible={isVisible} />
                    ))}

                    {/* Takeaways */}
                    <div className="flex gap-2 mt-2">
                      {active.takeaways.map((t, i) => {
                        const TIcon = t.icon;
                        return (
                          <div key={i} className="flex-1 rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-primary/20 transition-colors">
                            <TIcon className="w-3.5 h-3.5 text-primary/60 mb-1" />
                            <span className="text-[10px] text-slate-400 leading-tight block">{t.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 mt-5 lg:mt-0">Compétences</h4>
                    <div className="space-y-3">
                      {active.skills.map((s, i) => (
                        <SkillBar key={s.label} label={s.label} value={s.value} isVisible={isVisible} delay={i * 200 + 300} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile CTA for sm breakpoint */}
                <div className="px-5 pb-5 lg:hidden">
                  <a
                    href="mailto:contact@aether-connect.com?subject=Formation IA — Demande d'information"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-[0_0_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Demander un devis
                  </a>
                </div>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
