const phases = [
  {
    num: "01",
    label: "Diagnostic & Assessment",
    duration: "Semaines 1-2",
    desc: "Audit exhaustif de votre réalité pharma. Interviews Ops, Quality, Regulatory. Gap analysis vs. FDA/EMA/GMP.",
    deliverables: "Diagnostic report · Gap analysis · Compliance scorecard · Prioritized roadmap",
    color: "#0891B2",
  },
  {
    num: "02",
    label: "Strategy & Design",
    duration: "Semaines 3-5",
    desc: "Solution architecture pharma-optimized. Process redesign, regulatory compliance, technology blueprint.",
    deliverables: "Implementation roadmap · SOPs · Regulatory strategy · Risk mitigation plan",
    color: "#0EA5E9",
  },
  {
    num: "03",
    label: "Implementation & Rollout",
    duration: "Semaines 6-12",
    desc: "Exécution de la stratégie. Training, system implementation, validation GxP, documentation audit-ready.",
    deliverables: "Processes implementés · Team certifiée · Documentation · Validation records",
    color: "#38BDF8",
  },
  {
    num: "04",
    label: "Sustainment & Optimization",
    duration: "Mois 2-12",
    desc: "Assurer que vos changements persistent. Weekly check-ins, issue resolution, continuous improvement.",
    deliverables: "Performance reports · Improvement recommendations · Full knowledge transfer",
    color: "#7DD3FC",
  },
];

export function PharmaMethodology() {
  return (
    <section className="py-24" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Comment nous{" "}
            <span style={{ color: "#0891B2" }}>travaillons</span>
          </h2>
          <p className="text-lg" style={{ color: "#64748B" }}>
            Processus éprouvé, sans disruption opérationnelle.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, i) => (
            <div
              key={phase.num}
              className="rounded-2xl p-8 bg-white transition-all hover:shadow-lg"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ background: phase.color }}
                >
                  {phase.num}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <h3 className="font-heading text-lg font-bold" style={{ color: "#0F172A" }}>{phase.label}</h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full self-start" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: "#64748B" }}>{phase.desc}</p>
                  <p className="text-sm" style={{ color: "#475569" }}>
                    <span className="font-semibold" style={{ color: "#0891B2" }}>Livrables:</span> {phase.deliverables}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
