import pharmaTeamMeeting from "@/assets/pharma-team-meeting.jpg";

export function PharmaTeam() {
  return (
    <section id="team" className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Architecture opérationnelle
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
              Ingénierie IA
              <br />
              de grade industriel.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "#334155" }}>
              Nos <strong style={{ color: "#0F172A" }}>pipelines de machine learning</strong> sont
              conçus pour des environnements <strong style={{ color: "#0F172A" }}>GxP-compatibles</strong> et
              des workflows <strong style={{ color: "#0F172A" }}>FDA 21 CFR Part 11</strong>. Chaque modèle
              est versionné, auditable et déployé via des <strong style={{ color: "#0F172A" }}>CI/CD validés</strong> sur
              infrastructure <strong style={{ color: "#0F172A" }}>SOC 2 Type II</strong>.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                title: "ORCHESTRATION MLOps",
                desc: <>
                  <strong style={{ color: "#0F172A" }}>Feature stores</strong> centralisés,{" "}
                  <strong style={{ color: "#0F172A" }}>model registry</strong> avec versioning sémantique,{" "}
                  <strong style={{ color: "#0F172A" }}>pipelines d'inférence</strong> containerisés
                  sur Kubernetes. Monitoring drift en temps réel via <strong style={{ color: "#0F172A" }}>Prometheus/Grafana</strong>.
                </>,
              },
              {
                title: "AGENTS AUTONOMES & RAG",
                desc: <>
                  Architectures <strong style={{ color: "#0F172A" }}>multi-agents</strong> avec{" "}
                  <strong style={{ color: "#0F172A" }}>retrieval-augmented generation</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>vector databases</strong> (Pinecone, pgvector),
                  chaînes de raisonnement <strong style={{ color: "#0F172A" }}>LangChain/LlamaIndex</strong> et
                  orchestration <strong style={{ color: "#0F172A" }}>event-driven</strong>.
                </>,
              },
              {
                title: "INFRASTRUCTURE & COMPLIANCE",
                desc: <>
                  Déploiement <strong style={{ color: "#0F172A" }}>multi-cloud</strong> (AWS, Azure, GCP)
                  avec <strong style={{ color: "#0F172A" }}>IaC Terraform</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>encryption at rest/in transit</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>audit trails</strong> immutables et{" "}
                  <strong style={{ color: "#0F172A" }}>RBAC</strong> granulaire. Conformité RGPD, HIPAA, ISO 27001.
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
