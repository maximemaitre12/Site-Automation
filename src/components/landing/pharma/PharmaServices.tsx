import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Diagnostic Audit",
    price: "€8k - €15k",
    duration: "2-3 semaines",
    desc: "Audit complet de votre réalité pharma avec rapport détaillé et roadmap priorisé.",
    color: "#059669",
  },
  {
    title: "Transformation Project",
    price: "€50k - €200k+",
    duration: "12-24 semaines",
    desc: "Transformation complète: assessment, implémentation, training, 12 mois support inclus.",
    featured: true,
    color: "#0891B2",
  },
  {
    title: "Ongoing Advisory",
    price: "€5k - €15k/mois",
    duration: "12-36 mois",
    desc: "Soutien continu stratégique et opérationnel. Monthly meetings, issue resolution 24h SLA.",
    color: "#1E40AF",
  },
];

export function PharmaServices() {
  return (
    <section id="services" className="py-24" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Nos <span style={{ color: "#0891B2" }}>services</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className={`rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 ${s.featured ? "ring-2" : ""}`}
              style={{
                background: s.featured ? "linear-gradient(135deg, #F0F9FF, #E0F2FE)" : "white",
                border: "1px solid #E2E8F0",
                ringColor: s.featured ? "#0891B2" : undefined,
              }}
            >
              <div className="text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block" style={{ background: `${s.color}12`, color: s.color }}>
                {s.duration}
              </div>
              <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#0F172A" }}>{s.title}</h3>
              <div className="text-2xl font-bold mb-4" style={{ color: s.color }}>{s.price}</div>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#64748B" }}>{s.desc}</p>

              <Link to="/contact">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 h-12 text-sm font-bold rounded-full transition-all hover:shadow-lg hover:scale-105"
                  style={{
                    background: s.featured ? "#0891B2" : "transparent",
                    color: s.featured ? "white" : s.color,
                    border: s.featured ? "none" : `2px solid ${s.color}`,
                  }}
                >
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
