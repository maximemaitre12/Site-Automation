import { Mail, ArrowRight, Clock, Shield, Zap } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

const faqs = [
  { q: "How quickly can I get started?", a: "Most customers are up and running within a week. Our team handles onboarding and initial setup." },
  { q: "Do you offer a free trial?", a: "Yes. 14-day free trial with full access to all features. No credit card required." },
  { q: "What integrations do you support?", a: "We integrate with major enterprise tools including Salesforce, HubSpot, Slack, Microsoft 365, and 100+ more." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We're GDPR compliant and SOC 2 Type II certified." },
];

const reasons = [
  { icon: Clock, title: "Quick Response", desc: "We reply within 24 hours on business days." },
  { icon: Zap, title: "Personalized Demo", desc: "Tailored walkthrough based on your use case." },
  { icon: Shield, title: "No Commitment", desc: "Free assessment, no strings attached." },
];

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Get in Touch</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Contact Us</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Interested in AETHER? Reach out directly by email and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Email CTA */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="p-8 rounded-2xl border border-border bg-card">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-foreground/60" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Send us an email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us about your needs and we'll respond with a personalized proposal.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=AETHER — I'd like to learn more`}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium text-primary-foreground bg-foreground rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 active:scale-[0.97] group"
            >
              {EMAIL}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </section>

      {/* Why reach out */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-8">What to expect</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {reasons.map((r) => (
              <div key={r.title} className="p-6 rounded-2xl border border-border bg-card text-center transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <r.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{r.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4">Frequently Asked</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight text-center mb-10">Common Questions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10">
                <h3 className="text-sm font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
