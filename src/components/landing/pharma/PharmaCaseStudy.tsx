import { Star } from "lucide-react";
import pharmaLab from "@/assets/pharma-lab.jpg";

export function PharmaCaseStudy() {
  return (
    <section id="case-study" className="py-28 md:py-36" style={{ background: "#0369A1" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px] bg-white/30" />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40">
            Cas d'usage · Pharma Top 20
          </span>
        </div>

        <div className="relative mb-20 overflow-hidden">
          <img
            src={pharmaLab}
            alt="Laboratoire de recherche pharmaceutique"
            className="w-full h-[220px] md:h-[300px] object-cover opacity-30"
            loading="lazy"
            width={1280}
            height={960}
          />
          <div className="absolute inset-0 flex items-center">
            <h2 className="font-heading text-[40px] md:text-[56px] lg:text-[68px] font-bold leading-[1.05] text-white px-8 md:px-12">
              Pipeline R&D
              <br />
              accéléré par l'IA.
            </h2>
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-1 bg-white/40" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="space-y-5 text-[15px] md:text-base leading-[1.85]" style={{ color: "rgba(255,255,255,0.6)" }}>
              <p>
                Un <strong className="text-white font-medium">laboratoire pharmaceutique européen</strong> faisait
                face à des <strong className="text-white font-medium">délais de soumission réglementaire critiques</strong> :
                rédaction CTD manuelle, revues de pharmacovigilance fragmentées, données de stabilité non consolidées.
              </p>
              <p>
                Notre plateforme a <strong className="text-white font-medium">automatisé la compilation eCTD</strong>,
                déployé un <strong className="text-white font-medium">système de signal detection en temps réel</strong> et
                implémenté une <strong className="text-white font-medium">analyse prédictive des profils ADMET</strong> —
                réduisant le <strong className="text-white font-medium">cycle de soumission de 18 à 7 mois</strong>.
              </p>
            </div>

            <div className="mt-14 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="font-heading text-[52px] md:text-[68px] font-bold leading-none mb-3 text-white">–61%</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Réduction du cycle de soumission réglementaire</p>
            </div>
          </div>

          <div>
            <div className="space-y-0 mb-14">
              {[
                { val: "–85%", label: "Temps de revue ICSR grâce au NLP médical" },
                { val: "99.7%", label: "Précision de classification MedDRA automatisée" },
                { val: "0", label: "Non-conformité Annexe 11 depuis le déploiement" },
              ].map((m) => (
                <div key={m.val + m.label} className="py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="font-heading text-[36px] md:text-[44px] font-bold mb-2 text-white">{m.val}</div>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{m.label}</p>
                </div>
              ))}
            </div>

            <div className="relative pl-6" style={{ borderLeft: "2px solid rgba(255,255,255,0.2)" }}>
              <p className="text-base md:text-lg italic leading-relaxed mb-5 text-white/80">
                "Leur expertise réglementaire combinée à la puissance de leur IA nous a fait gagner
                deux cycles de soumission. Le ROI était visible dès le premier trimestre."
              </p>
              <p className="text-sm font-semibold text-white/90">VP Regulatory Affairs — Pharma EU</p>
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
