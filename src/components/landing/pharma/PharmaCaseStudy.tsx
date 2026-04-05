import { ArrowRight, Star } from "lucide-react";

const results = [
  { label: "Talent Acquisition", before: "28 semaines", after: "8 semaines", gain: "71% plus rapide" },
  { label: "Production Capacity", before: "100 units/jour", after: "200 units/jour", gain: "+100%" },
  { label: "GMP Audit Findings", before: "3 critical", after: "0 findings", gain: "FDA-ready" },
  { label: "Batch Traceability", before: "92%", after: "100%", gain: "Full compliance" },
  { label: "Change Control", before: "40 jours", after: "5 jours", gain: "-87.5%" },
];

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-28 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Cas d'étude
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Farmasoft UA.
          </h2>
          <p className="text-base mt-4 max-w-xl" style={{ color: "#64748B" }}>
            Transformation des opérations pharma. Recruitment scaling + GMP traceability en 16 semaines.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Context + Results */}
          <div>
            {/* Context */}
            <div className="mb-10 pb-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h3 className="font-heading text-lg font-bold mb-1" style={{ color: "#0F172A" }}>Farmasoft UA</h3>
              <p className="text-sm mb-4" style={{ color: "#64748B" }}>
                Pharma Manufacturing · 180 employés · Génériques & APIs
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                En croissance 40% YoY, plans pour doubler la production. Infrastructure ops = bottleneck critique.
              </p>
            </div>

            {/* Results table */}
            <div>
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#0891B2" }}>
                Résultats mesurés
              </h4>
              <div className="space-y-0 divide-y" style={{ borderColor: "#F1F5F9" }}>
                {results.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{r.label}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="line-through" style={{ color: "#94A3B8" }}>{r.before}</span>
                      <ArrowRight className="w-3 h-3" style={{ color: "#94A3B8" }} />
                      <span className="font-bold" style={{ color: "#0891B2" }}>{r.after}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-10" style={{ borderTop: "1px solid #E2E8F0" }}>
                <div className="font-heading text-5xl font-bold" style={{ color: "#0891B2" }}>€1.5M+</div>
                <p className="text-sm mt-2" style={{ color: "#64748B" }}>
                  Valeur totale créée · ROI: 1,760% · Payback: 0.7 mois
                </p>
              </div>
            </div>
          </div>

          {/* Right: Bars + Testimonial */}
          <div>
            {/* Recruitment bar */}
            <div className="mb-10 pb-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#94A3B8" }}>
                Recruitment Timeline
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Avant</span><span>28 semaines</span>
                  </div>
                  <div className="h-3 w-full" style={{ background: "#E2E8F0" }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Après</span><span>8 semaines</span>
                  </div>
                  <div className="h-3" style={{ background: "#0891B2", width: "28%" }} />
                </div>
              </div>
              <p className="text-sm font-semibold mt-4" style={{ color: "#0891B2" }}>71% de réduction</p>
            </div>

            {/* FDA bar */}
            <div className="mb-10 pb-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#94A3B8" }}>
                FDA Audit Readiness
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Avant</span><span>45%</span>
                  </div>
                  <div className="h-3" style={{ background: "#E2E8F0", width: "45%" }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Après</span><span>100%</span>
                  </div>
                  <div className="h-3 w-full" style={{ background: "#0891B2" }} />
                </div>
              </div>
              <p className="text-sm font-semibold mt-4" style={{ color: "#0891B2" }}>Zero findings à l'audit FDA</p>
            </div>

            {/* Testimonial */}
            <div>
              <p className="text-base italic leading-relaxed mb-6" style={{ color: "#475569" }}>
                "Aether understood our pharma reality. They didn't just solve the problem — they solved it the way a pharma operations person would. 18 months later, we doubled production. FDA audit: Zero findings."
              </p>
              <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>CEO/COO, Farmasoft UA</div>
              <div className="flex items-center gap-0.5 mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "#FBBF24" }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
