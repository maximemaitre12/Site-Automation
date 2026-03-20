const sections = [
  {
    title: "1. Information We Collect",
    items: [
      { subtitle: "Information You Provide", text: "When you create an account, request a demo, or contact us, we collect information such as your name, email address, company name, job title, and any other information you choose to provide." },
      { subtitle: "Automatically Collected Information", text: "We automatically collect certain information when you use our services, including IP address, browser type, device information, pages visited, and usage patterns." },
      { subtitle: "Information from Third Parties", text: "We may receive information from partners, integrations you connect, and publicly available sources to enhance our services." },
    ]
  },
  {
    title: "2. How We Use Your Information",
    items: [
      { subtitle: "Service Delivery", text: "We use your information to provide, maintain, and improve AETHER services, including processing your requests and providing customer support." },
      { subtitle: "Communication", text: "We may use your email to send you service updates, security alerts, and marketing communications (which you can opt out of at any time)." },
      { subtitle: "Analytics & Improvement", text: "We analyze usage patterns to improve our platform. This analysis is conducted on aggregated, anonymized data whenever possible." },
      { subtitle: "Legal & Security", text: "We may use information to comply with legal obligations, enforce our terms of service, and protect the security of our platform." },
    ]
  },
  {
    title: "3. Data Sharing & Disclosure",
    items: [
      { subtitle: "We Do Not Sell Your Data", text: "AETHER does not sell, rent, or trade your personal information to third parties for their marketing purposes." },
      { subtitle: "Service Providers", text: "We work with trusted service providers who process data on our behalf under strict confidentiality agreements." },
      { subtitle: "Legal Requirements", text: "We may disclose information when required by law, court order, or to protect the rights and safety of AETHER and our users." },
    ]
  },
  {
    title: "4. Data Security",
    items: [
      { subtitle: "Encryption", text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption." },
      { subtitle: "Access Controls", text: "We implement strict access controls, ensuring only authorized personnel can access user data." },
      { subtitle: "Security Audits", text: "We regularly conduct security assessments, penetration testing, and maintain SOC 2 Type II compliance." },
    ]
  },
  {
    title: "5. International Data Transfers",
    items: [
      { subtitle: "Data Location", text: "AETHER operates globally with data centers in the European Union." },
      { subtitle: "Transfer Safeguards", text: "When transferring data internationally, we use Standard Contractual Clauses and other approved mechanisms." },
    ]
  },
  {
    title: "6. Your Rights & Choices",
    items: [
      { subtitle: "Access & Portability", text: "You have the right to access your personal data and request a copy in a portable format." },
      { subtitle: "Correction & Deletion", text: "You can update your account information or request deletion of your data." },
      { subtitle: "Opt-Out", text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails." },
    ]
  },
];

const highlights = ["No Data Selling", "GDPR Compliant", "SOC 2 Type II", "End-to-End Encryption"];

export default function Privacy() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Legal</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Privacy Policy</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Your privacy is fundamental to how we build and operate AETHER.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">Last updated: December 28, 2024</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((h) => (
              <span key={h} className="px-4 py-2 rounded-full text-xs font-medium bg-secondary text-foreground/70 border border-border">
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            AETHER SAS ("AETHER", "we", "us", or "our") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our enterprise automation platform and related services.
          </p>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="text-lg font-semibold text-foreground mb-5">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{item.subtitle}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">7. Data Retention</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We retain your personal data for as long as your account is active or as needed to provide services. Upon account deletion, we will delete or anonymize your data within 90 days.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">8. Children's Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AETHER is designed for business use and is not intended for children under 16 years of age.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Questions?</p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">Privacy Inquiries</h2>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>privacy@aether-ai.com</p>
            <p>dpo@aether-ai.com</p>
            <p className="text-xs text-muted-foreground/60 mt-3">Response within 30 days</p>
          </div>
        </div>
      </section>
    </div>
  );
}
