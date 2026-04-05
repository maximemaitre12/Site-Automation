import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white" style={{ borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="font-heading text-lg font-bold" style={{ color: "#0F172A" }}>AETHER CONNECT</Link>
            <p className="text-sm mt-3 mb-5 leading-relaxed" style={{ color: "#64748B" }}>
              Cabinet de conseil spécialisé dans la transformation opérationnelle pharma.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "#F1F5F9", color: "#64748B" }}>
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "#F1F5F9", color: "#64748B" }}>
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4" style={{ color: "#0F172A" }}>Expertise</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#64748B" }}>
              <li><a href="#expertise" className="hover:text-[#0891B2] transition-colors">Talent Pharma</a></li>
              <li><a href="#expertise" className="hover:text-[#0891B2] transition-colors">GMP Operations</a></li>
              <li><a href="#expertise" className="hover:text-[#0891B2] transition-colors">Regulatory Strategy</a></li>
              <li><a href="#expertise" className="hover:text-[#0891B2] transition-colors">Quality Systems</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4" style={{ color: "#0F172A" }}>Ressources</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#64748B" }}>
              <li><a href="#resources" className="hover:text-[#0891B2] transition-colors">Blog</a></li>
              <li><a href="#case-study" className="hover:text-[#0891B2] transition-colors">Cas d'étude</a></li>
              <li><a href="#faq" className="hover:text-[#0891B2] transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4" style={{ color: "#0F172A" }}>Contact</h4>
            <a href="mailto:hello@aether-connect.com" className="flex items-center gap-2 text-sm mb-3" style={{ color: "#64748B" }}>
              <Mail className="w-4 h-4" /> hello@aether-connect.com
            </a>
            <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>Lun-Ven: 9h-18h (CET)</p>
            <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#0891B2" }}>
              Demander un diagnostic →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #E2E8F0" }}>
          <p className="text-xs" style={{ color: "#94A3B8" }}>© {new Date().getFullYear()} Aether Connect. All rights reserved.</p>
          <div className="flex gap-4 text-xs" style={{ color: "#94A3B8" }}>
            <span>🔐 ISO 27001</span>
            <span>🏥 21 CFR Part 11</span>
            <span>⚕️ GMP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
