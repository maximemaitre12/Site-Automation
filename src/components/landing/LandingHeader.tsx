import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/resources/documentation" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/legal/privacy" },
];

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
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ${
      scrolled ? "border-b border-border shadow-sm" : ""
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={aetherLogo} alt="Aether" className="h-14 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home - only when not on homepage */}
            {!isHomePage && (
              <Link 
                to="/" 
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                Home
              </Link>
            )}
            
            {/* Results - only on homepage when not scrolled */}
            {isHomePage && !scrolled && (
              <a 
                href="#results" 
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                Results
              </a>
            )}
            
            {/* Main nav links */}
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="sm" className="text-sm">
                Request Demo
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
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4">
            <nav className="flex flex-col gap-1">
              {/* Home link for mobile */}
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Home
                </Link>
              )}
              
              {/* Main nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* CTA buttons */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                <Link to="/auth?mode=login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full text-sm">Log in</Button>
                </Link>
                <Link to="/demo" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full text-sm">Demo</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
