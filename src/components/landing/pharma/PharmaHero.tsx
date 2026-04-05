import { Link } from "react-router-dom";
import pharmaLab from "@/assets/pharma-lab.jpg";

export function PharmaHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0369A1 0%, #0891B2 35%, #06B6D4 70%, #22D3EE 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-[8%] w-[480px] h-[480px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute top-[20%] right-[2%] w-[340px] h-[340px] rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute bottom-[5%] right-[18%] w-[280px] h-[280px] rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>

      <div className="absolute top-[18%] right-[6%] w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden hidden md:block opacity-20 lg:opacity-25">
        <img src={pharmaLab} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 pt-44 pb-36">
        <div className="max-w-[820px]">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/45 mb-8">
            Orchestration IA · R&D Pharma · Conformité Réglementaire
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[92px] font-bold leading-[1.02] tracking-tight text-white mb-10">
            L'IA qui accélère
            <br />
            votre pipeline R&D.
          </h1>
          <p className="text-lg md:text-xl text-white/65 max-w-[540px] leading-relaxed mb-16">
            Des <strong className="text-white font-medium">systèmes d'intelligence artificielle GxP-natifs</strong> qui
            accélèrent la <strong className="text-white font-medium">découverte moléculaire</strong>, automatisent la <strong className="text-white font-medium">pharmacovigilance</strong> et optimisent vos <strong className="text-white font-medium">soumissions réglementaires</strong> — FDA, EMA, ANSM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#0369A1] bg-white transition-all hover:bg-white/90"
            >
              Demander un audit réglementaire IA
            </Link>
            <a
              href="#case-study"
              className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-medium tracking-[0.1em] uppercase text-white border border-white/25 transition-all hover:bg-white/10"
            >
              Voir nos résultats cliniques
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/35 [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-px h-14 bg-white/20" />
      </div>
    </section>
  );
}
