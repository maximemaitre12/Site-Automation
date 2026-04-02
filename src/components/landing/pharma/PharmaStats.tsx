import { BarChart3, Euro, Clock, ThumbsUp } from "lucide-react";

const stats = [
  { icon: BarChart3, value: "340+", label: "Automatisations lancées", sub: "pour clients pharma en 2024-2025", color: "#0033CC" },
  { icon: Euro, value: "€7.2M", label: "Économisées pour nos clients", sub: "par réduction de processus manuels", color: "#17A2B8" },
  { icon: Clock, value: "34 jours", label: "Du diagnostic au déploiement", sub: "vs. 120+ jours (consultants traditionnels)", color: "#FF6B35" },
  { icon: ThumbsUp, value: "98%", label: "Clients qui poursuivent après le pilote", sub: "(vs. 65% moyenne industrie)", color: "#2CAA56" },
];

export function PharmaStats() {
  return (
    <section className="py-20" style={{ background: "#F9FBFF" }}>
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-8 text-center" style={{ boxShadow: "0 2px 8px rgba(0,51,204,0.06)" }}>
            <s.icon className="w-10 h-10 mx-auto mb-4" style={{ color: s.color }} />
            <div className="font-heading text-5xl md:text-6xl font-bold mb-2" style={{ color: "#0033CC" }}>{s.value}</div>
            <div className="text-lg font-medium" style={{ color: "#2C3E50" }}>{s.label}</div>
            <div className="text-sm mt-1" style={{ color: "#6B7C8C" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
