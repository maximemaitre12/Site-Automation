import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 28, 2024</p>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section><h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2><p className="text-muted-foreground">By accessing AETHER, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">2. Use License</h2><p className="text-muted-foreground">We grant you a limited, non-exclusive license to use AETHER services for your business automation needs.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">3. User Responsibilities</h2><p className="text-muted-foreground">You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">4. Service Availability</h2><p className="text-muted-foreground">We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">5. Intellectual Property</h2><p className="text-muted-foreground">AETHER and its original content, features, and functionality are owned by AETHER and are protected by international copyright and trademark laws.</p></section>
            <section><h2 className="text-2xl font-semibold text-foreground">6. Limitation of Liability</h2><p className="text-muted-foreground">AETHER shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.</p></section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}