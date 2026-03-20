import { Scale, Shield, Gavel } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using AETHER services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, you may not access or use the Services. We reserve the right to modify these Terms at any time.`
  },
  {
    title: "2. Description of Services",
    content: `AETHER provides an enterprise AI automation platform that includes workflow automation, document processing, sales intelligence, HR management, customer support tools, and related services.

We continuously improve and update our Services. We reserve the right to modify, suspend, or discontinue any part of the Services at any time, with reasonable notice when possible.`
  },
  {
    title: "3. User Accounts & Security",
    content: `To access certain features, you must create an account. You agree to:
    
• Provide accurate and complete registration information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account`
  },
  {
    title: "4. Acceptable Use",
    content: `You agree to use the Services only for lawful purposes and in accordance with these Terms. You may not:

• Violate any applicable laws or regulations
• Infringe upon intellectual property rights of others
• Upload malicious code or attempt to compromise our systems
• Use the Services to send spam or unsolicited communications
• Attempt to reverse engineer or decompile the Services
• Resell or redistribute the Services without authorization`
  },
  {
    title: "5. Intellectual Property",
    content: `AETHER and its licensors retain all rights, title, and interest in and to the Services, including all intellectual property rights.

You retain ownership of data you upload to the Services ("Your Content"). By using the Services, you grant AETHER a limited license to process Your Content solely to provide the Services.`
  },
  {
    title: "6. Disclaimers & Limitations",
    content: `The Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Services will be uninterrupted, error-free, or secure.

Our total liability for any claims arising from or related to these Terms or the Services shall not exceed the amounts paid by you in the twelve (12) months preceding the claim.`
  },
  {
    title: "7. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless AETHER, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, and expenses arising from your use of the Services, your violation of these Terms, or your violation of any rights of another party.`
  },
  {
    title: "8. Governing Law & Jurisdiction",
    content: `These Terms shall be governed by and construed in accordance with the laws of France. Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction of the courts of Paris, France.`
  }
];

const additionalSections = [
  { title: "9. Service Level Agreement", content: "AETHER commits to 99.9% uptime for enterprise customers. Scheduled maintenance will be communicated at least 48 hours in advance." },
  { title: "10. Data Processing", content: "For enterprise customers processing personal data through our Services, we offer a Data Processing Agreement (DPA) that complies with GDPR." },
  { title: "11. Termination", content: "Either party may terminate these Terms at any time. Upon termination, we will make your data available for export for 30 days." },
  { title: "12. Force Majeure", content: "Neither party shall be liable for any failure or delay in performance due to circumstances beyond its reasonable control." },
  { title: "13. Entire Agreement", content: "These Terms, together with our Privacy Policy and any applicable order forms, constitute the entire agreement between you and AETHER regarding the Services." },
  { title: "14. Severability", content: "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary." },
];

export default function Terms() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Legal</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Terms of Service</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The legal agreement governing your use of AETHER services.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">Last updated: December 28, 2024</p>
        </div>
      </section>

      {/* Key Points */}
      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card">
              <Scale className="w-6 h-6 text-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Fair Use</h3>
              <p className="text-xs text-muted-foreground">Use our services lawfully and respect intellectual property rights.</p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card">
              <Shield className="w-6 h-6 text-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Data Ownership</h3>
              <p className="text-xs text-muted-foreground">You retain full ownership of your data.</p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card">
              <Gavel className="w-6 h-6 text-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">French Law</h3>
              <p className="text-xs text-muted-foreground">Governed by French law, jurisdiction in Paris.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            Welcome to AETHER. These Terms of Service govern your access to and use of our 
            enterprise AI automation platform. Please read them carefully before using our services.
          </p>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
            {additionalSections.map((section, index) => (
              <div key={index} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Questions?</p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">Legal Inquiries</h2>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>legal@aether-ai.com</p>
            <p>support@aether-ai.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
