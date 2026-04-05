import { Star, Package, Users, Bot, CheckCircle } from "lucide-react";
import farmasoftLogo from "@/assets/farmasoft-client-logo.png";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-28 md:py-36" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Enterprise deployment · Pharmaceutical logistics
          </span>
        </div>

        {/* Client header */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <div>
            <div className="mb-10">
              <img
                src={farmasoftLogo}
                alt="Farmasoft — Reliable Logistics"
                className="h-14 md:h-16 object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-white">
              Two AI agents.
              <br />
              <span style={{ color: "#22D3EE" }}>One operational backbone.</span>
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              <strong className="text-white font-medium">Farmasoft</strong> is a major European pharmaceutical
              logistics operator managing <strong className="text-white font-medium">high-volume inbound and
              outbound flows</strong> across regulated supply chains. Their operational challenge:
              manual document processing, fragmented order workflows, and a recruitment pipeline
              that couldn't keep pace with growth.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.55)" }}>
              We deployed <strong className="text-white font-medium">two purpose-built AI agents</strong> —
              not a collection of disconnected tools — designed to integrate directly into their
              existing systems and operate under <strong className="text-white font-medium">strict human
              validation at every step</strong>.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {[
                { label: "Annual revenue", value: "€200M+" },
                { label: "Daily logistics operations", value: "2,500+" },
                { label: "Warehousing facilities", value: "12 sites" },
                { label: "GDP/GMP compliance", value: "Full scope" },
                { label: "Countries served", value: "14" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[15px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two agents */}
        <div className="grid lg:grid-cols-2 gap-0 mb-20">
          {/* Agent 1 — Operations */}
          <div className="p-10 lg:p-12" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)" }}>
                <Package className="w-5 h-5" style={{ color: "#22D3EE" }} />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block" style={{ color: "#22D3EE" }}>Agent 01</span>
                <h3 className="font-heading text-lg font-bold text-white">Operations Intelligence</h3>
              </div>
            </div>

            <p className="text-[14px] leading-[1.8] mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              Automates inbound and outbound logistics flows through a single unified intelligence
              layer — eliminating manual data entry and reducing order preparation errors.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 block mb-2">Inbound — Reception</span>
                <ul className="space-y-2">
                  {[
                    "Email and document ingestion (PDF, scans, EDI)",
                    "Key data extraction — lot numbers, quantities, expiry dates",
                    "Automated draft reception orders in ERP",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 block mb-2">Outbound — Dispatch</span>
                <ul className="space-y-2">
                  {[
                    "Client request analysis (email, Excel, API)",
                    "Product identification and inventory matching",
                    "Draft pick & pack preparation orders",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Bot className="w-4 h-4" style={{ color: "#22D3EE" }} />
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                All outputs are <strong className="text-white font-medium">draft-only</strong> — human validation before execution
              </span>
            </div>
          </div>

          {/* Agent 2 — Talent */}
          <div className="p-10 lg:p-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)" }}>
                <Users className="w-5 h-5" style={{ color: "#22D3EE" }} />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block" style={{ color: "#22D3EE" }}>Agent 02</span>
                <h3 className="font-heading text-lg font-bold text-white">Talent Intelligence</h3>
              </div>
            </div>

            <p className="text-[14px] leading-[1.8] mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              Continuously scans the employment market to identify and qualify the most relevant
              profiles — reducing time-to-hire and improving candidate quality for critical pharma roles.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 block mb-2">Intelligence engine</span>
                <ul className="space-y-2">
                  {[
                    "Automated market monitoring across job boards and networks",
                    "Filtering by role, location, salary range, certifications",
                    "Qualified shortlists with AI-scored candidate profiles",
                    "Actionable HR recommendations with priority ranking",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 block mb-2">Deliverables</span>
                <ul className="space-y-2">
                  {[
                    "Structured candidate synthesis cards",
                    "Profile prioritization based on operational fit",
                    "Integration-ready data for existing HRIS",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Bot className="w-4 h-4" style={{ color: "#22D3EE" }} />
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Human decision required <strong className="text-white font-medium">before any candidate interaction</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Results + testimonial */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="space-y-0">
              {[
                { val: "–72%", label: "Reduction in manual document processing time" },
                { val: "–65%", label: "Time-to-hire for qualified pharma logistics roles" },
                { val: "3x", label: "Faster order preparation cycle (inbound to dispatch)" },
                { val: "0", label: "Unvalidated automated actions — human-in-the-loop enforced" },
              ].map((m) => (
                <div key={m.val + m.label} className="py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="font-heading text-[36px] md:text-[44px] font-bold mb-2 text-white">{m.val}</div>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="relative pl-6" style={{ borderLeft: "2px solid rgba(34,211,238,0.3)" }}>
              <p className="text-base md:text-lg italic leading-relaxed mb-5 text-white/80">
                "We didn't need another SaaS dashboard. We needed intelligence that plugs into our
                existing systems and lets our teams focus on decisions, not data entry. That's exactly
                what these two agents deliver."
              </p>
              <p className="text-sm font-semibold text-white/90">COO — Farmasoft</p>
              <div className="flex items-center gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "#FBBF24" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
