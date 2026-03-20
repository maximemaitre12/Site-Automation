import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SupplyHero } from "@/components/supply/SupplyHero";
import { SupplyPainPoints } from "@/components/supply/SupplyPainPoints";
import { SupplyDashboard } from "@/components/supply/SupplyDashboard";
import { SupplyHowItWorks } from "@/components/supply/SupplyHowItWorks";
import { SupplyCaseStudy } from "@/components/supply/SupplyCaseStudy";
import { SupplyCTA } from "@/components/supply/SupplyCTA";

export default function SupplyChain() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <SupplyHero />
        <SupplyPainPoints />
        <SupplyDashboard />
        <SupplyHowItWorks />
        <SupplyCaseStudy />
        <SupplyCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
