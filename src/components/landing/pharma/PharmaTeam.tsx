import pharmaTeamMeeting from "@/assets/pharma-team-meeting.jpg";

export function PharmaTeam() {
  return (
    <section id="team" className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Operational architecture
          </span>
        </div>

        <div className="relative mb-20">
          <img
            src={pharmaTeamMeeting}
            alt="Aether Connect engineering team"
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
              Industrial-grade
              <br />
              AI engineering.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "#334155" }}>
              Our <strong style={{ color: "#0F172A" }}>machine learning pipelines</strong> are
              built for <strong style={{ color: "#0F172A" }}>GxP-compliant</strong> environments and
              <strong style={{ color: "#0F172A" }}> FDA 21 CFR Part 11</strong> workflows. Every model
              is versioned, auditable and deployed through <strong style={{ color: "#0F172A" }}>validated CI/CD</strong> on
              <strong style={{ color: "#0F172A" }}> SOC 2 Type II</strong> cloud infrastructure — eliminating manual handoffs
              and accelerating your path from data to production.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                title: "MLOps ORCHESTRATION",
                desc: <>
                  Centralized <strong style={{ color: "#0F172A" }}>feature stores</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>model registry</strong> with semantic versioning,{" "}
                  containerized <strong style={{ color: "#0F172A" }}>inference pipelines</strong> on
                  Kubernetes. Real-time drift monitoring via <strong style={{ color: "#0F172A" }}>Prometheus/Grafana</strong>.
                  Scalable from single-tenant to enterprise multi-cloud.
                </>,
              },
              {
                title: "AUTONOMOUS AGENTS & RAG",
                desc: <>
                  <strong style={{ color: "#0F172A" }}>Multi-agent architectures</strong> with{" "}
                  <strong style={{ color: "#0F172A" }}>retrieval-augmented generation</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>vector databases</strong> (Pinecone, pgvector),
                  reasoning chains via <strong style={{ color: "#0F172A" }}>LangChain/LlamaIndex</strong> and
                  <strong style={{ color: "#0F172A" }}> event-driven</strong> orchestration — automating regulatory document processing at scale.
                </>,
              },
              {
                title: "CLOUD INFRASTRUCTURE & COMPLIANCE",
                desc: <>
                  <strong style={{ color: "#0F172A" }}>Multi-cloud deployment</strong> (AWS, Azure, GCP)
                  with <strong style={{ color: "#0F172A" }}>IaC Terraform</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>encryption at rest/in transit</strong>,{" "}
                  immutable <strong style={{ color: "#0F172A" }}>audit trails</strong> and{" "}
                  granular <strong style={{ color: "#0F172A" }}>RBAC</strong>. GDPR, HIPAA, ISO 27001 compliant.
                  Seamless migration from legacy on-premise systems.
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
