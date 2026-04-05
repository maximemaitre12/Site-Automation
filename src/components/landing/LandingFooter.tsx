import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-white py-20" style={{ borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="font-heading text-lg font-bold" style={{ color: "#0F172A" }}>
              AETHER CONNECT
            </Link>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: "#64748B" }}>
              Cabinet de conseil spécialisé dans la transformation opérationnelle pharma.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Expertise</p>
            <div className="space-y-3 text-sm" style={{ color: "#475569" }}>
              <a href="#expertise" className="block hover:text-[#0891B2] transition-colors">Talent Pharma</a>
              <a href="#expertise" className="block hover:text-[#0891B2] transition-colors">GMP Operations</a>
              <a href="#expertise" className="block hover:text-[#0891B2] transition-colors">Regulatory Strategy</a>
              <a href="#expertise" className="block hover:text-[#0891B2] transition-colors">Quality Systems</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Company</p>
            <div className="space-y-3 text-sm" style={{ color: "#475569" }}>
              <a href="#team" className="block hover:text-[#0891B2] transition-colors">À propos</a>
              <a href="#case-study" className="block hover:text-[#0891B2] transition-colors">Cas d'étude</a>
              <Link to="/contact" className="block hover:text-[#0891B2] transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#94A3B8" }}>Contact</p>
            <a href="mailto:hello@aether-connect.com" className="block text-sm mb-2" style={{ color: "#475569" }}>
              hello@aether-connect.com
            </a>
            <p className="text-xs" style={{ color: "#94A3B8" }}>Lun–Ven: 9h–18h (CET)</p>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #E2E8F0" }}>
          <p className="text-xs" style={{ color: "#94A3B8" }}>© {new Date().getFullYear()} Aether Connect</p>
          <div className="flex gap-6 text-xs" style={{ color: "#94A3B8" }}>
            <span>ISO 27001</span>
            <span>21 CFR Part 11</span>
            <span>GMP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
