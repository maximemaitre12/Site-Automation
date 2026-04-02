import { ArrowRight, Star } from "lucide-react";

const results = [
  { category: "RH Recrutement", before: "12 semaines", after: "2 sem", gain: "10 semaines/poste" },
  { category: "RH Coûts", before: "80 heures/mois", after: "4h", gain: "912 heures/an · €36,480/an" },
  { category: "Supply Chain Accuracy", before: "8.5% erreurs", after: "0.2%", gain: "8.3pp moins d'erreurs" },
  { category: "Supply Chain Speed", before: "4h/jour traitement", after: "12 min/jour", gain: "€184,000/an" },
  { category: "Onboarding", before: "60h / 40 tâches", after: "8h · 80% auto", gain: "€31,200/an (15 hires)" },
];

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3" style={{ color: "#0033CC" }}>
            Cas d'étude : Farmasoft UA
          </h2>
          <p className="text-lg" style={{ color: "#4A4A4A" }}>
            RH & Supply Chain automatisées. €340k économisées en année 1.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Context & Results */}
          <div className="space-y-8">
            {/* Context */}
            <div className="rounded-lg p-5" style={{ background: "#F9FBFF", borderLeft: "4px solid #0033CC" }}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#0033CC" }}>Farmasoft UA</h3>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: "#2C3E50" }}>
                <span>Secteur: Pharma Manufacturing</span>
                <span>Employés: 180</span>
                <span>Spécialité: Génériques, APIs</span>
              </div>
            </div>

            {/* Automations */}
            <div>
              <h3 className="font-heading text-base font-bold mb-3" style={{ color: "#0033CC" }}>Automations lancées</h3>
              <div className="space-y-3">
                {[
                  { n: "1", title: "Screening Automatisé RH", items: ["IA analyse CVs FR/EN", "Matching critères pharma", "Scoring & ranking auto"] },
                  { n: "2", title: "Supply Chain - PO Processing", items: ["Extraction bons de commande", "Validation specs pharma", "Push ERP auto (SAP)"] },
                  { n: "3", title: "Onboarding Automation", items: ["Checklist intelligente par rôle", "Auto-notifications", "Traçabilité 21 CFR Part 11"] },
                ].map((a) => (
                  <div key={a.n} className="rounded-lg p-4 text-sm" style={{ background: "#F3F4F6" }}>
                    <span className="font-bold" style={{ color: "#0033CC" }}>{a.n}. {a.title}</span>
                    <ul className="mt-1 space-y-0.5">
                      {a.items.map((i) => (
                        <li key={i} style={{ color: "#4A4A4A" }}>├─ {i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Results table */}
            <div className="rounded-lg p-6 text-white" style={{ background: "#0033CC" }}>
              <h3 className="font-heading text-lg font-bold mb-4">Résultats mesurés</h3>
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
                <div className="text-3xl font-bold">€251,680</div>
                <div className="text-sm opacity-80">Total économies Année 1</div>
                <div className="mt-2 text-xs opacity-70">Coût solution: €42k · ROI: 500% · Payback: 2 mois</div>
              </div>
            </div>
          </div>

          {/* Right - Visuals & Testimonial */}
          <div className="space-y-8">
            {/* Dashboard mockups */}
            {[
              { title: "RH Screening", items: [["Candidat Score", "89/100"], ["Job Match", "92%"], ["Recommendation", "Interview"], ["Processing", "2.3 min"]], color: "#0033CC" },
              { title: "Supply Chain PO", items: [["PO Auto-populated", "✅"], ["Supplier Match", "Auto"], ["ERP Sync", "✅"], ["Processing", "4.2 sec"]], color: "#17A2B8" },
            ].map((d) => (
              <div key={d.title} className="rounded-xl border p-5" style={{ borderColor: "#E8EFF8" }}>
                <h4 className="font-heading text-sm font-bold mb-3" style={{ color: d.color }}>{d.title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {d.items.map(([label, value]) => (
                    <div key={label} className="rounded-lg p-3" style={{ background: "#F9FBFF" }}>
                      <div className="text-xs" style={{ color: "#6B7C8C" }}>{label}</div>
                      <div className="text-base font-bold" style={{ color: d.color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Testimonial */}
            <div className="rounded-lg p-8" style={{ background: "#F0F4FF", borderLeft: "4px solid #17A2B8" }}>
              <div className="text-4xl mb-4" style={{ color: "#17A2B8" }}>"</div>
              <p className="text-base italic mb-4" style={{ color: "#0033CC" }}>
                Aether a transformé nos opérations. Nous avons 40h de temps libéré chaque semaine. Plus important: 0 erreurs supply chain maintenant. C'est un game-changer.
              </p>
              <div className="text-sm font-semibold" style={{ color: "#2C3E50" }}>
                — Chief Operations Officer, Farmasoft UA
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#FFB81C" }} />)}
                <span className="text-xs ml-2" style={{ color: "#2CAA56" }}>"Meilleure décision qu'on ait prise en 3 ans"</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-lg p-5 text-sm" style={{ background: "#F9FBFF", borderLeft: "4px solid #0033CC" }}>
              <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#0033CC" }}>Timeline Projet</h4>
              {[
                ["Jan 5", "Kick-off"],
                ["Jan 12", "Audit complet livré"],
                ["Jan 26", "Design & specs finalisés"],
                ["Feb 9", "Dev complete, testing"],
                ["Feb 23", "GO LIVE Phase 1 (RH)"],
                ["Mar 9", "GO LIVE Phase 2 (Supply)"],
                ["Mar 23", "GO LIVE Phase 3 (Onboarding)"],
                ["Apr 1", "Full optimization ✅"],
              ].map(([date, event]) => (
                <div key={date} className="flex gap-4 py-1" style={{ color: "#4A4A4A" }}>
                  <span className="font-mono text-xs w-16 shrink-0" style={{ color: "#6B7C8C" }}>{date}</span>
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
