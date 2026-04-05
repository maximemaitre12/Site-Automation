const phases = [
  {
    num: "01",
    label: "Diagnostic & Assessment",
    duration: "Semaines 1–2",
    desc: "Audit exhaustif de votre réalité pharma. Interviews Ops, Quality, Regulatory. Gap analysis vs. FDA/EMA/GMP.",
    deliverables: "Diagnostic report · Gap analysis · Compliance scorecard · Prioritized roadmap",
  },
  {
    num: "02",
    label: "Strategy & Design",
    duration: "Semaines 3–5",
    desc: "Solution architecture pharma-optimized. Process redesign, regulatory compliance, technology blueprint.",
    deliverables: "Implementation roadmap · SOPs · Regulatory strategy · Risk mitigation plan",
  },
  {
    num: "03",
    label: "Implementation & Rollout",
    duration: "Semaines 6–12",
    desc: "Exécution de la stratégie. Training, system implementation, validation GxP, documentation audit-ready.",
    deliverables: "Processes implementés · Team certifiée · Documentation · Validation records",
  },
  {
    num: "04",
    label: "Sustainment & Optimization",
    duration: "Mois 2–12",
    desc: "Assurer que vos changements persistent. Weekly check-ins, issue resolution, continuous improvement.",
    deliverables: "Performance reports · Improvement recommendations · Full knowledge transfer",
  },
];

export function PharmaMethodology() {
  return (
    <section className="py-28" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Méthodologie
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight" style={{ color: "#0F172A" }}>
            Comment nous travaillons.
          </h2>
          <p className="text-base mt-4 max-w-xl" style={{ color: "#64748B" }}>
            Processus éprouvé, sans disruption opérationnelle.
          </p>
        </div>

        <div className="space-y-0 divide-y" style={{ borderColor: "#E2E8F0" }}>
          {phases.map((phase) => (
            <div key={phase.num} className="grid md:grid-cols-[80px_200px_1fr] gap-6 py-10 first:pt-0">
              <span className="font-heading text-3xl font-bold" style={{ color: "#E2E8F0" }}>
                {phase.num}
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold" style={{ color: "#0F172A" }}>{phase.label}</h3>
                <span className="text-xs font-medium mt-1 inline-block" style={{ color: "#0891B2" }}>
                  {phase.duration}
                </span>
              </div>
              <div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#64748B" }}>{phase.desc}</p>
                <p className="text-sm" style={{ color: "#475569" }}>
                  <span className="font-semibold" style={{ color: "#0891B2" }}>Livrables :</span> {phase.deliverables}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
