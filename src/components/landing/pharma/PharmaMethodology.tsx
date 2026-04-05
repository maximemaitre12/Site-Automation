const quality = [
  { value: "100%", desc: "Réussite audits FDA sur les 12 dernières implémentations" },
  { value: "0", desc: "Violations réglementaires en 18 ans d'opérations" },
  { value: "95%", desc: "Clients qui reviennent pour des phases supplémentaires" },
  { value: "4–6", desc: "Semaines pour le premier diagnostic complet" },
  { value: "71%", desc: "Réduction moyenne du time-to-hire pharma" },
  { value: "1760%", desc: "ROI moyen sur nos projets de transformation" },
];

export function PharmaMethodology() {
  return (
    <section className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8"
          style={{ color: "#0F172A" }}
        >
          Qualité &
          <br />
          résultats.
        </h2>
        <p className="text-base md:text-lg leading-relaxed max-w-[600px] mb-20" style={{ color: "#475569" }}>
          Des <strong style={{ color: "#0F172A" }}>résultats mesurables</strong> à chaque engagement.
          Notre processus est <strong style={{ color: "#0F172A" }}>éprouvé</strong>, sans disruption opérationnelle.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {quality.map((q) => (
            <div key={q.desc}>
              <div
                className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-4"
                style={{ color: "#0891B2" }}
              >
                {q.value}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                {q.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
