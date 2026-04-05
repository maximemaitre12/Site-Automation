import { FlaskConical, ShieldCheck, Brain, Microscope } from "lucide-react";

const capabilities = [
  {
    title: "MULTI-AGENT ORCHESTRATION",
    desc: "Coordinated agent architecture — each agent owns a specific domain. Shared intelligence layer with event-driven communication for complex workflows.",
  },
  {
    title: "PHARMACEUTICAL NLP",
    desc: "Fine-tuned on 12,000+ regulatory documents. Native understanding of MedDRA, WHO-DD, SNOMED CT, eCTD/CTD, ICH and GxP terminology.",
  },
  {
    title: "RAG PIPELINE",
    desc: "Vector-powered retrieval for contextual document search. Agents retrieve regulatory precedents and historical patterns before generating outputs.",
  },
  {
    title: "REGULATORY INTELLIGENCE",
    desc: "Automated FDA, EMA, ANSM monitoring. Real-time cross-referencing against ICH Q8–Q12, 21 CFR Part 11, Annex 11 and GDP guidelines.",
  },
  {
    title: "PHARMACOVIGILANCE",
    desc: "E2B(R3) ingestion, signal detection (PRR, ROR, EBGM), automated PSUR/PBRER generation. End-to-end adverse event processing.",
  },
  {
    title: "OBSERVABILITY",
    desc: "Live dashboards tracking agent performance, validation rates and error patterns. Alerting on anomalies and SLA breaches.",
  },
];

const researchPillars = [
  {
    icon: FlaskConical,
    title: "Pharma-native models",
    desc: "Foundation models trained exclusively on pharmaceutical and regulatory corpora — not generic LLMs with a pharma wrapper.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory engineering",
    desc: "ICH, FDA, EMA guidelines encoded as machine-readable rule sets for real-time compliance validation.",
  },
  {
    icon: Brain,
    title: "Agent research",
    desc: "Multi-agent coordination, reasoning chains and tool-use architectures for high-stakes regulated environments.",
  },
  {
    icon: Microscope,
    title: "Domain-specific evaluation",
    desc: "Proprietary benchmarks for MedDRA coding, eCTD cross-referencing, ICSR extraction and regulatory gap detection.",
  },
];

export function PharmaAIPlatform() {
  return (
    <section className="py-20 md:py-28" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Proprietary AI · Pharma R&D
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          <div>
            <h2 className="font-heading text-[32px] md:text-[44px] lg:text-[48px] font-bold leading-[1.08] mb-6 text-white">
              Aether Pharma AI.
              <br />
              <span style={{ color: "#22D3EE" }}>Built from research.</span>
            </h2>
            <p className="text-[14px] md:text-[15px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.55)" }}>
              <strong className="text-white font-medium">Aether Pharma AI</strong> is the product of{" "}
              <strong className="text-white font-medium">dedicated R&D in pharmaceutical intelligence</strong> —
              from regulatory corpus training to domain-specific model evaluation.
              Every model natively understands{" "}
              <strong className="text-white font-medium">MedDRA</strong>,{" "}
              <strong className="text-white font-medium">eCTD/CTD</strong>,{" "}
              <strong className="text-white font-medium">ICH Q8–Q12</strong> and{" "}
              <strong className="text-white font-medium">21 CFR Part 11</strong>.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-0">
              {[
                { label: "Regulatory documents indexed", value: "12,000+" },
                { label: "MedDRA classification accuracy", value: "99.2%" },
                { label: "Compliance frameworks", value: "ICH · FDA · EMA · ANSM" },
                { label: "Pharma NLP languages", value: "14" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[14px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* R&D Pillars */}
        <div className="mb-16">
          <h3 className="font-heading text-[22px] md:text-[26px] font-bold leading-[1.15] mb-8 text-white">
            Research company first.{" "}
            <span style={{ color: "rgba(255,255,255,0.45)" }}>Every agent comes from our lab.</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {researchPillars.map((p) => (
              <div key={p.title} className="p-6 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-md mb-4" style={{ background: "rgba(34,211,238,0.1)" }}>
                  <p.icon className="w-4 h-4" style={{ color: "#22D3EE" }} />
                </div>
                <h4 className="font-heading text-[13px] font-bold text-white mb-2">{p.title}</h4>
                <p className="text-[12px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical capabilities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className="p-6 transition-colors hover:bg-white/[0.03]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div className="w-5 h-[2px] mb-4" style={{ background: "#22D3EE" }} />
              <h3 className="font-heading text-[11px] font-bold tracking-[0.15em] mb-3 text-white">
                {c.title}
              </h3>
              <p className="text-[12px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
