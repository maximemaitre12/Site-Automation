import { Users, Link2, TrendingUp, ShieldCheck, Monitor, Check } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Talent Acquisition & Retention",
    desc: "Recruiting regulatory affairs, quality assurance, manufacturing professionals dans le contexte pharma.",
    services: ["Talent mapping & sourcing", "Regulatory knowledge assessment", "Culture-fit evaluation", "Retention strategy"],
    result: "Time-to-hire: 24 weeks → 6-8 weeks",
    bg: "#FFF9F0",
    border: "#FF8A45",
  },
  {
    icon: Link2,
    title: "GMP & Manufacturing Optimization",
    desc: "Implémenter les systèmes GMP sans ralentir la production.",
    services: ["GMP assessment & gap analysis", "Batch record modernization", "Validation & documentation", "Change control framework"],
    result: "Compliance incidents: -90%",
    bg: "#F0FFF4",
    border: "#0D8B5E",
  },
  {
    icon: TrendingUp,
    title: "Regulatory Strategy & Expansion",
    desc: "Planifier votre expansion avec la compliance built-in.",
    services: ["Regulatory roadmap development", "Jurisdiction assessment", "FDA/EMA strategy", "Market entry planning"],
    result: "Market entry timeline: -40%",
    bg: "#F3F4FF",
    border: "#1A3A6B",
  },
  {
    icon: ShieldCheck,
    title: "Quality Management Systems",
    desc: "Construire des QMS robustes, auditables, scalables.",
    services: ["QMS assessment & SOP documentation", "Training & competency programs", "Audit preparation", "Supplier management"],
    result: "Audit findings: -85%",
    bg: "#FFF8F0",
    border: "#D97706",
  },
  {
    icon: Monitor,
    title: "Compliance Technology Implementation",
    desc: "Implémenter la tech compliance-first. Sans breaking stuff.",
    services: ["System architecture design", "Legacy integration", "Validation & testing (IQ/OQ/PQ)", "21 CFR Part 11 compliance"],
    result: "System downtime: Zero",
    bg: "#F0F3FF",
    border: "#6366F1",
  },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-24" style={{ background: "#F9FBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-5" style={{ color: "#1A3A6B" }}>
            Notre expertise spécialisée en pharma
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-lg p-6 transition-all hover:shadow-lg" style={{ background: p.bg, borderLeft: `4px solid ${p.border}` }}>
              <p.icon className="w-8 h-8 mb-3" style={{ color: p.border }} />
              <h3 className="font-heading text-base font-bold mb-2" style={{ color: "#1A3A6B" }}>{p.title}</h3>
              <p className="text-sm mb-4" style={{ color: "#4A5568" }}>{p.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {p.services.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: p.border }} />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="text-sm font-bold" style={{ color: p.border }}>{p.result}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
