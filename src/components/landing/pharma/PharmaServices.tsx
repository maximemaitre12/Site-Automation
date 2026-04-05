import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Diagnostic Audit",
    price: "€8k – €15k",
    duration: "2-3 semaines",
    desc: "Audit complet de votre réalité pharma avec rapport détaillé et roadmap priorisé.",
  },
  {
    title: "Transformation Project",
    price: "€50k – €200k+",
    duration: "12-24 semaines",
    desc: "Transformation complète: assessment, implémentation, training, 12 mois support inclus.",
    featured: true,
  },
  {
    title: "Ongoing Advisory",
    price: "€5k – €15k/mois",
    duration: "12-36 mois",
    desc: "Soutien continu stratégique et opérationnel. Monthly meetings, issue resolution 24h SLA.",
  },
];

export function PharmaServices() {
  return (
    <section id="services" className="py-28" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Services
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Nos services.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 divide-x" style={{ borderColor: "#E2E8F0" }}>
          {services.map((s) => (
            <div
              key={s.title}
              className="px-8 first:pl-0 last:pr-0"
            >
              <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>
                {s.duration}
              </span>
              <h3 className="font-heading text-xl font-bold mt-2 mb-1" style={{ color: "#0F172A" }}>{s.title}</h3>
              <div className="text-2xl font-bold mb-4" style={{ color: "#0891B2" }}>{s.price}</div>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#64748B" }}>{s.desc}</p>

              <Link
                to="/contact"
                className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#0F172A" }}
              >
                En savoir plus <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
