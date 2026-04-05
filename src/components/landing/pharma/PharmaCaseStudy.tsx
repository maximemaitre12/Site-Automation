import { Star } from "lucide-react";
import pharmaLab from "@/assets/pharma-lab.jpg";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-28 md:py-36" style={{ background: "#0369A1" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px] bg-white/30" />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40">
            Cas d'étude
          </span>
        </div>

        {/* Image banner */}
        <div className="relative mb-20 overflow-hidden">
          <img
            src={pharmaLab}
            alt="Laboratoire Farmasoft"
            className="w-full h-[220px] md:h-[300px] object-cover opacity-30"
            loading="lazy"
            width={1280}
            height={960}
          />
          <div className="absolute inset-0 flex items-center">
            <h2 className="font-heading text-[40px] md:text-[56px] lg:text-[68px] font-bold leading-[1.05] text-white px-8 md:px-12">
              Farmasoft UA.
            </h2>
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-1 bg-white/40" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.6)" }}>
              <p>
                <strong className="text-white font-medium">Farmasoft UA</strong>, fabricant pharmaceutique
                de <strong className="text-white font-medium">180 employés</strong> spécialisé en génériques et APIs,
                connaissait une croissance de <strong className="text-white font-medium">40% par an</strong>.
                L'infrastructure opérationnelle était devenue le <strong className="text-white font-medium">bottleneck critique</strong>.
              </p>
              <p>
                En <strong className="text-white font-medium">16 semaines</strong>, nous avons transformé
                leur recruitment pipeline, implémenté la traçabilité GMP complète et préparé
                l'organisation pour un <strong className="text-white font-medium">audit FDA</strong>.
              </p>
            </div>

            {/* Big result with accent */}
            <div className="mt-14 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="font-heading text-[52px] md:text-[68px] font-bold leading-none mb-3 text-white">€1.5M+</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Valeur totale créée · ROI: 1,760% · Payback: 0.7 mois</p>
            </div>
          </div>

          <div>
            {/* Metrics with lines */}
            <div className="space-y-0 mb-14">
              {[
                { val: "71%", label: "Réduction du time-to-hire — de 28 à 8 semaines" },
                { val: "+100%", label: "Capacité de production — de 100 à 200 unités/jour" },
                { val: "0", label: "Findings à l'audit FDA — batch traceability 100%" },
              ].map((m) => (
                <div key={m.val} className="py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="font-heading text-[36px] md:text-[44px] font-bold mb-2 text-white">{m.val}</div>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial with accent */}
            <div className="relative pl-6" style={{ borderLeft: "2px solid rgba(255,255,255,0.2)" }}>
              <p className="text-base md:text-lg italic leading-relaxed mb-5 text-white/80">
                "Aether understood our pharma reality. They didn't just solve the problem —
                they solved it the way a pharma operations person would."
              </p>
              <p className="text-sm font-semibold text-white/90">CEO/COO, Farmasoft UA</p>
              <div className="flex items-center gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "#FBBF24" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
