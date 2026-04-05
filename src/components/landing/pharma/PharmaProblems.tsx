import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  "TALENT ACQUISITION",
  "GMP & TRAÇABILITÉ",
  "REGULATORY STRATEGY",
  "QUALITY SYSTEMS",
  "COMPLIANCE SCALING",
];

export function PharmaProblems() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          <div>
            <h2
              className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Les défis que seul
              <br />
              un expert pharma
              <br />
              comprend.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.8]" style={{ color: "#4a5568" }}>
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
          </div>

          <div className="flex flex-col justify-center">
            {/* Image */}
            <div className="mb-12 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Contrôle qualité pharmaceutique"
                className="w-full h-[280px] lg:h-[320px] object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#94a3b8" }}>
              Domaines d'intervention
            </p>
            <div className="space-y-5">
              {domains.map((d) => (
                <a
                  key={d}
                  href="#expertise"
                  className="block text-lg md:text-xl font-heading font-bold tracking-[0.05em] transition-opacity hover:opacity-50"
                  style={{ color: "#0F172A" }}
                >
                  {d}
                </a>
              ))}
            </div>
            <div className="mt-14">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-13 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Demander un diagnostic
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
