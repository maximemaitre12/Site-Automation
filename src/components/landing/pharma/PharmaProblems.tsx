import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  { name: "PHARMACOVIGILANCE AUTOMATISÉE", tag: "Signal Detection" },
  { name: "OPTIMISATION ESSAIS CLINIQUES", tag: "Phase I–IV" },
  { name: "SOUMISSION RÉGLEMENTAIRE eCTD", tag: "FDA · EMA" },
  { name: "CONTRÔLE QUALITÉ PAR VISION", tag: "GMP Compliance" },
  { name: "DRUG REPURPOSING & TARGET ID", tag: "R&D Pipeline" },
];

export function PharmaProblems() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Défis réglementaires & opérationnels
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Vos dossiers CTD
              <br />
              prennent 18 mois.
              <br />
              On fait 4.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
              <p>
                La <strong style={{ color: "#0F172A" }}>rédaction réglementaire</strong> mobilise vos meilleurs
                profils pendant des mois. Les <strong style={{ color: "#0F172A" }}>revues de pharmacovigilance</strong> sont
                encore manuelles. Vos <strong style={{ color: "#0F172A" }}>données de batch records</strong> dorment
                dans des systèmes cloisonnés.
              </p>
              <p>
                Nos <strong style={{ color: "#0F172A" }}>agents NLP spécialisés pharma</strong> extraient, classifient
                et structurent vos <strong style={{ color: "#0F172A" }}>ICSRs</strong>, génèrent des{" "}
                <strong style={{ color: "#0F172A" }}>PSURs/PBRERs</strong> et compilent vos{" "}
                <strong style={{ color: "#0F172A" }}>modules eCTD</strong> automatiquement.
              </p>
              <p>
                Du <strong style={{ color: "#0F172A" }}>signal detection</strong> à la{" "}
                <strong style={{ color: "#0F172A" }}>benefit-risk assessment</strong>, notre IA opère
                dans un cadre <strong style={{ color: "#0F172A" }}>ICH E2B(R3)</strong> natif.
              </p>
            </div>

            <div className="mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Audit réglementaire gratuit
              </Link>
            </div>
          </div>

          <div>
            <div className="relative mb-14 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Contrôle qualité pharmaceutique automatisé"
                className="w-full h-[300px] lg:h-[360px] object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#0369A1" }} />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#94a3b8" }}>
              Domaines d'intervention
            </p>
            <div className="space-y-0">
              {domains.map((d) => (
                <a
                  key={d.name}
                  href="#expertise"
                  className="flex items-center justify-between py-4 transition-opacity hover:opacity-60 group"
                  style={{ borderBottom: "1px solid #e8ecf1" }}
                >
                  <span className="text-[15px] md:text-base font-heading font-bold tracking-[0.04em]" style={{ color: "#0F172A" }}>
                    {d.name}
                  </span>
                  <span className="text-[11px] tracking-wider uppercase" style={{ color: "#94a3b8" }}>
                    {d.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
