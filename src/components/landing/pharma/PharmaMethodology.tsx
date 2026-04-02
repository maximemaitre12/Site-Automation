import { Check, Clock, MapPin, Users } from "lucide-react";

const phases = [
  {
    num: "1",
    color: "#FF6B35",
    label: "DIAGNOSTIC",
    duration: "Semaine 1",
    desc: "Audit exhaustif de vos processus critiques. Identification des goulots et opportunités d'automation.",
    deliverables: [
      "Analyse détaillée (20 pages)",
      "Cartographie des processus",
      "Identification 5-7 points d'automation",
      "Évaluation ROI par process",
      "Recommandations prioritaires",
      "Plan d'implémentation",
    ],
    time: "5-7 jours",
    location: "On-site + virtual calls",
    effort: "5-10h de votre temps",
    quote: "À la fin, vous avez un roadmap clair avec chiffres de ROI validés.",
  },
  {
    num: "2",
    color: "#17A2B8",
    label: "CONCEPTION",
    duration: "Semaines 2-3",
    desc: "Design détaillé de la solution IA. Intégration avec vos systèmes (ERP, CRM, legacy systems).",
    deliverables: [
      "Architecture technique complète",
      "Data flows et intégrations mapping",
      "Design des automations (workflows)",
      "Spécifications réglementaires (21 CFR, GMP, GDPR)",
      "Plan de test et validation",
      "Documentation technique + user guides",
    ],
    time: "10-14 jours",
    location: "Hybrid (remote + 2-3 calls on-site)",
    effort: "3-5h de votre temps (workshops)",
    quote: "Vous avez un technical blueprint signé, testé, prêt à déployer.",
  },
  {
    num: "3",
    color: "#2CAA56",
    label: "IMPLÉMENTATION & DÉPLOIEMENT",
    duration: "Semaines 4-6",
    desc: "Développement des automations. Tests rigoureux. Déploiement progressif. Formation équipe.",
    deliverables: [
      "Automations développées & testées",
      "Intégration complète (on-premise ou cloud)",
      "Data migration & validation",
      "Environnement production prêt",
      "Formation équipe (2 sessions)",
      "Documentation utilisateur + troubleshooting",
    ],
    time: "14-21 jours",
    location: "Remote + on-site support",
    effort: "2-3h/jour votre équipe",
    quote: "Vos 3-5 first automations sont live en production. Votre équipe peut les utiliser.",
  },
  {
    num: "4",
    color: "#0033CC",
    label: "OPTIMISATION & SCALING",
    duration: "Mois 2+",
    desc: "Monitoring en temps réel. Optimisations continues. Déploiement des prochaines automations.",
    deliverables: [
      "Dashboard de monitoring temps-réel",
      "Weekly optimization reports",
      "Triage des bugs (24h SLA)",
      "Roadmap pour les prochaines automations",
      "Retraining régulière équipe",
    ],
    time: "Continu (12 mois support inclus)",
    location: "Support remote",
    effort: "1-2h/semaine check-ins",
    quote: "Vos KPIs s'améliorent continuellement. Vous avez identifié 5+ nouvelles automations.",
  },
];

export function PharmaMethodology() {
  return (
    <section className="py-24" style={{ background: "#FAFBFC" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] font-bold mb-5" style={{ color: "#0033CC" }}>
            Notre processus : De l'audit au résultat en 4-6 semaines
          </h2>
          <p className="text-lg" style={{ color: "#4A4A4A" }}>
            Pas de Powerpoint inutile. Pas de 6 mois de planning. Juste des résultats opérationnels rapides.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-[3px] hidden md:block" style={{ background: "#17A2B8" }} />

          <div className="space-y-16">
            {phases.map((phase) => (
              <div key={phase.num} className="relative md:pl-20">
                {/* Circle marker */}
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
                      <h3 className="font-heading text-lg font-bold" style={{ color: "#0033CC" }}>{phase.label}</h3>
                      <span className="text-sm font-medium" style={{ color: "#6B7C8C" }}>{phase.duration}</span>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>{phase.desc}</p>

                  {/* Deliverables */}
                  <div className="rounded-lg p-5 mb-4" style={{ background: "#F9FBFF", borderLeft: "4px solid #17A2B8" }}>
                    <ul className="space-y-1">
                      {phase.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                          <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#17A2B8" }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Duration info */}
                  <div className="flex flex-wrap gap-4 text-xs mb-4" style={{ color: "#6B7C8C" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {phase.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {phase.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {phase.effort}</span>
                  </div>

                  {/* Quote */}
                  <p className="text-sm italic pl-3" style={{ color: "#0033CC", borderLeft: "4px solid #0033CC" }}>
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
