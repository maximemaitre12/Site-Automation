import { Link } from "react-router-dom";

export function PharmaHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #042f3d 0%, #064E6E 30%, #0c7792 70%, #0e8a9f 100%)",
      }}
    >
      {/* Overlapping circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-[8%] w-[480px] h-[480px] rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute top-[20%] right-[2%] w-[340px] h-[340px] rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute bottom-[5%] right-[18%] w-[280px] h-[280px] rounded-full" style={{ background: "rgba(255,255,255,0.035)" }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "rgba(255,255,255,0.02)" }} />
        <div className="absolute top-[45%] left-[12%] w-[200px] h-[200px] rounded-full" style={{ background: "rgba(255,255,255,0.025)" }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 pt-44 pb-36">
        <div className="max-w-[820px]">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/40 mb-8">
            Conseil pharmaceutique spécialisé
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[92px] font-bold leading-[1.02] tracking-tight text-white mb-10">
            Transformer vos
            <br />
            opérations pharma.
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-[540px] leading-relaxed mb-16">
            De la <strong className="text-white/90 font-medium">conformité GMP</strong> au{" "}
            <strong className="text-white/90 font-medium">recrutement des talents</strong>.
            Nous résolvons les défis que les consultants génériques ne comprennent pas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#042f3d] bg-white transition-all hover:bg-white/90"
            >
              Demander une présentation
            </Link>
            <a
              href="#case-study"
              className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-medium tracking-[0.1em] uppercase text-white/80 border border-white/20 transition-all hover:bg-white/5 hover:border-white/35"
            >
              Voir nos résultats
            </a>
          </div>
        </div>
      </div>

      {/* Vertical scroll indicator */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/30 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-px h-14 bg-white/20" />
      </div>
    </section>
  );
}
