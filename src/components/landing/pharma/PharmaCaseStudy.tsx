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
    <section id="case-study" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Cas d'étude:{" "}
            <span style={{ color: "#0891B2" }}>Farmasoft UA</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Transformation des opérations pharma. Recruitment scaling + GMP traceability en 16 semaines.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Context + Results */}
          <div className="space-y-6">
            {/* Context card */}
            <div className="rounded-2xl p-6" style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "#0891B2" }}>F</div>
                <div>
                  <h3 className="font-heading text-base font-bold" style={{ color: "#0F172A" }}>Farmasoft UA</h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>Pharma Manufacturing · 180 employés · Génériques & APIs</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                En croissance 40% YoY, plans pour doubler la production. Infrastructure ops = bottleneck critique.
              </p>
            </div>

            {/* Results */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              <div className="p-6" style={{ background: "linear-gradient(135deg, #0891B2, #0EA5E9)" }}>
                <h3 className="font-heading text-lg font-bold text-white mb-1">Résultats mesurés</h3>
                <p className="text-sm text-white/70">Impact total Année 1</p>
              </div>
              <div className="p-6 bg-white">
                <div className="space-y-4">
                  {results.map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{r.label}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="line-through" style={{ color: "#94A3B8" }}>{r.before}</span>
                        <ArrowRight className="w-3 h-3" style={{ color: "#94A3B8" }} />
                        <span className="font-bold" style={{ color: "#0891B2" }}>{r.after}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 text-center" style={{ borderTop: "2px solid #E0F2FE" }}>
                  <div className="text-4xl font-bold" style={{ color: "#0891B2" }}>€1.5M+</div>
                  <div className="text-sm mt-1" style={{ color: "#64748B" }}>Valeur totale créée · ROI: 1,760% · Payback: 0.7 mois</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual + Testimonial */}
          <div className="space-y-6">
            {/* Visual bars */}
            <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid #E2E8F0" }}>
              <h4 className="font-heading text-sm font-bold mb-6" style={{ color: "#0F172A" }}>Recruitment Timeline</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Avant</span><span>28 semaines</span>
                  </div>
                  <div className="h-8 rounded-xl w-full" style={{ background: "#FED7AA" }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Après</span><span>8 semaines</span>
                  </div>
                  <div className="h-8 rounded-xl" style={{ background: "#0891B2", width: "28%" }} />
                </div>
              </div>
              <div className="mt-4 text-sm font-bold" style={{ color: "#0891B2" }}>71% de réduction</div>
            </div>

            <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid #E2E8F0" }}>
              <h4 className="font-heading text-sm font-bold mb-6" style={{ color: "#0F172A" }}>FDA Audit Readiness</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Avant</span><span>45%</span>
                  </div>
                  <div className="h-8 rounded-xl" style={{ background: "#FED7AA", width: "45%" }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>Après</span><span>100%</span>
                  </div>
                  <div className="h-8 rounded-xl w-full" style={{ background: "#0891B2" }} />
                </div>
              </div>
              <div className="mt-4 text-sm font-bold" style={{ color: "#0891B2" }}>Zero findings à l'audit FDA</div>
            </div>

            {/* Testimonial */}
            <div
              className="rounded-2xl p-8"
              style={{ background: "linear-gradient(135deg, #F0F9FF, #E0F2FE)" }}
            >
              <div className="text-5xl leading-none mb-4" style={{ color: "#0891B2" }}>"</div>
              <p className="text-base italic leading-relaxed mb-6" style={{ color: "#0F172A" }}>
                Aether understood our pharma reality. They didn't just solve the problem—they solved it the way a pharma operations person would. 18 months later, we doubled production. FDA audit: Zero findings.
              </p>
              <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>CEO/COO, Farmasoft UA</div>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#FBBF24" }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
