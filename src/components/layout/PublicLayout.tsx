import { Outlet } from "react-router-dom";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FloatingChatbot } from "@/components/landing/FloatingChatbot";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
      <FloatingChatbot />
    </div>
  );
}
}
