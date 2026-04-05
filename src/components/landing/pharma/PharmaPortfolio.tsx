import { ArrowRight } from "lucide-react";

const cases = [
  {
    title: "Pharmadev",
    subtitle: "Quality System Transformation",
    result: "Zero findings · €300k risk eliminated",
  },
  {
    title: "BioTech Startup",
    subtitle: "GMP Implementation",
    result: "FDA pre-approval: Pass · -6 mois time-to-market",
  },
  {
    title: "Generic Pharma",
    subtitle: "Regulatory Expansion",
    result: "4 marchés · €2M+ revenus nouveaux",
  },
];

export function PharmaPortfolio() {
  return (
    <section className="py-28" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Portfolio
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: "#0F172A" }}>
            Autres transformations réussies.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 divide-x" style={{ borderColor: "#E2E8F0" }}>
          {cases.map((c) => (
            <div key={c.title} className="px-8 first:pl-0 last:pr-0 group cursor-pointer">
              <h3 className="font-heading text-lg font-bold mb-1" style={{ color: "#0F172A" }}>{c.title}</h3>
              <p className="text-sm mb-4" style={{ color: "#64748B" }}>{c.subtitle}</p>
              <p className="text-sm font-semibold mb-6" style={{ color: "#0891B2" }}>{c.result}</p>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#0F172A" }}>
                Lire l'étude <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
