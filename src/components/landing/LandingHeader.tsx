import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navSections = {
  platform: {
    label: "Platform",
    items: [
      { label: "Documentation", href: "/resources/documentation", description: "Learn how to use AETHER" },
    ]
  },
  company: {
    label: "Company",
    items: [
      { label: "About Us", href: "/about", description: "Our story & mission" },
      { label: "Blog", href: "/blog", description: "News & insights" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ]
  },
  trust: {
    label: "Trust",
    items: [
      { label: "Security", href: "/legal/security", description: "How we protect your data" },
      { label: "Privacy Policy", href: "/legal/privacy", description: "Your data, your rights" },
      { label: "Terms of Service", href: "/legal/terms", description: "Usage agreement" },
    ]
  }
};

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={aetherLogo} alt="Aether" className="h-14 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Home link - only visible when NOT on homepage */}
            {!isHomePage && (
              <Link 
                to="/" 
                className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                Home
              </Link>
            )}
            
            {/* Results link - only visible on homepage when not scrolled */}
            {isHomePage && !scrolled && (
              <a 
                href="#results" 
                className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                Results
              </a>
            )}
            
            {/* Platform */}
            <Link to="/resources/documentation" className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
              Docs
            </Link>
            
            {/* Company */}
            <Link to="/about" className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
              About
            </Link>
            <Link to="/blog" className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
              Blog
            </Link>
            <Link to="/contact" className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
              Contact
            </Link>
            
            {/* Trust */}
            <Link to="/legal/security" className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
              Security
            </Link>
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
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
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col gap-4">
              {Object.entries(navSections).map(([key, section]) => (
                <div key={key}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {section.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="py-2 px-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4 border-t border-border">
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
