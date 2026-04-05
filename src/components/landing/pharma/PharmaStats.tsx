const stats = [
  { value: "18+", label: "Années", sub: "d'expérience opérationnelle" },
  { value: "100%", label: "Audits FDA", sub: "réussis consécutivement" },
  { value: "95%", label: "Fidélité", sub: "clients qui reviennent" },
  { value: "0", label: "Violations", sub: "réglementaires en 18 ans" },
];

export function PharmaStats() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#EAF3F7" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Intro with accent line */}
        <div className="flex items-start gap-8 mb-24">
          <div className="w-16 h-px mt-3 shrink-0" style={{ background: "#0369A1" }} />
          <p className="text-base md:text-[17px] leading-[1.85] max-w-[620px]" style={{ color: "#4a5568" }}>
            Depuis <strong style={{ color: "#0F172A" }}>plus de 18 ans</strong>, nous accompagnons
            les entreprises pharmaceutiques dans leur <strong style={{ color: "#0F172A" }}>transformation opérationnelle</strong>.
            Notre expertise couvre la <strong style={{ color: "#0F172A" }}>conformité réglementaire</strong>,
            le <strong style={{ color: "#0F172A" }}>recrutement spécialisé</strong> et
            l'<strong style={{ color: "#0F172A" }}>optimisation des processus GMP</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s, i) => (
            <div key={s.label} className="relative pl-6" style={{ borderLeft: i > 0 ? "none" : "none" }}>
              {/* Top accent bar */}
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
