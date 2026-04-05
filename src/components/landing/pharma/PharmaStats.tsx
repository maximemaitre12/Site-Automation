const stats = [
  { value: "10x", label: "Plus rapide", sub: "que le traitement manuel" },
  { value: "4-6", label: "Semaines", sub: "pour un prototype en production" },
  { value: "85%", label: "Réduction", sub: "du temps de traitement" },
  { value: "0", label: "Disruption", sub: "intégration dans vos outils" },
];

export function PharmaStats() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#EAF3F7" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-start gap-8 mb-24">
          <div className="w-16 h-px mt-3 shrink-0" style={{ background: "#0369A1" }} />
          <p className="text-base md:text-[17px] leading-[1.85] max-w-[620px]" style={{ color: "#4a5568" }}>
            On ne vend pas du conseil. On <strong style={{ color: "#0F172A" }}>construit des systèmes IA</strong> qui
            tournent en production — <strong style={{ color: "#0F172A" }}>agents autonomes</strong>,{" "}
            <strong style={{ color: "#0F172A" }}>analyse prédictive</strong>,{" "}
            <strong style={{ color: "#0F172A" }}>automatisation intelligente</strong>. Du concret, pas des slides.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s) => (
            <div key={s.label} className="relative pl-6">
              <div className="w-8 h-[3px] mb-6" style={{ background: "#0369A1" }} />
              <div
                className="font-heading text-[52px] md:text-[64px] lg:text-[72px] font-bold leading-none mb-2"
                style={{ color: "#0369A1" }}
              >
                {s.value}
              </div>
              <div className="text-sm font-heading font-bold mb-1" style={{ color: "#0F172A" }}>
                {s.label}
              </div>
              <div className="text-[13px]" style={{ color: "#6b7c93" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
