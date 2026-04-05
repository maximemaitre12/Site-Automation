const blocks = [
  {
    title: "EXPERTISE RÉELLE",
    desc: "18+ années d'expérience opérationnelle. Nous avons implémenté GMP dans de vraies usines et managé des audits FDA.",
  },
  {
    title: "ZÉRO INCIDENTS",
    desc: "En 18 ans: zéro regulatory incidents, zéro FDA warning letters. La compliance est notre fondation.",
  },
  {
    title: "ZÉRO DISRUPTION",
    desc: "Vos opérations ne ralentissent pas. Contingencies incluses dans chaque plan dès le jour 1.",
  },
  {
    title: "RÉSULTATS MESURABLES",
    desc: "ROI moyen de 1,760%. Chaque engagement commence par un diagnostic avec des KPIs définis.",
  },
];

export function PharmaTrust() {
  return (
    <section className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-20"
          style={{ color: "#0F172A" }}
        >
          Partenaire
          <br />
          de confiance.
        </h2>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
          {blocks.map((b) => (
            <div key={b.title}>
              <h3
                className="font-heading text-sm font-bold tracking-[0.15em] mb-4"
                style={{ color: "#0F172A" }}
              >
                {b.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "#475569" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
