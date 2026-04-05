import { FlaskConical, ShieldCheck, Brain, Microscope, Database, FileSearch, Activity, Shield, Pill, Eye } from "lucide-react";

export function PharmaAIPlatform() {
  return (
    <section className="py-20 md:py-28" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Proprietary AI · Pharma R&D
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          <div>
            <h2 className="font-heading text-[32px] md:text-[44px] lg:text-[48px] font-bold leading-[1.08] mb-6 text-white">
              Aether Pharma AI.
              <br />
              <span style={{ color: "#22D3EE" }}>Built from research.</span>
            </h2>
            <p className="text-[14px] md:text-[15px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.55)" }}>
              <strong className="text-white font-medium">Aether Pharma AI</strong> is the product of{" "}
              <strong className="text-white font-medium">dedicated R&D in pharmaceutical intelligence</strong> —
              from regulatory corpus training to domain-specific model evaluation.
              Every model natively understands{" "}
              <strong className="text-white font-medium">MedDRA</strong>,{" "}
              <strong className="text-white font-medium">eCTD/CTD</strong>,{" "}
              <strong className="text-white font-medium">ICH Q8–Q12</strong> and{" "}
              <strong className="text-white font-medium">21 CFR Part 11</strong>.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-0">
              {[
                { label: "Regulatory documents indexed", value: "12,000+" },
                { label: "MedDRA classification accuracy", value: "99.2%" },
                { label: "Compliance frameworks", value: "ICH · FDA · EMA · ANSM" },
                { label: "Pharma NLP languages", value: "14" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[14px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture Schema */}
        <div className="rounded-xl p-6 md:p-10 lg:p-12" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Title */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#22D3EE" }}>
              Platform architecture
            </span>
          </div>

          {/* Layer 1 — Data Sources */}
          <div className="mb-3">
            <div className="text-[9px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Data ingestion
            </div>
            <div className="flex flex-wrap gap-2">
              {["Emails & PDFs", "EDI / ERP feeds", "Job boards", "ICSRs (E2B)", "Regulatory feeds"].map((s) => (
                <div key={s} className="px-3 py-1.5 rounded text-[11px] font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Connector line */}
          <div className="flex justify-center py-2">
            <div className="w-px h-6" style={{ background: "rgba(34,211,238,0.3)" }} />
          </div>

          {/* Layer 2 — Core Engine */}
          <div className="rounded-lg p-5 md:p-6 mb-3" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <div className="text-center mb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#22D3EE" }}>
                Aether Core Engine
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Brain, label: "Pharma NLP" },
                { icon: Database, label: "RAG Pipeline" },
                { icon: FileSearch, label: "Vector DB" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center gap-2 py-3 rounded-md" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <m.icon className="w-4 h-4" style={{ color: "#22D3EE" }} />
                  <span className="text-[10px] font-semibold text-white">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connector line */}
          <div className="flex justify-center py-2">
            <div className="w-px h-6" style={{ background: "rgba(34,211,238,0.3)" }} />
          </div>

          {/* Layer 3 — Agent Modules */}
          <div className="mb-3">
            <div className="text-[9px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Specialized agents
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { icon: Activity, label: "Operations", sub: "Logistics flows" },
                { icon: Shield, label: "Regulatory", sub: "Compliance" },
                { icon: Pill, label: "Pharmacovigilance", sub: "Signal detection" },
                { icon: FlaskConical, label: "Quality", sub: "GxP monitoring" },
                { icon: Microscope, label: "R&D Intel", sub: "Literature review" },
                { icon: Eye, label: "Observability", sub: "Live dashboards" },
              ].map((a) => (
                <div key={a.label} className="flex flex-col items-center text-center gap-1.5 py-3 px-2 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <a.icon className="w-3.5 h-3.5" style={{ color: "#22D3EE" }} />
                  <span className="text-[10px] font-bold text-white leading-tight">{a.label}</span>
                  <span className="text-[9px] leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>{a.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connector line */}
          <div className="flex justify-center py-2">
            <div className="w-px h-6" style={{ background: "rgba(34,211,238,0.3)" }} />
          </div>

          {/* Layer 4 — Governance */}
          <div className="flex items-center justify-center gap-3 py-3 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
            <ShieldCheck className="w-4 h-4" style={{ color: "#22D3EE" }} />
            <span className="text-[11px] font-semibold text-white">Human-in-the-loop governance</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>— all outputs are drafts</span>
          </div>
        </div>

        {/* R&D Pillars */}
        <div className="mt-16">
          <h3 className="font-heading text-[22px] md:text-[26px] font-bold leading-[1.15] mb-8 text-white">
            Research company first.{" "}
            <span style={{ color: "rgba(255,255,255,0.45)" }}>Every agent comes from our lab.</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FlaskConical, title: "Pharma-native models", desc: "Foundation models trained exclusively on pharmaceutical and regulatory corpora." },
              { icon: ShieldCheck, title: "Regulatory engineering", desc: "ICH, FDA, EMA guidelines encoded as machine-readable rule sets." },
              { icon: Brain, title: "Agent research", desc: "Multi-agent coordination and reasoning chains for regulated environments." },
              { icon: Microscope, title: "Domain evaluation", desc: "Proprietary benchmarks for MedDRA coding, eCTD and ICSR extraction." },
            ].map((p) => (
              <div key={p.title} className="p-5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-md mb-3" style={{ background: "rgba(34,211,238,0.1)" }}>
                  <p.icon className="w-4 h-4" style={{ color: "#22D3EE" }} />
                </div>
                <h4 className="font-heading text-[13px] font-bold text-white mb-1.5">{p.title}</h4>
                <p className="text-[12px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
