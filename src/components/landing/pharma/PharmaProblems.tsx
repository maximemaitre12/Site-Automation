const columns = [
  {
    num: "01",
    title: "Talent Pharma",
    subtitle: "Recruter en regulatory affairs, quality assurance, manufacturing.",
    points: [
      "Talent pool extrêmement limité",
      "Time-to-hire: 24-32 semaines",
      "Erreurs regulatory = FDA warning letters",
      "Turnover quality = production delays",
    ],
    result: "Time-to-hire: 24 sem → 6 sem",
  },
  {
    num: "02",
    title: "GMP & Traçabilité",
    subtitle: "Maîtriser la traçabilité et les batch records sans ralentir la production.",
    points: [
      "Batch records = 200-400 pages/batch",
      "Validation systèmes = 6-12 mois",
      "Change control trop lourd",
      "Validation manquée = arrêt production FDA",
    ],
    result: "Compliance 100%, 0% ralentissement",
  },
  {
    num: "03",
    title: "Compliance & Scaling",
    subtitle: "Scaler vos opérations sans perdre la conformité réglementaire.",
    points: [
      "Chaque expansion = 18+ mois complexité",
      "Coûts regulatory: €500k-2M/expansion",
      "Compliance ne scale pas assez vite",
      "Concurrents expansent plus vite",
    ],
    result: "Expansion 18 mois → 8 mois",
  },
];

export function PharmaProblems() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Défis
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Les défis que seul un expert
            <br />pharma comprend.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 divide-x" style={{ borderColor: "#E2E8F0" }}>
          {columns.map((col) => (
            <div key={col.num} className="px-8 first:pl-0 last:pr-0">
              <span className="text-xs font-mono tracking-wider" style={{ color: "#94A3B8" }}>
                {col.num}
              </span>
              <h3 className="font-heading text-xl font-bold mt-2 mb-2" style={{ color: "#0F172A" }}>{col.title}</h3>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "#64748B" }}>{col.subtitle}</p>

              <ul className="space-y-3 mb-8">
                {col.points.map((p) => (
                  <li key={p} className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                    — {p}
                  </li>
                ))}
              </ul>

              <div className="pt-6" style={{ borderTop: "1px solid #E2E8F0" }}>
                <p className="text-sm font-semibold" style={{ color: "#0891B2" }}>
                  {col.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
