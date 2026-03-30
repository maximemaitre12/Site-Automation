import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "./MacWindow";
import { useState } from "react";
import { ChevronRight, Activity } from "lucide-react";
import awsLogo from "@/assets/partners/aws.png";
import microsoftLogo from "@/assets/partners/microsoft.png";
import gcpLogo from "@/assets/partners/gcp.png";
import confluentLogo from "@/assets/partners/confluent.png";

const partners = [
  {
    name: "Amazon Web Services",
    short: "AWS",
    tag: "CLOUD-01",
    tier: "Premier Partner",
    gradient: "from-primary to-[hsl(260_70%_60%)]",
    glowColor: "hsl(239,84%,67%)",
    desc: "Infrastructure cloud, compute distribué et services IA managés (SageMaker, Bedrock).",
    stats: [
      { label: "Régions", value: "33" },
      { label: "Services", value: "200+" },
      { label: "SLA", value: "99.99%" },
    ],
    logo: awsLogo,
    logoAlt: "AWS",
  },
  {
    name: "Microsoft Azure",
    short: "Microsoft",
    tag: "CLOUD-02",
    tier: "Gold Partner",
    gradient: "from-[hsl(210,85%,50%)] to-[hsl(200,80%,55%)]",
    glowColor: "hsl(210,85%,50%)",
    desc: "Écosystème Azure, OpenAI Service, intégration native M365 et sécurité enterprise.",
    stats: [
      { label: "Datacenters", value: "60+" },
      { label: "IA Models", value: "GPT-4o" },
      { label: "Compliance", value: "90+" },
    ],
    logo: microsoftLogo,
    logoAlt: "Microsoft",
  },
  {
    name: "Google Cloud Platform",
    short: "Google Cloud",
    tag: "CLOUD-03",
    tier: "Partner",
    gradient: "from-[hsl(200,80%,55%)] to-primary",
    glowColor: "hsl(200,80%,55%)",
    desc: "BigQuery, Vertex AI, Gemini API. Analytics avancées et infrastructure data à l'échelle.",
    stats: [
      { label: "Régions", value: "40" },
      { label: "IA", value: "Gemini" },
      { label: "Data", value: "BigQuery" },
    ],
    logo: gcpLogo,
    logoAlt: "Google Cloud",
  },
  {
    name: "Confluent",
    short: "Confluent",
    tag: "DATA-04",
    tier: "Technology Partner",
    gradient: "from-[hsl(260,70%,60%)] to-[hsl(280,60%,55%)]",
    glowColor: "hsl(260,70%,60%)",
    desc: "Streaming de données en temps réel avec Apache Kafka managé. Event-driven architecture.",
    stats: [
      { label: "Throughput", value: "10M/s" },
      { label: "Latence", value: "< 5ms" },
      { label: "Connectors", value: "120+" },
    ],
    logo: confluentLogo,
    logoAlt: "Confluent",
  },
];

