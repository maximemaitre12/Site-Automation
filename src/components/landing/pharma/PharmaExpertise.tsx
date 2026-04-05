import { ScrollReveal } from "@/components/ui/ScrollReveal";

const areas = [
  { title: "DOCUMENT INTELLIGENCE", desc: "Automated extraction from PDFs, scans, emails and EDI files. Key data identification — lot numbers, quantities, expiry dates, product references. Structured output ready for ERP ingestion. Handles multi-format, multi-language documents at scale." },
  { title: "LOGISTICS AUTOMATION", desc: "End-to-end inbound and outbound flow automation. Reception order drafting from supplier documents, dispatch order generation from client requests. Inventory matching, product identification and pick & pack preparation — all as validated drafts." },
  { title: "TALENT INTELLIGENCE", desc: "Continuous market monitoring across job boards, professional networks and internal databases. AI-scored candidate profiles with qualification filtering by role, location, certifications and salary range. Structured shortlists and priority-ranked recommendations." },
  { title: "ERP & SYSTEM INTEGRATION", desc: "Direct integration with your existing ERP, WMS, HRIS and email systems. API-first architecture that connects to SAP, Oracle, Microsoft Dynamics or custom platforms. No rip-and-replace — agents plug into your current stack." },
  { title: "CLOUD MIGRATION & MODERNIZATION", desc: "Migration from legacy on-premise systems to cloud-native infrastructure. Multi-cloud support (AWS, Azure, GCP) with IaC deployment, auto-scaling and disaster recovery. Compliance-ready architecture for regulated environments." },
  { title: "COMPLIANCE & AUDIT TRAIL", desc: "Native audit trail architecture with immutable logs. Every agent action is tracked, timestamped and attributed. Role-based access control, encryption at rest/in transit, and full traceability from raw input to automated draft output." },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              What our agents automate
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2
            className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
            style={{ color: "#0F172A" }}
          >
            Enterprise-grade
            <br />
            AI automation.
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {areas.map((a, i) => (
            <ScrollReveal key={a.title} delay={i * 80}>
              <div
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
