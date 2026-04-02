import { Check } from "lucide-react";

const founders = [
  {
    title: "Chief Operations Officer & Co-Founder",
    bg: "#F9FBFC",
    experience: [
      "15 ans dans la pharmacie",
      "VP Operations, Sanofi (5 ans) — 3 usines, 2000+ employees",
      "Operations Director, Novartis (4 ans) — Supply chain €300M+",
      "Quality Assurance Manager, Pharmadev (3 ans)",
    ],
    expertise: ["GMP & Manufacturing", "Supply Chain Pharma", "Regulatory Strategy", "Quality Management Systems", "FDA/EMA Interactions"],
    quote: "18 years in pharma taught me one thing: Operations are not about tech. They're about people, processes, and compliance.",
  },
  {
    title: "Chief Compliance Officer & Co-Founder",
    bg: "#F9FBFC",
    experience: [
      "12 ans dans regulatory pharma",
      "Head of Regulatory Affairs, Boehringer Ingelheim (4 ans)",
      "Regulatory Manager, GSK (5 ans) — Global regulatory strategy",
      "Quality Auditor, TÜV SÜD (2 ans)",
    ],
    expertise: ["FDA & EMA Regulations", "Dossier Technique & CTD", "GMP Compliance", "Audit Preparation & Management", "21 CFR Part 11 Compliance"],
    quote: "Compliance is not a constraint. It's the foundation on which everything else is built.",
  },
  {
    title: "Chief Technology Officer & Co-Founder",
    bg: "#F9FBFC",
    experience: [
      "10 ans tech, 5 ans pharma-specific",
      "Head of Digital Transformation, Pharma Startup (3 ans)",
      "Solutions Architect, Accenture Digital (3 ans)",
      "Software Engineer, startups tech (4 ans)",
    ],
    expertise: ["System Architecture", "Pharma Compliance Tech", "Data Security & Encryption", "API Integration & Legacy Systems", "GxP-aware Development"],
    quote: "Technology should serve pharma operations, not complicate them.",
  },
];

export function PharmaTeam() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-5" style={{ color: "#1A3A6B" }}>
            Nous sommes des vétérans pharma.
            <br className="hidden md:block" />
            Pas des consultants IA.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((f) => (
            <div key={f.title} className="rounded-lg p-8 border transition-all hover:border-[#0D8B5E]" style={{ background: f.bg, borderColor: "#E8EFF8" }}>
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "#1A3A6B" }}>
                <span className="text-white text-xl font-bold">{f.title.charAt(6)}</span>
              </div>
              <h3 className="font-heading text-base font-bold mb-4" style={{ color: "#1A3A6B" }}>{f.title}</h3>

              <div className="space-y-1.5 mb-5">
                {f.experience.map((e) => (
                  <p key={e} className="text-sm" style={{ color: "#4A5568" }}>{e}</p>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#0D8B5E" }}>Expertise</div>
                <ul className="space-y-1">
                  {f.expertise.map((e) => (
                    <li key={e} className="flex items-center gap-2 text-sm" style={{ color: "#2C3E50" }}>
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#0D8B5E" }} />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm italic pl-3" style={{ color: "#1A3A6B", borderLeft: "3px solid #1A3A6B" }}>
                "{f.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
