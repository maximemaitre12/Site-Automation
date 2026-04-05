import pharmaTeamMeeting from "@/assets/pharma-team-meeting.jpg";

export function PharmaTeam() {
  return (
    <section id="team" className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            À propos
          </span>
        </div>

        <div className="relative mb-20">
          <img
            src={pharmaTeamMeeting}
            alt="Équipe Aether Connect"
            className="w-full h-[280px] md:h-[380px] object-cover"
            loading="lazy"
            width={1280}
            height={720}
          />
          <div className="absolute bottom-0 left-0 w-24 h-1" style={{ background: "#0369A1" }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
              style={{ color: "#0F172A" }}
            >
              18 ans à construire
              <br />
              l'intelligence.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "#334155" }}>
              Aether Connect est née de la conviction que l'<strong style={{ color: "#0F172A" }}>intelligence artificielle</strong> ne
              doit pas rester un concept abstrait. Depuis <strong style={{ color: "#0F172A" }}>2008</strong>, nous concevons
              des <strong style={{ color: "#0F172A" }}>systèmes IA opérationnels</strong> — pas des POCs qui restent dans un tiroir.
              Notre force : <strong style={{ color: "#0F172A" }}>comprendre votre métier</strong> avant de coder quoi que ce soit.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                role: "Fondateur",
                name: "Nicolas Parisi",
                bio: <>
                  Architecte de <strong style={{ color: "#0F172A" }}>systèmes IA</strong> depuis 18 ans.
                  A piloté <strong style={{ color: "#0F172A" }}>200+ projets d'automatisation</strong> dans la pharma,
                  la finance et l'industrie. Obsédé par le <strong style={{ color: "#0F172A" }}>ROI mesurable</strong>.
                </>,
              },
              {
                role: "Co-fondateur",
                name: "Vladyslav Mazurkevych",
                bio: <>
                  Expert en <strong style={{ color: "#0F172A" }}>infrastructure IA</strong> et{" "}
                  <strong style={{ color: "#0F172A" }}>scaling opérationnel</strong>.
                  Spécialiste des <strong style={{ color: "#0F172A" }}>agents autonomes</strong> et
                  de l'intégration dans les systèmes existants.
                </>,
              },
            ].map((f) => (
              <div key={f.name} className="py-8" style={{ borderBottom: "1px solid rgba(3,105,161,0.15)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                  <span className="text-[11px] tracking-[0.25em] uppercase" style={{ color: "#0369A1" }}>{f.role}</span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-3" style={{ color: "#0F172A" }}>{f.name}</h3>
                <p className="text-[15px] leading-[1.85]" style={{ color: "#334155" }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
