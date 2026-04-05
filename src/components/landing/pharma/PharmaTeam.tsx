export function PharmaTeam() {
  return (
    <section id="team" className="py-32 md:py-40" style={{ background: "#E0F4F9" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-8" style={{ color: "#0891B2" }}>
              Équipe fondatrice
            </p>
            <h2 className="font-heading text-[36px] md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-10" style={{ color: "#0F172A" }}>
              Présence &
              <br />
              expérience.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.8]" style={{ color: "#3d5060" }}>
              Notre équipe fondatrice combine <strong style={{ color: "#0F172A" }}>plus de 30 ans</strong> d'expérience
              dans l'industrie pharmaceutique, avec des rôles opérationnels chez{" "}
              <strong style={{ color: "#0F172A" }}>Sanofi</strong>,{" "}
              <strong style={{ color: "#0F172A" }}>Novartis</strong> et{" "}
              <strong style={{ color: "#0F172A" }}>GSK</strong>. Nous ne conseillons pas depuis
              un bureau — nous avons <strong style={{ color: "#0F172A" }}>managé des usines</strong>,{" "}
              <strong style={{ color: "#0F172A" }}>passé des audits FDA</strong> et{" "}
              <strong style={{ color: "#0F172A" }}>recruté des équipes réglementaires</strong> de A à Z.
            </p>
          </div>
          <div className="space-y-14">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: "#0891B2" }}>Fondateur</p>
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Nicolas Parisi</h3>
              <p className="text-[15px] leading-[1.8]" style={{ color: "#3d5060" }}>
                <strong style={{ color: "#0F172A" }}>15 ans</strong> d'expérience opérationnelle pharma.
                Anciennement Head of Operations chez <strong style={{ color: "#0F172A" }}>Sanofi</strong> et
                consultant GMP chez <strong style={{ color: "#0F172A" }}>Novartis</strong>. Spécialiste FDA 21 CFR Part 11.
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: "#0891B2" }}>Co-fondateur</p>
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Vladyslav Mazurkevych</h3>
              <p className="text-[15px] leading-[1.8]" style={{ color: "#3d5060" }}>
                <strong style={{ color: "#0F172A" }}>18 ans</strong> de consulting pharma & manufacturing.
                Expert en <strong style={{ color: "#0F172A" }}>quality management systems</strong> et
                scaling opérationnel. Background <strong style={{ color: "#0F172A" }}>GSK</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
