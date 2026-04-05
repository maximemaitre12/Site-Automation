import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#0891B2" }}>
          Prochaine étape
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight mb-6" style={{ color: "#0F172A" }}>
          Prêt à transformer
          <br />vos opérations ?
        </h2>
        <p className="text-base mb-10 leading-relaxed" style={{ color: "#64748B" }}>
          Commencez par un diagnostic. Pas d'engagement.
          <br />Juste une compréhension claire de votre situation pharma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0891B2" }}
          >
            Demander un diagnostic
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="mailto:hello@aether-connect.com"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-semibold transition-all hover:opacity-70"
            style={{ color: "#0F172A", border: "1px solid #E2E8F0" }}
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
