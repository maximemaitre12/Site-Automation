const areas = [
  { title: "PHARMACOVIGILANCE & SIGNAL DETECTION", desc: "Détection automatisée des signaux de sécurité dans les bases ICSR. Classification MedDRA, scoring disproportionnalité (PRR, ROR, EBGM) et génération de rapports PSUR/PBRER conformes ICH E2E." },
  { title: "OPTIMISATION ESSAIS CLINIQUES", desc: "Matching patients-protocoles par NLP sur critères d'inclusion/exclusion. Prédiction d'attrition, optimisation de cohortes et monitoring adaptatif des endpoints primaires et secondaires." },
  { title: "COMPUTER VISION GMP", desc: "Inspection automatisée des lignes de conditionnement : détection de particules, vérification d'intégrité des sertissages, lecture OCR des numéros de lot. Conformité Annexe 11 et 21 CFR Part 211." },
  { title: "RÉDACTION RÉGLEMENTAIRE IA", desc: "Génération assistée des modules eCTD (Module 2.5, 2.7, 3.2.S/P). Cross-référencement automatique des guidances ICH Q8-Q12, FDA et EMA. Pré-validation des soumissions avant gateway." },
  { title: "DRUG DISCOVERY & REPURPOSING", desc: "Modèles de docking moléculaire, prédiction ADMET, screening virtuel par graph neural networks. Identification de nouvelles indications thérapeutiques par analyse de réseaux biologiques." },
  { title: "DATA INTEGRITY & AUDIT TRAIL", desc: "Architecture ALCOA+ native. Audit trails immutables, electronic signatures conformes 21 CFR Part 11, contrôle d'accès RBAC et encryption AES-256 at rest/in transit." },
];

export function PharmaExpertise() {
  return (
    <section id="expertise" className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Capacités IA spécialisées Pharma
          </span>
        </div>

        <h2
          className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-20"
          style={{ color: "#0F172A" }}
        >
          IA de grade
          <br />
          pharmaceutique.
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
