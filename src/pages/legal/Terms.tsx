import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FileText, Scale, UserCheck, Shield, AlertTriangle, Gavel, Globe, Mail } from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    title: "1. Acceptance of Terms",
    content: `By accessing or using AETHER services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, you may not access or use the Services. We reserve the right to modify these Terms at any time. Continued use of the Services after modifications constitutes acceptance of the updated Terms.`
  },
  {
    icon: FileText,
    title: "2. Description of Services",
    content: `AETHER provides an enterprise AI automation platform that includes workflow automation, document processing, sales intelligence, HR management, customer support tools, and related services.

We continuously improve and update our Services. We reserve the right to modify, suspend, or discontinue any part of the Services at any time, with reasonable notice when possible. We are not liable for any modification, suspension, or discontinuation of the Services.`
  },
  {
    icon: Shield,
    title: "3. User Accounts & Security",
    content: `To access certain features, you must create an account. You agree to:
    
• Provide accurate and complete registration information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account

We implement industry-standard security measures but cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your access credentials.`
  },
  {
    icon: Scale,
    title: "4. Acceptable Use",
    content: `You agree to use the Services only for lawful purposes and in accordance with these Terms. You may not:

• Violate any applicable laws or regulations
• Infringe upon intellectual property rights of others
• Upload malicious code or attempt to compromise our systems
• Use the Services to send spam or unsolicited communications
• Attempt to reverse engineer or decompile the Services
• Resell or redistribute the Services without authorization
• Use the Services to process data that violates privacy laws
• Interfere with the proper functioning of the Services

Violation of these terms may result in immediate termination of your account.`
  },
  {
    icon: FileText,
    title: "5. Intellectual Property",
    content: `AETHER and its licensors retain all rights, title, and interest in and to the Services, including all intellectual property rights. The Services are protected by copyright, trademark, and other laws.

You retain ownership of data you upload to the Services ("Your Content"). By using the Services, you grant AETHER a limited license to process Your Content solely to provide the Services.

The AETHER name, logo, and all related marks are trademarks of AETHER SAS. You may not use these marks without our prior written consent.`
  },
  {
    icon: AlertTriangle,
    title: "6. Disclaimers & Limitations",
    content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

We do not warrant that the Services will be uninterrupted, error-free, or secure. We are not responsible for any AI-generated outputs or decisions made based on such outputs.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, AETHER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.

Our total liability for any claims arising from or related to these Terms or the Services shall not exceed the amounts paid by you in the twelve (12) months preceding the claim.`
  },
  {
    icon: Gavel,
    title: "7. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless AETHER, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, and expenses (including reasonable legal fees) arising from:

• Your use of the Services
• Your violation of these Terms
• Your violation of any rights of another party
• Your Content uploaded to the Services

We will provide you with prompt notice of any such claim and reasonable assistance in defending against it.`
  },
  {
    icon: Globe,
    title: "8. Governing Law & Jurisdiction",
    content: `These Terms shall be governed by and construed in accordance with the laws of France, without regard to conflict of law principles.

Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction of the courts of Paris, France.

For users in the European Union, nothing in these Terms affects your rights under applicable consumer protection laws in your country of residence.`
  }
];

const additionalSections = [
  {
    title: "9. Service Level Agreement",
    content: "AETHER commits to 99.9% uptime for enterprise customers. Scheduled maintenance will be communicated at least 48 hours in advance. Unscheduled downtime lasting more than 4 consecutive hours may qualify for service credits under our SLA policy."
  },
  {
    title: "10. Data Processing",
    content: "For enterprise customers processing personal data through our Services, we offer a Data Processing Agreement (DPA) that complies with GDPR and other applicable data protection regulations. Contact us to request a DPA."
  },
  {
    title: "11. Termination",
    content: "Either party may terminate these Terms at any time. Upon termination, your right to access the Services will cease immediately. We will make your data available for export for 30 days following termination. After this period, your data will be deleted in accordance with our retention policies."
  },
  {
    title: "12. Force Majeure",
    content: "Neither party shall be liable for any failure or delay in performance due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, or accidents."
  },
  {
    title: "13. Entire Agreement",
    content: "These Terms, together with our Privacy Policy and any applicable order forms or service agreements, constitute the entire agreement between you and AETHER regarding the Services. Any prior agreements or understandings are superseded."
  },
  {
    title: "14. Severability",
    content: "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect."
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3 sm:mb-4">
              Terms of{" "}
              <span className="text-primary">Service</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 md:mb-4">
              The legal agreement governing your use of AETHER services.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Last updated: December 28, 2024 • Effective: December 28, 2024
            </p>
          </div>
        </section>

        {/* Key Points */}
        <section className="py-12 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Quick Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-card border border-border">
                <Scale className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Fair Use</h3>
                <p className="text-sm text-muted-foreground">Use our services lawfully and respect intellectual property rights.</p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Data Ownership</h3>
                <p className="text-sm text-muted-foreground">You retain full ownership of your data. We only process it to provide our services.</p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <Gavel className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">French Law</h3>
                <p className="text-sm text-muted-foreground">These terms are governed by French law with jurisdiction in Paris.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                Welcome to AETHER. These Terms of Service ("Terms") govern your access to and use of our 
                enterprise AI automation platform. Please read them carefully before using our services.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={index} className="border-b border-border pb-12 last:border-0">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground m-0">{section.title}</h2>
                    </div>
                    <div className="pl-16">
                      <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
                    </div>
                  </div>
                ))}

                {/* Additional Sections */}
                {additionalSections.map((section, index) => (
                  <div key={index} className="border-b border-border pb-12 last:border-0">
                    <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                    <p className="text-muted-foreground">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
            <p className="text-muted-foreground mb-6">
              Our legal team is available to clarify any aspect of these Terms of Service.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">Legal Inquiries:</strong> legal@aether-ai.com</p>
              <p><strong className="text-foreground">General Support:</strong> support@aether-ai.com</p>
            </div>
            <div className="mt-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> These Terms of Service are a binding legal agreement. 
                If you require modifications for enterprise agreements, please contact our legal team.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}