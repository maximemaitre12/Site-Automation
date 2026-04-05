import pharmaTeamMeeting from "@/assets/pharma-team-meeting.jpg";

export function PharmaTeam() {
  return (
    <section id="team" className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Notre approche
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
              L'exécution
              <br />
              avant tout.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "#334155" }}>
              Aether Connect réunit des <strong style={{ color: "#0F172A" }}>architectes systèmes</strong>,
              des <strong style={{ color: "#0F172A" }}>ingénieurs IA</strong> et des{" "}
              <strong style={{ color: "#0F172A" }}>spécialistes data</strong> autour d'une obsession commune :
              livrer des <strong style={{ color: "#0F172A" }}>systèmes qui tournent en production</strong>,
              pas des prototypes qui restent dans un tiroir.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                title: "MÉTHODOLOGIE",
                desc: <>
                  Chaque projet commence par un <strong style={{ color: "#0F172A" }}>audit opérationnel</strong> de
                  vos processus. On identifie les <strong style={{ color: "#0F172A" }}>leviers d'automatisation</strong> à
                  fort impact avant d'écrire une seule ligne de code.
                </>,
              },
              {
                title: "INFRASTRUCTURE",
                desc: <>
                  Nos systèmes sont déployés sur des <strong style={{ color: "#0F172A" }}>infrastructures cloud</strong> de
                  niveau entreprise — <strong style={{ color: "#0F172A" }}>AWS, Azure, GCP</strong> — avec
                  monitoring, scaling automatique et <strong style={{ color: "#0F172A" }}>SLA garanti</strong>.
                </>,
              },
              {
                title: "ACCOMPAGNEMENT",
                desc: <>
                  Un <strong style={{ color: "#0F172A" }}>interlocuteur dédié</strong> du diagnostic au déploiement.
                  Formation de vos équipes et <strong style={{ color: "#0F172A" }}>support continu</strong> post-lancement.
                </>,
              },
            ].map((item) => (
              <div key={item.title} className="py-8" style={{ borderBottom: "1px solid rgba(3,105,161,0.15)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                  <span className="text-[11px] tracking-[0.25em] uppercase font-semibold" style={{ color: "#0369A1" }}>{item.title}</span>
                </div>
                <p className="text-[15px] leading-[1.85]" style={{ color: "#334155" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
