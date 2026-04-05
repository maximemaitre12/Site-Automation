import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section
      className="py-32"
      style={{
        background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 40%, #7DD3FC 100%)",
      }}
    >
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Prêt à transformer vos opérations ?
        </h2>
        <p className="text-lg text-white/80 mb-10 leading-relaxed">
          Commencez par un diagnostic. Pas d'engagement. Pas de vente forcée. Juste une compréhension claire de votre situation pharma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <button className="inline-flex items-center gap-2 h-14 px-10 text-base font-bold text-[#0891B2] bg-white rounded-full transition-all hover:shadow-2xl hover:scale-105 active:scale-[0.97]">
              Demander une présentation
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <a href="mailto:hello@aether-connect.com">
            <button className="inline-flex items-center gap-2 h-14 px-10 text-base font-semibold rounded-full border-2 border-white/40 text-white transition-all hover:bg-white/10 hover:border-white/60">
              Nous contacter
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
