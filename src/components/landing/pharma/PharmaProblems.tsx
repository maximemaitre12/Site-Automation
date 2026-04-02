import { Users, Link2, Scale, Check } from "lucide-react";

const columns = [
  {
    icon: Users,
    iconColor: "#0D8B5E",
    title: "Talent Pharma",
    problem: "Recruter en regulatory affairs, quality assurance, manufacturing. C'est complexe.",
    pains: [
      "Talent pool limité — Salaires très élevés (€60-80k)",
      "Temps de recruitment: 24-32 semaines en moyenne",
      "Erreurs regulatory = FDA warning letters (€500k+)",
      "Turnover en quality = production delays & compliance gaps",
    ],
    costLabel: "Coût d'une mauvaise hire pharma:",
    costValue: "€180,000+",
    costSub: "(quality incidents + remplacement)",
    costBg: "#FFF9F0",
    costBorder: "#FF8A45",
    solutions: ["Cartographie des vrais besoins pharma", "Screening basé sur regulatory knowledge", "Validation compétences FDA/EMA", "Time-to-hire: 24 sem → 6 sem"],
  },
  {
    icon: Link2,
    iconColor: "#0D8B5E",
    title: "GMP & Traçabilité",
    problem: "GMP, traçabilité, batch records. Maîtriser sans ralentir la prod.",
    pains: [
      "Batch records = 200-400 pages par batch, documentation manuelle",
      "Validation systèmes = 6-12 mois, €200k+ d'investissement",
      "Change control = processus très lourd, ralentit l'innovation",
      "Validation manquée = FDA can stop production",
    ],
    costLabel: "Risque product recall:",
    costValue: "€1M+",
    costSub: "(mauvaise traçabilité)",
    costBg: "#F0FFF4",
    costBorder: "#0D8B5E",
    solutions: ["GMP implémenté chez de nombreux clients", "Batch records automatisés mais auditables", "Audit trail immuable (21 CFR Part 11)", "Compliance 100% + 0% ralentissement prod"],
  },
  {
    icon: Scale,
    iconColor: "#1A3A6B",
    title: "Compliance & Scaling",
    problem: "Scaler vos opérations. Sans perdre la conformité.",
    pains: [
      "Chaque expansion = projet 18+ mois de complexité réglementaire",
      "Coûts regulatory: €500k-2M par expansion marché",
      "Compliance team ne peut pas scaler à la vitesse du business",
      "Concurrents expansent plus vite → perte de market share",
    ],
    costLabel: "Temps expansion avec compliance:",
    costValue: "18+ mois",
    costSub: "Risque: Mauvaise compliance = perte marché",
    costBg: "#F3F4FF",
    costBorder: "#1A3A6B",
    solutions: ["Framework de compliance scalable", "Processes documentés, reproductibles", "Audit-ready dès le départ", "Expansion 18 mois → 8 mois, coûts -40%"],
  },
];

export function PharmaProblems() {
  return (
    <section id="challenges" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] font-bold mb-5" style={{ color: "#1A3A6B" }}>
            Les défis opérationnels que seul
            <br className="hidden md:block" />
            un expert pharma comprend.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4A5568" }}>
            Nous ne vous vendons pas de solutions génériques. Nous comprenons votre réalité pharma.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {columns.map((col) => (
            <div key={col.title} className="rounded-lg p-8" style={{ background: "#F9FBFC" }}>
              <col.icon className="w-14 h-14 mb-4" style={{ color: col.iconColor }} />
              <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#1A3A6B" }}>{col.title}</h3>
              <p className="text-base mb-4" style={{ color: "#2C3E50" }}>{col.problem}</p>

              <ul className="space-y-2 mb-5">
                {col.pains.map((p) => (
                  <li key={p} className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                    <span style={{ color: "#FF8A45" }}>•</span> {p}
                  </li>
                ))}
              </ul>

              <div className="rounded-lg p-4 mb-5" style={{ background: col.costBg, borderLeft: `4px solid ${col.costBorder}` }}>
                <div className="text-sm" style={{ color: "#2C3E50" }}>{col.costLabel}</div>
                <div className="text-2xl font-bold" style={{ color: col.costBorder }}>{col.costValue}</div>
                <div className="text-sm" style={{ color: "#6B7C8C" }}>{col.costSub}</div>
              </div>

              <ul className="space-y-1.5">
                {col.solutions.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: "#2C3E50" }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: "#0D8B5E" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
