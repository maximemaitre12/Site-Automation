const stats = [
  { value: "40%", label: "Reduction", sub: "in preclinical time-to-market" },
  { value: "21", label: "CFR Part 11", sub: "native FDA compliance" },
  { value: "99.7%", label: "Accuracy", sub: "adverse event classification" },
  { value: "ICH", label: "Q8–Q12", sub: "frameworks integrated by default" },
];

export function PharmaStats() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#EAF3F7" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-start gap-8 mb-24">
          <div className="w-16 h-px mt-3 shrink-0" style={{ background: "#0369A1" }} />
          <p className="text-base md:text-[17px] leading-[1.85] max-w-[620px]" style={{ color: "#4a5568" }}>
            Our <strong style={{ color: "#0F172A" }}>machine learning pipelines</strong> are architected for
            <strong style={{ color: "#0F172A" }}> GMP/GLP/GCP-compliant</strong> environments — from{" "}
            <strong style={{ color: "#0F172A" }}>therapeutic target discovery</strong> to{" "}
            <strong style={{ color: "#0F172A" }}>eCTD submission</strong>. Every model is versioned, auditable and
            deployed through <strong style={{ color: "#0F172A" }}>IQ/OQ/PQ-validated CI/CD</strong> on cloud-native infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s) => (
            <div key={s.label} className="relative pl-6">
              <div className="w-8 h-[3px] mb-6" style={{ background: "#0369A1" }} />
              <div
                className="font-heading text-[52px] md:text-[64px] lg:text-[72px] font-bold leading-none mb-2"
                style={{ color: "#0369A1" }}
              >
                {s.value}
              </div>
              <div className="text-sm font-heading font-bold mb-1" style={{ color: "#0F172A" }}>
                {s.label}
              </div>
              <div className="text-[13px]" style={{ color: "#6b7c93" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
