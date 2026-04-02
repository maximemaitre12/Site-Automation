import { PharmaHero } from "@/components/landing/pharma/PharmaHero";
import { PharmaStats } from "@/components/landing/pharma/PharmaStats";
import { PharmaProblems } from "@/components/landing/pharma/PharmaProblems";
import { PharmaMethodology } from "@/components/landing/pharma/PharmaMethodology";
import { PharmaCaseStudy } from "@/components/landing/pharma/PharmaCaseStudy";
import { PharmaPortfolio } from "@/components/landing/pharma/PharmaPortfolio";
import { PharmaTrust } from "@/components/landing/pharma/PharmaTrust";
import { PharmaTechStack } from "@/components/landing/pharma/PharmaTechStack";
import { PharmaFAQ } from "@/components/landing/pharma/PharmaFAQ";
import { PharmaTestimonials } from "@/components/landing/pharma/PharmaTestimonials";
import { PharmaFinalCTA } from "@/components/landing/pharma/PharmaFinalCTA";

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <PharmaHero />
      <PharmaStats />
      <div id="problems"><PharmaProblems /></div>
      <div id="methodology"><PharmaMethodology /></div>
      <PharmaCaseStudy />
      <PharmaPortfolio />
      <div id="trust"><PharmaTrust /></div>
      <div id="tech"><PharmaTechStack /></div>
      <div id="faq"><PharmaFAQ /></div>
      <PharmaTestimonials />
      <PharmaFinalCTA />
    </div>
  );
}
