import { ScrollReveal } from "@/components/ui/ScrollReveal";

const blocks = [
  { title: "GxP-NATIVE BY DESIGN", desc: "Every component of our stack is engineered for GMP, GLP and GCP environments. No retrofitting — compliance is architectural, not cosmetic. Built for cloud-native deployment from the ground up." },
  { title: "INTEGRATED CSV VALIDATION", desc: "Automated IQ/OQ/PQ protocols, validation reports generated with every release. Full traceability from source code to inference results, compliant with Annex 11 and 21 CFR Part 11." },
  { title: "MODELS TRAINED ON PHARMA DATA", desc: "Our NLP models are fine-tuned on regulatory corpora (ICH, FDA Guidance, EMA Scientific Guidelines) and anonymized pharmacovigilance datasets — not generic internet data." },
  { title: "ZERO-DISRUPTION DEPLOYMENT", desc: "Native integration with your LIMS, MES, ERP (SAP), EDMS and pharmacovigilance systems (Argus, ArisGlobal). Containerized microservices architecture with zero-downtime deployment. Cloud or hybrid, your choice." },
];

export function PharmaTrust() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              Regulatory guarantees
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2
            className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
            style={{ color: "#0F172A" }}
          >
            Compliance is not
            <br />
            a feature. It's the
            <br />
            architecture.
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-0">
          {blocks.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 100}>
              <div
                className="p-8 lg:p-10"
                style={{
                  borderRight: i % 2 === 0 ? "1px solid rgba(3,105,161,0.12)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(3,105,161,0.12)" : "none",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                  <h3 className="font-heading text-[12px] font-bold tracking-[0.15em]" style={{ color: "#0F172A" }}>{b.title}</h3>
                </div>
                <p className="text-[15px] leading-[1.85]" style={{ color: "#3d5060" }}>{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
