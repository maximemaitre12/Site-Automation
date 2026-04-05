const blocks = [
  { title: "GxP-NATIVE PAR DESIGN", desc: "Chaque composant de notre stack est conçu pour des environnements GMP, GLP et GCP. Pas d'adaptation a posteriori — la conformité est architecturale, pas cosmétique." },
  { title: "VALIDATION CSV INTÉGRÉE", desc: "Protocoles IQ/OQ/PQ automatisés, rapports de validation générés à chaque release. Traçabilité complète du code source aux résultats d'inférence, conforme Annexe 11 et 21 CFR Part 11." },
  { title: "MODÈLES ENTRAÎNÉS SUR DONNÉES PHARMA", desc: "Nos modèles NLP sont fine-tunés sur des corpus réglementaires (ICH, FDA Guidance, EMA Scientific Guidelines) et des datasets de pharmacovigilance anonymisés." },
  { title: "DÉPLOIEMENT SANS DISRUPTION", desc: "Intégration native avec vos LIMS, MES, ERP (SAP), EDMS et systèmes de pharmacovigilance (Argus, ArisGlobal). Architecture microservices containerisée, zero-downtime deployment." },
];

export function PharmaTrust() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Garanties réglementaires
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          La conformité n'est pas
          <br />
          une feature. C'est
          <br />
          l'architecture.
        </h2>

        <div className="grid sm:grid-cols-2 gap-0">
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className="p-8 lg:p-10"
              style={{
                borderRight: i % 2 === 0 ? "1px solid rgba(3,105,161,0.12)" : "none",
                borderBottom: i < 2 ? "1px solid rgba(3,105,161,0.12)" : "none",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                <h3 className="font-heading text-[12px] font-bold tracking-[0.15em]" style={{ color: "#0F172A" }}>{b.title}</h3>
              </div>
              <p className="text-[15px] leading-[1.85]" style={{ color: "#3d5060" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
