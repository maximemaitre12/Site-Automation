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
      { label: "All Products", href: "/products", description: "Explore our AI modules" },
      { label: "Documentation", href: "/resources/documentation", description: "Learn how to use AETHER" },
      { label: "API Reference", href: "/resources/api", description: "Build integrations" },
      { label: "System Status", href: "/resources/status", description: "Service availability" },
    ]
  },
  company: {
    label: "Company",
    items: [
      { label: "About Us", href: "/about", description: "Our story & mission" },
      { label: "Blog", href: "/blog", description: "News & insights" },
      { label: "Careers", href: "/careers", description: "Join the team" },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ${
      scrolled ? "border-b border-border shadow-sm" : ""
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={aetherLogo} alt="Aether" className="h-14 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {Object.entries(navSections).map(([key, section]) => (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">
                    {section.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    {section.label}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {section.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex flex-col items-start gap-0.5 cursor-pointer">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 max-h-[80vh] overflow-y-auto">
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
