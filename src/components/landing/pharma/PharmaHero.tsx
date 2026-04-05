import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export function PharmaHero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 30%, #7DD3FC 60%, #BAE6FD 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 text-center z-10 py-32">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-8 animate-fade-in">
          Transformer vos{" "}
          <br className="hidden sm:block" />
          opérations pharma.
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: "0.15s" }}>
          De la conformité GMP au recrutement des talents. Nous résolvons les défis que les consultants génériques ne comprennent pas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-bold text-[#0891B2] bg-white rounded-full transition-all hover:shadow-2xl hover:scale-105 active:scale-[0.97]"
          >
            Demander une présentation
          </Link>
          <a
            href="#case-study"
            className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-semibold rounded-full border-2 border-white/40 text-white transition-all hover:bg-white/10 hover:border-white/60"
          >
            Voir nos cas de succès
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-8 right-8 flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/30 text-white/60 hover:text-white hover:border-white/60 transition-all animate-float"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
}
