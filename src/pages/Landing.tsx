
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemsSection } from "@/components/landing/consulting/ProblemsSection";
import { ImpactSection } from "@/components/landing/consulting/ImpactSection";
import { PositioningSection } from "@/components/landing/consulting/PositioningSection";
import { DifferentiationSection } from "@/components/landing/consulting/DifferentiationSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function Landing() {

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProblemsSection />
      <ImpactSection />
      <PositioningSection />
      <DifferentiationSection />
      <FinalCTASection />
    </div>
  );
}
