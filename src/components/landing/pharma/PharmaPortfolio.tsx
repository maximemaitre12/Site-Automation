import { ArrowRight } from "lucide-react";

const cases = [
  {
    title: "XYZ Pharma - Automatisation RH & Paie",
    challenge: "Processus paie décentralisé, erreurs 5/mois, lent",
    result: "€120k/an économisées, 0 erreurs, 50% réduction temps admin",
  },
  {
    title: "ABC Biotech - Data Pipeline & Analytics",
    challenge: "Data dispersée 6 sources, pas d'analytics temps-réel",
    result: "Insights 48h → 1h, €80k infrastructure savings",
  },
  {
    title: "DEF API - Supply Chain Optimization",
    challenge: "Supplier management chaotique, ruptures stock fréquentes",
    result: "70% réduction ruptures, €280k savings, 99.2% uptime",
  },
];

export function PharmaPortfolio() {
  return (
    <section className="py-24" style={{ background: "#F9FBFF" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#0033CC" }}>
          Portfolio : Autres projets réussis
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-lg p-6 border transition-all hover:shadow-lg group cursor-pointer"
              style={{ borderColor: "#E8EFF8", boxShadow: "0 2px 6px rgba(0,51,204,0.08)" }}
            >
              <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center text-white text-xs font-bold" style={{ background: "#0033CC" }}>
                {c.title.charAt(0)}
              </div>
              <h3 className="font-heading text-base font-bold mb-2" style={{ color: "#0033CC" }}>{c.title}</h3>
              <p className="text-sm mb-3" style={{ color: "#4A4A4A" }}>{c.challenge}</p>
              <p className="text-sm font-semibold mb-4" style={{ color: "#2CAA56" }}>"{c.result}"</p>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#0033CC" }}>
                Lire l'étude <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
