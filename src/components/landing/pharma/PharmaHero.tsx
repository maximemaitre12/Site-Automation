import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const proofs = [
  "18 années d'expérience opérationnelle pharma",
  "Audit FDA réussi sur nos premières implémentations",
  "95% des clients continuent après la transformation",
];

export function PharmaHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-[70px]" style={{ background: "linear-gradient(180deg, #FAFBFC 0%, #F3F7FC 100%)" }}>
      <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.2] tracking-tight mb-4" style={{ color: "#1A3A6B", letterSpacing: "-0.5px" }}>
            Transformer vos opérations pharma.{" "}
            <span style={{ color: "#2C3E50" }}>Sans perdre la conformité.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mt-4 mb-6" style={{ color: "#4A5568" }}>
            De la recruitment en quality assurance à la maîtrise de la traçabilité GMP. Nous résolvons les défis que les consultants génériques ne comprennent pas.
          </p>

          <ul className="space-y-2 mb-10">
            {proofs.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[15px]" style={{ color: "#2C3E50", lineHeight: 2 }}>
                <Check className="w-5 h-5 shrink-0" style={{ color: "#0D8B5E" }} />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 h-12 px-8 text-base font-bold text-white rounded transition-all hover:shadow-lg active:scale-[0.97]" style={{ background: "#0D8B5E" }}>
                Discuter de votre défi pharma
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="#case-study">
              <button className="inline-flex items-center gap-2 h-12 px-8 text-base font-semibold rounded border-2 transition-all hover:shadow-sm" style={{ borderColor: "#1A3A6B", color: "#1A3A6B", background: "transparent" }}>
                Voir nos cas de transformation →
              </button>
            </a>
          </div>
        </div>

        <div className="hidden md:block animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-xl shadow-2xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "#E8EFF8" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "#0D8B5E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF8A45" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#1A3A6B" }} />
              <span className="ml-2 text-xs font-medium" style={{ color: "#6B7C8C" }}>Pharma Operations Dashboard</span>
            </div>
            {[
              { label: "Time to hire pharma talent", before: "24 wks", after: "6 wks", color: "#0D8B5E" },
              { label: "GMP compliance incidents", before: "3/year", after: "0/year", color: "#1A3A6B" },
              { label: "FDA audit findings", before: "Critical", after: "None", color: "#FF8A45" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F9FBFC" }}>
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