/* ── Connection line SVG ── */
function ConnectionPulse({ color, isVisible, delay }: { color: string; isVisible: boolean; delay: number }) {
  return (
    <div className="h-5 flex items-center justify-center">
      <div className="relative w-full h-px">
        <div className="absolute inset-0 bg-slate-800" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r transition-all ease-out"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${color}, transparent)`,
            width: isVisible ? '100%' : '0%',
            transitionDuration: '1.5s',
            transitionDelay: `${delay}ms`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            right: '0',
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.5s ${delay + 800}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Mobile partner card ── */
function MobilePartnerCard({ partner, index, isVisible }: {
  partner: typeof partners[0]; index: number; isVisible: boolean;
}) {
  
  const delay = index * 120 + 200;

  return (
    <div
      className={cn(
        "rounded-xl bg-white/[0.03] border border-white/5 p-3.5 transition-all duration-500 hover:border-primary/15",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-slate-200 p-1.5">
          <img src={partner.logo} alt={partner.logoAlt} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">{partner.short}</span>
            <span className="text-[8px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{partner.tag}</span>
          </div>
          <span className="text-[10px] text-primary/60 font-medium">{partner.tier}</span>
        </div>
        <span className="flex items-center gap-1 text-[9px] text-primary font-mono shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Actif
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{partner.desc}</p>

      <div className="grid grid-cols-3 gap-1.5">
        {partner.stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-slate-800/50 p-2 text-center">
            <div className="text-[11px] font-bold font-mono text-white">{s.value}</div>
            <div className="text-[8px] text-slate-600 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Desktop partner row ── */
function PartnerRow({ partner, index, isActive, onClick, isVisible }: {
  partner: typeof partners[0]; index: number; isActive: boolean;
  onClick: () => void; isVisible: boolean;
}) {
  
  const delay = index * 100 + 200;

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 w-full text-left px-4 py-3.5 border-b border-slate-700/20 transition-all duration-300 group",
          isActive ? "bg-primary/5" : "hover:bg-white/[0.02]",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-slate-200 p-1.5">
          <img src={partner.logo} alt={partner.logoAlt} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-300 truncate">{partner.short}</span>
            <span className="text-[8px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{partner.tag}</span>
          </div>
          <span className="text-[9px] text-primary/50 font-medium">{partner.tier}</span>
        </div>

        <span className="flex items-center gap-1 text-[9px] text-primary font-mono shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>

        <ChevronRight className={cn(
          "w-3.5 h-3.5 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-slate-700"
        )} />
      </button>
      {index < partners.length - 1 && (
        <ConnectionPulse color={partner.glowColor} isVisible={isVisible} delay={delay + 400} />
      )}
    </>
  );
}

/* ── Detail pane ── */
function PartnerDetail({ partner, isVisible }: { partner: typeof partners[0]; isVisible: boolean }) {
  
  return (
    <div className={cn("p-5 lg:p-6 transition-all duration-400", isVisible ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={cn(
          "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl ring-1 ring-white/10 shrink-0",
          partner.gradient
        )} style={{ boxShadow: `0 0 24px ${partner.glowColor}20` }}>
          <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base lg:text-lg font-bold text-white">{partner.name}</h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-primary/70 font-medium backdrop-blur">
            {partner.tier}
          </span>
          <p className="text-[11px] lg:text-xs text-slate-500 mt-2 leading-relaxed max-w-md">{partner.desc}</p>
        </div>
      </div>

      {/* Logo display */}
      <div className="rounded-xl bg-white/[0.04] border border-white/5 p-4 mb-5 flex items-center justify-center">
        <div className="text-slate-400 scale-150 origin-center">
          {partner.logo}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {partner.stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center hover:border-primary/15 transition-colors">
            <div className="text-sm lg:text-base font-bold font-mono text-white">{s.value}</div>
            <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Connecté
        </span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-500 font-mono">Sync: real-time</span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-500 font-mono">Certifié</span>
      </div>
    </div>
  );
}

export function PartnersSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = partners[activeIndex];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.15)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Écosystème</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Nos partenaires
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Nous collaborons avec les leaders du cloud et de la data pour déployer des solutions fiables à grande échelle.
          </p>
        </div>

        <div className={cn(
          "transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
        )}>
          <MacWindow
            variant="dark"
            title="AETHER NETWORK v3.0 — Partner Hub"
            toolbar={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {["Partenaires", "Intégrations", "Certifications"].map((t, i) => (
                    <span key={t} className={cn(
                      "text-[11px] transition-colors cursor-default",
                      i === 0
                        ? "font-semibold text-primary border-b-2 border-primary pb-0.5"
                        : "text-slate-500 hover:text-slate-300"
                    )}>{t}</span>
                  ))}
                </div>
                <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  4/4 connected
                </span>
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">4 partenaires · infrastructure multi-cloud</span>
                <span className="font-mono text-[10px] text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Toutes connexions actives
                </span>
              </div>
            }
          >
            {/* ── MOBILE ── */}
            <div className="sm:hidden p-3 space-y-2.5">
              {partners.map((p, i) => (
                <MobilePartnerCard key={p.tag} partner={p} index={i} isVisible={isVisible} />
              ))}
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden sm:grid sm:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr]">
              {/* Left list */}
              <div className="border-r border-slate-700/30 bg-slate-900/40 py-2">
                {partners.map((p, i) => (
                  <PartnerRow
                    key={p.tag}
                    partner={p}
                    index={i}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                    isVisible={isVisible}
                  />
                ))}
              </div>

              {/* Right detail */}
              <PartnerDetail partner={active} isVisible={isVisible} />
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
