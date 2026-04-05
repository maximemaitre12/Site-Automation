const blocks = [
  { title: "EXPERTISE RÉELLE", desc: "18+ années d'expérience opérationnelle. Nous avons implémenté GMP dans de vraies usines et managé des audits FDA." },
  { title: "ZÉRO INCIDENTS", desc: "En 18 ans: zéro regulatory incidents, zéro FDA warning letters. La compliance est notre fondation." },
  { title: "ZÉRO DISRUPTION", desc: "Vos opérations ne ralentissent pas. Contingencies incluses dans chaque plan dès le jour 1." },
  { title: "RÉSULTATS MESURABLES", desc: "ROI moyen de 1,760%. Chaque engagement commence par un diagnostic avec des KPIs définis." },
];

export function PharmaTrust() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Confiance
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          Partenaire
          <br />
          de confiance.
        </h2>

        <div className="grid sm:grid-cols-2 gap-0">
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className="p-8 lg:p-10"
              style={{
                borderRight: i % 2 === 0 ? "1px solid rgba(3,105,161,0.12)" : "none",
                borderBottom: i < 2 ? "1px solid rgba(3,105,161,0.12)" : "none",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                <h3 className="font-heading text-[12px] font-bold tracking-[0.15em]" style={{ color: "#0F172A" }}>{b.title}</h3>
              </div>
              <p className="text-[15px] leading-[1.85]" style={{ color: "#3d5060" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
