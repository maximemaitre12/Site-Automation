import { PharmaHero } from "@/components/landing/pharma/PharmaHero";
import { PharmaStats } from "@/components/landing/pharma/PharmaStats";
import { PharmaProblems } from "@/components/landing/pharma/PharmaProblems";
import { PharmaTeam } from "@/components/landing/pharma/PharmaTeam";
import { PharmaExpertise } from "@/components/landing/pharma/PharmaExpertise";
import { PharmaMethodology } from "@/components/landing/pharma/PharmaMethodology";
import { PharmaCaseStudy } from "@/components/landing/pharma/PharmaCaseStudy";
import { PharmaPortfolio } from "@/components/landing/pharma/PharmaPortfolio";
import { PharmaTrust } from "@/components/landing/pharma/PharmaTrust";
import { PharmaServices } from "@/components/landing/pharma/PharmaServices";
import { PharmaFAQ } from "@/components/landing/pharma/PharmaFAQ";
import { PharmaResources } from "@/components/landing/pharma/PharmaResources";
import { PharmaFinalCTA } from "@/components/landing/pharma/PharmaFinalCTA";

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <PharmaHero />
      <PharmaStats />
      <div id="challenges"><PharmaProblems /></div>
      <PharmaTeam />
      <PharmaExpertise />
      <div id="methodology"><PharmaMethodology /></div>
      <PharmaCaseStudy />
      <PharmaPortfolio />
      <PharmaTrust />
      <PharmaServices />
      <div id="faq"><PharmaFAQ /></div>
      <PharmaResources />
      <PharmaFinalCTA />
    </div>
  );
}
