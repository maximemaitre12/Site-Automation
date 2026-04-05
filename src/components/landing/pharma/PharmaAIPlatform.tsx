const capabilities = [
  {
    title: "MOTEUR NLP RÉGLEMENTAIRE",
    desc: "Entraîné sur plus de 12 000 documents ICH, FDA Guidance, EMA Guidelines et Pharmacopées. Compréhension contextuelle des terminologies CTD, MedDRA, WHO-DD et ATC. Extraction d'entités nommées pharmaceutiques avec une précision de 99.2%.",
  },
  {
    title: "MODULE PHARMACOVIGILANCE",
    desc: "Ingestion automatique des ICSRs depuis E2B(R3), détection de signaux par algorithmes de disproportionnalité multi-dimensionnels (PRR, ROR, MGPS/EBGM), génération automatisée des PSURs/PBRERs et Line Listings conformes.",
  },
  {
    title: "PIPELINE DRUG DISCOVERY",
    desc: "Screening virtuel par graph neural networks sur bibliothèques moléculaires. Prédiction ADMET, analyse de druggability, identification de cibles par réseaux d'interactions protéine-protéine. Intégration directe avec vos plateformes HTS.",
  },
  {
    title: "COMPUTER VISION QUALITÉ",
    desc: "Modèles de détection d'anomalies entraînés sur données GMP réelles : particules en solution injectable, défauts de sertissage, intégrité des blisters. Seuils de détection inférieurs aux spécifications pharmacopéiques.",
  },
  {
    title: "COMPILATEUR eCTD INTELLIGENT",
    desc: "Assemblage automatique des modules eCTD avec cross-référencement dynamique. Pré-validation des soumissions contre les business rules FDA ESG et EMA eSubmission Gateway. Détection proactive des incohérences inter-modules.",
  },
  {
    title: "MOTEUR DE CONFORMITÉ TEMPS RÉEL",
    desc: "Monitoring continu des déviations GMP, CAPAs ouvertes et change controls. Scoring de risque qualité automatisé basé sur ICH Q9. Alertes prédictives avant escalade réglementaire.",
  },
];

export function PharmaAIPlatform() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#0C2D48" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#22D3EE" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#22D3EE" }}>
            Notre plateforme propriétaire
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-8 text-white"
            >
              Aether Pharma AI.
              <br />
              <span style={{ color: "#22D3EE" }}>Conçu pour la science.</span>
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Notre plateforme d'intelligence artificielle est le résultat de{" "}
              <strong className="text-white font-medium">recherches approfondies en NLP biomédical</strong>,
              en <strong className="text-white font-medium">modélisation moléculaire computationnelle</strong> et
              en <strong className="text-white font-medium">ingénierie réglementaire</strong>.
            </p>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Chaque module est <strong className="text-white font-medium">spécifiquement fine-tuné sur des corpus pharmaceutiques</strong> —
              pas un LLM généraliste adapté a posteriori.{" "}
              <strong className="text-white font-medium">Aether Pharma AI</strong> comprend nativement les
              terminologies <strong className="text-white font-medium">MedDRA</strong>,{" "}
              <strong className="text-white font-medium">WHO-DD</strong>,{" "}
              <strong className="text-white font-medium">SNOMED CT</strong> et les structures{" "}
              <strong className="text-white font-medium">eCTD/CTD</strong>.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {[
                { label: "Corpus réglementaire indexé", value: "12 000+" },
                { label: "Précision classification MedDRA", value: "99.2%" },
                { label: "Langues supportées (NLP médical)", value: "14" },
                { label: "Temps moyen de compilation eCTD", value: "< 4h" },
                { label: "Conformité frameworks intégrés", value: "ICH · FDA · EMA · ANSM" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  <span className="font-heading text-[15px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className="p-8 transition-colors hover:bg-white/[0.03]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div className="w-6 h-[2px] mb-6" style={{ background: "#22D3EE" }} />
              <h3
                className="font-heading text-[12px] font-bold tracking-[0.15em] mb-4 text-white"
              >
                {c.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
