import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Landing page components
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { ApiSection } from "@/components/landing/ApiSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { BlogSection } from "@/components/landing/BlogSection";
import { ContactSection } from "@/components/landing/ContactSection";

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
    <div className="min-h-screen bg-background overflow-x-hidden no-scroll-anchoring">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <PainPointsSection />
        <ApiSection />
        <BlogSection />
        <ContactSection />
        <FinalCTASection />
        <TestimonialSection />
      </main>
      
      <LandingFooter />
    </div>
  );
}
