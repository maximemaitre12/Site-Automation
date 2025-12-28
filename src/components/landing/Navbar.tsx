import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={aetherLogo} alt="Aether" className="h-9 w-auto" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Products
          </a>
          <a href="#results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Results
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}