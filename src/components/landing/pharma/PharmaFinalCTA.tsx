import { Link } from "react-router-dom";

export function PharmaFinalCTA() {
  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0369A1 0%, #0891B2 50%, #06B6D4 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute -bottom-36 -left-36 w-[550px] h-[550px] rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
        <div className="w-12 h-[3px] bg-white/30 mb-12" />

        <h2 className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] text-white mb-6">
          Accelerate your
          <br />
          regulatory pipeline.
        </h2>
        <p className="text-[15px] md:text-base max-w-[460px] mb-14 leading-[1.85]" style={{ color: "rgba(255,255,255,0.6)" }}>
          Start with a <strong className="text-white font-medium">free AI regulatory audit</strong>.
          We identify <strong className="text-white font-medium">automatable GxP processes</strong> and
          the <strong className="text-white font-medium">immediate compliance gains</strong> your
          organization can capture through cloud-native AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#0369A1] bg-white transition-all hover:bg-white/90"
          >
            Free regulatory audit
          </Link>
          <a
            href="mailto:hello@aether-connect.com"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-medium tracking-[0.1em] uppercase text-white border border-white/25 transition-all hover:bg-white/10"
          >
            Contact the R&D team
          </a>
        </div>
      </div>
    </section>
  );
}
