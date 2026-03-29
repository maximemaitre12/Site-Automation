import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={aetherLogo} alt="Aether" className="h-14 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center">
            <Link
              to="/auth?mode=login&redirect=/farmasoft"
              className="px-5 py-2 text-sm font-medium text-white rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.97]"
            >
              Log in
            </Link>
          </div>
          
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border shadow-xl py-4 px-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              <div className="pt-2">
                <Link
                  to="/auth?mode=login&redirect=/farmasoft"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white rounded-xl bg-blue-600 flex items-center justify-center"
                >
                  Log in
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
