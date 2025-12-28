import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 28, 2024</p>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section><h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2><p className="text-muted-foreground">We collect information you provide directly, including name, email, company information, and usage data to improve our services.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2><p className="text-muted-foreground">We use collected data to provide and improve AETHER services, communicate with you, and ensure platform security.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">3. Data Sharing</h2><p className="text-muted-foreground">We do not sell your personal data. We may share data with service providers who assist in operating our platform under strict confidentiality agreements.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">4. Data Retention</h2><p className="text-muted-foreground">We retain your data for as long as your account is active or as needed to provide services and comply with legal obligations.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">5. Your Rights</h2><p className="text-muted-foreground">You have the right to access, correct, delete, or export your personal data. Contact us at privacy@aether-ai.com for requests.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">6. Contact Us</h2><p className="text-muted-foreground">For privacy-related inquiries, contact our Data Protection Officer at privacy@aether-ai.com.</p></section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}