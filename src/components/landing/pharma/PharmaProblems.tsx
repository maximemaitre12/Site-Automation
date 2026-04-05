import { Users, Link2, Scale } from "lucide-react";

const columns = [
  {
    icon: Users,
    title: "Talent Pharma",
    subtitle: "Recruter en regulatory affairs, quality assurance, manufacturing.",
    points: [
      "Talent pool extrêmement limité",
      "Time-to-hire: 24-32 semaines",
      "Erreurs regulatory = FDA warning letters",
      "Turnover quality = production delays",
    ],
    result: "Time-to-hire: 24 sem → 6 sem",
    color: "#F97316",
  },
  {
    icon: Link2,
    title: "GMP & Traçabilité",
    subtitle: "Maîtriser la traçabilité et les batch records sans ralentir la production.",
    points: [
      "Batch records = 200-400 pages/batch",
      "Validation systèmes = 6-12 mois",
      "Change control trop lourd",
      "Validation manquée = arrêt production FDA",
    ],
    result: "Compliance 100%, 0% ralentissement",
    color: "#0891B2",
  },
  {
    icon: Scale,
    title: "Compliance & Scaling",
    subtitle: "Scaler vos opérations sans perdre la conformité réglementaire.",
    points: [
      "Chaque expansion = 18+ mois complexité",
      "Coûts regulatory: €500k-2M/expansion",
      "Compliance ne scale pas assez vite",
      "Concurrents expansent plus vite",
    ],
    result: "Expansion 18 mois → 8 mois",
    color: "#1E40AF",
  },
];

export function PharmaProblems() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Les défis que seul un{" "}
            <span style={{ color: "#0891B2" }}>expert pharma</span> comprend
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Nous comprenons votre réalité pharma. Pas de solutions génériques.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div
              key={col.title}
              className="rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 group"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: `${col.color}15` }}
              >
                <col.icon className="w-7 h-7" style={{ color: col.color }} />
              </div>

              <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#0F172A" }}>{col.title}</h3>
              <p className="text-sm mb-6" style={{ color: "#64748B" }}>{col.subtitle}</p>

              <ul className="space-y-3 mb-8">
                {col.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm" style={{ color: "#475569" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: col.color }} />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="pt-4" style={{ borderTop: "1px solid #E2E8F0" }}>
                <div className="text-sm font-bold" style={{ color: col.color }}>
                  {col.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
