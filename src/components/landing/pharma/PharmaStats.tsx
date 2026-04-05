const stats = [
  { value: "18+", label: "années d'expérience" },
  { value: "100%", label: "réussite audits FDA" },
  { value: "95%", label: "clients fidèles" },
  { value: "0", label: "violations réglementaires" },
];

export function PharmaStats() {
  return (
    <section className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <p className="text-base md:text-lg leading-relaxed max-w-[700px] mb-20" style={{ color: "#475569" }}>
          Depuis <strong style={{ color: "#0F172A" }}>plus de 18 ans</strong>, nous accompagnons
          les entreprises pharmaceutiques dans leur <strong style={{ color: "#0F172A" }}>transformation opérationnelle</strong>.
          Notre expertise couvre la <strong style={{ color: "#0F172A" }}>conformité réglementaire</strong>,
          le <strong style={{ color: "#0F172A" }}>recrutement spécialisé</strong> et
          l'<strong style={{ color: "#0F172A" }}>optimisation des processus GMP</strong>.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-4"
                style={{ color: "#0891B2" }}
              >
                {s.value}
              </div>
              <div className="text-sm" style={{ color: "#64748B" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
