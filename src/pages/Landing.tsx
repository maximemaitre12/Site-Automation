import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { HeroSection } from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { ProblemsSection } from "@/components/landing/consulting/ProblemsSection";
import { ImpactSection } from "@/components/landing/consulting/ImpactSection";
import { PositioningSection } from "@/components/landing/consulting/PositioningSection";
import { MethodSection } from "@/components/landing/consulting/MethodSection";
import { TrainingsSection } from "@/components/landing/TrainingsSection";
import { UseCasesSection } from "@/components/landing/consulting/UseCasesSection";
import { DifferentiationSection } from "@/components/landing/consulting/DifferentiationSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="overflow-x-hidden no-scroll-anchoring">
      <HeroSection />
      <PartnersSection />
      <ProblemsSection />
      <ImpactSection />
      <PositioningSection />
      <MethodSection />
      <TrainingsSection />
      <UseCasesSection />
      <DifferentiationSection />
      <FinalCTASection />
    </div>
  );
}
