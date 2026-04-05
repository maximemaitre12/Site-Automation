import { Mail, ArrowRight, Clock, Shield, Zap } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

const faqs = [
  { q: "How quickly can we get started?", a: "Most clients are operational within a week. Our team handles onboarding and initial configuration." },
  { q: "Do you offer a free trial?", a: "Yes. 14-day free trial with full access to all features. No credit card required." },
  { q: "What integrations do you support?", a: "We integrate with major enterprise tools: Salesforce, HubSpot, Slack, Microsoft 365, and 100+ others." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We are GDPR-compliant and SOC 2 Type II certified." },
];

const reasons = [
  { icon: Clock, title: "Fast response", desc: "We respond within 24 hours on business days." },
  { icon: Zap, title: "Custom demo", desc: "Tailored presentation adapted to your use case." },
  { icon: Shield, title: "No commitment", desc: "Free evaluation, no strings attached." },
];

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero — light background so the white logo remains visible */}
      <section className="pt-24 pb-16 px-6 lg:px-12" style={{ background: "#E8F4F8" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: "#0369A1" }}>
            Contact
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]" style={{ color: "#0F172A" }}>
            Let's talk about your project
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "#64748B" }}>
            Interested in AETHER? Reach out directly by email and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Email CTA */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[600px] mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: "#E8F4F8" }}>
            <Mail className="w-8 h-8" style={{ color: "#0369A1" }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style={{ color: "#0F172A" }}>
            Send us an email
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#64748B" }}>
            Describe your needs and we'll respond with a personalized proposal.
          </p>
          <div className="flex flex-col gap-4">
            {EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}?subject=AETHER — I'd like to learn more`}
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 group justify-center"
                style={{ background: "#0891B2" }}
              >
                {email}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#E8F4F8" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4" style={{ color: "#0369A1" }}>
            What to expect
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-14" style={{ color: "#0F172A" }}>
            What we offer
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div key={r.title} className="p-8 text-center" style={{ background: "#FFFFFF", border: "1px solid #D6EEF5" }}>
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-5" style={{ background: "#E8F4F8" }}>
                  <r.icon className="w-5 h-5" style={{ color: "#0369A1" }} />
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#0F172A" }}>{r.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4" style={{ color: "#94A3B8" }}>
            Common questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-14" style={{ color: "#0F172A" }}>
            Frequently asked questions
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-8" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#0F172A" }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
