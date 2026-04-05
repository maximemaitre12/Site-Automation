import { ArrowRight } from "lucide-react";

const cases = [
  {
    letter: "P",
    title: "Pharmadev",
    subtitle: "Quality System Transformation",
    result: "Zero findings · €300k risk eliminated",
    color: "#059669",
  },
  {
    letter: "B",
    title: "BioTech Startup",
    subtitle: "GMP Implementation",
    result: "FDA pre-approval: Pass · -6 mois time-to-market",
    color: "#0891B2",
  },
  {
    letter: "G",
    title: "Generic Pharma",
    subtitle: "Regulatory Expansion",
    result: "4 marchés · €2M+ revenus nouveaux",
    color: "#1E40AF",
  },
];

export function PharmaPortfolio() {
  return (
    <section className="py-24" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Autres transformations{" "}
            <span style={{ color: "#0891B2" }}>réussies</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-8 bg-white transition-all hover:shadow-xl hover:-translate-y-1 group cursor-pointer"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold mb-6"
                style={{ background: c.color }}
              >
                {c.letter}
              </div>
              <h3 className="font-heading text-lg font-bold mb-1" style={{ color: "#0F172A" }}>{c.title}</h3>
              <p className="text-sm mb-4" style={{ color: "#64748B" }}>{c.subtitle}</p>
              <p className="text-sm font-semibold mb-6" style={{ color: c.color }}>{c.result}</p>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#0891B2" }}>
                Lire l'étude <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
