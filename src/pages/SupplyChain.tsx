import { SupplyHero } from "@/components/supply/SupplyHero";
import { SupplyPainPoints } from "@/components/supply/SupplyPainPoints";
import { SupplyDashboard } from "@/components/supply/SupplyDashboard";
import { SupplyHowItWorks } from "@/components/supply/SupplyHowItWorks";
import { SupplyCaseStudy } from "@/components/supply/SupplyCaseStudy";
import { SupplyCTA } from "@/components/supply/SupplyCTA";

export default function SupplyChain() {
  return (
    <>
      <SupplyHero />
      <SupplyPainPoints />
      <SupplyDashboard />
      <SupplyHowItWorks />
      <SupplyCaseStudy />
      <SupplyCTA />
    </>
  );
}
