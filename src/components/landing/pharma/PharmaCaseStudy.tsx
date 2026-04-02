import { ArrowRight, Star } from "lucide-react";

const results = [
  { category: "Talent Acquisition", before: "28 weeks", after: "8 weeks", gain: "71% faster" },
  { category: "Cost Savings (Talent)", before: "Bad hire risk", after: "€200k saved", gain: "quality hires" },
  { category: "Production Capacity", before: "100 units/day", after: "200 units/day", gain: "+100%" },
  { category: "GMP Audit Findings", before: "3 critical", after: "0 findings", gain: "FDA-ready" },
  { category: "Batch Traceability", before: "92%", after: "100%", gain: "Full compliance" },
  { category: "Change Control", before: "40 days", after: "5 days", gain: "-87.5%" },
];

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3" style={{ color: "#1A3A6B" }}>
            Cas d'étude : Farmasoft UA
          </h2>
          <p className="text-lg" style={{ color: "#4A5568" }}>
            Transformation des opérations pharma. Recruitment scaling + GMP traceability en 16 semaines.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className="space-y-8">
            {/* Context */}
            <div className="rounded-lg p-5" style={{ background: "#F9FBFC", borderLeft: "4px solid #0D8B5E" }}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#1A3A6B" }}>Farmasoft UA</h3>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: "#2C3E50" }}>
                <span>Secteur: Pharma Manufacturing</span>
                <span>Employés: 180</span>
                <span>Spécialité: Génériques, APIs</span>
                <span>Croissance: 40% YoY</span>
              </div>
            </div>

            {/* Challenges */}
            <div className="rounded-lg p-5" style={{ background: "#FFF9F0", borderLeft: "4px solid #FF8A45" }}>
              <h3 className="font-heading text-sm font-bold mb-3" style={{ color: "#FF8A45" }}>Les Défis</h3>
              <div className="space-y-3 text-sm" style={{ color: "#2C3E50" }}>
                <div>
                  <span className="font-bold">Challenge 1: Talent Pharma</span>
                  <p className="mt-1" style={{ color: "#4A5568" }}>QA Manager search: 28 semaines, mauvais match. Impossible de recruter assez de talent pharma-qualified pour la croissance.</p>
                </div>
                <div>
                  <span className="font-bold">Challenge 2: GMP Compliance Scaling</span>
                  <p className="mt-1" style={{ color: "#4A5568" }}>Besoin de doubler la production (100→200 units/day) tout en maintenant 100% compliance GMP. Batch records manuels, traçabilité incomplète.</p>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="rounded-lg p-5" style={{ background: "#F0FFF4", borderLeft: "4px solid #0D8B5E" }}>
              <h3 className="font-heading text-sm font-bold mb-3" style={{ color: "#0D8B5E" }}>Notre Intervention</h3>
              <div className="space-y-4 text-sm" style={{ color: "#2C3E50" }}>
                <div>
                  <span className="font-bold">Solution 1: Pharma Talent Strategy</span>
                  <ul className="mt-1 space-y-1">
                    {["Mapped regulatory-focused talent in pharma network", "Pre-validated regulatory knowledge (assessment)", "Hired: 1x QA Manager, 2x Manufacturing Engineers, 1x Regulatory Coordinator"].map(s => (
                      <li key={s} className="flex items-start gap-2"><span style={{ color: "#0D8B5E" }}>✓</span> {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold">Solution 2: GMP Modernization</span>
                  <ul className="mt-1 space-y-1">
                    {["Redesigned batch record process", "Implemented digitized change control", "Established 21 CFR Part 11 compliance", "Trained team on new processes"].map(s => (
                      <li key={s} className="flex items-start gap-2"><span style={{ color: "#0D8B5E" }}>✓</span> {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-lg p-6 text-white" style={{ background: "#1A3A6B" }}>
              <h3 className="font-heading text-lg font-bold mb-4">Résultats mesurés & validés</h3>
              <div className="space-y-3">
                {results.map((r) => (
                  <div key={r.category} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm border-b border-white/20 pb-2">
                    <span className="font-semibold">{r.category}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="opacity-70 line-through">{r.before}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-bold">{r.after}</span>
                      <span className="opacity-60">· {r.gain}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/30 text-center">
                <div className="text-3xl font-bold">€1,500,000+</div>
                <div className="text-sm opacity-80">Total value created Year 1</div>
                <div className="mt-2 text-xs opacity-70">Investment: €85k · ROI: 1,760% · Payback: 0.7 months</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Charts */}
            <div className="rounded-lg border p-5" style={{ borderColor: "#E8EFF8" }}>
              <h4 className="font-heading text-sm font-bold mb-4" style={{ color: "#1A3A6B" }}>Recruitment Timeline</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs mb-1" style={{ color: "#6B7C8C" }}>Before: 28 weeks</div>
                  <div className="h-6 rounded" style={{ background: "#FF8A45", width: "100%" }} />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: "#6B7C8C" }}>After: 8 weeks</div>
                  <div className="h-6 rounded" style={{ background: "#0D8B5E", width: "28%" }} />
                </div>
              </div>
              <div className="text-sm font-bold mt-3" style={{ color: "#0D8B5E" }}>71% reduction</div>
            </div>

            <div className="rounded-lg border p-5" style={{ borderColor: "#E8EFF8" }}>
              <h4 className="font-heading text-sm font-bold mb-4" style={{ color: "#1A3A6B" }}>FDA Audit Readiness</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs mb-1" style={{ color: "#6B7C8C" }}>Before: 45%</div>
                  <div className="h-6 rounded" style={{ background: "#FF8A45", width: "45%" }} />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: "#6B7C8C" }}>After: 100%</div>
                  <div className="h-6 rounded" style={{ background: "#0D8B5E", width: "100%" }} />
                </div>
              </div>
              <div className="text-sm font-bold mt-3" style={{ color: "#0D8B5E" }}>Zero findings at FDA audit</div>
            </div>

            {/* Timeline */}
            <div className="rounded-lg p-5 text-sm" style={{ background: "#F9FBFC", borderLeft: "4px solid #1A3A6B" }}>
              <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#1A3A6B" }}>Timeline Projet</h4>
              {[
                ["Jan 15", "Engagement starts"],
                ["Jan 22", "Assessment complete"],
                ["Feb 5", "Strategy & roadmap delivered"],
                ["Mar 5", "First QA hire (onboarded)"],
                ["Apr 9", "New batch record system live"],
                ["May 14", "Scaled to 200 units/day"],
                ["Jun 1", "FDA audit (0 findings) ✅"],
              ].map(([date, event]) => (
                <div key={date} className="flex gap-4 py-1" style={{ color: "#4A5568" }}>
                  <span className="font-mono text-xs w-16 shrink-0" style={{ color: "#6B7C8C" }}>{date}</span>
                  <span>{event}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="rounded-lg p-8" style={{ background: "#F0FFF4", borderLeft: "4px solid #0D8B5E" }}>
              <div className="text-4xl mb-4" style={{ color: "#0D8B5E" }}>"</div>
              <p className="text-[15px] italic mb-4" style={{ color: "#1A3A6B" }}>
                Aether understood our pharma reality. They didn't just solve the problem—they solved it the way a pharma operations person would. 18 months later, we doubled production. FDA audit: Zero findings.
              </p>
              <div className="text-sm font-semibold" style={{ color: "#2C3E50" }}>
                — CEO/COO, Farmasoft UA
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#FFB81C" }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
