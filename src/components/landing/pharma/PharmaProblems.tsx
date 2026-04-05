import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  { name: "TALENT ACQUISITION", tag: "RH Pharma" },
  { name: "GMP & TRAÇABILITÉ", tag: "Production" },
  { name: "REGULATORY STRATEGY", tag: "Expansion" },
  { name: "QUALITY SYSTEMS", tag: "QMS" },
  { name: "COMPLIANCE SCALING", tag: "Croissance" },
];

export function PharmaProblems() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Défis pharma
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Les défis que seul
              <br />
              un expert pharma
              <br />
              comprend.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
              <p>
                Le <strong style={{ color: "#0F172A" }}>recrutement en regulatory affairs</strong> et{" "}
                <strong style={{ color: "#0F172A" }}>quality assurance</strong> est un défi unique.
                Le talent pool est extrêmement limité, le time-to-hire moyen est de{" "}
                <strong style={{ color: "#0F172A" }}>24 à 32 semaines</strong>, et chaque erreur
                peut mener à des <strong style={{ color: "#0F172A" }}>FDA warning letters</strong>.
              </p>
              <p>
                La <strong style={{ color: "#0F172A" }}>traçabilité GMP</strong> implique{" "}
                <strong style={{ color: "#0F172A" }}>200 à 400 pages par batch record</strong>.
                Les validations systèmes prennent 6 à 12 mois. Une validation manquée signifie un{" "}
                <strong style={{ color: "#0F172A" }}>arrêt de production FDA</strong>.
              </p>
              <p>
                Chaque <strong style={{ color: "#0F172A" }}>expansion</strong> ajoute 18+ mois
                de complexité réglementaire avec des coûts de{" "}
                <strong style={{ color: "#0F172A" }}>€500k à €2M par marché</strong>.
              </p>
            </div>

            <div className="mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Demander un diagnostic
              </Link>
            </div>
          </div>

          <div>
            {/* Image with overlay */}
            <div className="relative mb-14 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Contrôle qualité pharmaceutique"
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
