const stats = [
  { value: "18+", label: "Années", sub: "d'expérience opérationnelle pharma" },
  { value: "100%", label: "Réussite audits FDA", sub: "sur les 12 dernières implémentations" },
  { value: "95%", label: "Clients fidèles", sub: "reviennent pour des phases supplémentaires" },
  { value: "0", label: "Violations réglementaires", sub: "en 18 ans d'opérations" },
];

export function PharmaStats() {
  return (
    <section id="stats" className="py-24" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-5xl md:text-6xl font-bold mb-2" style={{ color: "#0891B2" }}>
                {s.value}
              </div>
              <div className="text-base font-semibold mb-1" style={{ color: "#1E293B" }}>
                {s.label}
              </div>
              <div className="text-sm" style={{ color: "#64748B" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
