import pharmaTeamMeeting from "@/assets/pharma-team-meeting.jpg";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function PharmaTeam() {
  return (
    <section id="team" className="py-28 md:py-36" style={{ background: "#D9EDF4" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              How we build
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
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
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <ScrollReveal delay={100}>
              <h2
                className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-10"
                style={{ color: "#0F172A" }}
              >
                Production-grade
                <br />
                AI engineering.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-[15px] md:text-base leading-[1.85]" style={{ color: "#334155" }}>
                Our <strong style={{ color: "#0F172A" }}>agents</strong> are not prototypes — they are
                <strong style={{ color: "#0F172A" }}> production systems</strong> integrated into your
                operational stack. Every model is versioned, every action is auditable, and every
                deployment follows <strong style={{ color: "#0F172A" }}>validated CI/CD pipelines</strong> on
                <strong style={{ color: "#0F172A" }}> cloud infrastructure</strong> compliant with
                pharmaceutical industry standards.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-0">
            {[
              {
                title: "AGENT ARCHITECTURE",
                desc: <>
                  <strong style={{ color: "#0F172A" }}>Multi-agent orchestration</strong> with{" "}
                  <strong style={{ color: "#0F172A" }}>retrieval-augmented generation</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>vector databases</strong> and
                  <strong style={{ color: "#0F172A" }}> event-driven</strong> processing — each agent handles
                  a specific operational domain while sharing a unified intelligence layer.
                </>,
              },
              {
                title: "CLOUD INFRASTRUCTURE",
                desc: <>
                  <strong style={{ color: "#0F172A" }}>Multi-cloud deployment</strong> (AWS, Azure, GCP)
                  with <strong style={{ color: "#0F172A" }}>IaC Terraform</strong>,{" "}
                  <strong style={{ color: "#0F172A" }}>encryption at rest/in transit</strong>,{" "}
                  immutable <strong style={{ color: "#0F172A" }}>audit trails</strong> and{" "}
                  granular <strong style={{ color: "#0F172A" }}>RBAC</strong>. Seamless migration from legacy on-premise systems.
                </>,
              },
              {
                title: "HUMAN-IN-THE-LOOP GOVERNANCE",
                desc: <>
                  Every agent output is a <strong style={{ color: "#0F172A" }}>draft</strong> — no automated
                  action executes without <strong style={{ color: "#0F172A" }}>explicit human validation</strong>.
                  Full traceability, audit logs, and <strong style={{ color: "#0F172A" }}>role-based access control</strong> at
                  every step of the pipeline.
                </>,
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 200}>
                <div className="py-8" style={{ borderBottom: "1px solid rgba(3,105,161,0.15)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#0369A1" }} />
                    <span className="text-[11px] tracking-[0.25em] uppercase font-semibold" style={{ color: "#0369A1" }}>{item.title}</span>
                  </div>
                  <p className="text-[15px] leading-[1.85]" style={{ color: "#334155" }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
