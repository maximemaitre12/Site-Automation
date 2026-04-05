const areas = [
  { title: "AGENTS IA & AUTOMATISATION", desc: "Des agents autonomes qui exécutent vos workflows complexes 24/7 — sans intervention humaine." },
  { title: "ANALYSE PRÉDICTIVE", desc: "Anticiper la demande, les pannes, les risques. Vos données deviennent votre avantage concurrentiel." },
  { title: "VISION PAR ORDINATEUR", desc: "Contrôle qualité, inspection, tri automatisé. L'IA voit ce que l'œil humain manque." },
  { title: "NLP & DOCUMENTS", desc: "Extraction, classification, génération. Vos documents traités en secondes, pas en heures." },
  { title: "INTÉGRATION & SCALING", desc: "Vos systèmes actuels (SAP, ERP, CRM) + notre IA = performance décuplée, zéro disruption." },
  { title: "CONFORMITÉ & TRAÇABILITÉ", desc: "Automatisez la compliance réglementaire. Chaque action tracée, chaque anomalie détectée." },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Capacités IA
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          Ce que notre IA
          <br />
          fait pour vous.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {areas.map((a, i) => (
            <div
              key={a.title}
              className="group cursor-default p-8 transition-colors hover:bg-[#f5f9fb]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid #e8ecf1" : "none",
                borderBottom: i < 3 ? "1px solid #e8ecf1" : "none",
              }}
            >
              <div className="w-6 h-[2px] mb-6" style={{ background: "#0369A1" }} />
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.15em] mb-4"
                style={{ color: "#0F172A" }}
              >
                {a.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: "#5a6577" }}>
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
