import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  { name: "LOGISTICS & SUPPLY CHAIN", tag: "Inbound · Outbound · WMS" },
  { name: "DOCUMENT INTELLIGENCE", tag: "PDF · Email · EDI · Scans" },
  { name: "TALENT & RECRUITMENT", tag: "Sourcing · Scoring · HRIS" },
  { name: "REGULATORY & COMPLIANCE", tag: "GxP · eCTD · Pharmacovigilance" },
  { name: "ERP & SYSTEM INTEGRATION", tag: "SAP · Oracle · Dynamics" },
  { name: "CLOUD & INFRASTRUCTURE", tag: "Migration · DevOps · Security" },
  { name: "R&D & DATA SCIENCE", tag: "NLP · Computer Vision · ML" },
  { name: "QUALITY & AUDIT", tag: "CAPA · Deviations · Audit Trail" },
];

export function PharmaProblems() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            What we automate
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Any process.
              <br />
              Any system.
              <br />
              Any scale.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
              <p>
                From <strong style={{ color: "#0F172A" }}>logistics operations</strong> and{" "}
                <strong style={{ color: "#0F172A" }}>regulatory submissions</strong> to{" "}
                <strong style={{ color: "#0F172A" }}>talent acquisition</strong> and{" "}
                <strong style={{ color: "#0F172A" }}>quality management</strong> — we build
                AI agents that plug into your existing stack and automate the workflows
                that slow your teams down.
              </p>
              <p>
                Our agents handle <strong style={{ color: "#0F172A" }}>document processing</strong>,{" "}
                <strong style={{ color: "#0F172A" }}>data extraction</strong>,{" "}
                <strong style={{ color: "#0F172A" }}>ERP integration</strong>,{" "}
                <strong style={{ color: "#0F172A" }}>compliance monitoring</strong>,{" "}
                <strong style={{ color: "#0F172A" }}>pharmacovigilance</strong>,{" "}
                <strong style={{ color: "#0F172A" }}>cloud migration</strong> and{" "}
                <strong style={{ color: "#0F172A" }}>infrastructure modernization</strong>.
                Whatever your operational bottleneck — we've built an agent for it.
              </p>
              <p>
                Every deployment starts with a <strong style={{ color: "#0F172A" }}>free audit</strong> of your
                current workflows. We identify the <strong style={{ color: "#0F172A" }}>highest-impact automation
                opportunities</strong>, prototype in <strong style={{ color: "#0F172A" }}>4–6 weeks</strong>, and
                scale from there — always with <strong style={{ color: "#0F172A" }}>human validation</strong> at every step.
              </p>
            </div>

            <div className="mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Free automation audit
              </Link>
            </div>
          </div>

          <div>
            <div className="relative mb-14 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Enterprise automation at scale"
                className="w-full h-[300px] lg:h-[360px] object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#0369A1" }} />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#94a3b8" }}>
              Domains of intervention
            </p>
            <div className="space-y-0">
              {domains.map((d) => (
                <a
                  key={d.name}
                  href="#expertise"
                  className="flex items-center justify-between py-4 transition-opacity hover:opacity-60 group"
                  style={{ borderBottom: "1px solid #e8ecf1" }}
                >
                  <span className="text-[15px] md:text-base font-heading font-bold tracking-[0.04em]" style={{ color: "#0F172A" }}>
                    {d.name}
                  </span>
                  <span className="text-[11px] tracking-wider uppercase" style={{ color: "#94a3b8" }}>
                    {d.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
