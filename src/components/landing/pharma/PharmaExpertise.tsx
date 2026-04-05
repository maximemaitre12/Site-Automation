const pillars = [
  {
    num: "01",
    title: "Talent Acquisition & Retention",
    desc: "Recruter des professionnels regulatory affairs, quality assurance et manufacturing dans le contexte pharma.",
    result: "Time-to-hire: 24 → 6 semaines",
  },
  {
    num: "02",
    title: "GMP & Manufacturing",
    desc: "Implémenter les systèmes GMP sans ralentir la production. Batch records modernisés.",
    result: "Compliance incidents: -90%",
  },
  {
    num: "03",
    title: "Regulatory Strategy & Expansion",
    desc: "Planifier votre expansion avec la compliance intégrée dès le départ.",
    result: "Market entry timeline: -40%",
  },
  {
    num: "04",
    title: "Quality Management Systems",
    desc: "Construire des QMS robustes, auditables et scalables.",
    result: "Audit findings: -85%",
  },
  {
    num: "05",
    title: "Compliance Technology",
    desc: "Implémenter la tech compliance-first. Sans casser l'existant.",
    result: "System downtime: Zero",
  },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Expertise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Notre expertise spécialisée
            <br />en pharma.
          </h2>
        </div>

        <div className="space-y-0 divide-y" style={{ borderColor: "#E2E8F0" }}>
          {pillars.map((p) => (
            <div
              key={p.num}
              className="grid md:grid-cols-[80px_1fr_1.2fr_auto] gap-6 items-start py-8 first:pt-0 group"
            >
              <span className="text-xs font-mono tracking-wider pt-1" style={{ color: "#94A3B8" }}>
                {p.num}
              </span>
              <h3 className="font-heading text-base font-bold" style={{ color: "#0F172A" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{p.desc}</p>
              <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#0891B2" }}>{p.result}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
