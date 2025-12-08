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
        ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-lg font-bold text-foreground">AETHER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Fonctionnalités", href: "#features" },
              { label: "Comment ça marche", href: "#how" },
              { label: "Tarifs", href: "#pricing" },
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
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5">
                Essai gratuit
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
          <div className="md:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col gap-2">
              {["Fonctionnalités", "Comment ça marche", "Tarifs"].map((item) => (
                <a key={item} href="#" className="px-3 py-2 text-foreground hover:bg-secondary rounded-lg">
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                <Link to="/auth?mode=login">
                  <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                </Link>
                <Link to="/demo">
                  <Button size="sm" className="w-full bg-foreground text-background">
                    Essai gratuit
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
