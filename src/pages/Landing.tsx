import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { HeroSection } from "@/components/landing/HeroSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { ApiSection } from "@/components/landing/ApiSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { BlogSection } from "@/components/landing/BlogSection";
import { ContactSection } from "@/components/landing/ContactSection";

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
      <DemoSection />
      <PainPointsSection />
      <ApiSection />
      <BlogSection />
      <FinalCTASection />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
}
