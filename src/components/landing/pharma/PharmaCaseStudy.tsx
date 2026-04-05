import { Star } from "lucide-react";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: "#94A3B8" }}>
              Cas d'étude
            </p>
            <h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-10"
              style={{ color: "#0F172A" }}
            >
              Farmasoft UA.
            </h2>

            <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: "#475569" }}>
              <p>
                <strong style={{ color: "#0F172A" }}>Farmasoft UA</strong>, fabricant pharmaceutique
                de <strong style={{ color: "#0F172A" }}>180 employés</strong> spécialisé en génériques et APIs,
                connaissait une croissance de <strong style={{ color: "#0F172A" }}>40% par an</strong> avec
                des plans pour doubler la production. L'infrastructure opérationnelle était devenue
                le <strong style={{ color: "#0F172A" }}>bottleneck critique</strong>.
              </p>
              <p>
                En <strong style={{ color: "#0F172A" }}>16 semaines</strong>, nous avons transformé
                leur recruitment pipeline, implémenté la traçabilité GMP complète et préparé
                l'ensemble de l'organisation pour un <strong style={{ color: "#0F172A" }}>audit FDA</strong>.
              </p>
            </div>

            {/* Big result */}
            <div className="mt-14">
              <div className="font-heading text-6xl md:text-7xl font-bold leading-none mb-3" style={{ color: "#0891B2" }}>
                €1.5M+
              </div>
              <p className="text-sm" style={{ color: "#64748B" }}>
                Valeur totale créée · ROI: 1,760% · Payback: 0.7 mois
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            {/* Key metrics */}
            <div className="space-y-10 mb-14">
              <div>
                <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: "#0891B2" }}>
                  71%
                </div>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Réduction du time-to-hire — de 28 à 8 semaines
                </p>
              </div>
              <div>
                <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: "#0891B2" }}>
                  +100%
                </div>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Capacité de production — de 100 à 200 unités/jour
                </p>
              </div>
              <div>
                <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: "#0891B2" }}>
                  0
                </div>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Findings à l'audit FDA — batch traceability 100%
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <p className="text-lg md:text-xl italic leading-relaxed mb-6" style={{ color: "#0F172A" }}>
                "Aether understood our pharma reality. They didn't just solve the problem —
                they solved it the way a pharma operations person would."
              </p>
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>CEO/COO, Farmasoft UA</p>
              <div className="flex items-center gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#FBBF24" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
