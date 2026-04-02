import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section className="py-24" style={{ background: "#F3F7FC" }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold mb-4" style={{ color: "#1A3A6B" }}>
          Prêt à transformer vos opérations ?
        </h2>
        <p className="text-lg mb-8" style={{ color: "#4A5568" }}>
          Commencez par un diagnostic. Pas d'engagement. Pas de vente forcée. Juste une compréhension claire de votre situation pharma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <button className="inline-flex items-center gap-2 h-14 px-10 text-base font-bold text-white rounded transition-all hover:shadow-xl active:scale-[0.97]" style={{ background: "#0D8B5E" }}>
              Demander un diagnostic pharma
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <a href="mailto:hello@aether-connect.com">
            <button className="inline-flex items-center gap-2 h-14 px-10 text-base font-semibold rounded border-2 transition-all hover:shadow-sm" style={{ borderColor: "#1A3A6B", color: "#1A3A6B" }}>
              Ou appelez-nous directement
            </button>
          </a>
        </div>
        <p className="text-sm mt-4" style={{ color: "#4A5568" }}>
          hello@aether-connect.com
        </p>
      </div>
    </section>
  );
}
