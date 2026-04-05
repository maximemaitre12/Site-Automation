import { Package, Users, Bot, CheckCircle } from "lucide-react";
import farmasoftLogo from "@/assets/farmasoft-client-logo.png";
import farmasoftWarehouse from "@/assets/farmasoft-warehouse.jpg";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#0369A1]/10 text-[#0369A1] text-[11px] font-semibold tracking-[0.2em] uppercase">
            Client case study
          </span>
        </div>
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px] bg-[#0369A1]" />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#0369A1]">
            Enterprise deployment · Pharmaceutical logistics
          </span>
        </div>

        {/* Client header */}
        <div className="mb-10">
          <div className="mb-10">
            <img
              src={farmasoftLogo}
              alt="Farmasoft — Reliable Logistics"
              className="h-28 md:h-36 object-contain"
              loading="lazy"
            />
          </div>
          <h2 className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-[#111]">
            Farmasoft × Aether Connect
            <br />
            <span className="text-[#0369A1]">Two AI agents. One operational backbone.</span>
          </h2>
          <p className="text-[15px] md:text-base leading-[1.85] mb-6 text-[#6B6560] max-w-3xl">
            <strong className="text-[#111] font-medium">Farmasoft</strong> is a major European pharmaceutical
            logistics operator managing <strong className="text-[#111] font-medium">high-volume inbound and
            outbound flows</strong> across regulated supply chains. Their operational challenge:
            manual document processing, fragmented order workflows, and a recruitment pipeline
            that couldn't keep pace with growth.
          </p>
          <p className="text-[15px] md:text-base leading-[1.85] text-[#6B6560] max-w-3xl">
            We deployed <strong className="text-[#111] font-medium">two purpose-built AI agents</strong> —
            not a collection of disconnected tools — designed to integrate directly into their
            existing systems and operate under <strong className="text-[#111] font-medium">strict human
            validation at every step</strong>.
          </p>
        </div>

        {/* Two agents */}
        <div className="grid lg:grid-cols-2 gap-0 mb-20">
          {/* Agent 1 — Operations */}
          <div className="p-10 lg:p-12 border-r border-b border-[#eae7e2]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0369A1]/10">
                <Package className="w-5 h-5 text-[#0369A1]" />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block text-[#0369A1]">Agent 01</span>
                <h3 className="font-heading text-lg font-bold text-[#111]">Operations Intelligence</h3>
              </div>
            </div>

            <p className="text-[14px] leading-[1.8] mb-8 text-[#6B6560]">
              Automates inbound and outbound logistics flows through a single unified intelligence
              layer — eliminating manual data entry and reducing order preparation errors.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111]/70 block mb-2">Inbound — Reception</span>
                <ul className="space-y-2">
                  {[
                    "Email and document ingestion (PDF, scans, EDI)",
                    "Key data extraction — lot numbers, quantities, expiry dates",
                    "Automated draft reception orders in ERP",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B6560]">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111]/70 block mb-2">Outbound — Dispatch</span>
                <ul className="space-y-2">
                  {[
                    "Client request analysis (email, Excel, API)",
                    "Product identification and inventory matching",
                    "Draft pick & pack preparation orders",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B6560]">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#0369A1]/5">
              <Bot className="w-4 h-4 text-[#0369A1]" />
              <span className="text-[12px] text-[#6B6560]">
                All outputs are <strong className="text-[#111] font-medium">draft-only</strong> — human validation before execution
              </span>
            </div>
          </div>

          {/* Agent 2 — Talent */}
          <div className="p-10 lg:p-12 border-b border-[#eae7e2]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0369A1]/10">
                <Users className="w-5 h-5 text-[#0369A1]" />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block text-[#0369A1]">Agent 02</span>
                <h3 className="font-heading text-lg font-bold text-[#111]">Talent Intelligence</h3>
              </div>
            </div>

            <p className="text-[14px] leading-[1.8] mb-8 text-[#6B6560]">
              Continuously scans the employment market to identify and qualify the most relevant
              profiles — reducing time-to-hire and improving candidate quality for critical pharma roles.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111]/70 block mb-2">Intelligence engine</span>
                <ul className="space-y-2">
                  {[
                    "Automated market monitoring across job boards and networks",
                    "Filtering by role, location, salary range, certifications",
                    "Qualified shortlists with AI-scored candidate profiles",
                    "Actionable HR recommendations with priority ranking",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B6560]">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111]/70 block mb-2">Deliverables</span>
                <ul className="space-y-2">
                  {[
                    "Structured candidate synthesis cards",
                    "Profile prioritization based on operational fit",
                    "Integration-ready data for existing HRIS",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B6560]">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#0369A1]/5">
              <Bot className="w-4 h-4 text-[#0369A1]" />
              <span className="text-[12px] text-[#6B6560]">
                Human decision required <strong className="text-[#111] font-medium">before any candidate interaction</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial only */}
        <div className="max-w-2xl">
          <div className="relative pl-6 border-l-2 border-[#0369A1]/30">
            <p className="text-base md:text-lg italic leading-relaxed mb-5 text-[#111]/80">
              "We didn't need another SaaS dashboard. We needed intelligence that plugs into our
              existing systems and lets our teams focus on decisions, not data entry. That's exactly
              what these two agents deliver."
            </p>
            <p className="text-sm font-semibold text-[#111]/90">COO — Farmasoft</p>
          </div>
        </div>
      </div>
    </section>
  );
}
