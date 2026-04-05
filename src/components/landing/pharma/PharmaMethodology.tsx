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
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2
          className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-6"
          style={{ color: "#0F172A" }}
        >
          Qualité &
          <br />
          résultats.
        </h2>
        <p className="text-[15px] md:text-base leading-[1.8] max-w-[560px] mb-20" style={{ color: "#5a6577" }}>
          Des <strong style={{ color: "#0F172A" }}>résultats mesurables</strong> à chaque engagement.
          Notre processus est <strong style={{ color: "#0F172A" }}>éprouvé</strong>, sans disruption opérationnelle.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-16">
          {quality.map((q) => (
            <div key={q.desc}>
              <div
                className="font-heading text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-none mb-4"
                style={{ color: "#064E6E" }}
              >
                {q.value}
              </div>
              <p className="text-[14px] leading-[1.75]" style={{ color: "#6b7688" }}>
                {q.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
