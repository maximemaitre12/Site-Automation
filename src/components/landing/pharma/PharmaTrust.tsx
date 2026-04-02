import { Award, ShieldCheck, Zap, Check } from "lucide-react";

export function PharmaTrust() {
  return (
    <section id="trust" className="py-24" style={{ background: "#F9FBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-16 text-center" style={{ color: "#1A3A6B" }}>
          Pourquoi nous
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Real expertise */}
          <div className="rounded-lg p-6" style={{ background: "#F9FBFC", borderLeft: "4px solid #0D8B5E" }}>
            <Award className="w-12 h-12 mb-4" style={{ color: "#0D8B5E" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#1A3A6B" }}>
              Nous sommes des experts pharma. Pas des consultants qui lisent Wikipedia.
            </h3>
            <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>
              Collectif de 18+ années d'expérience opérationnelle dans l'industrie pharmaceutique:
            </p>
            <ul className="space-y-2">
              {["Implémenté GMP dans les vraies usines", "Managé des audits FDA (et gagné)", "Recruté des regulatory experts", "Navigué EMA approvals", "Géré des audit findings critiques"].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0D8B5E" }} /> {item}
                </li>
              ))}
            </ul>
            <p className="text-sm italic mt-4" style={{ color: "#1A3A6B" }}>
              Notre expertise n'est pas théorique. C'est de l'expérience de terrain.
            </p>
          </div>

          {/* Zero incidents */}
          <div className="rounded-lg p-6" style={{ background: "#F0FFF4", borderLeft: "4px solid #0D8B5E" }}>
            <ShieldCheck className="w-12 h-12 mb-4" style={{ color: "#0D8B5E" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#1A3A6B" }}>
              En 18 ans: Zéro regulatory incidents. Zéro FDA warning letters.
            </h3>
            <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>
              Chaque solution est designed avec:
            </p>
            <ul className="space-y-2">
              {["21 CFR Part 11 compliance", "GMP requirements built-in", "FDA audit readiness as default", "Regulatory risk = mitigated"].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0D8B5E" }} /> {item}
                </li>
              ))}
            </ul>
            <p className="text-sm italic mt-4" style={{ color: "#1A3A6B" }}>
              Nous ne voyons pas la compliance comme une contrainte. C'est la fondation.
            </p>
          </div>

          {/* No disruption */}
          <div className="rounded-lg p-6" style={{ background: "#FFF9F0", borderLeft: "4px solid #FF8A45" }}>
            <Zap className="w-12 h-12 mb-4" style={{ color: "#FF8A45" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#1A3A6B" }}>
              Vos opérations ne ralentissent pas. Garantie.
            </h3>
            <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>
              Raison pourquoi ça n'arrive pas avec nous:
            </p>
            <ul className="space-y-2">
              {["Nous avons fait ça 50+ fois", "Nous connaissons les pièges", "Nous planifions \"no disruption\" from day 1", "Nous travaillons pendant production off-hours", "Contingencies incluses dans chaque plan"].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FF8A45" }} /> {item}
                </li>
              ))}
            </ul>
            <p className="text-sm italic mt-4" style={{ color: "#1A3A6B" }}>
              Nous sommes trop séniors pour faire de la disruption. Ça ne nous intéresse pas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
