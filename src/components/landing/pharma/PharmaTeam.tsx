const founders = [
  {
    initials: "CO",
    title: "Chief Operations Officer",
    subtitle: "Co-Founder",
    experience: "15 ans · VP Operations Sanofi · Operations Director Novartis",
    expertise: ["GMP & Manufacturing", "Supply Chain Pharma", "FDA/EMA Interactions"],
    quote: "Operations are not about tech. They're about people, processes, and compliance.",
  },
  {
    initials: "CC",
    title: "Chief Compliance Officer",
    subtitle: "Co-Founder",
    experience: "12 ans · Head Regulatory Boehringer Ingelheim · Regulatory Manager GSK",
    expertise: ["FDA & EMA Regulations", "GMP Compliance", "21 CFR Part 11"],
    quote: "Compliance is not a constraint. It's the foundation on which everything else is built.",
  },
  {
    initials: "CT",
    title: "Chief Technology Officer",
    subtitle: "Co-Founder",
    experience: "10 ans tech, 5 ans pharma · Head Digital Transformation · Solutions Architect Accenture",
    expertise: ["Pharma Compliance Tech", "System Architecture", "GxP-aware Development"],
    quote: "Technology should serve pharma operations, not complicate them.",
  },
];

export function PharmaTeam() {
  return (
    <section id="team" className="py-28" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Équipe
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Des vétérans pharma.
            <br />Pas des consultants IA.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {founders.map((f) => (
            <div key={f.initials}>
              {/* Initials as large typography */}
              <div className="font-heading text-5xl font-bold mb-6" style={{ color: "#E2E8F0" }}>
                {f.initials}
              </div>

              <h3 className="font-heading text-base font-bold" style={{ color: "#0F172A" }}>{f.title}</h3>
              <p className="text-sm mb-4" style={{ color: "#0891B2" }}>{f.subtitle}</p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#64748B" }}>{f.experience}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {f.expertise.map((e) => (
                  <span
                    key={e}
                    className="text-xs font-medium px-2.5 py-1"
                    style={{ border: "1px solid #E2E8F0", color: "#475569" }}
                  >
                    {e}
                  </span>
                ))}
              </div>

              <p className="text-sm italic leading-relaxed pl-4" style={{ color: "#475569", borderLeft: "2px solid #0891B2" }}>
                "{f.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
