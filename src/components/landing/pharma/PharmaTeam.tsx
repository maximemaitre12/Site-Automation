export function PharmaTeam() {
  return (
    <section id="team" className="py-32 md:py-40" style={{ background: "#0F172A" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#4a8fa3" }}>
              Équipe fondatrice
            </p>
            <h2
              className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-10 text-white"
            >
              Présence &
              <br />
              expérience.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.8]" style={{ color: "#8896a7" }}>
              Notre équipe fondatrice combine <strong className="text-white/90 font-medium">plus de 30 ans</strong> d'expérience
              dans l'industrie pharmaceutique, avec des rôles opérationnels chez{" "}
              <strong className="text-white/90 font-medium">Sanofi</strong>,{" "}
              <strong className="text-white/90 font-medium">Novartis</strong> et{" "}
              <strong className="text-white/90 font-medium">GSK</strong>. Nous ne conseillons pas depuis
              un bureau — nous avons <strong className="text-white/90 font-medium">managé des usines</strong>,{" "}
              <strong className="text-white/90 font-medium">passé des audits FDA</strong> et{" "}
              <strong className="text-white/90 font-medium">recruté des équipes réglementaires</strong> de A à Z.
            </p>
          </div>

          <div className="space-y-14">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: "#4a8fa3" }}>Fondateur</p>
              <h3 className="font-heading text-2xl font-bold mb-4 text-white">
                Nicolas Parisi
              </h3>
              <p className="text-[15px] leading-[1.8]" style={{ color: "#8896a7" }}>
                <strong className="text-white/90 font-medium">15 ans</strong> d'expérience opérationnelle pharma.
                Anciennement Head of Operations chez <strong className="text-white/90 font-medium">Sanofi</strong> et
                consultant GMP chez <strong className="text-white/90 font-medium">Novartis</strong>. Spécialiste FDA 21 CFR Part 11.
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: "#4a8fa3" }}>Co-fondateur</p>
              <h3 className="font-heading text-2xl font-bold mb-4 text-white">
                Vladyslav Mazurkevych
              </h3>
              <p className="text-[15px] leading-[1.8]" style={{ color: "#8896a7" }}>
                <strong className="text-white/90 font-medium">18 ans</strong> de consulting pharma & manufacturing.
                Expert en <strong className="text-white/90 font-medium">quality management systems</strong> et
                scaling opérationnel. Background <strong className="text-white/90 font-medium">GSK</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
