import { Menu, X, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/resources/documentation" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/legal/privacy" },
];

const EMAIL = "maxime.maitre@edu.em-lyon.com";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isSupplyPage = location.pathname === "/supply";

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
            {!isSupplyPage && (
              <Link 
                to="/" 
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                Home
              </Link>
            )}
            
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
          
          {/* Desktop CTA - Email */}
          <div className="hidden md:flex items-center gap-3">
            {isSupplyPage && (
              <Link to="/auth?mode=login">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Log in
                </span>
              </Link>
            )}
            <a
              href={`mailto:${EMAIL}?subject=AETHER — Contact`}
              className="relative px-5 py-2 text-sm font-medium text-primary-foreground rounded-full bg-foreground hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg active:scale-[0.97] flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border shadow-xl py-4 px-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {!isSupplyPage && (
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 px-4 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Home
                </Link>
              )}
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 px-4 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col gap-2 pt-4 mt-3 border-t border-border">
                {isSupplyPage && (
                  <Link to="/auth?mode=login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-2.5 px-4 text-sm font-medium text-foreground rounded-xl border border-border bg-transparent hover:bg-muted transition-all">
                      Log in
                    </button>
                  </Link>
                )}
                <a
                  href={`mailto:${EMAIL}?subject=AETHER — Contact`}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-primary-foreground rounded-xl bg-foreground flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
