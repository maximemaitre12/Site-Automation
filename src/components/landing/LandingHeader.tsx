import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border" 
        : "bg-transparent"
    }`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-foreground">AETHER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Produit", href: "#product" },
              { label: "Fonctionnalités", href: "#features" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Entreprise", href: "#enterprise" },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="sm" className="text-sm bg-foreground text-background hover:bg-foreground/90">
                Commencer
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
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {["Produit", "Fonctionnalités", "Tarifs", "Entreprise"].map((item) => (
                <a key={item} href="#" className="text-sm text-foreground">
                  {item}
                </a>
              ))}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link to="/auth?mode=login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-sm">Se connecter</Button>
                </Link>
                <Link to="/demo" className="flex-1">
                  <Button size="sm" className="w-full text-sm bg-foreground text-background">Commencer</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
