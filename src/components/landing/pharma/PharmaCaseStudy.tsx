import { Star } from "lucide-react";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-32 md:py-40" style={{ background: "#0369A1" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Cas d'étude</p>
            <h2 className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-10 text-white">Farmasoft UA.</h2>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.8]" style={{ color: "rgba(255,255,255,0.6)" }}>
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
            <div className="mt-14">
              <div className="font-heading text-[56px] md:text-[72px] font-bold leading-none mb-3 text-white">€1.5M+</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Valeur totale créée · ROI: 1,760% · Payback: 0.7 mois</p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-10 mb-14">
              <div>
                <div className="font-heading text-[44px] md:text-[52px] font-bold mb-2 text-white">71%</div>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>Réduction du time-to-hire — de 28 à 8 semaines</p>
              </div>
              <div>
                <div className="font-heading text-[44px] md:text-[52px] font-bold mb-2 text-white">+100%</div>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>Capacité de production — de 100 à 200 unités/jour</p>
              </div>
              <div>
                <div className="font-heading text-[44px] md:text-[52px] font-bold mb-2 text-white">0</div>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>Findings à l'audit FDA — batch traceability 100%</p>
              </div>
            </div>
            <div className="pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="text-lg md:text-xl italic leading-relaxed mb-6 text-white/80">
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
