import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              Pharmaceutical operations
            </span>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <ScrollReveal>
              <h2
                className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
                style={{ color: "#0F172A" }}
              >
                Your operations
                <br />
                deserve better
                <br />
                than spreadsheets.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
                <p>
                  Pharmaceutical companies operate under extraordinary pressure —{" "}
                  <strong style={{ color: "#0F172A" }}>tightening regulatory timelines</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>growing volumes</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>aging infrastructure</strong>. Yet most critical
                  workflows still depend on manual handling, disconnected tools and tribal knowledge
                  trapped in individual contributors.
                </p>
                <p>
                  We work with pharma operations teams to identify the processes that{" "}
                  <strong style={{ color: "#0F172A" }}>consume the most hours</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>generate the most errors</strong>, and{" "}
                  <strong style={{ color: "#0F172A" }}>create the highest compliance risk</strong> — then
                  we deploy AI agents that handle them end-to-end, integrated into the systems
                  your teams already use.
                </p>
                <p>
                  The result:{" "}
                  <strong style={{ color: "#0F172A" }}>your people focus on decisions</strong> — not
                  on copying data between systems, chasing missing documents or formatting reports
                  that should have been automated years ago.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-12">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                  style={{ background: "#0369A1" }}
                >
                  Free automation audit
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal>
              <div className="relative mb-14 overflow-hidden">
                <img
                  src={pharmaQuality}
                  alt="Pharmaceutical operations"
                  className="w-full h-[300px] lg:h-[360px] object-cover"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#0369A1" }} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#94a3b8" }}>
                Domains of intervention
              </p>
            </ScrollReveal>
            <div className="space-y-0">
              {domains.map((d, i) => (
                <ScrollReveal key={d.name} delay={150 + i * 60}>
                  <a
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
