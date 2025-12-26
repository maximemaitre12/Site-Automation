import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">AETHER AI</span>
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