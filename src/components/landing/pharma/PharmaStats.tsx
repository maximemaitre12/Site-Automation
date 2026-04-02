import { Briefcase, ShieldCheck, Users, Ban } from "lucide-react";

const stats = [
  { icon: Briefcase, value: "18+", label: "Années d'expérience", sub: "dans l'industrie pharmaceutique", color: "#1A3A6B" },
  { icon: ShieldCheck, value: "100%", label: "Réussite aux audits FDA", sub: "sur les 12 dernières implémentations", color: "#0D8B5E" },
  { icon: Users, value: "95%", label: "Des clients reviennent", sub: "pour des phases de transformation supplémentaires", color: "#FF8A45" },
  { icon: Ban, value: "0", label: "Violations réglementaires", sub: "en 18 ans d'opérations", color: "#1A3A6B" },
];

export function PharmaStats() {
  return (
    <section className="py-20" style={{ background: "#F9FBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-8 text-center border" style={{ borderColor: "#E8EFF8", boxShadow: "0 2px 6px rgba(26,58,107,0.08)" }}>
            <s.icon className="w-10 h-10 mx-auto mb-4" style={{ color: s.color }} />
            <div className="font-heading text-5xl md:text-6xl font-bold mb-2" style={{ color: "#1A3A6B" }}>{s.value}</div>
            <div className="text-lg font-medium" style={{ color: "#2C3E50" }}>{s.label}</div>
            <div className="text-sm mt-1" style={{ color: "#6B7C8C" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
