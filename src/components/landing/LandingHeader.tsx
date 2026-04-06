import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import aetherLogo from "@/assets/aether-logo-final.png";

const navItems = [
  { label: "Expertise", href: "#expertise" },
  { label: "Case Study", href: "#case-study" },
  { label: "About", href: "#team" },
  { label: "Contact", href: "/contact" },
];

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isContactPage = location.pathname === "/contact";
  const isLandingPage = location.pathname === "/" || location.pathname === "/index";
  const useDarkMode = scrolled || isContactPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHashClick = useCallback((href: string) => {
    setIsMenuOpen(false);
    if (isLandingPage) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "instant" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "instant" });
      }, 300);
    }
  }, [isLandingPage, navigate]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(scrolled || isContactPage) ? "shadow-sm backdrop-blur-md" : ""}`}
      style={{
        background: (scrolled || isContactPage) ? "rgba(255,255,255,0.95)" : "transparent",
        height: 80,
      }}
    >
      <div className="h-full flex items-center justify-between px-0">
        <Link to="/" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }} className="flex items-center shrink-0 ml-4">
          <img
            src={aetherLogo}
            alt="Aether Connect"
            className="h-11 w-auto transition-all duration-500"
            style={{
              filter: (!isContactPage && !scrolled)
                ? "brightness(0) invert(1)"
                : "brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(800%) hue-rotate(195deg)"
            }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium transition-colors ${useDarkMode ? "text-gray-700 hover:text-[#1E4D8C]" : "text-white/80 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => handleHashClick(item.href)}
                className={`text-sm font-medium transition-colors ${useDarkMode ? "text-gray-700 hover:text-[#1E4D8C]" : "text-white/80 hover:text-white"}`}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/auth?mode=login&redirect=/farmasoft"
            className={`text-sm font-medium transition-colors ${useDarkMode ? "text-gray-600 hover:text-[#1E4D8C]" : "text-white/70 hover:text-white"}`}
          >
            Log in
          </Link>
          <Link
            to="/contact"
            className="text-sm font-semibold px-6 py-2.5 text-white transition-all hover:opacity-90"
            style={{ background: "#1E4D8C" }}
          >
            Book a Demo
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className={`w-6 h-6 ${useDarkMode ? "text-gray-700" : "text-white"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${useDarkMode ? "text-gray-700" : "text-white"}`} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg py-6 px-6">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.label} to={item.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-gray-700">
                  {item.label}
                </Link>
              ) : (
                <button key={item.label} onClick={() => { handleHashClick(item.href); setIsMenuOpen(false); }} className="text-sm font-medium py-2 text-gray-700 text-left">
                  {item.label}
                </button>
              )
            )}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-3 px-4 text-sm font-bold text-white text-center mt-2"
              style={{ background: "#1E4D8C" }}
            >
              Book a Demo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
