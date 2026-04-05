const capabilities = [
  {
    title: "REGULATORY NLP ENGINE",
    desc: "Trained on over 12,000 ICH documents, FDA Guidance, EMA Guidelines and Pharmacopoeias. Contextual understanding of CTD, MedDRA, WHO-DD and ATC terminologies. Pharmaceutical named entity extraction with 99.2% accuracy. Cloud-hosted for instant scalability.",
  },
  {
    title: "PHARMACOVIGILANCE MODULE",
    desc: "Automatic ingestion of ICSRs from E2B(R3), signal detection via multi-dimensional disproportionality algorithms (PRR, ROR, MGPS/EBGM), automated PSUR/PBRER and Line Listing generation. Connects directly to your safety database via API.",
  },
  {
    title: "DRUG DISCOVERY PIPELINE",
    desc: "Virtual screening through graph neural networks across molecular libraries. ADMET prediction, druggability analysis, target identification via protein-protein interaction networks. Direct integration with your HTS platforms and cloud data warehouses.",
  },
  {
    title: "QUALITY COMPUTER VISION",
    desc: "Anomaly detection models trained on real GMP data: particles in injectable solutions, crimp defects, blister integrity. Detection thresholds below pharmacopoeial specifications. Deployable on edge devices or cloud depending on your line throughput.",
  },
  {
    title: "INTELLIGENT eCTD COMPILER",
    desc: "Automatic assembly of eCTD modules with dynamic cross-referencing. Pre-validation of submissions against FDA ESG and EMA eSubmission Gateway business rules. Proactive detection of inter-module inconsistencies — reducing filing cycles by months.",
  },
  {
    title: "REAL-TIME COMPLIANCE ENGINE",
    desc: "Continuous monitoring of GMP deviations, open CAPAs and change controls. Automated quality risk scoring based on ICH Q9. Predictive alerts before regulatory escalation. Full dashboard visibility across your entire operations footprint.",
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
              Aether Pharma AI.
              <br />
              <span style={{ color: "#22D3EE" }}>Built for science.</span>
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Our artificial intelligence platform is the result of{" "}
              <strong className="text-white font-medium">deep research in biomedical NLP</strong>,
              <strong className="text-white font-medium"> computational molecular modeling</strong> and
              <strong className="text-white font-medium"> regulatory engineering</strong> — deployed on
              cloud-native infrastructure designed for enterprise-scale pharma operations.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every module is <strong className="text-white font-medium">specifically fine-tuned on pharmaceutical corpora</strong> —
              not a generalist LLM adapted after the fact.{" "}
              <strong className="text-white font-medium">Aether Pharma AI</strong> natively understands{" "}
              <strong className="text-white font-medium">MedDRA</strong>,{" "}
              <strong className="text-white font-medium">WHO-DD</strong>,{" "}
              <strong className="text-white font-medium">SNOMED CT</strong> and{" "}
              <strong className="text-white font-medium">eCTD/CTD</strong> structures.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {[
                { label: "Regulatory corpus indexed", value: "12,000+" },
                { label: "MedDRA classification accuracy", value: "99.2%" },
                { label: "Languages supported (medical NLP)", value: "14" },
                { label: "Average eCTD compilation time", value: "< 4h" },
                { label: "Integrated compliance frameworks", value: "ICH · FDA · EMA · ANSM" },
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
