import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-white py-20" style={{ borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="font-heading text-lg font-bold" style={{ color: "#0F172A" }}>
              AETHER GROUP
            </Link>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: "#64748B" }}>
              Consulting firm specializing in AI-driven operational transformation for pharma.
            </p>
            <div className="mt-4 space-y-1 text-xs" style={{ color: "#94A3B8" }}>
              <p>SIREN : 104 445 424</p>
              <p>66 Av. des Champs-Élysées, 75008 Paris</p>
              <p>TVA non applicable — art. 293 B du CGI</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Expertise</p>
            <div className="space-y-3 text-sm" style={{ color: "#475569" }}>
              <a href="#expertise" className="block hover:text-[#1E4D8C] transition-colors">Talent Pharma</a>
              <a href="#expertise" className="block hover:text-[#1E4D8C] transition-colors">GMP Operations</a>
              <a href="#expertise" className="block hover:text-[#1E4D8C] transition-colors">Regulatory Strategy</a>
              <a href="#expertise" className="block hover:text-[#1E4D8C] transition-colors">Quality Systems</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Company</p>
            <div className="space-y-3 text-sm" style={{ color: "#475569" }}>
              <a href="#team" className="block hover:text-[#1E4D8C] transition-colors">About</a>
              <a href="#case-study" className="block hover:text-[#1E4D8C] transition-colors">Case Study</a>
              <Link to="/bracelet" className="block hover:text-[#1E4D8C] transition-colors">Oreon</Link>
              <Link to="/contact" className="block hover:text-[#1E4D8C] transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Contact</p>
            <a href="mailto:youriy.strashnyi@edu.em-lyon.com" className="block text-sm mb-2 hover:text-[#1E4D8C] transition-colors" style={{ color: "#475569" }}>
              youriy.strashnyi@edu.em-lyon.com
            </a>
            <a href="mailto:contact@aether-connect.com" className="block text-sm mb-3 hover:text-[#1E4D8C] transition-colors" style={{ color: "#475569" }}>
              contact@aether-connect.com
            </a>
            <a href="tel:+33787248402" className="block text-sm hover:text-[#1E4D8C] transition-colors" style={{ color: "#475569" }}>
              +33 7 87 24 84 02
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #E2E8F0" }}>
          <p className="text-xs" style={{ color: "#94A3B8" }}>© {new Date().getFullYear()} AETHER Group — SIREN 104 445 424</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ color: "#94A3B8" }}>
            <Link to="/legal/mentions" className="hover:text-[#1E4D8C] transition-colors">Mentions légales</Link>
            <Link to="/legal/privacy" className="hover:text-[#1E4D8C] transition-colors">Politique de confidentialité</Link>
            <Link to="/legal/terms" className="hover:text-[#1E4D8C] transition-colors">CGU</Link>
            <span>ISO 27001</span>
            <span>21 CFR Part 11</span>
            <span>GMP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
