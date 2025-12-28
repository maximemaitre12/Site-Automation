import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, FileText } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information You Provide",
        text: "When you create an account, request a demo, or contact us, we collect information such as your name, email address, company name, job title, and any other information you choose to provide."
      },
      {
        subtitle: "Automatically Collected Information",
        text: "We automatically collect certain information when you use our services, including IP address, browser type, device information, pages visited, and usage patterns. This helps us improve our services and ensure security."
      },
      {
        subtitle: "Information from Third Parties",
        text: "We may receive information from partners, integrations you connect, and publicly available sources to enhance our services and provide you with a better experience."
      }
    ]
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "Service Delivery",
        text: "We use your information to provide, maintain, and improve AETHER services, including processing your requests, managing your account, and providing customer support."
      },
      {
        subtitle: "Communication",
        text: "We may use your email to send you service updates, security alerts, and marketing communications (which you can opt out of at any time)."
      },
      {
        subtitle: "Analytics & Improvement",
        text: "We analyze usage patterns to improve our platform, develop new features, and ensure optimal performance. This analysis is conducted on aggregated, anonymized data whenever possible."
      },
      {
        subtitle: "Legal & Security",
        text: "We may use information to comply with legal obligations, enforce our terms of service, and protect the security of our platform and users."
      }
    ]
  },
  {
    icon: UserCheck,
    title: "3. Data Sharing & Disclosure",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        text: "AETHER does not sell, rent, or trade your personal information to third parties for their marketing purposes."
      },
      {
        subtitle: "Service Providers",
        text: "We work with trusted service providers (hosting, analytics, customer support) who process data on our behalf under strict confidentiality agreements."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information when required by law, court order, or to protect the rights, property, or safety of AETHER, our users, or others."
      },
      {
        subtitle: "Business Transfers",
        text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred to the acquiring entity with continued privacy protections."
      }
    ]
  },
  {
    icon: Lock,
    title: "4. Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We employ industry-leading security practices to protect your information."
      },
      {
        subtitle: "Access Controls",
        text: "We implement strict access controls, ensuring only authorized personnel can access user data, and only when necessary for their job functions."
      },
      {
        subtitle: "Security Audits",
        text: "We regularly conduct security assessments, penetration testing, and maintain SOC 2 Type II compliance to ensure the highest level of security."
      }
    ]
  },
  {
    icon: Globe,
    title: "5. International Data Transfers",
    content: [
      {
        subtitle: "Data Location",
        text: "AETHER operates globally with data centers in the European Union. Data may be processed in different jurisdictions depending on your location and service requirements."
      },
      {
        subtitle: "Transfer Safeguards",
        text: "When transferring data internationally, we use Standard Contractual Clauses (SCCs) and other approved mechanisms to ensure adequate protection."
      }
    ]
  },
  {
    icon: FileText,
    title: "6. Your Rights & Choices",
    content: [
      {
        subtitle: "Access & Portability",
        text: "You have the right to access your personal data and request a copy in a portable format."
      },
      {
        subtitle: "Correction & Deletion",
        text: "You can update your account information or request deletion of your data. Note that some data may be retained for legal or legitimate business purposes."
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly."
      },
      {
        subtitle: "Data Processing Objections",
        text: "You have the right to object to certain processing activities. Contact us to exercise this right."
      }
    ]
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="py-8 md:py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-6">
              Privacy Policy
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 md:mb-4">
              Your privacy is fundamental to how we build and operate AETHER.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Last updated: December 28, 2024 • Effective: December 28, 2024
            </p>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="py-6 md:py-12 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-lg md:text-2xl font-bold text-green-600 mb-0.5 md:mb-1">✓</p>
                <p className="text-xs md:text-sm font-medium text-foreground">No Data Selling</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-lg md:text-2xl font-bold text-blue-600 mb-0.5 md:mb-1">✓</p>
                <p className="text-xs md:text-sm font-medium text-foreground">GDPR Compliant</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
                <p className="text-lg md:text-2xl font-bold text-violet-600 mb-0.5 md:mb-1">✓</p>
                <p className="text-xs md:text-sm font-medium text-foreground">SOC 2 Type II</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                <p className="text-lg md:text-2xl font-bold text-orange-600 mb-0.5 md:mb-1">✓</p>
                <p className="text-xs md:text-sm font-medium text-foreground">Encryption</p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-6 md:mb-12">
                AETHER SAS ("AETHER", "we", "us", or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our enterprise automation platform and related services.
              </p>

              <div className="space-y-6 md:space-y-12">
                {sections.map((section, index) => (
                  <div key={index} className="border-b border-border pb-6 md:pb-12 last:border-0">
                    <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <section.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-foreground m-0">{section.title}</h2>
                    </div>
                    <div className="space-y-4 md:space-y-6 pl-0 md:pl-16">
                      {section.content.map((item, i) => (
                        <div key={i}>
                          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">{item.subtitle}</h3>
                          <p className="text-sm md:text-base text-muted-foreground">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Retention */}
              <div className="mt-6 md:mt-12 p-4 md:p-6 rounded-lg md:rounded-xl bg-muted/50 border border-border">
                <h2 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-4">7. Data Retention</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-2 md:mb-4">
                  We retain your personal data for as long as your account is active or as needed to provide 
                  you services. We will retain and use your information as necessary to comply with legal 
                  obligations, resolve disputes, and enforce our agreements.
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  Upon account deletion, we will delete or anonymize your data within 90 days, except where 
                  retention is required by law or for legitimate business purposes.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mt-4 md:mt-8 p-4 md:p-6 rounded-lg md:rounded-xl bg-muted/50 border border-border">
                <h2 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-4">8. Children's Privacy</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  AETHER is designed for business use and is not intended for children under 16 years of age. 
                  We do not knowingly collect personal information from children. If you believe we have 
                  collected information from a child, please contact us immediately.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="mt-4 md:mt-8 p-4 md:p-6 rounded-lg md:rounded-xl bg-muted/50 border border-border">
                <h2 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-4">9. Changes to This Policy</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  We encourage you to review this policy periodically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8 md:py-16 px-4 bg-muted/30">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4">Questions About Your Privacy?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Our Data Protection Officer is here to help with any privacy-related questions or requests.
            </p>
            <div className="space-y-1.5 md:space-y-2 text-sm md:text-base text-muted-foreground">
              <p><strong className="text-foreground">Email:</strong> privacy@aether-ai.com</p>
              <p><strong className="text-foreground">Data Protection Officer:</strong> dpo@aether-ai.com</p>
              <p><strong className="text-foreground">Response Time:</strong> Within 30 days</p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}