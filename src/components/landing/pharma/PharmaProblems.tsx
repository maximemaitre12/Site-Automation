import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  { name: "AUTOMATED PHARMACOVIGILANCE", tag: "Signal Detection" },
  { name: "CLINICAL TRIAL OPTIMIZATION", tag: "Phase I–IV" },
  { name: "eCTD REGULATORY SUBMISSION", tag: "FDA · EMA" },
  { name: "QUALITY CONTROL BY COMPUTER VISION", tag: "GMP Compliance" },
  { name: "DRUG REPURPOSING & TARGET ID", tag: "R&D Pipeline" },
];

export function PharmaProblems() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Regulatory & operational challenges
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Your CTD filings
              <br />
              take 18 months.
              <br />
              We do 4.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
              <p>
                <strong style={{ color: "#0F172A" }}>Regulatory writing</strong> ties up your best people
                for months. <strong style={{ color: "#0F172A" }}>Pharmacovigilance reviews</strong> are still
                manual. Your <strong style={{ color: "#0F172A" }}>batch record data</strong> sits locked
                in siloed legacy systems with no cloud connectivity.
              </p>
              <p>
                Our <strong style={{ color: "#0F172A" }}>pharma-specialized NLP agents</strong> extract, classify
                and structure your <strong style={{ color: "#0F172A" }}>ICSRs</strong>, generate{" "}
                <strong style={{ color: "#0F172A" }}>PSURs/PBRERs</strong> and compile your{" "}
                <strong style={{ color: "#0F172A" }}>eCTD modules</strong> automatically — deployed on scalable cloud infrastructure.
              </p>
              <p>
                From <strong style={{ color: "#0F172A" }}>signal detection</strong> to{" "}
                <strong style={{ color: "#0F172A" }}>benefit-risk assessment</strong>, our AI operates
                within a native <strong style={{ color: "#0F172A" }}>ICH E2B(R3)</strong> framework,
                fully integrated with your existing data pipelines.
              </p>
            </div>

            <div className="mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Free regulatory audit
              </Link>
            </div>
          </div>

          <div>
            <div className="relative mb-14 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Automated pharmaceutical quality control"
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
