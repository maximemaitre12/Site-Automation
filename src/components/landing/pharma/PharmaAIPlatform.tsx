import { FlaskConical, ShieldCheck, Brain, Microscope } from "lucide-react";

const capabilities = [
  {
    title: "MULTI-AGENT ORCHESTRATION",
    desc: "Coordinated agent architecture where each agent owns a specific operational domain — logistics, recruitment, document processing. Shared intelligence layer ensures consistency. Event-driven communication between agents for complex multi-step workflows.",
  },
  {
    title: "PHARMACEUTICAL NLP ENGINE",
    desc: "Fine-tuned on 12,000+ regulatory documents — ICH guidelines, FDA Guidance, EMA scientific opinions, Pharmacopoeias. Native understanding of MedDRA, WHO-DD, SNOMED CT, eCTD/CTD structures, ATC classifications and GxP terminology. Not a generic LLM — a pharma-specialized language model.",
  },
  {
    title: "RETRIEVAL-AUGMENTED GENERATION",
    desc: "Vector database-powered retrieval (pgvector, Pinecone) for contextual document search and matching. Agents retrieve relevant regulatory precedents, product references and historical compliance patterns before generating draft outputs — grounded in your actual data and regulatory corpus.",
  },
  {
    title: "REGULATORY INTELLIGENCE",
    desc: "Automated monitoring of FDA, EMA and ANSM regulatory updates. Real-time cross-referencing against ICH Q8–Q12, 21 CFR Part 11, Annex 11 and GDP guidelines. Proactive detection of compliance gaps and regulatory changes that impact your operations.",
  },
  {
    title: "PHARMACOVIGILANCE MODULE",
    desc: "Automatic ingestion of ICSRs from E2B(R3), signal detection via disproportionality algorithms (PRR, ROR, MGPS/EBGM), automated PSUR/PBRER generation. End-to-end adverse event processing from intake to regulatory submission draft.",
  },
  {
    title: "REAL-TIME MONITORING",
    desc: "Live dashboards tracking agent performance, processing volumes, validation rates and error patterns. Prometheus/Grafana observability stack. Alerting on anomalies, SLA breaches and processing bottlenecks. Full operational visibility across all deployed agents.",
  },
];

const researchPillars = [
  {
    icon: FlaskConical,
    title: "Pharma-native language models",
    desc: "Our R&D team trains and fine-tunes foundation models exclusively on pharmaceutical and regulatory corpora. Every model understands the difference between a batch record deviation and a CAPA — because it was trained on thousands of them.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory engineering",
    desc: "We don't just read regulations — we encode them. ICH, FDA, EMA, ANSM guidelines are structured as machine-readable rule sets that our agents use for real-time compliance validation. Our team includes regulatory affairs specialists who validate every rule.",
  },
  {
    icon: Brain,
    title: "Autonomous agent research",
    desc: "Multi-agent coordination, reasoning chains, tool-use architectures — our research pushes the boundaries of what AI agents can reliably do in high-stakes regulated environments. Every capability we ship comes from our internal R&D pipeline.",
  },
  {
    icon: Microscope,
    title: "Domain-specific evaluation",
    desc: "We built proprietary benchmarks for pharmaceutical AI — measuring accuracy on MedDRA coding, eCTD cross-referencing, ICSR extraction and regulatory gap detection. Our models are evaluated against pharma-specific criteria, not generic NLP benchmarks.",
  },
];

export function PharmaAIPlatform() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Our proprietary AI · Pharma R&D
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-white"
            >
              Aether Pharma AI.
              <br />
              <span style={{ color: "#22D3EE" }}>Built from research.</span>
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              We don't wrap generic AI models in a pharma skin.{" "}
              <strong className="text-white font-medium">Aether Pharma AI</strong> is the product of{" "}
              <strong className="text-white font-medium">dedicated R&D in pharmaceutical intelligence</strong> —
              from <strong className="text-white font-medium">regulatory corpus training</strong> to{" "}
              <strong className="text-white font-medium">domain-specific model evaluation</strong>. Our team
              combines <strong className="text-white font-medium">AI research</strong>,{" "}
              <strong className="text-white font-medium">regulatory affairs expertise</strong> and{" "}
              <strong className="text-white font-medium">pharma operations engineering</strong>.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every model is <strong className="text-white font-medium">trained on pharmaceutical data</strong> —
              not adapted after the fact. Our AI natively understands{" "}
              <strong className="text-white font-medium">MedDRA</strong>,{" "}
              <strong className="text-white font-medium">WHO-DD</strong>,{" "}
              <strong className="text-white font-medium">SNOMED CT</strong>,{" "}
              <strong className="text-white font-medium">eCTD/CTD</strong> structures,{" "}
              <strong className="text-white font-medium">ICH Q8–Q12</strong> and{" "}
              <strong className="text-white font-medium">21 CFR Part 11</strong> requirements.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {[
                { label: "Regulatory documents indexed", value: "12,000+" },
                { label: "MedDRA classification accuracy", value: "99.2%" },
                { label: "Compliance frameworks encoded", value: "ICH · FDA · EMA · ANSM" },
                { label: "Languages (pharmaceutical NLP)", value: "14" },
                { label: "Proprietary pharma benchmarks", value: "6 evaluation suites" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[15px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* R&D Pillars */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
              Research & Development
            </span>
          </div>
          <h3 className="font-heading text-[26px] md:text-[32px] font-bold leading-[1.15] mb-14 text-white max-w-2xl">
            We are a research company first.<br />
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Every agent we deploy comes from our lab.</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {researchPillars.map((p) => (
              <div key={p.title} className="p-8 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-6" style={{ background: "rgba(34,211,238,0.1)" }}>
                  <p.icon className="w-5 h-5" style={{ color: "#22D3EE" }} />
                </div>
                <h4 className="font-heading text-[15px] font-bold text-white mb-3">{p.title}</h4>
                <p className="text-[14px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical capabilities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className="p-8 transition-colors hover:bg-white/[0.03]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div className="w-6 h-[2px] mb-6" style={{ background: "#22D3EE" }} />
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.15em] mb-4 text-white"
              >
                {c.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
