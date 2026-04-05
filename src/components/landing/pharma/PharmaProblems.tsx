import { Link } from "react-router-dom";
import pharmaQuality from "@/assets/pharma-quality.jpg";

const domains = [
  { name: "AGENTS IA AUTONOMES", tag: "Automatisation" },
  { name: "ANALYSE PRÉDICTIVE", tag: "Data" },
  { name: "VISION PAR ORDINATEUR", tag: "Qualité" },
  { name: "NLP & TRAITEMENT DOCUMENTAIRE", tag: "Process" },
  { name: "INTÉGRATION SYSTÈMES", tag: "Infrastructure" },
];

export function PharmaProblems() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Ce qu'on résout
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              Vos processus
              <br />
              manuels vous
              <br />
              coûtent cher.
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "#4a5568" }}>
              <p>
                Chaque <strong style={{ color: "#0F172A" }}>tâche répétitive</strong> est une opportunité d'automatisation.
                Chaque <strong style={{ color: "#0F172A" }}>donnée inexploitée</strong> est un manque à gagner.
              </p>
              <p>
                On conçoit des <strong style={{ color: "#0F172A" }}>systèmes IA sur mesure</strong> qui
                s'intègrent dans vos outils existants — <strong style={{ color: "#0F172A" }}>sans disruption</strong>,
                avec des <strong style={{ color: "#0F172A" }}>résultats mesurables en semaines</strong>.
              </p>
              <p>
                Traçabilité, prédiction, contrôle qualité, traitement documentaire — notre IA
                s'adapte à <strong style={{ color: "#0F172A" }}>votre réalité opérationnelle</strong>.
              </p>
            </div>

            <div className="mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 text-[13px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:opacity-90"
                style={{ background: "#0369A1" }}
              >
                Demander un diagnostic IA
              </Link>
            </div>
          </div>

          <div>
            <div className="relative mb-14 overflow-hidden">
              <img
                src={pharmaQuality}
                alt="Intelligence artificielle en action"
                className="w-full h-[300px] lg:h-[360px] object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#0369A1" }} />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#94a3b8" }}>
              Technologies déployées
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
