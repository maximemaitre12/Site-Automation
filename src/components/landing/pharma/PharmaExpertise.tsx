const areas = [
  { title: "PHARMACOVIGILANCE & SIGNAL DETECTION", desc: "Automated safety signal detection across ICSR databases. MedDRA classification, disproportionality scoring (PRR, ROR, EBGM) and generation of ICH E2E-compliant PSUR/PBRER reports — fully integrated with your existing safety data lake." },
  { title: "CLINICAL TRIAL OPTIMIZATION", desc: "Patient-protocol matching through NLP on inclusion/exclusion criteria. Attrition prediction, cohort optimization and adaptive monitoring of primary and secondary endpoints. Cloud-based dashboards for real-time trial oversight." },
  { title: "GMP COMPUTER VISION", desc: "Automated inspection of packaging lines: particle detection in injectable solutions, crimp integrity verification, batch number OCR. Annex 11 and 21 CFR Part 211 compliant. Deployed on edge or cloud depending on throughput requirements." },
  { title: "AI-POWERED REGULATORY WRITING", desc: "AI-assisted generation of eCTD modules (Module 2.5, 2.7, 3.2.S/P). Automatic cross-referencing against ICH Q8-Q12, FDA and EMA guidelines. Pre-validation of submissions before gateway upload — cutting months off your filing timeline." },
  { title: "DRUG DISCOVERY & REPURPOSING", desc: "Molecular docking models, ADMET prediction, virtual screening via graph neural networks. Identification of new therapeutic indications through biological network analysis. Direct integration with your HTS platforms and cloud data warehouses." },
  { title: "DATA INTEGRITY & AUDIT TRAIL", desc: "Native ALCOA+ architecture. Immutable audit trails, electronic signatures compliant with 21 CFR Part 11, RBAC access control and AES-256 encryption at rest/in transit. Full traceability from raw data to automated decision — cloud or on-premise." },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Pharma-specialized AI capabilities
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          Pharmaceutical-grade
          <br />
          AI automation.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {areas.map((a, i) => (
            <div
              key={a.title}
              className="group cursor-default p-8 transition-colors hover:bg-[#f5f9fb]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid #e8ecf1" : "none",
                borderBottom: i < 3 ? "1px solid #e8ecf1" : "none",
              }}
            >
              <div className="w-6 h-[2px] mb-6" style={{ background: "#0369A1" }} />
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.15em] mb-4"
                style={{ color: "#0F172A" }}
              >
                {a.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: "#5a6577" }}>
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
