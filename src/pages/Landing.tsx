import { PharmaHero } from "@/components/landing/pharma/PharmaHero";
import { PharmaStats } from "@/components/landing/pharma/PharmaStats";
import { PharmaProblems } from "@/components/landing/pharma/PharmaProblems";
import { PharmaTeam } from "@/components/landing/pharma/PharmaTeam";
import { PharmaExpertise } from "@/components/landing/pharma/PharmaExpertise";
import { PharmaMethodology } from "@/components/landing/pharma/PharmaMethodology";
import { PharmaCaseStudy } from "@/components/landing/pharma/PharmaCaseStudy";
import { PharmaTrust } from "@/components/landing/pharma/PharmaTrust";
import { PharmaFAQ } from "@/components/landing/pharma/PharmaFAQ";
import { PharmaFinalCTA } from "@/components/landing/pharma/PharmaFinalCTA";

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <PharmaHero />
      <PharmaStats />
      <PharmaProblems />
      <PharmaTeam />
      <PharmaExpertise />
      <PharmaMethodology />
      <PharmaCaseStudy />
      <PharmaTrust />
      <PharmaFAQ />
      <PharmaFinalCTA />
    </div>
  );
}
