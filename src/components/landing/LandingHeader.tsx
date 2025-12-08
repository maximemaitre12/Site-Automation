import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/90 backdrop-blur-xl border-b border-border/50" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(280_100%_60%)] to-[hsl(220_100%_60%)] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(280_100%_60%)] via-[hsl(250_100%_60%)] to-[hsl(220_100%_60%)] flex items-center justify-center">
                <span className="text-lg font-bold text-white">A</span>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">AETHER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Produit", href: "#tools" },
              { label: "Solutions", href: "#solutions" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Entreprise", href: "#enterprise" },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
              >
                Connexion
              </Button>
            </Link>
            <Link to="/demo">
              <Button className="bg-gradient-to-r from-[hsl(280_100%_60%)] to-[hsl(250_100%_60%)] hover:from-[hsl(280_100%_65%)] hover:to-[hsl(250_100%_65%)] text-white border-0 shadow-lg shadow-[hsl(250_100%_60%/0.25)]">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <nav className="flex flex-col gap-2">
              {["Produit", "Solutions", "Tarifs", "Entreprise"].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border/50">
                <Link to="/auth?mode=login">
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/demo">
                  <Button className="w-full bg-gradient-to-r from-[hsl(280_100%_60%)] to-[hsl(250_100%_60%)] text-white border-0">
                    Commencer gratuitement
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
