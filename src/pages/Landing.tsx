import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { HeroSection } from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { ProblemsSection } from "@/components/landing/consulting/ProblemsSection";
import { ImpactSection } from "@/components/landing/consulting/ImpactSection";
import { PositioningSection } from "@/components/landing/consulting/PositioningSection";
import { UseCasesSection } from "@/components/landing/consulting/UseCasesSection";
import { DifferentiationSection } from "@/components/landing/consulting/DifferentiationSection";
import { TrainingsSection } from "@/components/landing/TrainingsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
...
      <DifferentiationSection />
      <TrainingsSection />
      <FinalCTASection />
    </div>
  );
}
