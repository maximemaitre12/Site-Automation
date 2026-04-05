import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const navItems = [
  { label: "Expertise", href: "#expertise" },
  { label: "Cas d'Étude", href: "#case-study" },
  { label: "Ressources", href: "#resources" },
  { label: "À propos", href: "#team" },
  { label: "Contact", href: "/contact" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "shadow-lg backdrop-blur-md" : ""}`}
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        height: 80,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={aetherLogo} alt="Aether Connect" className="h-12 w-auto rounded-lg" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-[#0891B2]" : "text-white/90 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-[#0891B2]" : "text-white/90 hover:text-white"}`}
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth?mode=login&redirect=/farmasoft"
            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${scrolled ? "text-gray-600 hover:text-[#0891B2]" : "text-white/80 hover:text-white"}`}
          >
            Log in
          </Link>
          <Link
            to="/contact"
            className="text-sm font-semibold px-6 py-2.5 rounded-full text-white transition-all hover:shadow-lg hover:scale-105 active:scale-[0.97]"
            style={{ background: "#0891B2" }}
          >
            Demander une présentation
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white border-b shadow-xl py-6 px-6 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.label} to={item.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-gray-700">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-gray-700">
                  {item.label}
                </a>
              )
            )}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-3 px-4 text-sm font-bold text-white rounded-full text-center mt-2"
              style={{ background: "#0891B2" }}
            >
              Demander une présentation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
