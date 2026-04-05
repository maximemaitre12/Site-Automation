import pharmaProduction from "@/assets/pharma-production.jpg";

const quality = [
  { value: "40%", desc: "Reduction in preclinical time-to-market" },
  { value: "–85%", desc: "ICSR review time through automated pharmacovigilance" },
  { value: "4–6", desc: "Weeks to a validated MVP in GxP environments" },
  { value: "99.7%", desc: "MedDRA classification accuracy on adverse events" },
  { value: "24/7", desc: "Continuous post-market safety signal monitoring" },
  { value: "100%", desc: "ALCOA+ traceability on every automated action" },
];

export function PharmaMethodology() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#EAF3F7" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Clinical & operational results
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-6"
              style={{ color: "#0F172A" }}
            >
              Validated KPIs
              <br />
              in regulated
              <br />
              environments.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] max-w-[520px]" style={{ color: "#4a5568" }}>
              Every deployment undergoes full <strong style={{ color: "#0F172A" }}>IQ/OQ/PQ qualification</strong>.
              Performance is measured against <strong style={{ color: "#0F172A" }}>statistically validated endpoints</strong> and
              documented in <strong style={{ color: "#0F172A" }}>CSV validation reports</strong> — giving your QA team
              complete audit-ready documentation from day one.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <img
              src={pharmaProduction}
              alt="AI in GMP pharmaceutical production"
              className="w-full h-[260px] lg:h-[300px] object-cover"
              loading="lazy"
              width={1280}
              height={720}
            />
            <div className="absolute bottom-0 left-0 w-24 h-1" style={{ background: "#0369A1" }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {quality.map((q, i) => (
            <div
              key={q.desc}
              className="p-8"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(3,105,161,0.12)" : "none",
                borderBottom: i < 3 ? "1px solid rgba(3,105,161,0.12)" : "none",
              }}
            >
              <div
                className="font-heading text-[44px] md:text-[52px] lg:text-[58px] font-bold leading-none mb-3"
                style={{ color: "#0369A1" }}
              >
                {q.value}
              </div>
              <p className="text-[13px] leading-[1.7]" style={{ color: "#5a6577" }}>
                {q.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
