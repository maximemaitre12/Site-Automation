const areas = [
  { title: "TALENT ACQUISITION & RETENTION", desc: "Recruter les meilleurs professionnels en regulatory, quality et manufacturing.", icon: "→" },
  { title: "GMP & MANUFACTURING", desc: "Implémenter les systèmes GMP sans ralentir la production.", icon: "→" },
  { title: "REGULATORY STRATEGY", desc: "Planifier votre expansion avec la compliance intégrée.", icon: "→" },
  { title: "QUALITY MANAGEMENT", desc: "Construire des QMS robustes, auditables et scalables.", icon: "→" },
  { title: "COMPLIANCE TECHNOLOGY", desc: "Implémenter la tech compliance-first, sans casser l'existant.", icon: "→" },
  { title: "OPERATIONAL SCALING", desc: "Scaler vos opérations tout en maintenant la conformité.", icon: "→" },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Expertise
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          Domaines
          <br />
          d'expertise.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {areas.map((a, i) => (
            <div
              key={a.title}
              className="group cursor-default p-8 transition-colors hover:bg-[#f5f9fb]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid #e8ecf1" : "none",
                borderBottom: i < 3 ? "1px solid #e8ecf1" : "none",
              }}
            >
              <div className="w-6 h-[2px] mb-6" style={{ background: "#0369A1" }} />
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.15em] mb-4"
                style={{ color: "#0F172A" }}
              >
                {a.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: "#5a6577" }}>
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
