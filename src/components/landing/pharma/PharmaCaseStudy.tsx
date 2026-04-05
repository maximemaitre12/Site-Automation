import { Package, Users, Bot, CheckCircle } from "lucide-react";
import farmasoftLogo from "@/assets/farmasoft-client-logo.png";
import farmasoftWarehouse from "@/assets/farmasoft-warehouse.jpg";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
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
        </ScrollReveal>

        {/* Client header */}
        <div className="mb-10">
          <ScrollReveal>
            <div className="mb-10">
              <img
                src={farmasoftLogo}
                alt="Farmasoft — Reliable Logistics"
                className="h-28 md:h-36 object-contain"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-[#111]">
              Farmasoft × Aether Connect
              <br />
              <span className="text-[#0369A1]">Two AI agents. One operational backbone.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-[15px] md:text-base leading-[1.85] mb-6 text-[#6B6560] max-w-3xl">
              <strong className="text-[#111] font-medium">Farmasoft</strong> is a major European pharmaceutical
              logistics operator managing <strong className="text-[#111] font-medium">high-volume inbound and
              outbound flows</strong> across regulated supply chains.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85] text-[#6B6560] max-w-3xl">
              We deployed <strong className="text-[#111] font-medium">two purpose-built AI agents</strong> —
              designed to integrate directly into their existing systems and operate under{" "}
              <strong className="text-[#111] font-medium">strict human validation at every step</strong>.
            </p>
          </ScrollReveal>
        </div>

        {/* Warehouse photo */}
        <ScrollReveal>
          <div className="mb-20 rounded-xl overflow-hidden">
            <img
              src={farmasoftWarehouse}
              alt="Farmasoft pharmaceutical logistics warehouse"
              className="w-full h-[280px] md:h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </ScrollReveal>

        {/* Two agents — compact */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <ScrollReveal>
            <div className="p-6 lg:p-8 rounded-xl border border-[#eae7e2] bg-[#FAFAF9] h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0369A1]/10">
                  <Package className="w-4 h-4 text-[#0369A1]" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block text-[#0369A1]">Agent 01</span>
                  <h3 className="font-heading text-base font-bold text-[#111]">Operations Intelligence</h3>
                </div>
              </div>
              <p className="text-[13px] leading-[1.75] mb-5 text-[#6B6560]">
                Automates inbound/outbound logistics — document ingestion, data extraction,
                ERP draft orders and inventory matching.
              </p>
              <ul className="space-y-2 mb-5">
                {["Email & PDF ingestion, lot/expiry extraction", "Automated draft reception & dispatch orders", "Product identification & inventory matching"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-[#6B6560]">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0369A1]/5">
                <Bot className="w-3.5 h-3.5 text-[#0369A1]" />
                <span className="text-[11px] text-[#6B6560]">
                  All outputs are <strong className="text-[#111] font-medium">draft-only</strong> — human validation required
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="p-6 lg:p-8 rounded-xl border border-[#eae7e2] bg-[#FAFAF9] h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0369A1]/10">
                  <Users className="w-4 h-4 text-[#0369A1]" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block text-[#0369A1]">Agent 02</span>
                  <h3 className="font-heading text-base font-bold text-[#111]">Talent Intelligence</h3>
                </div>
              </div>
              <p className="text-[13px] leading-[1.75] mb-5 text-[#6B6560]">
                Continuously scans the employment market to identify, qualify, and rank
                the most relevant profiles for critical pharma roles.
              </p>
              <ul className="space-y-2 mb-5">
                {["Automated monitoring across job boards & networks", "AI-scored candidate profiles & priority ranking", "Structured synthesis cards, HRIS-ready data"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-[#6B6560]">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#0369A1]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0369A1]/5">
                <Bot className="w-3.5 h-3.5 text-[#0369A1]" />
                <span className="text-[11px] text-[#6B6560]">
                  Human decision required <strong className="text-[#111] font-medium">before any candidate interaction</strong>
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Testimonial */}
        <ScrollReveal>
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
        </ScrollReveal>
      </div>
    </section>
  );
}
