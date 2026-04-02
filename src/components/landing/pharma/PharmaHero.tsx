import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const proofs = [
  "50+ automatisations lancées pour des pharmas",
  "Moyenne ROI: 300% en année 1",
  "0 disruption opérationnelle lors du déploiement",
];

export function PharmaHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-[70px]" style={{ background: "linear-gradient(180deg, #FAFBFC 0%, #F0F4FF 100%)" }}>
      <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
        {/* Left - Text */}
        <div className="animate-fade-in">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-4" style={{ color: "#0033CC", letterSpacing: "-0.5px" }}>
            Réduisez vos coûts opérationnels de 40-70%{" "}
            <span className="text-foreground">en automatisant vos processus critiques.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mt-4 mb-6" style={{ color: "#4A4A4A" }}>
            Solutions d'automatisation IA sur mesure pour l'industrie pharmaceutique. Implémentation en 4-6 semaines, résultats mesurables.
          </p>

          <ul className="space-y-2 mb-10">
            {proofs.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-base" style={{ color: "#2C3E50", lineHeight: 2 }}>
                <Check className="w-5 h-5 shrink-0" style={{ color: "#17A2B8" }} />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 h-12 px-8 text-base font-bold text-white rounded-md transition-all hover:shadow-lg active:scale-[0.97]" style={{ background: "#FF6B35" }}>
                Demander votre audit gratuit
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="#case-study">
              <button className="inline-flex items-center gap-2 h-12 px-8 text-base font-semibold rounded-md border-2 transition-all hover:shadow-sm" style={{ borderColor: "#0033CC", color: "#0033CC", background: "transparent" }}>
                Voir les cas de succès →
              </button>
            </a>
          </div>
        </div>

        {/* Right - Dashboard Mockup */}
        <div className="hidden md:block animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-xl shadow-2xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "#E8EFF8" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF6B35" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#17A2B8" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#2CAA56" }} />
              <span className="ml-2 text-xs font-medium" style={{ color: "#6B7C8C" }}>Aether Dashboard</span>
            </div>
            {[
              { label: "Temps recrutement", before: "42j", after: "8j", color: "#0033CC" },
              { label: "Erreurs supply chain", before: "12%", after: "0.4%", color: "#17A2B8" },
              { label: "Économies annuelles", before: "—", after: "€340k", color: "#FF6B35" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F9FBFF" }}>
                <span className="text-sm font-medium" style={{ color: "#2C3E50" }}>{m.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm line-through" style={{ color: "#6B7C8C" }}>{m.before}</span>
                  <ArrowRight className="w-4 h-4" style={{ color: "#6B7C8C" }} />
                  <span className="text-lg font-bold" style={{ color: m.color }}>{m.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
