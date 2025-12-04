import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ToolsShowcase } from "@/components/landing/ToolsShowcase";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ToolsShowcase />
      
      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 AETHER AI Suite. Automate Everything. Empower Everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}