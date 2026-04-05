import { Mail, ArrowRight, Clock, Shield, Zap } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

const reasons = [
  { icon: Clock, title: "Fast response", desc: "We respond within 24 hours on business days" },
  { icon: Zap, title: "Custom proposal", desc: "Tailored to your operations and infrastructure" },
  { icon: Shield, title: "No commitment", desc: "Free initial consultation, no strings attached" },
];

export default function Contact() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-white">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-[2px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              Contact
            </span>
            <div className="w-8 h-[2px]" style={{ background: "#0369A1" }} />
          </div>
          <h1
            className="font-heading text-[32px] sm:text-[40px] lg:text-[48px] font-bold tracking-tight leading-[1.1] mb-6"
            style={{ color: "#0F172A" }}
          >
            Let's talk about your project
          </h1>
          <p className="text-[15px] sm:text-base leading-relaxed max-w-md mx-auto" style={{ color: "#64748B" }}>
            Describe your needs and we'll respond with a personalized proposal
          </p>
        </div>
      </section>

      {/* Email CTA */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="max-w-[560px] mx-auto">
          <div className="p-10 sm:p-12" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <div className="flex items-center justify-center mb-8">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: "#0369A1" }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-center mb-2"
              style={{ color: "#0F172A" }}
            >
              Send us an email
            </h2>
            <p className="text-sm text-center mb-10" style={{ color: "#94A3B8" }}>
              Describe your needs and we'll respond with a personalized proposal
            </p>
            <div className="flex flex-col gap-3">
              {EMAILS.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}?subject=Aether Connect — Project inquiry`}
                  className="flex items-center justify-between px-6 py-4 text-[14px] font-medium transition-all duration-200 hover:shadow-md group"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                  }}
                >
                  <span>{email}</span>
                  <ArrowRight className="w-4 h-4 text-[#0369A1] group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#F8FAFC" }}>
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-[2px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#0369A1" }}>
              What to expect
            </span>
            <div className="w-6 h-[2px]" style={{ background: "#0369A1" }} />
          </div>
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-center mb-14"
            style={{ color: "#0F172A" }}
          >
            How we work with you
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="p-8 text-center bg-white"
                style={{ border: "1px solid #E2E8F0" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#EAF3F7" }}
                >
                  <r.icon className="w-5 h-5" style={{ color: "#0369A1" }} />
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#0F172A" }}>{r.title}</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: "#64748B" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
