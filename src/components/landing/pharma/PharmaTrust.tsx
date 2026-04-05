const items = [
  {
    num: "01",
    title: "Expertise réelle",
    desc: "18+ années d'expérience opérationnelle dans l'industrie pharmaceutique. Nous avons implémenté GMP dans de vraies usines et managé des audits FDA.",
    highlight: "Notre expertise n'est pas théorique.",
  },
  {
    num: "02",
    title: "Zéro incidents réglementaires",
    desc: "En 18 ans: zéro regulatory incidents, zéro FDA warning letters. Chaque solution est designed avec 21 CFR Part 11 compliance et FDA audit readiness.",
    highlight: "La compliance est notre fondation.",
  },
  {
    num: "03",
    title: "Garantie zéro disruption",
    desc: "Vos opérations ne ralentissent pas. Nous planifions 'no disruption' dès le jour 1. Contingencies incluses dans chaque plan.",
    highlight: "Nous sommes trop séniors pour faire de la disruption.",
  },
];

export function PharmaTrust() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Confiance
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Partenaire de confiance.
          </h2>
        </div>

        <div className="space-y-0 divide-y" style={{ borderColor: "#E2E8F0" }}>
          {items.map((item) => (
            <div key={item.num} className="grid md:grid-cols-[80px_1fr_1.5fr] gap-6 py-10 first:pt-0">
              <span className="text-xs font-mono tracking-wider self-start pt-1" style={{ color: "#94A3B8" }}>
                {item.num}
              </span>
              <h3 className="font-heading text-xl font-bold" style={{ color: "#0F172A" }}>
                {item.title}
              </h3>
              <div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#64748B" }}>{item.desc}</p>
                <p className="text-sm font-semibold" style={{ color: "#0891B2" }}>{item.highlight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
