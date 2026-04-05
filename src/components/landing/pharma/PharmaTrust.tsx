import { Award, ShieldCheck, Zap } from "lucide-react";

const items = [
  {
    icon: Award,
    title: "Expertise réelle",
    desc: "18+ années d'expérience opérationnelle dans l'industrie pharmaceutique. Nous avons implémenté GMP dans de vraies usines et managé des audits FDA.",
    highlight: "Notre expertise n'est pas théorique.",
    color: "#059669",
  },
  {
    icon: ShieldCheck,
    title: "Zéro incidents réglementaires",
    desc: "En 18 ans: zéro regulatory incidents, zéro FDA warning letters. Chaque solution est designed avec 21 CFR Part 11 compliance et FDA audit readiness.",
    highlight: "La compliance est notre fondation.",
    color: "#0891B2",
  },
  {
    icon: Zap,
    title: "Garantie zéro disruption",
    desc: "Vos opérations ne ralentissent pas. Nous planifions 'no disruption' dès le jour 1. Contingencies incluses dans chaque plan.",
    highlight: "Nous sommes trop séniors pour faire de la disruption.",
    color: "#F97316",
  },
];

export function PharmaTrust() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Partenaire{" "}
            <span style={{ color: "#0891B2" }}>de confiance</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${item.color}12` }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#0F172A" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748B" }}>{item.desc}</p>
              <p className="text-sm font-bold italic" style={{ color: item.color }}>{item.highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
