import { Check, Clock, MapPin, Users } from "lucide-react";

const phases = [
  {
    num: "1",
    color: "#0D8B5E",
    label: "DIAGNOSTIC & ASSESSMENT",
    duration: "Semaines 1-2",
    desc: "Audit exhaustif de votre réalité pharma. Interviews Ops, Quality, Regulatory teams. Gap analysis vs. FDA/EMA/GMP standards.",
    deliverables: [
      "Diagnostic report (30 pages)",
      "Gap analysis matrix",
      "Compliance risk scorecard",
      "Prioritized roadmap",
      "Investment estimate",
      "Executive presentation",
    ],
    time: "10-14 jours",
    location: "On-site: 3-4 jours (interviews)",
    effort: "5-10h de votre temps",
    quote: "Vous avez une image claire de votre compliance gap et un plan priorisé pour le combler.",
  },
  {
    num: "2",
    color: "#FF8A45",
    label: "STRATEGY & DESIGN",
    duration: "Semaines 3-5",
    desc: "Dessiner votre solution pharma-optimized. Process redesign, regulatory compliance review, technology blueprint.",
    deliverables: [
      "Detailed implementation roadmap",
      "Process documentation (SOPs)",
      "System specifications",
      "Regulatory strategy document",
      "Risk mitigation plan",
      "Stakeholder communication plan",
    ],
    time: "12-16 jours",
    location: "Hybrid: Remote + 2 on-site sessions",
    effort: "8-15h de votre temps (workshops)",
    quote: "Vous avez un blueprint détaillé, signé, prêt à implémenter.",
  },
  {
    num: "3",
    color: "#1A3A6B",
    label: "IMPLEMENTATION & ROLLOUT",
    duration: "Semaines 6-12",
    desc: "Faire passer votre stratégie en réalité. Process redesign, team training, system implementation, validation GxP.",
    deliverables: [
      "Implemented processes",
      "Trained team (certified)",
      "Documentation (audit-ready)",
      "Validation records",
      "Go-live readiness report",
      "Support plan (6-12 months)",
    ],
    time: "20-24 jours",
    location: "On-site: 2-3 jours/semaine",
    effort: "15-20h/semaine votre équipe",
    quote: "Vos processus transformés sont en production. Votre équipe est formée et autonome.",
  },
  {
    num: "4",
    color: "#4A5568",
    label: "SUSTAINMENT & CONTINUOUS IMPROVEMENT",
    duration: "Mois 2-12 (inclus)",
    desc: "Assurer que vos changements persistent et s'améliorent. Weekly check-ins, issue resolution, performance monitoring.",
    deliverables: [
      "Monthly performance reports",
      "Improvement recommendations",
      "Team capabilities enhanced",
      "Audit-ready documentation",
      "Full knowledge transfer",
    ],
    time: "Continu (12 mois inclus)",
    location: "Support remote + on-demand",
    effort: "2-4h/semaine check-ins",
    quote: "Vos KPIs s'améliorent continuellement. Vous êtes autonomes et audit-ready.",
  },
];

export function PharmaMethodology() {
  return (
    <section id="methodology" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-5" style={{ color: "#1A3A6B" }}>
            Comment nous travaillons avec les pharmas
          </h2>
          <p className="text-lg" style={{ color: "#4A5568" }}>
            Processus éprouvé, sans disruption opérationnelle.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-[3px] hidden md:block" style={{ background: "#4A5568" }} />

          <div className="space-y-16">
            {phases.map((phase) => (
              <div key={phase.num} className="relative md:pl-20">
                <div
                  className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-full items-center justify-center text-white text-lg font-bold"
                  style={{ background: phase.color }}
                >
                  {phase.num}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="md:hidden flex w-10 h-10 rounded-full items-center justify-center text-white text-sm font-bold"
                      style={{ background: phase.color }}
                    >
                      {phase.num}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold" style={{ color: "#1A3A6B" }}>{phase.label}</h3>
                      <span className="text-sm font-medium" style={{ color: "#6B7C8C" }}>{phase.duration}</span>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>{phase.desc}</p>

                  <div className="rounded-lg p-5 mb-4" style={{ background: "#F9FBFC", borderLeft: "4px solid #0D8B5E" }}>
                    <ul className="space-y-1">
                      {phase.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                          <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0D8B5E" }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs mb-4" style={{ color: "#6B7C8C" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {phase.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {phase.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {phase.effort}</span>
                  </div>

                  <p className="text-sm italic pl-3" style={{ color: "#1A3A6B", borderLeft: "4px solid #1A3A6B" }}>
                    "{phase.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
