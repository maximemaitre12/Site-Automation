import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Landing page components
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { MetricsSection } from "@/components/landing/MetricsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show landing page only for non-authenticated users
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <MetricsSection />
        <FeaturesSection />
        <BenefitsSection />
        <UseCasesSection />
        <SocialProofSection />
        <CTASection />
      </main>
      
      <LandingFooter />
    </div>
  );
}
