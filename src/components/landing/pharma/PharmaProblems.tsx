import { Link } from "react-router-dom";

const domains = [
  "TALENT ACQUISITION",
  "GMP & TRAÇABILITÉ",
  "REGULATORY STRATEGY",
  "QUALITY SYSTEMS",
  "COMPLIANCE SCALING",
];

export function PharmaProblems() {
  return (
    <section className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          <div>
            <h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-10"
              style={{ color: "#0F172A" }}
            >
              Les défis que seul
              <br />
              un expert pharma
              <br />
              comprend.
            </h2>

            <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: "#475569" }}>
              <p>
                Le <strong style={{ color: "#0F172A" }}>recrutement en regulatory affairs</strong> et{" "}
                <strong style={{ color: "#0F172A" }}>quality assurance</strong> est un défi unique.
                Le talent pool est extrêmement limité, le time-to-hire moyen est de{" "}
                <strong style={{ color: "#0F172A" }}>24 à 32 semaines</strong>, et chaque erreur
                de recrutement peut mener à des <strong style={{ color: "#0F172A" }}>FDA warning letters</strong>.
              </p>
              <p>
                La <strong style={{ color: "#0F172A" }}>traçabilité GMP</strong> implique{" "}
                <strong style={{ color: "#0F172A" }}>200 à 400 pages par batch record</strong>.
                Les validations systèmes prennent 6 à 12 mois. Le change control est trop lourd.
                Et une validation manquée signifie un <strong style={{ color: "#0F172A" }}>arrêt de production FDA</strong>.
              </p>
              <p>
                Chaque <strong style={{ color: "#0F172A" }}>expansion</strong> ajoute 18+ mois
                de complexité réglementaire avec des coûts de{" "}
                <strong style={{ color: "#0F172A" }}>€500k à €2M par marché</strong>. La compliance
                ne scale pas assez vite.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-10" style={{ color: "#94A3B8" }}>
              Domaines d'intervention
            </p>
            <div className="space-y-6">
              {domains.map((d) => (
                <a
                  key={d}
                  href="#expertise"
                  className="block text-xl md:text-2xl font-heading font-bold tracking-wide transition-colors hover:opacity-60"
                  style={{ color: "#0F172A" }}
                >
                  {d}
                </a>
              ))}
            </div>
            <div className="mt-14">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold tracking-wide uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0891B2" }}
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
