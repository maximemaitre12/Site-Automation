import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Shield, Lock, Eye, Server, CheckCircle } from "lucide-react";

const features = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256)." },
  { icon: Shield, title: "SOC 2 Type II Certified", description: "Annual audits verify our security controls meet industry standards." },
  { icon: Eye, title: "Access Controls", description: "Role-based permissions and SSO integration for enterprise security." },
  { icon: Server, title: "Data Residency", description: "Choose where your data is stored with EU and US data center options." }
];

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-20 pb-16">
        <section className="py-16 px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Security at <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AETHER</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Your data security is our top priority. We implement enterprise-grade security measures to protect your information.</p>
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
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">Compliance & Certifications</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {["SOC 2 Type II", "GDPR", "ISO 27001", "HIPAA Ready"].map((cert) => (
                <div key={cert} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="w-4 h-4" />{cert}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}