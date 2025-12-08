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
        ? "bg-background/80 backdrop-blur-xl border-b border-border/50" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(280_100%_60%)] flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">AETHER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Produit", href: "#tools" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Entreprise", href: "#enterprise" },
              { label: "Ressources", href: "#resources" },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
              >
                Connexion
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                size="sm" 
                className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4"
              >
                Démarrer
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <nav className="flex flex-col gap-1">
              {["Produit", "Tarifs", "Entreprise", "Ressources"].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-border/50">
                <Link to="/auth?mode=login">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Connexion
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="sm" className="w-full bg-foreground text-background">
                    Démarrer
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
