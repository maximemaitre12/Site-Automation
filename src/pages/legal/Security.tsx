import { Lock, Shield, Eye, Server } from "lucide-react";

const features = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data is encrypted in transit and at rest with industry-standard protocols." },
  { icon: Shield, title: "Security Audits", description: "Regular security assessments to verify our controls meet industry standards." },
  { icon: Eye, title: "Access Controls", description: "Role-based permissions and SSO integration for enterprise security." },
  { icon: Server, title: "Data Residency", description: "Choose where your data is stored with EU and US data center options." },
];

export default function Security() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Trust & Security</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Security at AETHER</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Your data security is our top priority. We implement enterprise-grade security measures to protect your information.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-foreground/60" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
