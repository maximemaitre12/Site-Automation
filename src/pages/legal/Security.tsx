import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Shield, Lock, Eye, Server, CheckCircle } from "lucide-react";

const features = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data is encrypted in transit and at rest with industry-standard protocols." },
  { icon: Shield, title: "Security Audits", description: "Regular security assessments to verify our controls meet industry standards." },
  { icon: Eye, title: "Access Controls", description: "Role-based permissions and SSO integration for enterprise security." },
  { icon: Server, title: "Data Residency", description: "Choose where your data is stored with EU and US data center options." }
];

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-20 pb-16">
        <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3 sm:mb-4">
            Security at{" "}
            <span className="text-primary">AETHER</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data security is our top priority. We implement enterprise-grade security measures to protect your information.
          </p>
        </section>
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-border bg-card">
                <f.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}