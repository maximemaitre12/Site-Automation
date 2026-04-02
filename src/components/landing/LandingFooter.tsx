import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer style={{ background: "#FAFBFC", borderTop: "1px solid #E8EFF8" }}>
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-heading text-lg font-bold" style={{ color: "#1A3A6B" }}>AETHER CONNECT</Link>
            <p className="text-sm mt-2 mb-4" style={{ color: "#4A5568" }}>
              Cabinet de conseil spécialisé dans la transformation opérationnelle pharma. Nous aidons les entreprises pharmaceutiques à scaler sans perdre la conformité.
            </p>
            <div className="flex gap-3">
              <a href="#" style={{ color: "#6B7C8C" }}><Linkedin className="w-5 h-5" /></a>
              <a href="#" style={{ color: "#6B7C8C" }}><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#1A3A6B" }}>Expertise</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#2C3E50" }}>
              <li><a href="#expertise" className="hover:opacity-70">Talent Pharma</a></li>
              <li><a href="#expertise" className="hover:opacity-70">GMP Operations</a></li>
              <li><a href="#expertise" className="hover:opacity-70">Regulatory Strategy</a></li>
              <li><a href="#expertise" className="hover:opacity-70">Quality Systems</a></li>
              <li><a href="#expertise" className="hover:opacity-70">Compliance Tech</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#1A3A6B" }}>Ressources</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#2C3E50" }}>
              <li><a href="#resources" className="hover:opacity-70">Blog</a></li>
              <li><a href="#resources" className="hover:opacity-70">Whitepapers</a></li>
              <li><a href="#resources" className="hover:opacity-70">Webinars</a></li>
              <li><a href="#case-study" className="hover:opacity-70">Cas d'étude</a></li>
              <li><a href="#faq" className="hover:opacity-70">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#1A3A6B" }}>Contact</h4>
            <a href="mailto:hello@aether-connect.com" className="flex items-center gap-2 text-sm mb-2" style={{ color: "#2C3E50" }}>
              <Mail className="w-4 h-4" /> hello@aether-connect.com
            </a>
            <p className="text-xs mt-3" style={{ color: "#6B7C8C" }}>Lun-Ven: 9h-18h (CET)</p>
            <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium mt-4" style={{ color: "#0D8B5E" }}>
              Demander un diagnostic →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #E8EFF8" }}>
          <p className="text-xs" style={{ color: "#6B7C8C" }}>© {new Date().getFullYear()} Aether Connect. All rights reserved.</p>
          <div className="flex gap-6 text-xs" style={{ color: "#6B7C8C" }}>
            <Link to="/legal/privacy" className="hover:opacity-70">Privacy Policy</Link>
            <Link to="/legal/terms" className="hover:opacity-70">Terms</Link>
            <Link to="/legal/security" className="hover:opacity-70">Accessibility</Link>
          </div>
          <div className="flex gap-3 text-xs" style={{ color: "#6B7C8C" }}>
            <span>🔐 ISO 27001</span>
            <span>🏥 21 CFR Part 11</span>
            <span>⚕️ GMP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
