import { ArrowRight } from "lucide-react";

const cases = [
  {
    title: "Pharmadev - Quality System Transformation",
    challenge: "Legacy quality processes, FDA audit findings (critical)",
    result: "Zero findings in next audit, €300k regulatory risk eliminated",
  },
  {
    title: "BioTech Startup - GMP Implementation",
    challenge: "Scaling from research to manufacturing (GMP-compliant)",
    result: "FDA pre-approval inspection: Pass, time-to-market: -6 months",
  },
  {
    title: "Generic Pharma - Regulatory Expansion",
    challenge: "Enter 4 new markets (EU + emerging markets)",
    result: "Approvals in 14 months, €2M+ revenue from new markets",
  },
];

export function PharmaPortfolio() {
  return (
    <section className="py-24" style={{ background: "#F9FBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#1A3A6B" }}>
          Autres transformations réussies
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-lg p-6 border transition-all hover:shadow-lg hover:border-[#0D8B5E] group cursor-pointer"
              style={{ borderColor: "#E8EFF8", boxShadow: "0 2px 6px rgba(26,58,107,0.08)" }}
            >
              <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center text-white text-xs font-bold" style={{ background: "#1A3A6B" }}>
                {c.title.charAt(0)}
              </div>
              <h3 className="font-heading text-base font-bold mb-2" style={{ color: "#1A3A6B" }}>{c.title}</h3>
              <p className="text-sm mb-3" style={{ color: "#4A5568" }}>{c.challenge}</p>
              <p className="text-sm font-semibold mb-4" style={{ color: "#0D8B5E" }}>"{c.result}"</p>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#1A3A6B" }}>
                Lire l'étude <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
