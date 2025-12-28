import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems = [
    { label: "Products", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ${
      scrolled 
        ? "border-b border-border shadow-sm" 
        : ""
    }`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={aetherLogo} alt="Aether" className="h-12 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => 
              isHomePage ? (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link 
                  key={item.label}
                  to={`/${item.href}`} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm">
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-6">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => 
                isHomePage ? (
                  <a 
                    key={item.label} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link 
                    key={item.label} 
                    to={`/${item.href}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link to="/auth?mode=login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-sm">Log in</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button size="sm" className="w-full text-sm">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
