import { Users, Link2, TrendingUp, ShieldCheck, Monitor } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Talent Acquisition & Retention",
    desc: "Recruter des professionnels regulatory affairs, quality assurance et manufacturing dans le contexte pharma.",
    result: "Time-to-hire: 24 → 6 semaines",
    color: "#F97316",
  },
  {
    icon: Link2,
    title: "GMP & Manufacturing",
    desc: "Implémenter les systèmes GMP sans ralentir la production. Batch records modernisés.",
    result: "Compliance incidents: -90%",
    color: "#0891B2",
  },
  {
    icon: TrendingUp,
    title: "Regulatory Strategy & Expansion",
    desc: "Planifier votre expansion avec la compliance intégrée dès le départ.",
    result: "Market entry timeline: -40%",
    color: "#1E40AF",
  },
  {
    icon: ShieldCheck,
    title: "Quality Management Systems",
    desc: "Construire des QMS robustes, auditables et scalables.",
    result: "Audit findings: -85%",
    color: "#059669",
  },
  {
    icon: Monitor,
    title: "Compliance Technology",
    desc: "Implémenter la tech compliance-first. Sans casser l'existant.",
    result: "System downtime: Zero",
    color: "#7C3AED",
  },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Un large spectre d'
            <span style={{ color: "#0891B2" }}>expertise pharma</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Notre portfolio est adapté aux besoins spécifiques de l'industrie pharmaceutique.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-7 bg-white transition-all hover:shadow-xl hover:-translate-y-1 group"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: `${p.color}12` }}
              >
                <p.icon className="w-6 h-6" style={{ color: p.color }} />
              </div>
              <h3 className="font-heading text-base font-bold mb-2" style={{ color: "#0F172A" }}>{p.title}</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "#64748B" }}>{p.desc}</p>
              <div className="text-sm font-bold" style={{ color: p.color }}>{p.result}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
