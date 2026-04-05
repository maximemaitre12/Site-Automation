const areas = [
  {
    title: "TALENT ACQUISITION & RETENTION",
    desc: "Recruter les meilleurs professionnels en regulatory, quality et manufacturing.",
  },
  {
    title: "GMP & MANUFACTURING",
    desc: "Implémenter les systèmes GMP sans ralentir la production.",
  },
  {
    title: "REGULATORY STRATEGY",
    desc: "Planifier votre expansion avec la compliance intégrée.",
  },
  {
    title: "QUALITY MANAGEMENT",
    desc: "Construire des QMS robustes, auditables et scalables.",
  },
  {
    title: "COMPLIANCE TECHNOLOGY",
    desc: "Implémenter la tech compliance-first, sans casser l'existant.",
  },
  {
    title: "OPERATIONAL SCALING",
    desc: "Scaler vos opérations tout en maintenant la conformité.",
  },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-20"
          style={{ color: "#0F172A" }}
        >
          Domaines
          <br />
          d'expertise.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {areas.map((a) => (
            <div key={a.title} className="group cursor-default">
              <h3
                className="font-heading text-sm font-bold tracking-[0.15em] mb-4 transition-colors group-hover:opacity-60"
                style={{ color: "#0F172A" }}
              >
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
