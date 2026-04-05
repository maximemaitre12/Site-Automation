import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section
      className="relative py-32 md:py-44 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #042f3d 0%, #064E6E 50%, #0c7792 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute -bottom-36 -left-36 w-[550px] h-[550px] rounded-full" style={{ background: "rgba(255,255,255,0.02)" }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#4a8fa3" }}>
          Prochaine étape
        </p>
        <h2 className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] text-white mb-6">
          Prêt à transformer
          <br />
          vos opérations ?
        </h2>
        <p className="text-[15px] md:text-base max-w-[480px] mb-14 leading-[1.8]" style={{ color: "#8db4c2" }}>
          Commencez par un <strong className="text-white/90 font-medium">diagnostic</strong>.
          Pas d'engagement. Juste une compréhension claire de votre situation pharma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#042f3d] bg-white transition-all hover:bg-white/90"
          >
            Demander un diagnostic
          </Link>
          <a
            href="mailto:hello@aether-connect.com"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-medium tracking-[0.1em] uppercase text-white/80 border border-white/20 transition-all hover:bg-white/5"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
