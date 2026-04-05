import { Link } from "react-router-dom";

export function PharmaHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #064E6E 0%, #0891B2 40%, #22D3EE 100%)",
      }}
    >
      {/* Farmak-style overlapping circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 right-[10%] w-[420px] h-[420px] rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute top-[15%] right-[5%] w-[320px] h-[320px] rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute bottom-[10%] right-[20%] w-[260px] h-[260px] rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />
        <div
          className="absolute top-[40%] left-[15%] w-[180px] h-[180px] rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 pt-40 pb-32">
        <div className="max-w-[800px]">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold leading-[1.05] tracking-tight text-white mb-10">
            Transformer vos
            <br />
            opérations pharma.
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-[560px] leading-relaxed mb-14">
            De la <strong className="text-white font-semibold">conformité GMP</strong> au{" "}
            <strong className="text-white font-semibold">recrutement des talents</strong>.
            Nous résolvons les défis que les consultants génériques ne comprennent pas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-14 px-10 text-sm font-bold tracking-wide uppercase text-[#064E6E] bg-white transition-all hover:bg-white/90"
            >
              Demander une présentation
            </Link>
            <a
              href="#case-study"
              className="inline-flex items-center justify-center h-14 px-10 text-sm font-semibold tracking-wide uppercase text-white border border-white/30 transition-all hover:bg-white/10"
            >
              Voir nos résultats
            </a>
          </div>
        </div>
      </div>

      {/* Farmak-style vertical scroll indicator */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/30" />
      </div>
    </section>
  );
}
