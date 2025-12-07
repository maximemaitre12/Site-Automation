import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AETHER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ressources
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Entreprise
            </Link>
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="hero" size="sm">
                Demander une démo
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground py-2">
                Fonctionnalités
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground py-2">
                Tarifs
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground py-2">
                Ressources
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground py-2">
                Entreprise
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                <Link to="/auth?mode=login">
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/demo">
                  <Button variant="hero" className="w-full">Demander une démo</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
