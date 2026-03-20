import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const navLinks = [
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
          
          {/* Desktop CTA - Hierarchy: Demo (primary) > Login (tertiary) */}
          <div className="hidden md:flex items-center gap-3">
            {!isHomePage && (
              <Link to="/auth?mode=login">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Log in
                </span>
              </Link>
            )}
            <Link to="/demo">
              <button className="relative px-5 py-2 text-sm font-medium text-primary-foreground rounded-full bg-gradient-to-r from-primary via-violet-500 to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] group flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request Demo</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </Link>
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
              {/* Home link for mobile */}
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 px-4 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
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
                  className="py-2.5 px-4 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* CTA buttons */}
              <div className="flex flex-col gap-2 pt-4 mt-3 border-t border-border">
                {!isHomePage && (
                  <Link to="/auth?mode=login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-2.5 px-4 text-sm font-medium text-foreground rounded-xl border border-border bg-transparent hover:bg-muted transition-all">
                      Log in
                    </button>
                  </Link>
                )}
                <Link to="/demo" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-2.5 px-4 text-sm font-medium text-primary-foreground rounded-xl bg-gradient-to-r from-primary to-violet-500 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Request Demo
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
