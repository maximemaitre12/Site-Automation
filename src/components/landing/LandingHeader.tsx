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
        ? "bg-background/60 backdrop-blur-2xl border-b border-border/20" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-[hsl(260_100%_65%)] to-primary rotate-0 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-[2px] rounded-[10px] bg-background flex items-center justify-center">
                <span className="text-lg font-black text-gradient">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">AETHER</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase -mt-0.5">AI Suite</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Produit", href: "#tools" },
              { label: "Solutions", href: "#solutions" },
              { label: "Ressources", href: "#" },
              { label: "Tarifs", href: "#" },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-1/2 transition-all duration-300" />
              </a>
            ))}
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">
                Se connecter
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                size="sm" 
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-5 rounded-full"
              >
                Commencer
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/20 animate-fade-in bg-background/95 backdrop-blur-xl">
            <nav className="flex flex-col gap-1">
              {["Produit", "Solutions", "Ressources", "Tarifs"].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border/20">
                <Link to="/auth?mode=login">
                  <Button variant="outline" className="w-full rounded-full">Se connecter</Button>
                </Link>
                <Link to="/demo">
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                    Commencer
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
