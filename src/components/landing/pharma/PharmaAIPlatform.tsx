const capabilities = [
  {
    title: "MULTI-AGENT ORCHESTRATION",
    desc: "Coordinated agent architecture where each agent owns a specific operational domain — logistics, recruitment, document processing. Shared intelligence layer ensures consistency. Event-driven communication between agents for complex multi-step workflows.",
  },
  {
    title: "DOCUMENT NLP ENGINE",
    desc: "Purpose-trained models for pharmaceutical document understanding. Extracts structured data from unstructured inputs — PDFs, scanned documents, emails, Excel files, EDI feeds. Handles multi-language, multi-format inputs with high accuracy across lot numbers, quantities, dates and product codes.",
  },
  {
    title: "RETRIEVAL-AUGMENTED GENERATION",
    desc: "Vector database-powered retrieval (pgvector, Pinecone) for contextual document search and matching. Agents retrieve relevant precedents, product references and historical patterns before generating draft outputs — ensuring accuracy grounded in your actual data.",
  },
  {
    title: "ERP DRAFT GENERATION",
    desc: "Automatic creation of draft reception orders, dispatch orders and preparation orders directly in your ERP system. Pre-filled with extracted data, cross-referenced against inventory. Every draft requires human validation before execution — zero unvalidated actions.",
  },
  {
    title: "TALENT SCORING ENGINE",
    desc: "AI-powered candidate evaluation across multiple criteria: experience fit, certification match, location, salary alignment. Produces structured synthesis cards with priority ranking. Integrates with existing HRIS for seamless workflow continuity.",
  },
  {
    title: "REAL-TIME MONITORING",
    desc: "Live dashboards tracking agent performance, processing volumes, validation rates and error patterns. Prometheus/Grafana observability stack. Alerting on anomalies, SLA breaches and processing bottlenecks. Full operational visibility across all deployed agents.",
  },
];

export function PharmaAIPlatform() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Our proprietary platform
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-white"
            >
              Aether Agent Platform.
              <br />
              <span style={{ color: "#22D3EE" }}>Built for operations.</span>
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Our platform is the result of{" "}
              <strong className="text-white font-medium">deep engineering in document intelligence</strong>,
              <strong className="text-white font-medium"> multi-agent architecture</strong> and
              <strong className="text-white font-medium"> enterprise system integration</strong> — deployed on
              cloud-native infrastructure built for regulated industries.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every agent is <strong className="text-white font-medium">purpose-built for a specific operational domain</strong> —
              not a generic chatbot repurposed after the fact.{" "}
              <strong className="text-white font-medium">Aether agents</strong> natively understand{" "}
              your <strong className="text-white font-medium">document formats</strong>,{" "}
              <strong className="text-white font-medium">ERP schemas</strong>,{" "}
              <strong className="text-white font-medium">inventory structures</strong> and{" "}
              <strong className="text-white font-medium">recruitment workflows</strong>.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {[
                { label: "Document formats supported", value: "PDF · Scan · Email · EDI · Excel" },
                { label: "Data extraction accuracy", value: "99.2%" },
                { label: "ERP integrations", value: "SAP · Oracle · Dynamics · Custom" },
                { label: "Average deployment time", value: "4–6 weeks" },
                { label: "Human validation model", value: "Draft-only · Zero auto-execute" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[15px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
