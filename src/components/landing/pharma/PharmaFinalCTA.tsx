import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section className="py-24" style={{ background: "#F0F4FF" }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] font-bold mb-4" style={{ color: "#0033CC" }}>
          Prêt à transformer vos opérations ?
        </h2>
        <p className="text-lg mb-8" style={{ color: "#4A4A4A" }}>
          Commencez par un audit gratuit. Pas d'engagement. Pas de facturation. Juste des recommandations basées sur vos données.
        </p>
        <Link to="/contact">
          <button className="inline-flex items-center gap-2 h-14 px-10 text-base font-bold text-white rounded-md transition-all hover:shadow-xl active:scale-[0.97]" style={{ background: "#FF6B35" }}>
            Demander mon audit gratuit
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <p className="text-sm mt-4" style={{ color: "#4A4A4A" }}>
          ou contactez-nous directement : hello@aether-connect.com
        </p>
      </div>
    </section>
  );
}
