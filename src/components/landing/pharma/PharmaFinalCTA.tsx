import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section
      className="relative py-36 md:py-44 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #064E6E 0%, #0891B2 40%, #22D3EE 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-8">
          Prêt à transformer
          <br />
          vos opérations ?
        </h2>
        <p className="text-lg text-white/70 max-w-[500px] mb-14 leading-relaxed">
          Commencez par un <strong className="text-white font-semibold">diagnostic</strong>.
          Pas d'engagement. Juste une compréhension claire de votre situation pharma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-14 px-10 text-sm font-bold tracking-wide uppercase text-[#064E6E] bg-white transition-all hover:bg-white/90"
          >
            Demander un diagnostic
          </Link>
          <a
            href="mailto:hello@aether-connect.com"
            className="inline-flex items-center justify-center h-14 px-10 text-sm font-semibold tracking-wide uppercase text-white border border-white/30 transition-all hover:bg-white/10"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
