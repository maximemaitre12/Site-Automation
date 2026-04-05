const blocks = [
  { title: "EXPERTISE RÉELLE", desc: "18+ années d'expérience opérationnelle. Nous avons implémenté GMP dans de vraies usines et managé des audits FDA." },
  { title: "ZÉRO INCIDENTS", desc: "En 18 ans: zéro regulatory incidents, zéro FDA warning letters. La compliance est notre fondation." },
  { title: "ZÉRO DISRUPTION", desc: "Vos opérations ne ralentissent pas. Contingencies incluses dans chaque plan dès le jour 1." },
  { title: "RÉSULTATS MESURABLES", desc: "ROI moyen de 1,760%. Chaque engagement commence par un diagnostic avec des KPIs définis." },
];

export function PharmaTrust() {
  return (
    <section className="py-32 md:py-40" style={{ background: "#F7F8FA" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2
          className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          Partenaire
          <br />
          de confiance.
        </h2>

        <div className="grid sm:grid-cols-2 gap-x-14 gap-y-14">
          {blocks.map((b) => (
            <div key={b.title}>
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.18em] mb-4"
                style={{ color: "#0F172A" }}
              >
                {b.title}
              </h3>
              <p className="text-[15px] leading-[1.8]" style={{ color: "#5a6577" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
