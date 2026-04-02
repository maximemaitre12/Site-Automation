import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Diagnostic Audit",
    price: "€8,000 - €15,000",
    duration: "2-3 weeks",
    desc: "Audit complet de votre réalité pharma.",
    items: ["Process assessment", "Compliance gap analysis", "Regulatory risk scorecard", "Technology review", "Prioritized roadmap", "Executive presentation"],
    livrable: "30-page diagnostic report + action plan",
    ideal: "Companies planning expansion, FDA audit findings, scaling operations",
    cta: "Demander un diagnostic",
    border: "#0D8B5E",
    bg: "#F0FFF4",
  },
  {
    title: "Transformation Project",
    price: "€50,000 - €200,000+",
    duration: "12-24 weeks",
    desc: "Transformation complète: Assessment → Implementation.",
    items: ["Full assessment & solution design", "Team training & change management", "System implementation & validation", "12 months support included", "Knowledge transfer", "Audit-ready documentation"],
    livrable: "Transformed operations, compliant processes, trained team",
    ideal: "Critical compliance gaps, significant scaling, R&D to manufacturing",
    cta: "Discuter votre transformation",
    border: "#1A3A6B",
    bg: "#F3F4FF",
  },
  {
    title: "Ongoing Advisory",
    price: "€5,000 - €15,000/mois",
    duration: "12-36 months",
    desc: "Soutien continu: stratégique + opérationnel.",
    items: ["Monthly strategy meetings", "Issue resolution (24h SLA)", "Regulatory strategy guidance", "Team coaching & development", "Process optimization", "Audit preparation support"],
    livrable: "1-2 days/month on-site + weekly calls + on-demand support",
    ideal: "Growth phase, regulatory complexity, lacking senior pharma expertise",
    cta: "Discuter advisory options",
    border: "#FF8A45",
    bg: "#FFF9F0",
  },
];

export function PharmaServices() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-16 text-center" style={{ color: "#1A3A6B" }}>
          Ce que nous offrons
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="rounded-lg p-8 border" style={{ background: s.bg, borderColor: "#E8EFF8", borderLeft: `4px solid ${s.border}` }}>
              <h3 className="font-heading text-xl font-bold mb-1" style={{ color: "#1A3A6B" }}>{s.title}</h3>
              <div className="text-2xl font-bold mb-1" style={{ color: s.border }}>{s.price}</div>
              <div className="text-sm mb-4" style={{ color: "#6B7C8C" }}>{s.duration}</div>
              <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>{s.desc}</p>

              <ul className="space-y-1.5 mb-5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: s.border }} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="text-xs mb-4 p-3 rounded" style={{ background: "rgba(255,255,255,0.7)", color: "#4A5568" }}>
                <span className="font-bold">Livrable:</span> {s.livrable}
              </div>

              <Link to="/contact">
                <button className="w-full inline-flex items-center justify-center gap-2 h-11 text-sm font-bold text-white rounded transition-all hover:shadow-lg" style={{ background: s.border }}>
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
