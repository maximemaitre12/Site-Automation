import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const navItems = [
  { label: "Expertise", href: "#problems" },
  { label: "Services", href: "#methodology" },
  { label: "Cas d'Étude", href: "#case-study" },
  { label: "Technologie", href: "#tech" },
  { label: "À propos", href: "#trust" },
];

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{ background: scrolled ? "rgba(250,251,252,0.97)" : "#FAFBFC", height: 70, borderBottom: scrolled ? "1px solid #E8EFF8" : "none" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={aetherLogo} alt="Aether Connect" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "#2C3E50" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth?mode=login&redirect=/farmasoft"
            className="text-sm font-medium px-4 py-2 rounded-md transition-colors"
            style={{ color: "#0033CC" }}
          >
            Log in
          </Link>
          <Link
            to="/contact"
            className="text-sm font-bold px-5 py-2.5 rounded-md text-white transition-all hover:shadow-lg active:scale-[0.97]"
            style={{ background: "#FF6B35" }}
          >
            Audit Gratuit
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ color: "#2C3E50" }}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 border-b shadow-xl py-4 px-6 animate-fade-in" style={{ background: "#FAFBFC", borderColor: "#E8EFF8" }}>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium py-2"
                style={{ color: "#2C3E50" }}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 px-4 text-sm font-bold text-white rounded-md text-center mt-2"
              style={{ background: "#FF6B35" }}
            >
              Audit Gratuit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
